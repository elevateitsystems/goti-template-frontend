"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign } from "lucide-react";

interface CapitalMomentumChartCardProps {
  data: any[];
}

export function CapitalMomentumChartCard({
  data,
}: CapitalMomentumChartCardProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center gap-2 mb-1">
        <DollarSign className="h-4 w-4" style={{ color: "var(--gold)" }} />
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Capital Momentum
        </h2>
      </div>
      <p
        className="text-xs font-body mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Money flow across betting markets throughout today
      </p>
      <div className="flex gap-4 text-xs font-body mb-4">
        {[
          { label: "Sharp Money", color: "var(--emerald)" },
          { label: "Public Money", color: "var(--intel-blue)" },
          { label: "EV Bets", color: "var(--gold)" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 rounded inline-block"
              style={{ backgroundColor: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="sharpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="publicGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--intel-blue)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--intel-blue)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="hour"
            tick={{
              fontSize: 10,
              fill: "var(--text-muted)",
              fontFamily: "Inter",
            }}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fill: "var(--text-muted)",
              fontFamily: "Inter",
            }}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 11,
            }}
            labelStyle={{ display: "none" }}
          />
          <Area
            type="monotone"
            dataKey="sharp"
            name="Sharp $"
            stroke="var(--emerald)"
            strokeWidth={2}
            fill="url(#sharpGrad)"
          />
          <Area
            type="monotone"
            dataKey="public"
            name="Public $"
            stroke="var(--intel-blue)"
            strokeWidth={2}
            fill="url(#publicGrad)"
          />
          <Area
            type="monotone"
            dataKey="ev"
            name="EV Bets"
            stroke="var(--gold)"
            strokeWidth={2}
            fill="url(#evGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Hot Markets */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-xs font-semibold font-body mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          HOT MARKETS TODAY
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "LAL vs BOS Props",
            "GSW Spread",
            "Jokic REB",
            "Curry 3PM",
            "BOS ML",
          ].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-[10px] font-body font-semibold"
              style={{
                backgroundColor: "var(--emerald-light)",
                color: "var(--emerald)",
              }}
            >
              🔥 {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
