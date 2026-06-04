"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, ArrowUpDown, Calendar, AlertCircle } from "lucide-react";

type SortKey = "dkValue" | "fdValue" | "DraftKingsSalary" | "FanDuelSalary";

export function DFSOptimizer({ initialData = [], hasError = false }: { initialData: any[]; hasError?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortKey, setSortKey] = useState<SortKey>("dkValue");
  const [sortAsc, setSortAsc] = useState(false);

  const selectedDate =
    searchParams?.get("date") || new Date().toISOString().split("T")[0];

  if (hasError) {
    return (
      <div className="card rounded-[5px] p-12 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto mt-10">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            Oops! Something Went Wrong
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            We couldn't complete your request at the moment. Please reload
            the page and try again.
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-[5px] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const processedData = useMemo(() => {
    return initialData.map((p) => {
      const dkPrice = p.DraftKingsSalary || 3000;
      const fdPrice = p.FanDuelSalary || 3000;
      const dkPoints = p.FantasyPointsDraftKings || 0;
      const fdPoints = p.FantasyPointsFanDuel || 0;

      const dkValue = dkPrice > 0 ? dkPoints / (dkPrice / 1000) : 0;
      const fdValue = fdPrice > 0 ? fdPoints / (fdPrice / 1000) : 0;

      return {
        ...p,
        playerName: p.Name,
        team: p.Team,
        position: p.Position,
        dkPrice,
        fdPrice,
        dkValue,
        fdValue,
      };
    });
  }, [initialData]);

  const sorted = useMemo(() => {
    return [...processedData].sort((a: any, b: any) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      return sortAsc ? va - vb : vb - va;
    });
  }, [processedData, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("date", newDate);
    router.push(`/dfs?${params.toString()}`);
  }

  const avgValue = processedData.length
    ? processedData.reduce((s, p) => s + p.dkValue, 0) / processedData.length
    : 0;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-[5px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
              }}
            >
              <Gamepad2 className="h-4 w-4 text-white" />
            </div>
            <h1
              className="font-display text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              DFS Optimizer
            </h1>
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Compare platform pricing vs efficiency • Highlight value plays
          </p>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[5px] border border-white/10">
          <Calendar className="h-4 w-4 opacity-50" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="bg-transparent border-none text-xs font-bold focus:outline-none pr-1"
            style={{ color: "var(--text-primary)", colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Elite Plays (7x+)
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "#EAB308" }}
          >
            {processedData.filter((p) => p.dkValue >= 7.0).length}
          </p>
          <p
            className="text-[10px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            DraftKings Value
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Avg Value Score
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--gold)" }}
          >
            {avgValue.toFixed(2)}
          </p>
          <p
            className="text-[10px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Slate Average
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Players Tracked
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--intel-blue)" }}
          >
            {processedData.length}
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Best DK Value
          </p>
          <p
            className="text-lg font-bold font-body mt-0.5 truncate"
            style={{ color: "var(--emerald)" }}
          >
            {sorted[0]?.dkValue > 0 ? sorted[0]?.playerName : "N/A"}
          </p>
          <p
            className="text-[10px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Score: {sorted[0]?.dkValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-[5px] overflow-hidden shadow-lg border border-white/5">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left">
            <thead>
              <tr
                className="sticky top-0 bg-inherit z-10"
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Player
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  Pos
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider cursor-pointer select-none text-right"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => toggleSort("DraftKingsSalary")}
                >
                  <span className="flex items-center justify-end gap-1">
                    DK Price <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider cursor-pointer select-none text-right"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => toggleSort("FanDuelSalary")}
                >
                  <span className="flex items-center justify-end gap-1">
                    FD Price <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider cursor-pointer select-none text-right"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => toggleSort("dkValue")}
                >
                  <span className="flex items-center justify-end gap-1">
                    DK Value <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider cursor-pointer select-none text-right"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => toggleSort("fdValue")}
                >
                  <span className="flex items-center justify-end gap-1">
                    FD Value <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((play: any) => {
                const getTierColor = (val: number) => {
                  if (val >= 7.0) return "#EAB308"; // Elite (Gold)
                  if (val >= 6.0) return "#F59E0B"; // Great (Amber)
                  if (val >= 5.0) return "#10B981"; // Good (Emerald)
                  return "var(--text-secondary)";
                };
                const getBadge = (val: number) => {
                  if (val >= 7.0)
                    return (
                      <span className="badge text-[8px] bg-yellow-500/10 text-yellow-500">
                        ELITE 7X
                      </span>
                    );
                  if (val >= 6.0)
                    return (
                      <span className="badge text-[8px] bg-amber-500/10 text-amber-500">
                        GREAT 6X
                      </span>
                    );
                  if (val >= 5.0)
                    return (
                      <span className="badge text-[8px] bg-emerald-500/10 text-emerald-500">
                        GOOD 5X
                      </span>
                    );
                  return null;
                };

                return (
                  <tr
                    key={play.PlayerID}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p
                          className="text-sm font-body font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {play.playerName}
                        </p>
                        <p className="text-[10px] font-body font-bold opacity-40 uppercase">
                          {play.team}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="badge text-[10px]"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {play.position}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-body font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ${play.dkPrice.toLocaleString()}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-body font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ${play.fdPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className="text-sm font-body font-bold"
                          style={{ color: getTierColor(play.dkValue) }}
                        >
                          {play.dkValue.toFixed(2)}
                        </span>
                        {getBadge(play.dkValue)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className="text-sm font-body font-bold"
                          style={{ color: getTierColor(play.fdValue) }}
                        >
                          {play.fdValue.toFixed(2)}
                        </span>
                        {getBadge(play.fdValue)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
