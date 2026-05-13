"use client";
import { Twitter, Instagram, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 bg-navy-panel border-t border-navy-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent-green rounded-[5px] flex items-center justify-center font-bold text-navy-DEFAULT">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Prop<span className="text-accent-green">Edge</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Institutional-grade sports betting intelligence for professional
              bettors. Dominate the props market with data-driven signals.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Product
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Edge Feed
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Smart Ratings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-green transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Stay Connected
            </h4>
            <div className="flex gap-4 mb-6">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-[5px] bg-navy-surface border border-navy-border flex items-center justify-center text-gray-400 hover:text-accent-green hover:border-accent-green transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
              Please bet responsibly. Must be 21+.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-navy-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-xs">
            © 2026 PropEdge Intelligence. All rights reserved.
          </div>
          <div className="flex gap-8 text-xs text-gray-500">
            <a href="#" className="hover:text-white">
              Responsible Gaming
            </a>
            <a href="#" className="hover:text-white">
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
