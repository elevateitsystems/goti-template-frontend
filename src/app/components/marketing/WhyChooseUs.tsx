"use client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function WhyChooseUs() {
  const benefits = [
    "Institutional grade data processing",
    "Real-time injury & usage adjustments",
    "Advanced parlay correlation engine",
    "Market-leading CLV tracking",
    "Proprietary Smart Bet Rating Engine",
    "Sharp money & steam move alerts",
  ];

  return (
    <section className="py-24 bg-navy-DEFAULT relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Stop Guessing.{" "}
            <span className="text-accent-green">Start Winning.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            PropEdge isn't just another props tool. We provide the same caliber
            of data and analytics used by professional betting syndicates,
            simplified into actionable intelligence.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-accent-green" size={20} />
                <span className="text-gray-300 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <Link 
            href="/dashboard"
            className="inline-block mt-10 px-8 py-4 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold hover:scale-105 transition-all shadow-glow-green text-center"
          >
            Join PropEdge Pro
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-accent-green/20 blur-3xl rounded-full opacity-30" />
          <div className="relative p-10 rounded-[5px] bg-navy-panel border border-navy-border shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Market Advantage</h3>
              <span className="text-xs font-bold text-accent-green uppercase tracking-widest px-2 py-1 rounded bg-accent-green/10 border border-accent-green/20">
                Active
              </span>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: "PropEdge Users",
                  value: "84%",
                  color: "bg-accent-green",
                  width: "w-[84%]",
                },
                {
                  label: "Public Bettors",
                  value: "42%",
                  color: "bg-navy-border",
                  width: "w-[42%]",
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                    <span>{item.label} Win Rate</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="h-3 w-full bg-navy-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} ${item.width} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-[5px] bg-navy-surface border border-navy-border italic text-gray-400 text-sm">
              "The Smart Bet Rating Engine changed my entire approach. I no
              longer waste time on low-probability props."
              <div className="mt-4 font-bold text-white not-italic">
                — Professional Bettor
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
