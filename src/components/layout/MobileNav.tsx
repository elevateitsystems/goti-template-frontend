// @MobileNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Activity,
  Zap,
  Layers,
  Gamepad2,
  Radio,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const coreItems = [
  { title: "Daily Betting Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Player Props", href: "/player-props", icon: Target },
  { title: "Matchup Impact", href: "/matchup-impact", icon: Activity },
  { title: "Edge Feed", href: "/edge-feed", icon: Zap },
  { title: "Market Trap Detector", href: "/market-intelligence", icon: Layers },
  { title: "DFS Integration", href: "/dfs", icon: Gamepad2 },
  { title: "Notifications", href: "/notifications", icon: Radio },
];

const bottomItems = [
  { title: "Admin", href: "/admin", icon: Shield },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More Sheet */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          />
          <div
            className="absolute bottom-16 left-0 right-0 rounded-t-2xl p-4"
            style={{
              backgroundColor: "var(--bg-card)",
              borderTop: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-1 rounded-full mx-auto mb-4"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div className="grid grid-cols-3 gap-3">
              {coreItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-[5px] text-center transition-colors"
                  style={{
                    backgroundColor:
                      pathname === item.href
                        ? "var(--emerald-light)"
                        : "var(--bg-surface)",
                    color:
                      pathname === item.href
                        ? "var(--emerald)"
                        : "var(--text-secondary)",
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-body font-medium">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-around py-2 px-2 safe-area-bottom">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[5px] transition-all",
                )}
                style={{
                  color: isActive ? "var(--emerald)" : "var(--text-muted)",
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-body font-medium">
                  {item.title}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[5px] transition-all"
            style={{ 
              color: showMore ? "var(--emerald)" : "var(--text-muted)"
            }}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-body font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}