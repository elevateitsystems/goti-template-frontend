"use client";
import { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  X,
  AlertTriangle,
  Search,
  Copy,
  Save,
  Trash2,
} from "lucide-react";
import { nbaProps } from "@/data/nba";
import { nbaCorrelations } from "@/data/nba";
import { getRatingColor, getRatingBgColor } from "@/lib/smartRating";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addLeg, removeLeg, clearParlay } from "@/redux/features/parlaySlice";
import type { PropCard } from "@/types";

export function ParlayBuilder() {
  const dispatch = useAppDispatch();
  const legs = useAppSelector((state) => state.parlay.legs);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProps = useMemo(() => {
    if (!searchQuery) return nbaProps.slice(0, 12);
    const q = searchQuery.toLowerCase();
    return nbaProps.filter(
      (p) =>
        p.playerName.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.propCategory.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const legIds = new Set(legs.map((l) => l.id));

  // Calculate parlay math
  const combinedProbability = useMemo(() => {
    if (legs.length === 0) return 0;
    return legs.reduce((prob, leg) => prob * (leg.prop.hitRate / 100), 1) * 100;
  }, [legs]);

  const trueOdds = useMemo(() => {
    if (combinedProbability <= 0) return 0;
    const decimal = 100 / combinedProbability;
    return decimal >= 2
      ? Math.round((decimal - 1) * 100)
      : Math.round(-100 / (decimal - 1));
  }, [combinedProbability]);

  const sportsbookOdds = useMemo(() => {
    if (legs.length === 0) return 0;
    // Simulated sportsbook odds (slightly worse than true odds)
    const adjustedProb = combinedProbability * 0.88;
    if (adjustedProb <= 0) return 0;
    const decimal = 100 / adjustedProb;
    return decimal >= 2
      ? Math.round((decimal - 1) * 100)
      : Math.round(-100 / (decimal - 1));
  }, [combinedProbability, legs.length]);

  const expectedValue = useMemo(() => {
    if (legs.length === 0) return 0;
    const impliedProb =
      sportsbookOdds > 0
        ? 100 / (sportsbookOdds + 100)
        : Math.abs(sportsbookOdds) / (Math.abs(sportsbookOdds) + 100);
    return (combinedProbability / 100 - impliedProb) * 100;
  }, [combinedProbability, sportsbookOdds, legs.length]);

  // Correlation warnings
  const correlationWarnings = useMemo(() => {
    const warnings: string[] = [];
    for (let i = 0; i < legs.length; i++) {
      for (let j = i + 1; j < legs.length; j++) {
        const a = legs[i].prop.playerName;
        const b = legs[j].prop.playerName;
        const corr = nbaCorrelations.find(
          (c) =>
            (c.playerA === a && c.playerB === b) ||
            (c.playerA === b && c.playerB === a),
        );
        if (corr && Math.abs(corr.correlation) > 0.4) {
          const direction = corr.correlation > 0 ? "positively" : "negatively";
          warnings.push(
            `${a} & ${b} are ${direction} correlated (${(corr.correlation * 100).toFixed(0)}%) — ${corr.statA} ↔ ${corr.statB}`,
          );
        }
      }
    }
    return warnings;
  }, [legs]);

  function handleAdd(prop: PropCard) {
    dispatch(addLeg({ id: prop.id, prop, direction: "over" }));
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-[5px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
          >
            <Layers className="h-4 w-4 text-white" />
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Parlay Builder
          </h1>
        </div>
        <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
          Combine props, see combined probability, and check correlation risks
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Prop Selector */}
        <div className="xl:col-span-2 space-y-4">
          {/* Search */}
          <div className="card rounded-[5px] p-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-[5px] border mb-4"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
            >
              <Search
                className="h-3.5 w-3.5"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                className="bg-transparent outline-none text-sm font-body flex-1"
                style={{ color: "var(--text-primary)" }}
                placeholder="Search player, team, or prop category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {filteredProps.map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center gap-3 p-3 rounded-[5px] transition-colors"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: `1px solid ${legIds.has(prop.id) ? "var(--emerald)" : "var(--border)"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <img
                      src={prop.photoUrl}
                      alt={prop.playerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-body font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {prop.playerName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-body"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {prop.team}
                      </span>
                      <span
                        className="badge text-[9px]"
                        style={{
                          backgroundColor: "var(--intel-blue-light)",
                          color: "var(--intel-blue)",
                        }}
                      >
                        {prop.propCategory}
                      </span>
                      <span
                        className="text-[10px] font-body font-semibold"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        O {prop.line}
                      </span>
                    </div>
                  </div>
                  <div className="text-right mr-2">
                    <p
                      className="text-xs font-body font-bold"
                      style={{ color: "var(--emerald)" }}
                    >
                      +{prop.edge}%
                    </p>
                    <p
                      className="text-[10px] font-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {prop.hitRate}% HR
                    </p>
                  </div>
                  <span
                    className="badge text-[10px] px-1.5"
                    style={{
                      backgroundColor: getRatingBgColor(prop.rating),
                      color: getRatingColor(prop.rating),
                    }}
                  >
                    {prop.rating}
                  </span>
                  <button
                    onClick={() =>
                      legIds.has(prop.id)
                        ? dispatch(removeLeg(prop.id))
                        : handleAdd(prop)
                    }
                    className="w-7 h-7 rounded-[5px] flex items-center justify-center transition-all shrink-0"
                    style={{
                      backgroundColor: legIds.has(prop.id)
                        ? "var(--emerald)"
                        : "var(--bg-card)",
                      color: legIds.has(prop.id)
                        ? "white"
                        : "var(--text-secondary)",
                      border: `1px solid ${legIds.has(prop.id) ? "var(--emerald)" : "var(--border)"}`,
                    }}
                  >
                    {legIds.has(prop.id) ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Parlay Slip */}
        <div className="space-y-4">
          <div className="card rounded-[5px] p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-display text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Parlay Slip ({legs.length} leg{legs.length !== 1 ? "s" : ""})
              </h2>
              {legs.length > 0 && (
                <button
                  onClick={() => dispatch(clearParlay())}
                  className="text-[10px] font-body font-semibold flex items-center gap-1 px-2 py-1 rounded-[5px] transition-colors hover:opacity-80"
                  style={{
                    color: "var(--coral)",
                    backgroundColor: "var(--coral-light)",
                  }}
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            {legs.length === 0 ? (
              <div className="py-8 text-center">
                <Layers
                  className="h-8 w-8 mx-auto mb-2"
                  style={{ color: "var(--text-muted)" }}
                />
                <p
                  className="text-sm font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Add props to build your parlay
                </p>
              </div>
            ) : (
              <>
                {/* Legs */}
                <div className="space-y-2 mb-4">
                  {legs.map((leg) => (
                    <div
                      key={leg.id}
                      className="flex items-center gap-2 p-2.5 rounded-[5px]"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-body font-semibold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {leg.prop.playerName}
                        </p>
                        <p
                          className="text-[10px] font-body"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {leg.prop.propCategory} O {leg.prop.line}
                        </p>
                      </div>
                      <span
                        className="text-xs font-body font-bold"
                        style={{ color: "var(--emerald)" }}
                      >
                        {leg.prop.hitRate}%
                      </span>
                      <button
                        onClick={() => dispatch(removeLeg(leg.id))}
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{ color: "var(--coral)" }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Correlation Warnings */}
                {correlationWarnings.length > 0 && (
                  <div
                    className="mb-4 p-3 rounded-[5px]"
                    style={{
                      backgroundColor: "var(--coral-light)",
                      border: "1px solid rgba(255,77,109,0.3)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--coral)" }}
                      />
                      <span
                        className="text-[11px] font-body font-bold"
                        style={{ color: "var(--coral)" }}
                      >
                        Correlation Risk
                      </span>
                    </div>
                    {correlationWarnings.map((w, i) => (
                      <p
                        key={i}
                        className="text-[10px] font-body mt-1"
                        style={{ color: "var(--coral)" }}
                      >
                        • {w}
                      </p>
                    ))}
                  </div>
                )}

                {/* Combined Stats */}
                <div
                  className="space-y-3 p-3 rounded-[5px] mb-4"
                  style={{ backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="flex justify-between">
                    <span
                      className="text-xs font-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Combined Probability
                    </span>
                    <span
                      className="text-xs font-body font-bold"
                      style={{ color: "var(--intel-blue)" }}
                    >
                      {combinedProbability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-xs font-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      True Odds
                    </span>
                    <span
                      className="text-xs font-body font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {trueOdds > 0 ? `+${trueOdds}` : trueOdds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-xs font-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Sportsbook Odds
                    </span>
                    <span
                      className="text-xs font-body font-bold"
                      style={{ color: "var(--emerald)" }}
                    >
                      {sportsbookOdds > 0
                        ? `+${sportsbookOdds}`
                        : sportsbookOdds}
                    </span>
                  </div>
                  <div
                    className="h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                  <div className="flex justify-between">
                    <span
                      className="text-xs font-body font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Expected Value
                    </span>
                    <span
                      className="text-sm font-body font-bold"
                      style={{
                        color:
                          expectedValue > 0 ? "var(--emerald)" : "var(--coral)",
                      }}
                    >
                      {expectedValue > 0 ? "+" : ""}
                      {expectedValue.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs">
                    <Save className="h-3.5 w-3.5" /> Save Parlay
                  </button>
                  <button className="btn-outline flex items-center justify-center gap-1.5 text-xs px-3">
                    <Copy className="h-3.5 w-3.5" /> Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
