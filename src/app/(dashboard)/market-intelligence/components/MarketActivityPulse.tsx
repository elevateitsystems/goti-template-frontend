"use client";

export function MarketActivityPulse() {
  const stats = [
    { label: "Total Volume", value: "$4.2M", color: "var(--emerald)" },
    { label: "Sharp Bets", value: "1,847", color: "var(--emerald)" },
    { label: "Line Moves", value: "34", color: "var(--gold)" },
    { label: "Steam Alerts", value: "6", color: "var(--coral)" },
    { label: "EV+ Props", value: "8", color: "var(--intel-blue)" },
    {
      label: "Market Efficiency",
      value: "74%",
      color: "var(--text-secondary)",
    },
  ];

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Market Activity Pulse
        </h2>
        <span
          className="text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          Updated every 30 seconds
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center py-3 px-2 rounded-[5px]"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xl font-bold font-body"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p
              className="text-[10px] font-body mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
