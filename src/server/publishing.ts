import "server-only";

import { prisma } from "@/server/db";

export async function publishDueContent(now = new Date()) {
  const duePlays = await prisma.play.findMany({
    where: { publicationStatus: "scheduled", scheduledAt: { lte: now }, isDeleted: false },
    select: { id: true, line: true, odds: true },
  });

  await prisma.$transaction([
    ...duePlays.map((play) =>
      prisma.play.update({
        where: { id: play.id },
        data: {
          publicationStatus: "published",
          publishedAt: now,
          scheduledAt: null,
          originalLine: play.line,
          originalOdds: play.odds,
        },
      }),
    ),
    prisma.primeIQCard.updateMany({
      where: { publicationStatus: "scheduled", scheduledAt: { lte: now }, isDeleted: false },
      data: { publicationStatus: "published", publishedAt: now, scheduledAt: null },
    }),
    prisma.video.updateMany({
      where: { publicationStatus: "scheduled", scheduledAt: { lte: now }, isDeleted: false },
      data: { publicationStatus: "published", publishedAt: now, scheduledAt: null },
    }),
  ]);
}
