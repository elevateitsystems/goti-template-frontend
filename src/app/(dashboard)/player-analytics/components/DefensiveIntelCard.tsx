"use client";
import { AlertCircle } from "lucide-react";
import { StatTooltip } from "@/components/charts/StatTooltip";

interface DefensiveIntelCardProps {
  data: {
    defVsPosition: string;
    paintPointsAllowed: number;
    matchupScore: string;
    opponentDefRating: number;
    opponent: string;
    // New fields for specific text
    matchupText?: string;
    isFavorable?: boolean;
  };
}

export function DefensiveIntelCard({ data }: DefensiveIntelCardProps) {
  // Use provided text or fallback to generating one based on score
  const isFavorable =
    data.isFavorable ??
    (data.matchupScore === "Favorable" ||
      data.matchupScore === "Highly Favorable");
  const matchupText =
    data.matchupText ??
    (isFavorable
      ? `The ${data.opponent} rank ${data.defVsPosition} against opposing players in this category. This is a highly favorable matchup.`
      : `The ${data.opponent} rank ${data.defVsPosition} defensively. This matchup projects as difficult.`);

  return (
    <div
      className="card rounded-[5px] p-5 relative overflow-hidden flex flex-col"
      style={{ minHeight: 220 }}
    >
      <h3
        className="font-display text-sm font-semibold mb-3 shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Defensive Intelligence
      </h3>

      {/* Active Top Area: Explicit Matchup Insight */}
      <div
        className="mb-4 rounded-[5px] p-3 flex items-start gap-3 border"
        style={{
          backgroundColor: isFavorable
            ? "var(--emerald-light)"
            : "var(--coral-light)",
          borderColor: isFavorable
            ? "rgba(27,67,50,0.2)"
            : "rgba(192,57,43,0.2)",
        }}
      >
        <AlertCircle
          className="h-4 w-4 shrink-0 mt-0.5"
          style={{ color: isFavorable ? "var(--emerald)" : "var(--coral)" }}
        />
        <p
          className="text-xs font-body font-medium leading-relaxed"
          style={{ color: "var(--text-primary)" }}
        >
          {matchupText}
        </p>
      </div>

      {/* Stat Area */}
      <div className="space-y-2 mt-auto">
        {[
          { label: "DEF vs Position", value: data.defVsPosition },
          {
            label: (
              <StatTooltip stat="PITP">
                <span>Pts Allowed (PITP)</span>
              </StatTooltip>
            ),
            value: data.paintPointsAllowed,
          },
          { label: "Opponent DEF RTG", value: data.opponentDefRating },
          { label: "Opponent", value: data.opponent },
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-1.5 border-b text-xs font-body"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
