"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  X,
  Check,
  TrendingUp,
  Zap,
  AlertTriangle,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  markRead,
  markAllRead,
  dismissAlert,
  type Alert,
} from "@/redux/features/alertsSlice";

const pageTitles: Record<string, string> = {
  "/dashboard": "Daily Betting Dashboard",
  "/prop-explorer": "Prop Category Filters",
  "/top-plays": "Top Plays / Best Bets Section",
  "/parlay-builder": "Parlay Builder",
  "/player-analytics": "Player Matchup Impact",
  "/edge-feed": "Edge Feed",
  "/market-intelligence": "Market Trap Detector",
  "/clv-tracker": "Closing Line Value (CLV) Tracker",
  "/dfs": "DFS Integration",
  "/profile": "Profile",
  "/admin": "Admin Dashboard",
};

const alertIcons: Record<Alert["type"], typeof TrendingUp> = {
  line_movement: TrendingUp,
  sharp_money: Zap,
  injury: AlertTriangle,
  ev_threshold: Activity,
};

const alertColors: Record<Alert["type"], string> = {
  line_movement: "var(--intel-blue)",
  sharp_money: "var(--emerald)",
  injury: "var(--coral)",
  ev_threshold: "var(--gold)",
};

export function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alerts.alerts);
  const unreadCount = alerts.filter((a) => !a.read).length;
  const [showAlerts, setShowAlerts] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[pathname] || "PrimeIQ Intelligence";

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowAlerts(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b md:px-6 shrink-0"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-[5px] transition-colors hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu className="h-4 w-4" />
        </button>
        <Link href="/" className="flex items-center gap-2 md:hidden hover:opacity-80 transition-opacity">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--emerald), var(--emerald-hover))",
            }}
          >
            <span className="text-white font-bold text-xs font-body">PE</span>
          </div>
          <span
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            PrimeIQ
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-sm border"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs font-body">Search players...</span>
          <kbd className="ml-4 text-[10px] px-1.5 py-0.5 rounded border font-body" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>⌘K</kbd>
        </div> */}

        {/* Alerts Bell — Feature #8 */}
        <div className="relative" ref={panelRef}>
          {/* <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative w-8 h-8 rounded-[5px] flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: "var(--coral)" }}
              >
                {unreadCount}
              </span>
            )}
          </button> */}

          {/* Alerts Panel */}
          {showAlerts && (
            <div
              className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-[5px] border shadow-2xl overflow-hidden z-50"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* Panel Header */}
              {/* <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <h3
                    className="text-sm font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Alerts
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      className="badge text-[9px]"
                      style={{
                        backgroundColor: "var(--coral-light)",
                        color: "var(--coral)",
                      }}
                    >
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllRead())}
                      className="text-[10px] font-body font-semibold px-2 py-1 rounded-[5px] flex items-center gap-1 transition-colors"
                      style={{
                        color: "var(--emerald)",
                        backgroundColor: "var(--emerald-light)",
                      }}
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-[5px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div> */}

              {/* Alert Items */}
              {/* <div className="max-h-80 overflow-y-auto">
                {alerts.map((alert) => {
                  const Icon = alertIcons[alert.type];
                  const color = alertColors[alert.type];
                  return (
                    <div
                      key={alert.id}
                      className="px-4 py-3 flex gap-3 transition-colors cursor-pointer hover:bg-white/[0.02]"
                      style={{
                        borderBottom: "1px solid var(--border)",
                        backgroundColor: alert.read
                          ? "transparent"
                          : "rgba(0,229,168,0.03)",
                      }}
                      onClick={() => dispatch(markRead(alert.id))}
                    >
                      <div
                        className="w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-body font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {alert.title}
                        </p>
                        <p
                          className="text-[10px] font-body mt-0.5 leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {alert.message}
                        </p>
                        <p
                          className="text-[9px] font-body mt-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {alert.timestamp}
                        </p>
                      </div>
                      {!alert.read && (
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: "var(--emerald)" }}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(dismissAlert(alert.id));
                        }}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div> */}

              {/* Panel Footer */}
              {/* <div
                className="px-4 py-2.5 border-t text-center"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Line movement • Sharp money • Injury • EV threshold alerts
                </p>
              </div> */}
            </div>
          )}
        </div>

        {/* <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-body"
          style={{ backgroundColor: "var(--emerald)" }}
        >
          JD
        </div> */}
      </div>
    </header>
  );
}
