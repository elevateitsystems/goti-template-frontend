-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('email_verification', 'login_verification', 'password_reset', 'two_factor');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'expired', 'unpaid', 'trialing', 'past_due', 'incomplete');

-- CreateEnum
CREATE TYPE "PlayParticipantType" AS ENUM ('player', 'team');

-- CreateEnum
CREATE TYPE "PlayPublicationStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PlayResult" AS ENUM ('pending', 'win', 'loss', 'push');

-- CreateEnum
CREATE TYPE "ContentAccessLevel" AS ENUM ('free', 'members_only');

-- CreateEnum
CREATE TYPE "PlayContentType" AS ENUM ('straight', 'parlay', 'avoid');

-- CreateEnum
CREATE TYPE "ReviewRequestStatus" AS ENUM ('new', 'reviewing', 'answered');

-- CreateEnum
CREATE TYPE "ReviewVerdict" AS ENUM ('good_to_go', 'adjust', 'pass', 'need_more_info');

-- CreateEnum
CREATE TYPE "NotificationEventType" AS ENUM ('new_play', 'play_updated', 'new_video', 'card_updated', 'personal_review_answered');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "status" "AccountStatus" NOT NULL DEFAULT 'pending_verification',
    "password" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "bio" TEXT,
    "avatarUrl" TEXT,
    "avatarPublicId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "type" "OTPType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingInterval" "BillingInterval" NOT NULL DEFAULT 'monthly',
    "description" TEXT,
    "features" TEXT[],
    "stripePriceId" TEXT,
    "stripeProductId" TEXT,
    "trialDays" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "pricingId" UUID NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "paymentStatus" TEXT NOT NULL DEFAULT 'paid',
    "amountPaid" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Play" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "participantType" "PlayParticipantType",
    "participantName" TEXT,
    "team" TEXT,
    "opponent" TEXT,
    "sport" TEXT,
    "league" TEXT,
    "market" TEXT,
    "betType" TEXT,
    "line" DOUBLE PRECISION,
    "odds" INTEGER,
    "sportsbook" TEXT,
    "confidence" INTEGER,
    "projection" DOUBLE PRECISION,
    "edge" DOUBLE PRECISION,
    "hitRate" DOUBLE PRECISION,
    "hitFraction" TEXT,
    "analysis" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "isTopPlay" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isBestBet" BOOLEAN NOT NULL DEFAULT false,
    "isCurrentFree" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" "ContentAccessLevel" NOT NULL DEFAULT 'members_only',
    "contentType" "PlayContentType" NOT NULL DEFAULT 'straight',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "cardId" UUID,
    "publicationStatus" "PlayPublicationStatus" NOT NULL DEFAULT 'draft',
    "result" "PlayResult" NOT NULL DEFAULT 'pending',
    "publishedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrimeIQCard" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "cardDate" DATE NOT NULL,
    "publicationStatus" "PlayPublicationStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrimeIQCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParlayLeg" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "playId" UUID NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "participantType" "PlayParticipantType",
    "participantName" TEXT NOT NULL,
    "team" TEXT,
    "opponent" TEXT,
    "sport" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "betType" TEXT NOT NULL,
    "line" DOUBLE PRECISION,
    "odds" INTEGER,
    "sportsbook" TEXT,
    "result" "PlayResult" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParlayLeg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "playId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "previousLine" DOUBLE PRECISION,
    "newLine" DOUBLE PRECISION,
    "previousOdds" INTEGER,
    "newOdds" INTEGER,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailKey" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "mediaKey" TEXT,
    "accessLevel" "ContentAccessLevel" NOT NULL DEFAULT 'members_only',
    "isCurrentFree" BOOLEAN NOT NULL DEFAULT false,
    "publicationStatus" "PlayPublicationStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoPlayAttachment" (
    "videoId" UUID NOT NULL,
    "playId" UUID NOT NULL,

    CONSTRAINT "VideoPlayAttachment_pkey" PRIMARY KEY ("videoId","playId")
);

-- CreateTable
CREATE TABLE "VideoCardAttachment" (
    "videoId" UUID NOT NULL,
    "cardId" UUID NOT NULL,

    CONSTRAINT "VideoCardAttachment_pkey" PRIMARY KEY ("videoId","cardId")
);

-- CreateTable
CREATE TABLE "PersonalReviewRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "sport" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "player" TEXT,
    "bet" TEXT NOT NULL,
    "line" DOUBLE PRECISION,
    "sportsbook" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "screenshotUrl" TEXT,
    "screenshotKey" TEXT,
    "status" "ReviewRequestStatus" NOT NULL DEFAULT 'new',
    "verdict" "ReviewVerdict",
    "response" TEXT,
    "reviewedById" UUID,
    "answeredAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalReviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "seedKey" TEXT,
    "displayName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "photoUrl" TEXT,
    "photoKey" TEXT,
    "experienceContext" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publicationStatus" "PlayPublicationStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdById" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "eventType" "NotificationEventType" NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "eventType" "NotificationEventType" NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'pending',
    "providerId" TEXT,
    "failureReason" TEXT,
    "resourceType" TEXT,
    "resourceId" UUID,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "OTP_identifier_type_verified_idx" ON "OTP"("identifier", "type", "verified");

