import type { EdgeFeedItem } from "@/types";

// ============================================================
// EDGE FEED DATA
// Source: Synthesized from Sportsdata.io NBA Live Odds API and NBA Line Movement data
// ============================================================

export const nbaEdgeFeed: EdgeFeedItem[] = [
  {
    id: "ef-1",
    type: "high_ev",
    title: "High EV Prop: Nikola Jokic Over 11.5 Rebounds",
    description:
      "Edge +7.4%, Hit Rate 64%. BetMGM offering -105, model projects 12.8. Favorable matchup vs BOS who allow 5th most rebounds to centers.",
    timestamp: "2 min ago",
    relatedPlayer: "Nikola Jokic",
    relatedGame: "DEN vs BOS",
    urgency: "high",
  },
  {
    id: "ef-2",
    type: "steam_move",
    title: "Steam Move: Nuggets -3 moved to -4.5",
    description:
      "Synchronized line movement across FanDuel, DraftKings, and BetMGM within 12 minutes. Aggressive early action.",
    timestamp: "5 min ago",
    relatedGame: "DEN vs BOS",
    urgency: "high",
  },
  {
    id: "ef-3",
    type: "line_movement",
    title: "Line Shift: Lakers spread drifted from +3.5 to +4.5",
    description:
      "Lakers are catching an extra point before tipoff. Value might be opening up if you lean towards LAL.",
    timestamp: "8 min ago",
    relatedGame: "LAL vs BOS",
    urgency: "medium",
  },
  {
    id: "ef-4",
    type: "injury",
    title: "Injury Alert: Luka Doncic listed Questionable (knee)",
    description:
      "DAL spread moved from -1.5 to +2.5. Doncic's absence projects +8.2% usage boost for Kyrie Irving. Monitor Irving props.",
    timestamp: "18 min ago",
    relatedPlayer: "Luka Doncic",
    relatedGame: "DAL vs MIN",
    urgency: "high",
  },
  {
    id: "ef-5",
    type: "high_ev",
    title: "High EV Prop: SGA Over 30.5 Points",
    description:
      "Edge +8.2%, Hit Rate 68%. SGA averaging 34.8 PPG in last 5 games vs teams ranked 20th+ in defense. Model loves this spot.",
    timestamp: "22 min ago",
    relatedPlayer: "Shai Gilgeous-Alexander",
    relatedGame: "OKC vs PHI",
    urgency: "high",
  },
  {
    id: "ef-6",
    type: "steam_move",
    title: "Steam Move: Celtics -6.5 to -7.5 in 30 minutes",
    description:
      "Aggressive line movement on BOS spread. Three sharp books moved simultaneously.",
    timestamp: "28 min ago",
    relatedGame: "BOS vs CLE",
    urgency: "medium",
  },
  {
    id: "ef-7",
    type: "line_movement",
    title: "Total Dropping: Under 224.5 in LAL vs BOS",
    description:
      "Total pushed down from 226 to 224.5 across all major books. Both teams playing on back-to-back with slower pace expected.",
    timestamp: "42 min ago",
    relatedGame: "LAL vs BOS",
    urgency: "low",
  },
  {
    id: "ef-8",
    type: "injury",
    title: "Injury Update: Joel Embiid upgraded to Probable",
    description:
      "Embiid was Questionable earlier. Now Probable for tonight. PHI spread moved from +4.5 to +2.5. Re-evaluate Embiid props upward.",
    timestamp: "52 min ago",
    relatedPlayer: "Joel Embiid",
    relatedGame: "PHI vs OKC",
    urgency: "medium",
  },
  {
    id: "ef-9",
    type: "high_ev",
    title: "High EV Prop: Anthony Edwards Over 2.5 Threes",
    description:
      "Edge +7.8%, Hit Rate 68%. Edwards shooting 42% from three in last 10 games. DAL allows 4th most threes to SGs.",
    timestamp: "58 min ago",
    relatedPlayer: "Anthony Edwards",
    relatedGame: "MIN vs DAL",
    urgency: "medium",
  },
  {
    id: "ef-10",
    type: "steam_move",
    title: "Steam Move: PHX -2.5 moving to -4 across books",
    description:
      "Coordinated movement at 3 sharp books in 8-minute window. KD and Booker both probable.",
    timestamp: "1 hr ago",
    relatedGame: "PHX vs MIA",
    urgency: "low",
  },
  {
    id: "ef-11",
    type: "high_ev",
    title: "High EV: Bam Adebayo Over 9.5 Rebounds",
    description:
      "Edge +7.2%, Hit Rate 64%. PHX allows most rebounds to opposing centers. Adebayo averaging 12.1 boards in last 5 vs PHX.",
    timestamp: "1 hr ago",
    relatedPlayer: "Bam Adebayo",
    relatedGame: "MIA vs PHX",
    urgency: "medium",
  },
];
