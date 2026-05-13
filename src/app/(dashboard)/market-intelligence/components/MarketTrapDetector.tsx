"use client";
import { TrendingUp, ArrowRightLeft, Activity } from "lucide-react";

// Since SportsData API does NOT provide "Public Ticket %" or "Sharp Money",
// we pivot this component to detect purely objective Line Movements / Steam.
const lineMoveData = [
  {
    game: "LAL vs BOS",
    prop: "LeBron PTS O29.5",
    openingOdds: "-110",
    currentOdds: "-135",
    signal: "steam",
    direction: "up",
    description:
      "Heavy odds movement from -110 to -135 in the last hour. Aggressive action pushing the price.",
  },
  {
    game: "PHX vs MIA",
    prop: "Suns Spread",
    openingOdds: "-2.5",
    currentOdds: "-4.0",
    signal: "drift",
    direction: "up",
    description:
      "Spread drifted 1.5 points. Movement aligns with our model projection showing a 5.6 point Phoenix edge.",
  },
  {
    game: "MIL vs IND",
    prop: "Giannis REB O11.5",
    openingOdds: "-115",
    currentOdds: "+105",
    signal: "fade",
    direction: "down",
    description:
      "Odds flipped to plus money. Expectation of fewer minutes or reduced usage making the Over less likely.",
  },
  {
    game: "GSW vs DEN",
    prop: "Curry 3PM O4.5",
    openingOdds: "+120",
    currentOdds: "+120",
    signal: "hold",
    direction: "flat",
    description:
      "Odds holding entirely stable at +120 despite high game total. Sportsbooks are perfectly balancing risk.",
  },
];

export function MarketTrapDetector() {
  const steamCount = lineMoveData.filter((m) => m.signal === "steam").length;

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity
            className="h-4 w-4"
            style={{ color: "var(--intel-blue)" }}
          />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            True Line Movement Engine
          </h3>
          <span
            className="badge text-[9px]"
            style={{
              backgroundColor: "var(--intel-blue-light)",
              color: "var(--intel-blue)",
            }}
          >
            {steamCount} STEAM MOVE{steamCount !== 1 ? "S" : ""}
          </span>
        </div>
      </div>

      <p
        className="text-[11px] font-body mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Tracks objective line shifting (Opening Odds vs Current Odds) without
        false "public ticket" narratives.
      </p>

      <div className="space-y-3">
        {lineMoveData.map((move, i) => (
          <div
            key={i}
            className="rounded-[5px] p-3"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: `1px solid ${move.signal === "steam" ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
            }}
          >
            {/* Game & Prop */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <span
                  className="text-xs font-body font-semibold mr-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {move.game}
                </span>
                <span
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  {move.prop}
                </span>
              </div>
              <span
                className="badge text-[9px]"
                style={{
                  backgroundColor:
                    move.signal === "steam"
                      ? "var(--intel-blue-light)"
                      : "var(--bg-card)",
                  color:
                    move.signal === "steam"
                      ? "var(--intel-blue)"
                      : "var(--text-secondary)",
                }}
              >
                {move.signal === "steam"
                  ? "🔥 HEAVY STEAM"
                  : move.signal === "fade"
                    ? "📉 FADE"
                    : "⏸ HOLD"}
              </span>
            </div>

            {/* Line Movement Odds */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <TrendingUp
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--emerald)" }}
                />
                <div className="flex-1 flex gap-2 items-center">
                  <span
                    className="text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Open: {move.openingOdds}
                  </span>
                  <ArrowRightLeft className="h-3 w-3 opacity-50" />
                  <span
                    className="text-xs font-body font-bold"
                    style={{ color: "var(--emerald)" }}
                  >
                    Current: {move.currentOdds}
                  </span>
                </div>
              </div>
            </div>

            <p
              className="text-[10px] font-body mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {move.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
