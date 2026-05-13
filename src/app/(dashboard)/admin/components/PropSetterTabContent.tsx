"use client";

interface PropSetterTabContentProps {
  propPlayer: string;
  setPropPlayer: (v: string) => void;
  propStat: string;
  setPropStat: (v: string) => void;
  propLine: string;
  setPropLine: (v: string) => void;
}

export function PropSetterTabContent({
  propPlayer,
  setPropPlayer,
  propStat,
  setPropStat,
  propLine,
  setPropLine,
}: PropSetterTabContentProps) {
  return (
    <div className="max-w-lg space-y-5">
      <div className="card rounded-[5px] p-6 space-y-4">
        <h3
          className="font-display text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Set Today&apos;s Prop of the Day
        </h3>
        <div className="gold-divider" />

        {[
          {
            label: "Player Name",
            value: propPlayer,
            onChange: setPropPlayer,
            placeholder: "e.g. LeBron James",
          },
          {
            label: "Stat Type",
            value: propStat,
            onChange: setPropStat,
            placeholder: "e.g. Points",
          },
          {
            label: "Line",
            value: propLine,
            onChange: setPropLine,
            placeholder: "e.g. 29.5",
          },
        ].map((field, i) => (
          <div key={i} className="space-y-1.5">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {field.label}
            </label>
            <input
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        ))}

        <div
          className="p-4 rounded-[5px]"
          style={{
            backgroundColor: "var(--emerald-light)",
            border: "1px solid var(--emerald)",
          }}
        >
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-primary)" }}
          >
            Preview: <strong>{propPlayer}</strong> Over {propLine} {propStat}
          </p>
        </div>

        <button
          className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--emerald)" }}
        >
          Publish Prop of the Day
        </button>
      </div>
    </div>
  );
}
