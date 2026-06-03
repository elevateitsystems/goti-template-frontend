"use client";
import {
  AlertOctagon,
  TrendingDown,
  Clock,
  Link2Off,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const traps = [
  {
    title: "Public Betting Traps",
    description: "Following the crowd into artificially inflated lines.",
    icon: AlertOctagon,
  },
  {
    title: "Late Injury News",
    description: "Missing out when a star player sits and the edge shifts.",
    icon: Clock,
  },
  {
    title: "Bad Line Timing",
    description:
      "Betting after the sharp money has already squeezed the value.",
    icon: TrendingDown,
  },
  {
    title: "Poor Correlation Awareness",
    description: "Building parlays with negative mathematical correlation.",
    icon: Link2Off,
  },
  {
    title: "Emotional Decisions",
    description: "Chasing losses instead of trusting positive expected value.",
    icon: BrainCircuit,
  },
];

export function BettorsTrap() {
  return (
    <section
      id="about"
      className="py-24 bg-navy-DEFAULT relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* The Problem */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-xs font-bold uppercase tracking-wider mb-6">
            The Reality
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Most Bettors <span className="text-accent-danger">Bet Blind.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            The books rely on you making the same common mistakes over and over.
            Without real-time data, you are playing a losing game against an
            efficient market.
          </p>

          <div className="space-y-6">
            {traps.map((trap, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-[5px] bg-navy-surface border border-navy-border flex items-center justify-center shrink-0">
                  <trap.icon size={20} className="text-accent-danger" />
                </div>
                <div>
                  <h4 className="text-white font-bold">{trap.title}</h4>
                  <p className="text-sm text-gray-400">{trap.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Solution */}
        <div className="relative">
          <div className="absolute -inset-4 bg-accent-green/20 blur-3xl rounded-full opacity-30" />
          <div className="relative p-10 rounded-[5px] bg-navy-panel border border-accent-green/30 shadow-glow-green">
            <h3 className="text-2xl font-bold text-white mb-6">
              PrimeIQ changes that.
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We level the playing field by giving you access to the same
              tracking systems the syndicates use to spot value and exploit
              inefficiencies.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Track Sharp Money & Steam Moves",
                "Visualize Positive EV in Real-Time",
                "Automatic Injury Adjustments",
                "Measure True Closing Line Value",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent-green" size={20} />
                  <span className="text-white font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="block w-full py-4 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-glow-green text-center"
            >
              Get Your Edge Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
