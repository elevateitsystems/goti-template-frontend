import {
  CircleDot,
  Handshake,
  Lightbulb,
  MapPin,
  Radio,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const processSteps: Array<{
  number: string;
  title: string[];
  description: string[];
  color: string;
  numberColor: string;
  nextColor?: string;
  icon: LucideIcon;
}> = [
  {
    number: "01",
    title: ["Signal", "Collection"],
    description: ["We gather signals", "from diverse", "sources."],
    color: "#e36bcc",
    numberColor: "#eeeeef",
    nextColor: "#00cfd1",
    icon: Radio,
  },
  {
    number: "02",
    title: ["Contextual", "Analysis"],
    description: ["We study context", "and relationships", "that matter."],
    color: "#00cfd1",
    numberColor: "#eeeeef",
    nextColor: "#00d69a",
    icon: CircleDot,
  },
  {
    number: "03",
    title: ["Synthesis", "& Insight"],
    description: ["We distill insight", "from complexity", "with clarity."],
    color: "#00d69a",
    numberColor: "#00d69a",
    nextColor: "#a0d517",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: ["Strategic", "Framing"],
    description: ["We build", "scenarios and", "paths forward."],
    color: "#a0d517",
    numberColor: "#eeeeef",
    nextColor: "#f2a10b",
    icon: MapPin,
  },
  {
    number: "05",
    title: ["Decision", "Support"],
    description: ["You decide.", "We support with", "confidence."],
    color: "#f29a0b",
    numberColor: "#eeeeef",
    nextColor: "#e9002d",
    icon: Handshake,
  },
  {
    number: "06",
    title: ["Post-Game", "Review"],
    description: ["We learn,", "measure, and", "refine."],
    color: "#e9002d",
    numberColor: "#e9002d",
    icon: RotateCcw,
  },
];

export function OurProcess() {
  return (
    <section className="relative bg-[#010208] px-4 py-12 text-white sm:px-6 lg:px-10 lg:py-16">
      {/* Premium gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-[1440px] border-y border-[#151e31] px-6 py-12 sm:px-8 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-14 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#62ed31] sm:text-[12px]">
            Our Process
          </p>
          <h2 className="mt-5 max-w-[320px] text-[34px] font-bold leading-[1.1] tracking-[-0.05em] text-[#ffffff] sm:text-[40px] lg:text-[44px]">
            Intelligence builds.
            <br />
            The plan follows.
          </h2>
          <p className="mt-4 max-w-[280px] text-[13px] font-light leading-[1.6] text-[#a7a9b0] sm:text-[14px]">
            Every decision is a signal. We decode the noise.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:mt-0 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-6 xl:gap-x-5">
          {processSteps.map((step) => (
            <ProcessStep key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step }: { step: (typeof processSteps)[number] }) {
  const Icon = step.icon;

  return (
    <article className="group relative flex min-w-0 flex-col items-center text-center transition-all duration-500 hover:scale-[1.02]">
      {/* Premium glow behind icon */}
      <div 
        className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at center, ${step.color}15, transparent 70%)`,
          transform: 'translateY(-20px)'
        }}
      />

      <div
        className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-dotted transition-all duration-500 group-hover:border-solid group-hover:shadow-2xl lg:h-[72px] lg:w-[72px]"
        style={{ 
          borderColor: step.color, 
          boxShadow: `0 0 20px ${step.color}15, inset 0 0 20px ${step.color}08`,
        }}
      >
        <div className="absolute inset-[6px] rounded-full border transition-all duration-500 group-hover:inset-[4px]" style={{ borderColor: `${step.color}30` }} />
        <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ 
          background: `radial-gradient(circle at center, ${step.color}08, transparent 70%)`,
        }} />
        <Icon 
          aria-hidden="true" 
          className="relative h-5 w-5 stroke-[1.8] transition-all duration-500 group-hover:scale-110 group-hover:stroke-[2.5]" 
          style={{ color: step.color }} 
        />
      </div>

      {step.nextColor ? (
        <span
          aria-hidden="true"
          className="absolute -right-[12px] top-[24px] hidden text-[28px] font-light leading-none opacity-60 transition-opacity group-hover:opacity-100 lg:block xl:-right-[16px]"
          style={{ color: step.nextColor }}
        >
          ›
        </span>
      ) : null}

      <p 
        className="mt-4 text-[24px] font-bold leading-none tracking-[-0.03em] transition-colors duration-300 lg:text-[26px]"
        style={{ color: step.numberColor }}
      >
        {step.number}
      </p>
      <h3 className="mt-2.5 text-[14px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#f0f0f2] lg:text-[15px]">
        {step.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>
      <div className="mt-3 h-[1px] w-8 bg-gradient-to-r from-transparent via-[#a7a9b0]/30 to-transparent" />
      <p className="mt-3 text-[11px] font-light leading-[1.6] text-[#a7a9b0] xl:text-[12px]">
        {step.description.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </article>
  );
}