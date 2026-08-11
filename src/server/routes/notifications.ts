import "server-only";

import type { NotificationCategory, Prisma } from "@/generated/prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { requestBody, success } from "@/server/api";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";

const categories = ["daily_primeiq", "play_updates", "review_responses"] as const;
const preferenceSchema = z.object({
  daily_primeiq: z.boolean().optional(),
  play_updates: z.boolean().optional(),
  review_responses: z.boolean().optional(),
});

export const categoryDefaults = {
  daily_primeiq: false,
  play_updates: true,
  review_responses: true,
} satisfies Record<NotificationCategory, boolean>;

export function preferenceResponse(rows: Array<{ category: NotificationCategory; emailEnabled: boolean }>) {
  const saved = new Map(rows.map((row) => [row.category, row.emailEnabled]));
  return Object.fromEntries(
    categories.map((category) => [category, saved.get(category) ?? categoryDefaults[category]]),
  );
}

export async function notificationRoutes(request: NextRequest, path: string[]) {
  if (path[0] !== "member" || path[1] !== "notification-preferences") return null;
  const user = await requireUser(request);

  if (request.method === "GET") {
    const rows = await prisma.notificationPreference.findMany({ where: { userId: user.id } });
    return success("Notification preferences retrieved", preferenceResponse(rows));
  }

  if (request.method === "PATCH") {
    const input = preferenceSchema.parse((await requestBody(request)).fields);
    const updates = Object.entries(input) as Array<[NotificationCategory, boolean]>;
    if (updates.length) {
      await prisma.$transaction(
        updates.map(([category, emailEnabled]) =>
          prisma.notificationPreference.upsert({
            where: { userId_category: { userId: user.id, category } },
            create: { userId: user.id, category, emailEnabled },
            update: { emailEnabled },
          }),
        ) as Prisma.PrismaPromise<unknown>[],
      );
    }
    const rows = await prisma.notificationPreference.findMany({ where: { userId: user.id } });
    return success("Notification preferences updated", preferenceResponse(rows));
  }

  return null;
}
