import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { PrimeIQLogo } from "@/components/brand/PrimeIQLogo";

const accessFeatures = [
  "Real spotlight research",
  "Weekly curated reports",
  "Tactical frameworks",
  "Risk-managed guidance",
  "Performance tracking",
  "Priority email support",
];

export function MembershipOffer({ membershipHref }: { membershipHref: string }) {
  return (
    <section id="pricing" className="scroll-mt-[76px] bg-[#010208] text-white">
      <div className="relative border-y border-[#11192b] bg-[#02050d] px-5 py-9 sm:px-8 lg:px-12 lg:py-10">
        {/* Premium gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative mx-auto grid max-w-[1190px] gap-8 lg:grid-cols-[0.95fr_0.78fr_1.08fr] lg:items-stretch lg:gap-7">
          <header className="px-1 py-5 lg:py-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#62ed31] sm:text-[12px]">
              Built for winners.
            </p>
            <h2 className="mt-7 max-w-[380px] text-[36px] font-bold leading-[1.08] tracking-[-0.05em] text-[#ffffff] sm:text-[42px] lg:text-[44px]">
              Get the intelligence
              <br />
              before the outcomes.
            </h2>
            <p className="mt-4 max-w-[320px] text-[13px] font-light leading-[1.6] text-[#a7a9b0] sm:text-[14px]">
              The signal before the noise. The edge before the play.
            </p>
          </header>

          <div className="group flex min-h-[410px] flex-col rounded-[5px] border border-[#a74312] bg-[#02050c] p-6 shadow-[0_0_20px_rgba(181,64,15,0.12),inset_0_0_0_1px_rgba(255,121,31,0.08)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(181,64,15,0.18),inset_0_0_0_1px_rgba(255,121,31,0.15)] lg:p-7">
            <h3 className="text-[18px] font-bold uppercase tracking-[0.08em] text-[#61ec31] sm:text-[20px]">
              90-Day Access
            </h3>
            <ul className="mt-7 space-y-5">
              {accessFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-[14px] font-medium text-[#d6d6d9] transition-colors group-hover:text-[#e8e8ea] sm:text-[15px]">
                  <Check aria-hidden="true" className="h-5 w-5 shrink-0 stroke-[2.7] text-[#55e82d] transition-transform group-hover:scale-110" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-7 text-[12px] font-light leading-7 text-[#a9abb1] sm:text-[13px]">
              Three months to observe the patterns.
              <br />
              Track the decisions. Refine the edge.
            </p>
          </div>

          <div className="group flex min-h-[410px] flex-col rounded-[5px] border-2 border-[#f39a22]/40 bg-[radial-gradient(circle_at_46%_52%,rgba(20,51,70,0.3),transparent_34%),#02050c] p-6 shadow-[0_0_30px_rgba(243,154,34,0.08),inset_0_0_0_1px_rgba(255,121,31,0.1)] transition-all duration-500 hover:border-[#f39a22]/70 hover:shadow-[0_0_50px_rgba(243,154,34,0.15)] lg:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold uppercase tracking-[0.08em] text-[#f39a22] sm:text-[18px]">
                Premium Offer
              </h3>
              <span className="rounded-full bg-[#f39a22]/10 px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f39a22]">
                Best Value
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-2">
              <p className="text-[52px] font-bold leading-none tracking-[-0.04em] text-[#f1f1f2] sm:text-[60px]">$44.28</p>
              <p className="pb-1.5 text-[10px] font-medium text-[#d4d4d6] sm:text-[11px]">one payment · three months</p>
            </div>

            <div className="mt-3 inline-block rounded-full border border-[#f39a22]/20 bg-[#f39a22]/5 px-3 py-0.5 text-[10px] font-medium text-[#f39a22] sm:text-[11px]">
              Save 66% vs. monthly
            </div>

            <p className="mt-5 text-[13px] font-light leading-7 text-[#c7c8cc] sm:text-[14px]">
              Normally $44.28/month.
              <br />
              Your next two months are included.
            </p>

            <Link
              href={membershipHref}
              className="mt-5 inline-flex h-[56px] w-full items-center justify-center gap-4 rounded-[3px] border border-[#83ff22] bg-[#59ec32] text-[14px] font-bold uppercase text-[#071004] shadow-[0_0_20px_rgba(89,236,50,0.25)] transition-all duration-300 hover:bg-[#70ff48] hover:shadow-[0_0_30px_rgba(89,236,50,0.4)] hover:scale-[1.02] active:scale-[0.98] sm:text-[15px]"
            >
              Get 90 Days
              <ArrowRight aria-hidden="true" className="h-5 w-5 stroke-[2.7] transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="mt-auto pt-6 text-[13px] font-light leading-7 text-[#aeb0b6] sm:text-[14px]">
              Full PrimeIQ access for 90 days.
              <br />
              Secure. Private. No additional monthly
              <br className="hidden sm:block" /> charge during your access period.
            </p>
          </div>
        </div>
      </div>

      <ClosingCallToAction membershipHref={membershipHref} />
    </section>
  );
}

function ClosingCallToAction({ membershipHref }: { membershipHref: string }) {
  return (
    <div className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-[#010204] px-5 py-10 text-center sm:min-h-[400px]">
      <SignalWaves />
      <div className="relative z-10 flex flex-col items-center">
        <PrimeIQLogo className="h-32 w-auto transition-transform duration-500 hover:scale-110" />
        <h2 className="mt-3 text-[48px] font-bold leading-[1.06] tracking-[-0.05em] text-[#f1f1f2] sm:text-[56px]">
          See more.
          <br />
          Guess less.
        </h2>
        <p className="mt-3 max-w-[400px] text-[13px] font-light text-[#a7a9b0] sm:text-[14px]">
          Join the intelligence network. The data is waiting.
        </p>
        <Link
          href={membershipHref}
          className="group mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-[3px] border-2 border-[#83ff22] bg-[#59ec32] px-8 text-[14px] font-bold text-[#071004] shadow-[0_0_20px_rgba(89,236,50,0.2)] transition-all duration-300 hover:bg-[#70ff48] hover:shadow-[0_0_35px_rgba(89,236,50,0.35)] hover:scale-[1.04] active:scale-[0.97] sm:text-[15px]"
        >
          Join PrimeIQ
          <ArrowRight aria-hidden="true" className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function SignalWaves() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1400 360" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="offer-left-wave" x1="0" y1="180" x2="545" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7a23ff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#c629ff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#5a34d9" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="offer-right-wave" x1="1400" y1="150" x2="855" y2="195" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00df79" stopOpacity="0" />
          <stop offset="0.42" stopColor="#00ef9a" stopOpacity="0.76" />
          <stop offset="1" stopColor="#16a96a" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={`left-wave-${index}`}
          d={`M-40 ${170 + index * 23} C100 ${70 + index * 16}, 252 ${310 - index * 11}, 560 ${184 + index * 3}`}
          stroke="url(#offer-left-wave)"
          strokeWidth={index === 2 ? 1.8 : 1}
          opacity={0.38 + index * 0.1}
        />
      ))}
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={`right-wave-${index}`}
          d={`M1440 ${100 + index * 25} C1280 ${68 + index * 10}, 1150 ${285 - index * 17}, 840 ${192 + index * 2}`}
          stroke="url(#offer-right-wave)"
          strokeWidth={index === 2 ? 1.8 : 1}
          opacity={0.38 + index * 0.1}
        />
      ))}

      {Array.from({ length: 76 }, (_, index) => {
        const isLeft = index < 38;
        const localIndex = isLeft ? index : index - 38;
        const x = isLeft ? (localIndex * 73) % 555 : 845 + ((localIndex * 79) % 555);
        const y = 72 + ((localIndex * 47) % 245);
        const color = isLeft ? (index % 2 ? "#bd32ff" : "#6f50ff") : index % 2 ? "#00e99a" : "#00b87e";
        return <circle key={`offer-particle-${index}`} cx={x} cy={y} r={index % 6 === 0 ? 2 : 1} fill={color} opacity={0.24 + (index % 5) * 0.1} />;
      })}
    </svg>
  );
}
