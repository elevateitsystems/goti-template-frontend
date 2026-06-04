"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Radio,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { EdgeFeedItem } from "@/types";
import { URL } from "@/lib/constants";
import Cookies from "js-cookie";

const FEED_TYPES = [
  { key: "all", label: "All Signals", icon: Radio },
  { key: "high_ev", label: "High EV", icon: Zap },
] as const;

type FeedTypeKey = (typeof FEED_TYPES)[number]["key"];

const typeConfig: Record<
  string,
  { color: string; bg: string; label: string; icon: string }
> = {
  high_ev: {
    color: "var(--emerald)",
    bg: "var(--emerald-light)",
    label: "HIGH EV",
    icon: "🟢",
  },
};

export function EdgeFeed() {
  const [activeType, setActiveType] = useState<FeedTypeKey>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edgeEvents, setEdgeEvents] = useState<any[]>([]);

  // Transform API data to flat edge items
  const transformEdgeData = (events: any[]): any[] => {
    const itemsMap = new Map(); // Use Map for deduplication by edgeId
    
    events.forEach((event) => {
      if (event.edges && Array.isArray(event.edges)) {
        event.edges.forEach((edge: any) => {
          // Only add if we haven't seen this edgeId before
          if (!itemsMap.has(edge.edgeId)) {
            itemsMap.set(edge.edgeId, {
              edgeId: edge.edgeId,
              eventId: event.eventId,
              sport: event.sport,
              leagueId: event.leagueId,
              type: edge.type, // Will be "ev" from backend
              market: edge.market,
              outcome: edge.outcome,
              bookmakers: edge.bookmakers,
              sourceType: edge.sourceType,
              sourceRegion: edge.sourceRegion,
              evBet: edge.evBet,
              calculatedAt: event.calculatedAt,
              evPct: edge.evBet?.evPct || 0,
              odds: edge.evBet?.odds,
            });
          }
        });
      }
    });
    
    // Convert Map to array and sort by EV descending
    return Array.from(itemsMap.values()).sort((a, b) => b.evPct - a.evPct);
  };

  // Fetch edge data from API
  useEffect(() => {
    const fetchEdgeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = Cookies.get("token");
        const response = await fetch(`${URL.api}/edge/edge`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Extract events from nested structure: result.data.data
        const events = result.data?.data || [];
        setEdgeEvents(events);
      } catch (err) {
        console.error('Error fetching edge data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch edge data');
        setEdgeEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEdgeData();
  }, []);

  // Combine and filter edge items
  const allItems = useMemo(() => {
    return transformEdgeData(edgeEvents);
  }, [edgeEvents]);

  const filtered = useMemo(() => {
    if (activeType === "all") return allItems;
    return allItems.filter((item) => item.evPct > 0); // Filter high EV
  }, [activeType, allItems]);

  const counts = useMemo(() => {
    return {
      all: allItems.length,
      high_ev: allItems.filter((item) => item.evPct > 0).length,
    };
  }, [allItems]);

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
            {!loading && allItems.length > 0 && (
              <span
                className="badge text-[9px] animate-pulse"
                style={{
                  backgroundColor: "var(--emerald-light)",
                  color: "var(--emerald)",
                }}
              >
                LIVE
              </span>
            )}
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            {loading
              ? "Loading real-time signals..."
              : `Live betting intelligence • ${allItems.length} signal${allItems.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="rounded-[5px] p-4 text-sm flex items-start gap-2"
          style={{
            backgroundColor: "var(--coral-light)",
            color: "var(--coral)",
          }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--emerald)" }} />
          <p style={{ color: "var(--text-muted)" }}>Fetching edge signals...</p>
        </div>
      ) : allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-[5px] p-8" style={{ backgroundColor: "var(--bg-surface)" }}>
          <Radio className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No edge signals available at this time</p>
        </div>
      ) : (
        <>
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
                  ? typeConfig[ft.key]?.color || "var(--emerald)"
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
      <div className="grid grid-cols-1 gap-2">
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
              {counts[type as keyof typeof counts] || 0}
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
          const cfg = typeConfig.high_ev;
          return (
            <div
              key={item.edgeId}
              className="card rounded-[5px] p-4 transition-all hover:border-opacity-50"
              style={{ borderLeft: `3px solid ${cfg.color}` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="badge text-[9px]"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      EV {item.evPct.toFixed(2)}%
                    </span>
                    <span
                      className="text-[10px] font-body px-2 py-0.5 rounded-[5px]"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.market.toUpperCase()}
                    </span>
                    <span
                      className="text-[10px] font-body px-2 py-0.5 rounded-[5px]"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.sport.toUpperCase()}
                    </span>
                    <span
                      className="text-[10px] font-body ml-auto"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(item.calculatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p
                    className="text-sm font-body font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.outcome} @ {item.evBet?.bookmaker}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-body mb-2">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Odds: <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{item.odds}</span>
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      EV: <span style={{ color: "var(--emerald)", fontWeight: 600 }}>{item.evPct.toFixed(2)}%</span>
                    </span>
                    {item.sourceRegion && (
                      <span style={{ color: "var(--text-secondary)" }}>
                        Region: <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{item.sourceRegion}</span>
                      </span>
                    )}
                  </div>
                  {item.bookmakers && item.bookmakers.length > 0 && (
                    <span
                      className="text-[10px] font-body px-2 py-0.5 rounded-[5px]"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Bookmakers: {item.bookmakers.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
