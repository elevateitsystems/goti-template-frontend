"use client";
import { Activity, Database, RefreshCw, Zap } from "lucide-react";

const stats = [
  {
    value: "< 50ms",
    label: "Data Processing Speed",
    icon: Zap,
  },
  {
    value: "40+",
    label: "Sportsbooks Monitored",
    icon: Database,
  },
  {
    value: "Real-Time",
    label: "Live Market Updates",
    icon: RefreshCw,
  },
  {
    value: "Instant",
    label: "Injury Adjustments",
    icon: Activity,
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 border-y border-navy-border bg-navy-DEFAULT relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-navy-surface border border-navy-border flex items-center justify-center mb-4 text-accent-green">
                <stat.icon size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
