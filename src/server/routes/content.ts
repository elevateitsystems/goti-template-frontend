import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { ApiError, booleanValue, numberValue, publicRecord, requestBody, success } from "@/server/api";
import { requireAdmin, requireMember } from "@/server/auth";
import { prisma } from "@/server/db";
import { notifyUser } from "@/server/notifications";
import { publishDueContent } from "@/server/publishing";
import { easternDate, easternWeekStart, parseEasternDateTime } from "@/server/time";
import { deleteUpload, optionalFile, uploadImage } from "@/server/upload";

const publication = z.enum(["draft", "scheduled", "published", "archived"]);
const testimonialPublication = z.enum(["draft", "published", "archived"]);
const scheduledAt = z.union([z.string(), z.date(), z.null()]).optional().transform(parseEasternDateTime);
const cardSchema = z.object({
  title: z.string().trim().min(1).max(200),
  summary: z.string().max(2000).nullable().optional(),
  cardDate: z.coerce.date(),
  publicationStatus: publication.default("draft"),
  scheduledAt,
});
const videoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  mediaUrl: z.string().url(),
  mediaKey: z.string().nullable().optional(),
  accessLevel: z.enum(["free", "members_only"]).default("members_only"),
  isCurrentFree: z.unknown().optional().transform(booleanValue),
  publicationStatus: publication.default("draft"),
  scheduledAt,
  playIds: z.array(z.string().uuid()).default([]),
  cardIds: z.array(z.string().uuid()).default([]),
  removeThumbnail: z.unknown().optional().transform(booleanValue),
});
const testimonialSchema = z.object({
  displayName: z.string().trim().min(1).max(200),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().min(1).max(5000),
  experienceContext: z.string().max(1000).nullable().optional(),
  headline: z.string().trim().max(500).nullable().optional(),
  isFeatured: z.unknown().optional().transform(booleanValue),
  displayOrder: z.coerce.number().int().min(0).default(0),
  publicationStatus: testimonialPublication.default("draft"),
  removePhoto: z.unknown().optional().transform(booleanValue),
});

function safe(value: unknown) {
  return publicRecord(value as Record<string, unknown>);
}

async function homepageFreePlay() {
  const include = { parlayLegs: { orderBy: { displayOrder: "asc" as const } } };
  const dated = await prisma.play.findFirst({
    where: { publicationStatus: "published", isDeleted: false, freeOnDate: easternDate() },
    include,
    orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
  });
  return dated ?? prisma.play.findFirst({
    where: { publicationStatus: "published", isDeleted: false, isCurrentFree: true, freeOnDate: null },
    include,
    orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
  });
}

const cardInclude = {
  plays: { where: { isDeleted: false }, include: { parlayLegs: true }, orderBy: { displayOrder: "asc" as const } },
  videoAttachments: { include: { video: true } },
};
const videoInclude = { playAttachments: true, cardAttachments: true };

