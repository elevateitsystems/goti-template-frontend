"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllQuery } from "@/redux/api/userApi";
import { DFSOptimizer } from "./components/DFSOptimizer";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function DFSPage() {
  const searchParams = useSearchParams();
  const sport = searchParams?.get("sport") || "nba";
  const date = searchParams?.get("date") || new Date().toISOString().split("T")[0];

  const {
    data: dfsResponse,
    isLoading,
    error,
  } = useGetAllQuery({
    path: "analysis/dfs-pricing",
    filters: { sport, date },
  });

  const players = useMemo(() => {
    const responseData = dfsResponse?.data;

    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;

    return [];
  }, [dfsResponse]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <CardSkeleton />
        <TableRowSkeleton rows={6} />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-8">Loading DFS optimizer...</div>}>
      <DFSOptimizer initialData={players} hasError={Boolean(error)} />
    </Suspense>
  );
}
