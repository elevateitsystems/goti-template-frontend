// OverviewTabcontent.tsx
"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OverviewTabContentProps {
  stats: any[];
  revenueData: any[];
}

export function OverviewTabContent({
  stats,
  revenueData,
}: OverviewTabContentProps) {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card rounded-[5px] p-5">
            <p
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {s.label}
            </p>
            <p
              className="font-display text-2xl font-bold mt-1"
              style={{ color: "var(--text-primary)" }}
            >
              {s.value}
            </p>
            <p
              className="text-xs font-body mt-1"
              style={{ color: s.positive ? "var(--emerald)" : "var(--coral)" }}
            >
              {s.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card rounded-[5px] p-5">
        <h2
          className="font-display text-base font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Revenue & Users — 2025-26
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={revenueData}
            margin={{ top: 5, right: 8, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--emerald)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fontSize: 11,
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
              width={50}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={false}
              labelStyle={{ display: "none" }}
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "Inter",
              }}
              formatter={(v: number, name: string) => [
                name === "revenue"
                  ? `$${v.toLocaleString()}`
                  : v.toLocaleString(),
                name === "revenue" ? "Revenue" : "Users",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="var(--emerald)"
              strokeWidth={2.5}
              fill="url(#revGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
