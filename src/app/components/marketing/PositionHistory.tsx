import Link from "next/link";

const spotlightHistory = [
  { date: "MAY 12, 2025", spotlight: "NYK vs IND", position: "2.0% – 2.5%", score: "121 – 111", result: "WIN" },
  { date: "MAY 8, 2025", spotlight: "BOS vs CLE", position: "1.5% – 2.0%", score: "112 – 103", result: "WIN" },
  { date: "MAY 3, 2025", spotlight: "DAL vs OKC", position: "1.5% – 2.0%", score: "105 – 101", result: "WIN" },
  { date: "APR 29, 2025", spotlight: "MIN vs DEN", position: "1.5% – 2.0%", score: "115 – 112", result: "WIN" },
  { date: "APR 24, 2025", spotlight: "PHX vs LAC", position: "1.0% – 1.5%", score: "102 – 107", result: "LOSS" },
] as const;

export function PositionHistory() {
  return (
    <section className="relative bg-[#010208] px-4 py-12 text-white sm:px-6 lg:px-10 lg:py-16">
      {/* Premium gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-[1440px] border-y border-[#151e31] px-6 py-12 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[380px_minmax(0,1fr)] xl:gap-20">
          <header>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#62ed31] sm:text-[12px]">
              Track. Learn. Repeat.
            </p>
            <h2 className="mt-5 max-w-[360px] text-[38px] font-bold leading-[1.08] tracking-[-0.05em] text-[#ffffff] sm:text-[44px] lg:text-[48px]">
              The <span className="text-[#62ed31]">position</span> came first.
              <br />
              The game followed.
            </h2>
            <p className="mt-4 max-w-[320px] text-[13px] font-light leading-[1.6] text-[#a7a9b0] sm:text-[14px]">
              Every move is measured. Every outcome is data.
            </p>
          </header>

          <div className="min-w-0">
            <div className="mb-8 flex justify-end pr-1">
              <Link 
                href="/results" 
                className="group inline-flex items-center gap-3 text-[12px] font-medium tracking-[0.02em] text-[#d5d5d7] transition-all duration-300 hover:text-[#62ed31] sm:text-[13px]"
              >
                Scroll for history 
                <span 
                  aria-hidden="true" 
                  className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                >
                  →
                </span>
              </Link>
            </div>

            <div className="overflow-x-auto rounded-[3px] border border-[#172037] bg-[#02050b] shadow-[inset_0_0_60px_#62ed3105]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="h-[60px] border-b border-[#172037] bg-gradient-to-r from-[#02050b] to-[#0a0f1f] text-[10px] font-bold uppercase tracking-[0.08em] text-[#c8c9cd] sm:text-[11px]">
                    <th className="whitespace-nowrap px-6 font-bold sm:px-7">Date</th>
                    <th className="whitespace-nowrap px-5 font-bold">Spotlight</th>
                    <th className="whitespace-nowrap px-5 font-bold">Position Size</th>
                    <th className="whitespace-nowrap px-5 font-bold">Final Score</th>
                    <th className="whitespace-nowrap px-5 font-bold sm:px-7">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {spotlightHistory.map((row, index) => {
                    const isWin = row.result === "WIN";
                    const isLast = index === spotlightHistory.length - 1;
                    
                    return (
                      <tr 
                        key={`${row.date}-${row.spotlight}`} 
                        className={`group h-[56px] border-b border-[#172037] transition-all duration-300 hover:bg-[#0a0f1f] hover:shadow-[inset_0_0_40px_#62ed3108] ${
                          isLast ? "last:border-b-0" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-6 text-[11px] font-medium text-[#d1d2d6] sm:px-7 sm:text-[12px]">
                          {row.date}
                        </td>
                        <td className="whitespace-nowrap px-5 text-[12px] font-semibold text-[#f0f0f2] sm:text-[13px]">
                          {row.spotlight}
                        </td>
                        <td className="whitespace-nowrap px-5 text-[11px] text-[#dedee0] sm:text-[12px]">
                          <span className="rounded-full border border-[#172037] px-3 py-0.5 text-[10px] font-medium tracking-[0.02em] sm:text-[11px]">
                            {row.position}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 text-[11px] font-medium text-[#dedee0] sm:text-[12px]">
                          {row.score}
                        </td>
                        <td
                          className={`whitespace-nowrap px-5 text-[12px] font-bold sm:px-7 sm:text-[13px] ${
                            isWin ? "text-[#4cec20]" : "text-[#f0002d]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span 
                              className={`inline-block h-1.5 w-1.5 rounded-full ${
                                isWin ? "bg-[#4cec20] shadow-[0_0_8px_#4cec2070]" : "bg-[#f0002d] shadow-[0_0_8px_#f0002d70]"
                              }`}
                            />
                            <span aria-hidden="true">{isWin ? "▲" : "▼"}</span> {row.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}