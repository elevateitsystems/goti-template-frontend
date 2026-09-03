import {
  Activity,
  BarChart3,
  Boxes,
  CircleDollarSign,
  Crosshair,
  DatabaseZap,
  Lightbulb,
  Orbit,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PrimeIQLogo } from "@/components/brand/PrimeIQLogo";

const inputSignals: Array<{ label: string; color: string; icon: LucideIcon }> = [
  { label: "Probability", color: "#e865d8", icon: Orbit },
  { label: "Historical Context", color: "#00d7dc", icon: BarChart3 },
  { label: "Player Signals", color: "#00d6a9", icon: Activity },
  { label: "Market & Line Data", color: "#8bdd0a", icon: DatabaseZap },
  { label: "Public & Sharp Money", color: "#f4a500", icon: CircleDollarSign },
];

const outputSignals: Array<{ label: string; color: string; icon: LucideIcon }> = [
  { label: "Contextual", color: "#91e600", icon: Boxes },
  { label: "Clear", color: "#f3a000", icon: Lightbulb },
  { label: "Actionable", color: "#ff7900", icon: Share2 },
  { label: "Edge-Driven", color: "#ff163f", icon: Crosshair },
];

const connectorColors = ["#e865d8", "#00d7dc", "#00d6a9", "#8bdd0a", "#f4a500"];

