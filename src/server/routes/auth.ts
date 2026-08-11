import "server-only";

import bcrypt from "bcrypt";
import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, pagination, paginationMeta, publicRecord, requestBody, success } from "@/server/api";
import { requireAdmin, requireUser, signToken, tokenFromRequest, verifyToken } from "@/server/auth";
import { prisma } from "@/server/db";
import { sendOtp, verifyOtp } from "@/server/otp";
import { deleteUpload, optionalFile, uploadImage } from "@/server/upload";

const email = z.string().trim().email().transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128);
const registerSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  username: z.string().trim().min(3).max(50).optional(),
});
const loginSchema = z.object({ email, password: z.string().min(1) });
const otpSchema = z.object({ email, code: z.coerce.string().length(6) });
const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  username: z.string().trim().min(3).max(50).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
});

function safeUser(user: unknown) {
  return publicRecord(user as Record<string, unknown>);
}

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function authRoutes(request: NextRequest, path: string[]) {
  if (path[0] !== "auth") return null;
  const action = path[1] ?? "";

  if (request.method === "POST" && action === "register") {
    const { fields, formData } = await requestBody(request);
    const input = registerSchema.parse(fields);
    const duplicate = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, ...(input.username ? [{ username: input.username }] : [])] },
      select: { id: true },
    });
    if (duplicate) throw new ApiError(409, "Email or username is already registered", "CONFLICT");
    const avatar = optionalFile(formData, "avatar");
    const uploaded = avatar ? await uploadImage(avatar, true) : undefined;
    try {
      const user = await prisma.user.create({
        data: {
          ...input,
          password: await bcrypt.hash(input.password, 12),
          displayName: `${input.firstName} ${input.lastName}`,
          ...(uploaded ? { avatarUrl: uploaded.url, avatarPublicId: uploaded.key } : {}),
        },
      });
      await sendOtp(user.email, "email_verification", user.id);
      const { token } = signToken({ id: user.id, email: user.email, role: user.role });
      const response = success(
        "User registered successfully",
        { message: "Registration successful. Please check your email for verification.", requiresVerification: true, token },
        { status: 201 },
      );
      setAuthCookie(response, token);
      return response;
    } catch (error) {
      if (uploaded) await deleteUpload(uploaded.key);
      throw error;
    }
  }

  if (request.method === "POST" && action === "login") {
    const input = loginSchema.parse((await requestBody(request)).fields);
    const user = await prisma.user.findFirst({ where: { email: input.email, isDeleted: false } });
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new ApiError(401, "Invalid email or password", "UNAUTHENTICATED");
    }
    if (["inactive", "suspended"].includes(user.status)) {
      throw new ApiError(403, `Account is ${user.status}`, "ACCOUNT_DISABLED");
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const auth = signToken({ id: user.id, email: user.email, role: user.role });
    const response = success("Login successful", { user: safeUser(user), ...auth });
    setAuthCookie(response, auth.token);
    return response;
  }

  if (request.method === "POST" && action === "verify-email") {
    const input = otpSchema.parse((await requestBody(request)).fields);
    const user = await prisma.user.findFirst({ where: { email: input.email, isDeleted: false } });
    if (!user) throw new ApiError(404, "User not found", "NOT_FOUND");
    if (user.status === "active") throw new ApiError(400, "Email is already verified", "ALREADY_VERIFIED");
    await verifyOtp(input.email, "email_verification", input.code);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { status: "active", emailVerifiedAt: new Date() },
    });
    const auth = signToken({ id: updated.id, email: updated.email, role: updated.role });
    const response = success("Email verification successful", { user: safeUser(updated), ...auth });
    setAuthCookie(response, auth.token);
    return response;
  }

  if (request.method === "POST" && action === "resend-email-verification") {
    const input = z.object({ email }).parse((await requestBody(request)).fields);
    const user = await prisma.user.findFirst({ where: { email: input.email, isDeleted: false } });
    if (!user) throw new ApiError(404, "User not found", "NOT_FOUND");
    if (user.status === "active") throw new ApiError(400, "Email is already verified", "ALREADY_VERIFIED");
    await sendOtp(user.email, "email_verification", user.id);
    return success("Verification email sent successfully", { message: "Verification code sent to your email" });
  }

  if (request.method === "POST" && action === "forgot-password") {
    const input = z.object({ email }).parse((await requestBody(request)).fields);
    const user = await prisma.user.findFirst({ where: { email: input.email, status: "active", isDeleted: false } });
    if (user) await sendOtp(user.email, "password_reset", user.id);
    return success("Password reset instructions sent", {
      message: "If an account with this email exists, you will receive a password reset code.",
    });
  }

  if (request.method === "POST" && action === "verify-reset-password-OTP") {
    const input = otpSchema.parse((await requestBody(request)).fields);
    await verifyOtp(input.email, "password_reset", input.code);
    return success("Password reset code verified", { message: "Code verified. You can now reset your password." });
  }

  if (request.method === "POST" && action === "reset-password") {
    const input = z.object({ email, newPassword: password }).parse((await requestBody(request)).fields);
    const user = await prisma.user.findFirst({ where: { email: input.email, isDeleted: false } });
    if (!user) throw new ApiError(404, "User not found", "NOT_FOUND");
    const verified = await prisma.oTP.findFirst({
      where: { identifier: input.email, type: "password_reset", verified: true, expiresAt: { gt: new Date() } },
    });
    if (!verified) throw new ApiError(400, "Password reset code is not verified or has expired", "INVALID_OTP");
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(input.newPassword, 12) } }),
      prisma.oTP.deleteMany({ where: { identifier: input.email, type: "password_reset" } }),
    ]);
    return success("Password reset successfully", { message: "Password reset successfully. You can now log in." });
  }

  if (request.method === "POST" && action === "verify") {
    await requireUser(request);
    const token = tokenFromRequest(request);
    if (!token) throw new ApiError(400, "Token is required", "TOKEN_REQUIRED");
    const payload = verifyToken(token);
    return success("Token is valid", { userId: payload.id, email: payload.email, role: payload.role });
  }

  if (request.method === "POST" && action === "refresh") {
    const body = (await requestBody(request)).fields;
    const current = typeof body.token === "string" ? body.token : tokenFromRequest(request);
    if (!current) throw new ApiError(400, "Token is required", "TOKEN_REQUIRED");
    const payload = verifyToken(current);
    const auth = signToken({ id: payload.id, email: payload.email, role: payload.role });
    const response = success("Token refreshed successfully", auth);
    setAuthCookie(response, auth.token);
    return response;
  }

  if (request.method === "GET" && action === "profile") {
    const auth = await requireUser(request);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.id } });
    return success("Profile retrieved successfully", safeUser(user));
  }

  if (request.method === "POST" && action === "logout") {
    await requireUser(request);
    const response = success("Logout successful");
    response.cookies.delete("auth_token");
    return response;
  }

  if (request.method === "POST" && action === "change-password") {
    const auth = await requireUser(request);
    const input = z.object({ currentPassword: z.string(), newPassword: password }).parse((await requestBody(request)).fields);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.id } });
    if (!(await bcrypt.compare(input.currentPassword, user.password))) {
      throw new ApiError(401, "Current password is incorrect", "UNAUTHENTICATED");
    }
    await prisma.user.update({ where: { id: auth.id }, data: { password: await bcrypt.hash(input.newPassword, 12) } });
    return success("Password changed successfully", { message: "Password changed successfully" });
  }

  if (request.method === "PATCH" && action === "update-profile") {
    const auth = await requireUser(request);
    const input = updateProfileSchema.parse((await requestBody(request)).fields);
    const current = await prisma.user.findUniqueOrThrow({ where: { id: auth.id } });
    const updated = await prisma.user.update({
      where: { id: auth.id },
      data: {
        ...input,
        displayName: `${input.firstName ?? current.firstName} ${input.lastName ?? current.lastName}`,
      },
    });
    return success("Profile updated successfully", safeUser(updated));
  }

  if (request.method === "GET" && action === "users") {
    await requireAdmin(request);
    const { page, limit, skip } = pagination(request.nextUrl.searchParams);
    const search = request.nextUrl.searchParams.get("search")?.trim();
    const where = {
      isDeleted: false,
      ...(search
        ? { OR: [{ email: { contains: search, mode: "insensitive" as const } }, { firstName: { contains: search, mode: "insensitive" as const } }, { lastName: { contains: search, mode: "insensitive" as const } }] }
        : {}),
    };
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);
    return success("Users retrieved successfully", users.map(safeUser), {
      pagination: paginationMeta(page, limit, total),
    });
  }

  if (request.method === "PUT" && action === "users" && path[3] === "role") {
    await requireAdmin(request);
    const role = z.object({ role: z.enum(["admin", "user"]) }).parse((await requestBody(request)).fields).role;
    const user = await prisma.user.update({ where: { id: path[2] }, data: { role } });
    return success("User role updated successfully", safeUser(user));
  }

  if (request.method === "GET" && action === "stats") {
    await requireAdmin(request);
    const [totalUsers, activeUsers, pendingUsers, adminUsers] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { isDeleted: false, status: "active" } }),
      prisma.user.count({ where: { isDeleted: false, status: "pending_verification" } }),
      prisma.user.count({ where: { isDeleted: false, role: "admin" } }),
    ]);
    return success("Authentication statistics retrieved successfully", { totalUsers, activeUsers, pendingUsers, adminUsers });
  }

  throw new ApiError(404, "Authentication route not found", "NOT_FOUND");
}
