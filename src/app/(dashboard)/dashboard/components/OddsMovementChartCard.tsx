"use client";
import { OddsLineChart } from "@/components/charts/OddsLineChart";

interface OddsMovementChartCardProps {
  data: any[];
}

export function OddsMovementChartCard({ data }: OddsMovementChartCardProps) {
  return (
    <div className="lg:col-span-2 card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="font-display text-lg font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Player Odds Movement
          </h2>
          <p
            className="text-xs font-body mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            LeBron James — Points Market
          </p>
        </div>
        <div className="flex gap-3 text-xs font-body">
          <span className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 rounded inline-block"
              style={{ backgroundColor: "var(--emerald)" }}
            />{" "}
            Sharp
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 rounded inline-block"
              style={{
                backgroundColor: "var(--coral)",
                borderTop: "2px dashed var(--coral)",
              }}
            />{" "}
            Public
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <OddsLineChart
            data={data}
            xKey="day"
            line1Key="optimal"
            line2Key="public"
            line1Label="Sharp Line"
            line2Label="Public Line"
            height={200}
          />
        </div>
        <div className="md:w-44 space-y-2">
          {[
            { label: "Over 29.5 PTS", odds: "-120" },
            { label: "Over 8.5 AST", odds: "+190" },
            { label: "Triple Double", odds: "+480" },
          ].map((p, i) => (
            <div
              key={i}
              className="rounded-[5px] px-3 py-2.5"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-[11px] font-body"
                style={{ color: "var(--text-muted)" }}
              >
                {p.label}
              </p>
              <p
                className="text-lg font-body font-bold mt-0.5"
                style={{
                  color: p.odds.startsWith("+")
                    ? "var(--emerald)"
                    : "var(--coral)",
                }}
              >
                {p.odds}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
