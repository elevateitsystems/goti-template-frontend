"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-DEFAULT/80 backdrop-blur-md border-b border-navy-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-green rounded-[5px] flex items-center justify-center font-bold text-navy-DEFAULT shadow-glow-green">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Prime<span className="text-accent-green">IQ</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/lending" className="hover:text-white transition-colors">
            Lending
          </Link>
          <Link href="#contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-green"
          >
            Launch Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
