"use client";

import { ArrowRight, Check, ChevronRight, LockKeyhole, ShieldCheck, Star, Trophy, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useGetHomepageQuery } from "@/redux/api/contentApi";
import { useGetAllQuery } from "@/redux/api/userApi";

interface PublicPricingPlan {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
}

const braydenFallback = {
  id: "brayden-fallback",
  displayName: "Brayden",
  headline: "They helped me turn my $350 Bet365 promo into $750.",
  rating: 5,
  reviewText: "I was brand new to sports betting when Bet365 had their new-customer promo, so I really didn't know what I was doing. I had a free $350 promo and reached out to one of my buddies who runs PrimeIQ for some help. They walked me through the plays, helped me understand what I was betting, and we ended up turning that promo into $750. Going from basically $0 out of pocket to $750 was insane. That experience definitely made me look at sports betting completely differently.",
  experienceContext: "PrimeIQ Client",
};

export function PrimeIQHome() {
  const { data, isLoading } = useGetHomepageQuery();
  const { data: pricingResponse, isLoading: pricingLoading } = useGetAllQuery({ path: "pricing" });
  const content = data?.data;
  const featured = content?.featuredTestimonial ?? braydenFallback;
  const activePlan = (pricingResponse?.data as PublicPricingPlan[] | undefined)?.find((plan) => plan.isActive);
  const membershipHref = activePlan ? `/register?plan=${activePlan.id}` : "#pricing";

  return <main className="overflow-hidden bg-[#07111d] text-white">
    <section className="relative border-b border-white/10 px-5 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_18%_80%,rgba(245,158,11,0.08),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Research first. Bet second.</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl">Your daily betting card, backed by real research.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">PrimeIQ researches the board, publishes the strongest plays with clear reasoning, and gives members a private second look at their own bets.</p><div className="mt-9 flex flex-wrap gap-3"><Link href={membershipHref} className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-6 py-3 font-bold text-[#06110d]">Unlock PrimeIQ <ArrowRight className="h-4 w-4" /></Link><a href="#free-play" className="rounded-md border border-white/15 px-6 py-3 font-semibold text-slate-200">See today’s free play</a></div></div>
    </section>

    <Section id="free-play" eyebrow="One free play every day" title="Today’s Free Play and Analysis">
      {content?.freePlay ? <div className="rounded-2xl border border-emerald-400/25 bg-[#0b1820] p-6 shadow-[0_20px_80px_rgba(16,185,129,0.08)] md:p-9"><div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap gap-2"><Pill>{content.freePlay.sport}</Pill><Pill>{content.freePlay.league}</Pill></div><h3 className="mt-5 font-display text-3xl">{content.freePlay.participantName}</h3><p className="mt-2 text-xl text-emerald-300">{content.freePlay.betType} {content.freePlay.line ?? ""} · {formatOdds(content.freePlay.odds)}</p><p className="mt-1 text-sm text-slate-500">{content.freePlay.market} · {content.freePlay.sportsbook}</p></div><div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center"><p className="text-4xl font-bold text-white">{content.freePlay.confidence}%</p><p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Confidence</p></div></div><div className="mt-8 border-t border-white/10 pt-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Why I like it</p><p className="mt-3 max-w-4xl leading-7 text-slate-300">{content.freePlay.analysis}</p></div></div> : <EmptyCard icon={<Trophy className="h-9 w-9" />} text={isLoading ? "Loading today’s play…" : "Today’s free play is being researched."} />}

      <div className="mt-6 flex flex-col gap-4 rounded-xl bg-emerald-400 p-6 text-[#06110d] md:flex-row md:items-center md:justify-between"><h3 className="font-display text-2xl font-semibold">Want the Full PrimeIQ Card? Unlock Today’s Member Plays →</h3><Link href={membershipHref} className="inline-flex w-fit items-center gap-2 rounded-md bg-[#07111d] px-6 py-3 font-bold text-white">Unlock the card <ChevronRight className="h-4 w-4" /></Link></div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1824]">
        {content?.freeVideo ? <div className="grid lg:grid-cols-[1.3fr_0.7fr]"><video controls playsInline preload="metadata" className="min-h-72 w-full bg-black" poster={content.freeVideo.thumbnailUrl ?? undefined}><source src={content.freeVideo.mediaUrl} />Your browser does not support this video.</video><div className="p-7 md:p-10"><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Free analysis video</p><h3 className="mt-3 font-display text-2xl">{content.freeVideo.title}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{content.freeVideo.description}</p></div></div> : <EmptyCard icon={<Video className="h-9 w-9" />} text="Today’s free breakdown is being prepared." />}
      </div>

    </Section>

    <Section eyebrow="What members get" title="The full research desk, plus a private second look.">
      <div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#0b1621] p-7"><h3 className="font-display text-2xl">How PrimeIQ works</h3><BenefitList items={["Daily PrimeIQ Card ranked by confidence", "PrimeIQ Parlays and Top Plays", "Why I’m Betting It analysis and videos", "Transparent line updates and results", "What I’m Staying Away From"]} /></div><div className="rounded-2xl border border-amber-300/20 bg-[linear-gradient(145deg,rgba(245,158,11,0.08),rgba(11,22,33,1)_48%)] p-7"><LockKeyhole className="h-7 w-7 text-amber-300" /><h3 className="mt-5 font-display text-2xl">Send Me Your Plays</h3><p className="mt-3 leading-7 text-slate-400">Not sure about a bet? Send it over and I’ll review the matchup, line and risk before you place it. 2 play/parlay reviews included each week.</p></div></div>
    </Section>

    <Section eyebrow="Featured PrimeIQ experience" title={featured.headline ?? "Research that feels personal."}>
      <TestimonialCard testimonial={featured} featured />
      <p className="mt-5 text-xs leading-5 text-slate-500">Individual results vary. No outcome or profit is guaranteed. PrimeIQ provides sports research and analysis; members make their own betting decisions.</p>
    </Section>

    <section id="pricing" className="px-5 py-20 md:px-10"><div className="mx-auto max-w-6xl rounded-3xl border border-amber-300/25 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.15),transparent_35%),#0b1621] p-8 md:p-14">{pricingLoading ? <div className="h-48 animate-pulse rounded-xl bg-white/5" /> : activePlan ? <><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">{activePlan.title}</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold md:text-5xl">${activePlan.price} for your first 3 months.</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">{activePlan.description}</p>{activePlan.features.length ? <BenefitList items={activePlan.features} /> : null}<Link href={`/register?plan=${activePlan.id}`} className="mt-8 inline-flex items-center gap-2 rounded-md bg-amber-300 px-6 py-3 font-bold text-[#171006]">Claim the offer <ArrowRight className="h-4 w-4" /></Link></> : <><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">PrimeIQ membership</p><h2 className="mt-4 font-display text-4xl font-semibold">Enrollment is temporarily closed.</h2><p className="mt-4 text-slate-400">The next membership offer will appear here when it is activated by the PrimeIQ team.</p></>}</div></section>

    {content?.testimonials.length ? <Section eyebrow="More verified experiences" title="What PrimeIQ clients are saying."><div className="grid gap-5 lg:grid-cols-2">{content.testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}</div></Section> : null}

    <section className="border-t border-white/10 px-5 py-24 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-emerald-300" /><h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold md:text-5xl">Stop guessing. Unlock PrimeIQ.</h2><Link href={membershipHref} className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-7 py-3.5 font-bold text-[#06110d]">Become a member <ArrowRight className="h-4 w-4" /></Link></section>
  </main>;
}

function TestimonialCard({ testimonial, featured = false }: { testimonial: { displayName: string; rating: number; reviewText: string; experienceContext: string | null; headline?: string | null; photoUrl?: string | null }; featured?: boolean }) { return <blockquote className={`rounded-2xl border bg-[#0b1621] p-7 md:p-9 ${featured ? "border-emerald-400/25" : "border-white/10"}`}><div className="flex items-start gap-4">{testimonial.photoUrl && <Image src={testimonial.photoUrl} alt={testimonial.displayName} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />}<div>{testimonial.headline && !featured && <h3 className="mb-2 font-display text-xl text-white">{testimonial.headline}</h3>}<div className="flex gap-1 text-amber-300">{Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div></div></div><p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-300">“{testimonial.reviewText}”</p><footer className="mt-6 border-t border-white/10 pt-5"><p className="font-bold text-white">— {testimonial.displayName}</p>{testimonial.experienceContext && <p className="mt-1 text-xs text-slate-500">{testimonial.experienceContext}</p>}</footer></blockquote>; }
function Section({ eyebrow, title, id, children }: { eyebrow: string; title: string; id?: string; children: React.ReactNode }) { return <section id={id} className="px-5 py-20 md:px-10 md:py-24"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">{eyebrow}</p><h2 className="mb-9 mt-3 max-w-3xl font-display text-3xl font-semibold md:text-5xl">{title}</h2>{children}</div></section>; }
function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">{children}</span>; }
function BenefitList({ items }: { items: string[] }) { return <ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-sm text-slate-300"><span className="mt-0.5 rounded-full bg-emerald-400/15 p-1 text-emerald-300"><Check className="h-3 w-3" /></span>{item}</li>)}</ul>; }
function EmptyCard({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center text-slate-500"><div className="mx-auto w-fit text-emerald-300">{icon}</div><p className="mt-4">{text}</p></div>; }
function formatOdds(odds: number | null) { if (odds === null) return "Odds pending"; return odds > 0 ? `+${odds}` : String(odds); }
