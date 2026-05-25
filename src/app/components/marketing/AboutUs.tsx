"use client";

export function AboutUs() {
  return (
    <section id="about" className="py-24 bg-navy-panel border-y border-navy-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Our Mission</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            PrimeIQ was founded by a team of data scientists and professional sports bettors who were tired of the "black box" nature of sports analytics. 
          </p>
          <p className="text-lg text-gray-500 leading-relaxed">
            We believe that every bettor deserves access to institutional-grade intelligence. Our platform bridges the gap between complex data and actionable insights, empowering you to make smarter, more profitable decisions in real-time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          {[
            { label: "Data Points/Sec", value: "10,000+" },
            { label: "Prop Categories", value: "25+" },
            { label: "Active Users", value: "15,000+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-accent-green mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