export function EdgeInterpretation() {
  return (
    <section
      id="core-pillers"
      className="relative overflow-hidden border-b border-white/[0.05] bg-[#010208] px-5 py-24 text-white md:px-8 md:py-28 lg:px-10 lg:py-32"
    >
      {/* Premium gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(18,44,81,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010208] via-transparent to-transparent opacity-50" />

      <div className="relative mx-auto max-w-[1120px]">
        <header className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#62ed31]/20 bg-[#62ed31]/5 px-4 py-1.5">
           
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#62ed31] sm:text-[10px]">
              The Prime Intelligence Network
            </p>
          </div>
          
          <h2 className="mt-6 text-[36px] font-bold leading-[1.08] tracking-[-0.05em] text-[#f2f2f3] sm:text-[46px] lg:text-[52px]">
            Interpretation is the <span className="bg-gradient-to-r from-[#62ed31] to-[#a8ff5e] bg-clip-text text-transparent">advantage.</span>
          </h2>
          <p className="mt-4 max-w-[500px] mx-auto text-[13px] font-light text-[#9b9da5] sm:text-[14px]">
            PrimeIQ helps you see it clearly—so you can act smarter.
          </p>
        </header>

        <div className="relative mt-14 lg:mt-16">
          <ConnectorField />

          <div className="relative z-10 grid gap-10 md:grid-cols-[240px_minmax(280px,1fr)_215px] md:items-center md:gap-6 lg:grid-cols-[260px_minmax(340px,1fr)_235px] lg:gap-10">
            <SignalCard items={inputSignals} side="left" />

            <div className="order-first flex min-h-[300px] flex-col items-center justify-center md:order-none md:min-h-[360px]">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.08em] text-[#dedee1] lg:text-[12px]">
                How PrimeIQ gives you edge
              </p>
              <div className="relative">
                <div className="absolute inset-[-40px] blur-3xl opacity-20 bg-gradient-to-r from-[#62ed31] via-[#1766ff] to-[#ff159d]" />
                <PrimeIQCore />
              </div>
              <p className="mt-6 text-center text-[12px] font-light text-[#d0d1d5] sm:text-[13px]">
                Clear insight. Smarter wagers. <span className="text-[#62ed31]">Real edge.</span>
              </p>
            </div>

            <SignalCard items={outputSignals} side="right" />
          </div>
        </div>

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[#62ed31]/20 to-transparent" />
      </div>
    </section>
  );
}

function SignalCard({ items, side }: { items: Array<{ label: string; color: string; icon: LucideIcon }>; side?: "left" | "right" }) {
  return (
    <div className="group relative overflow-hidden rounded-[3px] border border-[#172038] bg-[#02050b]/80 shadow-[0_18px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-[#62ed31]/20 hover:shadow-[0_25px_70px_rgba(98,237,49,0.05)]">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none bg-gradient-to-b from-[#62ed31]/5 to-transparent" />
      
      {/* Side label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#010208] px-3 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-[#62ed31] border border-[#172038]">
        {side === "left" ? "Inputs" : "Outputs"}
      </div>
      
      {items.map(({ label, color, icon: Icon }, index) => (
        <div
          key={label}
          className={`group/item relative flex h-[62px] items-center gap-3 px-5 text-[12px] font-medium text-[#d4d5d8] transition-all duration-300 hover:bg-[#62ed31]/5 hover:pl-6 lg:h-[68px] lg:px-6 lg:text-[13px] ${
            index ? "border-t border-[#172038]" : ""
          }`}
        >
          {/* Hover indicator line */}
          <div className="absolute left-0 top-0 h-full w-0.5 bg-[#62ed31] opacity-0 transition-all duration-300 group-hover/item:opacity-100" />
          
          <Icon 
            aria-hidden="true" 
            className="h-5 w-5 shrink-0 stroke-[1.8] transition-all duration-300 group-hover/item:scale-110 lg:h-[22px] lg:w-[22px]" 
            style={{ color }} 
          />
          <span className="transition-colors duration-300 group-hover/item:text-[#f0f0f2]">{label}</span>
          
          {/* Color dot indicator */}
          <span 
            className="ml-auto h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover/item:scale-150 group-hover/item:shadow-[0_0_12px_color]" 
            style={{ backgroundColor: color, boxShadow: `0 0 0px ${color}00` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 12px ${color}70`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0px ${color}00`;
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ConnectorField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 1000 330"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <filter id="edge-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="edge-line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="edge-core-glow">
          <stop stopColor="#625cff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#151837" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="edge-core-pulse">
          <stop stopColor="#62ed31" stopOpacity="0.15" />
          <stop offset="1" stopColor="#151837" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Core glow rings */}
      <ellipse cx="500" cy="169" rx="180" ry="155" fill="url(#edge-core-glow)" />
      <ellipse cx="500" cy="169" rx="100" ry="90" fill="url(#edge-core-pulse)" className="animate-pulse" />

      {/* Input connector lines */}
      {connectorColors.map((color, index) => {
        const startY = 31 + index * 66;
        return (
          <g key={color}>
            <path
              d={`M230 ${startY} C335 ${startY}, 389 ${169 + (startY - 169) * 0.3}, 455 169`}
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              filter="url(#edge-line-glow)"
            />
            <circle cx="245" cy={startY} r="2.5" fill={color} filter="url(#edge-dot-glow)" />
            <circle cx={315 + index * 8} cy={startY + (169 - startY) * 0.14} r="1.5" fill={color} opacity="0.7" />
          </g>
        );
      })}

      {/* Output connector lines */}
      {outputSignals.map((signal, index) => {
        const endY = 41 + index * 82.5;
        return (
          <g key={signal.label}>
            <path
              d={`M545 169 C620 ${169 + (endY - 169) * 0.28}, 662 ${endY}, 780 ${endY}`}
              stroke={signal.color}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              filter="url(#edge-line-glow)"
            />
            <circle cx="752" cy={endY} r="2.5" fill={signal.color} filter="url(#edge-dot-glow)" />
          </g>
        );
      })}
    </svg>
  );
}

function PrimeIQCore() {
  return (
    <div className="group relative flex h-[190px] w-[190px] items-center justify-center transition-transform duration-700 hover:scale-105 lg:h-[210px] lg:w-[210px]">
      {/* Animated ring */}
      <div className="absolute inset-0 rounded-full border border-[#62ed31]/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-[10px] rounded-full border border-dashed border-[#8e7caa]/40 animate-[spin_15s_linear_infinite_reverse]" />
      <div className="absolute inset-[25px] rounded-full border border-[#b99b60]/30 animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-[40px] rounded-full border border-dotted border-[#627091]/30 animate-[spin_8s_linear_infinite_reverse]" />
      
      {/* Glowing dots */}
      <span className="absolute left-[5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#00dfd0] shadow-[0_0_15px_#00dfd0] animate-pulse" />
      <span className="absolute right-[18px] top-[20px] h-2 w-2 rounded-full bg-[#9bea11] shadow-[0_0_15px_#9bea11] animate-pulse [animation-delay:0.5s]" />
      <span className="absolute bottom-[12px] right-[45px] h-2 w-2 rounded-full bg-[#ff8b00] shadow-[0_0_15px_#ff8b00] animate-pulse [animation-delay:1s]" />
      <span className="absolute left-[30px] bottom-[20px] h-1.5 w-1.5 rounded-full bg-[#ff159d] shadow-[0_0_15px_#ff159d] animate-pulse [animation-delay:1.5s]" />
      <span className="absolute right-[30px] top-[55px] h-1.5 w-1.5 rounded-full bg-[#1766ff] shadow-[0_0_15px_#1766ff] animate-pulse [animation-delay:0.8s]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <PrimeIQLogo variant="icon" className="h-32 w-auto lg:h-36" />
        </div>
      </div>
    </div>
  );
}
