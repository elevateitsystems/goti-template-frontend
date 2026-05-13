"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Shield, CreditCard } from "lucide-react";
import { AccountDetailsSection } from "./AccountDetailsSection";
import { NotificationsSection } from "./NotificationsSection";

export function Profile() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    evAlerts: true,
    steamAlerts: true,
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1
          className="font-display text-2xl md:text-3xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </h1>
        <p
          className="text-sm font-body mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="card rounded-[5px] p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold font-body"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            JD
          </div>
          <div>
            <h2
              className="font-display text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              John Doe
            </h2>
            <p
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              john@example.com
            </p>
            <span
              className="mt-1 badge text-xs px-2 py-0.5"
              style={{
                backgroundColor: "var(--gold-light)",
                color: "var(--gold)",
                border: "1px solid var(--gold)",
              }}
            >
              Pro Plan
            </span>
          </div>
          <button className="ml-auto btn-outline text-sm">Edit Profile</button>
        </div>
      </div>

      <AccountDetailsSection />

      {/* Appearance Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Appearance
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Theme
            </p>
            <p
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Currently {theme === "light" ? "Light" : "Dark"} mode
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex items-center gap-2 px-4 py-2 rounded-[5px] border text-sm font-body font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <NotificationsSection
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Subscription Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Subscription
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-[5px]"
            style={{
              backgroundColor: "var(--gold-light)",
              border: "1px solid var(--gold)",
            }}
          >
            <div>
              <p
                className="text-sm font-body font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Pro Plan
              </p>
              <p
                className="text-xs font-body"
                style={{ color: "var(--text-muted)" }}
              >
                $20/month · Renews Apr 12, 2026
              </p>
            </div>
            <span
              className="badge text-white text-[9px]"
              style={{ backgroundColor: "var(--gold)" }}
            >
              ACTIVE
            </span>
          </div>
          <button className="btn-outline text-sm w-full py-2">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Security
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        <div className="space-y-2">
          <button className="btn-outline text-sm w-full py-2">
            Change Password
          </button>
          <button className="btn-outline text-sm w-full py-2">
            Enable Two-Factor Auth
          </button>
        </div>
      </div>
    </div>
  );
}
