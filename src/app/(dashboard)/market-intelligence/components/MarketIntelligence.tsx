"use client";
import { useMemo } from "react";
import { Activity, Sparkles, Gauge, RefreshCw, BarChart3 } from "lucide-react";
import { useGetAllQuery } from "@/redux/api/userApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { MarketTimingSignals } from "./MarketTimingSignals";
import { VolatilityHeatmap } from "./VolatilityHeatmap";
import { CapitalMomentumChartCard } from "./CapitalMomentumChartCard";
import { MarketActivityPulse } from "./MarketActivityPulse";
import { MarketTrapDetector } from "./MarketTrapDetector";

function normalizeBestBets(response: any) {
  const raw = response?.data;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  return [];
}

function getTeamMatchupTitle(bet: any) {
  const team =
    bet.team ||
    bet.teamName ||
    bet.teamAbbr ||
    bet.homeTeamName ||
    bet.homeTeam ||
    bet.raw?.team ||
    bet.raw?.teamName ||
    bet.raw?.teamAbbr;
  const opponent =
    bet.opponent ||
    bet.opponentTeam ||
    bet.awayTeamName ||
    bet.awayTeam ||
    bet.raw?.opponent ||
    bet.raw?.opponentTeam;

  if (team && opponent) {
    return `${team} vs ${opponent}`;
  }

  return bet.game || `${team || "Team"} vs ${opponent || "Opp"}`;
}

function buildMarketSignals(bets: any[]) {
  if (!bets.length) return [];

  const steam = bets.find((bet) => (bet.edge || 0) >= 8);
  const drift = bets.find((bet) => (bet.edge || 0) >= 5 && (bet.edge || 0) < 8);
  const fade = bets.find((bet) => (bet.hitRate || 0) < 55 || (bet.confidence || 0) < 60);

  return [
    {
      type: "Sharp Money Pressure",
      icon: "trending",
      color: "emerald",
      desc: steam
        ? `High-edge signal in ${steam.team || "market"} with a ${steam.edge}% edge.`
        : "No extreme sharp pressure is present in the current feed.",
      games: [steam ? `${steam.team || "Team"} vs ${steam.opponent || "Opp"}` : "No active signal"],
    },
    {
      type: "Value Drift",
      icon: "alert",
      color: "intel",
      desc: drift
        ? `Market drift detected on ${drift.team || "market"}. Live odds are shifting toward value.`
        : "Value drift remains stable across the latest best bets.",
      games: [drift ? `${drift.team || "Team"} vs ${drift.opponent || "Opp"}` : "No drift"],
    },
    {
      type: "Public Reaction",
      icon: "clock",
      color: "coral",
      desc: fade
        ? `Public sentiment is softening on ${fade.team || "market"} after ${fade.hitRate || 0}% hit rate.`
        : "No major public overreaction registered in the feed.",
      games: [fade ? `${fade.team || "Team"} vs ${fade.opponent || "Opp"}` : "Stable"],
    },
  ];
}

function buildVolatilityData(bets: any[]) {
  return bets.slice(0, 6).map((bet: any, index: number) => {
    const edge = Math.max(0, Math.round((bet.edge || 0) * 10));
    return {
      game: getTeamMatchupTitle(bet),
      volatility: edge >= 80 ? "high" : edge >= 50 ? "moderate" : "low",
      pct: Math.min(100, Math.max(8, edge)),
      change: `${edge >= 0 ? "+" : ""}${Math.round((bet.edge || 0) * 1.25)}%`,
    };
  });
}

function buildMomentumData(bets: any[]) {
  return bets.slice(0, 7).map((bet: any, index: number) => ({
    hour: `${6 + index}AM`,
    sharp: Math.max(0, Math.round((bet.edge || 0) * 10)),
    public: Math.max(0, Math.round((bet.edge || 0) * 8)),
    ev: Math.max(0, Math.round((bet.edge || 0) * 6)),
  }));
}

