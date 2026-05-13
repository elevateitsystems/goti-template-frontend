"use client";
import { formatOdds } from "@/lib/utils";

interface SportsbookOddsTableProps {
  bookmakers: any[];
  h2hMarket: (book: any) => any;
  spreadMarket: (book: any) => any;
  totalMarket: (book: any) => any;
}

export function SportsbookOddsTable({
  bookmakers,
  h2hMarket,
  spreadMarket,
  totalMarket,
}: SportsbookOddsTableProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Current Sportsbook Odds
        </h2>
        <span
          className="text-xs font-body px-3 py-1 rounded-full"
          style={{
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-muted)",
          }}
        >
          LAL vs BOS · Tonight 7:30 PM ET
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Sportsbook
              </th>
              <th
                className="text-center py-3 px-4 font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Home ML
              </th>
              <th
                className="text-center py-3 px-4 font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Away ML
              </th>
              <th
                className="text-center py-3 px-4 font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Spread
              </th>
              <th
                className="text-center py-3 px-4 font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {bookmakers.map((bk) => {
              const h2h = h2hMarket(bk);
              const spread = spreadMarket(bk);
              const total = totalMarket(bk);
              return (
                <tr
                  key={bk.key}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    className="py-3 px-4 font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {bk.title}
                  </td>
                  <td
                    className="py-3 px-4 text-center font-bold"
                    style={{
                      color:
                        h2h?.outcomes[0]?.price && h2h.outcomes[0].price > 0
                          ? "var(--emerald)"
                          : "var(--coral)",
                    }}
                  >
                    {h2h ? formatOdds(h2h.outcomes[0].price) : "—"}
                  </td>
                  <td
                    className="py-3 px-4 text-center font-bold"
                    style={{
                      color:
                        h2h?.outcomes[1]?.price && h2h.outcomes[1].price > 0
                          ? "var(--emerald)"
                          : "var(--coral)",
                    }}
                  >
                    {h2h ? formatOdds(h2h.outcomes[1].price) : "—"}
                  </td>
                  <td
                    className="py-3 px-4 text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {spread
                      ? `${spread.outcomes[0].point} (${formatOdds(spread.outcomes[0].price)})`
                      : "—"}
                  </td>
                  <td
                    className="py-3 px-4 text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {total
                      ? `O${total.outcomes[0].point} (${formatOdds(total.outcomes[0].price)})`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
