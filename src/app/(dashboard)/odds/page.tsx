"use client";
import React, { useState } from "react";
import { useGetAllQuery } from "@/redux/api/userApi";
import { TrendingUp, RefreshCw, BarChart2, DollarSign, Activity } from "lucide-react";

export default function OddsPage() {
  const { data: oddsResponse, isLoading: loadingOdds, refetch } = useGetAllQuery({
    path: "v1/odds",
  });
  const [activeBookmaker, setActiveBookmaker] = useState("DraftKings");

  const odds = oddsResponse?.data || [
    {
      id: "odds-1",
      sport: "nba",
      homeTeam: "Golden State Warriors",
      awayTeam: "Los Angeles Lakers",
      bookmaker: "DraftKings",
      homeOdds: -110,
      awayOdds: +115,
      spread: -2.5,
      total: 224.5,
    },
    {
      id: "odds-2",
      sport: "nba",
      homeTeam: "Boston Celtics",
      awayTeam: "Miami Heat",
      bookmaker: "DraftKings",
      homeOdds: -140,
      awayOdds: +120,
      spread: -4.5,
      total: 215.5,
    }
  ];

  const bookmakers = ["DraftKings", "FanDuel", "BetMGM", "Caesars"];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-emerald-400" />
            Odds & Market Bookmakers
          </h1>
          <p className="text-sm text-gray-400 mt-1">Real-time bookmaker line spreads, moneylines, and over/under totals</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-[5px] text-xs font-semibold transition-all border border-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Odds
        </button>
      </div>

      {/* Bookmaker tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {bookmakers.map((bm) => (
          <button
            key={bm}
            onClick={() => setActiveBookmaker(bm)}
            className={`px-4 py-2 text-xs font-semibold rounded-[5px] border transition-all ${
              activeBookmaker === bm
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {bm}
          </button>
        ))}
      </div>

      {loadingOdds ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
        </div>
      ) : odds.length === 0 ? (
        <div className="card rounded-[5px] p-8 text-center text-gray-400">
          No odds data available for the selected bookmaker at this moment.
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-[5px] bg-[#171921]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#1a1c24]" style={{ borderColor: "var(--border)" }}>
                <th className="py-4 px-6">Match Event</th>
                <th className="py-4 px-6">Bookmaker</th>
                <th className="py-4 px-6 text-center">Moneyline (Home/Away)</th>
                <th className="py-4 px-6 text-center">Point Spread</th>
                <th className="py-4 px-6 text-center">Total O/U</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-white/5">
              {odds.map((odd: any) => (
                <tr key={odd.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    {odd.awayTeam} @ {odd.homeTeam}
                  </td>
                  <td className="py-4 px-6 font-medium text-emerald-400">
                    {odd.bookmaker || activeBookmaker}
                  </td>
                  <td className="py-4 px-6 text-center font-mono">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded mr-1">
                      {odd.homeOdds > 0 ? `+${odd.homeOdds}` : odd.homeOdds}
                    </span>
                    <span className="bg-[#2a2d3d] text-white px-2 py-1 rounded">
                      {odd.awayOdds > 0 ? `+${odd.awayOdds}` : odd.awayOdds}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-white font-mono">
                    {odd.spread > 0 ? `+${odd.spread}` : odd.spread}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400 font-mono">
                    {odd.total}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                      <Activity className="h-3 w-3" /> Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
