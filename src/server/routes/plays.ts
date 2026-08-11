import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { ApiError, booleanValue, numberValue, pagination, paginationMeta, publicRecord, requestBody, success } from "@/server/api";
import { requireAdmin, requireMember } from "@/server/auth";
import { prisma } from "@/server/db";
import { notifyActiveMembers } from "@/server/notifications";
import { publishDueContent } from "@/server/publishing";
import { parseEasternDateTime } from "@/server/time";
import { deleteUpload, optionalFile, uploadImage } from "@/server/upload";

const optionalText = z.string().trim().nullable().optional();
const legSchema = z.object({
  participantType: z.enum(["player", "team"]).nullable().optional(),
  participantName: z.string().trim().min(1),
  team: optionalText,
  opponent: optionalText,
  sport: z.string().trim().min(1),
  league: z.string().trim().min(1),
  market: z.string().trim().min(1),
  betType: z.string().trim().min(1),
  line: z.coerce.number().nullable().optional(),
  odds: z.coerce.number().int().nullable().optional(),
  sportsbook: optionalText,
  result: z.enum(["pending", "win", "loss", "push"]).default("pending"),
});
const playSchema = z.object({
  participantType: z.enum(["player", "team"]).nullable().optional(),
  participantName: optionalText,
  team: optionalText,
  opponent: optionalText,
  sport: optionalText,
  league: optionalText,
  market: optionalText,
  betType: optionalText,
  line: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  odds: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  sportsbook: optionalText,
  confidence: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  projection: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  edge: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  hitRate: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  hitFraction: optionalText,
  analysis: optionalText,
  isTopPlay: z.unknown().optional().transform(booleanValue),
  isFeatured: z.unknown().optional().transform(booleanValue),
  isBestBet: z.unknown().optional().transform(booleanValue),
  isCurrentFree: z.unknown().optional().transform(booleanValue),
  accessLevel: z.enum(["free", "members_only"]).default("members_only"),
  contentType: z.enum(["straight", "parlay", "avoid"]).default("straight"),
  displayOrder: z.coerce.number().int().default(0),
  cardId: z.string().uuid().nullable().optional(),
  publicationStatus: z.enum(["draft", "scheduled", "published", "archived"]).default("draft"),
  scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform(parseEasternDateTime),
  freeOnDate: z.union([z.string(), z.date(), z.null()]).optional().transform((value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }),
  updateNote: optionalText,
  finalResultDetail: optionalText,
  result: z.enum(["pending", "win", "loss", "push"]).default("pending"),
  parlayLegs: z.array(legSchema).default([]),
  removeImage: z.unknown().optional().transform(booleanValue),
});

const playInclude = {
  parlayLegs: { orderBy: { displayOrder: "asc" as const } },
  updates: { orderBy: { createdAt: "desc" as const } },
  videoAttachments: { include: { video: true } },
};

function safePlay(play: unknown) {
  const record = publicRecord(play as Record<string, unknown>);
  const attachments = record.videoAttachments;
  return {
    ...record,
    ...(Array.isArray(attachments)
      ? { videos: attachments.map((item) => publicRecord((item as { video: Record<string, unknown> }).video)) }
      : {}),
  };
}

function playWhere(searchParams: URLSearchParams, publishedOnly = false) {
  const sport = searchParams.get("sport");
  const league = searchParams.get("league");
  const result = searchParams.get("result");
  const contentType = searchParams.get("contentType");
  const publicationStatus = searchParams.get("publicationStatus");
  const search = searchParams.get("search")?.trim();
  return {
    isDeleted: false,
    ...(publishedOnly ? { publicationStatus: "published" as const } : {}),
    ...(sport ? { sport } : {}),
    ...(league ? { league } : {}),
    ...(result && ["pending", "win", "loss", "push"].includes(result) ? { result: result as "pending" | "win" | "loss" | "push" } : {}),
    ...(contentType && ["straight", "parlay", "avoid"].includes(contentType) ? { contentType: contentType as "straight" | "parlay" | "avoid" } : {}),
    ...(publicationStatus && ["draft", "scheduled", "published", "archived"].includes(publicationStatus)
      ? { publicationStatus: publicationStatus as "draft" | "scheduled" | "published" | "archived" }
      : {}),
    ...(search
      ? { OR: [{ participantName: { contains: search, mode: "insensitive" as const } }, { team: { contains: search, mode: "insensitive" as const } }, { analysis: { contains: search, mode: "insensitive" as const } }] }
      : {}),
  };
}

