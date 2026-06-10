"use client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useGetAllQuery } from "@/redux/api/userApi";

export interface PricingTier {
  id: string;
  title?: string;
  name?: string;
  price: number;
  currency?: string;
  period?: string;
  billingInterval?: string;
  description: string;
  buttonText?: string;
  buttonVariant?: "solid" | "outline";
  highlight?: boolean;
  features: string[];
  trialDays?: number;
  isActive?: boolean;
}

interface PricingProps {
  showFreeTrialCard?: boolean;
}

export function Pricing({ showFreeTrialCard = true }: PricingProps) {
  const { data: pricingResponse, isLoading } = useGetAllQuery({
    path: "pricing",
  });

  const fetchedPricings: PricingTier[] =
    pricingResponse?.data?.filter((p: any) => p.isActive) || [];

  const freePlan: PricingTier = {
    id: "free-trial",
    name: "Free Trial",
    price: 0,
    period: "for 30 days",
    description: "Experience the platform with limited daily queries to see the edge for yourself.",
    buttonText: "Start Free Trial",
    buttonVariant: "outline",
    features: [
      "Access to Top Plays (Delayed)",
      "Basic Prop Filtering",
      "Player Matchup Metrics",
      "Daily Betting Dashboard",
    ],
    trialDays: 30,
  };

  // Combine Free Plan + Backend Plans with proper typing
  const allTiers: PricingTier[] = [
    ...(showFreeTrialCard ? [freePlan] : []),
    ...fetchedPricings.map((plan): PricingTier => ({
      ...plan,
      name: plan.title || plan.name,
      period: plan.billingInterval === "yearly" ? "/year" : "/month",
      buttonText: plan.price === 0 ? "Start Free Trial" : "Choose Plan",
      buttonVariant: plan.price === 0 ? "outline" : "solid", // Explicit literal type
      highlight: plan.price > 0 && plan.price < 100, // Adjust logic as needed
    })),
  ];

  // Fallback tiers
  const fallbackTiers: PricingTier[] = [
    freePlan,
    {
      id: "starter",
      name: "Starter",
      price: 49,
      period: "/month",
      description: "For serious bettors who need real-time data and advanced analytics.",
      buttonText: "Get Starter",
      buttonVariant: "solid",
      highlight: true,
      features: [
        "Real-Time Odds Movement",
        "Live EV Heatmaps",
        "Smart Bet Rating Engine",
        "Correlation + Parlay Builder",
        "Basic Alerting",
      ],
    },
    {
      id: "pro",
      name: "Pro / VIP",
      price: 199,
      period: "/month",
      description: "The full Bloomberg Terminal experience. Uncapped usage and API access.",
      buttonText: "Join Pro",
      buttonVariant: "outline",
      features: [
        "Everything in Starter",
        "Sharp Money & Steam Tracking",
        "Real-Time Injury Impact Engine",
        "DFS Integration",
        "Premium Market Trap Detector",
        "Priority VIP Support",
      ],
    },
  ];

  const tiers = allTiers.length > 1 ? allTiers : fallbackTiers;

  if (isLoading) {
    return (
      <section className="py-24 bg-navy-DEFAULT">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-navy-DEFAULT relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Invest in Your <span className="text-accent-green">Edge</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stop paying for generic picks. Invest in institutional-grade data and build your own profitable models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const name = tier.name || tier.title || "Plan";
            const isFree = tier.price === 0;
            const priceDisplay = isFree ? "$0" : `$${tier.price}`;
            const period = tier.period || "/month";

            return (
              <div
                key={tier.id}
                className={`relative rounded-[10px] p-8 flex flex-col ${
                  tier.highlight
                    ? "bg-navy-panel border border-accent-green/50 shadow-glow-green transform md:-translate-y-4"
                    : "bg-navy-surface border border-navy-border mt-4"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-accent-green text-navy-DEFAULT text-xs font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{tier.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">{priceDisplay}</span>
                  <span className="text-gray-400 ml-1">{period}</span>
                </div>

                <Link
                  href={isFree ? "/register" : `/register?plan=${tier.id}`}
                  className={`w-full py-3 rounded-[5px] font-bold text-center transition-all mb-8 ${
                    tier.buttonVariant === "solid"
                      ? "bg-accent-green text-navy-DEFAULT hover:bg-accent-green/90 shadow-glow-green"
                      : "bg-transparent border border-gray-600 text-white hover:border-gray-400"
                  }`}
                >
                  {tier.buttonText || (isFree ? "Start Free Trial" : "Choose Plan")}
                </Link>

                <div className="flex-1 space-y-4">
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">Includes:</p>
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className={`shrink-0 ${tier.highlight ? "text-accent-green" : "text-gray-500"}`}
                        size={18}
                      />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {tier.trialDays && (
                  <p className="text-xs text-emerald-600 mt-6 pt-4 border-t border-navy-border">
                    ✓ {tier.trialDays}-day free trial • No credit card required
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}