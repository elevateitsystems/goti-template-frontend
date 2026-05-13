import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
}

export function Skeleton({ className, height, width }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-[5px]", className)}
      style={{ height: height || "1rem", width: width || "100%" }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card rounded-[5px] p-5 space-y-3">
      <Skeleton height={16} width="60%" />
      <Skeleton height={32} width="40%" />
      <Skeleton height={120} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton height={14} width={i === 0 ? "80%" : "60%"} />
        </td>
      ))}
    </tr>
  );
}
