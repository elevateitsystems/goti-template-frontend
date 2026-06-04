import { CardSkeleton } from "@/components/ui/Skeleton";

export function NotificationsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
