"use client";
import { OddsLineChart } from "@/components/charts/OddsLineChart";
import { PlayerCard } from "@/components/charts/PlayerCard";
import { RiskGauge } from "@/components/charts/RiskGauge";
import {
  marketEfficiencyData,
  marketMomentumStrip,
  morningBriefingCards,
  oddsGames,
  playerOddsData,
  playerProps,
  propOfTheDay,
} from "@/data/mockData";
import { nbaEdgeFeed, nbaProps } from "@/data/nba";
import { getRatingBgColor, getRatingColor } from "@/lib/smartRating";
import { formatOdds } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Clock,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { MarketMomentumStrip } from "./MarketMomentumStrip";
import { MorningBriefingStrip } from "./MorningBriefingStrip";
import { OddsMovementChartCard } from "./OddsMovementChartCard";
import { SportsbookOddsTable } from "./SportsbookOddsTable";

export function Dashboard() {
  const game = oddsGames[0];
  const h2hMarket = (book: any) =>
    book.markets.find((m: any) => m.key === "h2h");
  const spreadMarket = (book: any) =>
    book.markets.find((m: any) => m.key === "spreads");
  const totalMarket = (book: any) =>
    book.markets.find((m: any) => m.key === "totals");

  // Feature #11 KPIs
  const highEVCount = nbaProps.filter((p) => p.edge >= 7).length;
  const lineMoves = nbaEdgeFeed.filter(
    (f) => f.type === "line_movement",
  ).length;
  const injuryAlerts = nbaEdgeFeed.filter((f) => f.type === "injury").length;
  const steamMoves = nbaEdgeFeed.filter((f) => f.type === "steam_move").length;
  const aRatedPlays = nbaProps.filter((p) => p.rating === "A").length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Daily Betting Dashboard
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Real-time betting intelligence —{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold"
          style={{
            backgroundColor: "var(--emerald-light)",
            color: "var(--emerald)",
          }}
        >
          <Activity className="h-3 w-3 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Feature #11 — Daily Betting Dashboard KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card rounded-[5px] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="h-3 w-3" style={{ color: "var(--intel-blue)" }} />
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Games Today
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body"
            style={{ color: "var(--intel-blue)" }}
          >
            {oddsGames.length}
          </p>
        </div>
        <div className="card rounded-[5px] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="h-3 w-3" style={{ color: "var(--emerald)" }} />
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              High EV Props
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body"
            style={{ color: "var(--emerald)" }}
          >
            {highEVCount}
          </p>
        </div>
        <div className="card rounded-[5px] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp
              className="h-3 w-3"
              style={{ color: "var(--intel-blue)" }}
            />
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Line Moves
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body"
            style={{ color: "var(--intel-blue)" }}
          >
            {lineMoves}
          </p>
        </div>
        <div className="card rounded-[5px] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-3 w-3" style={{ color: "#F97316" }} />
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Injury Alerts
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body"
            style={{ color: "#F97316" }}
          >
            {injuryAlerts}
          </p>
        </div>
        <div className="card rounded-[5px] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="h-3 w-3" style={{ color: "var(--coral)" }} />
            <p
              className="text-[10px] font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Steam Moves
            </p>
          </div>
          <p
            className="text-2xl font-bold font-body"
            style={{ color: "var(--coral)" }}
          >
            {steamMoves}
          </p>
        </div>
      </div>

      <MorningBriefingStrip cards={morningBriefingCards} />
      <MarketMomentumStrip data={marketMomentumStrip} />

      {/* Top 3 Best Bets */}
      <div className="card rounded-[5px] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            ⭐ Today&apos;s Best Bets ({aRatedPlays} A-rated)
          </h2>
          <Link
            href="/top-plays"
            className="text-xs font-body font-semibold px-3 py-1 rounded-[5px] transition-colors"
            style={{
              color: "var(--emerald)",
              backgroundColor: "var(--emerald-light)",
            }}
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nbaProps
            .filter((p) => p.rating === "A")
            .slice(0, 3)
            .map((prop) => (
              <div
                key={prop.id}
                className="rounded-[5px] p-3"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid rgba(0,229,168,0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full overflow-hidden shrink-0"
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
                      className="text-xs font-body font-semibold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {prop.playerName}
                    </p>
                    <p
                      className="text-[10px] font-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {prop.team} · {prop.propCategory} O {prop.line}
                    </p>
                  </div>
                  <span
                    className="badge text-[10px] px-2"
                    style={{
                      backgroundColor: getRatingBgColor(prop.rating),
                      color: getRatingColor(prop.rating),
                    }}
                  >
                    {prop.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-body">
                  <span style={{ color: "var(--text-muted)" }}>
                    Edge:{" "}
                    <strong style={{ color: "var(--emerald)" }}>
                      +{prop.edge}%
                    </strong>
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    Hit:{" "}
                    <strong style={{ color: "var(--emerald)" }}>
                      {prop.hitRate}%
                    </strong>
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    Conf: <strong>{prop.confidence}</strong>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edge Feed Mini */}
      <div className="card rounded-[5px] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            📡 Live Edge Feed
          </h2>
          <Link
            href="/edge-feed"
            className="text-xs font-body font-semibold px-3 py-1 rounded-[5px] transition-colors"
            style={{
              color: "var(--coral)",
              backgroundColor: "var(--coral-light)",
            }}
          >
            Full Feed →
          </Link>
        </div>
        <div className="space-y-2">
          {nbaEdgeFeed.slice(0, 5).map((item) => {
            const colors: Record<string, string> = {
              high_ev: "var(--emerald)",
              steam_move: "var(--coral)",
              line_movement: "var(--intel-blue)",
              injury: "#F97316",
            };
            const icons: Record<string, string> = {
              high_ev: "🟢",
              steam_move: "🔴",
              line_movement: "🔵",
              injury: "🟠",
            };
            return (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 rounded-[5px]"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <span className="text-sm mt-0.5">{icons[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-body font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.timestamp}
                  </p>
                </div>
                {item.urgency === "high" && (
                  <span
                    className="badge text-[8px]"
                    style={{
                      backgroundColor: "var(--coral-light)",
                      color: "var(--coral)",
                    }}
                  >
                    URGENT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PlayerCard
          name={propOfTheDay.playerName}
          team={propOfTheDay.team}
          jerseyNumber={propOfTheDay.jerseyNumber}
          photoUrl={propOfTheDay.photoUrl}
          bet={propOfTheDay.bet}
          projection={propOfTheDay.projection}
          stat={propOfTheDay.stat}
          odds={propOfTheDay.odds}
          confidence={propOfTheDay.confidence}
          hitRate={propOfTheDay.hitRate}
          hitFraction={propOfTheDay.hitFraction}
        />
        <OddsMovementChartCard data={playerOddsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card rounded-[5px] p-5">
          <h2
            className="font-display text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Betting Risk Engine
          </h2>
          <RiskGauge score={62} />
          <p
            className="text-center text-xs font-body mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            Based on today&apos;s market conditions
          </p>
        </div>

        <div className="card rounded-[5px] p-5">
          <h2
            className="font-display text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Market Efficiency
          </h2>
          <OddsLineChart
            data={marketEfficiencyData}
            xKey="game"
            line1Key="optimal"
            line2Key="public"
            line1Label="Model"
            line2Label="Market"
            height={140}
          />
        </div>

        <div className="card rounded-[5px] p-5">
          <h2
            className="font-display text-sm font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Top Player Props
          </h2>
          <div className="space-y-3">
            {playerProps.slice(0, 3).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body shrink-0"
                  style={{
                    backgroundColor: "var(--emerald-light)",
                    color: "var(--emerald)",
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-body font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {p.player}
                  </p>
                  <p
                    className="text-[11px] font-body truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {p.prop}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-body font-bold"
                    style={{
                      color: p.positive ? "var(--emerald)" : "var(--coral)",
                    }}
                  >
                    {p.odds}
                  </p>
                  <p
                    className="text-[10px] font-body"
                    style={{
                      color:
                        p.hitRate >= 50 ? "var(--emerald)" : "var(--coral)",
                    }}
                  >
                    {p.hitRate}% HR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="font-display text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Tonight&apos;s Games
            </h2>
            <span
              className="badge text-white text-[9px]"
              style={{ backgroundColor: "var(--coral)" }}
            >
              {oddsGames.length} GAMES
            </span>
          </div>
          <div className="space-y-3">
            {oddsGames.map((g) => (
              <div
                key={g.id}
                className="rounded-[5px] px-3 py-2"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {g.away_team.split(" ").pop()} @{" "}
                    {g.home_team.split(" ").pop()}
                  </p>
                  <span
                    className="flex items-center gap-1 text-[10px] font-body"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(g.commence_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                {g.bookmakers[0] && h2hMarket(g.bookmakers[0]) && (
                  <div className="flex gap-3 mt-1">
                    {h2hMarket(g.bookmakers[0])!.outcomes.map((o: any) => (
                      <span
                        key={o.name}
                        className="text-[10px] font-body font-semibold"
                        style={{
                          color:
                            o.price > 0 ? "var(--emerald)" : "var(--coral)",
                        }}
                      >
                        {o.name.split(" ").pop()} {formatOdds(o.price)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SportsbookOddsTable
        bookmakers={game.bookmakers}
        h2hMarket={h2hMarket}
        spreadMarket={spreadMarket}
        totalMarket={totalMarket}
      />
    </div>
  );
}
