import { PropExplorer } from "./components/PropExplorer";
import { URL } from "@/lib/constants";

async function getSeasonStats() {
  const baseUrl = URL.api;
  const res = await fetch(
    `${baseUrl}/players/season-stats?season=2026`,
    //   {
    //   next: { revalidate: 3600 },
    // }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function PropExplorerPage() {
  const players = await getSeasonStats();
  return <PropExplorer initialPlayers={players?.data || []} />;
}
