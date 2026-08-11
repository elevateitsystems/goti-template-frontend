"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Plus, Save, Send, Trash2, X } from "lucide-react";
import Image from "next/image";
import type {
  Play,
  PlayOption,
  PlayPublicationStatus,
  PlayResult,
  ContentAccessLevel,
  PlayContentType,
  ParlayLeg,
} from "@/redux/api/playApi";
import { useGetAdminCardsQuery } from "@/redux/api/contentApi";
import {
  useCreatePlayMutation,
  useUpdatePlayMutation,
} from "@/redux/api/playApi";

interface PlayFormModalProps {
  play: Play | null;
  options: PlayOption[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface PlayFormState {
  participantType: "player" | "team";
  participantName: string;
  team: string;
  opponent: string;
  sport: string;
  league: string;
  market: string;
  betType: string;
  line: string;
  odds: string;
  sportsbook: string;
  confidence: string;
  projection: string;
  edge: string;
  hitRate: string;
  hitFraction: string;
  analysis: string;
  result: PlayResult;
  isTopPlay: boolean;
  isFeatured: boolean;
  isBestBet: boolean;
  freeOnDate: string;
  scheduledAt: string;
  updateNote: string;
  finalResultDetail: string;
  accessLevel: ContentAccessLevel;
  contentType: PlayContentType;
  displayOrder: string;
  cardId: string;
  parlayLegs: ParlayLeg[];
}

const inputClass =
  "w-full rounded-[5px] border border-white/10 bg-[#101820] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400";

function initialState(play: Play | null): PlayFormState {
  return {
    participantType: play?.participantType ?? "player",
    participantName: play?.participantName ?? "",
    team: play?.team ?? "",
    opponent: play?.opponent ?? "",
    sport: play?.sport ?? "",
    league: play?.league ?? "",
    market: play?.market ?? "",
    betType: play?.betType ?? "Over",
    line: play?.line?.toString() ?? "",
    odds: play?.odds?.toString() ?? "",
    sportsbook: play?.sportsbook ?? "",
    confidence: play?.confidence?.toString() ?? "",
    projection: play?.projection?.toString() ?? "",
    edge: play?.edge?.toString() ?? "",
    hitRate: play?.hitRate?.toString() ?? "",
    hitFraction: play?.hitFraction ?? "",
    analysis: play?.analysis ?? "",
    result: play?.result ?? "pending",
    isTopPlay: play?.isTopPlay ?? false,
    isFeatured: play?.isFeatured ?? false,
    isBestBet: play?.isBestBet ?? false,
    freeOnDate: play?.freeOnDate?.slice(0, 10) ?? "",
    scheduledAt: play?.scheduledAt
      ? new Date(play.scheduledAt).toLocaleString("sv-SE", { timeZone: "America/New_York" }).replace(" ", "T").slice(0, 16)
      : "",
    updateNote: "",
    finalResultDetail: play?.finalResultDetail ?? "",
    accessLevel: play?.accessLevel ?? "members_only",
    contentType: play?.contentType ?? "straight",
    displayOrder: play?.displayOrder?.toString() ?? "0",
    cardId: play?.cardId ?? "",
    parlayLegs: play?.parlayLegs?.map(({ id: _id, ...leg }) => leg) ?? [],
  };
}

function getErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) return "Unable to save the play.";
  const response = error as {
    data?: { error?: { message?: string; details?: { missingFields?: string[] } } };
    message?: string;
  };
  const base = response.data?.error?.message ?? response.message ?? "Unable to save the play.";
  const missing = response.data?.error?.details?.missingFields;
  return missing?.length ? `${base}: ${missing.join(", ")}` : base;
}

