"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface HitRateChartProps {
  data: any[];
  displayLine: number;
  viewMode: "avg" | "median";
  selectedStat: string;
  hitRate: number;
  hitCount: number;
}

export function HitRateChart({
  data,
  displayLine,
  viewMode,
  selectedStat,
  hitRate,
  hitCount,
}: HitRateChartProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Hit Rate — Last {data.length} Games
          </h3>
          <p
            className="text-xs font-body mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {selectedStat} vs {displayLine.toFixed(1)} line ·{" "}
            <span
              style={{
                color: hitRate >= 50 ? "var(--emerald)" : "var(--coral)",
              }}
            >
              {hitRate}% ({hitCount}/{data.length})
            </span>
          </p>
        </div>
        <div className="flex gap-2 text-xs font-body">
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: "var(--emerald)" }}
            />{" "}
            Hit
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: "var(--coral)" }}
            />{" "}
            Miss
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="game"
            tick={{
              fontSize: 10,
              fill: "var(--text-muted)",
              fontFamily: "Inter",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fill: "var(--text-muted)",
              fontFamily: "Inter",
            }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={false}
            labelStyle={{ display: "none" }}
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "Inter",
            }}
            formatter={(
              value: number,
              _: string,
              entry: { payload?: { hit?: boolean } },
            ) => [value + " PTS", entry.payload?.hit ? "✅ Hit" : "❌ Miss"]}
          />
          <ReferenceLine
            y={displayLine}
            stroke="var(--gold)"
            strokeDasharray="4 3"
            strokeWidth={2}
            label={{
              value: `${viewMode === "avg" ? "AVG" : "MED"} ${displayLine.toFixed(1)}`,
              fontSize: 9,
              fill: "var(--gold)",
              fontFamily: "Inter",
            }}
          />
          <Bar
            dataKey="value"
            radius={[3, 3, 0, 0]}
            opacity={0.7}
            activeBar={{ opacity: 1 }}
          >
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.hit ? "var(--emerald)" : "var(--coral)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
