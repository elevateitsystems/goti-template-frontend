-- Prevent the same Stripe catalog resources from being linked to multiple plans.
CREATE UNIQUE INDEX "Pricing_stripeProductId_key" ON "Pricing"("stripeProductId");
CREATE UNIQUE INDEX "Pricing_stripeIntroPriceId_key" ON "Pricing"("stripeIntroPriceId");
CREATE UNIQUE INDEX "Pricing_stripePriceId_key" ON "Pricing"("stripePriceId");
