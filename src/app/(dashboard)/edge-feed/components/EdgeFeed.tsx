"use client";
import { useState, useMemo } from "react";
import {
  Radio,
  Zap,
  Flame,
  AlertTriangle,
  TrendingUp,
  ArrowRightLeft,
  Eye,
} from "lucide-react";
import { nbaEdgeFeed } from "@/data/nba";
import type { EdgeFeedItem } from "@/types";

const FEED_TYPES = [
  { key: "all", label: "All Signals", icon: Radio },
  { key: "high_ev", label: "High EV", icon: Zap },
  { key: "steam_move", label: "Steam Moves", icon: Flame },
  { key: "line_movement", label: "Line Move", icon: TrendingUp },
  { key: "injury", label: "Injury", icon: ArrowRightLeft },
] as const;

type FeedTypeKey = (typeof FEED_TYPES)[number]["key"];

const typeConfig: Record<
  EdgeFeedItem["type"],
  { color: string; bg: string; label: string; icon: string }
> = {
  high_ev: {
    color: "var(--emerald)",
    bg: "var(--emerald-light)",
    label: "HIGH EV",
    icon: "🟢",
  },
  steam_move: {
    color: "var(--coral)",
    bg: "var(--coral-light)",
    label: "STEAM MOVE",
    icon: "🔴",
  },
  line_movement: {
    color: "var(--intel-blue)",
    bg: "var(--intel-blue-light)",
    label: "LINE MOVE",
    icon: "🔵",
  },
  injury: {
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    label: "INJURY",
    icon: "🟠",
  },
};

export function EdgeFeed() {
  const [activeType, setActiveType] = useState<FeedTypeKey>("all");

  const filtered = useMemo(() => {
    if (activeType === "all") return nbaEdgeFeed;
    return nbaEdgeFeed.filter((item) => item.type === activeType);
  }, [activeType]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: nbaEdgeFeed.length };
    nbaEdgeFeed.forEach((item) => {
      c[item.type] = (c[item.type] || 0) + 1;
    });
    return c;
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-[5px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--coral), #E5395D)",
              }}
            >
              <Radio className="h-4 w-4 text-white" />
            </div>
            <h1
              className="font-display text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Edge Feed
            </h1>
            <span
              className="badge text-[9px] animate-pulse"
              style={{
                backgroundColor: "var(--emerald-light)",
                color: "var(--emerald)",
              }}
            >
              LIVE
            </span>
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Real-time betting intelligence signals • {nbaEdgeFeed.length}{" "}
            signals today
          </p>
        </div>
      </div>

      {/* Signal Type Filters */}
      <div className="flex flex-wrap gap-1.5">
        {FEED_TYPES.map((ft) => (
          <button
            key={ft.key}
            onClick={() => setActiveType(ft.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
            style={{
              backgroundColor:
                activeType === ft.key
                  ? ft.key === "all"
                    ? "var(--emerald)"
                    : typeConfig[ft.key as EdgeFeedItem["type"]]?.color ||
                      "var(--emerald)"
                  : "var(--bg-surface)",
              color: activeType === ft.key ? "white" : "var(--text-secondary)",
              border: `1px solid ${activeType === ft.key ? "transparent" : "var(--border)"}`,
            }}
          >
            <ft.icon className="h-3 w-3" />
            {ft.label}
            <span className="opacity-70">({counts[ft.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Signal Count Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(typeConfig).map(([type, cfg]) => (
          <div
            key={type}
            className="card rounded-[5px] p-3 text-center cursor-pointer transition-all hover:opacity-80"
            onClick={() => setActiveType(type as FeedTypeKey)}
          >
            <p className="text-lg mb-0.5">{cfg.icon}</p>
            <p
              className="text-xs font-body font-bold"
              style={{ color: cfg.color }}
            >
              {counts[type] || 0}
            </p>
            <p
              className="text-[9px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {cfg.label}
            </p>
          </div>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const cfg = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className="card rounded-[5px] p-4 transition-all hover:border-opacity-50"
              style={{ borderLeft: `3px solid ${cfg.color}` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="badge text-[9px]"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    {item.urgency === "high" && (
                      <span
                        className="badge text-[9px]"
                        style={{
                          backgroundColor: "var(--coral-light)",
                          color: "var(--coral)",
                        }}
                      >
                        URGENT
                      </span>
                    )}
                    {item.relatedGame && (
                      <span
                        className="text-[10px] font-body"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.relatedGame}
                      </span>
                    )}
                    <span
                      className="text-[10px] font-body ml-auto"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.timestamp}
                    </span>
                  </div>
                  <p
                    className="text-sm font-body font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs font-body leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                  {item.relatedPlayer && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-body px-2 py-0.5 rounded-[5px]"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Player:{" "}
                        <span
                          style={{
                            color: "var(--text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {item.relatedPlayer}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
