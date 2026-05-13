"use client";

interface PlayerPropLinesProps {
  props: any[];
}

export function PlayerPropLines({ props }: PlayerPropLinesProps) {
  return (
    <div className="card rounded-[5px] p-5">
      <h3
        className="font-display text-sm font-semibold mb-3 uppercase tracking-wider"
        style={{ color: "var(--text-primary)" }}
      >
        Hit Rate & Confidence
      </h3>
      <div className="space-y-2">
        {props?.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 rounded-[5px]"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-body font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {p.prop}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[10px] font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  Proj: {p.projection}
                </span>
                <span
                  className="text-[10px] font-body px-1.5 py-0.5 rounded-[5px]"
                  style={{
                    backgroundColor: p.positive
                      ? "var(--emerald-light)"
                      : "var(--coral-light)",
                    color: p.positive ? "var(--emerald)" : "var(--coral)",
                  }}
                >
                  {p.confidence}% conf
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-sm font-body font-bold"
                style={{
                  color: p.positive ? "var(--emerald)" : "var(--coral)",
                }}
              >
                {p.odds}
              </p>
              <p
                className="text-[10px] font-body"
                style={{
                  color: p.hitRate >= 50 ? "var(--emerald)" : "var(--coral)",
                }}
              >
                {p.hitRate}% HR
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
