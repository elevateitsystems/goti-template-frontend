"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Players", href: "/player-analytics", icon: Users },
  { title: "Lines", href: "/line-movement", icon: TrendingUp },
  { title: "Books", href: "/sportsbook-comparison", icon: BarChart3 },
];

const moreNav = [
  { title: "Portfolio", href: "/game-portfolio" },
  { title: "Insights", href: "/insights" },
  { title: "Briefing", href: "/morning-briefing" },
  { title: "Edge Engine", href: "/edge-engine" },
  { title: "Market Intel", href: "/market-intelligence" },
  { title: "Backtesting", href: "/backtesting" },
  { title: "Capital", href: "/capital-allocation" },
  { title: "Pricing", href: "/pricing" },
  { title: "Profile", href: "/profile" },
  { title: "Admin", href: "/admin" },
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
              {moreNav.map((item) => (
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
          {mainNav.map((item) => {
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
            style={{ color: "var(--text-muted)" }}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-body font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
