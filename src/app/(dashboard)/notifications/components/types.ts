export interface EdgeApiResponse<T> {
  success: boolean;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
  };
  data: {
    success: boolean;
    data: T;
  };
}

export interface EdgeBet {
  bookmaker: string;
  bookmakerId: string;
  sourceType: string;
  sourceRegion: string;
  outcome: string;
  selection: string;
  odds: number;
  ev: number;
  evPct: number;
}

export interface EdgeEntry {
  edgeId: string;
  type: string;
  sourceType: string;
  sourceRegion: string;
  market: string;
  outcome: string;
  bookmakers: string[];
  evBet?: EdgeBet;
  description?: string;
  point?: number;
}

export interface EdgeAlert extends EdgeEntry {
  eventId: string;
  leagueId: string;
  sport: string;
  calculatedAt: string;
}

export interface EdgeEvent {
  eventId: string;
  leagueId: string;
  sport: string;
  calculatedAt: string;
  edges: EdgeEntry[];
}

export interface EvItem {
  eventId: string;
  leagueId: string;
  sport: string;
  calculatedAt: string;
  edgeId: string;
  type: string;
  sourceType: string;
  sourceRegion: string;
  market: string;
  outcome: string;
  bookmakers: string[];
  evBet: EdgeBet;
}

export interface ArbitrageBook {
  bookmaker: string;
  bookmakerId: string;
  sourceType: string;
  sourceRegion: string;
  outcome: string;
  selection: string;
  description: string;
  point: number;
  odds: number;
  stake: number;
}

export interface ArbitrageItem {
  eventId: string;
  leagueId: string;
  sport: string;
  calculatedAt: string;
  edgeId: string;
  type: string;
  venueType: string;
  market: string;
  outcome: string;
  description: string;
  point: number;
  bookmakers: string[];
  arbitrage: {
    books: ArbitrageBook[];
    totalStake: number;
    guaranteedProfit: number;
    profitPct: number;
  };
}
