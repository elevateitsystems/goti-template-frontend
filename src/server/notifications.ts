import "server-only";

import type { NotificationCategory, NotificationEventType } from "@/generated/prisma/client";
import { prisma } from "@/server/db";
import { sendEmail } from "@/server/email";

interface NotificationMessage {
  category: NotificationCategory;
  eventType: NotificationEventType;
  subject: string;
  text: string;
  resourceType?: string;
  resourceId?: string;
}

async function deliver(user: { id: string; email: string }, message: NotificationMessage) {
  const delivery = await prisma.notificationDelivery.create({
    data: { userId: user.id, eventType: message.eventType, subject: message.subject, resourceType: message.resourceType, resourceId: message.resourceId },
  });
  try {
    const providerId = await sendEmail(user.email, message.subject, message.text);
    await prisma.notificationDelivery.update({ where: { id: delivery.id }, data: { status: "sent", providerId, sentAt: new Date() } });
  } catch (error) {
    const failureReason = error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error";
    console.error("Notification delivery failed", { deliveryId: delivery.id, failureReason });
    await prisma.notificationDelivery.update({ where: { id: delivery.id }, data: { status: "failed", failureReason } });
  }
}

export async function notifyActiveMembers(message: NotificationMessage) {
  const preferenceFilter =
    message.category === "daily_primeiq"
      ? { notificationPreferences: { some: { category: message.category, emailEnabled: true } } }
      : { NOT: { notificationPreferences: { some: { category: message.category, emailEnabled: false } } } };
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      status: "active",
      emailVerifiedAt: { not: null },
      subscriptions: {
        some: {
          status: { in: ["active", "canceled"] },
          paymentStatus: "paid",
          accessUntil: { gt: new Date() },
          isDeleted: false,
        },
      },
      ...preferenceFilter,
    },
    select: { id: true, email: true },
  });
  await Promise.allSettled(users.map((user) => deliver(user, message)));
}

export async function notifyUser(userId: string, message: NotificationMessage) {
  const preferenceFilter =
    message.category === "daily_primeiq"
      ? { notificationPreferences: { some: { category: message.category, emailEnabled: true } } }
      : { NOT: { notificationPreferences: { some: { category: message.category, emailEnabled: false } } } };
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false, emailVerifiedAt: { not: null }, ...preferenceFilter },
    select: { id: true, email: true },
  });
  if (user) await deliver(user, message);
}
