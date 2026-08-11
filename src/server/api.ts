import "server-only";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "API_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

interface ResponseOptions {
  metadata?: Record<string, unknown>;
  requestId?: string;
  status?: number;
  pagination?: Record<string, number | boolean>;
}

export function success<T>(message: string, data?: T, options: ResponseOptions = {}) {
  const { metadata, pagination, requestId = randomUUID(), status = 200 } = options;
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data === undefined ? {} : { data }),
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        ...(pagination ? { pagination } : {}),
        ...metadata,
      },
    },
    { status },
  );
}

export function failure(error: unknown, requestId: string = randomUUID()) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        error: { code: "VALIDATION_ERROR", details: error.flatten() },
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: 400 },
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: { code: error.code, ...(error.details ? { details: error.details } : {}) },
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: error.status },
    );
  }

  const databaseError = error as { code?: string };
  if (databaseError?.code === "P2002") {
    return failure(new ApiError(409, "A record with these values already exists", "CONFLICT"), requestId);
  }
  if (databaseError?.code === "P2025") {
    return failure(new ApiError(404, "Resource not found", "NOT_FOUND"), requestId);
  }

  console.error("Unhandled API error", error);
  return NextResponse.json(
    {
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      meta: { requestId, timestamp: new Date().toISOString() },
    },
    { status: 500 },
  );
}

export function pagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
  return { page, limit, skip: (page - 1) * limit };
}

export function paginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

const PRIVATE_FIELDS = new Set([
  "password",
  "avatarPublicId",
  "imageKey",
  "thumbnailKey",
  "mediaKey",
  "photoKey",
  "screenshotKey",
]);

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value instanceof Date || value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !PRIVATE_FIELDS.has(key))
      .map(([key, nested]) => [key, sanitizeValue(nested)]),
  );
}

export function publicRecord(record: Record<string, unknown>) {
  return sanitizeValue(record) as Record<string, unknown>;
}

export async function requestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fields: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue;
      if (["features", "parlayLegs", "playIds", "cardIds", "legNotes"].includes(key)) {
        try {
          fields[key] = JSON.parse(value);
        } catch {
          fields[key] = value;
        }
      } else {
        fields[key] = value;
      }
    }
    return { fields, formData };
  }
  return { fields: (await request.json()) as Record<string, unknown> };
}

export function booleanValue(value: unknown) {
  if (typeof value === "boolean") return value;
  return value === "true" || value === "1";
}

export function numberValue(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
