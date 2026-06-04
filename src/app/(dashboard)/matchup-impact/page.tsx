"use client";
import { useGetAllQuery, useGetByIdQuery } from "@/redux/api/userApi";
import { Activity, AlertCircle, Info, RefreshCw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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

export default function MatchupImpactPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: playerPropsResponse, isLoading: loadingPlayers } =
    useGetAllQuery({ path: "player-props/player-props" }, { skip: false });

  const playerOptions = useMemo(() => {
    const events = playerPropsResponse?.data?.data || [];

    const players = events.flatMap((event: any) => {
      const rawPlayers = event.players || event.Players || [];
      const eventLabel =
        `${event.homeTeamName || ""} vs ${event.awayTeamName || ""}`.trim();

      return rawPlayers.map(
        (player: any) =>
          ({
            id: player.playerId || player.id || "",
            label: player.playerName || player.playerName || player.name || "",
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
        player.id === trimmed.toLowerCase(),
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
    return (matchupResponse?.data || null) as MatchupAnalysis | null;
  }, [matchupResponse]);

  const propsCount = currentMatchup?.activeProps?.length ?? 0;
  const statsCount = currentMatchup?.stats?.length ?? 0;
  const activeProps = currentMatchup?.activeProps ?? [];
  const statsData = currentMatchup?.stats ?? [];
  const selectedPlayer = useMemo(
    () =>
      playerOptions.find((player) => player.id === selectedPlayerId) || null,
    [playerOptions, selectedPlayerId],
  );

  const matchupStatsRecord = (statsData[0] || null) as Record<
    string,
    any
  > | null;

  const formatStatValue = (value: any) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "number") {
      return Number.isInteger(value) ? value : value.toFixed(3);
    }
    return String(value);
  };

  const statSummary = useMemo(() => {
    if (!matchupStatsRecord) return [];
    const hitting = matchupStatsRecord.stats?.hitting || {};
    return [
      {
        label: "Games",
        value: formatStatValue(
          matchupStatsRecord.stats?.gamesPlayed ||
            matchupStatsRecord.gamesPlayed,
        ),
      },
      { label: "AVG", value: formatStatValue(hitting.average) },
      { label: "HR", value: formatStatValue(hitting.home_runs) },
      { label: "RBI", value: formatStatValue(hitting.runs_batted_in) },
      { label: "OBP", value: formatStatValue(hitting.on_base_percentage) },
      { label: "SLG", value: formatStatValue(hitting.slugging_percentage) },
    ];
  }, [matchupStatsRecord]);

  const battingMetrics = useMemo(() => {
    const hitting = matchupStatsRecord?.stats?.hitting;
    if (!hitting || typeof hitting !== "object") return [];
    return Object.entries(hitting).map(([key, value]) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: formatStatValue(value),
    }));
  }, [matchupStatsRecord]);

  const bestEdgeProp = useMemo(() => {
    if (!activeProps.length) return null;
    return activeProps.reduce((best, prop) => {
      if (!best) return prop;
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
      .filter((value) => !Number.isNaN(value));
    return rates.length
      ? Math.round(rates.reduce((sum, value) => sum + value, 0) / rates.length)
      : null;
  }, [activeProps]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
            <Activity className="h-7 w-7 text-emerald-400" />
            Matchup Impact Analysis
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analyze defensive ratings, pace of play, and specific
            points/rebounds allowed vs positions
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-[5px] text-xs font-semibold transition-all border border-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MatchupSearchCard
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          loadingPlayers={loadingPlayers}
          filteredPlayers={filteredPlayers}
          selectPlayer={selectPlayer}
          handleSearchSubmit={handleSearchSubmit}
        />

        {/* Right Side: Matchup Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="card rounded-[5px] p-24 flex items-center justify-center border border-white/5">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
                <span className="text-xs text-gray-400">
                  Loading matchup insights...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="card rounded-[5px] p-8 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-400 animate-bounce" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Oops! Something went wrong
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  We couldn't complete the request. Confirm the player Name and
                  try again.
                </p>
                <button
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="mt-3 px-3 py-2 rounded-[5px] bg-white/5 text-xs text-white"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !selectedPlayerId ? (
            <div className="card rounded-[5px] p-8 text-center text-gray-400 border border-white/5">
              Enter a player ID to fetch live matchup analysis.
            </div>
          ) : !currentMatchup ? (
            <div className="card rounded-[5px] p-8 text-center text-gray-400 border border-white/5">
              No matchup analysis was returned for{" "}
              <strong>{selectedPlayerId}</strong>.
            </div>
          ) : (
            <>
              <div className="card rounded-[5px] p-6 border border-white/5 bg-[#171921]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <span className="badge px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-400">
                      Active Matchup Data
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white">
                      {selectedPlayer?.label || currentMatchup.playerId}
                    </h2>
                    <div className="text-sm text-gray-400 max-w-xl">
                      {selectedPlayer ? (
                        <>
                          A live prop search result for{" "}
                          <span className="text-white">
                            {selectedPlayer.label}
                          </span>{" "}
                          in {selectedPlayer.eventLabel}. Showing all active
                          props and matchup stats from the backend.
                        </>
                      ) : (
                        <>
                          Selected matchup data for{" "}
                          <span className="text-white">
                            {currentMatchup.playerId}
                          </span>
                          .
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
                    <div className="rounded-[5px] bg-[#13151a] p-3 border border-white/5">
                      <p className="uppercase tracking-[0.12em] text-[10px] text-gray-500">
                        Props
                      </p>
                      <p className="mt-2 text-white font-semibold">
                        {propsCount}
                      </p>
                    </div>
                    <div className="rounded-[5px] bg-[#13151a] p-3 border border-white/5">
                      <p className="uppercase tracking-[0.12em] text-[10px] text-gray-500">
                        Stat records
                      </p>
                      <p className="mt-2 text-white font-semibold">
                        {statsCount}
                      </p>
                    </div>
                    <div className="rounded-[5px] bg-[#13151a] p-3 border border-white/5">
                      <p className="uppercase tracking-[0.12em] text-[10px] text-gray-500">
                        Player market
                      </p>
                      <p className="mt-2 text-white font-semibold">
                        {selectedPlayer?.marketCount ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-[5px] bg-[#13151a] p-4 border border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                      Player
                    </p>
                    <p className="mt-2 text-white font-semibold">
                      {selectedPlayer?.label || currentMatchup.playerId}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      ID: {selectedPlayer?.id || currentMatchup.playerId}
                    </p>
                  </div>
                  <div className="rounded-[5px] bg-[#13151a] p-4 border border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                      Team / Event
                    </p>
                    <p className="mt-2 text-white font-semibold">
                      {selectedPlayer?.teamAbbr ||
                        selectedPlayer?.teamName ||
                        "Unknown"}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {selectedPlayer?.eventLabel || "No event available"}
                    </p>
                  </div>
                  <div className="rounded-[5px] bg-[#13151a] p-4 border border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                      League / Sport
                    </p>
                    <p className="mt-2 text-white font-semibold">
                      {selectedPlayer?.leagueId?.toUpperCase() || "N/A"}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {selectedPlayer?.sport?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="card rounded-[5px] p-5 border border-white/5 bg-[#171921]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Active Props
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        Showing all active props for this player matchup.
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {propsCount} items
                    </span>
                  </div>
                  {activeProps.length > 0 ? (
                    <div className="space-y-3">
                      {activeProps.map((prop) => (
                        <div
                          key={
                            prop.id ||
                            `${prop.playerName}-${prop.category}-${prop.line}`
                          }
                          className="rounded-[5px] border border-white/10 bg-[#12151d] p-4 transition hover:border-emerald-500/30 hover:bg-[#172031]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {prop.category} {prop.line}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {prop.playerName}
                              </p>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-emerald-300">
                              {prop.side || "N/A"}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-gray-400">
                            <div className="rounded-[5px] bg-white/5 p-2">
                              <span className="block text-[9px] uppercase text-gray-500">
                                Book
                              </span>
                              <span className="block text-white mt-1">
                                {prop.sportsbook || "N/A"}
                              </span>
                            </div>
                            <div className="rounded-[5px] bg-white/5 p-2">
                              <span className="block text-[9px] uppercase text-gray-500">
                                Odds
                              </span>
                              <span className="block text-white mt-1">
                                {prop.odds ?? "N/A"}
                              </span>
                            </div>
                            <div className="rounded-[5px] bg-white/5 p-2">
                              <span className="block text-[9px] uppercase text-gray-500">
                                Edge
                              </span>
                              <span className="block text-white mt-1">
                                {prop.edgePercent ?? "N/A"}%
                              </span>
                            </div>
                            <div className="rounded-[5px] bg-white/5 p-2">
                              <span className="block text-[9px] uppercase text-gray-500">
                                Rating
                              </span>
                              <span className="block text-white mt-1">
                                {prop.ratingScore ?? "N/A"}
                              </span>
                            </div>
                            {prop.hitRate !== undefined ? (
                              <div className="rounded-[5px] bg-white/5 p-2">
                                <span className="block text-[9px] uppercase text-gray-500">
                                  Hit Rate
                                </span>
                                <span className="block text-white mt-1">
                                  {prop.hitRate}%
                                </span>
                              </div>
                            ) : null}
                            {prop.recommendation ? (
                              <div className="rounded-[5px] bg-white/5 p-2">
                                <span className="block text-[9px] uppercase text-gray-500">
                                  Recommendation
                                </span>
                                <span className="block text-white mt-1">
                                  {prop.recommendation}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No active props available for this matchup.
                    </p>
                  )}
                </div>

                <div className="card rounded-[5px] p-5 border border-white/5 bg-[#171921]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Stats snapshot
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        Full stat records returned by the backend.
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {statsCount} records
                    </span>
                  </div>
                  {statsData.length > 0 ? (
                    <div className="space-y-3">
                      {statsData.map((stat, index) => {
                        const record = stat as Record<string, any>;
                        const title =
                          record.statType ||
                          record.playerName ||
                          `Record ${index + 1}`;
                        const details = Object.entries(record)
                          .filter(
                            ([key, value]) =>
                              value !== undefined &&
                              value !== null &&
                              typeof value !== "object" &&
                              key !== "statType" &&
                              key !== "playerName",
                          )
                          .slice(0, 6);

                        return (
                          <div
                            key={`stat-${index}`}
                            className="rounded-[5px] border border-white/10 bg-[#12151d] p-4 transition hover:border-emerald-500/30 hover:bg-[#172031]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-white truncate">
                                  {title}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {record.season ||
                                    record.leagueId ||
                                    "Summary"}
                                </p>
                              </div>
                              {record.sourceUpdatedAt ? (
                                <span className="text-[10px] text-gray-400">
                                  Updated
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                              {details.map(([key, value]) => (
                                <div
                                  key={key}
                                  className="rounded-md bg-white/5 p-2"
                                >
                                  <span className="block text-[9px] uppercase tracking-[0.15em] text-gray-500">
                                    {key}
                                  </span>
                                  <span className="mt-1 block text-white">
                                    {String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No stats records returned.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex card gap-5 p-5 rounded-[5px] border border-white/5 bg-[#171921]">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                    Stat summary
                  </p>
                  <div className="mt-3 grid gap-2 text-[10px] text-gray-300 rounded-[5px] border border-white/10 bg-[#12151d] p-4 transition hover:border-emerald-500/30 hover:bg-[#172031]">
                    {statSummary.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[5px] bg-white/5 p-3"
                      >
                        <p className="text-[9px] uppercase tracking-[0.15em] text-gray-500">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-white font-semibold">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  {battingMetrics.length > 0 ? (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                        Batting metrics
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-300 rounded-[5px] border border-white/10 bg-[#12151d] p-4 transition hover:border-emerald-500/30 hover:bg-[#172031]">
                        {battingMetrics.slice(0, 6).map((metric) => (
                          <div
                            key={metric.key}
                            className="rounded-[5px] bg-white/5 p-3"
                          >
                            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-500">
                              {metric.label}
                            </p>
                            <p className="mt-1 text-white font-semibold">
                              {metric.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
