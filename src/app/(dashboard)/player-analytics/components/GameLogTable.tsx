"use client";
import { StatTooltip } from "@/components/charts/StatTooltip";

interface GameLogTableProps {
  data: any[];
  selectedStat: string;
  displayLine: number;
}

export function GameLogTable({
  data,
  selectedStat,
  displayLine,
}: GameLogTableProps) {
  const getHighlightColor = (val: number) =>
    val >= displayLine ? "var(--emerald)" : "var(--coral)";

  const isPoints = selectedStat === "Points";
  const isAssists = selectedStat === "Assists";
  const isRebounds = selectedStat === "Rebounds";

  return (
    <div className="card rounded-[5px] p-5">
      <h3
        className="font-display text-sm font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Game Log — Last {data?.length || 0} Games
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {[
                "Game",
                "Date",
                "PTS",
                "AST",
                "REB",
                <StatTooltip key="cl" stat="CL">
                  <span>MIN</span>
                </StatTooltip>,
                <StatTooltip key="usg" stat="USG%">
                  <span>USG%</span>
                </StatTooltip>,
              ].map((h, i) => (
                <th
                  key={i}
                  className="text-left py-2 px-2 font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data?.map((row: any, i: number) => (
                <tr
                  key={i}
                  className="transition-colors hover:opacity-80"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    className="py-2 px-2 font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {row.Opponent}
                  </td>
                  <td
                    className="py-2 px-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.Day
                      ? new Date(row.Day).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "--"}
                  </td>
                  <td
                    className="py-2 px-2 font-bold"
                    style={{
                      color: isPoints
                        ? getHighlightColor(row.Points)
                        : "var(--text-primary)",
                    }}
                  >
                    {row.Points}
                  </td>
                  <td
                    className="py-2 px-2 font-bold"
                    style={{
                      color: isAssists
                        ? getHighlightColor(row.Assists)
                        : "var(--text-primary)",
                    }}
                  >
                    {row.Assists}
                  </td>
                  <td
                    className="py-2 px-2 font-bold"
                    style={{
                      color: isRebounds
                        ? getHighlightColor(row.Rebounds)
                        : "var(--text-primary)",
                    }}
                  >
                    {row.Rebounds}
                  </td>
                  <td
                    className="py-2 px-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.Minutes}
                  </td>
                  <td
                    className="py-2 px-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.UsageRatePercentage}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-2 px-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  No game logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
