import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const email = process.env.DEFAULT_ADMIN_EMAIL;
const password = process.env.DEFAULT_ADMIN_PASSWORD;

if (!connectionString) throw new Error("DATABASE_URL is required");
if (!email || !password) {
  throw new Error("DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are required");
}
const adminEmail = email;
const adminPassword = password;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    create: {
      email: adminEmail.toLowerCase(),
      firstName: "Admin",
      lastName: "User",
      displayName: "Admin User",
      password: passwordHash,
      role: "admin",
      status: "active",
      emailVerifiedAt: new Date(),
    },
    update: {
      role: "admin",
      status: "active",
      emailVerifiedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
    },
  });

  await prisma.testimonial.upsert({
    where: { seedKey: "brayden-featured" },
    create: {
      seedKey: "brayden-featured",
      displayName: "Brayden",
      headline: "They helped me turn my $350 Bet365 promo into $750.",
      rating: 5,
      reviewText:
        "I was brand new to sports betting when Bet365 had their new-customer promo, so I really didn't know what I was doing. I had a free $350 promo and reached out to one of my buddies who runs PrimeIQ for some help. They walked me through the plays, helped me understand what I was betting, and we ended up turning that promo into $750. Going from basically $0 out of pocket to $750 was insane. That experience definitely made me look at sports betting completely differently.",
      experienceContext: "PrimeIQ Client",
      isFeatured: true,
      displayOrder: 0,
      publicationStatus: "published",
      publishedAt: new Date(),
      createdById: admin.id,
    },
    update: {
      displayName: "Brayden",
      headline: "They helped me turn my $350 Bet365 promo into $750.",
      rating: 5,
      reviewText:
        "I was brand new to sports betting when Bet365 had their new-customer promo, so I really didn't know what I was doing. I had a free $350 promo and reached out to one of my buddies who runs PrimeIQ for some help. They walked me through the plays, helped me understand what I was betting, and we ended up turning that promo into $750. Going from basically $0 out of pocket to $750 was insane. That experience definitely made me look at sports betting completely differently.",
      experienceContext: "PrimeIQ Client",
      isFeatured: true,
      displayOrder: 0,
      publicationStatus: "published",
      publishedAt: new Date(),
      createdById: admin.id,
      isDeleted: false,
      deletedAt: null,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
