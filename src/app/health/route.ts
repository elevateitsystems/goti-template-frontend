import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = randomUUID();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version ?? "0.1.0",
      requestId,
    });
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json(
      { status: "unhealthy", timestamp: new Date().toISOString(), requestId },
      { status: 503 },
    );
  }
}
