"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import type {
  AdminPlayFilters,
  Play,
  PlayPublicationStatus,
  PlayResult,
} from "@/redux/api/playApi";
import {
  useDeletePlayMutation,
  useGetAdminPlaysQuery,
  useGetPlayOptionsQuery,
  useUpdatePlayMutation,
} from "@/redux/api/playApi";
import { PlayFormModal } from "./PlayFormModal";

const selectClass =
  "rounded-[5px] border border-white/10 bg-[#101820] px-3 py-2 text-xs text-slate-300 outline-none transition focus:border-emerald-500/60";

function formatOdds(odds: number | null) {
  if (odds === null) return "—";
  return odds > 0 ? `+${odds}` : String(odds);
}

function getErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) return "The action could not be completed.";
  const response = error as { data?: { error?: { message?: string } }; message?: string };
  return response.data?.error?.message ?? response.message ?? "The action could not be completed.";
}

const resultStyles: Record<PlayResult, string> = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  win: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  loss: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  push: "border-sky-500/20 bg-sky-500/10 text-sky-300",
};

const publicationStyles: Record<PlayPublicationStatus, string> = {
  draft: "bg-slate-500/10 text-slate-400",
  scheduled: "bg-sky-500/10 text-sky-300",
  published: "bg-emerald-500/10 text-emerald-300",
  archived: "bg-orange-500/10 text-orange-300",
};

