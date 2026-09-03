// Admin.tsx
"use client";
import { useState } from "react";
import {
  Users,
  DollarSign,
  Sparkles,
  ClipboardList,
  CalendarDays,
  Film,
  Inbox,
  LayoutDashboard,
  Quote,
} from "lucide-react";
import { OverviewTabContent } from "./OverviewTabContent";
import { UserManagementTabContent } from "./UserManagementTabContent";
import { SubscriptionsTabContent } from "./SubscriptionsTabContent";
import { PlansTabContent } from "./PlansTabContent";
import { PlayManagementTabContent } from "./PlayManagementTabContent";
import { DailyCardsTabContent, RequestsInboxTabContent, TestimonialsTabContent, VideosTabContent } from "./PhaseOneAdminTabs";

type Tab = "overview" | "plays" | "cards" | "videos" | "requests" | "reviews" | "users" | "subscriptions" | "plans";

export function Admin() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "plays",
      label: "Play Management",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    { key: "cards", label: "Daily Cards", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "videos", label: "Videos", icon: <Film className="h-4 w-4" /> },
    { key: "requests", label: "Member Requests", icon: <Inbox className="h-4 w-4" /> },
    { key: "reviews", label: "Reviews", icon: <Quote className="h-4 w-4" /> },
    {
      key: "users",
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      key: "plans",
      label: "Pricing Plans",
      icon: <Sparkles className="h-4 w-4" />,
    },
    // { key: 'prop-setter', label: 'Prop of the Day', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto min-h-full max-w-[1440px] space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Dashboard
          </h1>
          <p
            className="text-sm font-body mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Platform management & analytics
          </p>
        </div>
        <span
          className="badge px-3 py-1.5 text-xs"
          style={{
            backgroundColor: "var(--coral-light)",
            color: "var(--coral)",
            border: "1px solid var(--coral)",
          }}
        >
          🔒 Admin Only
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 overflow-x-auto border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-body font-medium transition-all border-b-2 -mb-px"
            style={{
              borderBottomColor:
                tab === t.key ? "var(--emerald)" : "transparent",
              color: tab === t.key ? "var(--emerald)" : "var(--text-muted)",
            }}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTabContent />}
      {tab === "plays" && <PlayManagementTabContent />}
      {tab === "cards" && <DailyCardsTabContent />}
      {tab === "videos" && <VideosTabContent />}
      {tab === "requests" && <RequestsInboxTabContent />}
      {tab === "reviews" && <TestimonialsTabContent />}
      {tab === "users" && <UserManagementTabContent />}
      {tab === "subscriptions" && <SubscriptionsTabContent />}
      {tab === "plans" && <PlansTabContent />}
    </div>
  );
}
