"use client";
import React from "react";
import { useGetAllQuery } from "@/redux/api/userApi";
import { Users, DollarSign, Calendar, ShieldCheck, Clock, RefreshCw } from "lucide-react";

export function SubscriptionsTabContent() {
  const { data: subResponse, isLoading, refetch } = useGetAllQuery({
    path: "subscription/admin/all",
  });

  const subscriptions = subResponse?.data || [];

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Compute stats dynamically from real database subscriptions
  const totalUsers = subscriptions.length;
  const activeSubs = subscriptions.filter((s: any) => s.status === "active").length;
  const totalRevenue = subscriptions.reduce((sum: number, s: any) => sum + (s.amountPaid || 0), 0);

  const subStats = [
    {
      label: "Total Subscribed Users",
      count: totalUsers,
      color: "var(--intel-blue)",
      icon: Users,
    },
    {
      label: "Active Subscriptions",
      count: activeSubs,
      color: "var(--emerald)",
      icon: ShieldCheck,
    },
    {
      label: "Revenue Generated",
      count: `$${totalRevenue.toLocaleString()}`,
      color: "var(--gold)",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subStats.map((s, i) => (
          <div key={i} className="card rounded-[5px] p-5 border" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between items-start mb-3">
              <p
                className="font-display text-sm font-semibold text-gray-400"
              >
                {s.label}
              </p>
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {s.count}
            </p>
          </div>
        ))}
      </div>

      {/* Subscription Users Table */}
      <div className="card rounded-[5px] p-5 border" style={{ borderColor: "var(--border)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Subscribed Users List
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
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No active subscriptions found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ borderColor: "var(--border)" }}>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Plan Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4">Start Date</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-300 divide-y divide-white/5">
                {subscriptions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{sub.user?.firstName || "Customer"}</div>
                      <div className="text-[10px] text-gray-500">{sub.user?.email || "No Email"}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {sub.pricing?.title || "Custom Plan"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : sub.status === "canceled"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      ${sub.amountPaid || 0} <span className="text-[9px] text-gray-500">{sub.currency}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 flex items-center gap-1.5 pt-4">
                      <Clock className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      {formatDate(sub.renewalDate)}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {formatDate(sub.startDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
