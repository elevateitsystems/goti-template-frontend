"use client";
import { nbaMatchups } from "@/data/nba";
import { Activity, ChevronDown, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GameLogTable } from "./GameLogTable";
import { HitRateChart } from "./HitRateChart";
import { MatchupImpactCard } from "./MatchupImpactCard";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerPropLines } from "./PlayerPropLines";

const statFilters = [
  "Points",
  "Assists",
  "Rebounds",
  "Threes",
  "Pts+Ast",
  "Pts+Reb",
];

export function PlayerAnalytics({
  playerLog,
  seasonStats,
  allActivePlayer,
}: {
  playerLog: any;
  seasonStats: any;
  allActivePlayer: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPlayers = allActivePlayer || [];
  const playersList = Array.isArray(rawPlayers)
    ? rawPlayers
    : rawPlayers.data && Array.isArray(rawPlayers.data)
      ? rawPlayers.data
      : [];
  const playerIdParam = searchParams.get("playerId");
  const selectedPlayer =
    playersList?.find((p: any) => p.PlayerID?.toString() === playerIdParam) ||
    playersList[0] ||
    null;

  const [selectedStat, setSelectedStat] = useState("Points");
  const [viewMode, setViewMode] = useState<"avg" | "median">("avg");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  if (!playersList.length) {
    return (
      <div
        className="flex flex-col items-center justify-center p-10 text-center"
        style={{ color: "var(--text-muted)" }}
      >
        <Activity className="h-12 w-12 mb-3 opacity-20" />
        <h2
          className="text-xl font-display font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          No Players Found
        </h2>
        <p className="max-w-xs text-sm font-body mx-auto mt-2">
          We couldn't find any active players for the selected sport. Please
          check your filters or try again later.
        </p>
      </div>
    );
  }

  // Fallback if players exist but no default/selected player (unlikely but safe)
  if (!selectedPlayer) return null;

  const filteredPlayers = playersList?.filter((p: any) =>
    `${p.FirstName} ${p.LastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getStatValue = (game: any, statName: string) => {
    switch (statName) {
      case "Points":
        return game.Points || 0;
      case "Assists":
        return game.Assists || 0;
      case "Rebounds":
        return game.Rebounds || 0;
      case "Threes":
        return game.ThreePointersMade || 0;
      case "Pts+Ast":
        return (game.Points || 0) + (game.Assists || 0);
      case "Pts+Reb":
        return (game.Points || 0) + (game.Rebounds || 0);
      default:
        return game.Points || 0;
    }
  };

  const activeLogs = Array.isArray(playerLog)
    ? playerLog
    : playerLog?.data && Array.isArray(playerLog.data)
      ? playerLog.data
      : [];
  const statValues = activeLogs.map((g: any) => getStatValue(g, selectedStat));
  const avgStat = statValues.length
    ? statValues.reduce((a: number, b: number) => a + b, 0) / statValues.length
    : 0;
  const sortedStats = [...statValues].sort((a, b) => a - b);
  const medianStat = sortedStats.length
    ? sortedStats[Math.floor(sortedStats.length / 2)]
    : 0;
  const displayLine = viewMode === "avg" ? avgStat : medianStat;

  const hitCount = statValues.filter((v: number) => v >= displayLine).length;
  const hitRate = statValues.length
    ? Math.round((hitCount / statValues.length) * 100)
    : 0;

  const computedHitRateBarData = Array.isArray(activeLogs)
    ? activeLogs
        .map((g: any) => {
          const val = getStatValue(g, selectedStat);
          return {
            label: g.Day
              ? new Date(g.Day).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "--",
            value: val,
            line: displayLine,
            hit: val >= displayLine,
          };
        })
        .reverse()
    : [];

  // Get matchup for the selected player's opponent
  const matchupTeams = Object.keys(nbaMatchups);
  const matchupIndex = selectedPlayer?.PlayerID
    ? selectedPlayer.PlayerID % matchupTeams.length
    : 0;
  const currentMatchup =
    nbaMatchups[matchupTeams[matchupIndex]] || nbaMatchups["BOS"];

  const handleSelectSimilar = (playerName: string) => {
    const found = playersList?.find(
      (p: any) => `${p.FirstName} ${p.LastName}` === playerName,
    );
    if (found) {
      handlePlayerSelect(found);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlayerSelect = (p: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("playerId", p.PlayerID.toString());
    router.push(`?${params.toString()}`);
    setShowPlayerDropdown(false);
    setSearchQuery("");
  };

  // Calculate Dynamic Prop Lines for Points, Rebounds, Threes
  const getPropMetrics = (
    statName: string,
  ): {
    prop: string;
    projection: string;
    confidence: number;
    hitRate: number;
    positive: boolean;
    odds: string;
  } => {
    const vals = Array.isArray(activeLogs)
      ? activeLogs.map((g: any) => getStatValue(g, statName))
      : [];
    const avg = vals.length
      ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length
      : 0;
    const hrCount = vals.filter((v: number) => v >= avg).length;
    const hr = vals.length ? Math.round((hrCount / vals.length) * 100) : 0;

    // Simple Confidence: Compare last 3 games vs. overall average
    const last3 = vals.slice(0, 3);
    const last3Avg = last3.length
      ? last3.reduce((a: number, b: number) => a + b, 0) / last3.length
      : 0;
    const trend = avg > 0 ? last3Avg / avg : 1;
    const confidence = Math.min(
      Math.max(Math.round(trend * 75 + hr / 10), 30),
      98,
    );

    return {
      prop: `${statName}`,
      projection: avg.toFixed(1),
      confidence,
      hitRate: hr,
      positive: trend >= 1,
      odds: trend >= 1 ? "-115" : "+105",
    };
  };

  const dynamicProps = ["Points", "Rebounds", "Threes"].map(getPropMetrics);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Player Analytics
          </h1>
          <p
            className="text-sm font-body mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Analyze player performance, hit rates, and recent matchups.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Player Search */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-body font-medium border transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            onClick={() => setShowPlayerDropdown(!showPlayerDropdown)}
          >
            <Search
              className="h-3.5 w-3.5"
              style={{ color: "var(--text-muted)" }}
            />
            {selectedPlayer.FirstName} {selectedPlayer.LastName}
            <ChevronDown
              className="h-3.5 w-3.5 ml-1"
              style={{ color: "var(--text-muted)" }}
            />
          </button>
          {showPlayerDropdown && (
            <div
              className="absolute top-full left-0 mt-1 z-20 w-64 rounded-[5px] border shadow-lg overflow-hidden"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <div
                className="p-2 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <input
                  className="w-full px-3 py-1.5 rounded-[5px] text-sm font-body outline-none"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                {filteredPlayers?.length > 0 ? (
                  filteredPlayers?.map((p: any) => (
                    <button
                      key={p.PlayerID}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:opacity-80 transition-colors"
                      style={{
                        backgroundColor:
                          selectedPlayer?.PlayerID === p.PlayerID
                            ? "var(--emerald-light)"
                            : "transparent",
                        color:
                          selectedPlayer?.PlayerID === p.PlayerID
                            ? "var(--emerald)"
                            : "var(--text-primary)",
                      }}
                      onClick={() => handlePlayerSelect(p)}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body shrink-0"
                        style={{ backgroundColor: "var(--bg-surface)" }}
                      >
                        #{p.Jersey}
                      </span>
                      <div>
                        <p className="text-sm font-body font-semibold">
                          {p.FirstName} {p.LastName}
                        </p>
                        <p
                          className="text-[10px] font-body"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {p.Team} · {p.Position}
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-[10px] badge ${p.Status === "Active" ? "bg-emerald/20 text-profit" : p.Status === "Questionable" ? "" : "bg-coral/20 text-loss"}`}
                        style={
                          p.Status === "Questionable"
                            ? {
                                backgroundColor: "var(--gold-light)",
                                color: "var(--gold)",
                              }
                            : {}
                        }
                      >
                        {p.Status}
                      </span>
                    </button>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-2 px-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No players found
                    </td>
                  </tr>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Market filters */}
        <div className="flex gap-1.5 flex-wrap">
          {statFilters.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStat(s)}
              className="px-3 py-1.5 rounded-[5px] text-xs font-body font-medium transition-all"
              style={{
                backgroundColor:
                  selectedStat === s ? "var(--emerald)" : "var(--bg-card)",
                color: selectedStat === s ? "white" : "var(--text-secondary)",
                border: `1px solid ${selectedStat === s ? "var(--emerald)" : "var(--border)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Season Filter Dropdown */}
        <div className="flex gap-1.5 ml-auto">
          <select
            value={searchParams.get("season") || "2026"}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("season", e.target.value);
              router.push(`?${params.toString()}`);
              setSearchQuery("");
            }}
            className="px-3 py-1.5 rounded-[5px] text-xs font-body font-medium transition-all outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: `1px solid var(--border)`,
            }}
          >
            {[
              new Date().getFullYear(),
              new Date().getFullYear() - 1,
              new Date().getFullYear() - 2,
              new Date().getFullYear() - 3,
            ]?.map((season: any) => (
              <option key={season} value={season}>
                {season} Season
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Avg / Median Toggle */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-body font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          View mode:
        </span>
        <div
          className="flex rounded-[5px] overflow-hidden border"
          style={{ borderColor: "var(--border)" }}
        >
          {(["avg", "median"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-4 py-1.5 text-xs font-body font-semibold transition-colors capitalize"
              style={{
                backgroundColor:
                  viewMode === mode ? "var(--emerald)" : "var(--bg-card)",
                color: viewMode === mode ? "white" : "var(--text-secondary)",
              }}
            >
              {mode === "avg" ? "Average" : "Median"}
            </button>
          ))}
        </div>
        <span
          className="text-xs font-body px-2 py-1 rounded-[5px]"
          style={{
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-muted)",
          }}
        >
          {viewMode === "avg" ? "Avg" : "Median"}:{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {displayLine.toFixed(1)}{" "}
            {selectedStat === "Threes" ? "3PM" : selectedStat}
          </strong>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar Column */}
        <div className="space-y-4 lg:col-span-1">
          <PlayerProfileCard
            player={selectedPlayer}
            seasonStats={seasonStats}
          />
          {activeLogs.length > 0 && <PlayerPropLines props={dynamicProps} />}
          {/* TODO: Find the url from sportsDataIo */}
          {/* <MatchupImpactCard matchup={currentMatchup} /> */}
        </div>

        {/* Main Content Column */}
        <div className="space-y-4 lg:col-span-2">
          {activeLogs.length > 0 ? (
            <>
              <HitRateChart
                data={computedHitRateBarData}
                displayLine={displayLine}
                viewMode={viewMode}
                selectedStat={selectedStat}
                hitRate={hitRate}
                hitCount={hitCount}
              />
              <GameLogTable
                data={activeLogs?.slice(0, 12)}
                selectedStat={selectedStat}
                displayLine={displayLine}
              />
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center p-12 rounded-[5px] border border-dashed text-center h-full min-h-[400px]"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <Activity
                className="h-10 w-10 mb-4 opacity-20"
                style={{ color: "var(--text-muted)" }}
              />
              <h3
                className="text-lg font-display font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                No Game Logs Available
              </h3>
              <p
                className="max-w-xs text-sm font-body mx-auto mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                We couldn't find any game records for {selectedPlayer.FirstName}{" "}
                {selectedPlayer.LastName} in the{" "}
                {searchParams.get("season") || "2026"} season.
                {searchParams.get("season") &&
                  parseInt(searchParams.get("season") || "0") < 2025 && (
                    <span
                      className="block mt-2 font-medium"
                      style={{ color: "var(--gold)" }}
                    >
                      Limited historical data is available for older seasons.
                    </span>
                  )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
