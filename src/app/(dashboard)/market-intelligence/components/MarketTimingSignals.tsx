"use client";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface MarketTimingSignalsProps {
  signals: any[];
}

const signalIcons: Record<string, React.ReactNode> = {
  clock: <Clock className="h-4 w-4" />,
  trending: <TrendingUp className="h-4 w-4" />,
  alert: <TrendingDown className="h-4 w-4" />,
};

const signalColors: Record<string, string> = {
  emerald: "var(--emerald)",
  intel: "var(--intel-blue)",
  coral: "var(--coral)",
};

const signalBg: Record<string, string> = {
  emerald: "var(--emerald-light)",
  intel: "var(--intel-blue-light)",
  coral: "var(--coral-light)",
};

export function MarketTimingSignals({ signals }: MarketTimingSignalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {signals.map((sig, i) => (
        <div
          key={i}
          className="card rounded-[5px] p-5"
          style={{ borderTop: `3px solid ${signalColors[sig.color]}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-[5px] flex items-center justify-center"
              style={{
                backgroundColor: signalBg[sig.color],
                color: signalColors[sig.color],
              }}
            >
              {signalIcons[sig.icon]}
            </div>
            <p
              className="text-sm font-semibold font-body"
              style={{ color: signalColors[sig.color] }}
            >
              {sig.type}
            </p>
          </div>
          <p
            className="text-xs font-body leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {sig.desc}
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {sig.games.map((g: string) => (
              <span
                key={g}
                className="badge"
                style={{
                  backgroundColor: signalBg[sig.color],
                  color: signalColors[sig.color],
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
