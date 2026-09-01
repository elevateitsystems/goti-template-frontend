// components/SocialIcon.tsx
"use client";
import { useState } from "react";

interface SocialIconProps {
  Icon: React.ElementType;
  label: string;
  color: string;
}

export function SocialIcon({ Icon, label, color }: SocialIconProps) {
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
        style={{ color: isHovered ? color : '#a3a5ad' }}
      />
      <span 
        className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#62ed31] transition-all duration-300 group-hover/social:w-4"
        style={{ boxShadow: '0 0 8px #62ed3170' }}
      />
    </a>
  );
}