"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Link2,
  LogOut,
  Calendar,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/features/authSlice";

const coreItems = [
  {
    title: "Daily Betting Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  }, // Todo
  { title: "Player Props", href: "/player-props", icon: Target }, // done

  // { title: "Top Plays", href: "/top-plays", icon: Trophy },
  { title: "Matchup Impact", href: "/matchup-impact", icon: Activity }, // done
  { title: "Odds", href: "/odds", icon: TrendingUp }, // doing
  { title: "Edge Feed", href: "/edge-feed", icon: Zap }, // done
  { title: "Market Trap Detector", href: "/market-intelligence", icon: Layers },
  { title: "DFS Integration", href: "/dfs", icon: Gamepad2 }, // done
  // { title: "Injury Impact", href: "/injury-impact", icon: HeartPulse }, // todo
  { title: "Notifications", href: "/notifications", icon: Radio }, // done
];

// const bottomItems = [
//   { title: "Profile", href: "/profile", icon: UserCircle },
//   // { title: "Admin", href: "/admin", icon: Shield },
// ];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const getHrefWithParams = (href: string) => {
    return href;
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
      <nav className="flex-1 py-3 overflow-y-auto space-y-4">
        {/* Core Data Group */}
        <div>
          {!collapsed && (
            <p className="px-5 text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1.5 font-display">
              Core Data
            </p>
          )}
          <div className="space-y-0.5 px-2">
            {coreItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={getHrefWithParams(item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-[5px] transition-all duration-150 group",
                    collapsed && "justify-center",
                    isActive ? "font-semibold" : "hover:opacity-80",
                  )}
                  style={{
                    backgroundColor: isActive
                      ? "var(--emerald-light)"
                      : "transparent",
                    color: isActive
                      ? "var(--emerald)"
                      : "var(--text-secondary)",
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
        </div>

        {/* <div className="space-y-0.5 px-2">
          {bottomItems
            .filter((item) => item.href !== "/admin" || user?.role === "admin")
            .map((item) => {
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
                    color: isActive
                      ? "var(--emerald)"
                      : "var(--text-secondary)",
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
        </div> */}
      </nav>

      {/* Bottom: User */}
      <div
        className={cn(
          "p-3 border-t space-y-2",
          collapsed && "flex flex-col items-center",
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {user ? (
          <>
            {!collapsed ? (
              <div
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-[5px] w-full"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0"
                    style={{ backgroundColor: "var(--emerald)" }}
                  >
                    {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
                      user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold font-body truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </p>
                    <p
                      className="text-[10px] font-body"
                      style={{ color: "var(--gold)" }}
                    >
                      {user.role === "admin" ? "Admin" : "Pro Plan"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-1 hover:text-red-400 text-gray-500 rounded transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(logout())}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-[5px] text-xs font-body font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}
