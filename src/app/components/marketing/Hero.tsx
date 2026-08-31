import { ArrowRight } from "lucide-react";
import Link from "next/link";

const signals = [
  { label: "INJURIES", color: "#de4bff" },
  { label: "FORM", color: "#6a5cff" },
  { label: "PACE", color: "#00d9ff" },
  { label: "MATCHUPS", color: "#00f2cf" },
  { label: "SCHEDULE", color: "#04ec8a" },
  { label: "LINE MOVEMENT", color: "#d6f12b" },
  { label: "MARKET %", color: "#ffe328" },
  { label: "PUBLIC BET %", color: "#ff9d19" },
  { label: "WEATHER", color: "#ff441f" },
  { label: "REST DAYS", color: "#ff254c" },
  { label: "ROSTER", color: "#ef247b" },
  { label: "TEAM NEWS", color: "#c327c7" },
];

const particleStops = [0.16, 0.29, 0.43, 0.57, 0.7, 0.82];

interface HeroProps {
  primaryHref: string;
}

export function Hero({ primaryHref }: HeroProps) {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden border-b border-white/[0.05] bg-[#010208] px-0 pb-16 pt-[104px] text-white md:min-h-[560px] md:pb-0 md:pt-[76px] lg:min-h-[620px]"
    >
      {/* Premium background layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_73%_46%,rgba(12,76,107,0.15),transparent_31%),radial-gradient(circle_at_54%_100%,rgba(19,41,99,0.2),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#010208] via-transparent to-[#010208] opacity-50" />
      
      {/* Animated grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(98,237,49,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(98,237,49,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative mx-auto grid h-full max-w-[1440px] items-center px-4 sm:px-8 md:min-h-[480px] lg:min-h-[540px] lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-12 lg:px-10 xl:gap-16">
        <div className="relative z-10 max-w-[560px] md:pb-5">
          {/* Premium badge */}
          {/* <div className="inline-flex items-center gap-2.5 rounded-full border border-[#62ed31]/20 bg-[#62ed31]/5 px-3.5 py-1.5 mb-6">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#62ed31] shadow-[0_0_12px_#62ed3170]" />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#62ed31] sm:text-[9px]">
              The Intelligence Network
            </span>
          </div> */}

          <h1 className="text-[44px] font-bold leading-[1.06] tracking-[-0.05em] text-[#f5f5f3] sm:text-[52px] lg:text-[60px] xl:text-[68px] 2xl:text-[72px]">
            The game is visible.
            <br />
            <span className="bg-gradient-to-r from-[#62ed31] via-[#a8ff5e] to-[#62ed31] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              The edge isn't.
            </span>
          </h1>

          <p className="mt-5 max-w-[500px] text-[15px] font-light leading-[1.6] text-[#d1d2d4] sm:text-[16px] lg:mt-6 lg:text-[18px]">
            PrimeIQ turns complex sports signals
            <br className="hidden lg:block" /> into clear insight—so you can act
            <br className="hidden lg:block" /> before everyone else.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 lg:mt-10 lg:gap-4">
            <Link
              href={primaryHref}
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-[3px] bg-[#59ed32] px-6 text-[12px] font-bold uppercase tracking-[0.02em] text-[#061004] shadow-[0_0_20px_rgba(89,237,50,0.2)] transition-all duration-300 hover:bg-[#6cff45] hover:shadow-[0_0_35px_rgba(89,237,50,0.35)] hover:scale-[1.03] active:scale-[0.97] sm:px-7 sm:text-[13px]"
            >
              Learn how it works
              <ArrowRight aria-hidden="true" className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#free-play"
              className="group inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 bg-white/[0.015] px-6 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#d9d9dd] transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06] hover:text-white hover:scale-[1.03] active:scale-[0.97] sm:px-7 sm:text-[13px]"
            >
              See it in action
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-8 flex items-center gap-6 border-t border-[#172038] pt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#010208] bg-gradient-to-br from-[#172038] to-[#010208] flex items-center justify-center text-[8px] font-bold text-[#62ed31]"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-light text-[#a7a9b0] sm:text-[11px]">
              Trusted by <span className="font-bold text-white">2,400+</span> analysts
            </p>
          </div>
        </div>

        <SignalConvergenceGraphic />
      </div>
    </section>
  );
}

function SignalConvergenceGraphic() {
  const convergenceX = 478;
  const convergenceY = 204;

  return (
    <div className="relative -mx-10 mt-8 min-h-[340px] md:mt-10 md:min-h-0 lg:ml-0 lg:mr-[-40px] lg:mt-0">
      <svg
        aria-hidden="true"
        className="h-auto w-full overflow-visible"
        viewBox="0 0 760 430"
        fill="none"
      >
        <defs>
          <radialGradient id="convergence-glow">
            <stop offset="0" stopColor="#f4f6ff" stopOpacity="0.95" />
            <stop offset="0.12" stopColor="#25ecff" stopOpacity="0.8" />
            <stop offset="0.42" stopColor="#1a5eff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#061025" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="convergence-pulse">
            <stop offset="0" stopColor="#62ed31" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#25ecff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#061025" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beam" x1="478" y1="204" x2="658" y2="204" gradientUnits="userSpaceOnUse">
            <stop stopColor="#efffff" />
            <stop offset="0.23" stopColor="#27d9ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#845bff" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="beam-glow" x1="478" y1="204" x2="658" y2="204" gradientUnits="userSpaceOnUse">
            <stop stopColor="#62ed31" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#27d9ff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#845bff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="floor-line" x1="88" y1="386" x2="600" y2="386" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00bfff" stopOpacity="0" />
            <stop offset="0.38" stopColor="#066eff" stopOpacity="0.58" />
            <stop offset="0.76" stopColor="#7f56ff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#8e24ff" stopOpacity="0" />
          </linearGradient>
          <filter id="point-glow" x="-220%" y="-220%" width="540%" height="540%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="point-glow-strong" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="beam-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Core glow rings */}
        <ellipse cx={convergenceX} cy={convergenceY} rx="120" ry="95" fill="url(#convergence-glow)" opacity="0.6" />
        <ellipse cx={convergenceX} cy={convergenceY} rx="70" ry="55" fill="url(#convergence-pulse)" className="animate-pulse" />
        
        {/* Animated ring */}
        <circle 
          cx={convergenceX} 
          cy={convergenceY} 
          r="45" 
          stroke="#62ed31" 
          strokeWidth="0.5" 
          strokeOpacity="0.2" 
          fill="none"
          className="animate-[spin_20s_linear_infinite]"
          strokeDasharray="8 12"
        />
        <circle 
          cx={convergenceX} 
          cy={convergenceY} 
          r="55" 
          stroke="#25ecff" 
          strokeWidth="0.3" 
          strokeOpacity="0.15" 
          fill="none"
          className="animate-[spin_15s_linear_infinite_reverse]"
          strokeDasharray="4 16"
        />

        {/* Background particles */}
        {Array.from({ length: 60 }, (_, index) => {
          const x = 180 + ((index * 73) % 400);
          const y = 15 + ((index * 47) % 380);
          const signal = signals[index % signals.length];
          return (
            <circle
              key={`field-${index}`}
              cx={x}
              cy={y}
              r={index % 5 === 0 ? 2 : 1.2}
              fill={signal.color}
              opacity={0.2 + (index % 4) * 0.08}
              className="animate-pulse"
              style={{ animationDelay: `${(index * 0.1)}s` }}
            />
          );
        })}

        {/* Signal lines with labels */}
        {signals.map((signal, index) => {
          const startY = 28 + index * 29.2;
          const controlY = convergenceY + (startY - convergenceY) * 0.24;
          return (
            <g key={signal.label}>
              <text
                x="100"
                y={startY + 4}
                textAnchor="end"
                fill="#d6d7db"
                fontSize="10.5"
                fontWeight="700"
                letterSpacing="0.02em"
                className="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              >
                {signal.label}
              </text>
              <circle 
                cx="108" 
                cy={startY} 
                r="3.5" 
                fill={signal.color} 
                filter="url(#point-glow)"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
              <path
                d={`M108 ${startY} C245 ${startY}, 370 ${controlY}, ${convergenceX} ${convergenceY}`}
                stroke={signal.color}
                strokeWidth="1.5"
                strokeOpacity="0.8"
                strokeLinecap="round"
              />
              {particleStops.map((stop, particleIndex) => {
                const eased = stop * stop * (3 - 2 * stop);
                const x = 108 + (convergenceX - 108) * stop;
                const y = startY + (convergenceY - startY) * eased;
                const offset = ((index + particleIndex) % 3 - 1) * 3.5;
                return (
                  <circle
                    key={`${signal.label}-${stop}`}
                    cx={x}
                    cy={y + offset}
                    r={particleIndex % 3 === 0 ? 2.2 : 1.4}
                    fill={signal.color}
                    opacity={0.5 + particleIndex * 0.07}
                    className="animate-pulse"
                    style={{ animationDelay: `${(index * 0.05 + particleIndex * 0.1)}s` }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Convergence point */}
        <circle cx={convergenceX} cy={convergenceY} r="28" fill="#36e6ff" opacity="0.15" filter="url(#soft-glow)" />
        <circle cx={convergenceX} cy={convergenceY} r="16" fill="#62ed31" opacity="0.1" filter="url(#soft-glow)" />
        <circle cx={convergenceX} cy={convergenceY} r="5" fill="#f3ffff" filter="url(#point-glow-strong)" />
        <circle cx={convergenceX} cy={convergenceY} r="2" fill="#ffffff" />
        
        {/* Beam from convergence */}
        <path d="M478 204H501" stroke="url(#beam)" strokeWidth="2.5" filter="url(#beam-filter)" />
        <path d="M478 204H501" stroke="url(#beam-glow)" strokeWidth="6" opacity="0.3" filter="url(#beam-filter)" />

        {/* DATA → ADVANTAGE box */}
        <g>
          <rect x="501" y="175" width="170" height="58" rx="4" fill="#05070d" fillOpacity="0.9" stroke="#8c829d" strokeWidth="1.5" />
          <rect x="504.5" y="178.5" width="163" height="51" rx="3" stroke="#4f52ad" strokeOpacity="0.3" />
          
          {/* Inner gradient glow */}
          <rect x="501" y="175" width="170" height="58" rx="4" fill="url(#convergence-glow)" opacity="0.05" />
          
          <text x="586" y="204" textAnchor="middle" fill="#e6e6e8" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            DATA → ADVANTAGE
          </text>
          <text x="586" y="219" textAnchor="middle" fill="#62ed31" fontSize="7" fontWeight="600" letterSpacing="0.15em" opacity="0.6">
            INTELLIGENCE NETWORK
          </text>
        </g>

        {/* Floor with particles */}
        <g opacity="0.85">
          <path d="M72 372C210 371 308 374 428 390S614 412 718 402" stroke="url(#floor-line)" strokeWidth="1.5" />
          <path d="M92 379C229 378 325 379 431 394S592 414 689 410" stroke="url(#floor-line)" strokeWidth="1.2" />
          <path d="M110 387C245 384 338 385 438 399S563 417 658 416" stroke="url(#floor-line)" strokeWidth="1" />
          <path d="M185 360C278 359 348 366 421 383S540 406 628 407" stroke="#0b59d8" strokeOpacity="0.4" strokeWidth="1" />
          
          {Array.from({ length: 40 }, (_, index) => (
            <circle
              key={`floor-${index}`}
              cx={112 + ((index * 57) % 550)}
              cy={362 + ((index * 17) % 52)}
              r={index % 4 === 0 ? 1.8 : 1}
              fill={index % 3 === 0 ? "#276dff" : index % 3 === 1 ? "#8e39ff" : "#09d9ff"}
              opacity={0.2 + (index % 5) * 0.1}
              className="animate-pulse"
              style={{ animationDelay: `${(index * 0.08)}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}