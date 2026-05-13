"use client";
import { TrendingUp, TrendingDown, Flame } from "lucide-react";

const volatilityConfig = {
  high: {
    label: "HIGH",
    bg: "var(--coral-light)",
    color: "var(--coral)",
    bar: "var(--coral)",
  },
  moderate: {
    label: "MOD",
    bg: "var(--gold-light)",
    color: "var(--gold)",
    bar: "var(--gold)",
  },
  low: {
    label: "LOW",
    bg: "var(--emerald-light)",
    color: "var(--emerald)",
    bar: "var(--emerald)",
  },
};

interface VolatilityHeatmapProps {
  data: any[];
}

export function VolatilityHeatmap({ data }: VolatilityHeatmapProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-4 w-4" style={{ color: "var(--coral)" }} />
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Volatility Heatmap
        </h2>
      </div>
      <p
        className="text-xs font-body mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Markets with fastest line movement, volume spikes &amp; sentiment shifts
      </p>
      <div className="space-y-3">
        {data.map((item, i) => {
          const cfg = (volatilityConfig as any)[item.volatility];
          const isPositive = item.change.startsWith("+");
          return (
            <div
              key={i}
              className="rounded-[5px] p-3"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="badge text-[9px]"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    className="text-sm font-semibold font-body"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.game}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isPositive ? (
                    <TrendingUp
                      className="h-3 w-3"
                      style={{ color: "var(--coral)" }}
                    />
                  ) : (
                    <TrendingDown
                      className="h-3 w-3"
                      style={{ color: "var(--emerald)" }}
                    />
                  )}
                  <span
                    className="text-xs font-semibold font-body"
                    style={{
                      color: isPositive ? "var(--coral)" : "var(--emerald)",
                    }}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
              <div
                className="relative h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, backgroundColor: cfg.bar }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Volatility Index
                </span>
                <span
                  className="text-[10px] font-body font-semibold"
                  style={{ color: cfg.color }}
                >
                  {item.pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
