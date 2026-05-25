"use client";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-green/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            Track sharp money before the line moves
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            The{" "}
            <span className="text-accent-green italic">Bloomberg Terminal</span>{" "}
            for Sports Betting
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Spot public traps, track closing line value, and follow the sharp money in real-time. Stop betting blind and start betting with an edge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-glow-green text-center"
            >
              Get Started for Free
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-navy-surface text-white border border-navy-border rounded-[5px] font-bold text-lg hover:bg-navy-panel transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Image / Mockup */}
        <div className="relative max-w-5xl mx-auto mt-20 animate-slide-up">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-green/20 to-intel-blue/20 blur-xl opacity-50" />
          <div className="relative rounded-[5px] overflow-hidden border border-navy-border shadow-2xl bg-navy-panel">
            <Image
              src="/images/hero-mockup.png"
              alt="PrimeIQ Intelligence Dashboard"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Floating Stats Card Overlay (Simulated) */}
          <div className="absolute -bottom-10 -right-10 hidden lg:block w-72 p-6 rounded-[5px] bg-navy-surface border border-navy-border shadow-glow-green animate-pulse-slow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-xs font-bold uppercase">
                High EV Alert
              </span>
              <span className="text-accent-green font-bold">+12.4%</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              N. Jokic Over 11.5 Reb
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              Hit Rate: 78% (L10)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
