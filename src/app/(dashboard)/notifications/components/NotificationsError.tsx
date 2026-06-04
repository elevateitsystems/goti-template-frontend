import { AlertCircle, RefreshCw } from "lucide-react";
import { ButtonSkeleton } from "@/components/ui/Skeleton";

interface NotificationsErrorProps {
  isLoading: boolean;
  onRetry: () => void;
}

export function NotificationsError({ isLoading, onRetry }: NotificationsErrorProps) {
  return (
    <div className="card rounded-[5px] p-12 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto mt-10">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <div>
        <h4 className="text-sm font-bold text-white">Oops! Something Went Wrong</h4>
        <p className="text-xs text-gray-400 mt-1">
          We couldn't complete your request at the moment. Please reload the page and try again.
        </p>
      </div>

      {isLoading ? (
        <ButtonSkeleton className="mx-auto w-36" />
      ) : (
        <button
          onClick={onRetry}
          className="flex items-center justify-center mx-auto px-3 py-2 rounded-[5px] bg-white/10 text-white text-xs font-semibold transition-colors hover:bg-white/15"
        >
          <RefreshCw className="mt-1 w-4 h-4 mr-1" />
          Try Again
        </button>
      )}
    </div>
  );
}
