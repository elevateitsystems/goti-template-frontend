"use client";

export function SubscriptionsTabContent() {
  const subStats = [
    {
      plan: "Free",
      count: 8241,
      revenue: "$0",
      color: "var(--text-muted)",
      pct: 66,
    },
    {
      plan: "Pro",
      count: 3892,
      revenue: "$77,840",
      color: "var(--gold)",
      pct: 31,
    },
    {
      plan: "Institutional",
      count: 350,
      revenue: "$34,650",
      color: "var(--intel-blue)",
      pct: 3,
    },
  ];

  const recentActivity = [
    {
      action: "✅ New Pro",
      user: "Jessica Martinez",
      time: "2 hours ago",
      amount: "+$20/mo",
    },
    {
      action: "⬆️ Upgraded",
      user: "Robert Taylor",
      time: "5 hours ago",
      amount: "Free → Pro",
    },
    {
      action: "❌ Cancelled",
      user: "Emily Brown",
      time: "1 day ago",
      amount: "-$20/mo",
    },
    {
      action: "✅ New Institutional",
      user: "Mike Williams Inc.",
      time: "2 days ago",
      amount: "+$99/mo",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subStats.map((s, i) => (
          <div key={i} className="card rounded-[5px] p-5">
            <div className="flex justify-between items-start mb-3">
              <p
                className="font-display text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {s.plan}
              </p>
              <span
                className="text-sm font-body font-semibold"
                style={{ color: s.color }}
              >
                {s.pct}%
              </span>
            </div>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {s.count.toLocaleString()}
            </p>
            <p
              className="text-xs font-body mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              users
            </p>
            <div
              className="h-2 rounded-full mt-3 overflow-hidden"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              />
            </div>
            <p
              className="text-sm font-body font-semibold mt-2"
              style={{ color: "var(--emerald)" }}
            >
              {s.revenue}
            </p>
          </div>
        ))}
      </div>

      <div className="card rounded-[5px] p-5">
        <h3
          className="font-display text-sm font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Recent Subscription Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((ev, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-[5px]"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-body font-medium flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {ev.action} — {ev.user}
              </p>
              <span
                className="text-xs font-body"
                style={{ color: "var(--text-muted)" }}
              >
                {ev.time}
              </span>
              <span
                className="text-sm font-body font-bold"
                style={{
                  color: ev.amount.startsWith("+")
                    ? "var(--emerald)"
                    : ev.amount.startsWith("-")
                      ? "var(--coral)"
                      : "var(--gold)",
                }}
              >
                {ev.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
