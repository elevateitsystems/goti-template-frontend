import "server-only";

import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import type { UserRole } from "@/generated/prisma/client";
import { ApiError } from "@/server/api";
import { prisma } from "@/server/db";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export function hasActiveMembershipAccess(
  subscription: { status: string; paymentStatus: string; accessUntil: Date | null },
  now = new Date(),
) {
  return (
    ["active", "canceled"].includes(subscription.status) &&
    subscription.paymentStatus === "paid" &&
    subscription.accessUntil !== null &&
    subscription.accessUntil > now
  );
}

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export function signToken(user: AuthUser) {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";
  const token = jwt.sign(user, jwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    issuer: process.env.JWT_ISSUER ?? "propedge",
  });
  return { token, expiresIn };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret(), {
      issuer: process.env.JWT_ISSUER ?? "propedge",
    }) as AuthUser & jwt.JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token", "UNAUTHENTICATED");
  }
}

export function tokenFromRequest(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  if (authorization) return authorization;
  return request.cookies.get("auth_token")?.value ?? request.cookies.get("token")?.value ?? null;
}

export async function requireUser(request: NextRequest) {
  const token = tokenFromRequest(request);
  if (!token) throw new ApiError(401, "Authentication token is required", "UNAUTHENTICATED");
  const payload = verifyToken(token);
  const user = await prisma.user.findFirst({
    where: { id: payload.id, isDeleted: false },
    select: { id: true, email: true, role: true, status: true },
  });
  if (!user) throw new ApiError(401, "User account no longer exists", "UNAUTHENTICATED");
  if (user.status === "suspended" || user.status === "inactive") {
    throw new ApiError(403, `Account is ${user.status}`, "ACCOUNT_DISABLED");
  }
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireUser(request);
  if (user.role !== "admin") throw new ApiError(403, "Administrator access is required", "FORBIDDEN");
  return user;
}

export async function requireMember(request: NextRequest) {
  const user = await requireUser(request);
  if (user.role === "admin") return user;
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: { in: ["active", "canceled"] },
      paymentStatus: "paid",
      isDeleted: false,
    },
    select: { status: true, paymentStatus: true, accessUntil: true },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription || !hasActiveMembershipAccess(subscription)) {
    throw new ApiError(403, "An active PrimeIQ membership is required", "MEMBERSHIP_REQUIRED");
  }
  return user;
}
