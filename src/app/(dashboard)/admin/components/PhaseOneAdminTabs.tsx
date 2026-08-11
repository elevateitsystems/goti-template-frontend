"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Film, Inbox, Pencil, Plus, Quote, Trash2 } from "lucide-react";
import {
  useAnswerRequestMutation,
  useCreateCardMutation,
  useCreateTestimonialMutation,
  useCreateVideoMutation,
  useDeleteCardMutation,
  useDeleteTestimonialMutation,
  useDeleteVideoMutation,
  useGetAdminCardsQuery,
  useGetAdminReviewUsageQuery,
  useGetAdminRequestsQuery,
  useGetAdminTestimonialsQuery,
  useGetAdminVideosQuery,
  useUpdateCardMutation,
  useUpdateTestimonialMutation,
  useUpdateVideoMutation,
} from "@/redux/api/contentApi";
import type { PersonalReviewRequest, ReviewRequestStatus, ReviewVerdict } from "@/redux/api/contentApi";

const input = "w-full rounded-md border border-white/10 bg-[#0c151d] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500";
const button = "inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-bold text-[#07110f] hover:bg-emerald-400 disabled:opacity-50";
const panel = "rounded-xl border border-white/10 bg-[#0b131b] p-5";

export function DailyCardsTabContent() {
  const { data, isLoading } = useGetAdminCardsQuery();
  const [createCard, { isLoading: saving }] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await createCard({ title: String(form.get("title")), summary: String(form.get("summary") || ""), cardDate: String(form.get("cardDate")), publicationStatus: String(form.get("publicationStatus")) as "draft" | "scheduled" | "published", scheduledAt: String(form.get("scheduledAt") || "") }).unwrap();
    event.currentTarget.reset();
  };
  return <AdminSection title="Daily PrimeIQ Cards" description="Build dated editions and assign ranked plays from Play Management.">
    <form onSubmit={submit} className={`${panel} grid gap-3 md:grid-cols-2`}>
      <input className={input} name="title" required placeholder="Today’s PrimeIQ Card" />
      <input className={input} name="cardDate" required type="date" />
      <input className={input} name="summary" placeholder="Short member briefing" />
      <select className={input} name="publicationStatus"><option value="draft">Save draft</option><option value="published">Publish now</option><option value="scheduled">Schedule</option></select>
      <input className={input} name="scheduledAt" type="datetime-local" aria-label="Scheduled Eastern time" />
      <button className={`${button} md:col-span-2`} disabled={saving}><Plus className="h-4 w-4" />Save card</button>
    </form>
    <div className="grid gap-3">{isLoading ? <Empty text="Loading cards…" /> : data?.data.map((card) => <article key={card.id} className={`${panel} flex flex-col gap-3 md:flex-row md:items-center`}>
      <div className="flex-1"><p className="font-display text-lg text-white">{card.title}</p><p className="text-xs text-slate-500">{new Date(card.cardDate).toLocaleDateString()} · {card.plays?.length ?? 0} plays{card.scheduledAt ? ` · ${formatEt(card.scheduledAt)}` : ""}</p></div>
      <Status value={card.publicationStatus} />
      <button className="inline-flex items-center gap-1 text-xs font-bold text-sky-300" onClick={() => { const title = prompt("Card title", card.title); if (title) updateCard({ id: card.id, body: { title } }); }}><Pencil className="h-3 w-3" />Edit</button>
      <button className="text-xs font-bold text-emerald-300" onClick={() => updateCard({ id: card.id, body: { publicationStatus: card.publicationStatus === "published" ? "archived" : "published" } })}>{card.publicationStatus === "published" ? "Archive" : "Publish"}</button>
      <button className="text-xs font-bold text-sky-300" onClick={() => { const scheduledAt = prompt("Schedule in Eastern Time (YYYY-MM-DDTHH:mm)"); if (scheduledAt) updateCard({ id: card.id, body: { publicationStatus: "scheduled", scheduledAt } }); }}>Schedule</button>
      <IconDelete onClick={() => confirm("Delete this card?") && deleteCard(card.id)} />
    </article>)}</div>
  </AdminSection>;
}

