"use client";
import { Bell } from "lucide-react";

interface NotificationsSectionProps {
  notifications: any;
  setNotifications: (v: any) => void;
}

export function NotificationsSection({
  notifications,
  setNotifications,
}: NotificationsSectionProps) {
  const items = [
    {
      key: "email",
      label: "Email notifications",
      desc: "Daily briefing and line alerts",
    },
    { key: "push", label: "Push notifications", desc: "Real-time steam moves" },
    {
      key: "evAlerts",
      label: "+EV Alerts",
      desc: "When new high-EV props are available",
    },
    {
      key: "steamAlerts",
      label: "Steam Move Alerts",
      desc: "Sharp money multi-book sync",
    },
  ];

  return (
    <div className="card rounded-[5px] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" style={{ color: "var(--emerald)" }} />
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Notifications
        </h3>
      </div>
      <div className="gold-divider opacity-50" />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-body font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {item.label}
              </p>
              <p
                className="text-xs font-body"
                style={{ color: "var(--text-muted)" }}
              >
                {item.desc}
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev: any) => ({
                  ...prev,
                  [item.key]: !prev[item.key],
                }))
              }
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{
                backgroundColor: notifications[item.key]
                  ? "var(--emerald)"
                  : "var(--border)",
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                style={{
                  transform: notifications[item.key]
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
