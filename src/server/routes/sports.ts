import "server-only";

import type { NextRequest } from "next/server";

import { nbaPlayers } from "@/data/nba/players";
import { ApiError, requestBody, success } from "@/server/api";
import { moneyline, searchQuery } from "@/server/moneyline";
import { bestBetPlays } from "@/server/routes/plays";

function required(value: string | undefined, name: string) {
  if (!value) throw new ApiError(400, `${name} is required`, "VALIDATION_ERROR");
  return value;
}

function statValue(row: unknown) {
  if (!row || typeof row !== "object") return 0;
  const record = row as Record<string, unknown>;
  const value = record.points ?? record.pts ?? record.fantasyPoints ?? record.projection ?? record.value;
  return typeof value === "number" ? value : Number(value) || 0;
}

function correlation(left: unknown[], right: unknown[]) {
  const length = Math.min(left.length, right.length);
  if (length < 2) return 0;
  const x = left.slice(0, length).map(statValue);
  const y = right.slice(0, length).map(statValue);
  const avgX = x.reduce((sum, value) => sum + value, 0) / length;
  const avgY = y.reduce((sum, value) => sum + value, 0) / length;
  const numerator = x.reduce((sum, value, index) => sum + (value - avgX) * (y[index] - avgY), 0);
  const denominator = Math.sqrt(x.reduce((sum, value) => sum + (value - avgX) ** 2, 0)) * Math.sqrt(y.reduce((sum, value) => sum + (value - avgY) ** 2, 0));
  return denominator ? Math.round((numerator / denominator) * 100) / 100 : 0;
}

