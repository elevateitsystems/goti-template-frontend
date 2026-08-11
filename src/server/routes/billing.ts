import "server-only";

import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { ApiError, pagination, paginationMeta, requestBody, success } from "@/server/api";
import { requireAdmin, requireUser } from "@/server/auth";
import { prisma } from "@/server/db";

function stripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(secretKey);
}

const FOUNDING_AMOUNT_CENTS = 4428;
const FOUNDING_DESCRIPTION = "$44.28 for your first 3 months. Then $44.28/month. Cancel anytime.";

const pricingLinkSchema = z.object({
  stripeProductId: z.string().trim().regex(/^prod_[A-Za-z0-9]+$/, "Enter a valid Stripe Product ID"),
  stripeIntroPriceId: z.string().trim().regex(/^price_[A-Za-z0-9]+$/, "Enter a valid introductory Price ID"),
  stripePriceId: z.string().trim().regex(/^price_[A-Za-z0-9]+$/, "Enter a valid monthly Price ID"),
  features: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});

const pricingUpdateSchema = z.object({
  features: z.array(z.string().trim().min(1)).optional(),
  isActive: z.boolean().optional(),
});

export const publicPricingSelect = {
  id: true,
  title: true,
  price: true,
  currency: true,
  billingInterval: true,
  description: true,
  features: true,
  introMonths: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

function priceProductId(price: Stripe.Price) {
  return typeof price.product === "string" ? price.product : price.product.id;
}

export function validateFoundingStripeResources(
  product: Stripe.Product,
  introPrice: Stripe.Price,
  monthlyPrice: Stripe.Price,
) {
  const resourcesShareMode = product.livemode === introPrice.livemode && product.livemode === monthlyPrice.livemode;
  const pricesBelongToProduct =
    priceProductId(introPrice) === product.id && priceProductId(monthlyPrice) === product.id;
  const validAmounts =
    introPrice.unit_amount === FOUNDING_AMOUNT_CENTS && monthlyPrice.unit_amount === FOUNDING_AMOUNT_CENTS;
  const validCurrency = introPrice.currency === "usd" && monthlyPrice.currency === "usd";
  const validIntroInterval =
    introPrice.type === "recurring" &&
    introPrice.recurring?.interval === "month" &&
    introPrice.recurring.interval_count === 3;
  const validMonthlyInterval =
    monthlyPrice.type === "recurring" &&
    monthlyPrice.recurring?.interval === "month" &&
    monthlyPrice.recurring.interval_count === 1;

  if (!product.active) throw new ApiError(400, "The Stripe Product must be active", "INVALID_STRIPE_PRICING");
  if (!introPrice.active || !monthlyPrice.active) {
    throw new ApiError(400, "Both Stripe Prices must be active", "INVALID_STRIPE_PRICING");
  }
  if (!resourcesShareMode) {
    throw new ApiError(400, "The Product and Prices must all belong to the same Stripe mode", "INVALID_STRIPE_PRICING");
  }
  if (!pricesBelongToProduct) {
    throw new ApiError(400, "Both Stripe Prices must belong to the selected Product", "INVALID_STRIPE_PRICING");
  }
  if (!validAmounts || !validCurrency) {
    throw new ApiError(400, "Both Stripe Prices must be exactly $44.28 USD", "INVALID_STRIPE_PRICING");
  }
  if (!validIntroInterval) {
    throw new ApiError(400, "The introductory Stripe Price must recur every three months", "INVALID_STRIPE_PRICING");
  }
  if (!validMonthlyInterval) {
    throw new ApiError(400, "The renewal Stripe Price must recur monthly", "INVALID_STRIPE_PRICING");
  }
}

async function retrieveFoundingStripeResources(input: z.infer<typeof pricingLinkSchema>) {
  const stripe = stripeClient();
  try {
    const [product, introPrice, monthlyPrice] = await Promise.all([
      stripe.products.retrieve(input.stripeProductId),
      stripe.prices.retrieve(input.stripeIntroPriceId),
      stripe.prices.retrieve(input.stripePriceId),
    ]);
    validateFoundingStripeResources(product, introPrice, monthlyPrice);
    return { product, introPrice, monthlyPrice };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      throw new ApiError(
        400,
        "Stripe could not find one of those IDs in the current test/live mode",
        "STRIPE_RESOURCE_NOT_FOUND",
      );
    }
    throw error;
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  const stripe = stripeClient();
  const object = event.data.object;
  if (event.type === "checkout.session.completed") {
    const session = object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const pricingId = session.metadata?.pricingId;
    if (!userId || !pricingId) return;
    const stripeSubscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!stripeSubscriptionId) return;
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const currentPeriodEnd = stripeSubscription.items.data[0]?.current_period_end;
    const accessUntil = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null;
    const plan = await prisma.pricing.findUnique({ where: { id: pricingId } });
    if (!plan?.stripeIntroPriceId || !plan.stripePriceId) return;

    const existingLocal = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      select: { stripeScheduleId: true },
    });
    let stripeScheduleId = existingLocal?.stripeScheduleId;
    if (!stripeScheduleId) {
      const schedule = await stripe.subscriptionSchedules.create({ from_subscription: stripeSubscriptionId });
      const currentPhase = schedule.current_phase;
      if (!currentPhase) throw new Error("Stripe did not return the introductory schedule phase");
      await stripe.subscriptionSchedules.update(schedule.id, {
        end_behavior: "release",
        proration_behavior: "none",
        phases: [
          {
            start_date: currentPhase.start_date,
            end_date: currentPhase.end_date,
            items: [{ price: plan.stripeIntroPriceId, quantity: 1 }],
            proration_behavior: "none",
          },
          {
            start_date: currentPhase.end_date,
            items: [{ price: plan.stripePriceId, quantity: 1 }],
            proration_behavior: "none",
          },
        ],
      });
      stripeScheduleId = schedule.id;
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.subscription.updateMany({
        where: { userId, status: "active", stripeSubscriptionId: { not: stripeSubscriptionId } },
        data: { status: "canceled", endDate: new Date(), accessUntil: new Date() },
      });
      await transaction.subscription.upsert({
        where: { stripeSubscriptionId },
        create: {
          userId,
          pricingId,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
          stripeSubscriptionId,
          stripeScheduleId,
          status: "active",
          paymentStatus: session.payment_status,
          amountPaid: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency ?? "usd",
          accessUntil,
          renewalDate: accessUntil,
        },
        update: {
          stripeScheduleId,
          status: "active",
          paymentStatus: session.payment_status,
          accessUntil,
          renewalDate: accessUntil,
          cancelAtPeriodEnd: false,
        },
      });
    });
    return;
  }
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const subscription = object as Stripe.Subscription;
    const item = subscription.items.data[0];
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscriptionStatus(subscription.status),
        renewalDate: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
        accessUntil: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
    return;
  }
  if (event.type === "customer.subscription.deleted") {
    const subscription = object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: "canceled",
        endDate: subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000)
          : new Date(),
        accessUntil: subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000)
          : new Date(),
        cancelAtPeriodEnd: false,
      },
    });
    return;
  }
  if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
    const invoice = object as Stripe.Invoice;
    const parentSubscription = invoice.parent?.subscription_details?.subscription;
    const subscriptionId = typeof parentSubscription === "string" ? parentSubscription : parentSubscription?.id;
    if (!subscriptionId) return;
    if (event.type === "invoice.payment_failed") {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: { paymentStatus: "unpaid", status: "unpaid" },
      });
      return;
    }
    const current = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscriptionId } });
    if (current && invoice.billing_reason !== "subscription_create") {
      await prisma.subscription.update({
        where: { id: current.id },
        data: { paymentStatus: "paid", amountPaid: (current.amountPaid ?? 0) + invoice.amount_paid / 100 },
      });
    }
  }
  void stripe;
}

