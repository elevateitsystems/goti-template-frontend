"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Film,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  useGetMemberCardsQuery,
  useGetMemberVideosQuery,
  useGetMyRequestsQuery,
} from "@/redux/api/contentApi";
import { useGetMemberPlaysQuery } from "@/redux/api/playApi";
import type { Play } from "@/redux/api/playApi";

const panel = "rounded-xl border border-white/10 bg-[#0b131b]";

export function PrimeIQDashboard() {
  const cardsQuery = useGetMemberCardsQuery();
  const playsQuery = useGetMemberPlaysQuery();
  const videosQuery = useGetMemberVideosQuery();
  const requestsQuery = useGetMyRequestsQuery();

  const latestCard = cardsQuery.data?.data[0];
  const plays = playsQuery.data?.data ?? [];
  const activePlays = plays.filter((play) => play.result === "pending").slice(0, 4);
  const settledPlays = plays.filter((play) => play.result !== "pending").slice(0, 3);
  const latestVideo = videosQuery.data?.data[0];
  const requests = requestsQuery.data?.data ?? [];
  const answeredRequests = requests.filter((request) => request.status === "answered").length;
  const usage = requestsQuery.data?.meta?.usage;
  const membershipError = cardsQuery.isError && playsQuery.isError && videosQuery.isError;

  if (membershipError) {
    return (
      <div className="mx-auto max-w-4xl p-5 md:p-8">
        <div className={`${panel} p-10 text-center`}>
          <ShieldCheck className="mx-auto h-10 w-10 text-amber-300" />
          <h1 className="mt-5 font-display text-3xl text-white">PrimeIQ membership required</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
            Activate your founding membership to unlock the daily card, published plays, videos, and private reviews.
          </p>
          <Link href="/#pricing" className="mt-7 inline-flex items-center gap-2 rounded-md bg-amber-300 px-5 py-3 font-bold text-[#171006]">
            View founding offer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-4 md:p-7">
      <header className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.16),transparent_34%),#09141d] p-6 md:p-9">
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400">PrimeIQ member desk</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">Your research, in one place.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Review today’s card, monitor published line updates, watch the latest breakdown, and send your own plays for a private second opinion.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/primeiq" className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#06110d]">
              Open today’s card <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/my-requests" className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white">
              Send me your plays
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={CalendarDays} label="Latest card" value={latestCard ? formatCardDate(latestCard.cardDate) : "Preparing"} />
        <Metric icon={Trophy} label="Open plays" value={String(activePlays.length)} />
        <Metric icon={Film} label="Published videos" value={String(videosQuery.data?.data.length ?? 0)} />
        <Metric icon={MessageSquareText} label="Reviews remaining" value={usage ? `${usage.remaining} / ${usage.limit}` : "—"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className={`${panel} p-5 md:p-6`}>
          <SectionHeading eyebrow="Admin curated" title="Latest Daily PrimeIQ Card" href="/primeiq" />
          {cardsQuery.isLoading ? <LoadingRows /> : latestCard ? (
            <div className="mt-5">
              <div className="rounded-lg border border-white/5 bg-white/[0.025] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">{formatCardDate(latestCard.cardDate)}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{latestCard.title}</h3>
                {latestCard.summary && <p className="mt-2 text-sm leading-6 text-slate-400">{latestCard.summary}</p>}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {latestCard.plays.slice(0, 4).map((play) => <PlayPreview key={play.id} play={play} />)}
              </div>
            </div>
          ) : <EmptyState text="The next Daily PrimeIQ Card is being prepared." />}
        </section>

        <section className={`${panel} p-5 md:p-6`}>
          <SectionHeading eyebrow="Latest breakdown" title="PrimeIQ Video" href="/videos" />
          {videosQuery.isLoading ? <LoadingRows /> : latestVideo ? (
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <video controls playsInline preload="metadata" poster={latestVideo.thumbnailUrl ?? undefined} className="aspect-video w-full bg-black object-cover">
                <source src={latestVideo.mediaUrl} />
                Your browser does not support embedded video.
              </video>
              <div className="p-4">
                <h3 className="font-display text-xl text-white">{latestVideo.title}</h3>
                {latestVideo.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{latestVideo.description}</p>}
              </div>
            </div>
          ) : <EmptyState text="No video has been published yet." />}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${panel} p-5 md:p-6`}>
          <SectionHeading eyebrow="Live card" title="Published Plays" href="/primeiq" />
          <div className="mt-5 grid gap-3">
            {playsQuery.isLoading ? <LoadingRows /> : activePlays.length ? activePlays.map((play) => <PlayPreview key={play.id} play={play} />) : <EmptyState text="No open plays are published right now." />}
          </div>
        </section>

        <section className={`${panel} p-5 md:p-6`}>
          <SectionHeading eyebrow="Transparent history" title="Recent Results" href="/results" />
          <div className="mt-5 grid gap-3">
            {playsQuery.isLoading ? <LoadingRows /> : settledPlays.length ? settledPlays.map((play) => <PlayPreview key={play.id} play={play} />) : <EmptyState text="Published results will appear here after plays settle." />}
          </div>
        </section>
      </div>

      <section className={`${panel} flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">Private second opinion</p>
          <h2 className="mt-2 font-display text-2xl text-white">Send Me Your Plays</h2>
          <p className="mt-2 text-sm text-slate-400">
            {usage ? `${usage.remaining} of ${usage.limit} submissions remain this ET week.` : "Submit a single play or parlay for a private review."}
            {answeredRequests ? ` ${answeredRequests} response${answeredRequests === 1 ? " is" : "s are"} ready in your history.` : ""}
          </p>
        </div>
        <Link href="/my-requests" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-amber-300 px-5 py-3 text-sm font-bold text-[#171006]">
          Open review desk <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string }) {
  return <div className={`${panel} p-4`}><div className="flex items-center gap-2 text-emerald-300"><Icon className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span></div><p className="mt-3 font-display text-2xl text-white">{value}</p></div>;
}

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">{eyebrow}</p><h2 className="mt-1 font-display text-2xl text-white">{title}</h2></div><Link href={href} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">View all <ArrowRight className="h-3.5 w-3.5" /></Link></div>;
}

