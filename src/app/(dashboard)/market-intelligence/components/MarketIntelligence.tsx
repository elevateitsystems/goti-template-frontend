"use client";
import { Activity } from "lucide-react";
import {
  volatilityHeatmap,
  capitalMomentumData,
  marketTimingSignals,
} from "@/data/mockData";
import { MarketTimingSignals } from "./MarketTimingSignals";
import { VolatilityHeatmap } from "./VolatilityHeatmap";
import { CapitalMomentumChartCard } from "./CapitalMomentumChartCard";
import { MarketActivityPulse } from "./MarketActivityPulse";
import { MarketTrapDetector } from "./MarketTrapDetector";

export function MarketIntelligence() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-[5px] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--intel-blue), #2563eb)",
              }}
            >
              <Activity className="h-4 w-4 text-white" />
            </div>
            <h1
              className="font-display text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Market Trap Detector
            </h1>
          </div>
          <p
            className="text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Volatility heatmap • Capital momentum • Trap detection
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold"
          style={{
            backgroundColor: "var(--emerald-light)",
            color: "var(--emerald)",
          }}
        >
          <Activity className="h-3 w-3 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Feature #10: Market Trap Detector */}
      <MarketTrapDetector />

      <MarketTimingSignals signals={marketTimingSignals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolatilityHeatmap data={volatilityHeatmap} />
        <CapitalMomentumChartCard data={capitalMomentumData} />
      </div>

      <MarketActivityPulse />
    </div>
  );
}
