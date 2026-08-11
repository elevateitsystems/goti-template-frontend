import "server-only";

import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";

import { ApiError, failure } from "@/server/api";
import { authRoutes } from "@/server/routes/auth";
import { billingRoutes } from "@/server/routes/billing";
import { contentRoutes, reviewRoutes } from "@/server/routes/content";
import { notificationRoutes } from "@/server/routes/notifications";
import { playsRoutes } from "@/server/routes/plays";
import { sportsRoutes } from "@/server/routes/sports";

type RouteContext = { params: { path: string[] } };

export async function dispatch(request: NextRequest, context: RouteContext) {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();
  const path = context.params.path ?? [];
  try {
    const handlers = [authRoutes, billingRoutes, playsRoutes, contentRoutes, reviewRoutes, notificationRoutes, sportsRoutes];
    for (const handler of handlers) {
      const response = await handler(request, path);
      if (response) {
        response.headers.set("x-request-id", requestId);
        return response;
      }
    }
    throw new ApiError(404, "API route not found", "NOT_FOUND");
  } catch (error) {
    const response = failure(error, requestId);
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
