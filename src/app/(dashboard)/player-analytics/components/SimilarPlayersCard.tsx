"use client";

interface SimilarPlayersCardProps {
  data: any[];
  onSelectPlayer?: (playerName: string) => void;
}

export function SimilarPlayersCard({
  data,
  onSelectPlayer,
}: SimilarPlayersCardProps) {
  return (
    <div
      className="card rounded-[5px] p-5 relative overflow-hidden"
      style={{ minHeight: 200 }}
    >
      <h3
        className="font-display text-sm font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Similar Players
      </h3>
      <div className="space-y-2">
        <div
          className="grid grid-cols-5 gap-2 text-xs font-body font-semibold pb-1.5 border-b"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
        >
          <span className="col-span-2">Player</span>
          <span className="text-center">PTS</span>
          <span className="text-center">HR%</span>
          <span className="text-center">Sim</span>
        </div>
        {data.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelectPlayer && onSelectPlayer(p.name)}
            className="grid grid-cols-5 gap-2 text-xs font-body py-1.5 border-b w-full text-left hover:bg-white/5 transition-colors cursor-pointer"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="col-span-2 font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {p.name}
            </span>
            <span
              className="text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              {p.pts}
            </span>
            <span className="text-center text-profit">62%</span>
            <span
              className="text-center font-bold"
              style={{ color: "var(--intel-blue)" }}
            >
              {p.similarity}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
