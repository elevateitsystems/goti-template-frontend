"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Check, Link2, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";

import {
  useDeleteOneMutation,
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
} from "@/redux/api/userApi";

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
  introMonths: number;
  isActive: boolean;
  stripeProductId: string | null;
  stripeIntroPriceId: string | null;
  stripePriceId: string | null;
}

interface ApiEnvelope<T> {
  data: T;
}

const fieldClass =
  "w-full rounded-[5px] border border-white/10 bg-[#13151a] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500";

const initialFeatures = [
  "Daily PrimeIQ Card and Top Plays",
  "PrimeIQ video breakdowns",
  "Two Send Me Your Plays reviews each week",
  "Play updates and results history",
];

function mutationErrorMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("data" in error)) return "Unable to save the pricing connection.";
  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("message" in data)) return "Unable to save the pricing connection.";
  return String((data as { message: unknown }).message);
}

function abbreviatedId(value: string | null) {
  if (!value) return "Not connected";
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-6)}` : value;
}

export function PlansTabContent() {
  const { data: pricingResponse, isLoading, refetch } = useGetAllQuery({ path: "admin/pricing" });
  const [linkPricing, { isLoading: isLinking }] = usePostMutation();
  const [updatePricing, { isLoading: isUpdating }] = usePatchMutation();
  const [archivePricing, { isLoading: isArchiving }] = useDeleteOneMutation();
  const [stripeProductId, setStripeProductId] = useState("");
  const [stripeIntroPriceId, setStripeIntroPriceId] = useState("");
  const [stripePriceId, setStripePriceId] = useState("");
  const [features, setFeatures] = useState(initialFeatures);
  const [newFeature, setNewFeature] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const response = pricingResponse as ApiEnvelope<PricingPlan[]> | undefined;
  const plans = response?.data ?? [];

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value) return;
    setFeatures((current) => [...current, value]);
    setNewFeature("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await linkPricing({
        path: "pricing",
        body: { stripeProductId, stripeIntroPriceId, stripePriceId, features, isActive },
      }).unwrap();
      setStripeProductId("");
      setStripeIntroPriceId("");
      setStripePriceId("");
      setFeatures(initialFeatures);
      setNotice("Stripe pricing connected successfully.");
      await refetch();
    } catch (linkError) {
      setError(mutationErrorMessage(linkError));
    }
  };

  const togglePlan = async (plan: PricingPlan) => {
    setError("");
    setNotice("");
    try {
      await updatePricing({ path: `pricing/${plan.id}`, body: { isActive: !plan.isActive } }).unwrap();
      setNotice(plan.isActive ? "Plan deactivated locally." : "Plan activated.");
      await refetch();
    } catch (updateError) {
      setError(mutationErrorMessage(updateError));
    }
  };

  const archivePlan = async (plan: PricingPlan) => {
    if (!confirm(`Archive ${plan.title}? Stripe will not be changed.`)) return;
    setError("");
    setNotice("");
    try {
      await archivePricing({ path: `pricing/${plan.id}` }).unwrap();
      setNotice("Plan archived locally. Stripe resources were not changed.");
      await refetch();
    } catch (archiveError) {
      setError(mutationErrorMessage(archiveError));
    }
  };

  return (
    <div className="space-y-5">
      {(notice || error) && (
        <div className={`rounded-[5px] border px-4 py-3 text-sm ${error ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>
          {error || notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><Sparkles className="h-5 w-5 text-emerald-400" />Connected pricing</h3>
              <p className="mt-1 text-xs text-gray-500">Only one founding plan can be active at a time.</p>
            </div>
            <button onClick={() => refetch()} className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white" aria-label="Refresh pricing"><RefreshCw className="h-4 w-4" /></button>
          </div>

          {isLoading ? (
            <div className="card flex min-h-48 items-center justify-center rounded-[5px]"><div className="h-8 w-8 animate-spin rounded-full border-t-2 border-emerald-500" /></div>
          ) : plans.length === 0 ? (
            <div className="card rounded-[5px] border border-dashed border-white/10 p-10 text-center text-sm text-gray-500">No Stripe pricing is connected yet.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.id} className="card rounded-[5px] border p-5" style={{ borderColor: plan.isActive ? "var(--emerald)" : "var(--border)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div><h4 className="font-display font-bold text-white">{plan.title}</h4><p className="mt-1 text-xs text-gray-500">{plan.description}</p></div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${plan.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-gray-500"}`}>{plan.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">${plan.price.toFixed(2)} <span className="text-xs font-normal text-gray-400">for 3 months</span></p>
                  <p className="mt-1 text-xs font-semibold text-emerald-400">Then $44.28/month</p>
                  <dl className="mt-4 space-y-2 rounded bg-black/10 p-3 text-[11px]">
                    <IdRow label="Product" value={plan.stripeProductId} />
                    <IdRow label="3-month price" value={plan.stripeIntroPriceId} />
                    <IdRow label="Monthly price" value={plan.stripePriceId} />
                  </dl>
                  <ul className="mt-4 space-y-1.5">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-xs text-gray-400"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />{feature}</li>)}</ul>
                  <div className="mt-5 flex justify-end gap-2 border-t border-white/5 pt-3">
                    <button disabled={isUpdating} onClick={() => togglePlan(plan)} className="rounded px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50">{plan.isActive ? "Deactivate" : "Activate"}</button>
                    <button disabled={isArchiving} onClick={() => archivePlan(plan)} className="rounded p-2 text-gray-500 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50" aria-label={`Archive ${plan.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="card h-fit rounded-[5px] border p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="flex items-center gap-2 font-display font-semibold text-white"><Link2 className="h-4 w-4 text-emerald-400" />Link Stripe pricing</h3>
          <p className="mt-2 text-xs leading-5 text-gray-500">Paste the IDs from one Stripe Product with its three-month and monthly Prices. PrimeIQ validates everything before saving.</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <StripeIdField label="Product ID" placeholder="prod_..." value={stripeProductId} onChange={setStripeProductId} />
            <StripeIdField label="3-month introductory Price ID" placeholder="price_..." value={stripeIntroPriceId} onChange={setStripeIntroPriceId} />
            <StripeIdField label="Monthly renewal Price ID" placeholder="price_..." value={stripePriceId} onChange={setStripePriceId} />

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">Included features</label>
              <div className="mb-2 flex gap-2"><input className={fieldClass} value={newFeature} onChange={(event) => setNewFeature(event.target.value)} placeholder="Add a feature" /><button type="button" onClick={addFeature} className="rounded-[5px] bg-emerald-600 px-3 text-white hover:bg-emerald-500" aria-label="Add feature"><Plus className="h-4 w-4" /></button></div>
              <ul className="max-h-40 space-y-1.5 overflow-y-auto rounded-[5px] border border-white/5 bg-black/10 p-2">
                {features.map((feature, index) => <li key={`${feature}-${index}`} className="flex items-center justify-between gap-2 rounded bg-white/5 px-2 py-1 text-xs text-gray-300"><span>{feature}</span><button type="button" onClick={() => setFeatures((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-gray-500 hover:text-rose-300"><Trash2 className="h-3 w-3" /></button></li>)}
              </ul>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-300"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="accent-emerald-500" />Make this the active founding plan</label>
            <button type="submit" disabled={isLinking || !stripeProductId || !stripeIntroPriceId || !stripePriceId} className="flex w-full items-center justify-center gap-2 rounded-[5px] bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"><Link2 className="h-4 w-4" />{isLinking ? "Validating with Stripe…" : "Validate and connect"}</button>
          </form>
        </section>
      </div>
    </div>
  );
}

function StripeIdField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="mb-1 block text-xs font-medium text-gray-300">{label}</label><input required className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" /></div>;
}

function IdRow({ label, value }: { label: string; value: string | null }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-gray-500">{label}</dt><dd className="font-mono text-gray-300" title={value ?? undefined}>{abbreviatedId(value)}</dd></div>;
}
