"use client";
import React, { useState } from "react";
import { Instagram, Linkedin, Play, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerColumns = [
  {
    title: "Intelligence",
    links: ["Sports Betting", "DFS & Fantasy", "Props & Player", "Team & Syndicate"],
  },
  {
    title: "How It Works",
    links: ["Features", "Integrations", "Security"],
  },
  {
    title: "Performance",
    links: ["Professional Bettors", "Sportsbooks", "Analysts & Models", "Media & Content"],
  },
  {
    title: "Membership",
    links: ["Research", "Blog", "Glossary", "Help Center"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Partners", "Contact Us"],
  },
];

const socialLinks = [
  { label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { label: "YouTube", icon: Youtube, color: "#FF0000" },
  { label: "Video", icon: Play, color: "#62ed31" },
  { label: "Instagram", icon: Instagram, color: "#E4405F" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[#141c2e] bg-[#010208] px-5 py-12 text-white sm:px-8 lg:px-12 lg:py-16">
      {/* Premium gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#62ed31]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Subtle glow line at top */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#62ed31]/30 to-transparent" />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 sm:grid-cols-2 lg:grid-cols-[1.65fr_repeat(5,minmax(0,0.9fr))] lg:gap-8 xl:gap-12">
        {/* Brand Column */}
        <div className="group">
          <Link href="/" aria-label="PrimeIQ home" className="inline-flex">
            <PrimeIQFooterLogo />
          </Link>
          <p className="mt-5 max-w-[210px] text-[12px] font-light leading-[1.8] text-[#a3a5ad] sm:text-[13px]">
            Sharper insight. Smarter
            <br />
            positions. <span className="text-[#62ed31]">Real edge.</span>
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, icon: Icon, color }) => (
              <SocialIcon key={label} Icon={Icon} label={label} color={color} />
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={`${column.title} footer links`}>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#e3e3e5] sm:text-[13px]">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="group/link relative inline-block text-[11px] font-light text-[#a9abb2] transition-all duration-300 hover:text-[#62ed31] sm:text-[12px]"
                  >
                    {link}
                    <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#62ed31] transition-all duration-300 group-hover/link:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="relative mx-auto mt-12 max-w-[1440px] border-t border-[#141c2e] pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-[10px] font-light text-[#6a6c75] sm:text-[11px]">
          &copy; {new Date().getFullYear()} PrimeIQ. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] font-light text-[#6a6c75] sm:text-[11px]">
          <a href="#" className="transition-colors hover:text-[#62ed31]">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-[#62ed31]">Terms of Service</a>
          <a href="#" className="transition-colors hover:text-[#62ed31]">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

// Client Component for social icons with hover interactivity
function SocialIcon({ Icon, label, color }: { Icon: React.ElementType; label: string; color: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="#"
      aria-label={label}
      className="group/social relative flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-[#62ed31]/30 hover:bg-[#62ed31]/10 hover:scale-110 active:scale-95"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        aria-hidden="true" 
        className="h-3.5 w-3.5 stroke-[2.2] transition-all duration-300 group-hover/social:scale-110" 
        style={{ 
          color: isHovered ? color : '#a3a5ad',
        }}
      />
      {/* Glow dot */}
      <span 
        className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#62ed31] transition-all duration-300 group-hover/social:w-4"
        style={{ boxShadow: '0 0 8px #62ed3170' }}
      />
    </a>
  );
}

function PrimeIQFooterLogo() {
  return (
    <span className="flex items-center group/logo transition-transform duration-500 hover:scale-105">
      <svg aria-hidden="true" className="h-9 w-10 shrink-0 transition-transform duration-500 group-hover/logo:rotate-[-5deg]" viewBox="0 0 48 44" fill="none">
        <defs>
          <linearGradient id="footer-rocket-body" x1="12" y1="32" x2="38" y2="7" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00e7ff" />
            <stop offset="0.48" stopColor="#006cff" />
            <stop offset="1" stopColor="#ff1493" />
          </linearGradient>
          <linearGradient id="footer-rocket-flame" x1="14" y1="26" x2="5" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffea00" />
            <stop offset="0.45" stopColor="#ff4a00" />
            <stop offset="1" stopColor="#ff00a8" />
          </linearGradient>
          <linearGradient id="footer-rocket-ring" x1="4" y1="27" x2="44" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff00b8" />
            <stop offset="0.48" stopColor="#ff7920" />
            <stop offset="1" stopColor="#cbff00" />
          </linearGradient>
          <filter id="footer-rocket-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#footer-rocket-glow)">
          <path d="M19.3 27.6 9.2 37.4l3.2-9.2 6.9-.6Z" fill="url(#footer-rocket-flame)" />
          <path d="M20.1 24.7c2.9-8.6 9.8-15.2 20.7-18.1-.7 10.8-6.1 18.1-14.7 21.9l-6-3.8Z" fill="url(#footer-rocket-body)" stroke="#ff26a8" strokeWidth="1.2" />
          <path d="m20.7 24.1-7.4-.2c1.8-3.8 4.2-6.2 8.8-7.2l-1.4 7.4ZM26.6 28l.8 7.2c3.7-2.2 5.6-5.2 6-9.3L26.6 28Z" fill="#ff1593" stroke="#7e1bff" strokeWidth="1" />
          <circle cx="31.9" cy="14.7" r="3.6" fill="#07101e" stroke="#d7ff00" strokeWidth="1.4" />
          <path d="M5.4 25.4c4.8 2.9 15.1 2.1 25.2-1.7 8.4-3.2 13.4-7.1 12.5-9.1-.5-1.1-2.7-1.2-6-.5" stroke="url(#footer-rocket-ring)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5.6 25.5c-1.4-.9-2.1-1.8-1.7-2.8.8-1.9 6.7-2.9 14.2-2.4" stroke="#f500c5" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
      <span className="-ml-0.5 text-[22px] font-bold leading-none tracking-[-0.045em] text-white">
        Prime<span className="bg-gradient-to-r from-[#58ed31] to-[#a8ff5e] bg-clip-text text-transparent">IQ</span>
      </span>
    </span>
  );
}