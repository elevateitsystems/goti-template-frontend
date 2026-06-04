"use client";
import { getRatingBgColor, getRatingColor } from "@/lib/smartRating";
import { useGetAllQuery } from "@/redux/api/userApi";
import { addLeg } from "@/redux/features/parlaySlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Star,
  Trophy
} from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonSkeleton } from "@/components/ui/Skeleton";

type FilterTab = "all" | "A" | "B+" | "B";

export function TopPlays() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const {
    data: betsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllQuery({
    path: "best-bets/best-bets",
  });

  const bets = useMemo(() => {
    if (!betsResponse?.data) return [];
    if (Array.isArray(betsResponse.data)) return betsResponse.data;
    if (Array.isArray(betsResponse.data.data)) return betsResponse.data.data;
    return [];
  }, [betsResponse]);

  const sortedProps = useMemo(() => {
    const data = [...bets].sort((a: any, b: any) => {
      const ratingOrder: Record<string, number> = { A: 4, "B+": 3, B: 2, C: 1 };
      const ratingA =
        a.rating || (a.edge >= 8 ? "A" : a.edge >= 5 ? "B+" : "B");
      const ratingB =
        b.rating || (b.edge >= 8 ? "A" : b.edge >= 5 ? "B+" : "B");
      if (ratingOrder[ratingB] !== ratingOrder[ratingA])
        return (ratingOrder[ratingB] || 0) - (ratingOrder[ratingA] || 0);
      return (b.edge || 0) - (a.edge || 0);
    });

    if (filter === "all") return data;
    return data.filter((p: any) => {
      const rating = p.rating || (p.edge >= 8 ? "A" : p.edge >= 5 ? "B+" : "B");
      return rating === filter;
    });
  }, [bets, filter]);

  // Compute stats dynamically from active backend bets
  const stats = useMemo(() => {
    if (!bets.length)
      return { total: 0, aCount: 0, avgEdge: "0.0", avgHitRate: 0 };

    const total = bets.length;
    const aCount = bets.filter((p: any) => {
      const r = p.rating || (p.edge >= 8 ? "A" : p.edge >= 5 ? "B+" : "B");
      return r === "A";
    }).length;

    const sumEdge = bets.reduce(
      (sum: number, p: any) => sum + (p.edge || 0),
      0,
    );
    const avgEdge = (sumEdge / total).toFixed(1);

    const sumHit = bets.reduce(
      (sum: number, p: any) => sum + (p.hitRate || 0),
      0,
    );
    const avgHitRate = Math.round(sumHit / total);

    return { total, aCount, avgEdge, avgHitRate };
  }, [bets]);

  function handleAdd(prop: any) {
    const normalizedProp = {
      id: prop.id,
      playerID: typeof prop.playerID === "number" ? prop.playerID : prop.playerID?.toString().match(/\d+/)?.[0] ? Number(prop.playerID) : 0,
      playerName: prop.playerName || prop.player || "Player",
      team: prop.team || "NBA",
      photoUrl: prop.photoUrl || "https://via.placeholder.com/150",
      propCategory: (prop.propCategory || prop.category || "Points") as any,
      line: prop.line ?? 19.5,
      projection: prop.projection ?? 22.4,
      edge: prop.edge ?? 8.5,
      hitRate: prop.hitRate ?? 70,
      hitFraction: prop.hitFraction || "7/10",
      confidence: prop.confidence ?? 80,
      rating:
        prop.rating || (prop.edge >= 8 ? "A" : prop.edge >= 5 ? "B+" : "B"),
      odds: prop.odds || { DraftKings: -110 },
      bestOdds: prop.bestOdds ?? -110,
      bestBook: prop.bestBook || "DraftKings",
    };
    dispatch(addLeg({ id: prop.id, prop: normalizedProp, direction: "over" }));
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
              Top Plays & Best Bets
            </h1>
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Today&apos;s highest value bets ranked by model edge and probability
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-[5px] text-xs font-semibold transition-all border border-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
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
            {stats.total}
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
            {stats.aCount}
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
            +{stats.avgEdge}%
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
            {stats.avgHitRate}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      {bets.length > 0 && (
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
      )}

      {/* Loading & State management */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
          <span className="text-xs text-gray-400">
            Loading model best bets...
          </span>
        </div>
      ) : error ? (
        <div className="card rounded-[5px] p-8 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-red-400 animate-bounce" />
          <div>
            <h4 className="text-sm font-bold text-white">
              Oops! Something Went Wrong
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              We couldn't complete your request at the moment. Please reload the
              page and try again.
            </p>

            {isLoading ? (
              <ButtonSkeleton className="mx-auto w-36" />
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="flex item-center justify-center mx-auto"
              >
                <RefreshCw className="mt-1 w-4 h-4 mr-1" />
                Try Again
              </button>
            )}
          </div>
        </div>
      ) : sortedProps.length === 0 ? (
        <div className="card rounded-[5px] p-8 text-center text-gray-400">
          No betting model signals or best bets are currently registered.
        </div>
      ) : (
        /* Props Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedProps.map((prop: any) => {
            const rating =
              prop.rating ||
              (prop.edge >= 8 ? "A" : prop.edge >= 5 ? "B+" : "B");
            return (
              <div
                key={prop.id}
                className="card rounded-[5px] p-4 transition-all hover:border-emerald/30 border border-white/5"
                style={{
                  borderColor:
                    rating === "A" ? "rgba(0,229,168,0.2)" : undefined,
                }}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#252836] border border-white/5">
                      {prop.photoUrl ? (
                        <img
                          src={prop.photoUrl}
                          alt={prop.playerName || prop.player}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Star className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold text-white">
                        {prop.playerName || prop.player}
                      </p>
                      <p className="text-[11px] font-body text-gray-400">
                        {prop.team} vs {prop.opponent || "OPP"}
                      </p>
                    </div>
                  </div>
                  <span
                    className="badge text-xs font-bold px-2.5 py-1"
                    style={{
                      backgroundColor: getRatingBgColor(rating),
                      color: getRatingColor(rating),
                    }}
                  >
                    {rating}
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
                    {prop.propCategory || prop.category || "Points"}
                  </span>
                  <span className="text-sm font-body font-semibold text-white">
                    {prop.betType || prop.direction || "Over"} {prop.line}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-3 py-2 rounded-[5px] px-3 bg-[#13151a]">
                  <div>
                    <p className="text-[10px] font-body text-gray-500">
                      Projection
                    </p>
                    <p
                      className="text-sm font-body font-bold"
                      style={{
                        color:
                          (prop.projection || 0) > (prop.line || 0)
                            ? "var(--emerald)"
                            : "var(--coral)",
                      }}
                    >
                      {prop.projection || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-body text-gray-500">Edge</p>
                    <p className="text-sm font-body font-bold text-emerald-400">
                      +{prop.edge || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-body text-gray-500">
                      Hit Rate
                    </p>
                    <p className="text-sm font-body font-bold text-emerald-400">
                      {prop.hitRate || 0}%{" "}
                      {prop.hitFraction && (
                        <span className="text-[9px] font-normal text-gray-500">
                          ({prop.hitFraction})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Odds Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] font-body text-gray-400">
                  {prop.odds &&
                    Object.entries(prop.odds)
                      .slice(0, 3)
                      .map(([book, oddsValue]: any) => (
                        <span
                          key={book}
                          className="px-2 py-1 rounded-[5px] bg-[#1a1c24]"
                        >
                          {book}:{" "}
                          <span className="text-white font-semibold">
                            {oddsValue > 0 ? `+${oddsValue}` : oddsValue}
                          </span>
                        </span>
                      ))}
                </div>

                {/* Confidence + Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden bg-[#13151a]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${prop.confidence || 75}%`,
                          backgroundColor:
                            (prop.confidence || 75) >= 80
                              ? "var(--emerald)"
                              : (prop.confidence || 75) >= 60
                                ? "var(--gold)"
                                : "var(--coral)",
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-body font-semibold text-gray-300">
                      {prop.confidence || 75}% conf
                    </span>
                  </div>
                  <button
                    onClick={() => handleAdd(prop)}
                    disabled={addedIds.has(prop.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-[5px] text-[11px] font-body font-semibold transition-all bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-500 text-white"
                  >
                    <Plus className="h-3 w-3" />
                    {addedIds.has(prop.id) ? "Added" : "Add to Parlay"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