export function PlayFormModal({
  play,
  options,
  onClose,
  onSaved,
}: PlayFormModalProps) {
  const [form, setForm] = useState(() => initialState(play));
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [createPlay, { isLoading: isCreating }] = useCreatePlayMutation();
  const [updatePlay, { isLoading: isUpdating }] = useUpdatePlayMutation();
  const { data: cardsResponse } = useGetAdminCardsQuery();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    setForm(initialState(play));
    setImage(null);
    setRemoveImage(false);
    setError("");
  }, [play]);

  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : removeImage ? null : play?.imageUrl),
    [image, play?.imageUrl, removeImage],
  );

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const leagueOptions = useMemo(() => {
    const selected = options.find(
      ({ sport }) => sport.toLowerCase() === form.sport.toLowerCase(),
    );
    return selected?.leagues ?? Array.from(new Set(options.flatMap(({ leagues }) => leagues)));
  }, [form.sport, options]);

  const setField = <Key extends keyof PlayFormState>(
    key: Key,
    value: PlayFormState[Key],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const buildBody = (publicationStatus: PlayPublicationStatus) => {
    const body = new FormData();
    const { parlayLegs, ...scalarForm } = form;
    const values: Record<string, string | boolean> = {
      ...scalarForm,
      publicationStatus,
      removeImage,
    };

    for (const [key, value] of Object.entries(values)) {
      if (typeof value === "boolean") body.append(key, String(value));
      else body.append(key, value);
    }
    if (form.contentType === "parlay") body.append("parlayLegs", JSON.stringify(parlayLegs));
    if (image) body.append("image", image);
    return body;
  };

  const updateLeg = (index: number, key: keyof ParlayLeg, value: string) => {
    setForm((current) => ({
      ...current,
      parlayLegs: current.parlayLegs.map((leg, legIndex) => legIndex === index ? {
        ...leg,
        [key]: key === "line" || key === "odds" ? (value === "" ? null : Number(value)) : value,
      } : leg),
    }));
  };

  const submit = async (
    event: FormEvent,
    publicationStatus: PlayPublicationStatus,
  ) => {
    event.preventDefault();
    setError("");
    try {
      const body = buildBody(publicationStatus);
      if (play) await updatePlay({ id: play.id, body }).unwrap();
      else await createPlay(body).unwrap();
      onSaved(
        publicationStatus === "published"
          ? "Play published successfully."
          : publicationStatus === "scheduled"
            ? "Play scheduled successfully."
            : "Draft saved successfully.",
      );
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#02070c]/80 p-0 backdrop-blur-sm md:items-center md:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="play-form-title"
        className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-xl border border-white/10 bg-[#0b131b] shadow-2xl shadow-black/60 md:max-h-[92vh] md:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Editorial desk
            </p>
            <h2 id="play-form-title" className="mt-1 text-xl font-semibold text-white">
              {play ? "Edit play" : "Build a new play"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close play form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="overflow-y-auto" onSubmit={(event) => submit(event, "published")}>
          <div className="grid gap-7 p-5 md:p-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-7">
              <section>
                <SectionTitle number="01" title="Matchup identity" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Participant type">
                    <select
                      className={inputClass}
                      value={form.participantType}
                      onChange={(event) =>
                        setField("participantType", event.target.value as "player" | "team")
                      }
                    >
                      <option value="player">Player</option>
                      <option value="team">Team</option>
                    </select>
                  </Field>
                  <Field label={form.participantType === "player" ? "Player name" : "Team name"}>
                    <input
                      className={inputClass}
                      value={form.participantName}
                      onChange={(event) => setField("participantName", event.target.value)}
                      placeholder="e.g. Jayson Tatum"
                    />
                  </Field>
                  <Field label="Team / abbreviation">
                    <input className={inputClass} value={form.team} onChange={(event) => setField("team", event.target.value)} placeholder="BOS" />
                  </Field>
                  <Field label="Opponent">
                    <input className={inputClass} value={form.opponent} onChange={(event) => setField("opponent", event.target.value)} placeholder="NYK" />
                  </Field>
                  <Field label="Sport">
                    <input className={inputClass} list="play-sports" value={form.sport} onChange={(event) => setField("sport", event.target.value)} placeholder="Basketball" />
                    <datalist id="play-sports">{options.map(({ sport }) => <option key={sport} value={sport} />)}</datalist>
                  </Field>
                  <Field label="League">
                    <input className={inputClass} list="play-leagues" value={form.league} onChange={(event) => setField("league", event.target.value)} placeholder="NBA" />
                    <datalist id="play-leagues">{leagueOptions.map((league) => <option key={league} value={league} />)}</datalist>
                  </Field>
                </div>
              </section>

              <section>
                <SectionTitle number="02" title="Bet construction" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Market / prop">
                    <input className={inputClass} value={form.market} onChange={(event) => setField("market", event.target.value)} placeholder="Points" />
                  </Field>
                  <Field label="Bet type">
                    <input className={inputClass} list="bet-types" value={form.betType} onChange={(event) => setField("betType", event.target.value)} placeholder="Over" />
                    <datalist id="bet-types"><option value="Over" /><option value="Under" /><option value="Moneyline" /><option value="Spread" /><option value="Yes" /><option value="No" /></datalist>
                  </Field>
                  <Field label="Line (optional)">
                    <input type="number" step="any" className={inputClass} value={form.line} onChange={(event) => setField("line", event.target.value)} placeholder="27.5" />
                  </Field>
                  <Field label="American odds">
                    <input type="number" className={inputClass} value={form.odds} onChange={(event) => setField("odds", event.target.value)} placeholder="-110" />
                  </Field>
                  <Field label="Sportsbook">
                    <input className={inputClass} value={form.sportsbook} onChange={(event) => setField("sportsbook", event.target.value)} placeholder="DraftKings" />
                  </Field>
                  <Field label="Confidence (0–100)">
                    <input type="number" min="0" max="100" className={inputClass} value={form.confidence} onChange={(event) => setField("confidence", event.target.value)} placeholder="82" />
                  </Field>
                </div>
              </section>

              <section>
                <SectionTitle number="03" title="Research metrics" note="Optional" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Field label="Projection"><input type="number" step="any" className={inputClass} value={form.projection} onChange={(event) => setField("projection", event.target.value)} /></Field>
                  <Field label="Edge %"><input type="number" step="any" className={inputClass} value={form.edge} onChange={(event) => setField("edge", event.target.value)} /></Field>
                  <Field label="Hit rate %"><input type="number" min="0" max="100" step="any" className={inputClass} value={form.hitRate} onChange={(event) => setField("hitRate", event.target.value)} /></Field>
                  <Field label="Hit fraction"><input className={inputClass} value={form.hitFraction} onChange={(event) => setField("hitFraction", event.target.value)} placeholder="7/10" /></Field>
                </div>
              </section>
            </div>

            <div className="space-y-7">
              <section>
                <SectionTitle number="04" title="Editorial analysis" />
                <Field label="Reasoning and supporting analysis">
                  <textarea
                    className={`${inputClass} min-h-40 resize-y leading-6`}
                    value={form.analysis}
                    onChange={(event) => setField("analysis", event.target.value)}
                    placeholder="Explain the matchup, trend, number, and why this play has value..."
                  />
                </Field>
              </section>

              <section>
                <SectionTitle number="05" title="Research image" note="Optional · 10 MB max" />
                <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 bg-[#081017] text-center transition hover:border-emerald-500/50 hover:bg-emerald-500/[0.03]">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Play research preview" width={1024} height={640} unoptimized className="max-h-64 w-full object-contain" />
                  ) : (
                    <div className="p-6">
                      <ImagePlus className="mx-auto h-7 w-7 text-emerald-400" />
                      <p className="mt-3 text-sm font-semibold text-white">Attach a slip or research screenshot</p>
                      <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      setImage(event.target.files?.[0] ?? null);
                      setRemoveImage(false);
                    }}
                  />
                </label>
                {imagePreview && (
                  <button type="button" onClick={() => { setImage(null); setRemoveImage(true); }} className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300">
                    Remove image
                  </button>
                )}
              </section>

              <section>
                <SectionTitle number="06" title="Placement and result" />
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Audience">
                    <select className={inputClass} value={form.accessLevel} onChange={(event) => setField("accessLevel", event.target.value as ContentAccessLevel)}><option value="members_only">Members only</option><option value="free">Free visitor</option></select>
                  </Field>
                  <Field label="Content type">
                    <select className={inputClass} value={form.contentType} onChange={(event) => setField("contentType", event.target.value as PlayContentType)}><option value="straight">Straight play</option><option value="parlay">Parlay</option><option value="avoid">Stay away</option></select>
                  </Field>
                  <Field label="Daily card (optional)"><select className={inputClass} value={form.cardId} onChange={(event) => setField("cardId", event.target.value)}><option value="">No card</option>{cardsResponse?.data.map((card) => <option key={card.id} value={card.id}>{card.title} · {new Date(card.cardDate).toLocaleDateString()}</option>)}</select></Field>
                  <Field label="Display order"><input className={inputClass} type="number" min="0" value={form.displayOrder} onChange={(event) => setField("displayOrder", event.target.value)} /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Toggle checked={form.isFeatured} label="Featured Play" description="Ranks above standard plays" onChange={(value) => setField("isFeatured", value)} />
                  <Toggle checked={form.isTopPlay} label="Top Play" description="Marks a primary selection" onChange={(value) => setField("isTopPlay", value)} />
                  <Toggle checked={form.isBestBet} label="Best Bet" description="Leads the daily card" onChange={(value) => setField("isBestBet", value)} />
                  <Field label="Free Play date (ET)"><input className={inputClass} type="date" value={form.freeOnDate} onChange={(event) => setField("freeOnDate", event.target.value)} /></Field>
                </div>
                {form.contentType === "parlay" && <div className="mt-4 space-y-3"><div className="flex items-center justify-between"><span className={labelClass}>Parlay legs</span><button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300" onClick={() => setField("parlayLegs", [...form.parlayLegs, { participantName: "", sport: form.sport, league: form.league, market: "", betType: "Over", line: null, odds: null, sportsbook: form.sportsbook, result: "pending" }])}><Plus className="h-3.5 w-3.5" />Add leg</button></div>{form.parlayLegs.map((leg, index) => <div key={index} className="rounded-lg border border-white/10 bg-[#101820] p-3"><div className="mb-3 flex justify-between"><span className="text-xs font-bold text-white">Leg {index + 1}</span><button type="button" onClick={() => setField("parlayLegs", form.parlayLegs.filter((_, legIndex) => legIndex !== index))} className="text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div><div className="grid gap-2 sm:grid-cols-2"><input className={inputClass} value={leg.participantName} onChange={(event) => updateLeg(index, "participantName", event.target.value)} placeholder="Player / team" /><input className={inputClass} value={leg.market} onChange={(event) => updateLeg(index, "market", event.target.value)} placeholder="Market / prop" /><input className={inputClass} value={leg.sport} onChange={(event) => updateLeg(index, "sport", event.target.value)} placeholder="Sport" /><input className={inputClass} value={leg.league} onChange={(event) => updateLeg(index, "league", event.target.value)} placeholder="League" /><input className={inputClass} value={leg.betType} onChange={(event) => updateLeg(index, "betType", event.target.value)} placeholder="Over / Under" /><input className={inputClass} type="number" step="any" value={leg.line ?? ""} onChange={(event) => updateLeg(index, "line", event.target.value)} placeholder="Line" /><input className={inputClass} type="number" value={leg.odds ?? ""} onChange={(event) => updateLeg(index, "odds", event.target.value)} placeholder="Odds" /><input className={inputClass} value={leg.sportsbook ?? ""} onChange={(event) => updateLeg(index, "sportsbook", event.target.value)} placeholder="Sportsbook" /></div></div>)}</div>}
                <div className="mt-4">
                  <Field label="Result">
                    <select className={inputClass} value={form.result} onChange={(event) => setField("result", event.target.value as PlayResult)}>
                      <option value="pending">Pending</option>
                      <option value="win">Win</option>
                      <option value="loss">Loss</option>
                      <option value="push">Push</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Final score / player result"><input className={inputClass} value={form.finalResultDetail} onChange={(event) => setField("finalResultDetail", event.target.value)} placeholder="Final 112-108 or 31 PTS" /></Field>
                  <Field label="Schedule date/time (ET)"><input className={inputClass} type="datetime-local" value={form.scheduledAt} onChange={(event) => setField("scheduledAt", event.target.value)} /></Field>
                </div>
                {play?.publicationStatus === "published" && (
                  <div className="mt-4">
                    <Field label="Required note when changing line/odds"><textarea className={inputClass} value={form.updateNote} onChange={(event) => setField("updateNote", event.target.value)} placeholder="Still playable up to 28.5." /></Field>
                  </div>
                )}
              </section>
            </div>
          </div>

          {error && <div className="mx-5 mb-4 rounded-[5px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 md:mx-6">{error}</div>}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-[#081017] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-slate-500">Drafts can be incomplete. Publishing validates all core details.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={isSaving} onClick={(event) => submit(event, "draft")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[5px] border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-50 sm:flex-none">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft
              </button>
              <button type="button" disabled={isSaving || !form.scheduledAt} onClick={(event) => submit(event, "scheduled")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[5px] border border-sky-400/30 px-4 py-2.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-400/10 disabled:opacity-50 sm:flex-none">
                Schedule
              </button>
              <button type="submit" disabled={isSaving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[5px] bg-emerald-500 px-5 py-2.5 text-sm font-bold text-[#06110d] transition hover:bg-emerald-400 disabled:opacity-50 sm:flex-none">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ number, title, note }: { number: string; title: string; note?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-400">{number}</span>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {note && <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-600">{note}</span>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className={labelClass}>{label}</span>{children}</label>;
}

function Toggle({ checked, label, description, onChange }: { checked: boolean; label: string; description: string; onChange: (checked: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${checked ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/10 bg-[#101820]"}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-emerald-500" />
      <span><span className="block text-xs font-semibold text-white">{label}</span><span className="text-[10px] text-slate-500">{description}</span></span>
    </label>
  );
}