export async function contentRoutes(request: NextRequest, path: string[]) {
  if (request.method === "GET") await publishDueContent();
  if (path[0] === "homepage" && request.method === "GET") {
    const [freePlay, freeVideo, testimonials] = await Promise.all([
      homepageFreePlay(),
      prisma.video.findFirst({
        where: { publicationStatus: "published", isDeleted: false, OR: [{ accessLevel: "free" }, { isCurrentFree: true }] },
        orderBy: [{ isCurrentFree: "desc" }, { publishedAt: "desc" }],
      }),
      prisma.testimonial.findMany({
        where: { publicationStatus: "published", isDeleted: false },
        orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { publishedAt: "desc" }],
      }),
    ]);
    return success("Homepage content retrieved", {
      freePlay: freePlay ? safe(freePlay) : null,
      freeVideo: freeVideo ? safe(freeVideo) : null,
      featuredTestimonial: testimonials.find((testimonial) => testimonial.isFeatured)
        ? safe(testimonials.find((testimonial) => testimonial.isFeatured)!)
        : null,
      testimonials: testimonials.filter((testimonial) => !testimonial.isFeatured).map(safe),
    });
  }

  if (path[0] === "testimonials" && request.method === "GET") {
    const testimonials = await prisma.testimonial.findMany({
      where: { publicationStatus: "published", isDeleted: false },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { publishedAt: "desc" }],
    });
    return success("Testimonials retrieved", testimonials.map(safe));
  }

  if (path[0] === "member" && path[1] === "cards" && request.method === "GET") {
    await requireMember(request);
    const cards = await prisma.primeIQCard.findMany({
      where: { publicationStatus: "published", isDeleted: false },
      include: cardInclude,
      orderBy: [{ cardDate: "desc" }, { createdAt: "desc" }],
    });
    return success("Member cards retrieved", cards.map(safe));
  }
  if (path[0] === "member" && path[1] === "videos" && request.method === "GET") {
    await requireMember(request);
    const videos = await prisma.video.findMany({
      where: { publicationStatus: "published", isDeleted: false },
      orderBy: { publishedAt: "desc" },
    });
    return success("Member videos retrieved", videos.map(safe));
  }

  if (path[0] !== "admin" || !["cards", "videos", "testimonials"].includes(path[1] ?? "")) return null;
  const admin = await requireAdmin(request);
  const resource = path[1];
  const id = path[2];

  if (resource === "cards") {
    if (request.method === "GET") {
      const cards = await prisma.primeIQCard.findMany({ where: { isDeleted: false }, include: cardInclude, orderBy: { cardDate: "desc" } });
      return success("Cards retrieved", cards.map(safe));
    }
    if (request.method === "POST") {
      const input = cardSchema.parse((await requestBody(request)).fields);
      if (input.publicationStatus === "scheduled" && !input.scheduledAt) {
        throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
      }
      const card = await prisma.primeIQCard.create({
        data: { ...input, createdById: admin.id, publishedAt: input.publicationStatus === "published" ? new Date() : null },
        include: cardInclude,
      });
      return success("Card created", safe(card), { status: 201 });
    }
    if (!id) throw new ApiError(404, "Card not found", "NOT_FOUND");
    const existing = await prisma.primeIQCard.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new ApiError(404, "Card not found", "NOT_FOUND");
    if (request.method === "PATCH") {
      const input = cardSchema.partial().parse((await requestBody(request)).fields);
      if (input.publicationStatus === "scheduled" && !(input.scheduledAt ?? existing.scheduledAt)) {
        throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
      }
      const card = await prisma.primeIQCard.update({
        where: { id },
        data: {
          ...input,
          ...(input.publicationStatus === "published" && existing.publicationStatus !== "published"
            ? { publishedAt: new Date(), scheduledAt: null }
            : {}),
        },
        include: cardInclude,
      });
      return success("Card updated", safe(card));
    }
    if (request.method === "DELETE") {
      if (existing.publicationStatus !== "draft") {
        const card = await prisma.primeIQCard.update({ where: { id }, data: { publicationStatus: "archived" }, include: cardInclude });
        return success("Published card archived and retained", safe(card));
      }
      await prisma.primeIQCard.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
      return success("Card deleted");
    }
  }

  if (resource === "videos") {
    if (request.method === "GET") {
      const videos = await prisma.video.findMany({ where: { isDeleted: false }, include: videoInclude, orderBy: { createdAt: "desc" } });
      return success("Videos retrieved", videos.map(safe));
    }
    if (request.method === "POST") {
      const { fields, formData } = await requestBody(request);
      const { playIds, cardIds, removeThumbnail: _remove, ...input } = videoSchema.parse(fields);
      if (input.publicationStatus === "scheduled" && !input.scheduledAt) {
        throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
      }
      const file = optionalFile(formData, "thumbnail");
      const uploaded = file ? await uploadImage(file) : undefined;
      try {
        const video = await prisma.video.create({
          data: {
            ...input,
            createdById: admin.id,
            publishedAt: input.publicationStatus === "published" ? new Date() : null,
            ...(uploaded ? { thumbnailUrl: uploaded.url, thumbnailKey: uploaded.key } : {}),
            ...(playIds.length ? { playAttachments: { create: playIds.map((playId) => ({ playId })) } } : {}),
            ...(cardIds.length ? { cardAttachments: { create: cardIds.map((cardId) => ({ cardId })) } } : {}),
          },
          include: videoInclude,
        });
        return success("Video created", safe(video), { status: 201 });
      } catch (error) {
        if (uploaded) await deleteUpload(uploaded.key);
        throw error;
      }
    }
    if (!id) throw new ApiError(404, "Video not found", "NOT_FOUND");
    const existing = await prisma.video.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new ApiError(404, "Video not found", "NOT_FOUND");
    if (request.method === "PATCH") {
      const { fields, formData } = await requestBody(request);
      const { playIds, cardIds, removeThumbnail, ...input } = videoSchema.partial().parse(fields);
      if (input.publicationStatus === "scheduled" && !(input.scheduledAt ?? existing.scheduledAt)) {
        throw new ApiError(400, "A scheduled publication time is required", "SCHEDULE_REQUIRED");
      }
      const file = optionalFile(formData, "thumbnail");
      const uploaded = file ? await uploadImage(file) : undefined;
      try {
        const video = await prisma.$transaction(async (transaction) => {
          if (playIds) {
            await transaction.videoPlayAttachment.deleteMany({ where: { videoId: id } });
          }
          if (cardIds) {
            await transaction.videoCardAttachment.deleteMany({ where: { videoId: id } });
          }
          return transaction.video.update({
            where: { id },
            data: {
              ...input,
              ...(input.publicationStatus === "published" && existing.publicationStatus !== "published"
                ? { publishedAt: new Date(), scheduledAt: null }
                : {}),
              ...(uploaded ? { thumbnailUrl: uploaded.url, thumbnailKey: uploaded.key } : removeThumbnail ? { thumbnailUrl: null, thumbnailKey: null } : {}),
              ...(playIds?.length ? { playAttachments: { create: playIds.map((playId) => ({ playId })) } } : {}),
              ...(cardIds?.length ? { cardAttachments: { create: cardIds.map((cardId) => ({ cardId })) } } : {}),
            },
            include: videoInclude,
          });
        });
        if ((uploaded || removeThumbnail) && existing.thumbnailKey) await deleteUpload(existing.thumbnailKey);
        return success("Video updated", safe(video));
      } catch (error) {
        if (uploaded) await deleteUpload(uploaded.key);
        throw error;
      }
    }
    if (request.method === "DELETE") {
      if (existing.publicationStatus !== "draft") {
        const video = await prisma.video.update({ where: { id }, data: { publicationStatus: "archived" } });
        return success("Published video archived and retained", safe(video));
      }
      await prisma.video.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
      if (existing.thumbnailKey) await deleteUpload(existing.thumbnailKey);
      return success("Video deleted");
    }
  }

  if (resource === "testimonials") {
    if (request.method === "GET") {
      const items = await prisma.testimonial.findMany({ where: { isDeleted: false }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
      return success("Testimonials retrieved", items.map(safe));
    }
    if (request.method === "POST") {
      const { fields, formData } = await requestBody(request);
      const { removePhoto: _remove, ...input } = testimonialSchema.parse(fields);
      const file = optionalFile(formData, "photo");
      const uploaded = file ? await uploadImage(file) : undefined;
      try {
        const item = await prisma.testimonial.create({
          data: { ...input, createdById: admin.id, publishedAt: input.publicationStatus === "published" ? new Date() : null, ...(uploaded ? { photoUrl: uploaded.url, photoKey: uploaded.key } : {}) },
        });
        return success("Testimonial created", safe(item), { status: 201 });
      } catch (error) {
        if (uploaded) await deleteUpload(uploaded.key);
        throw error;
      }
    }
    if (!id) throw new ApiError(404, "Testimonial not found", "NOT_FOUND");
    const existing = await prisma.testimonial.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new ApiError(404, "Testimonial not found", "NOT_FOUND");
    if (request.method === "PATCH") {
      const { fields, formData } = await requestBody(request);
      const { removePhoto, ...input } = testimonialSchema.partial().parse(fields);
      const file = optionalFile(formData, "photo");
      const uploaded = file ? await uploadImage(file) : undefined;
      try {
        const item = await prisma.testimonial.update({
          where: { id },
          data: { ...input, ...(input.publicationStatus === "published" && existing.publicationStatus !== "published" ? { publishedAt: new Date() } : {}), ...(uploaded ? { photoUrl: uploaded.url, photoKey: uploaded.key } : removePhoto ? { photoUrl: null, photoKey: null } : {}) },
        });
        if ((uploaded || removePhoto) && existing.photoKey) await deleteUpload(existing.photoKey);
        return success("Testimonial updated", safe(item));
      } catch (error) {
        if (uploaded) await deleteUpload(uploaded.key);
        throw error;
      }
    }
    if (request.method === "DELETE") {
      await prisma.testimonial.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
      if (existing.photoKey) await deleteUpload(existing.photoKey);
      return success("Testimonial deleted");
    }
  }
  throw new ApiError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
}

const reviewSchema = z.object({
  sport: z.string().trim().min(1),
  game: z.string().trim().min(1),
  player: z.string().trim().nullable().optional(),
  bet: z.string().trim().min(1),
  line: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
  sportsbook: z.string().trim().min(1),
  question: z.string().trim().min(1).max(5000),
  submissionType: z.enum(["single", "parlay"]).default("single"),
  parlayLegs: z.array(z.object({
    participant: z.string().trim().min(1),
    bet: z.string().trim().min(1),
    line: z.union([z.number(), z.string(), z.null()]).optional().transform(numberValue),
    sportsbook: z.string().trim().nullable().optional(),
  })).max(20).default([]),
});

const reviewUsageLimit = 2;

function usageMetadata(submissionsUsed: number, weekStart: Date) {
  return {
    usage: {
      limit: reviewUsageLimit,
      used: submissionsUsed,
      remaining: Math.max(0, reviewUsageLimit - submissionsUsed),
      weekStart: weekStart.toISOString().slice(0, 10),
    },
  };
}

export async function reviewRoutes(request: NextRequest, path: string[]) {
  if (path[0] === "member" && path[1] === "review-requests") {
    const user = await requireMember(request);
    const id = path[2];
    if (request.method === "GET") {
      if (id) {
        const item = await prisma.personalReviewRequest.findFirst({ where: { id, memberId: user.id, isDeleted: false }, include: { legs: { orderBy: { displayOrder: "asc" } } } });
        if (!item) throw new ApiError(404, "Review request not found", "NOT_FOUND");
        return success("Review request retrieved", safe(item));
      }
      const weekStart = easternWeekStart();
      const [items, usage] = await Promise.all([
        prisma.personalReviewRequest.findMany({ where: { memberId: user.id, isDeleted: false }, include: { legs: { orderBy: { displayOrder: "asc" } } }, orderBy: { createdAt: "desc" } }),
        prisma.reviewWeeklyUsage.findUnique({ where: { memberId_weekStart: { memberId: user.id, weekStart } } }),
      ]);
      return success("Send Me Your Plays requests retrieved", items.map(safe), {
        metadata: usageMetadata(usage?.submissionsUsed ?? 0, weekStart),
      });
    }
    if (request.method === "POST") {
      const { fields, formData } = await requestBody(request);
      const { parlayLegs, ...input } = reviewSchema.parse(fields);
      if (input.submissionType === "parlay" && parlayLegs.length < 2) {
        throw new ApiError(400, "A parlay submission requires at least two legs", "PARLAY_LEGS_REQUIRED");
      }
      const file = optionalFile(formData, "screenshot");
      const uploaded = file ? await uploadImage(file) : undefined;
      try {
        const weekStart = easternWeekStart();
        const item = await prisma.$transaction(async (transaction) => {
          const usage = await transaction.reviewWeeklyUsage.upsert({
            where: { memberId_weekStart: { memberId: user.id, weekStart } },
            create: { memberId: user.id, weekStart },
            update: {},
          });
          const claim = await transaction.reviewWeeklyUsage.updateMany({
            where: { id: usage.id, submissionsUsed: { lt: reviewUsageLimit } },
            data: { submissionsUsed: { increment: 1 } },
          });
          if (!claim.count) {
            throw new ApiError(429, "You have used both Send Me Your Plays submissions for this week", "WEEKLY_REVIEW_LIMIT_REACHED");
          }
          return transaction.personalReviewRequest.create({
            data: {
              ...input,
              memberId: user.id,
              ...(uploaded ? { screenshotUrl: uploaded.url, screenshotKey: uploaded.key } : {}),
              ...(parlayLegs.length
                ? { legs: { create: parlayLegs.map((leg, displayOrder) => ({ ...leg, displayOrder })) } }
                : {}),
            },
            include: { legs: { orderBy: { displayOrder: "asc" } } },
          });
        });
        const usage = await prisma.reviewWeeklyUsage.findUniqueOrThrow({
          where: { memberId_weekStart: { memberId: user.id, weekStart } },
        });
        return success("Send Me Your Plays request submitted", safe(item), {
          status: 201,
          metadata: usageMetadata(usage.submissionsUsed, weekStart),
        });
      } catch (error) {
        if (uploaded) await deleteUpload(uploaded.key);
        throw error;
      }
    }
  }
  if (path[0] === "admin" && path[1] === "review-usage" && request.method === "GET") {
    await requireAdmin(request);
    const weekStart = easternWeekStart();
    const members = await prisma.user.findMany({
      where: { role: "user", isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        reviewWeeklyUsage: { where: { weekStart }, select: { submissionsUsed: true } },
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });
    return success("Weekly Send Me Your Plays usage retrieved", members.map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      ...usageMetadata(member.reviewWeeklyUsage[0]?.submissionsUsed ?? 0, weekStart).usage,
    })));
  }
  if (path[0] === "admin" && path[1] === "review-requests") {
    const admin = await requireAdmin(request);
    const id = path[2];
    if (request.method === "GET") {
      const status = request.nextUrl.searchParams.get("status");
      const items = await prisma.personalReviewRequest.findMany({
        where: { isDeleted: false, ...(status && ["new", "reviewing", "answered"].includes(status) ? { status: status as "new" | "reviewing" | "answered" } : {}) },
        include: { member: { select: { firstName: true, lastName: true, email: true } }, legs: { orderBy: { displayOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
      });
      return success("Review requests retrieved", items.map(safe));
    }
    if (request.method === "PATCH" && id) {
      const input = z.object({
        status: z.enum(["new", "reviewing", "answered"]),
        verdict: z.enum(["good_to_go", "adjust", "pass", "need_more_info", "adjust_line", "remove_leg", "leg_concern", "consider_alternative", "stay_away"]).nullable().optional(),
        response: z.string().max(5000).nullable().optional(),
        legNotes: z.array(z.object({ id: z.string().uuid(), adminNote: z.string().max(2000).nullable() })).optional(),
      }).parse((await requestBody(request)).fields);
      const existingRequest = await prisma.personalReviewRequest.findFirst({ where: { id, isDeleted: false }, select: { status: true } });
      if (!existingRequest) throw new ApiError(404, "Review request not found", "NOT_FOUND");
      const { legNotes, ...requestUpdate } = input;
      const item = await prisma.$transaction(async (transaction) => {
        if (legNotes) {
          for (const leg of legNotes) {
            await transaction.reviewRequestLeg.updateMany({
              where: { id: leg.id, requestId: id },
              data: { adminNote: leg.adminNote },
            });
          }
        }
        return transaction.personalReviewRequest.update({
          where: { id },
          data: { ...requestUpdate, reviewedById: admin.id, answeredAt: input.status === "answered" ? new Date() : null },
          include: { legs: { orderBy: { displayOrder: "asc" } } },
        });
      });
      if (item.status === "answered" && existingRequest.status !== "answered") {
        try {
          await notifyUser(item.memberId, {
            category: "review_responses",
            eventType: "personal_review_answered",
            subject: "Your PrimeIQ play review is ready",
            text: `PrimeIQ has responded to your submitted play${item.response ? `:\n\n${item.response}` : "."}`,
            resourceType: "review_request",
            resourceId: item.id,
          });
        } catch (error) {
          console.error("Review response notification processing failed", { requestId: item.id, error });
        }
      }
      return success("Review request updated", safe(item));
    }
  }
  return null;
}
