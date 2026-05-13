"use client";
import { useState, useMemo } from "react";
import { Trophy, Star, TrendingUp, Zap, Plus } from "lucide-react";
import { nbaProps } from "@/data/nba";
import { getRatingColor, getRatingBgColor } from "@/lib/smartRating";
import { useAppDispatch } from "@/redux/hooks";
import { addLeg } from "@/redux/features/parlaySlice";

type FilterTab = "all" | "A" | "B+" | "B";

export function TopPlays() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const sortedProps = useMemo(() => {
    const data = [...nbaProps].sort((a, b) => {
      const ratingOrder = { A: 4, "B+": 3, B: 2, C: 1 };
      if (ratingOrder[b.rating] !== ratingOrder[a.rating])
        return ratingOrder[b.rating] - ratingOrder[a.rating];
      return b.edge - a.edge;
    });
    if (filter === "all") return data;
    return data.filter((p) => p.rating === filter);
  }, [filter]);

  const aCount = nbaProps.filter((p) => p.rating === "A").length;
  const avgEdge = nbaProps.length
    ? (nbaProps.reduce((s, p) => s + p.edge, 0) / nbaProps.length).toFixed(1)
    : "0";
  const avgHitRate = nbaProps.length
    ? Math.round(nbaProps.reduce((s, p) => s + p.hitRate, 0) / nbaProps.length)
    : 0;

  function handleAdd(prop: (typeof nbaProps)[0]) {
    dispatch(addLeg({ id: prop.id, prop, direction: "over" }));
    setAddedIds((prev) => new Set(prev).add(prop.id));
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-[5px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--gold), #E5A800)",
              }}
            >
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <h1
              className="font-display text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Top Plays / Best Bets Section
            </h1>
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Today&apos;s highest value bets ranked by model edge and probability
          </p>
        </div>
      </div>

      {/* Daily Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Total Plays
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--intel-blue)" }}
          >
            {nbaProps.length}
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <div className="flex items-center gap-1.5">
            <Star className="h-3 w-3" style={{ color: "var(--emerald)" }} />
            <p
              className="text-[11px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              A-Rated Plays
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--emerald)" }}
          >
            {aCount}
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Avg Edge
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--gold)" }}
          >
            +{avgEdge}%
          </p>
        </div>
        <div className="card rounded-[5px] p-4">
          <p
            className="text-[11px] font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Avg Hit Rate
          </p>
          <p
            className="text-2xl font-bold font-body mt-0.5"
            style={{ color: "var(--emerald)" }}
          >
            {avgHitRate}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5">
        {(
          [
            { key: "all", label: "All Plays" },
            { key: "A", label: "⭐ A Plays" },
            { key: "B+", label: "B+ Plays" },
            { key: "B", label: "B Plays" },
          ] as { key: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="px-4 py-2 rounded-[5px] text-xs font-body font-semibold transition-all"
            style={{
              backgroundColor:
                filter === tab.key ? "var(--emerald)" : "var(--bg-surface)",
              color: filter === tab.key ? "white" : "var(--text-secondary)",
              border: `1px solid ${filter === tab.key ? "var(--emerald)" : "var(--border)"}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Props Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedProps.map((prop) => (
          <div
            key={prop.id}
            className="card rounded-[5px] p-4 transition-all hover:border-emerald/30"
            style={{
              borderColor:
                prop.rating === "A" ? "rgba(0,229,168,0.2)" : undefined,
            }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden shrink-0"
                  style={{ backgroundColor: "var(--bg-surface)" }}
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
                <div>
                  <p
                    className="text-sm font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {prop.playerName}
                  </p>
                  <p
                    className="text-[11px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {prop.team}
                  </p>
                </div>
              </div>
              <span
                className="badge text-xs font-bold px-2.5 py-1"
                style={{
                  backgroundColor: getRatingBgColor(prop.rating),
                  color: getRatingColor(prop.rating),
                }}
              >
                {prop.rating}
              </span>
            </div>

            {/* Prop Info */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="badge text-[10px]"
                style={{
                  backgroundColor: "var(--intel-blue-light)",
                  color: "var(--intel-blue)",
                }}
              >
                {prop.propCategory}
              </span>
              <span
                className="text-sm font-body font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Over {prop.line}
              </span>
            </div>

            {/* Stats Row */}
            <div
              className="grid grid-cols-3 gap-3 mb-3 py-2 rounded-[5px] px-3"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <div>
                <p
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Projection
                </p>
                <p
                  className="text-sm font-body font-bold"
                  style={{
                    color:
                      prop.projection > prop.line
                        ? "var(--emerald)"
                        : "var(--coral)",
                  }}
                >
                  {prop.projection}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Edge
                </p>
                <p
                  className="text-sm font-body font-bold"
                  style={{
                    color: prop.edge >= 7 ? "var(--emerald)" : "var(--gold)",
                  }}
                >
                  +{prop.edge}%
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Hit Rate
                </p>
                <p
                  className="text-sm font-body font-bold"
                  style={{
                    color:
                      prop.hitRate >= 60 ? "var(--emerald)" : "var(--gold)",
                  }}
                >
                  {prop.hitRate}%{" "}
                  <span
                    className="text-[9px] font-normal"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ({prop.hitFraction})
                  </span>
                </p>
              </div>
            </div>

            {/* Odds Row */}
            <div
              className="flex items-center gap-2 mb-3 text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {Object.entries(prop.odds)
                .slice(0, 4)
                .map(([book, odds]) => (
                  <span
                    key={book}
                    className="px-2 py-1 rounded-[5px]"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    {book}:{" "}
                    <span
                      style={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      {odds > 0 ? `+${odds}` : odds}
                    </span>
                  </span>
                ))}
            </div>

            {/* Confidence + Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-20 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-surface)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${prop.confidence}%`,
                      backgroundColor:
                        prop.confidence >= 80
                          ? "var(--emerald)"
                          : prop.confidence >= 60
                            ? "var(--gold)"
                            : "var(--coral)",
                    }}
                  />
                </div>
                <span
                  className="text-[11px] font-body font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {prop.confidence}% conf
                </span>
              </div>
              <button
                onClick={() => handleAdd(prop)}
                disabled={addedIds.has(prop.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[5px] text-[11px] font-body font-semibold transition-all"
                style={{
                  backgroundColor: addedIds.has(prop.id)
                    ? "var(--emerald-light)"
                    : "var(--emerald)",
                  color: addedIds.has(prop.id) ? "var(--emerald)" : "white",
                }}
              >
                <Plus className="h-3 w-3" />
                {addedIds.has(prop.id) ? "Added" : "Add to Parlay"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
