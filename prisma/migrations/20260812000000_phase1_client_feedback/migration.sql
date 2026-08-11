-- AddEnumValues
ALTER TYPE "PlayPublicationStatus" ADD VALUE IF NOT EXISTS 'scheduled';
ALTER TYPE "ReviewVerdict" ADD VALUE IF NOT EXISTS 'adjust_line';
ALTER TYPE "ReviewVerdict" ADD VALUE IF NOT EXISTS 'remove_leg';
ALTER TYPE "ReviewVerdict" ADD VALUE IF NOT EXISTS 'leg_concern';
ALTER TYPE "ReviewVerdict" ADD VALUE IF NOT EXISTS 'consider_alternative';
ALTER TYPE "ReviewVerdict" ADD VALUE IF NOT EXISTS 'stay_away';

-- Replace trialing with the Phase 1 subscription statuses.
UPDATE "Subscription" SET "status" = 'incomplete' WHERE "status" = 'trialing';
ALTER TABLE "Subscription" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'expired', 'unpaid', 'past_due', 'incomplete');
ALTER TABLE "Subscription" ALTER COLUMN "status" TYPE "SubscriptionStatus" USING ("status"::text::"SubscriptionStatus");
ALTER TABLE "Subscription" ALTER COLUMN "status" SET DEFAULT 'active';
DROP TYPE "SubscriptionStatus_old";

-- CreateEnums
CREATE TYPE "ReviewSubmissionType" AS ENUM ('single', 'parlay');
CREATE TYPE "NotificationCategory" AS ENUM ('daily_primeiq', 'play_updates', 'review_responses');

-- Pricing and subscription entitlement fields.
ALTER TABLE "Pricing"
  ADD COLUMN "stripeIntroPriceId" TEXT,
  ADD COLUMN "introMonths" INTEGER NOT NULL DEFAULT 3,
  DROP COLUMN "trialDays";

ALTER TABLE "Subscription"
  ADD COLUMN "stripeScheduleId" TEXT,
  ADD COLUMN "accessUntil" TIMESTAMP(3),
  ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Subscription"
SET "accessUntil" = COALESCE("endDate", "renewalDate")
WHERE "accessUntil" IS NULL;

CREATE UNIQUE INDEX "Subscription_stripeScheduleId_key" ON "Subscription"("stripeScheduleId");
CREATE INDEX "Subscription_userId_accessUntil_idx" ON "Subscription"("userId", "accessUntil");

-- Scheduling, daily-free selection, transparent lines, and settlement details.
ALTER TABLE "Play"
  ADD COLUMN "originalLine" DOUBLE PRECISION,
  ADD COLUMN "originalOdds" INTEGER,
  ADD COLUMN "freeOnDate" DATE,
  ADD COLUMN "scheduledAt" TIMESTAMP(3),
  ADD COLUMN "latestUpdateNote" TEXT,
  ADD COLUMN "finalResultDetail" TEXT;

UPDATE "Play"
SET "originalLine" = "line", "originalOdds" = "odds"
WHERE "publishedAt" IS NOT NULL;

CREATE UNIQUE INDEX "Play_freeOnDate_key" ON "Play"("freeOnDate");
CREATE INDEX "Play_publicationStatus_scheduledAt_idx" ON "Play"("publicationStatus", "scheduledAt");

ALTER TABLE "PrimeIQCard" ADD COLUMN "scheduledAt" TIMESTAMP(3);
CREATE INDEX "PrimeIQCard_publicationStatus_scheduledAt_idx" ON "PrimeIQCard"("publicationStatus", "scheduledAt");

ALTER TABLE "Video" ADD COLUMN "scheduledAt" TIMESTAMP(3);
CREATE INDEX "Video_publicationStatus_scheduledAt_idx" ON "Video"("publicationStatus", "scheduledAt");

-- Send Me Your Plays structures.
ALTER TABLE "PersonalReviewRequest" ADD COLUMN "submissionType" "ReviewSubmissionType" NOT NULL DEFAULT 'single';

