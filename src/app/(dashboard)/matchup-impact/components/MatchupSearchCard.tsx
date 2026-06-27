"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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
  selectedPlayerId?: string;
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
  selectedPlayerId,
}: MatchupSearchCardProps) {
  return (
    <div className="space-y-4">
      <div className="card overflow-visible rounded-[8px]">
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="text-xs font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--text-secondary)" }}
          >
            Matchup Search
          </h3>
          <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--gold)" }} />
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3 p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => window.setTimeout(() => setDropdownOpen(false), 150)}
              className="w-full rounded-[6px] border py-2.5 pl-9 pr-3 text-xs outline-none transition"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />

            {dropdownOpen && (
              <div
                className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-[8px] border shadow-xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
                }}
              >
                <div className="space-y-2 p-2">
                  {loadingPlayers ? (
                    <div className="p-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                      Loading players...
                    </div>
                  ) : filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onMouseDown={() => selectPlayer(player)}
                        className="w-full rounded-[6px] border px-3 py-3 text-left text-xs transition hover:opacity-90"
                        style={{
                          backgroundColor:
                            player.id === selectedPlayerId
                              ? "var(--emerald-light)"
                              : "var(--bg-surface)",
                          borderColor:
                            player.id === selectedPlayerId
                              ? "var(--emerald)"
                              : "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {player.label}
                            </p>
                            <p className="mt-1 truncate text-[10px]" style={{ color: "var(--text-secondary)" }}>
                              {player.position || "Unknown position"} •{" "}
                              {player.eventLabel || "Unknown event"}
                            </p>
                            <p className="mt-2 truncate text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {player.sport ? player.sport.toUpperCase() : "SPORT"} •{" "}
                              {player.leagueId?.toUpperCase() || "LEAGUE"}
                            </p>
                          </div>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]"
                            style={{
                              backgroundColor: "var(--gold-light)",
                              color: "var(--gold)",
                            }}
                          >
                            {player.teamAbbr || player.teamName || "TEAM"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                          <span>ID: {player.id}</span>
                          <span>{player.marketCount} markets</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                      No players match that search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-[6px] px-3 py-2.5 text-xs font-semibold text-[#06110f] transition hover:opacity-90"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            Load matchup analysis
          </button>
        </form>
      </div>
    </div>
  );
}
