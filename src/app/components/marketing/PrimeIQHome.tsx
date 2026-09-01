"use client";

import { useGetAllQuery } from "@/redux/api/userApi";
import { EdgeInterpretation } from "./EdgeInterpretation";
import { Hero } from "./Hero";
import { MembershipOffer } from "./MembershipOffer";
import { OurProcess } from "./OurProcess";
import { PositionHistory } from "./PositionHistory";
import { WeeklySpotlight } from "./WeeklySpotlight";

interface PublicPricingPlan {
  id: string;
  isActive: boolean;
}

export function PrimeIQHome() {
  const { data: pricingResponse } = useGetAllQuery({ path: "pricing" });
  const activePlan = (pricingResponse?.data as PublicPricingPlan[] | undefined)?.find((plan) => plan.isActive);
  const membershipHref = activePlan ? `/register?plan=${activePlan.id}` : "#pricing";

  return <main className="overflow-hidden bg-[#07111d] text-white">
    <Hero primaryHref={membershipHref} />
    <EdgeInterpretation />
    <WeeklySpotlight />
    <OurProcess />
    <PositionHistory />
    <MembershipOffer membershipHref={membershipHref} />
  </main>;
}
