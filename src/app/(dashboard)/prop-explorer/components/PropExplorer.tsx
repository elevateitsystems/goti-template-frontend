"use client";
import { useState, useMemo } from "react";
import {
  Target,
  Search,
  ArrowUpDown,
  Filter,
  ChevronRight,
  Activity,
  Trophy,
  Zap,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerStat {
  StatID: number;
  TeamID: number;
  PlayerID: number;
  SeasonType: number;
  Season: number;
  Name: string;
  Team: string;
  Position: string;
  Started: number;
  Games: number;
  FantasyPoints: number;
  Minutes: number;
  FieldGoalsMade: number;
  FieldGoalsAttempted: number;
  ThreePointersMade: number;
  ThreePointersAttempted: number;
  FreeThrowsMade: number;
  FreeThrowsAttempted: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  BlockedShots: number;
  Turnovers: number;
  Points: number;
  PlusMinus: number;
  DoubleDoubles: number;
  TripleDoubles: number;
}

const STAT_CATEGORIES = [
  { label: "Points", key: "Points" },
  { label: "Assists", key: "Assists" },
  { label: "Rebounds", key: "Rebounds" },
  { label: "PRA", key: "PRA", composite: ["Points", "Rebounds", "Assists"] },
  { label: "PR", key: "PR", composite: ["Points", "Rebounds"] },
  { label: "PA", key: "PA", composite: ["Points", "Assists"] },
  { label: "3PM", key: "ThreePointersMade" },
  { label: "Steals", key: "Steals" },
  { label: "Blocks", key: "BlockedShots" },
  { label: "Turnovers", key: "Turnovers" },
  { label: "Double Double", key: "DoubleDoubles" },
  { label: "Triple Double", key: "TripleDoubles" },
] as const;

const DISPLAY_COLUMNS = [
  { label: "Points", key: "Points" },
  { label: "Assists", key: "Assists" },
  { label: "Rebounds", key: "Rebounds" },
  { label: "PRA", key: "PRA" },
  { label: "PR", key: "PR" },
  { label: "PA", key: "PA" },
  { label: "3PM", key: "ThreePointersMade" },
  { label: "Steals", key: "Steals" },
  { label: "Blocks", key: "BlockedShots" },
  { label: "TO", key: "Turnovers" },
  { label: "DD", key: "DoubleDoubles" },
  { label: "TD", key: "TripleDoubles" },
  { label: "Fantasy", key: "FantasyPoints" },
  { label: "+/-", key: "PlusMinus" },
] as const;

export function PropExplorer({
  initialPlayers,
}: {
  initialPlayers: PlayerStat[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Points");
  const [sortKey, setSortKey] = useState<string>("Points");
  const [sortAsc, setSortAsc] = useState(false);

  const processedData = useMemo(() => {
    return (initialPlayers || []).map((p) => ({
      ...p,
      PRA: Number((p.Points + p.Rebounds + p.Assists).toFixed(1)),
      PR: Number((p.Points + p.Rebounds).toFixed(1)),
      PA: Number((p.Points + p.Assists).toFixed(1)),
    }));
  }, [initialPlayers]);

  const filtered = useMemo(() => {
    let data = [...processedData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (p) =>
          p.Name.toLowerCase().includes(q) || p.Team.toLowerCase().includes(q),
      );
    }

    // Sorting
    data.sort((a: any, b: any) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      if (typeof va === "number" && typeof vb === "number") {
        return sortAsc ? va - vb : vb - va;
      }
      return sortAsc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

    return data;
  }, [processedData, searchQuery, sortKey, sortAsc]);

  function toggleSort(key: string) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-[5px] flex items-center justify-center shadow-lg shadow-intel-blue/20"
              style={{
                background:
                  "linear-gradient(135deg, var(--intel-blue), #3B82F6)",
              }}
            >
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="font-display text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Prop Explorer
              </h1>
              <p
                className="text-sm font-body font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Deep-dive into performance metrics and betting markets
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors group-focus-within:text-intel-blue"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-[5px] border font-body text-sm outline-none transition-all focus:ring-2 focus:ring-intel-blue/20"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="Search NBA superstars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Players",
            value: filtered.length.toString(),
            color: "var(--intel-blue)",
          },
          {
            label: "Avg Points",
            value: filtered.length
              ? (
                  filtered.reduce((s, p) => s + p.Points, 0) / filtered.length
                ).toFixed(1)
              : "0",
            color: "var(--emerald)",
          },
          {
            label: "Avg Rebounds",
            value: filtered.length
              ? (
                  filtered.reduce((s, p) => s + p.Rebounds, 0) / filtered.length
                ).toFixed(1)
              : "0",
            color: "var(--gold)",
          },
          {
            label: "Avg Assists",
            value: filtered.length
              ? (
                  filtered.reduce((s, p) => s + p.Assists, 0) / filtered.length
                ).toFixed(1)
              : "0",
            color: "var(--intel-blue)",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="card rounded-[5px] p-3">
            <p
              className="text-[11px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {kpi.label}
            </p>
            <p
              className="text-xl font-bold font-body mt-0.5"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Section (Stat Categories) */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {STAT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.label);
                setSortKey(cat.key);
              }}
              className="px-3 py-1.5 rounded-[5px] text-xs font-body font-medium transition-all"
              style={{
                backgroundColor:
                  selectedCategory === cat.label
                    ? "var(--emerald)"
                    : "var(--bg-card)",
                color:
                  selectedCategory === cat.label
                    ? "white"
                    : "var(--text-secondary)",
                border: `1px solid ${selectedCategory === cat.label ? "var(--emerald)" : "var(--border)"}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Table */}
      <div className="card rounded-[5px] overflow-hidden border border-white/5 shadow-lg flex flex-col">
        <div className="overflow-auto h-[calc(100vh-350px)]">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead
              className="sticky top-0 z-10"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider bg-inherit"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Player
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider bg-inherit"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Pos
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider text-center bg-inherit"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  GP
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider text-center bg-inherit"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  MIN
                </th>
                {DISPLAY_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider cursor-pointer select-none text-right bg-inherit transition-colors hover:text-white"
                    style={{
                      color:
                        sortKey === col.key
                          ? "var(--intel-blue)"
                          : "var(--text-muted)",
                      backgroundColor:
                        sortKey === col.key ? "var(--white-5)" : "transparent",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="flex items-center justify-end gap-1">
                      {col.label} <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((player) => (
                <tr
                  key={player.PlayerID}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {/* Player */}
                  <td className="px-4 py-3">
                    <div>
                      <p
                        className="text-sm font-body font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {player.Name}
                      </p>
                      <p
                        className="text-[10px] font-body"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {player.Team}
                      </p>
                    </div>
                  </td>
                  {/* Pos */}
                  <td
                    className="px-4 py-3 text-xs font-body"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {player.Position}
                  </td>
                  {/* GP */}
                  <td
                    className="px-4 py-3 text-sm font-body text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {player.Games}
                  </td>
                  {/* MIN */}
                  <td
                    className="px-4 py-3 text-sm font-body text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {player.Minutes}
                  </td>
                  {/* Stats Map */}
                  {DISPLAY_COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm font-body font-semibold text-right"
                      style={{
                        color:
                          sortKey === col.key
                            ? "var(--intel-blue)"
                            : "var(--text-primary)",
                        backgroundColor:
                          sortKey === col.key
                            ? "var(--white-5)"
                            : "transparent",
                      }}
                    >
                      {(player as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Zap className="h-8 w-8 opacity-20" />
            <p
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              No players found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
