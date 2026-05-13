"use client";
import { useMemo } from "react";
import {
  Timer,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export function CLVTracker() {
  const bets = useAppSelector((state) => state.betTracker.bets);

  const stats = useMemo(() => {
    const wins = bets.filter((b) => b.result === "win").length;
    const losses = bets.filter((b) => b.result === "loss").length;
    const pushes = bets.filter((b) => b.result === "push").length;
    const totalCLV = bets.reduce((s, b) => s + b.clvPercentage, 0);
    const avgCLV = bets.length ? totalCLV / bets.length : 0;
    const positiveCLV = bets.filter((b) => b.clvPercentage > 0).length;
    const winRate = bets.length ? (wins / bets.length) * 100 : 0;
    return {
      wins,
      losses,
      pushes,
      avgCLV,
      positiveCLV,
      winRate,
      total: bets.length,
    };
  }, [bets]);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-[5px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--gold), #E5A800)",
            }}
          >
            <Timer className="h-4 w-4 text-white" />
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Closing Line Value (CLV) Tracker
          </h1>
        </div>
        <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
          Track your closing line value performance over time
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Total Bets
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--intel-blue)" }}
          >
            {stats.total}
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Win Rate
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--emerald)" }}
          >
            {stats.winRate.toFixed(1)}%
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Avg CLV
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{
              color: stats.avgCLV > 0 ? "var(--emerald)" : "var(--coral)",
            }}
          >
            {stats.avgCLV > 0 ? "+" : ""}
            {stats.avgCLV.toFixed(1)}%
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Positive CLV
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--emerald)" }}
          >
            {stats.positiveCLV}/{stats.total}
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Record
          </p>
          <p
            className="text-lg font-bold font-body mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--emerald)" }}>{stats.wins}W</span> -{" "}
            <span style={{ color: "var(--coral)" }}>{stats.losses}L</span> -{" "}
            <span style={{ color: "var(--text-muted)" }}>{stats.pushes}P</span>
          </p>
        </div>
      </div>

      {/* CLV History Chart (visual bar representation) */}
      <div className="card rounded-[5px] p-5">
        <h2
          className="font-display text-sm font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          CLV History
        </h2>
        <div className="flex items-end gap-1.5 h-32">
          {bets.map((bet, i) => {
            const height = Math.min(
              Math.max(Math.abs(bet.clvPercentage) * 6, 8),
              100,
            );
            return (
              <div
                key={bet.betId}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span
                  className="text-[9px] font-body font-bold"
                  style={{
                    color:
                      bet.clvPercentage > 0 ? "var(--emerald)" : "var(--coral)",
                  }}
                >
                  {bet.clvPercentage > 0 ? "+" : ""}
                  {bet.clvPercentage.toFixed(1)}
                </span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor:
                      bet.clvPercentage > 0 ? "var(--emerald)" : "var(--coral)",
                    opacity: bet.result === "win" ? 1 : 0.5,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="flex items-center gap-4 mt-3 text-[10px] font-body"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--emerald)" }}
            />{" "}
            Positive CLV
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--coral)" }}
            />{" "}
            Negative CLV
          </span>
        </div>
      </div>

      {/* Bets Table */}
      <div className="card rounded-[5px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Date",
                  "Player",
                  "Prop",
                  "Your Line",
                  "Closing Line",
                  "CLV %",
                  "Result",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-body font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr
                  key={bet.betId}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    className="px-4 py-3 text-xs font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {bet.date}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {bet.playerName}
                  </td>
                  <td
                    className="px-4 py-3 text-xs font-body"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {bet.prop}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {bet.yourLine}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-body font-semibold"
                    style={{
                      color:
                        bet.closingLine > bet.yourLine
                          ? "var(--emerald)"
                          : "var(--coral)",
                    }}
                  >
                    {bet.closingLine}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="flex items-center gap-1 text-sm font-body font-bold"
                      style={{
                        color:
                          bet.clvPercentage > 0
                            ? "var(--emerald)"
                            : "var(--coral)",
                      }}
                    >
                      {bet.clvPercentage > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {bet.clvPercentage > 0 ? "+" : ""}
                      {bet.clvPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="badge text-[10px]"
                      style={{
                        backgroundColor:
                          bet.result === "win"
                            ? "var(--emerald-light)"
                            : bet.result === "loss"
                              ? "var(--coral-light)"
                              : "var(--bg-surface)",
                        color:
                          bet.result === "win"
                            ? "var(--emerald)"
                            : bet.result === "loss"
                              ? "var(--coral)"
                              : "var(--text-muted)",
                      }}
                    >
                      {bet.result === "win" ? (
                        <CheckCircle className="h-3 w-3 mr-1 inline" />
                      ) : bet.result === "loss" ? (
                        <XCircle className="h-3 w-3 mr-1 inline" />
                      ) : (
                        <MinusCircle className="h-3 w-3 mr-1 inline" />
                      )}
                      {bet.result.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
