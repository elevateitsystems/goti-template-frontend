import { ButtonSkeleton } from "@/components/ui/Skeleton";
import { Radio, RefreshCw } from "lucide-react";

interface NotificationsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function NotificationsHeader({ isLoading, onRefresh }: NotificationsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
          <Radio className="h-7 w-7 text-emerald-400 animate-pulse" />
          Live Alerts & Notifications
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Real-time sharp money moves, positive expected value (EV+), and arbitrage opportunities
        </p>
      </div>

      {isLoading ? (
        <ButtonSkeleton className="h-10 w-36" />
      ) : (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-[5px] text-xs font-semibold transition-all border border-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Sync All Feeds
        </button>
      )}
    </div>
  );
}
