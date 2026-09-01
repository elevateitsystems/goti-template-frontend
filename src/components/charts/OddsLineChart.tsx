"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface OddsLineChartProps {
  data: any[];
  xKey: string;
  line1Key: string;
  line2Key: string;
  line1Label?: string;
  line2Label?: string;
  height?: number;
  showLegend?: boolean;
}

export function OddsLineChart({
  data,
  xKey,
  line1Key,
  line2Key,
  line1Label = "Sharp Line",
  line2Label = "Public Line",
  height = 200,
  showLegend = false,
}: OddsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{
            fontSize: 11,
            fill: "var(--text-muted)",
            fontFamily: "Nunito, sans-serif",
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{
            fontSize: 10,
            fill: "var(--text-muted)",
            fontFamily: "Nunito, sans-serif",
          }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "Nunito, sans-serif",
            color: "var(--text-primary)",
            boxShadow: "var(--card-shadow)",
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "Nunito, sans-serif" }}
          />
        )}
        <Line
          type="monotone"
          dataKey={line1Key}
          stroke="var(--emerald)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: "var(--emerald)" }}
          name={line1Label}
        />
        <Line
          type="monotone"
          dataKey={line2Key}
          stroke="var(--coral)"
          strokeWidth={2}
          dot={false}
          strokeDasharray="4 3"
          activeDot={{ r: 4, fill: "var(--coral)" }}
          name={line2Label}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
