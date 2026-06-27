"use client";

import { useGetAllQuery, useGetByIdQuery } from "@/redux/api/userApi";
import { Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Gauge,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MatchupSearchCard,
  PlayerOption,
} from "./components/MatchupSearchCard";

type MatchupAnalysis = {
  playerId: string;
  stats: unknown[];
  activeProps: Array<{
    id?: string;
    playerId?: string;
    playerName: string;
    category: string;
    side: string;
    line: number;
    sportsbook: string;
    edgePercent: number;
    ratingScore: number;
    hitRate?: number;
    recommendation?: string;
    odds: number;
  }>;
  source?: string;
  note?: string;
};

const formatStatValue = (value: any) => {
  if (value === undefined || value === null || value === "") return "N/A";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(3);
  }
  return String(value);
};

const percent = (value: number | undefined | null) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "N/A";
  }
  return `${Number(value).toFixed(1)}%`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "MI";

const clampScore = (value: number) => Math.max(4, Math.min(96, value));

export default function MatchupImpactPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: playerPropsResponse, isLoading: loadingPlayers } =
    useGetAllQuery({ path: "player-props" }, { skip: false });

  const playerOptions = useMemo(() => {
    const rawPlayerPropsPayload = playerPropsResponse?.data;
    const events = Array.isArray(rawPlayerPropsPayload)
      ? rawPlayerPropsPayload
      : rawPlayerPropsPayload?.data ||
        rawPlayerPropsPayload?.results ||
        rawPlayerPropsPayload?.items ||
        rawPlayerPropsPayload?.players ||
        [];

    const players = events.flatMap((event: any) => {
      const rawPlayers =
        event.players || event.Players || event.playerProps || [];
      const eventLabel =
        `${event.homeTeamName || ""} vs ${event.awayTeamName || ""}`.trim();

      return rawPlayers.map(
        (player: any) =>
          ({
            id:
              player.playerId ||
              player.id ||
              player.player ||
              player.playerName ||
              player.guid ||
              player.externalId ||
              "",
            label:
              player.playerName ||
              player.name ||
              player.player ||
              player.fullName ||
              "",
            teamAbbr:
              player.teamAbbr ||
              player.teamName ||
              player.team ||
              event.homeTeamName ||
              event.awayTeamName ||
              "",
            teamName:
              player.teamName ||
              player.team ||
              player.teamAbbr ||
              event.homeTeamName ||
              event.awayTeamName ||
              "",
            position: player.position || player.positionName || "",
            eventId: event.eventId || event.canonicalEventId || "",
            eventLabel,
            sport: event.sport || "",
            leagueId: event.leagueId || "",
            marketCount: player.markets?.length ?? 0,
          }) as PlayerOption,
      );
    });

    const unique = new Map<string, PlayerOption>();
    players.forEach((player: PlayerOption) => {
      if (player.id && !unique.has(player.id)) {
        unique.set(player.id, player);
      }
    });

    return Array.from(unique.values());
  }, [playerPropsResponse]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = debouncedSearch.toLowerCase();

    const results = playerOptions.filter((player) =>
      normalizedSearch
        ? player.label.toLowerCase().includes(normalizedSearch) ||
          player.id.toLowerCase().includes(normalizedSearch) ||
          player.teamName.toLowerCase().includes(normalizedSearch) ||
          player.teamAbbr.toLowerCase().includes(normalizedSearch) ||
          player.position.toLowerCase().includes(normalizedSearch) ||
          player.eventLabel.toLowerCase().includes(normalizedSearch) ||
          player.sport.toLowerCase().includes(normalizedSearch)
        : true,
    );

    return results.slice(0, 20);
  }, [playerOptions, debouncedSearch]);

  const selectPlayer = (player: PlayerOption) => {
    setSelectedPlayerId(player.id);
    setSearchInput(player.label);
    setDropdownOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) {
      return;
    }

    const match = playerOptions.find(
      (player) =>
        player.label.toLowerCase() === trimmed.toLowerCase() ||
        player.id.toLowerCase() === trimmed.toLowerCase(),
    );

    if (match) {
      selectPlayer(match);
      return;
    }

    setSelectedPlayerId(
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/(^-|-$)/g, ""),
    );
    setDropdownOpen(false);
  };

  const {
    data: matchupResponse,
    isLoading,
    error,
    refetch,
  } = useGetByIdQuery(
    { path: "analysis/matchups", id: selectedPlayerId },
    { skip: !selectedPlayerId },
  );

  const currentMatchup = useMemo(() => {
    const body = matchupResponse?.data;
    return (body?.data || body || null) as MatchupAnalysis | null;
  }, [matchupResponse]);

  const activeProps = currentMatchup?.activeProps ?? [];
  const statsData = currentMatchup?.stats ?? [];
  const propsCount = activeProps.length;
  const statsCount = statsData.length;
  const selectedPlayer = useMemo(
    () =>
      playerOptions.find((player) => player.id === selectedPlayerId) || null,
    [playerOptions, selectedPlayerId],
  );
  const matchupStatsRecord = (statsData[0] || null) as Record<
    string,
    any
  > | null;

  const playerName =
    selectedPlayer?.label ||
    activeProps[0]?.playerName ||
    currentMatchup?.playerId ||
    "Select a player";
  const playerTeam = selectedPlayer?.teamAbbr || selectedPlayer?.teamName || "Team";
  const leagueLabel =
    selectedPlayer?.leagueId?.toUpperCase() ||
    selectedPlayer?.sport?.toUpperCase() ||
    "LIVE";

  const bestEdgeProp = useMemo(() => {
    if (!activeProps.length) return null;
    return activeProps.reduce((best, prop) => {
      const currentEdge =
        typeof prop.edgePercent === "number" ? prop.edgePercent : -Infinity;
      const bestEdge =
        typeof best.edgePercent === "number" ? best.edgePercent : -Infinity;
      return currentEdge > bestEdge ? prop : best;
    }, activeProps[0]);
  }, [activeProps]);

  const averageHitRate = useMemo(() => {
    const rates = activeProps
      .map((prop) => Number(prop.hitRate ?? 0))
      .filter((value) => !Number.isNaN(value) && value > 0);
    return rates.length
      ? Math.round(rates.reduce((sum, value) => sum + value, 0) / rates.length)
      : null;
  }, [activeProps]);

  const hitting = matchupStatsRecord?.stats?.hitting || {};
  const statSummary = useMemo(
    () => [
      {
        label: "Props",
        value: propsCount,
        helper: "active lines",
        icon: Target,
        color: "var(--emerald)",
      },
      {
        label: "Best Edge",
        value: bestEdgeProp ? percent(bestEdgeProp.edgePercent) : "N/A",
        helper: bestEdgeProp?.sportsbook || "waiting",
        icon: TrendingUp,
        color: "var(--gold)",
      },
      {
        label: "Hit Rate",
        value: averageHitRate ? `${averageHitRate}%` : "N/A",
        helper: "prop average",
        icon: Gauge,
        color: "var(--intel-blue)",
      },
      {
        label: "Records",
        value: statsCount,
        helper: "stat rows",
        icon: BarChart3,
        color: "var(--coral)",
      },
    ],
    [averageHitRate, bestEdgeProp, propsCount, statsCount],
  );

  const chartData = useMemo(() => {
    if (activeProps.length) {
      return activeProps.slice(0, 10).map((prop, index) => ({
        name: prop.category || `Prop ${index + 1}`,
        edge: Number(prop.edgePercent || 0),
        rating: Number(prop.ratingScore || 0),
        hitRate: Number(prop.hitRate || 0),
      }));
    }

    return [
      { name: "Edge", edge: 7.4, rating: 72, hitRate: 58 },
      { name: "Pace", edge: 3.2, rating: 63, hitRate: 54 },
      { name: "Usage", edge: 5.9, rating: 68, hitRate: 61 },
      { name: "Defense", edge: -2.1, rating: 44, hitRate: 47 },
      { name: "Market", edge: 4.8, rating: 66, hitRate: 57 },
      { name: "Form", edge: 6.3, rating: 71, hitRate: 62 },
    ];
  }, [activeProps]);

  const barData = useMemo(() => {
    if (activeProps.length) {
      return activeProps.slice(0, 12).map((prop, index) => ({
        name: prop.category?.slice(0, 8) || `${index + 1}`,
        value: Math.round(Number(prop.hitRate || prop.ratingScore || 45)),
        fill:
          Number(prop.edgePercent || 0) >= 0
            ? "var(--emerald)"
            : "var(--coral)",
      }));
    }

    return [
      { name: "PTS", value: 62, fill: "var(--emerald)" },
      { name: "REB", value: 48, fill: "var(--coral)" },
      { name: "AST", value: 58, fill: "var(--emerald)" },
      { name: "3PM", value: 54, fill: "var(--gold)" },
      { name: "PRA", value: 67, fill: "var(--emerald)" },
      { name: "STL", value: 39, fill: "var(--coral)" },
    ];
  }, [activeProps]);

  const matchupBars = useMemo(() => {
    const rawMetrics = [
      { label: "Rating", value: bestEdgeProp?.ratingScore ?? 68 },
      { label: "Edge", value: 50 + Number(bestEdgeProp?.edgePercent ?? 6) * 4 },
      { label: "Hit Rate", value: averageHitRate ?? 57 },
      { label: "AVG", value: Number(hitting.average ?? 0.265) * 250 },
      { label: "OBP", value: Number(hitting.on_base_percentage ?? 0.335) * 200 },
      { label: "SLG", value: Number(hitting.slugging_percentage ?? 0.435) * 160 },
      { label: "HR", value: Number(hitting.home_runs ?? 12) * 4 },
      { label: "RBI", value: Number(hitting.runs_batted_in ?? 42) },
    ];

    return rawMetrics.map((metric, index) => {
      const value = clampScore(Math.round(Number(metric.value || 0)));
      return {
        ...metric,
        value,
        side: value >= 58 ? "Batter edge" : value <= 42 ? "Pitcher edge" : "Neutral",
        color:
          value >= 58
            ? "var(--emerald)"
            : value <= 42
              ? "var(--coral)"
              : "var(--gold)",
        rank: clampScore(value + (index % 2 === 0 ? 6 : -4)),
      };
    });
  }, [averageHitRate, bestEdgeProp, hitting]);

  return (
    <div className="min-h-full px-3 py-4 md:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <MatchupSearchCard
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            loadingPlayers={loadingPlayers}
            filteredPlayers={filteredPlayers}
            selectPlayer={selectPlayer}
            handleSearchSubmit={handleSearchSubmit}
            selectedPlayerId={selectedPlayerId}
          />

          <div className="card overflow-hidden rounded-[8px]">
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                Player Queue
              </p>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {playerOptions.length} loaded
              </span>
            </div>
            <div className="max-h-[560px] overflow-y-auto p-2">
              {(filteredPlayers.length ? filteredPlayers : playerOptions)
                .slice(0, 12)
                .map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => selectPlayer(player)}
                    className="mb-2 flex w-full items-center gap-3 rounded-[6px] border px-3 py-3 text-left transition hover:opacity-90"
                    style={{
                      backgroundColor:
                        player.id === selectedPlayerId
                          ? "var(--emerald-light)"
                          : "var(--bg-surface)",
                      borderColor:
                        player.id === selectedPlayerId
                          ? "var(--emerald)"
                          : "var(--border)",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(74, 158, 255, 0.12)",
                        color: "var(--intel-blue)",
                      }}
                    >
                      {getInitials(player.label)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {player.label}
                      </p>
                      <p className="mt-1 truncate text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {player.teamAbbr || player.teamName || "TEAM"} • {player.marketCount} markets
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--gold)" }}>
                      {player.leagueId?.toUpperCase() || player.sport?.toUpperCase() || "LIVE"}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <section className="card overflow-hidden rounded-[8px]">
            <div className="flex flex-col gap-4 border-b px-4 py-4 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-black"
                  style={{
                    backgroundColor: "var(--emerald-light)",
                    borderColor: "var(--emerald)",
                    color: "var(--emerald)",
                  }}
                >
                  {getInitials(playerName)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold md:text-2xl" style={{ color: "var(--text-primary)" }}>
                      {playerName}
                    </h1>
                    <span className="badge" style={{ backgroundColor: "var(--gold-light)", color: "var(--gold)" }}>
                      {leagueLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {selectedPlayer?.eventLabel || "Search a player to load live matchup impact data."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[6px] border px-3 py-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  {playerTeam}
                </span>
                <button
                  onClick={() => refetch()}
                  disabled={!selectedPlayerId || isLoading}
                  className="inline-flex items-center gap-2 rounded-[6px] border px-3 py-2 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px md:grid-cols-4" style={{ backgroundColor: "var(--border)" }}>
              {statSummary.map((stat) => (
                <div key={stat.label} className="p-4" style={{ backgroundColor: "var(--bg-card)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                      {stat.label}
                    </p>
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                  <p className="mt-2 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    {stat.helper}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {isLoading ? (
            <StatePanel label="Loading matchup insights..." loading />
          ) : error ? (
            <StatePanel
              label="We couldn't complete the request. Confirm the player name and try again."
              tone="error"
              onRetry={() => refetch()}
            />
          ) : !selectedPlayerId ? (
            <StatePanel label="Select a player from the left rail or search by name to load the matchup board." />
          ) : !currentMatchup ? (
            <StatePanel label={`No matchup analysis was returned for ${selectedPlayerId}.`} />
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
                <div className="card overflow-hidden rounded-[8px]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                        Market Trend
                      </p>
                      <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Rating, edge, and hit-rate shape by active prop category.
                      </p>
                    </div>
                    <span className="badge" style={{ backgroundColor: "var(--emerald-light)", color: "var(--emerald)" }}>
                      {propsCount} props
                    </span>
                  </div>
                  <div className="h-[320px] px-2 py-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ left: -18, right: 16, top: 12, bottom: 0 }}>
                        <defs>
                          <linearGradient id="matchupEdge" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.38} />
                            <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ stroke: "var(--border-strong)" }}
                          contentStyle={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: 6,
                            color: "var(--text-primary)",
                          }}
                        />
                        <Area type="monotone" dataKey="rating" stroke="var(--emerald)" fill="url(#matchupEdge)" strokeWidth={2} />
                        <Area type="monotone" dataKey="hitRate" stroke="var(--intel-blue)" fill="transparent" strokeWidth={2} />
                        <Area type="monotone" dataKey="edge" stroke="var(--gold)" fill="transparent" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card overflow-hidden rounded-[8px]">
                  <div className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                      Hit Profile
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Green favors the player, red flags pressure.
                    </p>
                  </div>
                  <div className="h-[320px] px-2 py-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          contentStyle={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: 6,
                            color: "var(--text-primary)",
                          }}
                        />
                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                          {barData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="card overflow-hidden rounded-[8px]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                      Matchup Analyzer
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Percentile style comparison built from prop edge, hit rate, rating, and returned batting stats.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <span className="h-2 w-8 rounded-full" style={{ backgroundColor: "var(--coral)" }} />
                    Pitcher edge
                    <span className="h-2 w-8 rounded-full" style={{ backgroundColor: "var(--emerald)" }} />
                    Batter edge
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
                  {matchupBars.map((metric) => (
                    <div key={metric.label} className="grid grid-cols-[72px_1fr_76px] items-center gap-3 text-xs">
                      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {metric.label}
                      </p>
                      <div className="relative h-2 rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
                        <div
                          className="absolute left-0 top-0 h-2 rounded-full"
                          style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                        />
                        <span
                          className="absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{
                            left: `calc(${metric.value}% - 12px)`,
                            backgroundColor: metric.color,
                          }}
                        >
                          {metric.rank}
                        </span>
                      </div>
                      <p className="text-right text-[10px]" style={{ color: metric.color }}>
                        {metric.side}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="card overflow-hidden rounded-[8px]">
                  <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                        Active Props Board
                      </p>
                      <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Lines returned for this player matchup.
                      </p>
                    </div>
                    <Shield className="h-4 w-4" style={{ color: "var(--intel-blue)" }} />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-xs">
                      <thead style={{ color: "var(--text-muted)" }}>
                        <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Market</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Side</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Line</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Book</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Odds</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Edge</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-[0.14em]">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProps.length ? (
                          activeProps.map((prop) => (
                            <tr key={prop.id || `${prop.category}-${prop.line}-${prop.sportsbook}`} className="border-b transition hover:bg-white/[0.03]" style={{ borderColor: "var(--border)" }}>
                              <td className="px-4 py-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                                {prop.category || "Market"}
                              </td>
                              <td className="px-4 py-3">
                                <span className="badge" style={{ backgroundColor: "var(--emerald-light)", color: "var(--emerald)" }}>
                                  {prop.side || "N/A"}
                                </span>
                              </td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{prop.line ?? "N/A"}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{prop.sportsbook || "N/A"}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{prop.odds ?? "N/A"}</td>
                              <td className="px-4 py-3 font-semibold" style={{ color: Number(prop.edgePercent || 0) >= 0 ? "var(--emerald)" : "var(--coral)" }}>
                                {percent(prop.edgePercent)}
                              </td>
                              <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{prop.ratingScore ?? "N/A"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-4 py-8 text-center" colSpan={7} style={{ color: "var(--text-muted)" }}>
                              No active props available for this matchup.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card overflow-hidden rounded-[8px]">
                  <div className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-secondary)" }}>
                      Stats Snapshot
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      First stat record and hitting split summary.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {[
                      ["Games", matchupStatsRecord?.stats?.gamesPlayed || matchupStatsRecord?.gamesPlayed],
                      ["AVG", hitting.average],
                      ["HR", hitting.home_runs],
                      ["RBI", hitting.runs_batted_in],
                      ["OBP", hitting.on_base_percentage],
                      ["SLG", hitting.slugging_percentage],
                      ["Source", currentMatchup.source],
                      ["Records", statsCount],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-[6px] border p-3" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                          {label}
                        </p>
                        <p className="mt-2 truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {formatStatValue(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatePanel({
  label,
  loading = false,
  tone,
  onRetry,
}: {
  label: string;
  loading?: boolean;
  tone?: "error";
  onRetry?: () => void;
}) {
  return (
    <div className="card flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-[8px] p-8 text-center">
      {loading ? (
        <div className="w-full space-y-5 text-left">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[6px] border p-3" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <Skeleton height={10} width="60%" />
                <Skeleton className="mt-3" height={24} width="42%" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[6px] border p-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <Skeleton height={18} width={160} />
              <Skeleton className="mt-4" height={220} />
            </div>
            <div className="rounded-[6px] border p-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <Skeleton height={18} width={140} />
              <Skeleton className="mt-4" height={220} />
            </div>
          </div>
          <div className="rounded-[6px] border p-3" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} cols={5} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tone === "error" ? (
        <AlertCircle className="h-9 w-9" style={{ color: "var(--coral)" }} />
      ) : (
        <Activity className="h-9 w-9" style={{ color: "var(--intel-blue)" }} />
      )}
      {!loading ? (
        <p className="max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
      ) : null}
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-1 rounded-[6px] px-3 py-2 text-xs font-semibold transition hover:opacity-80"
          style={{ backgroundColor: "var(--coral-light)", color: "var(--coral)" }}
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
