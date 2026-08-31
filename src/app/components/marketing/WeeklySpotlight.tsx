import Link from "next/link";

const researchDetails = [
  { label: "Sport", lines: ["NBA"] },
  { label: "Window", lines: ["This Week"] },
  { label: "Angle", lines: ["Matchup", "Breakdown"] },
  { label: "Focus", lines: ["Market", "Inefficiency"] },
];

const evidenceTags = [
  { label: "Form", color: "#f044c8" },
  { label: "Pace", color: "#00dce8" },
  { label: "Matchup", color: "#00a7f0" },
  { label: "Scheduling Spot", color: "#7cda16" },
  { label: "Injury Context", color: "#ff750b" },
  { label: "Market Movement", color: "#f5a200" },
];

const coverageColors = ["#ef55d6", "#a175cf", "#00d4dd", "#54c414", "#f4a600", "#e56d07", "#e40028"];

export function WeeklySpotlight() {
  return (
    <section id="tools" className="relative scroll-mt-[76px] bg-[#010208] px-4 py-10 text-white sm:px-6 lg:px-10 lg:py-12">
      {/* Premium gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-[1320px] border border-[#182136] bg-[#02050b] p-6 shadow-[0_0_60px_rgba(98,237,49,0.03),inset_0_0_60px_rgba(98,237,49,0.02)] sm:p-8 lg:p-10">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.34fr)_minmax(380px,0.96fr)] lg:gap-8">
          <div className="min-w-0 py-1">
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#62ee32] shadow-[0_0_10px_#62ee3270] animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#62ee32] sm:text-[11px]">
                Weekly Spotlight
              </p>
            </div>

            <h2 className="mt-5 text-[32px] font-bold uppercase leading-[1.08] tracking-[-0.05em] text-[#f1f1f2] sm:text-[40px] lg:text-[44px]">
              New York <span className="mx-2 text-[0.6em] font-light lowercase text-[#a7a9b0]">vs</span> Indiana
            </h2>
            <p className="mt-3 text-[13px] font-light text-[#b8b9be] sm:text-[14px]">This Week's Research Spotlight</p>

            <div className="mt-8 grid grid-cols-2 border-t border-[#182136] pt-7 sm:grid-cols-4">
              {researchDetails.map((detail, index) => (
                <div
                  key={detail.label}
                  className={`min-h-[88px] px-4 first:pl-0 sm:min-h-[98px] ${
                    index % 2 ? "border-l border-[#182136]" : ""
                  } ${index > 1 ? "mt-5 sm:mt-0 sm:border-l" : ""}`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9698a0] sm:text-[10px]">
                    {detail.label}
                  </p>
                  <p className="mt-2.5 text-[13px] font-medium leading-[1.55] text-[#e8e8ea] sm:text-[14px]">
                    {detail.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid rounded-[3px] border border-[#182136] bg-[#03070e] shadow-[inset_0_0_40px_rgba(98,237,49,0.02)] sm:grid-cols-[44%_56%]">
              <div className="px-5 py-5 sm:px-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#62ee32] sm:text-[10px]">
                  Research Confidence
                </p>
                <p className="mt-3 leading-none">
                  <span className="text-[40px] font-bold tracking-[-0.04em] text-[#58ee31] sm:text-[48px]">74</span>
                  <span className="ml-3 text-[14px] font-light text-[#a6a8ae]">/ 100</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#182136]">
                    <div className="h-full w-[74%] rounded-full bg-[#58ee31] shadow-[0_0_10px_#58ee3170]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#b4b6bb] sm:text-[12px]">High Confidence</span>
                </div>
              </div>
              <div className="border-t border-[#182136] px-5 py-5 sm:border-l sm:border-t-0 sm:px-7">
                <p className="max-w-[220px] text-[13px] font-light leading-[1.7] text-[#d7d7da] sm:text-[14px]">
                  Built on layered
                  <br /> research and
                  <br /> human judgment.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#81848d] sm:text-[9px]">
                Signal Coverage
              </p>
              <div className="mt-3 flex items-center gap-7 sm:gap-8">
                {coverageColors.map((color) => (
                  <span
                    key={color}
                    className="group relative h-4 w-4 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-[0_0_20px_#color]"
                    style={{ borderColor: color, boxShadow: `0 0 12px ${color}33` }}
                  >
                    <span
                      className="absolute inset-[3px] rounded-full transition-opacity duration-300 group-hover:opacity-70"
                      style={{ backgroundColor: color, opacity: 0.48 }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="group rounded-[3px] border border-[#182136] bg-[#02050b] p-6 transition-all duration-500 hover:border-[#62ed31]/20 hover:shadow-[0_0_40px_rgba(98,237,49,0.04)] sm:p-7 lg:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#62ee32] sm:text-[11px]">
              Why this spotlight matters
            </p>
            <p className="mt-4 text-[13px] font-light leading-[1.75] text-[#d0d1d5] sm:text-[14px] sm:leading-[1.8]">
              Each week, PrimeIQ features one spotlight analysis that shows how layered research becomes disciplined position-taking.
              This week's spotlight examines recent form, matchup pressure points, market behavior, and scheduling context to identify
              where the board may be mispricing the game.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {evidenceTags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-[3px] border px-3 py-1.5 text-[9px] font-medium leading-none transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_tag] sm:text-[10px]"
                  style={{ 
                    color: tag.color, 
                    borderColor: `${tag.color}99`, 
                    backgroundColor: `${tag.color}08`,
                    boxShadow: `0 0 0px ${tag.color}00`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${tag.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0px ${tag.color}00`;
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <Link
              href="/edge-feed"
              className="group/link mt-7 flex h-12 w-full items-center justify-center rounded-[3px] border-2 border-[#55e72e] text-[11px] font-bold uppercase tracking-[0.05em] text-[#e3e4e6] transition-all duration-300 hover:bg-[#55e72e] hover:text-[#061004] hover:shadow-[0_0_25px_rgba(85,231,46,0.3)] hover:scale-[1.02] active:scale-[0.97] sm:text-[12px]"
            >
              Read the Full Breakdown
              <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}