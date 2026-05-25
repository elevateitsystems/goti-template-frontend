"use client";
import {
  Filter,
  Trophy,
  LayoutGrid,
  ShieldAlert,
  Zap,
  Users,
  LineChart,
  Bell,
  Target,
  Search,
  PieChart,
  Activity,
  Star,
} from "lucide-react";

const features = [
  {
    title: "Smart Bet Rating Engine",
    description:
      "Summarizes multiple signals—projections, hit rates, matchups, and market value—into a single clear rating.",
    icon: Star,
    color: "text-accent-green",
    highlight: true,
  },
  {
    title: "Prop Category Filters",
    description:
      "Advanced filtering for Points, Assists, Rebounds, PRA, 3PM, and game splits (1H, 1Q, Ladder Props).",
    icon: Filter,
    color: "text-accent-blue",
  },
  {
    title: "Top Plays & Best Bets",
    description:
      "The highest value bets each day based on model edge, probability, and hit rate trends.",
    icon: Trophy,
    color: "text-accent-gold",
  },
  {
    title: "Parlay Builder",
    description:
      "Combine multiple props with real-time probability, true odds, and correlation risk alerts.",
    icon: LayoutGrid,
    color: "text-accent-blue",
  },
  {
    title: "Player Matchup Impact",
    description:
      "Deep defensive metrics: rankings vs. position, points allowed, and 3-point defense efficiency.",
    icon: Users,
    color: "text-accent-green",
  },

  {
    title: "DFS Integration",
    description:
      "Compare projections with DraftKings and FanDuel pricing to highlight the best DFS value plays.",
    icon: Target,
    color: "text-accent-green",
  },
  {
    title: "Market Trap Detector",
    description:
      "Identify reverse line movement and public betting conflicts to avoid the traps.",
    icon: Search,
    color: "text-accent-gold",
  },
  {
    title: "Daily Betting Dashboard",
    description:
      "Your daily mission control: high EV props, sharp plays, public traps, and steam moves.",
    icon: PieChart,
    color: "text-accent-blue",
  },
  {
    title: "Edge Feed",
    description:
      "A live scrolling feed of the most important betting signals happening in the market right now.",
    icon: ShieldAlert,
    color: "text-accent-green",
  },
];

export function AdvancedTools() {
  return (
    <section id="advanced-tools" className="py-24 bg-navy-DEFAULT relative border-t border-navy-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Advanced <span className="text-accent-blue">Intelligence</span> Tools
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Go deeper with specialized analytics designed for edge cases, derivatives, and granular market data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-[5px] border transition-all duration-300 group hover:-translate-y-1 ${
                feature.highlight
                  ? "bg-navy-panel border-accent-green/30 shadow-glow-green lg:col-span-1"
                  : "bg-navy-panel/50 border-navy-border hover:border-accent-green/30"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-12 h-12 rounded-[5px] bg-navy-surface flex items-center justify-center border border-navy-border group-hover:scale-110 transition-transform ${feature.color}`}
                >
                  <feature.icon size={24} />
                </div>

                {feature.highlight && (
                  <span className="whitespace-nowrap text-[10px] px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20 uppercase tracking-widest">
                    Key Differentiator
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
