"use client";

interface PlayerCardProps {
  name: string;
  team: string;
  jerseyNumber: number;
  photoUrl: string;
  bet: string;
  projection: number;
  stat: string;
  odds: string;
  confidence: number;
  hitRate?: number;
  hitFraction?: string;
  showHotPick?: boolean;
  onBetClick?: () => void;
}

export function PlayerCard({
  name,
  team,
  jerseyNumber,
  photoUrl,
  bet,
  projection,
  stat,
  odds,
  confidence,
  hitRate,
  hitFraction,
  showHotPick = true,
  onBetClick,
}: PlayerCardProps) {
  const confColor =
    confidence >= 70
      ? "var(--emerald)"
      : confidence >= 50
        ? "var(--gold)"
        : "var(--coral)";

  return (
    <div className="card rounded-[5px] p-5 flex flex-col items-center text-center relative overflow-hidden">
      {/* Gold accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{
          background:
            "linear-gradient(90deg, var(--gold), var(--gold-tint), transparent)",
        }}
      />

      {showHotPick && (
        <div className="absolute top-4 left-3">
          <span
            className="badge text-white text-[9px]"
            style={{ backgroundColor: "var(--gold)", letterSpacing: "0.08em" }}
          >
            🔥 HOT PICK
          </span>
        </div>
      )}

      {/* Player Photo */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden mt-5 mb-3 ring-2 ring-offset-2"
        style={{ boxShadow: "0 0 0 2px var(--gold)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/100x100/1E4D3A/ffffff?text=" +
              name.charAt(0);
          }}
        />
      </div>

      <h3
        className="font-display text-lg font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {name}
      </h3>
      <p
        className="text-xs font-body mt-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        {team} · #{jerseyNumber}
      </p>

      {/* Bet Info */}
      <div className="mt-3 w-full space-y-2">
        <div
          className="rounded-[5px] px-3 py-2"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <p
            className="text-sm font-body font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {bet}
          </p>
          <div className="flex justify-between items-center mt-1">
            <span
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Projection
            </span>
            <span className="text-sm font-body font-bold text-profit">
              {projection} {stat}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Odds
            </span>
            <span
              className="text-sm font-body font-bold"
              style={{
                color: odds.startsWith("+") ? "var(--emerald)" : "var(--coral)",
              }}
            >
              {odds}
            </span>
          </div>
        </div>

        {/* Confidence + Hit Rate */}
        <div className="flex gap-2">
          <div
            className="flex-1 rounded-[5px] px-2 py-2"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Confidence
            </p>
            <p
              className="text-base font-body font-bold"
              style={{ color: confColor }}
            >
              {confidence}%
            </p>
          </div>
          {hitRate !== undefined && (
            <div
              className="flex-1 rounded-[5px] px-2 py-2"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <p
                className="text-[10px] font-body"
                style={{ color: "var(--text-muted)" }}
              >
                Hit Rate
              </p>
              <p
                className="text-base font-body font-bold"
                style={{
                  color: hitRate >= 50 ? "var(--emerald)" : "var(--coral)",
                }}
              >
                {hitRate}%
              </p>
              {hitFraction && (
                <p
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  {hitFraction}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="w-full mt-2 mb-3">
        <div
          className="h-1.5 rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${confidence}%`, backgroundColor: confColor }}
          />
        </div>
      </div>

      <button
        onClick={onBetClick}
        className="w-full py-2.5 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: "var(--emerald)" }}
      >
        BET NOW →
      </button>
    </div>
  );
}
