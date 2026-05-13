"use client";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
} from "lucide-react";
import type { InjuryReport } from "@/types";

interface InjuryImpactPanelProps {
  injuries: InjuryReport[];
}

const statusConfig: Record<
  InjuryReport["status"],
  { color: string; bg: string }
> = {
  Out: { color: "var(--coral)", bg: "var(--coral-light)" },
  Doubtful: { color: "var(--coral)", bg: "var(--coral-light)" },
  Questionable: { color: "var(--gold)", bg: "var(--gold-light)" },
  Probable: { color: "var(--intel-blue)", bg: "var(--intel-blue-light)" },
  Active: { color: "var(--emerald)", bg: "var(--emerald-light)" },
};

const impactConfig: Record<
  InjuryReport["impactLevel"],
  { color: string; bg: string }
> = {
  Critical: { color: "var(--coral)", bg: "var(--coral-light)" },
  High: { color: "var(--coral)", bg: "var(--coral-light)" },
  Medium: { color: "var(--gold)", bg: "var(--gold-light)" },
  Low: { color: "var(--emerald)", bg: "var(--emerald-light)" },
};

export function InjuryImpactPanel({ injuries }: InjuryImpactPanelProps) {
  const activeInjuries = injuries.filter((i) => i.status !== "Active");

  if (activeInjuries.length === 0) return null;

  return (
    <div className="card rounded-[5px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4" style={{ color: "var(--coral)" }} />
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Injury Impact Engine
        </h3>
        <span
          className="badge text-[9px]"
          style={{
            backgroundColor: "var(--coral-light)",
            color: "var(--coral)",
          }}
        >
          {activeInjuries.length} ALERT{activeInjuries.length !== 1 ? "S" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {activeInjuries.map((injury) => {
          const status = statusConfig[injury.status];
          const impact = impactConfig[injury.impactLevel];
          return (
            <div
              key={injury.PlayerID}
              className="rounded-[5px] p-3"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: `1px solid ${injury.impactLevel === "Critical" ? "rgba(255,77,109,0.3)" : "var(--border)"}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-body font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {injury.playerName}
                  </span>
                  <span
                    className="text-[10px] font-body px-1.5 py-0.5 rounded-[5px]"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {injury.team}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="badge text-[9px]"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {injury.status}
                  </span>
                  <span
                    className="badge text-[9px]"
                    style={{ backgroundColor: impact.bg, color: impact.color }}
                  >
                    {injury.impactLevel}
                  </span>
                </div>
              </div>

              {/* Injury Details */}
              {injury.injury && (
                <p
                  className="text-[11px] font-body mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Injury:{" "}
                  <span style={{ color: "var(--coral)" }}>{injury.injury}</span>
                </p>
              )}

              {/* Projection Shifts */}
              {(injury.usageShift !== 0 || injury.minutesShift !== 0) && (
                <div className="flex gap-3 mb-2">
                  {injury.usageShift !== 0 && (
                    <div
                      className="flex items-center gap-1 text-[10px] font-body px-2 py-1 rounded-[5px]"
                      style={{ backgroundColor: "var(--emerald-light)" }}
                    >
                      <TrendingUp
                        className="h-3 w-3"
                        style={{ color: "var(--emerald)" }}
                      />
                      <span style={{ color: "var(--emerald)" }}>
                        +{injury.usageShift}% USG shift
                      </span>
                    </div>
                  )}
                  {injury.minutesShift !== 0 && (
                    <div
                      className="flex items-center gap-1 text-[10px] font-body px-2 py-1 rounded-[5px]"
                      style={{
                        backgroundColor:
                          injury.minutesShift > 0
                            ? "var(--emerald-light)"
                            : "var(--coral-light)",
                      }}
                    >
                      {injury.minutesShift > 0 ? (
                        <TrendingUp
                          className="h-3 w-3"
                          style={{ color: "var(--emerald)" }}
                        />
                      ) : (
                        <TrendingDown
                          className="h-3 w-3"
                          style={{ color: "var(--coral)" }}
                        />
                      )}
                      <span
                        style={{
                          color:
                            injury.minutesShift > 0
                              ? "var(--emerald)"
                              : "var(--coral)",
                        }}
                      >
                        {injury.minutesShift > 0 ? "+" : ""}
                        {injury.minutesShift} MIN proj
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Affected Props */}
              {injury.affectedProps.length > 0 && (
                <div>
                  <p
                    className="text-[9px] font-body font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    AFFECTED PROPS
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {injury.affectedProps.map((prop) => (
                      <span
                        key={prop}
                        className="badge text-[9px]"
                        style={{
                          backgroundColor: "var(--gold-light)",
                          color: "var(--gold)",
                        }}
                      >
                        <Zap className="h-2.5 w-2.5 inline mr-0.5" />
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
