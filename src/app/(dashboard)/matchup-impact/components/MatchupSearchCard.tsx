"use client";

import { Search } from "lucide-react";
import React from "react";

export type PlayerOption = {
  id: string;
  label: string;
  teamAbbr: string;
  teamName: string;
  position: string;
  eventId: string;
  eventLabel: string;
  sport: string;
  leagueId: string;
  marketCount: number;
};

type MatchupSearchCardProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingPlayers: boolean;
  filteredPlayers: PlayerOption[];
  selectPlayer: (player: PlayerOption) => void;
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function MatchupSearchCard({
  searchInput,
  setSearchInput,
  dropdownOpen,
  setDropdownOpen,
  loadingPlayers,
  filteredPlayers,
  selectPlayer,
  handleSearchSubmit,
}: MatchupSearchCardProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="card rounded-[5px] p-4 border border-white/5 bg-[#171921]">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
          Search Live Player Props
        </h3>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search player by name, id, team, or event..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => window.setTimeout(() => setDropdownOpen(false), 150)}
              className="w-full bg-[#13151a] border border-white/10 rounded-[5px] pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />

            {dropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-80 overflow-y-auto rounded-[5px] border border-white/10 bg-[#0d1117] shadow-xl">
                <div className="space-y-3 p-3">
                  {loadingPlayers ? (
                    <div className="p-3 text-xs text-gray-400">Loading players...</div>
                  ) : filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => selectPlayer(player)}
                        className="w-full rounded-[5px] border border-white/10 bg-[#141826] px-4 py-4 text-left text-xs text-white transition hover:border-emerald-500/30 hover:bg-[#1b2140]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-white truncate">
                              {player.label}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-400 truncate">
                              {player.position || "Unknown position"} • {player.eventLabel || "Unknown event"}
                            </p>
                            <p className="mt-2 text-[10px] text-gray-500 truncate">
                              {player.sport ? player.sport.toUpperCase() : "SPORT"} • {player.leagueId?.toUpperCase() || "LEAGUE"}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-gray-300">
                            {player.teamAbbr || player.teamName || "TEAM"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-gray-400">
                          <span>ID: {player.id}</span>
                          <span>{player.marketCount} markets</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-xs text-gray-400">No players match that search.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 rounded-[5px] bg-emerald-600 text-white text-xs font-semibold transition hover:bg-emerald-500"
          >
            Load matchup analysis
          </button>
        </form>
      </div>
    </div>
  );
}
