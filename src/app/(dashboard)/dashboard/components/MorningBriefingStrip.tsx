"use client";
import { Coffee } from "lucide-react";

interface MorningBriefingStripProps {
  cards: any[];
}

export function MorningBriefingStrip({ cards }: MorningBriefingStripProps) {
  return (
    <div className="card rounded-[5px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Coffee className="h-3.5 w-3.5" style={{ color: "var(--gold)" }} />
        <h2
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Morning Market Briefing
        </h2>
        <span
          className="ml-auto text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          Today's top picks
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isStrongBuy = card.signal === "Strong Buy";
          const isFade = card.signal === "Fade";
          const accentColor = isStrongBuy
            ? "var(--emerald)"
            : isFade
              ? "var(--coral)"
              : "var(--intel-blue)";
          const accentBg = isStrongBuy
            ? "var(--emerald-light)"
            : isFade
              ? "var(--coral-light)"
              : "var(--intel-blue-light)";
          return (
            <div
              key={card.id}
              className="rounded-[5px] p-3"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: `1px solid var(--border)`,
                borderLeft: `3px solid ${accentColor}`,
              }}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <p
                  className="text-xs font-semibold font-body leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.title}
                </p>
                <span
                  className="badge text-[8px] shrink-0"
                  style={{ backgroundColor: accentBg, color: accentColor }}
                >
                  {card.signal === "Strong Buy"
                    ? "⬆ BUY"
                    : card.signal === "Fade"
                      ? "↓ FADE"
                      : "↑ BUY"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold font-body"
                  style={{
                    color: card.odds.startsWith("+")
                      ? "var(--emerald)"
                      : "var(--coral)",
                  }}
                >
                  {card.odds}
                </span>
                <span
                  className="text-[11px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  {card.book}
                </span>
                <span
                  className="ml-auto text-[10px] font-semibold font-body"
                  style={{ color: "var(--emerald)" }}
                >
                  EV {card.ev}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
