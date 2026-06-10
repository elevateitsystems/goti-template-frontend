// PlansTabContent.tsx
"use client";
import React, { useState } from "react";
import { useGetAllQuery, usePostMutation, usePatchMutation } from "@/redux/api/userApi";
import { Plus, Trash2, Edit2, Check, X, Sparkles, RefreshCw } from "lucide-react";

export function PlansTabContent() {
  const { data: pricingResponse, isLoading, refetch } = useGetAllQuery({ path: "pricing" });
  const [createPricing, { isLoading: isCreating }] = usePostMutation();
  const [updatePricing, { isLoading: isUpdating }] = usePatchMutation();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(19.99);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [description, setDescription] = useState("");
  const [trialDays, setTrialDays] = useState<number>(7);
  const [features, setFeatures] = useState<string[]>(["Access to Core Data", "Real-time Odds"]);
  const [newFeature, setNewFeature] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createPricing({
        path: "pricing",
        body: {
          title,
          price: Number(price),
          currency: "USD",
          billingInterval,
          description,
          features,
          trialDays: Number(trialDays),
          isActive,
        },
      }).unwrap();

      // Reset form
      setTitle("");
      setPrice(19.99);
      setBillingInterval("monthly");
      setDescription("");
      setTrialDays(7);
      setFeatures(["Access to Core Data", "Real-time Odds"]);
      refetch();
    } catch (err) {
      console.error("Failed to create pricing:", err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updatePricing({
        path: `pricing/${id}`,
        body: { isActive: !currentStatus },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const plans = pricingResponse?.data || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List Existing Plans */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Active Subscription Plans
          </h3>
          <button 
            onClick={() => refetch()} 
            className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="card rounded-[5px] p-8 text-center text-gray-400">
            No plans created yet. Use the form to add a subscription plan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan: any) => (
              <div 
                key={plan.id} 
                className="card rounded-[5px] p-5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                style={{ 
                  borderColor: plan.isActive ? "var(--emerald-light)" : "var(--border)",
                  background: plan.isActive ? "linear-gradient(135deg, var(--bg-card), rgba(16, 185, 129, 0.03))" : "var(--bg-card)"
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display text-base font-bold text-white">{plan.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 h-8">{plan.description || "No description provided."}</p>
                  </div>
                  <span className={`badge px-2 py-1 text-[10px] uppercase font-bold rounded-sm ${
                    plan.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-white">${plan.price}</span>
                  <span className="text-xs text-gray-400">/ {plan.billingInterval}</span>
                </div>

                {plan.trialDays > 0 && (
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">
                    🎁 {plan.trialDays}-day free trial
                  </p>
                )}

                <div className="mt-4 border-t pt-3 border-white/5">
                  <p className="text-xs font-semibold text-gray-300 mb-2">Features Included:</p>
                  <ul className="space-y-1">
                    {plan.features?.map((f: string, i: number) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Check className="h-3. w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                    className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold transition-all ${
                      plan.isActive 
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-400" 
                        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Creation Form */}
      <div className="card rounded-[5px] p-5 h-fit border" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-display text-base font-semibold text-white mb-4 flex items-center gap-2">
          Create Subscription Plan
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Plan Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pro Monthly, VIP Elite"
              className="w-full bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Billing Interval</label>
              <select
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value as any)}
                className="w-full bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Trial Days</label>
              <input
                type="number"
                min="0"
                value={trialDays}
                onChange={(e) => setTrialDays(Number(e.target.value))}
                className="w-full bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center h-full pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-[#13151a] border-white/10 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs font-medium text-gray-300">Set as Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the plan advantages..."
              rows={2}
              className="w-full bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Features Manager */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Included Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. VIP discord access"
                className="flex-1 bg-[#13151a] border border-white/10 rounded-[5px] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[5px] px-3 flex items-center justify-center transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-1.5 max-h-32 overflow-y-auto border border-white/5 rounded-[5px] p-2 bg-[#13151a]/50">
              {features.map((feature, idx) => (
                <li key={idx} className="flex justify-between items-center gap-2 text-xs text-gray-300 bg-white/5 rounded px-2 py-1">
                  <span className="truncate">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              ))}
              {features.length === 0 && (
                <li className="text-[11px] text-gray-500 text-center py-2">No features added.</li>
              )}
            </ul>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-2.5 rounded-[5px] bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-4"
          >
            {isCreating ? "Creating Plan..." : "Create Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
