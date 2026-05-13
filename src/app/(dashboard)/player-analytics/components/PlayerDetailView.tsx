"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, Activity, Calendar } from "lucide-react";
import Link from "next/link";
import { HitRateChart } from "./HitRateChart";
import { GameLogTable } from "./GameLogTable";

interface PlayerDetailViewProps {
  player: any;
  playerLog: any;
  season: string;
}

export function PlayerDetailView({
  player,
  playerLog = [],
  season,
}: PlayerDetailViewProps) {
  const safePlayerLog = Array.isArray(playerLog)
    ? playerLog
    : playerLog?.data && Array.isArray(playerLog.data)
      ? playerLog.data
      : [];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedStat, setSelectedStat] = useState("Points");
  const [viewMode, setViewMode] = useState<"avg" | "median">("avg");

  const statFilters = [
    "Points",
    "Assists",
    "Rebounds",
    "Threes",
    "Pts+Ast",
    "Pts+Reb",
  ];

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

  const statValues = safePlayerLog.map((g: any) =>
    getStatValue(g, selectedStat),
  );
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

  const computedHitRateBarData = safePlayerLog
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
    .reverse();

  const handleSeasonChange = (newSeason: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", newSeason);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/player-analytics"
            className="p-2 rounded-[5px] border hover:bg-white/5 transition-colors flex items-center justify-center"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1
              className="font-display text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {player.FirstName} {player.LastName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 text-xs font-body"
            style={{ color: "var(--text-muted)" }}
          >
            <Calendar className="h-3.5 w-3.5" />
            Season:
          </div>
          <div className="relative group">
            <select
              value={season}
              onChange={(e) => handleSeasonChange(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-[5px] text-sm font-body font-medium transition-all outline-none border cursor-pointer"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                borderColor: "var(--border)",
              }}
            >
              {[2026, 2025, 2024].map((s) => (
                <option key={s} value={s.toString()}>
                  {s} Season
                </option>
              ))}
            </select>
            <ChevronDown
              className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Stats Column: Profile and Prop Lines */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card rounded-[5px] p-5">
            <h3
              className="font-display text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              Analysis Filters
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {statFilters.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setSelectedStat(stat)}
                  className="px-3 py-2 rounded-[5px] text-xs font-body font-medium transition-all text-left"
                  style={{
                    backgroundColor:
                      selectedStat === stat
                        ? "var(--emerald)"
                        : "var(--bg-surface)",
                    color:
                      selectedStat === stat ? "white" : "var(--text-secondary)",
                    border: `1px solid ${selectedStat === stat ? "var(--emerald)" : "var(--border)"}`,
                  }}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Column: Charts and Logs */}
        <div className="lg:col-span-3 space-y-6">
          <HitRateChart
            data={computedHitRateBarData}
            displayLine={displayLine}
            viewMode={viewMode}
            selectedStat={selectedStat}
            hitRate={hitRate}
            hitCount={hitCount}
          />

          <GameLogTable
            data={safePlayerLog}
            selectedStat={selectedStat}
            displayLine={displayLine}
          />
        </div>
      </div>
    </div>
  );
}