CREATE TABLE "ReviewRequestLeg" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "requestId" UUID NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "participant" TEXT NOT NULL,
  "bet" TEXT NOT NULL,
  "line" DOUBLE PRECISION,
  "sportsbook" TEXT,
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewRequestLeg_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewWeeklyUsage" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "memberId" UUID NOT NULL,
  "weekStart" DATE NOT NULL,
  "submissionsUsed" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewWeeklyUsage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReviewWeeklyUsage_submissionsUsed_check" CHECK ("submissionsUsed" BETWEEN 0 AND 2)
);

CREATE INDEX "ReviewRequestLeg_requestId_displayOrder_idx" ON "ReviewRequestLeg"("requestId", "displayOrder");
CREATE UNIQUE INDEX "ReviewWeeklyUsage_memberId_weekStart_key" ON "ReviewWeeklyUsage"("memberId", "weekStart");
CREATE INDEX "ReviewWeeklyUsage_weekStart_submissionsUsed_idx" ON "ReviewWeeklyUsage"("weekStart", "submissionsUsed");
ALTER TABLE "ReviewRequestLeg" ADD CONSTRAINT "ReviewRequestLeg_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PersonalReviewRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewWeeklyUsage" ADD CONSTRAINT "ReviewWeeklyUsage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Featured testimonial copy and deterministic ordering.
ALTER TABLE "Testimonial"
  ADD COLUMN "headline" TEXT,
  ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "isFeatured" DESC, "publishedAt" ASC NULLS LAST, "createdAt" ASC) - 1 AS position
  FROM "Testimonial"
)
UPDATE "Testimonial" AS testimonial
SET "displayOrder" = ordered.position
FROM ordered
WHERE testimonial."id" = ordered."id";

CREATE INDEX "Testimonial_publicationStatus_displayOrder_idx" ON "Testimonial"("publicationStatus", "displayOrder");

-- Collapse event-level preferences into the three member-facing categories.
ALTER TABLE "NotificationPreference" ADD COLUMN "category" "NotificationCategory";
UPDATE "NotificationPreference"
SET "category" = CASE
  WHEN "eventType" IN ('new_play', 'new_video', 'card_updated') THEN 'daily_primeiq'::"NotificationCategory"
  WHEN "eventType" = 'play_updated' THEN 'play_updates'::"NotificationCategory"
  ELSE 'review_responses'::"NotificationCategory"
END;

WITH ranked AS (
  SELECT "id",
         ROW_NUMBER() OVER (PARTITION BY "userId", "category" ORDER BY "createdAt", "id") AS row_number,
         BOOL_AND("emailEnabled") OVER (PARTITION BY "userId", "category") AS enabled
  FROM "NotificationPreference"
)
UPDATE "NotificationPreference" AS preference
SET "emailEnabled" = ranked.enabled
FROM ranked
WHERE preference."id" = ranked."id";

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "userId", "category" ORDER BY "createdAt", "id") AS row_number
  FROM "NotificationPreference"
)
DELETE FROM "NotificationPreference"
USING ranked
WHERE "NotificationPreference"."id" = ranked."id" AND ranked.row_number > 1;

DROP INDEX "NotificationPreference_eventType_emailEnabled_idx";
DROP INDEX "NotificationPreference_userId_eventType_key";
ALTER TABLE "NotificationPreference" DROP COLUMN "eventType";
ALTER TABLE "NotificationPreference" ALTER COLUMN "category" SET NOT NULL;
CREATE INDEX "NotificationPreference_category_emailEnabled_idx" ON "NotificationPreference"("category", "emailEnabled");
CREATE UNIQUE INDEX "NotificationPreference_userId_category_key" ON "NotificationPreference"("userId", "category");

-- Stripe webhook idempotency ledger.
CREATE TABLE "StripeWebhookEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StripeWebhookEvent_processedAt_idx" ON "StripeWebhookEvent"("processedAt");
