"use client";

import { useMemo } from "react";
import { Activity, BarChart3, CheckCircle2, Gauge, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAdminPlaysQuery } from "@/redux/api/playApi";
import type { Play, PlayPublicationStatus, PlayResult } from "@/redux/api/playApi";

const resultConfig: Array<{ key: PlayResult; label: string; color: string }> = [
  { key: "win", label: "WIN", color: "var(--emerald)" },
  { key: "loss", label: "LOSS", color: "var(--coral)" },
  { key: "push", label: "PUSH", color: "var(--gold)" },
  { key: "pending", label: "OPEN", color: "var(--intel-blue)" },
];

const publicationConfig: Array<{ key: PlayPublicationStatus; label: string; color: string }> = [
  { key: "published", label: "Published", color: "var(--emerald)" },
  { key: "scheduled", label: "Scheduled", color: "var(--intel-blue)" },
  { key: "draft", label: "Draft", color: "var(--gold)" },
  { key: "archived", label: "Archived", color: "var(--text-muted)" },
];

function average(values: Array<number | null>) {
  const available = values.filter((value): value is number => value !== null);
  if (!available.length) return 0;
  return available.reduce((total, value) => total + value, 0) / available.length;
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function createSportData(plays: Play[]) {
  const grouped = new Map<string, Play[]>();

  for (const play of plays) {
    const label = play.sport?.trim() || "Other";
    grouped.set(label, [...(grouped.get(label) ?? []), play]);
  }

  return [...grouped.entries()]
    .sort(([, left], [, right]) => right.length - left.length)
    .slice(0, 6)
    .map(([name, items]) => ({
      name: name.length > 8 ? name.slice(0, 8) : name,
      confidence: round(average(items.map((play) => play.confidence))),
      hitRate: round(average(items.map((play) => play.hitRate))),
      edge: round(average(items.map((play) => play.edge)), 1),
    }));
}

export function OverviewTabContent() {
  const { data, isLoading, error, refetch } = useGetAdminPlaysQuery({ limit: 100 });
  const plays = useMemo(() => data?.data ?? [], [data?.data]);

  const settled = plays.filter((play) => play.result === "win" || play.result === "loss");
  const wins = settled.filter((play) => play.result === "win").length;
  const winRate = settled.length ? round((wins / settled.length) * 100) : 0;
  const averageConfidence = round(average(plays.map((play) => play.confidence)));
  const averageEdge = round(average(plays.map((play) => play.edge)), 1);

  const sportData = useMemo(() => createSportData(plays), [plays]);
  const resultData = useMemo(
    () => resultConfig.map((item) => ({ ...item, value: plays.filter((play) => play.result === item.key).length })),
    [plays],
  );
  const publicationData = useMemo(
    () => publicationConfig.map((item) => ({ ...item, value: plays.filter((play) => play.publicationStatus === item.key).length })),
    [plays],
  );
  const highestPublicationCount = Math.max(1, ...publicationData.map((item) => item.value));

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#1e3050] bg-[#0f1c2e]">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-400" aria-label="Loading admin analytics" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-rose-500/20 bg-[#0f1c2e] p-8 text-center">
        <p className="text-sm text-rose-300">Admin analytics could not be loaded.</p>
        <button onClick={() => refetch()} className="mt-4 rounded-md border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="relative overflow-hidden rounded-xl border border-[#1e3050] bg-[#0f1c2e] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.22)] md:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-emerald-400/[0.07] blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Admin Intelligence</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">Platform Performance Overview</h2>
              <p className="mt-1 text-xs text-[#5a7499] sm:text-sm">Publishing health and play performance from the latest 100 records.</p>
            </div>
            <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Live data
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard label="All Plays" value={data?.meta.pagination.total ?? plays.length} icon={BarChart3} color="var(--intel-blue)" />
        <MetricCard label="Settled Win Rate" value={`${winRate}%`} icon={CheckCircle2} color="var(--emerald)" />
        <MetricCard label="Avg Confidence" value={`${averageConfidence}%`} icon={Gauge} color="var(--gold)" />
        <MetricCard label="Avg Edge" value={averageEdge ? `${averageEdge > 0 ? "+" : ""}${averageEdge}` : "0"} icon={Activity} color="var(--coral)" />
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <ChartCard title="Play Performance" description="Confidence, hit rate, and edge by active sport." badge={`${sportData.length} sports`}>
          {sportData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sportData} margin={{ left: -18, right: 14, top: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminConfidence" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0.015} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<AdminTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
                <Area type="monotone" dataKey="confidence" name="Confidence" stroke="var(--emerald)" fill="url(#adminConfidence)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="hitRate" name="Hit rate" stroke="var(--intel-blue)" fill="transparent" strokeWidth={2.2} />
                <Area type="monotone" dataKey="edge" name="Edge" stroke="var(--gold)" fill="transparent" strokeWidth={2.2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty />
          )}
        </ChartCard>

        <ChartCard title="Result Profile" description="Outcome distribution across the loaded plays.">
          {plays.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resultData} margin={{ left: -18, right: 12, top: 16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<AdminTooltip />} cursor={{ fill: "rgba(255,255,255,0.035)" }} />
                <Bar dataKey="value" name="Plays" radius={[5, 5, 0, 0]} maxBarSize={64}>
                  {resultData.map((entry) => <Cell key={entry.key} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty />
          )}
        </ChartCard>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#1e3050] bg-[#0f1c2e] shadow-[0_12px_35px_rgba(0,0,0,0.22)]">
        <div className="border-b border-[#1e3050] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8ba3c4]">Publishing Analyzer</p>
          <p className="mt-1 text-[10px] text-[#5a7499]">Content readiness across the current play catalog.</p>
        </div>
        <div className="grid gap-x-10 gap-y-5 p-5 md:grid-cols-2 md:p-6">
          {publicationData.map((item) => {
            const width = item.value ? Math.max(8, (item.value / highestPublicationCount) * 100) : 0;
            return (
              <div key={item.key} className="grid grid-cols-[78px_1fr_32px] items-center gap-3 text-xs">
                <p className="font-semibold text-slate-300">{item.label}</p>
                <div className="h-2 overflow-hidden rounded-full bg-[#132035]">
                  <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${width}%`, backgroundColor: item.color }} />
                </div>
                <p className="text-right font-bold text-slate-200">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: typeof Activity; color: string }) {
  return (
    <div className="rounded-xl border border-[#1e3050] bg-[#0f1c2e] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#5a7499] sm:text-[10px]">{label}</p>
        <Icon className="h-4 w-4 shrink-0" style={{ color }} aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">{value}</p>
    </div>
  );
}

function ChartCard({ title, description, badge, children }: { title: string; description: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#1e3050] bg-[#0f1c2e] shadow-[0_12px_35px_rgba(0,0,0,0.22)]">
      <div className="flex min-h-[76px] items-start justify-between gap-3 border-b border-[#1e3050] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8ba3c4]">{title}</p>
          <p className="mt-1 text-[10px] text-[#5a7499]">{description}</p>
        </div>
        {badge ? <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold uppercase text-emerald-300">{badge}</span> : null}
      </div>
      <div className="h-[300px] min-w-0 px-2 py-4 sm:h-[330px]">{children}</div>
    </div>
  );
}

function ChartEmpty() {
  return <div className="flex h-full items-center justify-center text-xs text-[#5a7499]">Add plays to populate this chart.</div>;
}

function AdminTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#1e3050] bg-[#0a1423]/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      {label ? <p className="mb-1.5 text-xs font-semibold text-slate-200">{label}</p> : null}
      {payload.map((item) => (
        <p key={item.name} className="text-[11px]" style={{ color: item.color || "var(--text-secondary)" }}>
          {item.name}: <span className="font-bold">{item.value ?? 0}</span>
        </p>
      ))}
    </div>
  );
}