function PlayPreview({ play }: { play: Play }) {
  const resultIcon = play.result === "win" ? CheckCircle2 : play.result === "pending" ? Clock3 : Trophy;
  const ResultIcon = resultIcon;
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#0e1821]">
      {play.imageUrl && <Image src={play.imageUrl} alt="" width={800} height={360} unoptimized className="h-28 w-full object-cover" />}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {play.isFeatured && <Badge>Featured</Badge>}
              {play.isTopPlay && <Badge>Top Play</Badge>}
              {play.isBestBet && <Badge>Best Bet</Badge>}
              {play.contentType === "avoid" && <Badge tone="amber">Stay Away</Badge>}
            </div>
            <h3 className="mt-2 font-semibold text-white">{play.participantName ?? "PrimeIQ Play"}</h3>
            <p className="mt-1 text-sm font-bold text-emerald-300">{play.betType} {play.line ?? ""} · {formatOdds(play.odds)}</p>
          </div>
          <ResultIcon className={`h-5 w-5 ${play.result === "win" ? "text-emerald-300" : play.result === "loss" ? "text-rose-300" : "text-slate-500"}`} />
        </div>
        {play.latestUpdateNote && <p className="mt-3 rounded-md border border-sky-400/15 bg-sky-400/5 p-2 text-xs text-sky-200">{play.latestUpdateNote}</p>}
        {play.finalResultDetail && <p className="mt-3 text-xs text-slate-400">Final: {play.finalResultDetail}</p>}
      </div>
    </article>
  );
}

function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "amber" }) {
  return <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tone === "amber" ? "bg-amber-300/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>{children}</span>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="mt-5 rounded-lg border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-500">{text}</div>;
}

function LoadingRows() {
  return <div className="mt-5 space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-lg bg-white/[0.04]" />)}</div>;
}

function formatOdds(odds: number | null) {
  if (odds === null) return "Odds pending";
  return odds > 0 ? `+${odds}` : String(odds);
}

function formatCardDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" }).format(new Date(value));
}
