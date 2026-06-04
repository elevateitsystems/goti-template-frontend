"use client";
import React, { useState, useMemo } from "react";
import { useGetAllQuery } from "@/redux/api/userApi";
import {
  Target,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Info,
  AlertCircle,
  Plus,
} from "lucide-react";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function PlayerPropsPage() {
  const [selectedSplit, setSelectedSplit] = useState("Full Game");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all props (we'll derive available filters from the response)
  const {
    data: propsResponse,
    isLoading: loadingProps,
    error,
    refetch,
  } = useGetAllQuery({
    path: "player-props/player-props",
  });

  // Static defaults (used only if backend returns no such fields)
  const defaultSplits = [
    "Full Game",
    "1st Half",
    "1st Quarter",
    "Alternate Lines",
    "Ladder Props",
  ];

  const props = useMemo(() => {
    const resp = propsResponse?.data;

    // If backend already returned a flat array (older format), use it
    if (Array.isArray(resp)) return resp;

    // New backend shape: { data: { success, data: [ events... ] } }
    const events = resp?.data || [];

    const playerMap: Record<string, any> = {};

    events.forEach((ev: any) => {
      const home = ev.homeTeamName;
      const away = ev.awayTeamName;
      (ev.players || []).forEach((p: any) => {
        const playerId = p.playerId || p.playerName || p.player || "unknown";
        const playerTeam = p.teamName || p.teamAbbr || p.team || "";
        const opponent =
          playerTeam && home && away
            ? playerTeam === home
              ? away
              : home
            : ev.opponent || "OPP";

        if (!playerMap[playerId]) {
          playerMap[playerId] = {
            id: playerId,
            playerName: p.playerName || p.player || "Player",
            player: p.playerId || p.player || "",
            team: playerTeam,
            opponent,
            marketNames: new Set<string>(),
            isAlternate: false,
            point: null,
            split: p.split || p.period || "Full Game",
            line: "-",
            bestOverPrice: null,
            bestOverBookmaker: null,
            bestOverProb: -1,
            bestUnderPrice: null,
            bestUnderBookmaker: null,
            bestUnderProb: -1,
            offersCount: 0,
            lastUpdate: null,
            hitRate: p.hitRate ?? "N/A",
            marketsCount: 0,
            rawMarkets: [],
          };
        }

        const entry = playerMap[playerId];

        const markets = p.markets || [];
        if (markets.length === 0) {
          entry.marketsCount += 0;
        }

        markets.forEach((m: any) => {
          entry.marketsCount += 1;
          entry.rawMarkets.push(m);
          entry.marketNames.add(
            m.marketName || m.marketType || m.marketKey || m.name || "Prop",
          );
          entry.isAlternate = entry.isAlternate || !!m.isAlternate;
          entry.split = m.period || m.split || m.marketPeriod || entry.split;

          const lines = m.lines || [];
          const firstLine = lines[0] || {};
          const offers = firstLine.offers || [];
          entry.offersCount += offers.length;

          // compute lastUpdate
          offers.forEach((o: any) => {
            if (!o.lastUpdate) return;
            if (!entry.lastUpdate) entry.lastUpdate = o.lastUpdate;
            else if (new Date(o.lastUpdate) > new Date(entry.lastUpdate))
              entry.lastUpdate = o.lastUpdate;
          });

          // find best over/under in this market
          const overOffers = offers.filter(
            (o: any) => String(o.selection || "").toLowerCase() === "over",
          );
          const underOffers = offers.filter(
            (o: any) => String(o.selection || "").toLowerCase() === "under",
          );

          const bestOver =
            overOffers.find((o: any) => o.isBest) ||
            overOffers.sort(
              (a: any, b: any) =>
                (b.impliedProbability || 0) - (a.impliedProbability || 0),
            )[0];
          const bestUnder =
            underOffers.find((o: any) => o.isBest) ||
            underOffers.sort(
              (a: any, b: any) =>
                (b.impliedProbability || 0) - (a.impliedProbability || 0),
            )[0];

          if (
            bestOver &&
            (bestOver.impliedProbability ?? 0) > (entry.bestOverProb ?? -1)
          ) {
            entry.bestOverProb = bestOver.impliedProbability ?? 0;
            entry.bestOverPrice = bestOver.price ?? entry.bestOverPrice;
            entry.bestOverBookmaker =
              bestOver.bookmakerName ?? entry.bestOverBookmaker;
            entry.point = firstLine.point ?? entry.point;
          }

          if (
            bestUnder &&
            (bestUnder.impliedProbability ?? 0) > (entry.bestUnderProb ?? -1)
          ) {
            entry.bestUnderProb = bestUnder.impliedProbability ?? 0;
            entry.bestUnderPrice = bestUnder.price ?? entry.bestUnderPrice;
            entry.bestUnderBookmaker =
              bestUnder.bookmakerName ?? entry.bestUnderBookmaker;
            entry.point = firstLine.point ?? entry.point;
          }
        });
      });
    });

    // Convert marketNames sets to arrays and prepare final flattened array
    const flattenedArr = Object.values(playerMap).map((e: any) => {
      const marketNamesArr = Array.from(e.marketNames);
      const topMarket = marketNamesArr[0] || "Prop";
      return {
        id: e.id,
        playerName: e.playerName,
        player: e.player,
        team: e.team,
        opponent: e.opponent,
        marketName: topMarket,
        isAlternate: e.isAlternate,
        point: e.point,
        split: e.split,
        line: e.line,
        bestOverPrice: e.bestOverPrice,
        bestOverBookmaker: e.bestOverBookmaker,
        bestUnderPrice: e.bestUnderPrice,
        bestUnderBookmaker: e.bestUnderBookmaker,
        offersCount: e.offersCount,
        lastUpdate: e.lastUpdate,
        hitRate: e.hitRate,
        marketsCount: e.marketsCount,
        rawMarkets: e.rawMarkets,
      };
    });

    return flattenedArr;
  }, [propsResponse]);

  // Derive available splits from flattened props
  const availableSplits = useMemo(() => {
      const s = new Set<string>();
      props.forEach((p: any) => {
        if (p.split) s.add(String(p.split));
      });
      const arr = Array.from(s)
        .filter(Boolean)
        .map((x) => String(x));
      return arr.length > 0 ? arr : defaultSplits;
    }, [props]);

    const showSplitFilter = availableSplits.length > 0;
    const displayedSplits = showSplitFilter ? availableSplits : [];

    // Filter based on search + split only (category filtering removed)
    const displayProps = useMemo(() => {
      return props.filter((prop: any) => {
        const matchesSearch =
          prop.playerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.player?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSplit =
          selectedSplit === "Full Game"
            ? prop.split === "Full Game" || !prop.split
            : prop.split?.toLowerCase() === selectedSplit.toLowerCase() ||
              prop.period?.toLowerCase() === selectedSplit.toLowerCase();

        return matchesSearch && matchesSplit;
      });
    }, [props, searchQuery, selectedSplit]);

    return (
      <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
              <Target className="h-7 w-7 text-emerald-400" />
              Player Props Intelligence
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Compare projections, lines, and historically proven player prop
              trends
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#13151a] border border-white/10 rounded-[5px] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-[5px] border border-white/10 transition-all"
              title="Refresh props data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category filtering removed — UI driven by available markets */}

        {/* Splits Selection Bar (derived from backend) */}
        {showSplitFilter && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171921] p-3 rounded-[5px] border border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Game Splits:
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
              {displayedSplits.map((split) => (
                <button
                  key={split}
                  onClick={() => setSelectedSplit(split)}
                  className={`px-3 py-1 rounded-[5px] text-xs transition-all ${
                    selectedSplit === split
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {split}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error & Loading state */}
        {error ? (
          <div className="card rounded-[5px] p-12 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto mt-10">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Oops! Something Went Wrong
              </h3>
              <p className="text-xs text-gray-400 mt-2">
                We couldn't complete your request at the moment. Please reload
                the page and try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-[5px] transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loadingProps ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="card rounded-[5px] border border-white/5 bg-[#171921] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="w-32">
                  <TableRowSkeleton cols={1} />
                </div>
                <div className="w-24">
                  <TableRowSkeleton cols={1} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="text-xs text-gray-300 divide-y divide-white/5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <TableRowSkeleton key={idx} cols={8} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Analytics Cards / High Value Targets */}
            {displayProps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayProps.slice(0, 3).map((prop: any, idx: number) => (
                  <div
                    key={idx}
                    className="card rounded-[5px] p-5 border relative overflow-hidden bg-gradient-to-br from-[#171921] to-[#1d212d]"
                    style={{ borderColor: "var(--emerald-light)" }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="badge px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-400">
                          🔥 Value Bet
                        </span>
                        <h3 className="font-display text-base font-bold text-white mt-1.5">
                          {prop.playerName || prop.player || "Player"}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {prop.team} vs {prop.opponent || "OPP"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          Hit Rate (L10)
                        </span>
                        <p className="text-lg font-display font-bold text-emerald-400">
                          {prop.hitRate || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5">
                      <div>
                        <span className="text-[10px] text-gray-500">
                          Top Market
                        </span>
                        <p className="text-xs font-semibold text-white">
                          {prop.marketName || "-"}{" "}
                          {prop.isAlternate ? (
                            <span className="text-[10px] ml-1 bg-yellow-500/20 text-yellow-400 px-1 rounded">
                              ALT
                            </span>
                          ) : null}
                        </p>
                        <div className="text-[10px] text-gray-400 mt-1">
                          Point: {prop.point ?? "-"} · Markets:{" "}
                          {prop.marketsCount ?? 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500">
                          Line Proj.
                        </span>
                        <p className="text-sm font-bold text-white font-mono">
                          {prop.line}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Offers: {prop.offersCount ?? 0} • Last:{" "}
                          {prop.lastUpdate
                            ? new Date(prop.lastUpdate).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Props Board */}
            <div className="card rounded-[5px] border border-white/5 bg-[#171921] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-display text-sm font-semibold text-white">
                  Matching Prop Markets ({displayProps.length})
                </h3>
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-emerald-400" /> Odds sourced
                  from top bookmakers
                </span>
              </div>

              {displayProps.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">
                  No active player props found for the selected split "
                  {selectedSplit}".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className="border-b text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#1a1c24]"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <th className="py-4 px-6">Player / Matchup</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6 text-center">Split</th>
                        <th className="py-4 px-6 text-center">
                          Line Projection
                        </th>
                        <th className="py-4 px-6 text-center">Over Odds</th>
                        <th className="py-4 px-6 text-center">Under Odds</th>
                        <th className="py-4 px-6 text-center">Hit Rate</th>
                        <th className="py-4 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-gray-300 divide-y divide-white/5">
                      {displayProps.map((prop: any) => (
                        <tr
                          key={prop.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-white">
                              {prop.playerName || prop.player}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {prop.team} @ {prop.opponent || "OPP"}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">
                            <div className="font-semibold">
                              {prop.marketName || "Prop"}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">
                              Point: {prop.point ?? "-"} · Markets:{" "}
                              {prop.marketsCount ?? 0}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-400">
                            {prop.split || prop.period || "Full Game"}
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-emerald-400 font-mono">
                            {prop.line}
                          </td>
                          <td className="py-4 px-6 text-center font-mono">
                            <div>
                              <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded">
                                {prop.bestOverPrice ?? "-"}
                              </span>
                              <div className="text-[10px] text-gray-500 mt-1">
                                {prop.bestOverBookmaker || ""}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-mono">
                            <div>
                              <span className="bg-[#2a2d3d] text-white px-2.5 py-1 rounded">
                                {prop.bestUnderPrice ?? "-"}
                              </span>
                              <div className="text-[10px] text-gray-500 mt-1">
                                {prop.bestUnderBookmaker || ""}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-emerald-400 font-bold">
                            {prop.hitRate || "N/A"}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button className="px-3 py-1.5 rounded-[5px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1 mx-auto">
                              <Plus className="h-3 w-3" /> Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