-- CreateIndex
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");

-- CreateIndex
CREATE INDEX "OTP_userId_idx" ON "OTP"("userId");

-- CreateIndex
CREATE INDEX "OTP_createdAt_idx" ON "OTP"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_pricingId_idx" ON "Subscription"("pricingId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Play_publicationStatus_isDeleted_publishedAt_idx" ON "Play"("publicationStatus", "isDeleted", "publishedAt");

-- CreateIndex
CREATE INDEX "Play_sport_league_idx" ON "Play"("sport", "league");

-- CreateIndex
CREATE INDEX "Play_result_idx" ON "Play"("result");

-- CreateIndex
CREATE INDEX "Play_createdById_idx" ON "Play"("createdById");

-- CreateIndex
CREATE INDEX "Play_accessLevel_publicationStatus_isDeleted_idx" ON "Play"("accessLevel", "publicationStatus", "isDeleted");

-- CreateIndex
CREATE INDEX "Play_cardId_displayOrder_idx" ON "Play"("cardId", "displayOrder");

-- CreateIndex
CREATE INDEX "Play_isCurrentFree_accessLevel_publicationStatus_idx" ON "Play"("isCurrentFree", "accessLevel", "publicationStatus");

-- CreateIndex
CREATE INDEX "PrimeIQCard_publicationStatus_isDeleted_cardDate_idx" ON "PrimeIQCard"("publicationStatus", "isDeleted", "cardDate");

-- CreateIndex
CREATE INDEX "PrimeIQCard_createdById_idx" ON "PrimeIQCard"("createdById");

-- CreateIndex
CREATE INDEX "ParlayLeg_playId_displayOrder_idx" ON "ParlayLeg"("playId", "displayOrder");

-- CreateIndex
CREATE INDEX "PlayUpdate_playId_createdAt_idx" ON "PlayUpdate"("playId", "createdAt");

-- CreateIndex
CREATE INDEX "PlayUpdate_createdById_idx" ON "PlayUpdate"("createdById");

-- CreateIndex
CREATE INDEX "Video_accessLevel_publicationStatus_isDeleted_publishedAt_idx" ON "Video"("accessLevel", "publicationStatus", "isDeleted", "publishedAt");

-- CreateIndex
CREATE INDEX "Video_isCurrentFree_accessLevel_publicationStatus_idx" ON "Video"("isCurrentFree", "accessLevel", "publicationStatus");

-- CreateIndex
CREATE INDEX "Video_createdById_idx" ON "Video"("createdById");

-- CreateIndex
CREATE INDEX "VideoPlayAttachment_playId_idx" ON "VideoPlayAttachment"("playId");

-- CreateIndex
CREATE INDEX "VideoCardAttachment_cardId_idx" ON "VideoCardAttachment"("cardId");

-- CreateIndex
CREATE INDEX "PersonalReviewRequest_memberId_isDeleted_createdAt_idx" ON "PersonalReviewRequest"("memberId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "PersonalReviewRequest_status_isDeleted_createdAt_idx" ON "PersonalReviewRequest"("status", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "PersonalReviewRequest_reviewedById_idx" ON "PersonalReviewRequest"("reviewedById");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_seedKey_key" ON "Testimonial"("seedKey");

-- CreateIndex
CREATE INDEX "Testimonial_publicationStatus_isFeatured_isDeleted_publishe_idx" ON "Testimonial"("publicationStatus", "isFeatured", "isDeleted", "publishedAt");

-- CreateIndex
CREATE INDEX "Testimonial_createdById_idx" ON "Testimonial"("createdById");

-- CreateIndex
CREATE INDEX "NotificationPreference_eventType_emailEnabled_idx" ON "NotificationPreference"("eventType", "emailEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_eventType_key" ON "NotificationPreference"("userId", "eventType");

-- CreateIndex
CREATE INDEX "NotificationDelivery_userId_createdAt_idx" ON "NotificationDelivery"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_createdAt_idx" ON "NotificationDelivery"("status", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_eventType_createdAt_idx" ON "NotificationDelivery"("eventType", "createdAt");

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PrimeIQCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrimeIQCard" ADD CONSTRAINT "PrimeIQCard_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParlayLeg" ADD CONSTRAINT "ParlayLeg_playId_fkey" FOREIGN KEY ("playId") REFERENCES "Play"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayUpdate" ADD CONSTRAINT "PlayUpdate_playId_fkey" FOREIGN KEY ("playId") REFERENCES "Play"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayUpdate" ADD CONSTRAINT "PlayUpdate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPlayAttachment" ADD CONSTRAINT "VideoPlayAttachment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPlayAttachment" ADD CONSTRAINT "VideoPlayAttachment_playId_fkey" FOREIGN KEY ("playId") REFERENCES "Play"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCardAttachment" ADD CONSTRAINT "VideoCardAttachment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCardAttachment" ADD CONSTRAINT "VideoCardAttachment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PrimeIQCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalReviewRequest" ADD CONSTRAINT "PersonalReviewRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalReviewRequest" ADD CONSTRAINT "PersonalReviewRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

