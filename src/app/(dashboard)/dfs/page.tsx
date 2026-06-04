import { Suspense } from "react";
import { DFSOptimizer } from "./components/DFSOptimizer";

export default async function DFSPage({
  searchParams,
}: {
  searchParams: { sport?: string; date?: string };
}) {
  const baseUrl = "https://gotitemplatesbackend-moneylineapp.onrender.com";
  const sport = searchParams?.sport || "nba";
  const date = searchParams?.date || new Date().toISOString().split("T")[0];

  let players: any[] = [];
  let hasError = false;

  try {
    const res = await fetch(
      `${baseUrl}/api/analysis/dfs-pricing?sport=${sport}&date=${date}`,
      {
        cache: "no-store",
      },
    );

    hasError = !res.ok;
    if (res.ok) {
      players = (await res.json()) || [];
    }
  } catch (err) {
    hasError = true;
  }

  return (
    <Suspense fallback={<div className="p-8">Loading DFS optimizer...</div>}>
      <DFSOptimizer initialData={players} hasError={hasError} />
    </Suspense>
  );
}
