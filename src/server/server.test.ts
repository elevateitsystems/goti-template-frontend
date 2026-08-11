import { beforeAll, describe, expect, mock, test } from "bun:test";
import type Stripe from "stripe";

mock.module("server-only", () => ({}));

process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/propedge";
process.env.JWT_SECRET = "test-secret-with-enough-entropy-for-tests";
process.env.JWT_ISSUER = "propedge-test";

let api: typeof import("@/server/api");
let auth: typeof import("@/server/auth");
let upload: typeof import("@/server/upload");
let time: typeof import("@/server/time");
let notificationRoutes: typeof import("@/server/routes/notifications");
let billing: typeof import("@/server/routes/billing");

beforeAll(async () => {
  [api, auth, upload, time, notificationRoutes, billing] = await Promise.all([
    import("@/server/api"),
    import("@/server/auth"),
    import("@/server/upload"),
    import("@/server/time"),
    import("@/server/routes/notifications"),
    import("@/server/routes/billing"),
  ]);
});

describe("API helpers", () => {
  test("normalizes pagination and enforces the maximum page size", () => {
    expect(api.pagination(new URLSearchParams("page=-2&limit=1000"))).toEqual({
      page: 1,
      limit: 100,
      skip: 0,
    });
  });

  test("removes private storage and password fields recursively", () => {
    expect(
      api.publicRecord({
        id: "user-1",
        password: "secret",
        plays: [{ id: "play-1", imageKey: "private-key", imageUrl: "https://example.com/image" }],
      }),
    ).toEqual({
      id: "user-1",
      plays: [{ id: "play-1", imageUrl: "https://example.com/image" }],
    });
  });
});

describe("authentication", () => {
  test("signs and verifies the preserved JWT payload", () => {
    const signed = auth.signToken({ id: "user-1", email: "member@example.com", role: "user" });
    const payload = auth.verifyToken(signed.token);
    expect(payload.id).toBe("user-1");
    expect(payload.email).toBe("member@example.com");
    expect(payload.role).toBe("user");
  });

  test("rejects an invalid JWT", () => {
    expect(() => auth.verifyToken("not-a-token")).toThrow("Invalid or expired authentication token");
  });

  test("extracts a bearer token before the compatibility cookie", () => {
    const request = {
      headers: new Headers({ authorization: "Bearer bearer-token" }),
      cookies: { get: () => ({ value: "cookie-token" }) },
    } as Parameters<typeof auth.tokenFromRequest>[0];
    expect(auth.tokenFromRequest(request)).toBe("bearer-token");
  });

  test("keeps canceled membership access through the paid-through date", () => {
    const now = new Date("2026-08-11T12:00:00Z");
    expect(auth.hasActiveMembershipAccess({ status: "canceled", paymentStatus: "paid", accessUntil: new Date("2026-08-12T12:00:00Z") }, now)).toBe(true);
    expect(auth.hasActiveMembershipAccess({ status: "canceled", paymentStatus: "paid", accessUntil: new Date("2026-08-11T11:59:59Z") }, now)).toBe(false);
    expect(auth.hasActiveMembershipAccess({ status: "active", paymentStatus: "unpaid", accessUntil: new Date("2026-08-12T12:00:00Z") }, now)).toBe(false);
  });
});

describe("uploads", () => {
  test("rejects unsupported image formats before contacting UploadThing", async () => {
    const file = new File(["not-an-image"], "sample.txt", { type: "text/plain" });
    await expect(upload.uploadImage(file)).rejects.toThrow("Only JPEG, PNG, and WebP images are allowed");
  });
});

describe("Eastern Time behavior", () => {
  test("converts scheduling inputs correctly on both sides of the DST jump", () => {
    expect(time.parseEasternDateTime("2026-03-08T01:30")?.toISOString()).toBe("2026-03-08T06:30:00.000Z");
    expect(time.parseEasternDateTime("2026-03-08T03:30")?.toISOString()).toBe("2026-03-08T07:30:00.000Z");
  });

  test("uses Monday as the ET weekly reset", () => {
    expect(time.easternWeekStart(new Date("2026-08-16T16:00:00Z")).toISOString()).toBe("2026-08-10T00:00:00.000Z");
    expect(time.easternWeekStart(new Date("2026-08-17T16:00:00Z")).toISOString()).toBe("2026-08-17T00:00:00.000Z");
  });

  test("publishes only scheduled content whose timestamp is due", () => {
    const now = new Date("2026-08-11T16:00:00Z");
    expect(time.isScheduledPublicationDue("scheduled", "2026-08-11T15:59:00Z", now)).toBe(true);
    expect(time.isScheduledPublicationDue("scheduled", "2026-08-11T16:01:00Z", now)).toBe(false);
    expect(time.isScheduledPublicationDue("draft", "2026-08-11T15:59:00Z", now)).toBe(false);
  });
});

describe("notification preferences", () => {
  test("defaults play updates and review responses on while Daily PrimeIQ remains off", () => {
    expect(notificationRoutes.preferenceResponse([])).toEqual({
      daily_primeiq: false,
      play_updates: true,
      review_responses: true,
    });
  });

  test("applies persisted member choices over category defaults", () => {
    expect(notificationRoutes.preferenceResponse([{ category: "play_updates", emailEnabled: false }])).toEqual({
      daily_primeiq: false,
      play_updates: false,
      review_responses: true,
    });
  });
});

function stripeProduct(overrides: Partial<Stripe.Product> = {}) {
  return { id: "prod_primeiq", active: true, livemode: false, name: "PrimeIQ Founding Member", ...overrides } as Stripe.Product;
}

function stripePrice(intervalCount: number, overrides: Partial<Stripe.Price> = {}) {
  return {
    id: `price_${intervalCount}`,
    active: true,
    currency: "usd",
    livemode: false,
    product: "prod_primeiq",
    type: "recurring",
    unit_amount: 4428,
    recurring: { interval: "month", interval_count: intervalCount },
    ...overrides,
  } as Stripe.Price;
}

describe("Stripe founding pricing", () => {
  test("accepts two active $44.28 prices under the same product", () => {
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(3), stripePrice(1))).not.toThrow();
  });

  test("rejects incorrect amounts, currencies, intervals, and inactive resources", () => {
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(3, { unit_amount: 4400 }), stripePrice(1))).toThrow("exactly $44.28 USD");
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(3), stripePrice(1, { currency: "cad" }))).toThrow("exactly $44.28 USD");
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(1), stripePrice(1))).toThrow("every three months");
    expect(() => billing.validateFoundingStripeResources(stripeProduct({ active: false }), stripePrice(3), stripePrice(1))).toThrow("must be active");
  });

  test("rejects prices from another product or Stripe mode", () => {
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(3, { product: "prod_other" }), stripePrice(1))).toThrow("selected Product");
    expect(() => billing.validateFoundingStripeResources(stripeProduct(), stripePrice(3), stripePrice(1, { livemode: true }))).toThrow("same Stripe mode");
  });

  test("keeps Stripe integration identifiers out of public pricing selections", () => {
    expect("stripeProductId" in billing.publicPricingSelect).toBe(false);
    expect("stripeIntroPriceId" in billing.publicPricingSelect).toBe(false);
    expect("stripePriceId" in billing.publicPricingSelect).toBe(false);
  });
});