export function VideosTabContent() {
  const { data } = useGetAdminVideosQuery();
  const [createVideo, { isLoading }] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const body = new FormData(event.currentTarget);
    body.set("accessLevel", String(body.get("accessLevel")));
    await createVideo(body).unwrap(); event.currentTarget.reset();
  };
  return <AdminSection title="Video Library" description="Manage free and members-only breakdowns. Media URLs keep storage provider choices flexible.">
    <form onSubmit={submit} className={`${panel} grid gap-3 md:grid-cols-2`}>
      <input className={input} name="title" required placeholder="Video title" />
      <input className={input} name="mediaUrl" required type="url" placeholder="Hosted video URL" />
      <textarea className={`${input} md:col-span-2`} name="description" placeholder="Description" />
      <select className={input} name="accessLevel"><option value="members_only">Members only</option><option value="free">Free</option></select>
      <input className={input} name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" />
      <select className={input} name="publicationStatus"><option value="draft">Save draft</option><option value="published">Publish now</option><option value="scheduled">Schedule</option></select>
      <input className={input} name="scheduledAt" type="datetime-local" aria-label="Scheduled Eastern time" />
      <button className={`${button} md:col-span-2`} disabled={isLoading}><Film className="h-4 w-4" />Save video</button>
    </form>
    <div className="grid gap-3 md:grid-cols-2">{data?.data.map((video) => <article key={video.id} className={panel}>
      <div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-white">{video.title}</p><p className="mt-1 text-xs text-slate-500">{video.accessLevel.replace("_", " ")}{video.scheduledAt ? ` · ${formatEt(video.scheduledAt)}` : ""}</p></div><IconDelete onClick={() => confirm("Delete this video?") && deleteVideo(video.id)} /></div>
      <div className="mt-4 flex items-center gap-3"><Status value={video.publicationStatus} /><button className="text-xs font-bold text-emerald-300" onClick={() => { const body = new FormData(); body.set("publicationStatus", video.publicationStatus === "published" ? "archived" : "published"); updateVideo({ id: video.id, body }); }}>{video.publicationStatus === "published" ? "Archive" : "Publish"}</button></div>
      <button className="mt-3 text-xs font-bold text-sky-300" onClick={() => { const scheduledAt = prompt("Schedule in Eastern Time (YYYY-MM-DDTHH:mm)"); if (scheduledAt) { const body = new FormData(); body.set("publicationStatus", "scheduled"); body.set("scheduledAt", scheduledAt); updateVideo({ id: video.id, body }); } }}>Schedule</button>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sky-300" onClick={() => { const title = prompt("Video title", video.title); const mediaUrl = prompt("Video URL", video.mediaUrl); if (title && mediaUrl) { const body = new FormData(); body.set("title", title); body.set("mediaUrl", mediaUrl); updateVideo({ id: video.id, body }); } }}><Pencil className="h-3 w-3" />Edit details</button>
    </article>)}</div>
  </AdminSection>;
}

