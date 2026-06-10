"use client";
import { cn } from "@/lib/utils";
import { useGetAllQuery } from "@/redux/api/userApi";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Layers,
  LayoutDashboard,
  LogOut,
  Radio,
  Shield,
  Target,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Fetch subscription data
  const { data: subResponse } = useGetAllQuery({
    path: "/subscription/my-subscription",
  });

  const subscription = subResponse?.data;
  const subscriptionStatus = subscription?.status || "free";
  const planName = subscription?.pricing?.title || 
                   (subscriptionStatus === "active" ? "Pro Plan" : "Free Plan");

  const getHrefWithParams = (href: string) => href;

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
        {/* ... existing logo code ... */}
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
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Navigation - unchanged */}
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
                    backgroundColor: isActive ? "var(--emerald-light)" : "transparent",
                    color: isActive ? "var(--emerald)" : "var(--text-secondary)",
                  }}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm font-body truncate flex-1">{item.title}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Items */}
        <div className="space-y-0.5 px-2">
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
                    backgroundColor: isActive ? "var(--emerald-light)" : "transparent",
                    color: isActive ? "var(--emerald)" : "var(--text-secondary)",
                  }}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm font-body">{item.title}</span>}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Bottom: User + Dynamic Subscription */}
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
              <Link
                href="/profile"
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-[5px] w-full hover:bg-white/5 transition-colors group"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Avatar with avatarUrl support */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0"
                      style={{ backgroundColor: "var(--emerald)" }}
                    >
                      {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "?"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold font-body truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </p>
                    <p
                      className="text-[10px] font-body capitalize"
                      style={{ color: "var(--gold)" }}
                    >
                      {planName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* <User className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" /> */}
                  <LogOut
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(logout());
                    }}
                    className="h-4 w-4 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    // title="Sign Out"
                  />
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link href="/profile" title="Profile">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: "var(--emerald)" }}
                    >
                      {user.firstName?.[0] || user.email?.[0] || "?"}
                    </div>
                  )}
                </Link>

                <button
                  onClick={() => dispatch(logout())}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
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