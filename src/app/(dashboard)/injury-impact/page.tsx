"use client";
import React from "react";
import { useGetAllQuery } from "@/redux/api/userApi";
import { InjuryImpactPanel } from "@/components/injuries/InjuryImpactPanel";
import { AlertTriangle, RefreshCw, AlertCircle } from "lucide-react";
import { ButtonSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function InjuryImpactPage() {
  const {
    data: injuriesResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllQuery({
    path: "analysis/injuries",
  });

  const rawInjuries = Array.isArray(injuriesResponse?.data)
    ? injuriesResponse.data
    : Array.isArray(injuriesResponse?.data?.data)
      ? injuriesResponse.data.data
      : [];

  const injuries = React.useMemo(() => {
    return rawInjuries.map((i: any) => ({
      PlayerID: i.PlayerID || i.playerId || i.id || String(Math.random()),
      playerName: i.playerName || i.player || i.name || "Unknown Athlete",
      team: i.team || i.teamAbbr || "NBA",
      status: i.status || "Out",
      injury: i.injury || i.description || "Injury reported",
      impactLevel: i.impactLevel || (i.status === "Out" ? "High" : "Medium"),
      usageShift: Number(i.usageShift || i.usgShift || 0),
      minutesShift: Number(i.minutesShift || i.minShift || 0),
      affectedProps: i.affectedProps || i.props || [],
    }));
  }, [rawInjuries]);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <AlertTriangle
              className="h-7 w-7 animate-pulse"
              style={{ color: "var(--coral)" }}
            />
            Injury Impact Engine
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Adjust projections automatically when players are ruled out. Update
            usage rate, minutes projections, and stat projections. Trigger
            alerts when injuries create prop opportunities.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-[5px] text-xs font-semibold transition-all border border-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Statuses
        </button>
      </div>

      <div className="max-w-3xl">
        {isLoading ? (
          <div className="card rounded-[5px] p-5 space-y-4 border border-white/5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[5px] p-4 space-y-3" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <Skeleton height={16} width="45%" />
                    <Skeleton height={12} width="70%" />
                  </div>
                  <Skeleton height={24} width={70} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton height={42} />
                  <Skeleton height={42} />
                  <Skeleton height={42} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card rounded-[5px] p-8 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Oops! Something Went Wrong
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                We couldn't complete your request at the moment. Please reload
                the page and try again.
              </p>

              {isLoading ? (
                <ButtonSkeleton className="mx-auto w-36" />
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="flex item-center justify-center mx-auto"
                >
                  <RefreshCw className="mt-1 w-4 h-4 mr-1" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : injuries.length === 0 ? (
          <div className="card rounded-[5px] p-8 text-center text-gray-400 border border-white/5">
            No active player injuries reported in the system today.
          </div>
        ) : (
          <InjuryImpactPanel injuries={injuries} />
        )}
      </div>
    </div>
  );
}
