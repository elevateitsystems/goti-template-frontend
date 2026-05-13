"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PointsHistoryChartProps {
  data: any[];
}

export function PointsHistoryChart({ data }: PointsHistoryChartProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <h3
        className="font-display text-sm font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Points — Last 12 Games vs 29.5 Line
      </h3>
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
            }}
            formatter={(value: number) => [`${value} PTS`]}
          />
          <Bar
            dataKey="value"
            radius={[3, 3, 0, 0]}
            opacity={0.7}
            activeBar={{ opacity: 1 }}
          >
            {data.map((e, i) => (
              <Cell key={i} fill={e.hit ? "var(--emerald)" : "var(--coral)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
