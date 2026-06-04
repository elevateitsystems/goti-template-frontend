"use client";
import { useMemo } from "react";
import { RefreshCw, AlertCircle, Activity } from "lucide-react";
import { useGetAllQuery } from "@/redux/api/userApi";

function getSignal(edge: number, rating?: string) {
  if (rating === "A" || edge >= 8) return "steam";
  if (edge >= 5) return "drift";
  return "fade";
}

function formatBookOdds(odds: any) {
  if (!odds || typeof odds !== "object") return "N/A";
  const entry = Object.entries(odds)[0];
  if (!entry) return "N/A";
  const [book, value] = entry;
  const formatted = typeof value === "number" ? `${value > 0 ? `+${value}` : value}` : value;
  return `${book}: ${formatted}`;
}

export function MarketTrapDetector() {
  const { data: betsResponse, isLoading, error, refetch } = useGetAllQuery({
    path: "best-bets/best-bets",
  });

  const bets = useMemo(() => {
    const raw = betsResponse?.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.data)) return raw.data;
    return [];
  }, [betsResponse]);

  const uniqueBets = useMemo(() => {
    const map = new Map<string, any>();
    bets.forEach((bet: any) => {
      const id = bet.id || `${bet.playerName || bet.player}-${bet.propCategory || bet.category}-${bet.line}-${bet.team}-${bet.opponent}`;
      if (!map.has(id)) {
        map.set(id, bet);
      }
    });
    return Array.from(map.values());
  }, [bets]);

  const sortedBets = useMemo(() => {
    return [...uniqueBets].sort((a: any, b: any) => (b.edge || 0) - (a.edge || 0));
  }, [uniqueBets]);

  const topSignals = useMemo(() => sortedBets.slice(0, 4), [sortedBets]);

  const summary = useMemo(() => {
    const total = uniqueBets.length;
    const steam = uniqueBets.filter((bet: any) => getSignal(bet.edge || 0, bet.rating) === "steam").length;
    const avgEdge = total ? (uniqueBets.reduce((sum: number, bet: any) => sum + (bet.edge || 0), 0) / total).toFixed(1) : "0.0";
    return { total, steam, avgEdge };
  }, [uniqueBets]);

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: "var(--intel-blue)" }} />
          <div>
            <h3 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              True Line Movement Engine
            </h3>
            <p className="text-[11px] font-body" style={{ color: "var(--text-muted)" }}>
              Best bets power trap detection and live market edge signals.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="badge text-[9px]"
            style={{
              backgroundColor: "var(--intel-blue-light)",
              color: "var(--intel-blue)",
            }}
          >
            {summary.steam} STEAM SIGNAL{summary.steam !== 1 ? "S" : ""}
          </span>
          <span
            className="badge text-[9px]"
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
            }}
          >
            {summary.total} TRAP ALERT{summary.total !== 1 ? "S" : ""}
          </span>
          <span
            className="badge text-[9px]"
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
            }}
          >
            +{summary.avgEdge}% AVG EDGE
          </span>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-[5px] text-[10px] font-semibold"
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
          <span className="text-xs text-gray-400">Loading market trap signals...</span>
        </div>
      ) : error ? (
        <div className="card rounded-[5px] p-6 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-red-400 animate-bounce" />
          <div>
            <h4 className="text-sm font-bold text-white">Unable to load Market Trap data</h4>
            <p className="text-xs text-gray-400 mt-1">
              Something went wrong with the backend request. Please try again.
            </p>
          </div>
        </div>
      ) : topSignals.length === 0 ? (
        <div className="card rounded-[5px] p-6 text-center text-gray-400">
          No market trap detector signals are available right now.
        </div>
      ) : (
        <div className="space-y-3">
          {topSignals.map((bet: any) => {
            const rating = bet.rating || (bet.edge >= 8 ? "A" : bet.edge >= 5 ? "B+" : "B");
            const signal = getSignal(bet.edge || 0, bet.rating);
            const game = bet.game || `${bet.team || "Team"} vs ${bet.opponent || "Opp"}`;
            const prop = bet.prop || bet.playerName || bet.player || "Market Bet";
            const label = bet.propCategory || bet.category || "Points";
            const oddsLabel = formatBookOdds(bet.odds);

            return (
              <div
                key={bet.id || `${game}-${prop}-${bet.line}-${label}`}
                className="rounded-[5px] p-4"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: `1px solid ${signal === "steam" ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {game}
                      </span>
                      <span
                        className="badge text-[10px]"
                        style={{
                          backgroundColor: signal === "steam" ? "var(--intel-blue-light)" : "var(--bg-card)",
                          color: signal === "steam" ? "var(--intel-blue)" : "var(--text-secondary)",
                        }}
                      >
                        {signal === "steam" ? "🔥 STEAM" : signal === "drift" ? "↗️ DRIFT" : "📉 FADE"}
                      </span>
                    </div>
                    <p className="text-[11px] font-body text-gray-400">{prop}</p>
                  </div>
                  <span
                    className="badge text-xs font-bold px-2.5 py-1"
                    style={{
                      backgroundColor: rating === "A" ? "rgba(16,185,129,0.15)" : "rgba(250,204,21,0.15)",
                      color: rating === "A" ? "var(--emerald)" : "var(--gold)",
                    }}
                  >
                    {rating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-[10px] font-body text-gray-400">
                  <div className="rounded-[5px] px-3 py-2 bg-[#13151a]">
                    <p>Market</p>
                    <p className="text-sm font-semibold text-white">{label}</p>
                  </div>
                  <div className="rounded-[5px] px-3 py-2 bg-[#13151a]">
                    <p>Odds</p>
                    <p className="text-sm font-semibold text-white">{oddsLabel}</p>
                  </div>
                  <div className="rounded-[5px] px-3 py-2 bg-[#13151a]">
                    <p>Line</p>
                    <p className="text-sm font-semibold text-white">{bet.line ?? "N/A"}</p>
                  </div>
                  <div className="rounded-[5px] px-3 py-2 bg-[#13151a]">
                    <p>Confidence</p>
                    <p className="text-sm font-semibold text-white">{bet.confidence ?? "N/A"}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-2 py-2 rounded-[5px] px-3 bg-[#15171f]">
                  <div>
                    <p className="text-[10px] text-gray-500">Edge</p>
                    <p className="text-sm font-bold text-emerald-400">+{bet.edge ?? 0}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Hit Rate</p>
                    <p className="text-sm font-bold text-emerald-400">{bet.hitRate ?? "N/A"}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Projection</p>
                    <p className="text-sm font-bold" style={{ color: (bet.projection ?? 0) >= (bet.line ?? 0) ? "var(--emerald)" : "var(--coral)" }}>
                      {bet.projection ?? "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-body text-gray-400">
                  <span>{bet.team || "Team"} vs {bet.opponent || "Opp"}</span>
                  <span>{bet.hitFraction || "--"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