function subscriptionStatus(status: Stripe.Subscription.Status) {
  if (status === "active") return "active" as const;
  if (status === "canceled") return "canceled" as const;
  if (status === "past_due") return "past_due" as const;
  if (status === "unpaid") return "unpaid" as const;
  return "incomplete" as const;
}

export async function billingRoutes(request: NextRequest, path: string[]) {
  if (path[0] === "admin" && path[1] === "pricing" && request.method === "GET") {
    await requireAdmin(request);
    const plans = await prisma.pricing.findMany({
      where: { isDeleted: false },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });
    return success("Admin pricing plans retrieved successfully", plans);
  }

  if (path[0] === "pricing") {
    const id = path[1];
    if (request.method === "GET") {
      if (id) {
        const plan = await prisma.pricing.findFirst({
          where: { id, isDeleted: false },
          select: publicPricingSelect,
        });
        if (!plan) throw new ApiError(404, "Pricing plan not found", "NOT_FOUND");
        return success("Pricing plan retrieved successfully", plan);
      }
      const plans = await prisma.pricing.findMany({
        where: { isDeleted: false },
        select: publicPricingSelect,
        orderBy: [{ isActive: "desc" }, { price: "asc" }],
      });
      return success("Pricing plans retrieved successfully", plans);
    }
    const admin = await requireAdmin(request);
    void admin;
    if (request.method === "POST") {
      const input = pricingLinkSchema.parse((await requestBody(request)).fields);
      const duplicate = await prisma.pricing.findFirst({
        where: {
          OR: [
            { stripeProductId: input.stripeProductId },
            { stripeIntroPriceId: input.stripeIntroPriceId },
            { stripePriceId: input.stripePriceId },
          ],
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new ApiError(409, "One or more Stripe resources are already linked", "STRIPE_PRICE_ALREADY_LINKED");
      }

      const { product, monthlyPrice } = await retrieveFoundingStripeResources(input);
      try {
        const plan = await prisma.$transaction(async (transaction) => {
          if (input.isActive) {
            await transaction.pricing.updateMany({
              where: { isActive: true, isDeleted: false },
              data: { isActive: false },
            });
          }
          return transaction.pricing.create({
            data: {
              title: product.name,
              price: (monthlyPrice.unit_amount ?? FOUNDING_AMOUNT_CENTS) / 100,
              currency: monthlyPrice.currency.toUpperCase(),
              billingInterval: "monthly",
              description: product.description ?? FOUNDING_DESCRIPTION,
              features: input.features,
              stripeProductId: input.stripeProductId,
              stripeIntroPriceId: input.stripeIntroPriceId,
              stripePriceId: input.stripePriceId,
              introMonths: 3,
              isActive: input.isActive,
            },
          });
        });
        return success("Stripe pricing linked successfully", plan, { status: 201 });
      } catch (error) {
        if ((error as { code?: string }).code === "P2002") {
          throw new ApiError(409, "One or more Stripe resources are already linked", "STRIPE_PRICE_ALREADY_LINKED");
        }
        throw error;
      }
    }
    if (!id) throw new ApiError(404, "Pricing plan not found", "NOT_FOUND");
    const existing = await prisma.pricing.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new ApiError(404, "Pricing plan not found", "NOT_FOUND");
    if (request.method === "PATCH") {
      const input = pricingUpdateSchema.parse((await requestBody(request)).fields);
      const plan = await prisma.$transaction(async (transaction) => {
        if (input.isActive) {
          await transaction.pricing.updateMany({
            where: { id: { not: id }, isActive: true, isDeleted: false },
            data: { isActive: false },
          });
        }
        return transaction.pricing.update({
          where: { id },
          data: input,
        });
      });
      return success("Pricing plan updated successfully", plan);
    }
    if (request.method === "DELETE") {
      await prisma.pricing.update({
        where: { id },
        data: { isDeleted: true, isActive: false, deletedAt: new Date() },
      });
      return success("Pricing plan archived locally; Stripe resources were not changed");
    }
  }

  if (path[0] !== "subscription") return null;
  const action = path[1] ?? "";
  if (request.method === "POST" && action === "webhook") {
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !secret) throw new ApiError(400, "Missing Stripe webhook signature", "INVALID_WEBHOOK");
    let event: Stripe.Event;
    try {
      event = stripeClient().webhooks.constructEvent(await request.text(), signature, secret);
    } catch {
      throw new ApiError(400, "Stripe webhook signature verification failed", "INVALID_WEBHOOK");
    }
    try {
      await prisma.stripeWebhookEvent.create({ data: { id: event.id, eventType: event.type } });
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        return success("Stripe webhook already processed", { received: true });
      }
      throw error;
    }
    try {
      await handleStripeEvent(event);
    } catch (error) {
      await prisma.stripeWebhookEvent.deleteMany({ where: { id: event.id } });
      throw error;
    }
    return success("Stripe webhook processed", { received: true });
  }

  if (action === "admin") {
    await requireAdmin(request);
    if (request.method === "GET" && path[2] === "all") {
      const { page, limit, skip } = pagination(request.nextUrl.searchParams);
      const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
          where: { isDeleted: false },
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, pricing: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.subscription.count({ where: { isDeleted: false } }),
      ]);
      return success("Subscriptions retrieved successfully", subscriptions, {
        pagination: paginationMeta(page, limit, total),
      });
    }
    if (request.method === "GET" && path[2] === "analytics") {
      const [activeSubscriptions, canceledSubscriptions, revenue] = await Promise.all([
        prisma.subscription.count({ where: { status: "active", isDeleted: false } }),
        prisma.subscription.count({ where: { status: "canceled", isDeleted: false } }),
        prisma.subscription.aggregate({ _sum: { amountPaid: true }, where: { paymentStatus: "paid", isDeleted: false } }),
      ]);
      return success("Subscription analytics retrieved successfully", {
        activeSubscriptions,
        canceledSubscriptions,
        totalRevenue: revenue._sum.amountPaid ?? 0,
      });
    }
  }

  const user = await requireUser(request);
  if (request.method === "POST" && action === "checkout") {
    const input = z.object({ pricingId: z.string().uuid() }).parse((await requestBody(request)).fields);
    const plan = await prisma.pricing.findFirst({ where: { id: input.pricingId, isActive: true, isDeleted: false } });
    if (!plan?.stripeIntroPriceId) throw new ApiError(404, "Pricing plan is unavailable", "NOT_FOUND");
    const session = await stripeClient().checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: plan.stripeIntroPriceId, quantity: 1 }],
      metadata: { userId: user.id, pricingId: plan.id },
      subscription_data: { metadata: { userId: user.id, pricingId: plan.id } },
      success_url: `${process.env.FRONTEND_URL ?? request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL ?? request.nextUrl.origin}/payment/cancel`,
    });
    return success("Checkout session created successfully", { sessionId: session.id, url: session.url });
  }
  if (request.method === "POST" && action === "cancel") {
    const current = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "active", isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    if (!current?.stripeSubscriptionId) throw new ApiError(404, "Active subscription not found", "NOT_FOUND");
    const stripe = stripeClient();
    if (current.stripeScheduleId) {
      try {
        await stripe.subscriptionSchedules.release(current.stripeScheduleId);
      } catch (error) {
        const stripeError = error as { code?: string };
        if (stripeError.code !== "resource_missing") throw error;
      }
    }
    const stripeSubscription = await stripe.subscriptions.update(current.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    const currentPeriodEnd = stripeSubscription.items.data[0]?.current_period_end;
    const accessUntil = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : current.accessUntil;
    const updated = await prisma.subscription.update({
      where: { id: current.id },
      data: {
        cancelAtPeriodEnd: true,
        endDate: accessUntil,
        accessUntil,
        renewalDate: accessUntil,
      },
    });
    return success("Subscription will cancel at the end of the paid period", updated);
  }
  if (request.method === "GET" && action === "my-subscription") {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, isDeleted: false },
      include: { pricing: true },
      orderBy: { createdAt: "desc" },
    });
    return success("Subscription retrieved successfully", subscription);
  }
  if (request.method === "GET" && action === "history") {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id, isDeleted: false },
      include: { pricing: true },
      orderBy: { createdAt: "desc" },
    });
    return success("Subscription history retrieved successfully", subscriptions);
  }
  throw new ApiError(404, "Subscription route not found", "NOT_FOUND");
}