export async function sportsRoutes(request: NextRequest, path: string[]) {
  const query = searchQuery(request.nextUrl.searchParams);

  if (path[0] === "sports" && request.method === "GET") {
    if (path[1] === "leagues" && path[2]) return success("League retrieved successfully", await moneyline(`/leagues/${path[2]}`, query));
    if (path[1] === "leagues") return success("Leagues retrieved successfully", await moneyline("/leagues", query));
    return success("Sports retrieved successfully", await moneyline("/sports", query));
  }

  if (path[0] === "rankings" && request.method === "GET" && path[1] === "leagues") {
    const leagueId = required(path[2], "leagueId");
    return success("League rankings retrieved successfully", await moneyline(`/leagues/${leagueId}/rankings`, query));
  }

  if (path[0] === "events" && request.method === "GET") {
    if (!path[1]) return success("Events retrieved successfully", await moneyline("/events", query));
    if (path[1] === "live") return success("Live events retrieved successfully", await moneyline("/events/live", query));
    if (path[1] === "today") return success("Today's events retrieved successfully", await moneyline("/events/today", query));
    if (path[1] === "leagues" && path[3] === "scores") return success("League scores retrieved successfully", await moneyline(`/leagues/${path[2]}/scores`, query));
    if (path[1] === "leagues" && path[3] === "standings") return success("League standings retrieved successfully", await moneyline(`/leagues/${path[2]}/standings`, query));
    if (path[2] === "play-by-play") return success("Play-by-play retrieved successfully", await moneyline(`/events/${path[1]}/play-by-play`, query));
    return success("Event retrieved successfully", await moneyline(`/events/${path[1]}`, query));
  }

  if (path[0] === "teams-and-players" && request.method === "GET") {
    if (!path[1]) return success("Teams retrieved successfully", await moneyline("/teams", query));
    if (path[1] === "leagues" && path[3] === "teams") return success("League teams retrieved successfully", await moneyline(`/leagues/${path[2]}/teams`, query));
    if (path[1] === "teams" && path[2]) {
      const suffix = path[3] ? `/${path[3]}` : "";
      return success("Team data retrieved successfully", await moneyline(`/teams/${path[2]}${suffix}`, query));
    }
    if (path[1] === "players") {
      if (!path[2]) return success("Players retrieved successfully", await moneyline("/players", query));
      if (["trending", "trends"].includes(path[2])) return success("Player trends retrieved successfully", await moneyline(`/players/${path[2]}`, query));
      const suffix = path[3] ? `/${path[3]}` : "";
      return success("Player data retrieved successfully", await moneyline(`/players/${path[2]}${suffix}`, query));
    }
  }

  if (path[0] === "odds" && request.method === "GET") {
    if (path[1] === "bookmakers") return success("Bookmakers retrieved successfully", await moneyline("/odds/bookmakers", query));
    if (path[1] === "events" && path[3] === "odds") return success("Event odds retrieved successfully", await moneyline(`/events/${path[2]}/odds`, query));
    if (path[1] === "events" && path[3] === "odds-history") return success("Odds history retrieved successfully", await moneyline(`/events/${path[2]}/odds-history`, query));
    return success("Odds retrieved successfully", await moneyline("/odds", query));
  }

  if (path[0] === "player-props" && request.method === "GET") {
    if (path[1] === "markets") return success("Player prop markets retrieved successfully", await moneyline("/player-props/markets", query));
    if (path[1] === "events" && path[3] === "player-props") return success("Event player props retrieved successfully", await moneyline(`/events/${path[2]}/player-props`, query));
    return success("Player props retrieved successfully", await moneyline("/player-props", query));
  }

  if (path[0] === "edge" && request.method === "GET") {
    if (path[1] === "edge") {
      const suffix = path[2] ? `/${path[2]}` : "";
      return success("Edge data retrieved successfully", await moneyline(`/edge${suffix}`, query));
    }
    if (path[1] === "events" && path[3] === "edge") return success("Event edge retrieved successfully", await moneyline(`/events/${path[2]}/edge`, query));
  }

  if (path[0] === "best-bets" && request.method === "GET") {
    if (path[1] === "best-bets") {
      if (request.nextUrl.searchParams.get("source") === "external") {
        const { source: _source, ...externalQuery } = query;
        return success("External best bets retrieved successfully", await moneyline("/best-bets", externalQuery));
      }
      return success("Manual best bets retrieved successfully", await bestBetPlays(request.nextUrl.searchParams));
    }
    if (path[1] === "events" && path[3] === "best-bets") return success("Event best bets retrieved successfully", await moneyline(`/events/${path[2]}/best-bets`, query));
  }

  if (path[0] === "analysis") {
    const sport = request.nextUrl.searchParams.get("sport") ?? "basketball";
    const league = request.nextUrl.searchParams.get("league") ?? (sport === "basketball" ? "nba" : sport);
    const date = request.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    if (request.method === "GET" && path[1] === "dfs-pricing") return success("DFS Pricing retrieved", await moneyline("/dfs", { sport, league, date }));
    if (request.method === "GET" && path[1] === "injuries") return success("Injuries retrieved dynamically", await moneyline("/injuries", { sport, league }));
    if (request.method === "GET" && path[1] === "matchups") {
      const playerId = required(path[2], "playerId");
      const [stats, props] = await Promise.all([
        moneyline(`/players/${playerId}/stats`, { sport, league }),
        moneyline("/player-props", { sport, league, date, player: request.nextUrl.searchParams.get("player") ?? undefined }),
      ]);
      return success("Matchup analysis retrieved", { playerId, stats, activeProps: props, source: "moneyline" });
    }
    if (request.method === "GET" && path[1] === "correlation") {
      const playerA = required(request.nextUrl.searchParams.get("playerA") ?? undefined, "playerA");
      const playerB = required(request.nextUrl.searchParams.get("playerB") ?? undefined, "playerB");
      const [a, b] = await Promise.all([
        moneyline(`/players/${playerA}/stats`, { sport, league }),
        moneyline(`/players/${playerB}/stats`, { sport, league }),
      ]);
      const score = correlation(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []);
      return success("Correlation analysis retrieved", { playerA, playerB, correlationScore: score, risk: Math.abs(score) >= 0.6 ? "high" : Math.abs(score) >= 0.3 ? "medium" : "low", source: "moneyline" });
    }
    if (request.method === "POST" && path[1] === "webhook" && path[2] === "injury") {
      const body = (await requestBody(request)).fields;
      const playerId = required(typeof body.playerId === "string" ? body.playerId : undefined, "playerId");
      const status = required(typeof body.status === "string" ? body.status : undefined, "status");
      const props = await moneyline("/player-props", { sport: typeof body.sport === "string" ? body.sport : sport, league: typeof body.league === "string" ? body.league : league, date: typeof body.date === "string" ? body.date : date });
      return success("Injury webhook processed", { injuredPlayer: playerId, newStatus: status, source: "moneyline", opportunities: Array.isArray(props) ? props.slice(0, 10) : [] });
    }
  }

  if (path[0] === "players" && request.method === "GET") {
    const sport = request.nextUrl.searchParams.get("sport") ?? request.nextUrl.searchParams.get("sports") ?? "nba";
    if (path[1] === "active-players") return success("Active players retrieved", sport.toLowerCase().includes("nba") ? nbaPlayers : []);
    const playerId = request.nextUrl.searchParams.get("playerId");
    if (path[1] === "season-stats-by-player") {
      const player = nbaPlayers.find((item) => String(item.PlayerID) === playerId) ?? null;
      return success("Season statistics retrieved", player);
    }
    if (path[1] === "game-logs") {
      if (!playerId) throw new ApiError(400, "playerId is required", "VALIDATION_ERROR");
      const logs = await moneyline(`/players/${playerId}/stats`, { sport, season: request.nextUrl.searchParams.get("season") ?? undefined });
      return success("Player game logs retrieved", logs);
    }
  }
  return null;
}
