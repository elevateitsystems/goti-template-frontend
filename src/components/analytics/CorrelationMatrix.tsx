"use client";
import { GitBranch } from "lucide-react";
import type { PlayerCorrelation } from "@/types";

interface CorrelationMatrixProps {
  correlations: PlayerCorrelation[];
}

export function CorrelationMatrix({ correlations }: CorrelationMatrixProps) {
  const sorted = [...correlations].sort(
    (a, b) => Math.abs(b.correlation) - Math.abs(a.correlation),
  );

  function getCorrelationColor(corr: number): string {
    if (corr >= 0.6) return "var(--emerald)";
    if (corr >= 0.3) return "var(--intel-blue)";
    if (corr >= 0) return "var(--text-secondary)";
    if (corr > -0.3) return "var(--gold)";
    return "var(--coral)";
  }

  function getCorrelationBg(corr: number): string {
    if (corr >= 0.6) return "var(--emerald-light)";
    if (corr >= 0.3) return "var(--intel-blue-light)";
    if (corr >= 0) return "var(--bg-surface)";
    if (corr > -0.3) return "var(--gold-light)";
    return "var(--coral-light)";
  }

  function getStrength(corr: number): string {
    const abs = Math.abs(corr);
    if (abs >= 0.6) return "Strong";
    if (abs >= 0.4) return "Moderate";
    if (abs >= 0.2) return "Weak";
    return "Negligible";
  }

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="h-4 w-4" style={{ color: "var(--intel-blue)" }} />
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Player Correlation Engine
        </h3>
      </div>

      <p
        className="text-[11px] font-body mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Correlations between player outcomes — use for smarter parlay
        construction
      </p>

      <div className="space-y-2">
        {sorted.map((corr, i) => {
          const color = getCorrelationColor(corr.correlation);
          const bg = getCorrelationBg(corr.correlation);
          const strength = getStrength(corr.correlation);
          const barWidth = Math.abs(corr.correlation) * 100;

          return (
            <div
              key={i}
              className="p-3 rounded-[5px]"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {corr.playerA}
                  </span>
                  <span
                    className="text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ↔
                  </span>
                  <span
                    className="text-xs font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {corr.playerB}
                  </span>
                </div>
                <span
                  className="badge text-[10px] font-bold"
                  style={{ backgroundColor: bg, color }}
                >
                  {corr.correlation > 0 ? "+" : ""}
                  {(corr.correlation * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-body px-1.5 py-0.5 rounded-[5px]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-muted)",
                  }}
                >
                  {corr.statA}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  ↔
                </span>
                <span
                  className="text-[10px] font-body px-1.5 py-0.5 rounded-[5px]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-muted)",
                  }}
                >
                  {corr.statB}
                </span>
                <span
                  className="text-[9px] font-body ml-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  {corr.sampleSize} games
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
                <span
                  className="text-[9px] font-body font-semibold"
                  style={{ color }}
                >
                  {strength}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
