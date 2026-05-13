// ============================================================
// Odds API Types (mirrors real API response)
// ============================================================
export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface Market {
  key: "h2h" | "spreads" | "totals" | "player_props";
  last_update: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface OddsGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

// ============================================================
// Player Types (SportsData.io Aligned)
// ============================================================
export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  number: number;
  photo: string;
  status: "Active" | "Questionable" | "Out";
}

export interface PlayerSeasonStats {
  PlayerID: number;
  Name: string;
  Team: string;
  Position: string;
  Games: number;
  Points: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  BlockedShots: number;
  Turnovers: number;
  ThreePointersMade: number;
  FieldGoalsAttempted: number;
  Minutes: number;
  UsageRatePercentage: number;
  PRA: number;
  PR: number;
  PA: number;
  DoubleDoubles: number;
  TripleDoubles: number;
  PhotoUrl: string;
}

export interface PlayerGameStats {
  PlayerID: number;
  Name: string;
  Team: string;
  OpponentTeam: string;
  GameDate: string;
  Points: number;
  Rebounds: number;
  Assists: number;
  Steals: number;
  BlockedShots: number;
  Turnovers: number;
  ThreePointersMade: number;
  Minutes: number;
  FieldGoalsAttempted: number;
  FirstHalfPoints?: number;
  FirstQuarterPoints?: number;
}

export interface GameLog {
  game: string;
  date: string;
  pts: number;
  ast: number;
  reb: number;
  threes: number;
  min: number;
  usg: number;
  fga: number;
  cl: number;
}

// ============================================================
// Prop Types
// ============================================================
export type PropCategory =
  | "Points"
  | "Assists"
  | "Rebounds"
  | "PRA"
  | "PR"
  | "PA"
  | "3PM"
  | "Steals"
  | "Blocks"
  | "Turnovers"
  | "Double Double"
  | "Triple Double"
  | "1st Half"
  | "1st Quarter"
  | "Alternate Lines"
  | "Ladder Props";

export interface PropCard {
  id: string;
  playerID: number;
  playerName: string;
  team: string;
  photoUrl: string;
  propCategory: PropCategory;
  line: number;
  projection: number;
  hitRate: number;
  hitFraction: string;
  edge: number;
  confidence: number;
  rating: "A" | "B+" | "B" | "C";
  odds: Record<string, number>;
  bestOdds: number;
  bestBook: string;
}

export interface PlayerProp {
  player: string;
  team: string;
  prop: string;
  line: number;
  stat: string;
  odds: string;
  projection: number;
  confidence: number;
  hitRate: number;
  hitFraction: string;
  positive: boolean;
}

// ============================================================
// Smart Bet Rating
// ============================================================
export interface SmartBetRating {
  projectionVsLine: number;
  hitRateTrend: "up" | "down" | "stable";
  matchupDifficulty: "easy" | "medium" | "hard";
  marketValue: number;
  lineMovementSignal: "sharp" | "public" | "none";
  injuryImpact: "positive" | "negative" | "none";
  finalRating: "A" | "B+" | "B" | "C";
}

// ============================================================
// Edge Feed
// ============================================================
export interface EdgeFeedItem {
  id: string;
  type:
    | "high_ev"
    | "steam_move"
    | "line_movement"
    | "injury";
  title: string;
  description: string;
  timestamp: string;
  relatedPlayer?: string;
  relatedGame?: string;
  urgency: "high" | "medium" | "low";
}

// ============================================================
// Parlay
// ============================================================
export interface ParlayLeg {
  id: string;
  prop: PropCard;
  direction: "over" | "under";
}

export interface Parlay {
  legs: ParlayLeg[];
  combinedProbability: number;
  sportsbookOdds: number;
  trueOdds: number;
  expectedValue: number;
  correlationWarnings: string[];
}

// ============================================================
// Injury
// ============================================================
export interface InjuryReport {
  PlayerID: number;
  playerName: string;
  team: string;
  status: "Out" | "Doubtful" | "Questionable" | "Probable" | "Active";
  injury: string;
  impactLevel: "Critical" | "High" | "Medium" | "Low";
  affectedProps: string[];
  usageShift: number;
  minutesShift: number;
}

// ============================================================
// CLV Tracker
// ============================================================
export interface CLVRecord {
  betId: string;
  playerName: string;
  prop: string;
  yourLine: number;
  closingLine: number;
  clvPercentage: number;
  result: "win" | "loss" | "push";
  date: string;
}

// ============================================================
// DFS
// ============================================================
export interface DFSValuePlay {
  playerName: string;
  team: string;
  position: string;
  stat: string;
  projection: number;
  dkPrice: number;
  fdPrice: number;
  valueScore: number;
}

// ============================================================
// Portfolio / KPI
// ============================================================
export interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  key: string;
}

// ============================================================
// Admin
// ============================================================
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Institutional";
  status: "Active" | "Suspended";
  joined: string;
  revenue: string;
}

// ============================================================
// Line Movement
// ============================================================
export interface LinePoint {
  time: string;
  odds: number;
  prob: number;
}

// ============================================================
// Navigation
// ============================================================
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  premium?: boolean;
}

// ============================================================
// Matchup / Defense
// ============================================================
export interface MatchupData {
  opponentTeam: string;
  defRankVsPosition: number;
  pointsAllowed: number;
  reboundsAllowed: number;
  assistsAllowed: number;
  threePtDefense: number;
  pace: number;
  defEfficiency: number;
  difficulty: "easy" | "medium" | "hard";
}

// ============================================================
// Correlation
// ============================================================
export interface PlayerCorrelation {
  playerA: string;
  playerB: string;
  statA: string;
  statB: string;
  correlation: number;
  sampleSize: number;
}
