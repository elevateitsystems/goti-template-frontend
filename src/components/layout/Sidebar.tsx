"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveSport } from "@/redux/features/sportSlice";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Layers,
  Users,
  Radio,
  Activity,
  Timer,
  Gamepad2,
  UserCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Daily Betting Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { title: "Prop Explorer", href: "/prop-explorer", icon: Target },
  { title: "Top Plays / Best Bets", href: "/top-plays", icon: Trophy },
  { title: "Player analytics", href: "/player-analytics", icon: Users },
  { title: "Parlay Builder", href: "/parlay-builder", icon: Layers },
  { title: "Injury Impact", href: "/injury-impact", icon: HeartPulse },
  { title: "Correlation Engine", href: "/correlation-engine", icon: Link2 },
  { title: "Edge Feed", href: "/edge-feed", icon: Radio },
  {
    title: "Market Trap Detector",
    href: "/market-intelligence",
    icon: Activity,
  },
  { title: "CLV Tracker", href: "/clv-tracker", icon: Timer },
  { title: "DFS Integration", href: "/dfs", icon: Gamepad2 },
];

const bottomItems = [
  { title: "Profile", href: "/profile", icon: UserCircle },
  { title: "Admin", href: "/admin", icon: Shield },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeSport = useAppSelector((state) => state.sport.activeSport);

  const sports = [
    { id: "NBA", label: "NBA", logo: "🏀" },
    { id: "MLB", label: "MLB", logo: "⚾️", beta: true },
  ];

  const handleSportChange = (sportId: string) => {
    dispatch(setActiveSport(sportId));

    // Update URL with ONLY the sports search param, clearing others
    const params = new URLSearchParams();
    params.set("sport", sportId.toLowerCase());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getHrefWithParams = (href: string) => {
    const params = new URLSearchParams();
    const currentSport = searchParams.get("sport") || activeSport;
    if (currentSport) {
      params.set("sport", currentSport.toLowerCase());
    }
    return `${href}?${params.toString()}`;
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen transition-all duration-200 ease-in-out border-r",
        collapsed ? "w-16" : "w-60",
      )}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 p-4 border-b hover:opacity-80 transition-opacity",
          collapsed && "justify-center",
        )}
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--emerald), var(--emerald-hover))",
          }}
        >
          <span className="text-white font-bold text-sm font-body z-10">
            PE
          </span>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, white, transparent)",
            }}
          />
        </div>
        {!collapsed && (
          <div>
            <span
              className="font-display text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              PrimeIQ
            </span>
            <span
              className="font-display text-sm font-semibold ml-1"
              style={{ color: "var(--gold)" }}
            >
              Intelligence
            </span>
          </div>
        )}
      </Link>

      {/* Sport Selector Tabs */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="flex bg-[#1a1c23] rounded-[5px] p-1 items-center gap-1 border border-white/5 shadow-inner">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportChange(sport.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 relative",
                  activeSport === sport.id
                    ? "bg-[#2a2d35] text-white shadow-sm ring-1 ring-white/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
                )}
              >
                <span>{sport.logo}</span>
                <span>{sport.label}</span>
                {sport.beta && (
                  <span className="absolute -top-2 -right-1 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-sm scale-75 uppercase tracking-wider">
                    Beta
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border flex items-center justify-center z-20 transition-colors"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={getHrefWithParams(item.href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[5px] transition-all duration-150 group",
                  collapsed && "justify-center",
                  isActive ? "font-semibold" : "hover:opacity-80",
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--emerald-light)"
                    : "transparent",
                  color: isActive ? "var(--emerald)" : "var(--text-secondary)",
                }}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-body truncate flex-1">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="mx-4 my-3"
          style={{ height: 1, backgroundColor: "var(--border)" }}
        />

        <div className="space-y-0.5 px-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={getHrefWithParams(item.href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[5px] transition-all duration-150",
                  collapsed && "justify-center",
                  isActive ? "font-semibold" : "hover:opacity-80",
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--emerald-light)"
                    : "transparent",
                  color: isActive ? "var(--emerald)" : "var(--text-secondary)",
                }}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-body">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: User */}
      <div
        className={cn(
          "p-3 border-t space-y-2",
          collapsed && "flex flex-col items-center",
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[5px]"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0"
              style={{ backgroundColor: "var(--emerald)" }}
            >
              JD
            </div>
            <div className="min-w-0">
              <p
                className="text-xs font-semibold font-body truncate"
                style={{ color: "var(--text-primary)" }}
              >
                John Doe
              </p>
              <p
                className="text-[10px] font-body"
                style={{ color: "var(--gold)" }}
              >
                Pro Plan
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
