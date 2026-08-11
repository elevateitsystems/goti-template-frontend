import "server-only";

import { randomInt } from "crypto";

import type { OTPType } from "@/generated/prisma/client";
import { ApiError } from "@/server/api";
import { prisma } from "@/server/db";
import { otpEmail, sendEmail } from "@/server/email";

const EXPIRY_MINUTES = 15;
const MAX_ATTEMPTS = 3;
const MAX_SENDS_PER_HOUR = 5;
const RESEND_COOLDOWN_MS = 60_000;

export async function cleanupExpiredOtps() {
  await prisma.oTP.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

export async function sendOtp(identifier: string, type: OTPType, userId?: string) {
  await cleanupExpiredOtps();
  const now = Date.now();
  const since = new Date(now - 60 * 60 * 1000);
  const recent = await prisma.oTP.findMany({
    where: { identifier, type, createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  if (recent.length >= MAX_SENDS_PER_HOUR) {
    throw new ApiError(429, "Too many verification codes requested", "RATE_LIMITED");
  }
  if (recent[0] && now - recent[0].createdAt.getTime() < RESEND_COOLDOWN_MS) {
    throw new ApiError(429, "Please wait before requesting another code", "RATE_LIMITED");
  }

  await prisma.oTP.deleteMany({ where: { identifier, type } });
  const code = randomInt(100_000, 1_000_000);
  const expiresAt = new Date(now + EXPIRY_MINUTES * 60_000);
  const otp = await prisma.oTP.create({
    data: { identifier, type, code, expiresAt, userId },
  });
  try {
    const message = otpEmail(code, type.replaceAll("_", " "), expiresAt);
    await sendEmail(identifier, message.subject, message.text, message.html);
  } catch (error) {
    await prisma.oTP.delete({ where: { id: otp.id } });
    throw error;
  }
  return { success: true, expiresAt, attemptsRemaining: MAX_ATTEMPTS };
}

export async function verifyOtp(identifier: string, type: OTPType, code: string) {
  await cleanupExpiredOtps();
  const numericCode = Number(code);
  if (!Number.isInteger(numericCode) || numericCode < 100_000 || numericCode > 999_999) {
    throw new ApiError(400, "Enter a valid six-digit code", "INVALID_OTP");
  }
  const otp = await prisma.oTP.findFirst({
    where: { identifier, type, verified: false },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) throw new ApiError(400, "Invalid or expired verification code", "INVALID_OTP");
  if (otp.code !== numericCode) {
    const attempts = otp.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await prisma.oTP.delete({ where: { id: otp.id } });
      throw new ApiError(400, "Maximum verification attempts exceeded", "INVALID_OTP");
    }
    await prisma.oTP.update({ where: { id: otp.id }, data: { attempts } });
    throw new ApiError(400, `Invalid code. ${MAX_ATTEMPTS - attempts} attempts remaining`, "INVALID_OTP");
  }
  if (type === "password_reset" || type === "two_factor") {
    await prisma.oTP.update({ where: { id: otp.id }, data: { verified: true } });
  } else {
    await prisma.oTP.delete({ where: { id: otp.id } });
  }
  return otp;
}