export async function playsRoutes(request: NextRequest, path: string[]) {
  if (request.method === "GET") await publishDueContent();
  if (path[0] === "plays" && request.method === "GET") {
    const { page, limit, skip } = pagination(request.nextUrl.searchParams);
    const where = { ...playWhere(request.nextUrl.searchParams, true), accessLevel: "free" as const };
    const [plays, total] = await Promise.all([
      prisma.play.findMany({ where, include: playInclude, skip, take: limit, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }] }),
      prisma.play.count({ where }),
    ]);
    return success("Plays retrieved successfully", plays.map(safePlay), { pagination: paginationMeta(page, limit, total) });
  }

  if (path[0] === "member" && path[1] === "plays" && request.method === "GET") {
    await requireMember(request);
    const { page, limit, skip } = pagination(request.nextUrl.searchParams);
    const where = playWhere(request.nextUrl.searchParams, true);
    const [plays, total] = await Promise.all([
      prisma.play.findMany({ where, include: playInclude, skip, take: limit, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }] }),
      prisma.play.count({ where }),
    ]);
    return success("Member plays retrieved successfully", plays.map(safePlay), { pagination: paginationMeta(page, limit, total) });
  }

  if (path[0] !== "admin" || path[1] !== "plays") return null;
  const admin = await requireAdmin(request);
  const id = path[2];
  if (request.method === "GET" && id === "options") {
    const rows = await prisma.play.findMany({
      where: { isDeleted: false, sport: { not: null } },
      select: { sport: true, league: true },
      distinct: ["sport", "league"],
      orderBy: [{ sport: "asc" }, { league: "asc" }],
    });
    const grouped = new Map<string, Set<string>>();
    for (const row of rows) {
      if (!row.sport) continue;
      const leagues = grouped.get(row.sport) ?? new Set<string>();
      if (row.league) leagues.add(row.league);
      grouped.set(row.sport, leagues);
    }
    return success("Play options retrieved successfully", [...grouped].map(([sport, leagues]) => ({ sport, leagues: [...leagues] })));
  }
  if (request.method === "GET" && id) {
    const play = await prisma.play.findFirst({ where: { id, isDeleted: false }, include: playInclude });
    if (!play) throw new ApiError(404, "Play not found", "NOT_FOUND");
    return success("Play retrieved successfully", safePlay(play));
  }
  if (request.method === "GET") {
    const { page, limit, skip } = pagination(request.nextUrl.searchParams);
    const where = playWhere(request.nextUrl.searchParams);
    const [plays, total] = await Promise.all([
      prisma.play.findMany({ where, include: playInclude, skip, take: limit, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.play.count({ where }),
    ]);
    return success("Plays retrieved successfully", plays.map(safePlay), { pagination: paginationMeta(page, limit, total) });
  }

  if (request.method === "POST") {
    const { fields, formData } = await requestBody(request);
    const { parlayLegs, removeImage: _removeImage, updateNote, ...input } = playSchema.parse(fields);
    if (input.publicationStatus === "scheduled" && !input.scheduledAt) {
      throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
    }
    const file = optionalFile(formData, "image");
    const uploaded = file ? await uploadImage(file) : undefined;
    try {
      const play = await prisma.$transaction(async (transaction) => {
        if (input.freeOnDate) {
          await transaction.play.updateMany({
            where: { freeOnDate: input.freeOnDate, isDeleted: false },
            data: { freeOnDate: null, isCurrentFree: false },
          });
        }
        return transaction.play.create({
          data: {
            ...input,
            odds: input.odds === null ? null : input.odds === undefined ? undefined : Math.trunc(input.odds),
            confidence: input.confidence === null ? null : input.confidence === undefined ? undefined : Math.trunc(input.confidence),
            createdById: admin.id,
            publishedAt: input.publicationStatus === "published" ? new Date() : null,
            originalLine: input.publicationStatus === "published" ? input.line : null,
            originalOdds:
              input.publicationStatus === "published" && input.odds !== null && input.odds !== undefined
                ? Math.trunc(input.odds)
                : null,
            latestUpdateNote: updateNote,
            isCurrentFree: Boolean(input.freeOnDate),
            ...(uploaded ? { imageUrl: uploaded.url, imageKey: uploaded.key } : {}),
            ...(parlayLegs.length ? { parlayLegs: { create: parlayLegs.map((leg, displayOrder) => ({ ...leg, displayOrder })) } } : {}),
          },
          include: playInclude,
        });
      });
      return success("Play created successfully", safePlay(play), { status: 201 });
    } catch (error) {
      if (uploaded) await deleteUpload(uploaded.key);
      throw error;
    }
  }

  if (!id) throw new ApiError(404, "Play not found", "NOT_FOUND");
  const existing = await prisma.play.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw new ApiError(404, "Play not found", "NOT_FOUND");
  if (request.method === "PATCH") {
    const { fields, formData } = await requestBody(request);
    const { parlayLegs, removeImage, updateNote, ...input } = playSchema.partial().parse(fields);
    if (input.publicationStatus === "scheduled" && !(input.scheduledAt ?? existing.scheduledAt)) {
      throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
    }
    const nextLine = input.line === undefined ? existing.line : input.line;
    const nextOdds =
      input.odds === undefined ? existing.odds : input.odds === null ? null : Math.trunc(input.odds);
    const materialUpdate =
      existing.publishedAt !== null &&
      ((input.line !== undefined && nextLine !== existing.line) ||
        (input.odds !== undefined && nextOdds !== existing.odds));
    if (materialUpdate && !updateNote?.trim()) {
      throw new ApiError(400, "An update note is required when changing a published line or odds", "UPDATE_NOTE_REQUIRED");
    }
    const file = optionalFile(formData, "image");
    const uploaded = file ? await uploadImage(file) : undefined;
    try {
      const play = await prisma.$transaction(async (transaction) => {
        if (parlayLegs) {
          await transaction.parlayLeg.deleteMany({ where: { playId: id } });
        }
        if (input.freeOnDate) {
          await transaction.play.updateMany({
            where: { freeOnDate: input.freeOnDate, id: { not: id }, isDeleted: false },
            data: { freeOnDate: null, isCurrentFree: false },
          });
        }
        return transaction.play.update({
          where: { id },
          data: {
            ...input,
            odds: input.odds === null ? null : input.odds === undefined ? undefined : Math.trunc(input.odds),
            confidence: input.confidence === null ? null : input.confidence === undefined ? undefined : Math.trunc(input.confidence),
            ...(input.publicationStatus === "published" && existing.publicationStatus !== "published" ? { publishedAt: new Date() } : {}),
            ...(input.publicationStatus === "published" && existing.publicationStatus !== "published"
              ? { originalLine: nextLine, originalOdds: nextOdds, scheduledAt: null }
              : {}),
            ...(input.result && input.result !== "pending" && existing.result === "pending" ? { settledAt: new Date() } : {}),
            ...(input.freeOnDate !== undefined ? { isCurrentFree: Boolean(input.freeOnDate) } : {}),
            ...(updateNote !== undefined ? { latestUpdateNote: updateNote } : {}),
            ...(uploaded ? { imageUrl: uploaded.url, imageKey: uploaded.key } : removeImage ? { imageUrl: null, imageKey: null } : {}),
            ...(parlayLegs?.length ? { parlayLegs: { create: parlayLegs.map((leg, displayOrder) => ({ ...leg, displayOrder })) } } : {}),
            ...(materialUpdate
              ? { updates: { create: { createdById: admin.id, message: updateNote!.trim(), previousLine: existing.line, newLine: nextLine, previousOdds: existing.odds, newOdds: nextOdds } } }
              : {}),
          },
          include: playInclude,
        });
      });
      if ((uploaded || removeImage) && existing.imageKey) await deleteUpload(existing.imageKey);
      if (materialUpdate) {
        try {
          await notifyActiveMembers({
            category: "play_updates",
            eventType: "play_updated",
            subject: `PrimeIQ play update: ${play.participantName ?? "posted play"}`,
            text: `${updateNote}\nOriginal: ${play.originalLine ?? "N/A"}\nCurrent: ${play.line ?? "N/A"}`,
            resourceType: "play",
            resourceId: play.id,
          });
        } catch (error) {
          console.error("Play update notification processing failed", { playId: play.id, error });
        }
      }
      return success("Play updated successfully", safePlay(play));
    } catch (error) {
      if (uploaded) await deleteUpload(uploaded.key);
      throw error;
    }
  }
  if (request.method === "DELETE") {
    if (existing.result !== "pending" || existing.freeOnDate || existing.isCurrentFree) {
      const archived = await prisma.play.update({
        where: { id },
        data: { publicationStatus: "archived" },
      });
      return success("Historical play archived and retained", safePlay(archived));
    }
    await prisma.play.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
    if (existing.imageKey) await deleteUpload(existing.imageKey);
    return success("Play deleted successfully");
  }
  throw new ApiError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
}

export async function bestBetPlays(searchParams: URLSearchParams) {
  const { page, limit, skip } = pagination(searchParams);
  const where = { ...playWhere(searchParams, true), isBestBet: true };
  const plays = await prisma.play.findMany({ where, include: { parlayLegs: { orderBy: { displayOrder: "asc" } } }, skip, take: limit, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }] });
  return plays.map((play) => ({
    id: play.id,
    player: play.participantName,
    team: play.team,
    opponent: play.opponent,
    sport: play.sport,
    league: play.league,
    bet: `${play.betType ?? ""}${play.line === null ? "" : ` ${play.line}`}`.trim(),
    odds: play.odds,
    confidence: play.confidence,
    analysis: play.analysis,
    result: play.result,
    parlayLegs: play.parlayLegs,
  }));
}
