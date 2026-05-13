"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StatTooltip } from "@/components/charts/StatTooltip";

interface FullGameLogTableProps {
  logs: any[];
}

export function FullGameLogTable({ logs }: FullGameLogTableProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <h3
        className="font-display text-sm font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Full Game Log
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body">
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              {[
                "Game",
                "Date",
                "PTS",
                "AST",
                "REB",
                "3PM",
                "MIN",
                <StatTooltip key="cl" stat="CL">
                  <span>CL</span>
                </StatTooltip>,
                <StatTooltip key="usg" stat="USG%">
                  <span>USG%</span>
                </StatTooltip>,
                "FGA",
              ].map((h, i) => (
                <th
                  key={i}
                  className="text-left py-2.5 px-3 font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((row, i) => (
              <tr
                key={i}
                className="hover:opacity-80 transition-opacity"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td
                  className="py-2.5 px-3 font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {row.game}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.date}
                </td>
                <td
                  className="py-2.5 px-3 font-bold flex items-center gap-1"
                  style={{
                    color: row.pts > 29.5 ? "var(--emerald)" : "var(--coral)",
                  }}
                >
                  {row.pts > 29.5 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}{" "}
                  {row.pts}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {row.ast}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {row.reb}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {row.threes}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.min}
                </td>
                <td
                  className="py-2.5 px-3 font-semibold"
                  style={{ color: "var(--intel-blue)" }}
                >
                  {row.cl}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.usg}%
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.fga}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