export function RequestsInboxTabContent() {
  const [status, setStatus] = useState<ReviewRequestStatus | undefined>();
  const { data } = useGetAdminRequestsQuery(status);
  const { data: usage } = useGetAdminReviewUsageQuery();
  const [answerRequest, { isLoading }] = useAnswerRequestMutation();
  return <AdminSection title="Send Me Your Plays Inbox" description="Give members a clear second opinion with presets, free-text reasoning, and advice for individual parlay legs.">
    <div className="grid gap-3 md:grid-cols-3"><Metric label="Members this week" value={usage?.data.length ?? 0} /><Metric label="Submissions used" value={usage?.data.reduce((total, item) => total + item.used, 0) ?? 0} /><Metric label="Reviews remaining" value={usage?.data.reduce((total, item) => total + item.remaining, 0) ?? 0} /></div>
    {usage?.data.length ? <div className={`${panel} overflow-x-auto`}><table className="w-full text-left text-xs"><thead className="text-slate-500"><tr><th className="pb-2">Member</th><th className="pb-2">Used</th><th className="pb-2">Remaining</th><th className="pb-2">ET week</th></tr></thead><tbody>{usage.data.map((item) => <tr key={item.id} className="border-t border-white/5"><td className="py-2 text-slate-300">{item.firstName} {item.lastName}</td><td>{item.used}</td><td>{item.remaining}</td><td>{new Date(item.weekStart).toLocaleDateString()}</td></tr>)}</tbody></table></div> : null}
    <div className="flex gap-2">{([undefined, "new", "reviewing", "answered"] as const).map((item) => <button key={item ?? "all"} onClick={() => setStatus(item)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${status === item ? "bg-emerald-500 text-[#07110f]" : "bg-white/5 text-slate-400"}`}>{item ?? "all"}</button>)}</div>
    <div className="grid gap-4">{data?.data.length ? data.data.map((request) => <RequestCard key={request.id} request={request} saving={isLoading} onSave={(verdict, response, legNotes) => answerRequest({ id: request.id, status: "answered", verdict, response, legNotes })} onReview={() => answerRequest({ id: request.id, status: "reviewing" })} />) : <Empty text="No requests in this view." />}</div>
  </AdminSection>;
}

function RequestCard({ request, saving, onSave, onReview }: { request: PersonalReviewRequest; saving: boolean; onSave: (verdict: ReviewVerdict, response: string, legNotes: Array<{ id: string; adminNote: string | null }>) => unknown; onReview: () => unknown }) {
  const [verdict, setVerdict] = useState<ReviewVerdict>(request.verdict ?? "good_to_go");
  const [response, setResponse] = useState(request.response ?? "");
  const [legNotes, setLegNotes] = useState<Record<string, string>>(() => Object.fromEntries(request.legs.map((leg) => [leg.id, leg.adminNote ?? ""])));
  return <article className={panel}><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold text-white">{request.sport} · {request.game}</p><p className="text-xs text-slate-500">{request.member ? `${request.member.firstName} ${request.member.lastName} · ${request.member.email}` : "Member"} · {request.submissionType}</p></div><Status value={request.status} /></div>
    <p className="mt-4 text-sm text-slate-300">{request.player ? `${request.player} · ` : ""}{request.bet}{request.line !== null ? ` ${request.line}` : ""} · {request.sportsbook}</p><p className="mt-2 rounded-md bg-white/[0.03] p-3 text-sm text-slate-400">{request.question}</p>
    {request.legs.length ? <div className="mt-3 space-y-2">{request.legs.map((leg, index) => <div key={leg.id} className="grid gap-2 rounded-md border border-white/5 p-3 md:grid-cols-[1fr_1fr]"><p className="text-xs text-slate-300">Leg {index + 1}: {leg.participant} — {leg.bet} {leg.line ?? ""}{leg.sportsbook ? ` · ${leg.sportsbook}` : ""}</p><input className={input} value={legNotes[leg.id] ?? ""} onChange={(event) => setLegNotes((current) => ({ ...current, [leg.id]: event.target.value }))} placeholder="Leg-specific advice" /></div>)}</div> : null}
    {request.screenshotUrl && <a href={request.screenshotUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-emerald-300">View screenshot</a>}
    {request.status !== "answered" && <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr_auto]"><select className={input} value={verdict} onChange={(e) => setVerdict(e.target.value as ReviewVerdict)}><option value="good_to_go">GOOD TO GO</option><option value="adjust">I’D ADJUST IT</option><option value="adjust_line">ADJUST THE LINE</option><option value="remove_leg">REMOVE A LEG</option><option value="leg_concern">LEG CONCERN</option><option value="consider_alternative">CONSIDER ALTERNATIVE</option><option value="stay_away">STAY AWAY</option><option value="pass">I’D PASS</option><option value="need_more_info">NEED MORE INFO</option></select><textarea className={input} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Private explanation" /><div className="flex gap-2"><button className="rounded border border-white/10 px-3 text-xs text-slate-300" onClick={onReview}>Reviewing</button><button className={button} disabled={saving || !response.trim()} onClick={() => onSave(verdict, response, request.legs.map((leg) => ({ id: leg.id, adminNote: legNotes[leg.id]?.trim() || null })))}><CheckCircle2 className="h-4 w-4" />Answer</button></div></div>}
  </article>;
}

export function TestimonialsTabContent() {
  const { data } = useGetAdminTestimonialsQuery();
  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const body = new FormData(event.currentTarget); body.set("publicationStatus", "draft"); body.set("isFeatured", "false"); await createTestimonial(body).unwrap(); event.currentTarget.reset(); };
  const move = (index: number, direction: -1 | 1) => {
    const items = data?.data ?? [];
    const neighbor = items[index + direction];
    const current = items[index];
    if (!current || !neighbor) return;
    const currentBody = new FormData(); currentBody.set("displayOrder", String(neighbor.displayOrder));
    const neighborBody = new FormData(); neighborBody.set("displayOrder", String(current.displayOrder));
    void Promise.all([updateTestimonial({ id: current.id, body: currentBody }).unwrap(), updateTestimonial({ id: neighbor.id, body: neighborBody }).unwrap()]);
  };
  return <AdminSection title="Real PrimeIQ Experiences" description="Curated, reviewer-approved testimonials only—never an open public review wall.">
    <form onSubmit={submit} className={`${panel} grid gap-3 md:grid-cols-2`}><input className={input} name="displayName" required placeholder="Display name" /><select className={input} name="rating" defaultValue="5"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><input className={`${input} md:col-span-2`} name="headline" placeholder="Headline" /><textarea className={`${input} md:col-span-2`} name="reviewText" required placeholder="Approved testimonial" /><input className={input} name="experienceContext" placeholder="Experience/result context" /><input className={input} name="displayOrder" type="number" min="0" defaultValue={data?.data.length ?? 0} placeholder="Display order" /><input className={input} name="photo" type="file" accept="image/jpeg,image/png,image/webp" /><button className={`${button} md:col-span-2`} disabled={isLoading}><Quote className="h-4 w-4" />Add testimonial draft</button></form>
    <div className="grid gap-3 md:grid-cols-2">{data?.data.map((item, index) => <article key={item.id} className={panel}><div className="flex justify-between"><div>{item.headline && <p className="font-display text-lg text-white">{item.headline}</p>}<p className="font-semibold text-white">{"★".repeat(item.rating)} {item.displayName}</p><p className="mt-2 line-clamp-4 text-sm text-slate-400">{item.reviewText}</p></div><IconDelete onClick={() => confirm("Delete this testimonial?") && deleteTestimonial(item.id)} /></div><div className="mt-4 flex flex-wrap gap-3"><Status value={item.publicationStatus} /><button className="text-xs font-bold text-emerald-300" onClick={() => { const body = new FormData(); body.set("publicationStatus", item.publicationStatus === "published" ? "archived" : "published"); updateTestimonial({ id: item.id, body }); }}>{item.publicationStatus === "published" ? "Unpublish" : "Publish"}</button><button className="inline-flex items-center gap-1 text-xs font-bold text-sky-300" onClick={() => { const reviewText = prompt("Approved testimonial", item.reviewText); if (reviewText) { const body = new FormData(); body.set("reviewText", reviewText); updateTestimonial({ id: item.id, body }); } }}><Pencil className="h-3 w-3" />Edit</button><button className="text-xs font-bold text-amber-300" onClick={() => { const body = new FormData(); body.set("isFeatured", String(!item.isFeatured)); updateTestimonial({ id: item.id, body }); }}>{item.isFeatured ? "Remove featured" : "Feature"}</button><button className="text-slate-400 disabled:opacity-30" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move testimonial up"><ArrowUp className="h-4 w-4" /></button><button className="text-slate-400 disabled:opacity-30" disabled={index === (data?.data.length ?? 0) - 1} onClick={() => move(index, 1)} aria-label="Move testimonial down"><ArrowDown className="h-4 w-4" /></button></div></article>)}</div>
  </AdminSection>;
}

function AdminSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <div className="space-y-5"><div><h2 className="font-display text-xl font-semibold text-white">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>{children}</div>; }
function Status({ value }: { value: string }) { return <span className="w-fit rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{value}</span>; }
function IconDelete({ onClick }: { onClick: () => void }) { return <button onClick={onClick} className="rounded p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>; }
function Empty({ text }: { text: string }) { return <div className={`${panel} flex items-center gap-2 text-sm text-slate-500`}><Inbox className="h-4 w-4" />{text}</div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className={panel}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-white">{value}</p></div>; }
function formatEt(value: string) { return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(value)); }
