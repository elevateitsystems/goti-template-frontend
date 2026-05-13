"use client";
import type { MatchupData } from "@/types";
import { Shield, Target } from "lucide-react";

interface MatchupImpactCardProps {
  matchup: MatchupData;
}

export function MatchupImpactCard({ matchup }: MatchupImpactCardProps) {
  const diffColor =
    matchup.difficulty === "easy"
      ? "var(--emerald)"
      : matchup.difficulty === "medium"
        ? "var(--gold)"
        : "var(--coral)";
  const diffBg =
    matchup.difficulty === "easy"
      ? "var(--emerald-light)"
      : matchup.difficulty === "medium"
        ? "var(--gold-light)"
        : "var(--coral-light)";

  const metrics = [
    { label: "PTS Allowed", value: matchup.pointsAllowed, max: 35 },
    { label: "REB Allowed", value: matchup.reboundsAllowed, max: 14 },
    { label: "AST Allowed", value: matchup.assistsAllowed, max: 9 },
    { label: "3PT Def %", value: matchup.threePtDefense, max: 42 },
  ];

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: "var(--intel-blue)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Matchup Impact
          </h3>
        </div>
        <span
          className="badge text-[10px] font-bold px-2 py-0.5"
          style={{ backgroundColor: diffBg, color: diffColor }}
        >
          {matchup.difficulty.toUpperCase()} MATCHUP
        </span>
      </div>

      <div
        className="flex items-center gap-2 mb-4 p-2.5 rounded-[5px]"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <Target
          className="h-3.5 w-3.5"
          style={{ color: "var(--text-muted)" }}
        />
        <span
          className="text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          vs{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {matchup.opponentTeam}
          </strong>{" "}
          • Def Rank{" "}
          <strong style={{ color: diffColor }}>
            #{matchup.defRankVsPosition}
          </strong>
        </span>
      </div>

      {/* Stat Bars */}
      <div className="space-y-3">
        {metrics.map((m) => {
          const pct = Math.min((m.value / m.max) * 100, 100);
          const barColor =
            pct >= 70
              ? "var(--emerald)"
              : pct >= 50
                ? "var(--gold)"
                : "var(--coral)";
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[11px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  {m.label}
                </span>
                <span
                  className="text-xs font-body font-bold"
                  style={{ color: barColor }}
                >
                  {m.value}
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pace & Efficiency */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div
          className="p-2.5 rounded-[5px] text-center"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <p
            className="text-[10px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Pace
          </p>
          <p
            className="text-sm font-body font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {matchup.pace}
          </p>
        </div>
        <div
          className="p-2.5 rounded-[5px] text-center"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <p
            className="text-[10px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Def Efficiency
          </p>
          <p
            className="text-sm font-body font-bold"
            style={{
              color:
                matchup.defEfficiency >= 112
                  ? "var(--emerald)"
                  : "var(--coral)",
            }}
          >
            {matchup.defEfficiency}
          </p>
        </div>
      </div>
    </div>
  );
}
