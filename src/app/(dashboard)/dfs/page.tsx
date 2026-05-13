import { DFSOptimizer } from "./components/DFSOptimizer";
import { Suspense } from "react";

export default async function DFSPage({
  searchParams,
}: {
  searchParams: { sport?: string; date?: string };
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://goti-templates-backend.onrender.com";
  const sport = searchParams?.sport || "nba";
  // Default to a specific date or today if not provided
  // const date = searchParams?.date || "2026-03-29";
  const date = searchParams?.date || new Date().toISOString().split("T")[0];

  const res = await fetch(
    `${baseUrl}/players/top-plays?sport=${sport}&date=${date}`,
    {
      cache: "no-store",
    },
  );

  const json = res.ok ? await res.json() : { data: [] };
  const players = json.data || [];

  return (
    <Suspense fallback={<div className="p-8">Loading DFS optimizer...</div>}>
      <DFSOptimizer initialData={players} />
    </Suspense>
  );
}
