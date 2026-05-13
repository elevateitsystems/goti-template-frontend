"use client";
import Link from "next/link";
import { Lock } from "lucide-react";

interface PremiumLockProps {
  title?: string;
  message?: string;
}

export function PremiumLock({
  title = "Premium Feature",
  message = "Upgrade to Pro to unlock this feature",
}: PremiumLockProps) {
  return (
    <div
      className="absolute inset-0 rounded-[5px] z-10 flex flex-col items-center justify-center gap-3"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "var(--gold-light)",
          border: "2px solid var(--gold)",
        }}
      >
        <Lock className="h-5 w-5" style={{ color: "var(--gold)" }} />
      </div>
      <div className="text-center px-4">
        <p
          className="font-body font-semibold text-sm mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p
          className="text-xs font-body"
          style={{ color: "var(--text-secondary)" }}
        >
          {message}
        </p>
      </div>
      <Link
        href="/pricing"
        className="px-5 py-2 rounded-[5px] text-white text-xs font-body font-semibold transition-all hover:opacity-90"
        style={{ backgroundColor: "var(--emerald)" }}
      >
        Upgrade to Pro
      </Link>
      <span
        className="badge text-white text-[9px] px-2 py-0.5"
        style={{ backgroundColor: "var(--gold)" }}
      >
        PRO FEATURE
      </span>
    </div>
  );
}
