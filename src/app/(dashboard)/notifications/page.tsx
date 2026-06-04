"use client";
import { useMemo } from "react";
import { useGetAllQuery } from "@/redux/api/userApi";
import { Flame, TrendingUp, Percent } from "lucide-react";
import { NotificationsHeader } from "./components/NotificationsHeader";
import { NotificationColumn } from "./components/NotificationColumn";
import { NotificationsLoading } from "./components/NotificationsLoading";
import { NotificationsError } from "./components/NotificationsError";
import { EdgeCard, EvCard, ArbitrageCard } from "./components/NotificationCards";
import { EvItem, ArbitrageItem, EdgeEvent } from "./components/types";

export default function NotificationsPage() {
  const {
    data: edgeResponse,
    isLoading: edgeLoading,
    error: edgeError,
    refetch: refetchEdge,
  } = useGetAllQuery({
    path: "edge/edge",
  });

  const {
    data: evResponse,
    isLoading: evLoading,
    error: evError,
    refetch: refetchEv,
  } = useGetAllQuery({
    path: "edge/edge/ev",
  });

  const {
    data: arbResponse,
    isLoading: arbLoading,
    error: arbError,
    refetch: refetchArb,
  } = useGetAllQuery({
    path: "edge/edge/arbitrage",
  });

  const handleRetry = () => {
    refetchEdge();
    refetchEv();
    refetchArb();
  };

  const hasError = Boolean(edgeError || evError || arbError);
  const isLoading = edgeLoading || evLoading || arbLoading;

  const edgeAlerts = useMemo(() => {
    const events = edgeResponse?.data?.data as EdgeEvent[] | undefined;
    return (
      events?.flatMap((event) =>
        event.edges.map((edge) => ({
          ...edge,
          eventId: event.eventId,
          leagueId: event.leagueId,
          sport: event.sport,
          calculatedAt: event.calculatedAt,
        })),
      ) || []
    );
  }, [edgeResponse]);

  const evBets = useMemo(() => {
    return (evResponse?.data?.data as EvItem[] | undefined) || [];
  }, [evResponse]);

  const arbBets = useMemo(() => {
    return (arbResponse?.data?.data as ArbitrageItem[] | undefined) || [];
  }, [arbResponse]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <NotificationsHeader isLoading={isLoading} onRefresh={handleRetry} />

      {hasError ? (
        <NotificationsError isLoading={isLoading} onRetry={handleRetry} />
      ) : isLoading ? (
        <NotificationsLoading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NotificationColumn
            title="Edge Alerts"
            count={edgeAlerts.length}
            icon={Flame}
            badgeColor="text-red-400 bg-red-500/10"
          >
            {edgeAlerts.length > 0 ? (
              edgeAlerts.map((edge) => <EdgeCard key={edge.edgeId} edge={edge} />)
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs bg-[#171921] border border-white/5 rounded-[5px]">
                No active edge alerts.
              </div>
            )}
          </NotificationColumn>

          <NotificationColumn
            title="Expected Value (EV+)"
            count={evBets.length}
            icon={TrendingUp}
            badgeColor="text-emerald-400 bg-emerald-500/10"
          >
            {evBets.length > 0 ? (
              evBets.map((item) => <EvCard key={item.edgeId} item={item} />)
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs bg-[#171921] border border-white/5 rounded-[5px]">
                No positive EV+ lines currently found.
              </div>
            )}
          </NotificationColumn>

          <NotificationColumn
            title="Arbitrage Alerts"
            count={arbBets.length}
            icon={Percent}
            badgeColor="text-amber-400 bg-amber-500/10"
          >
            {arbBets.length > 0 ? (
              arbBets.map((item) => <ArbitrageCard key={item.edgeId} item={item} />)
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs bg-[#171921] border border-white/5 rounded-[5px]">
                No arbitrage line splits detected today.
              </div>
            )}
          </NotificationColumn>
        </div>
      )}
    </div>
  );
}
