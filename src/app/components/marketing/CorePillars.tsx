"use client";

import { Zap, Activity, LineChart } from "lucide-react";

const pillars = [
  {
    title: "Sharp Money & Steam Tracking",
    description:
      "Detect when professional syndicates hit a line. See exactly where the big money is flowing before the sportsbooks adjust their odds.",
    icon: LineChart,
    color: "text-accent-blue",
    bg: "bg-accent-blue/10 border-accent-blue/20",
  },
  {
    title: "Correlation + EV Engine",
    description:
      "Mathematically identify the true expected value of every prop and build parlays using optimal statistical correlations.",
    icon: Zap,
    color: "text-accent-gold",
    bg: "bg-accent-gold/10 border-accent-gold/20",
  },
  {
    title: "Real-Time Injury Adjustments",
    description:
      "The moment a star player is ruled out, our engine recalculates usage rates and stat projections for the entire team in seconds.",
    icon: Activity,
    color: "text-accent-danger",
    bg: "bg-accent-danger/10 border-accent-danger/20",
  },
];

export function CorePillars() {
  return (
    <section className="py-24 bg-navy-DEFAULT border-t border-navy-border/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            The Three Pillars of{" "}
            <span className="text-accent-green">Profitability</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            Everything you need to beat the market, stripped down to the core
            essentials.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group relative bg-navy-surface rounded-[5px] border border-navy-border hover:border-accent-green/30 shadow-2xl p-8 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-accent-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border mb-6 ${pillar.bg} ${pillar.color}`}
                >
                  <pillar.icon size={24} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {pillar.title}
                </h3>

                <p className="text-gray-400 leading-relaxed flex-1">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}