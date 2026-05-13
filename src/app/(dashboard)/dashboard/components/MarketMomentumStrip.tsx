"use client";
import { TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";

interface MarketMomentumStripProps {
  data: any[];
}

const trendIcon = (trend: "rising" | "fading" | "neutral") =>
  trend === "rising" ? (
    <TrendingUp className="h-3 w-3" />
  ) : trend === "fading" ? (
    <TrendingDown className="h-3 w-3" />
  ) : (
    <Minus className="h-3 w-3" />
  );

export function MarketMomentumStrip({ data }: MarketMomentumStripProps) {
  return (
    <div className="card rounded-[5px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-3.5 w-3.5" style={{ color: "var(--coral)" }} />
        <h2
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Market Momentum
        </h2>
        <span
          className="ml-auto text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          Sharp vs public flow
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {data.map((item, i) => {
          const trendColor =
            item.trend === "rising"
              ? "var(--emerald)"
              : item.trend === "fading"
                ? "var(--coral)"
                : "var(--text-muted)";
          return (
            <div
              key={i}
              className="shrink-0 rounded-[5px] px-4 py-3 min-w-[160px]"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span style={{ color: trendColor }}>
                  {trendIcon(item.trend)}
                </span>
                <p
                  className="text-xs font-semibold font-body truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.game}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-body"
                    style={{ color: "var(--emerald)" }}
                  >
                    Sharp {item.sharpPct}%
                  </span>
                  <span
                    className="text-[10px] font-body"
                    style={{ color: "var(--intel-blue)" }}
                  >
                    Public {item.publicPct}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.sharpPct}%`,
                      background:
                        "linear-gradient(90deg, var(--emerald), var(--intel-blue))",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="text-[10px] font-bold font-body"
                    style={{ color: trendColor }}
                  >
                    {item.momentum}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
