"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { glossary } from "@/data/mockData";

interface StatTooltipProps {
  stat: string;
  children: React.ReactNode;
}

export function StatTooltip({ stat, children }: StatTooltipProps) {
  const [show, setShow] = useState(false);
  const definition = glossary[stat];
  if (!definition) return <>{children}</>;

  return (
    <span className="relative inline-flex items-center gap-0.5 group">
      {children}
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="inline-flex"
      >
        <HelpCircle
          className="h-3 w-3 opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: "var(--intel-blue)" }}
        />
      </button>
      {show && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 rounded-[5px] p-2.5 text-xs font-body shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <p
            className="font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {stat}
          </p>
          <p className="leading-relaxed">{definition}</p>
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1"
            style={{
              backgroundColor: "var(--bg-card)",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          />
        </div>
      )}
    </span>
  );
}
