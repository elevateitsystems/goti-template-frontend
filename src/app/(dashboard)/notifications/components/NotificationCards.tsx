import { EdgeAlert, EvItem, ArbitrageItem } from "./types";

function formatBookmakers(bookmakers: string[]) {
  return bookmakers.length > 0 ? bookmakers.join(", ") : "Unknown book";
}

export function EdgeCard({ edge }: { edge: EdgeAlert }) {
  return (
    <div className="card rounded-[5px] p-4 border border-white/5 bg-[#171921] hover:border-red-500/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-white text-sm">{edge.outcome}</h4>
          <p className="text-[11px] uppercase tracking-[0.1em] text-gray-500 mt-1">{edge.market}</p>
        </div>
        <span className="badge px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
          {edge.sourceType?.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{formatBookmakers(edge.bookmakers)}</p>
      <div className="mt-3 pt-2.5 border-t border-white/5 text-xs text-gray-400 flex flex-col gap-2">
        <span>{edge.sport.toUpperCase()} • {edge.leagueId}</span>
        <span>
          {edge.evBet ? `${edge.evBet.odds} | EV ${edge.evBet.evPct.toFixed(2)}%` : "No EV data"}
        </span>
      </div>
    </div>
  );
}

export function EvCard({ item }: { item: EvItem }) {
  return (
    <div className="card rounded-[5px] p-4 border border-white/5 bg-[#171921] hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-white text-sm">{item.outcome}</h4>
          <p className="text-[11px] uppercase tracking-[0.1em] text-gray-500 mt-1">{item.market}</p>
        </div>
        <span className="badge px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
          {item.sourceType?.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{formatBookmakers(item.bookmakers)}</p>
      <div className="mt-3 pt-2.5 border-t border-white/5 text-xs text-gray-400 flex flex-col gap-2">
        <span>{item.sport.toUpperCase()} • {item.sourceRegion}</span>
        <span>{item.evBet ? `${item.evBet.odds} | EV ${item.evBet.evPct.toFixed(2)}%` : "No EV details"}</span>
      </div>
    </div>
  );
}

export function ArbitrageCard({ item }: { item: ArbitrageItem }) {
  return (
    <div className="card rounded-[5px] p-4 border border-white/5 bg-[#171921] hover:border-amber-500/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-white text-sm">{item.outcome}</h4>
          <p className="text-[11px] uppercase tracking-[0.1em] text-gray-500 mt-1">{item.market}</p>
        </div>
        <span className="badge px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-400">
          Arb
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-3">
        <p>{item.description}</p>
        <p className="mt-2">{formatBookmakers(item.bookmakers)}</p>
      </div>
      <div className="space-y-2 text-xs font-mono text-white bg-[#1a1c24] rounded-[5px] p-3">
        {item.arbitrage.books.map((book) => (
          <div key={book.bookmakerId} className="flex justify-between gap-3">
            <span>{book.bookmaker}</span>
            <span>{book.odds > 0 ? `+${book.odds}` : book.odds}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-2 flex justify-between text-[11px] text-gray-400">
          <span>Profit</span>
          <span>{item.arbitrage.profitPct.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