export function PlayManagementTabContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  const [league, setLeague] = useState("");
  const [publicationStatus, setPublicationStatus] = useState<PlayPublicationStatus | "">("");
  const [result, setResult] = useState<PlayResult | "">("");
  const [editingPlay, setEditingPlay] = useState<Play | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo<AdminPlayFilters>(
    () => ({
      page,
      limit: 12,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(sport ? { sport } : {}),
      ...(league ? { league } : {}),
      ...(publicationStatus ? { publicationStatus } : {}),
      ...(result ? { result } : {}),
    }),
    [league, page, publicationStatus, result, search, sport],
  );

  const { data, isLoading, isFetching, error } = useGetAdminPlaysQuery(filters);
  const { data: optionResponse } = useGetPlayOptionsQuery();
  const [updatePlay, { isLoading: isUpdating }] = useUpdatePlayMutation();
  const [deletePlay, { isLoading: isDeleting }] = useDeletePlayMutation();

  const plays = data?.data ?? [];
  const pagination = data?.meta.pagination;
  const options = useMemo(() => optionResponse?.data ?? [], [optionResponse?.data]);
  const leagues = useMemo(() => {
    const selected = options.find((option) => option.sport === sport);
    return selected?.leagues ?? Array.from(new Set(options.flatMap((option) => option.leagues)));
  }, [options, sport]);

  const updateQuick = async (play: Play, values: Record<string, string>) => {
    setNotice("");
    setActionError("");
    const body = new FormData();
    for (const [key, value] of Object.entries(values)) body.append(key, value);
    try {
      await updatePlay({ id: play.id, body }).unwrap();
      setNotice("Play updated successfully.");
    } catch (updateError) {
      setActionError(getErrorMessage(updateError));
    }
  };

  const handleDelete = async (play: Play) => {
    const label = play.participantName || "this play";
    if (!window.confirm(`Delete ${label}? It will be hidden but retained for recovery.`)) return;
    setNotice("");
    setActionError("");
    try {
      await deletePlay(play.id).unwrap();
      setNotice("Play deleted and removed from all feeds.");
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    }
  };

  const openCreate = () => {
    setEditingPlay(null);
    setFormOpen(true);
  };

  const openEdit = (play: Play) => {
    setEditingPlay(play);
    setFormOpen(true);
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-lg border border-emerald-500/20 bg-[#0b151c] p-5 md:p-6">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
              <Trophy className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">PrimeIQ editorial desk</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Manual Play Management</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">Research, publish, and settle the plays that power Top Plays and the main dashboard.</p>
            </div>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#06110d] shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-400">
            <Plus className="h-4 w-4" /> New Play
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Visible results" value={pagination?.total ?? 0} icon={ShieldCheck} color="text-sky-400" />
        <SummaryCard label="Published here" value={plays.filter((play) => play.publicationStatus === "published").length} icon={Sparkles} color="text-emerald-400" />
        <SummaryCard label="Pending here" value={plays.filter((play) => play.result === "pending").length} icon={Clock3} color="text-amber-400" />
        <SummaryCard label="Featured here" value={plays.filter((play) => play.isFeatured).length} icon={Trophy} color="text-orange-400" />
      </div>

      <section className="rounded-lg border border-white/10 bg-[#0b131b]">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); resetPage(); }}
              placeholder="Search player, team, market, or book..."
              className="w-full rounded-[5px] border border-white/10 bg-[#101820] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/60"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={sport} onChange={(event) => { setSport(event.target.value); setLeague(""); resetPage(); }} className={selectClass}>
              <option value="">All sports</option>
              {options.map((option) => <option key={option.sport} value={option.sport}>{option.sport}</option>)}
            </select>
            <select value={league} onChange={(event) => { setLeague(event.target.value); resetPage(); }} className={selectClass}>
              <option value="">All leagues</option>
              {leagues.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={publicationStatus} onChange={(event) => { setPublicationStatus(event.target.value as PlayPublicationStatus | ""); resetPage(); }} className={selectClass}>
              <option value="">All publication</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
            <select value={result} onChange={(event) => { setResult(event.target.value as PlayResult | ""); resetPage(); }} className={selectClass}>
              <option value="">All results</option><option value="pending">Pending</option><option value="win">Win</option><option value="loss">Loss</option><option value="push">Push</option>
            </select>
          </div>
        </div>

        {(notice || actionError) && (
          <div className={`mx-4 mt-4 rounded-[5px] border px-4 py-3 text-sm ${actionError ? "border-rose-500/20 bg-rose-500/10 text-rose-300" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"}`}>
            {actionError || notice}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-emerald-400" /></div>
        ) : error ? (
          <div className="m-4 rounded-lg border border-rose-500/20 bg-rose-500/5 p-10 text-center text-sm text-rose-300">Unable to load plays. Check the admin API and try again.</div>
        ) : plays.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"><Trophy className="h-5 w-5 text-slate-500" /></div>
            <h3 className="mt-4 text-base font-semibold text-white">No plays match this view</h3>
            <p className="mt-1 text-sm text-slate-500">Create the first play or clear the active filters.</p>
          </div>
        ) : (
          <div className={`grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {plays.map((play) => (
              <article key={play.id} className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0e1821] transition hover:border-white/20 hover:bg-[#101c26]">
                <div className="flex gap-3 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#071017]">
                    {play.imageUrl ? <Image src={play.imageUrl} alt="" width={48} height={48} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-700" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white">{play.participantName || "Untitled draft"}</h3>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">{[play.team, play.opponent && `vs ${play.opponent}`].filter(Boolean).join(" ") || "Matchup not set"}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${publicationStyles[play.publicationStatus]}`}>{play.publicationStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="border-y border-white/[0.06] bg-[#09121a] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="text-[10px] uppercase tracking-wider text-slate-600">Selection</p><p className="mt-1 text-sm font-semibold text-slate-200">{play.betType || "—"} {play.line ?? ""} <span className="text-slate-500">{play.market || ""}</span></p></div>
                    <div className="text-right"><p className="text-[10px] uppercase tracking-wider text-slate-600">Price</p><p className="mt-1 text-sm font-bold text-emerald-400">{formatOdds(play.odds)} <span className="text-[10px] font-normal text-slate-500">{play.sportsbook}</span></p></div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {play.sport && <Badge>{play.sport}</Badge>}{play.league && <Badge>{play.league}</Badge>}
                    {play.isFeatured && <Badge accent>Featured</Badge>}{play.isTopPlay && <Badge accent>Top Play</Badge>}
                    {play.isBestBet && <Badge accent>Best Bet</Badge>}
                    {play.isCurrentFree && <Badge accent>Current Free</Badge>}
                    <Badge>{play.accessLevel.replace("_", " ")}</Badge><Badge>{play.contentType}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{play.analysis || "No analysis written yet."}</p>
                  {play.scheduledAt && <p className="mt-2 text-[11px] font-semibold text-sky-300">Scheduled {new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(play.scheduledAt))}</p>}
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <select value={play.result} disabled={isUpdating} onChange={(event) => updateQuick(play, { result: event.target.value })} className={`rounded-[5px] border px-2 py-1.5 text-[10px] font-bold uppercase outline-none ${resultStyles[play.result]}`}>
                      <option value="pending">Pending</option><option value="win">Win</option><option value="loss">Loss</option><option value="push">Push</option>
                    </select>
                    <span className="text-[11px] font-semibold text-slate-400">{play.confidence ?? "—"}% conf</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2">
                  <button onClick={() => updateQuick(play, { publicationStatus: play.publicationStatus === "published" ? "archived" : "published" })} disabled={isUpdating} className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50">
                    {play.publicationStatus === "published" ? <Archive className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}{play.publicationStatus === "published" ? "Archive" : "Publish"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(play)} className="rounded p-2 text-slate-500 transition hover:bg-sky-500/10 hover:text-sky-300" aria-label={`Edit ${play.participantName || "play"}`}><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(play)} disabled={isDeleting} className="rounded p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50" aria-label={`Delete ${play.participantName || "play"}`}><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
            <p className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages} · {pagination.total} plays</p>
            <div className="flex gap-1">
              <button disabled={!pagination.hasPrevious} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded border border-white/10 p-2 text-slate-400 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
              <button disabled={!pagination.hasNext} onClick={() => setPage((current) => current + 1)} className="rounded border border-white/10 p-2 text-slate-400 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </section>

      {formOpen && (
        <PlayFormModal
          play={editingPlay}
          options={options}
          onClose={() => setFormOpen(false)}
          onSaved={(message) => { setFormOpen(false); setNotice(message); setActionError(""); }}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Trophy; color: string }) {
  return <div className="rounded-lg border border-white/10 bg-[#0b131b] p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p><Icon className={`h-4 w-4 ${color}`} /></div><p className="mt-2 text-2xl font-bold text-white">{value}</p></div>;
}

function Badge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={`rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${accent ? "bg-emerald-500/10 text-emerald-300" : "bg-white/[0.04] text-slate-500"}`}>{children}</span>;
}
