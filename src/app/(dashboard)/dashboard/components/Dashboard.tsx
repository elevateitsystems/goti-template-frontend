"use client";

import { useGetAllQuery } from "@/redux/api/userApi";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Flame,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

function extractList(response: any): any[] {
  const candidates = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.data?.data,
    response?.results,
    response?.items,
    response?.players,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function firstValue(record: any, keys: string[]) {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], record);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toNumber(value: any, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function getEdge(item: any) {
  return toNumber(firstValue(item, ["edgePercent", "edge", "expectedValue", "ev"]));
}

function getConfidence(item: any) {
  return toNumber(
    firstValue(item, ["ratingScore", "confidenceScore", "confidence", "score"]),
  );
}

function formatPercent(value: any) {
  const numeric = toNumber(value, NaN);
  if (!Number.isFinite(numeric)) return "—";
  const percent = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
}

function formatOdds(value: any) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return numeric > 0 ? `+${numeric}` : `${numeric}`;
}

function matchupTitle(item: any) {
  const team = firstValue(item, [
    "team",
    "teamName",
    "teamAbbr",
    "homeTeam",
    "homeTeamName",
    "raw.team",
    "raw.teamName",
    "raw.teamAbbr",
  ]);
  const opponent = firstValue(item, [
    "opponent",
    "opponentTeam",
    "awayTeam",
    "awayTeamName",
    "raw.opponent",
    "raw.opponentTeam",
  ]);
  const game = firstValue(item, ["game", "eventName", "matchup", "name"]);

  if (team && opponent) return `${team} vs ${opponent}`;
  return game || team || opponent || "Live market";
}

function propLabel(item: any) {
  const side = firstValue(item, ["side", "outcome", "betType"]);
  const line = firstValue(item, ["line", "handicap", "point", "points"]);
  const category = firstValue(item, [
    "category",
    "market",
    "marketName",
    "propType",
    "name",
  ]);

  return [side ? String(side).toUpperCase() : "", line, category]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .join(" ");
}

function eventTitle(event: any) {
  const away = firstValue(event, ["awayTeam", "awayTeamName", "away_team"]);
  const home = firstValue(event, ["homeTeam", "homeTeamName", "home_team"]);
  return away && home
    ? `${away} @ ${home}`
    : firstValue(event, ["name", "eventName", "title", "game"]) || "Scheduled event";
}

