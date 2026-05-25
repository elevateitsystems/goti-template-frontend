"use client";
import { LineChart, BarChart3, Activity, AlertTriangle, ArrowUpRight } from "lucide-react";

export function DashboardDemo() {
  return (
    <section className="py-24 bg-navy-DEFAULT relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-intel-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-intel-blue/10 border border-intel-blue/20 text-intel-blue text-xs font-bold uppercase tracking-wider mb-6">
            Visual Intelligence
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            See the Value. <span className="text-intel-blue">Exploit the Edge.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stop digging through spreadsheets. Our visual analytics tools reveal market inefficiencies instantly.
          </p>
        </div>

        {/* Dashboard UI Mockup */}
        <div className="rounded-[10px] bg-navy-panel border border-navy-border shadow-2xl p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart Area */}
            <div className="lg:col-span-2 bg-navy-surface rounded-[5px] border border-navy-border p-6 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <LineChart className="text-accent-blue" size={18} />
                    Live Odds Movement (CLV)
                  </h4>
                  <p className="text-xs text-gray-500">Tracking closing line vs your entry</p>
                </div>
                <div className="text-xs px-2 py-1 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded">
                  +4.2% CLV (Avg)
                </div>
              </div>
              
              {/* Simulated Chart */}
              <div className="flex-1 border-b border-l border-navy-border/50 relative flex items-end">
                {/* Grid lines */}
                <div className="absolute w-full h-[1px] bg-navy-border/30 top-1/4"></div>
                <div className="absolute w-full h-[1px] bg-navy-border/30 top-2/4"></div>
                <div className="absolute w-full h-[1px] bg-navy-border/30 top-3/4"></div>
                
                {/* Line graph simulation */}
                <svg className="w-full h-full absolute inset-0 text-accent-blue" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 80 Q 20 70, 40 50 T 70 30 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M0 80 Q 20 70, 40 50 T 70 30 T 100 10 L 100 100 L 0 100 Z" fill="currentColor" fillOpacity="0.1" />
                </svg>
                
                {/* Data points */}
                <div className="absolute w-2 h-2 rounded-full bg-white top-[78%] left-[2%] shadow-[0_0_10px_white]"></div>
                <div className="absolute w-2 h-2 rounded-full bg-white top-[48%] left-[40%] shadow-[0_0_10px_white]"></div>
                <div className="absolute w-2 h-2 rounded-full bg-accent-green top-[8%] left-[98%] shadow-[0_0_10px_#10B981]"></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                <span>Opening</span>
                <span>Mid-day</span>
                <span>Closing (Now)</span>
              </div>
            </div>

            {/* Sidebar Alerts & EV */}
            <div className="space-y-6 flex flex-col">
              
              {/* EV Heatmap */}
              <div className="bg-navy-surface rounded-[5px] border border-navy-border p-6 flex-1">
                <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                  <BarChart3 className="text-accent-gold" size={18} />
                  Top EV Opportunities
                </h4>
                <div className="space-y-3">
                  {[
                    { player: "L. James", prop: "O 7.5 AST", ev: "+14.2%", bg: "bg-accent-green/20 border-accent-green/40 text-accent-green" },
                    { player: "S. Curry", prop: "U 28.5 PTS", ev: "+8.7%", bg: "bg-accent-green/10 border-accent-green/20 text-accent-green" },
                    { player: "N. Jokic", prop: "O 11.5 REB", ev: "+5.1%", bg: "bg-gray-800 border-gray-700 text-gray-300" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="text-white font-medium">{item.player}</div>
                        <div className="text-gray-500 text-xs">{item.prop}</div>
                      </div>
                      <div className={`px-2 py-1 rounded border text-xs font-bold ${item.bg}`}>
                        {item.ev}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Alerts */}
              <div className="bg-navy-surface rounded-[5px] border border-navy-border p-6 flex-1">
                <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Activity className="text-accent-danger" size={18} />
                  Live Market Alerts
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5"><AlertTriangle className="text-accent-gold" size={14} /></div>
                    <div>
                      <div className="text-xs text-white font-medium">Sharp Money Detected</div>
                      <div className="text-[10px] text-gray-500">T. Haliburton O 10.5 AST</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5"><ArrowUpRight className="text-accent-danger" size={14} /></div>
                    <div>
                      <div className="text-xs text-white font-medium">Line Movement (Steam)</div>
                      <div className="text-[10px] text-gray-500">BOS vs MIA: U 212.5 &rarr; 209.5</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