function buildPulseStats(bets: any[]) {
  const total = bets.length;
  const highEdge = bets.filter((bet: any) => (bet.edge || 0) >= 8).length;
  const avgEdge = total
    ? ((bets.reduce((sum: number, bet: any) => sum + (bet.edge || 0), 0) / total) || 0).toFixed(1)
    : "0.0";
  const avgConfidence = total
    ? Math.round(bets.reduce((sum: number, bet: any) => sum + (bet.confidence || 0), 0) / total)
    : 0;
  const activity = Math.max(1, Math.round(total * 1.4));

  return [
    { label: "Live Markets", value: `${total}`, color: "var(--emerald)" },
    { label: "Steam Alerts", value: `${highEdge}`, color: "var(--coral)" },
    { label: "Average Edge", value: `+${avgEdge}%`, color: "var(--gold)" },
    { label: "Confidence", value: `${avgConfidence}%`, color: "var(--intel-blue)" },
    { label: "Activity Pulse", value: `${activity}`, color: "var(--text-secondary)" },
  ];
}

export function MarketIntelligence() {
  const { data: betsResponse, isLoading, error, refetch } = useGetAllQuery({
    path: "best-bets/best-bets",
  });

  const bets = useMemo(() => normalizeBestBets(betsResponse), [betsResponse]);
  const marketSignals = useMemo(() => buildMarketSignals(bets), [bets]);
  const volatilityData = useMemo(() => buildVolatilityData(bets), [bets]);
  const momentumData = useMemo(() => buildMomentumData(bets), [bets]);
  const pulseStats = useMemo(() => buildPulseStats(bets), [bets]);

  return (
    <div className="p-4 md:p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-white shadow-lg">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-semibold">
                  Market intelligence
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
                  Live analytics
                </h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Every chart and signal is derived from active backend market data. This dashboard pulls live best bets and movement analytics to keep your edge sharp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh analytics
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signal strength</p>
                {isLoading ? (
                  <Skeleton className="mt-2" height={32} width={86} />
                ) : (
                  <p className="mt-2 text-2xl font-semibold text-white">{bets.length ? `${Math.min(100, bets.length * 7)}%` : "—"}</p>
                )}
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Real-time market momentum bets percentage.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live markets</p>
                {isLoading ? (
                  <Skeleton className="mt-2" height={32} width={64} />
                ) : (
                  <p className="mt-2 text-2xl font-semibold text-white">{bets.length}</p>
                )}
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Gauge className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Aggregated active best bets powering the trap detector and volatility models.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Average edge</p>
                {isLoading ? (
                  <Skeleton className="mt-2" height={32} width={90} />
                ) : (
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {bets.length
                      ? `+${((bets.reduce((sum: number, bet: any) => sum + (bet.edge || 0), 0) / bets.length) || 0).toFixed(1)}%`
                      : "—"}
                  </p>
                )}
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-300">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Live edge averages from the active best-bets feed.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Confidence pulse</p>
                {isLoading ? (
                  <Skeleton className="mt-2" height={32} width={82} />
                ) : (
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {bets.length
                      ? `${Math.round(bets.reduce((sum: number, bet: any) => sum + (bet.confidence || 0), 0) / bets.length)}%`
                      : "—"}
                  </p>
                )}
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-400/10 text-slate-200">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Confidence score from the backend model flow.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="card rounded-[5px] p-5 space-y-4">
            <Skeleton height={18} width={180} />
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton height={72} />
              <Skeleton height={72} />
              <Skeleton height={72} />
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <HeatmapSkeleton />
            <HeatmapSkeleton />
          </div>
          <div className="card rounded-[5px] p-5">
            <div className="grid gap-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={64} />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-200">
          Unable to load live analytics. Please refresh the page.
        </div>
      ) : (
        <div className="space-y-6">
          {/* <MarketTrapDetector /> */}
          <MarketTimingSignals signals={marketSignals} />
          <div className="grid gap-6 xl:grid-cols-2">
            <VolatilityHeatmap data={volatilityData} />
            <CapitalMomentumChartCard data={momentumData} />
          </div>
          <MarketActivityPulse stats={pulseStats} />
        </div>
      )}
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <div className="card rounded-[5px] p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton height={18} width={180} />
        <Skeleton height={12} width="70%" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[5px] p-3 space-y-3"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton height={16} width="55%" />
              <Skeleton height={16} width={48} />
            </div>
            <Skeleton height={8} />
          </div>
        ))}
      </div>
    </div>
  );
}
