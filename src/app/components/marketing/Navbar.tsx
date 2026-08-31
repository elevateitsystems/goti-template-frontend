"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";

const navItem = [
  {
    item: "Intelligence",
    href: "#about",
  },
  {
    item: "How It Works",
    href: "#core-pillers",
  },
  {
    item: "Performance",
    href: "#tools",
  },
  {
    item: "Membership",
    href: "#pricing",
  },
];

function PrimeIQLogo() {
  return (
    <span className="flex items-center group" aria-label="PrimeIQ">
      <svg
        aria-hidden="true"
        className="h-9 w-10 shrink-0 transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-11"
        viewBox="0 0 48 44"
        fill="none"
      >
        <defs>
          <linearGradient id="rocket-body" x1="12" y1="32" x2="38" y2="7" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00E7FF" />
            <stop offset="0.48" stopColor="#006CFF" />
            <stop offset="1" stopColor="#FF1493" />
          </linearGradient>
          <linearGradient id="rocket-flame" x1="14" y1="26" x2="5" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFEA00" />
            <stop offset="0.45" stopColor="#FF4A00" />
            <stop offset="1" stopColor="#FF00A8" />
          </linearGradient>
          <linearGradient id="rocket-ring" x1="4" y1="27" x2="44" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF00B8" />
            <stop offset="0.48" stopColor="#FF7920" />
            <stop offset="1" stopColor="#CBFF00" />
          </linearGradient>
          <filter id="rocket-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#rocket-glow)">
          <path d="M19.3 27.6 9.2 37.4l3.2-9.2 6.9-.6Z" fill="url(#rocket-flame)" />
          <path d="M20.1 24.7c2.9-8.6 9.8-15.2 20.7-18.1-.7 10.8-6.1 18.1-14.7 21.9l-6-3.8Z" fill="url(#rocket-body)" stroke="#FF26A8" strokeWidth="1.2" />
          <path d="m20.7 24.1-7.4-.2c1.8-3.8 4.2-6.2 8.8-7.2l-1.4 7.4ZM26.6 28l.8 7.2c3.7-2.2 5.6-5.2 6-9.3L26.6 28Z" fill="#FF1593" stroke="#7E1BFF" strokeWidth="1" />
          <circle cx="31.9" cy="14.7" r="3.6" fill="#07101E" stroke="#D7FF00" strokeWidth="1.4" />
          <path d="M5.4 25.4c4.8 2.9 15.1 2.1 25.2-1.7 8.4-3.2 13.4-7.1 12.5-9.1-.5-1.1-2.7-1.2-6-.5" stroke="url(#rocket-ring)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5.6 25.5c-1.4-.9-2.1-1.8-1.7-2.8.8-1.9 6.7-2.9 14.2-2.4" stroke="#F500C5" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
      <span className="-ml-0.5 text-[19px] font-bold leading-none tracking-[-0.045em] text-white sm:text-[22px]">
        Prime<span className="bg-gradient-to-r from-[#57ef31] to-[#a8ff5e] bg-clip-text text-transparent">IQ</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 h-[76px] border-b transition-all duration-500 ${
          isScrolled
            ? "border-white/[0.06] bg-[#010205]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "border-transparent bg-[#010205]"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-10">
          <Link href={"/"} className="shrink-0" aria-label="PrimeIQ home">
            <PrimeIQLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-[12px] font-medium text-[#d7d7d9] md:flex lg:gap-10 lg:text-[13px] xl:gap-14">
            {navItem?.map((item) => (
              <Link
                key={item?.href}
                href={item?.href}
                className="relative whitespace-nowrap transition-colors duration-300 hover:text-white group"
              >
                {item?.item}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#57ef31] to-[#a8ff5e] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3.5">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-[3px] bg-[#59ee36] px-3 py-2 text-[11px] font-bold text-[#031000] shadow-[0_0_15px_rgba(89,238,54,0.15)] transition-all duration-300 hover:bg-[#6bff48] hover:shadow-[0_0_25px_rgba(89,238,54,0.3)] hover:scale-[1.02] active:scale-95 sm:px-5 sm:py-2.5 sm:text-[13px]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="rounded-[3px] border border-white/10 px-2.5 py-2 text-[11px] font-medium text-white transition-all duration-300 hover:border-white/25 hover:bg-white/5 active:scale-95 sm:px-4 sm:py-2.5 sm:text-[13px]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-1 px-1.5 py-2 text-[12px] font-medium text-[#d8d8da] transition-colors hover:text-white sm:flex sm:text-[13px]"
                >
                  Login
                  <ChevronDown aria-hidden="true" className="h-3 w-3 stroke-[1.8]" />
                </Link>
                <Link
                  href="/register"
                  className="whitespace-nowrap rounded-[3px] bg-[#59ee36] px-3 py-2 text-[10px] font-bold text-[#031000] shadow-[0_0_12px_rgba(89,238,54,0.25)] transition-all duration-300 hover:bg-[#6bff48] hover:shadow-[0_0_25px_rgba(89,238,54,0.4)] hover:scale-[1.02] active:scale-95 sm:px-5 sm:py-2.5 sm:text-[13px]"
                >
                  Try 2 Months Free
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-[3px] border border-white/10 text-white transition-all duration-300 hover:border-white/25 hover:bg-white/5 md:hidden"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 stroke-[1.8]" />
                  ) : (
                    <Menu className="h-5 w-5 stroke-[1.8]" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#010208]/80 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-[300px] transform border-l border-white/[0.06] bg-[#010208] p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
          <PrimeIQLogo />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="h-4 w-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Mobile nav items */}
        <div className="mt-8 flex flex-col space-y-1">
          {navItem?.map((item, index) => (
            <Link
              key={item?.href}
              href={item?.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="group relative rounded-[3px] px-4 py-3.5 text-[15px] font-medium text-[#d7d7d9] transition-all duration-300 hover:bg-white/[0.03] hover:text-white"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item?.item}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#62ed31] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile auth buttons */}
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-[3px] border border-white/10 px-4 py-3 text-[13px] font-medium text-white transition-colors hover:border-white/25 hover:bg-white/5"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-[3px] bg-[#59ee36] px-4 py-3 text-[13px] font-bold text-[#031000] shadow-[0_0_20px_rgba(89,238,54,0.15)] transition-all hover:shadow-[0_0_30px_rgba(89,238,54,0.25)] active:scale-95"
          >
            Try 2 Months Free
          </Link>
        </div>
      </div>
    </>
  );
}