function eventTime(event: any) {
  const value = firstValue(event, [
    "commence_time",
    "commenceTime",
    "startTime",
    "scheduled",
    "date",
  ]);
  if (!value) return "Time TBD";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isHighEdge(item: any) {
  return getEdge(item) >= 3;
}

export function Dashboard() {
  const {
    data: eventsResponse,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useGetAllQuery({ path: "events/today", limit: 100 });
  const {
    data: propsResponse,
    isLoading: propsLoading,
    refetch: refetchProps,
  } = useGetAllQuery({ path: "player-props", limit: 100 });
  const {
    data: bestBetsResponse,
    isLoading: bestBetsLoading,
    refetch: refetchBestBets,
  } = useGetAllQuery({ path: "best-bets/best-bets", limit: 100 });
  const {
    data: edgeResponse,
    isLoading: edgeLoading,
    refetch: refetchEdge,
  } = useGetAllQuery({ path: "edge/edge", limit: 100 });
  const {
    data: evResponse,
    isLoading: evLoading,
    refetch: refetchEv,
  } = useGetAllQuery({ path: "edge/edge/ev", limit: 100 });
  const {
    data: oddsResponse,
    isLoading: oddsLoading,
    refetch: refetchOdds,
  } = useGetAllQuery({ path: "odds", limit: 100 });
  const {
    data: injuriesResponse,
    isLoading: injuriesLoading,
    refetch: refetchInjuries,
  } = useGetAllQuery({ path: "analysis/injuries", limit: 100 });

  const events = useMemo(() => extractList(eventsResponse), [eventsResponse]);
  const props = useMemo(() => extractList(propsResponse), [propsResponse]);
  const bestBets = useMemo(
    () => extractList(bestBetsResponse),
    [bestBetsResponse],
  );
  const edgeSignals = useMemo(() => extractList(edgeResponse), [edgeResponse]);
  const evSignals = useMemo(() => extractList(evResponse), [evResponse]);
  const odds = useMemo(() => extractList(oddsResponse), [oddsResponse]);
  const injuries = useMemo(
    () => extractList(injuriesResponse),
    [injuriesResponse],
  );

  const allMarketRows = useMemo(
    () => [...bestBets, ...props, ...evSignals],
    [bestBets, evSignals, props],
  );

  const topBestBets = useMemo(
    () =>
      [...bestBets]
        .sort((a, b) => getConfidence(b) + getEdge(b) - (getConfidence(a) + getEdge(a)))
        .slice(0, 3),
    [bestBets],
  );

  const topProps = useMemo(
    () =>
      [...props]
        .sort((a, b) => getEdge(b) + getConfidence(b) - (getEdge(a) + getConfidence(a)))
        .slice(0, 5),
    [props],
  );

  const feedItems = useMemo(
    () =>
      [...edgeSignals, ...evSignals, ...bestBets]
        .sort((a, b) => getEdge(b) - getEdge(a))
        .slice(0, 6),
    [bestBets, edgeSignals, evSignals],
  );

  const highEvCount = allMarketRows.filter(isHighEdge).length;
  const averageEdge = allMarketRows.length
    ? allMarketRows.reduce((sum, item) => sum + getEdge(item), 0) /
      allMarketRows.length
    : 0;
  const averageConfidence = allMarketRows.length
    ? allMarketRows.reduce((sum, item) => sum + getConfidence(item), 0) /
      allMarketRows.length
    : 0;
  const loading =
    eventsLoading ||
    propsLoading ||
    bestBetsLoading ||
    edgeLoading ||
    evLoading ||
    oddsLoading ||
    injuriesLoading;

  const refetchAll = () => {
    refetchEvents();
    refetchProps();
    refetchBestBets();
    refetchEdge();
    refetchEv();
    refetchOdds();
    refetchInjuries();
  };

  const kpis = [
    {
      label: "Games Today",
      value: events.length,
      color: "var(--intel-blue)",
      icon: Clock,
    },
    {
      label: "Active Props",
      value: props.length,
      color: "var(--emerald)",
      icon: Target,
    },
    {
      label: "High EV Props",
      value: highEvCount,
      color: "var(--gold)",
      icon: TrendingUp,
    },
    {
      label: "Best Bets",
      value: bestBets.length,
      color: "var(--coral)",
      icon: Flame,
    },
    {
      label: "Injury Alerts",
      value: injuries.length,
      color: "#F97316",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
            Live backend intelligence only —{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={refetchAll}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] px-3 py-2 text-xs font-semibold transition hover:opacity-80"
          style={{
            backgroundColor: "var(--emerald-light)",
            color: "var(--emerald)",
          }}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh live data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card rounded-[5px] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <kpi.icon className="h-3 w-3" style={{ color: kpi.color }} />
              <p
                className="text-[10px] font-body"
                style={{ color: "var(--text-muted)" }}
              >
                {kpi.label}
              </p>
            </div>
            <p
              className="text-2xl font-bold font-body"
              style={{ color: kpi.color }}
            >
              {loading ? "—" : kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricPanel
          title="Average Edge"
          value={allMarketRows.length ? formatPercent(averageEdge) : "—"}
          helper={`${allMarketRows.length} live market rows`}
          icon={BarChart3}
          color="var(--gold)"
        />
        <MetricPanel
          title="Confidence Pulse"
          value={
            allMarketRows.length && averageConfidence
              ? `${Math.round(averageConfidence)}%`
              : "—"
          }
          helper="Rating/confidence average from props, EV, and best-bets feeds"
          icon={Activity}
          color="var(--intel-blue)"
        />
      </div>

      <section className="card rounded-[5px] p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2
              className="font-display text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Today&apos;s Best Bets
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Powered by <code>GET /api/best-bets/best-bets</code>
            </p>
          </div>
          <Link
            href="/top-plays"
            className="text-xs font-body font-semibold px-3 py-1 rounded-[5px] transition-colors"
            style={{
              color: "var(--emerald)",
              backgroundColor: "var(--emerald-light)",
            }}
          >
            View All
          </Link>
        </div>

        {topBestBets.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topBestBets.map((bet, index) => (
              <MarketCard key={firstValue(bet, ["id"]) || index} item={bet} />
            ))}
          </div>
        ) : (
          <EmptyState label="No best-bets rows returned by the backend yet." />
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
        <section className="card rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-display text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                High EV Player Props
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by <code>GET /api/player-props</code>
              </p>
            </div>
            <Link
              href="/player-props"
              className="text-xs font-body font-semibold px-3 py-1 rounded-[5px] transition-colors"
              style={{
                color: "var(--gold)",
                backgroundColor: "var(--gold-light)",
              }}
            >
              Props
            </Link>
          </div>

          {topProps.length ? (
            <div className="space-y-3">
              {topProps.map((prop, index) => (
                <PropRow
                  key={firstValue(prop, ["id"]) || `${propLabel(prop)}-${index}`}
                  index={index}
                  item={prop}
                />
              ))}
            </div>
          ) : (
            <EmptyState label="No player props returned by the backend yet." />
          )}
        </section>

        <section className="card rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-display text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Live Edge Feed
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by edge, EV, and best-bets endpoints
              </p>
            </div>
            <Link
              href="/edge-feed"
              className="text-xs font-body font-semibold px-3 py-1 rounded-[5px] transition-colors"
              style={{
                color: "var(--coral)",
                backgroundColor: "var(--coral-light)",
              }}
            >
              Full Feed
            </Link>
          </div>

          {feedItems.length ? (
            <div className="space-y-2">
              {feedItems.map((item, index) => (
                <FeedRow
                  key={firstValue(item, ["id"]) || `${matchupTitle(item)}-${index}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <EmptyState label="No edge feed rows returned by the backend yet." />
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="card rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-display text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Today&apos;s Events
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by <code>GET /api/events/today</code>
              </p>
            </div>
            <span
              className="badge text-[9px]"
              style={{
                backgroundColor: "var(--intel-blue-light)",
                color: "var(--intel-blue)",
              }}
            >
              {events.length} events
            </span>
          </div>

          {events.length ? (
            <div className="space-y-3">
              {events.slice(0, 8).map((event, index) => (
                <div
                  key={firstValue(event, ["id", "eventId"]) || index}
                  className="rounded-[5px] px-3 py-2"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="text-xs font-body font-semibold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {eventTitle(event)}
                    </p>
                    <span
                      className="flex items-center gap-1 text-[10px] font-body shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {eventTime(event)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No events returned by the backend yet." />
          )}
        </section>

        <section className="card rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-display text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Injury Alerts
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by <code>GET /api/analysis/injuries</code>
              </p>
            </div>
            <span
              className="badge text-[9px]"
              style={{
                backgroundColor: "var(--coral-light)",
                color: "var(--coral)",
              }}
            >
              {injuries.length} alerts
            </span>
          </div>

          {injuries.length ? (
            <div className="space-y-3">
              {injuries.slice(0, 6).map((injury, index) => (
                <div
                  key={firstValue(injury, ["id", "playerId"]) || index}
                  className="rounded-[5px] p-3"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {firstValue(injury, ["playerName", "name", "player"]) ||
                      "Player update"}
                  </p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {[
                      firstValue(injury, ["team", "teamName"]),
                      firstValue(injury, ["status", "injuryStatus"]),
                      firstValue(injury, ["description", "note", "injury"]),
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Backend injury row returned without details."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No injury alerts returned by the backend yet." />
          )}
        </section>
      </div>

      <section className="card rounded-[5px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="font-display text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Odds Snapshot
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Powered by <code>GET /api/odds</code>
            </p>
          </div>
          <span
            className="badge text-[9px]"
            style={{
              backgroundColor: "var(--emerald-light)",
              color: "var(--emerald)",
            }}
          >
            {odds.length} rows
          </span>
        </div>

        {odds.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs font-body">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Event", "Market", "Book", "Outcome", "Line", "Odds", "Updated"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {odds.slice(0, 10).map((row, index) => (
                  <tr
                    key={firstValue(row, ["id", "marketId"]) || index}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="py-3 px-4" style={{ color: "var(--text-primary)" }}>
                      {matchupTitle(row)}
                    </td>
                    <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>
                      {firstValue(row, ["market", "marketName", "category", "name"]) ||
                        "Market"}
                    </td>
                    <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>
                      {firstValue(row, ["sportsbook", "bookmaker", "book", "source"]) ||
                        "—"}
                    </td>
                    <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>
                      {firstValue(row, ["outcome", "side", "selection", "team"]) ||
                        "—"}
                    </td>
                    <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>
                      {firstValue(row, ["line", "handicap", "point"]) ?? "—"}
                    </td>
                    <td
                      className="py-3 px-4 font-bold"
                      style={{
                        color:
                          toNumber(firstValue(row, ["odds", "price", "americanOdds"])) > 0
                            ? "var(--emerald)"
                            : "var(--coral)",
                      }}
                    >
                      {formatOdds(firstValue(row, ["odds", "price", "americanOdds"]))}
                    </td>
                    <td className="py-3 px-4" style={{ color: "var(--text-muted)" }}>
                      {firstValue(row, ["updatedAt", "lastUpdate", "timestamp"]) ||
                        "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState label="No odds rows returned by the backend yet." />
        )}
      </section>
    </div>
  );
}

function MetricPanel({
  title,
  value,
  helper,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  helper: string;
  icon: typeof Activity;
  color: string;
}) {
  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="text-xs font-body"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
        {helper}
      </p>
    </div>
  );
}

function MarketCard({ item }: { item: any }) {
  const edge = getEdge(item);
  const confidence = getConfidence(item);

  return (
    <div
      className="rounded-[5px] p-3"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid rgba(0,229,168,0.15)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-xs font-body font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {firstValue(item, ["playerName", "player", "name"]) ||
              matchupTitle(item)}
          </p>
          <p
            className="mt-1 text-[10px] font-body truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {matchupTitle(item)}
          </p>
        </div>
        <span
          className="badge text-[9px] shrink-0"
          style={{
            backgroundColor: "var(--emerald-light)",
            color: "var(--emerald)",
          }}
        >
          {confidence ? `${Math.round(confidence)}` : "LIVE"}
        </span>
      </div>

      <p
        className="mt-3 text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {propLabel(item) || firstValue(item, ["recommendation"]) || "Best bet"}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
        <span style={{ color: "var(--text-muted)" }}>
          Edge{" "}
          <strong style={{ color: edge >= 0 ? "var(--emerald)" : "var(--coral)" }}>
            {formatPercent(edge)}
          </strong>
        </span>
        <span style={{ color: "var(--text-muted)" }}>
          Odds{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {formatOdds(firstValue(item, ["odds", "price", "americanOdds"]))}
          </strong>
        </span>
        <span style={{ color: "var(--text-muted)" }}>
          {firstValue(item, ["sportsbook", "bookmaker", "book", "source"]) || "Book"}
        </span>
      </div>
    </div>
  );
}

function PropRow({ item, index }: { item: any; index: number }) {
  const edge = getEdge(item);

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body shrink-0"
        style={{
          backgroundColor: "var(--emerald-light)",
          color: "var(--emerald)",
        }}
      >
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-body font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {firstValue(item, ["playerName", "player", "name"]) || "Player prop"}
        </p>
        <p
          className="text-[11px] font-body truncate"
          style={{ color: "var(--text-muted)" }}
        >
          {propLabel(item)} · {matchupTitle(item)}
        </p>
      </div>
      <div className="text-right">
        <p
          className="text-sm font-body font-bold"
          style={{ color: edge >= 0 ? "var(--emerald)" : "var(--coral)" }}
        >
          {formatPercent(edge)}
        </p>
        <p className="text-[10px] font-body" style={{ color: "var(--text-muted)" }}>
          {formatOdds(firstValue(item, ["odds", "price", "americanOdds"]))}
        </p>
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: any }) {
  const edge = getEdge(item);
  const title =
    firstValue(item, ["title", "text", "description", "recommendation"]) ||
    `${propLabel(item) || "Market signal"} · ${matchupTitle(item)}`;

  return (
    <div
      className="flex items-start gap-2 p-2 rounded-[5px]"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <span
        className="mt-1 h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: edge >= 3 ? "var(--emerald)" : "var(--gold)" }}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-body font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p
          className="text-[10px] font-body truncate mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {matchupTitle(item)} · Edge {formatPercent(edge)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="rounded-[5px] p-6 text-center text-xs"
      style={{
        backgroundColor: "var(--bg-surface)",
        color: "var(--text-muted)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </div>
  );
}
