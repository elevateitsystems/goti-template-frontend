import { ArrowRight } from "lucide-react";
import Link from "next/link";

const playDetails = [
  { label: "Sport", value: "NBA" },
  { label: "Matchup / Time", value: "NYK vs IND · 7:30 PM ET" },
  { label: "Market", value: "Spread" },
  { label: "PrimeIQ Play", value: "IND +3.5" },
];

const evidenceTags = [
  { label: "Form", color: "#ef55d6" },
  { label: "Pace", color: "#00d4dd" },
  { label: "Matchup", color: "#25aeea" },
  { label: "Scheduling Spot", color: "#75d92b" },
  { label: "Injury Context", color: "#f17c23" },
  { label: "Market Movement", color: "#eda322" },
];

const coverageColors = ["#ef55d6", "#a175cf", "#00d4dd", "#69d326", "#f4a600", "#ed681b"];

export function FreePlayOfTheDay() {
  return (
    <section
      id="free-play"
      className="relative scroll-mt-[76px] overflow-hidden border-b border-white/[0.05] bg-[#010208] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(22,55,97,0.11),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#62ed31]/[0.035] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-[1120px] border-x border-[#111a2a] px-5 py-2 sm:px-8 lg:px-12 lg:py-5">
        <header>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#62ee32] shadow-[0_0_12px_rgba(98,238,50,0.65)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#62ee32] sm:text-[12px]">
              Free Play of the Day
            </p>
          </div>

          <h2 className="mt-5 flex flex-wrap items-baseline gap-x-3 text-[34px] font-semibold uppercase leading-[1.06] tracking-[-0.045em] text-[#f1f1f2] sm:mt-6 sm:text-[48px] lg:text-[56px]">
            <span>New York</span>
            <span className="text-[0.48em] font-light lowercase tracking-normal text-[#9a9ca4]">vs</span>
            <span>Indiana</span>
          </h2>
          <p className="mt-4 text-[14px] font-light text-[#aaaeb6] sm:text-[16px]">
            Today&apos;s PrimeIQ Free Play
          </p>
        </header>

        <div className="mt-9 grid grid-cols-2 border-t border-[#192235] pt-7 sm:mt-10 sm:grid-cols-[0.72fr_1.55fr_0.84fr_1fr] sm:pt-8">
          {playDetails.map((detail, index) => (
            <div
              key={detail.label}
              className={`min-w-0 px-3 first:pl-0 sm:min-h-[70px] sm:px-7 sm:first:px-0 ${
                index % 2 === 1 ? "border-l border-[#192235]" : ""
              } ${index > 1 ? "mt-6 border-t border-[#192235] pt-6 sm:mt-0 sm:border-l sm:border-t-0 sm:pt-0" : ""}`}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#898c95] sm:text-[10px]">
                {detail.label}
              </p>
              <p className="mt-3 text-[13px] font-medium leading-snug text-[#e2e3e5] sm:text-[15px]">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-9 grid overflow-hidden rounded-[3px] border border-[#1b2539] bg-[#02050c] shadow-[inset_0_0_44px_rgba(49,87,148,0.035)] sm:grid-cols-[1fr_1.1fr]">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#62ee32] sm:text-[11px]">
              PrimeIQ Confidence
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-[48px] font-semibold leading-none tracking-[-0.04em] text-[#61ed32] sm:text-[58px]">74</span>
              <span className="text-[14px] font-light text-[#92959d] sm:text-[16px]">/ 100</span>
            </div>
            <p className="mt-2 text-[13px] font-light text-[#c8c9cd] sm:text-[14px]">High Confidence</p>
            <div
              className="mt-4 h-2 max-w-[310px] overflow-hidden rounded-full bg-[#172137]"
              role="progressbar"
              aria-label="PrimeIQ confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={74}
            >
              <div className="h-full w-[74%] rounded-full bg-[#61ed32] shadow-[0_0_12px_rgba(97,237,50,0.48)]" />
            </div>
          </div>

          <div className="flex items-center border-t border-[#1b2539] px-6 py-7 sm:border-l sm:border-t-0 sm:px-10 sm:py-8">
            <p className="max-w-[340px] text-[15px] font-light leading-[1.7] text-[#c8c9ce] sm:text-[17px]">
              Built on layered research,
              <br className="hidden sm:block" /> market intelligence, and
              <br className="hidden sm:block" /> disciplined analysis.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#858892] sm:text-[10px]">
            Signal Coverage
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-9 sm:gap-14">
            {coverageColors.map((color) => (
              <span
                key={color}
                aria-hidden="true"
                className="relative h-[18px] w-[18px] rounded-full border-2 transition-transform duration-300 hover:scale-110"
                style={{ borderColor: color, boxShadow: `0 0 11px ${color}35` }}
              >
                <span className="absolute inset-[4px] rounded-full opacity-55" style={{ backgroundColor: color }} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-9 rounded-[3px] border border-[#1b2539] bg-[#02050b] px-6 py-7 shadow-[inset_0_0_44px_rgba(49,87,148,0.025)] sm:px-8 sm:py-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#62ee32] sm:text-[11px]">
            Why This Play Stands Out
          </h3>
          <p className="mt-4 max-w-[930px] text-[13px] font-light leading-[1.8] text-[#c9cbd0] sm:text-[15px] sm:leading-[1.85]">
            PrimeIQ&apos;s Free Play of the Day highlights one position where our analysis identifies a meaningful edge. Today&apos;s
            play is informed by matchup context, recent form, market behavior, scheduling factors, and the signals that matter most
            before the game begins.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
            {evidenceTags.map((tag) => (
              <span
                key={tag.label}
                className="rounded-[3px] border bg-transparent px-3.5 py-2 text-[10px] font-medium leading-none transition-all duration-300 hover:-translate-y-0.5 sm:px-4 sm:text-[11px]"
                style={{ color: tag.color, borderColor: `${tag.color}9c`, boxShadow: `inset 0 0 12px ${tag.color}0b` }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <Link
            href="/edge-feed"
            className="group mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-[3px] border border-[#62ee32] px-5 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[#ebebed] transition-all duration-300 hover:bg-[#62ee32] hover:text-[#061004] hover:shadow-[0_0_25px_rgba(98,238,50,0.22)] active:scale-[0.99] sm:text-[12px]"
          >
            View Today&apos;s Free Play
            <ArrowRight aria-hidden="true" className="h-4 w-4 stroke-[1.8] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
