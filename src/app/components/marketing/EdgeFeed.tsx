"use client";
import { useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Target,
} from "lucide-react";

const signals = [
  {
    type: "High EV Prop",
    content: "Nikola Jokic Over 11.5 Rebounds — Edge +4.2%, Hit Rate 64%",
    icon: Target,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
  {
    type: "Steam Move",
    content:
      "Nuggets -3 moved to -4.5 across sportsbooks (Strong Steam detected)",
    icon: Zap,
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
  },
  {
    type: "Public Trap",
    content:
      "82% of bets on Lakers but line moving toward Celtics. Avoid public side.",
    icon: AlertTriangle,
    color: "text-accent-danger",
    bg: "bg-accent-danger/10",
  },
  {
    type: "Sharp Money",
    content:
      "Warriors spread large wagers detected at -4.0. Sharp money confirmed.",
    icon: ShieldAlert,
    color: "text-accent-gold",
    bg: "bg-accent-gold/10",
  },
  {
    type: "Trending Prop",
    content:
      "Curry Over 4.5 Threes most bet prop today across all sportsbooks.",
    icon: TrendingUp,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
];

export function EdgeFeed() {
  return (
    <section className="py-20 bg-navy-panel border-y border-navy-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-danger animate-pulse" />
          <span className="text-accent-danger text-sm font-bold uppercase tracking-widest">
            Live Signals
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white">Edge Feed</h2>
        <p className="text-gray-400">Real-time market intelligence stream.</p>
      </div>

      <div className="relative flex">
        {/* Continuous Scrolling Wrapper */}
        <div className="flex animate-scroll whitespace-nowrap gap-6 py-4">
          {[...signals, ...signals].map((signal, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-4 px-6 py-4 rounded-[5px] bg-navy-surface border border-navy-border min-w-[400px]"
            >
              <div
                className={`w-10 h-10 rounded-full ${signal.bg} flex items-center justify-center ${signal.color}`}
              >
                <signal.icon size={20} />
              </div>
              <div>
                <div
                  className={`text-[10px] font-bold uppercase tracking-widest ${signal.color} mb-0.5`}
                >
                  {signal.type}
                </div>
                <div className="text-sm font-medium text-white">
                  {signal.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
