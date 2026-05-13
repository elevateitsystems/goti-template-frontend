"use client";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export function ContactUs() {
  return (
    <section id="contact" className="py-24 bg-navy-DEFAULT">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Have questions about our enterprise API or pro plans? Our team of
              analysts is here to help you optimize your edge.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: Mail,
                  label: "Email Support",
                  value: "support@propedge.ai",
                },
                {
                  icon: MessageSquare,
                  label: "Live Chat",
                  value: "Available 24/7 for Pro Users",
                },
                { icon: MapPin, label: "Office", value: "Las Vegas, NV" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-[5px] bg-navy-panel border border-navy-border flex items-center justify-center text-accent-green">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[5px] bg-navy-panel border border-navy-border shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-navy-surface border border-navy-border rounded-[5px] text-white focus:border-accent-green outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 bg-navy-surface border border-navy-border rounded-[5px] text-white focus:border-accent-green outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-5 py-4 bg-navy-surface border border-navy-border rounded-[5px] text-white focus:border-accent-green outline-none transition-colors resize-none"
                  placeholder="How can we help you win?"
                />
              </div>
              <button className="w-full py-4 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-green">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
