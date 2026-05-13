"use client";
import Link from "next/link";
import { StatTooltip } from "@/components/charts/StatTooltip";

interface PlayerProfileCardProps {
  player: any;
  seasonStats?: any;
}

export function PlayerProfileCard({
  player,
  seasonStats,
}: PlayerProfileCardProps) {
  const stats = [
    { label: "PTS", value: seasonStats?.Points?.toFixed(1) || "--" },
    { label: "AST", value: seasonStats?.Assists?.toFixed(1) || "--" },
    { label: "REB", value: seasonStats?.Rebounds?.toFixed(1) || "--" },
    {
      label: (
        <StatTooltip stat="USG%">
          <span>USG%</span>
        </StatTooltip>
      ),
      value: seasonStats?.UsageRatePercentage?.toFixed(1) || "--",
    },
  ];

  const fullName = `${player?.FirstName || ""} ${player?.LastName || ""}`;
  const initials =
    (player?.FirstName?.charAt(0) || "") + (player?.LastName?.charAt(0) || "");

  // Use backend Image if available, otherwise fallback to official NBA image or initial-based placeholder
  const photoUrl = player?.Image;

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex gap-4">
        <div
          className="w-20 h-20 rounded-[5px] overflow-hidden shrink-0"
          style={{ border: "2px solid var(--border)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={fullName}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://via.placeholder.com/80x80/1E4D3A/fff?text=${initials}`;
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <span
                className="font-display font-bold text-xl"
                style={{ color: "var(--text-primary)" }}
              >
                {initials}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="font-display text-xl font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {fullName}
          </h2>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            {player?.Team} · {player?.Position} · #{player?.Jersey}
          </p>
          <span
            className="mt-1.5 badge text-xs"
            style={{
              backgroundColor:
                player?.Status === "Active"
                  ? "var(--emerald-light)"
                  : player?.Status === "Questionable"
                    ? "var(--gold-light)"
                    : "var(--coral-light)",
              color:
                player?.Status === "Active"
                  ? "var(--emerald)"
                  : player?.Status === "Questionable"
                    ? "var(--gold)"
                    : "var(--coral)",
            }}
          >
            ● {player?.Status}
          </span>
        </div>
      </div>

      {/* Season Averages */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-[5px] p-2 text-center"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {s.label}
            </p>
            <p
              className="text-lg font-body font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <Link
        href={`/player-analytics/${player?.PlayerID}`}
        className="mt-3 w-full py-2 rounded-[5px] border text-xs font-body font-medium flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        View Details ←
      </Link>
    </div>
  );
}
