"use client";
import Link from "next/link";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { StatTooltip } from "@/components/charts/StatTooltip";
import { players, gameLog, hitRateBarData } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { PointsHistoryChart } from "./PointsHistoryChart";
import { FullGameLogTable } from "./FullGameLogTable";

const radarData = [
  { subject: "Scoring", A: 95 },
  { subject: "Playmaking", A: 80 },
  { subject: "Rebounding", A: 72 },
  { subject: "Defense", A: 58 },
  { subject: "Efficiency", A: 88 },
  { subject: "Consistency", A: 84 },
];

export function PlayerDetail({ playerId }: { playerId: number }) {
  const player = players.find((p) => p.id === playerId) || players[0];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Back */}
      <Link
        href="/player-analytics"
        className="inline-flex items-center gap-1.5 text-sm font-body hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Player Analytics
      </Link>

      {/* Hero */}
      <div className="card rounded-[5px] p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div
            className="w-28 h-28 rounded-[5px] overflow-hidden shrink-0"
            style={{ border: "2px solid var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/112x112/1E4D3A/fff?text=" +
                  player.name.charAt(0);
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1
                  className="font-display text-3xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {player.name}
                </h1>
                <p
                  className="font-body text-sm mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {player.team} · {player.position} · #{player.number}
                </p>
              </div>
              <span
                className="badge text-xs px-3 py-1"
                style={{
                  backgroundColor:
                    player.status === "Active"
                      ? "var(--emerald-light)"
                      : "var(--gold-light)",
                  color:
                    player.status === "Active"
                      ? "var(--emerald)"
                      : "var(--gold)",
                }}
              >
                ● {player.status}
              </span>
            </div>

            {/* Season Stats */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-4">
              {[
                { key: "PTS", val: "31.2" },
                { key: "AST", val: "8.4" },
                { key: "REB", val: "7.1" },
                { key: "3PM", val: "2.3" },
                { key: "MIN", val: "36.2" },
                { key: "FGA", val: "21.4" },
                { stat: "USG%", key: "USG%", val: "31.5" },
                { key: "EFF", val: "62.1" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-[5px] p-2.5 text-center"
                  style={{ backgroundColor: "var(--bg-surface)" }}
                >
                  <p
                    className="text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.stat ? (
                      <StatTooltip stat={s.key}>
                        <span>{s.key}</span>
                      </StatTooltip>
                    ) : (
                      s.key
                    )}
                  </p>
                  <p
                    className="text-base font-body font-bold mt-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PointsHistoryChart data={hitRateBarData} />

        {/* Radar */}
        <div className="card rounded-[5px] p-5">
          <h3
            className="font-display text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Skill Profile
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fontSize: 10,
                  fill: "var(--text-muted)",
                  fontFamily: "Inter",
                }}
              />
              <Radar
                name={player.name}
                dataKey="A"
                stroke="var(--emerald)"
                fill="var(--emerald)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <FullGameLogTable logs={gameLog} />
    </div>
  );
}
