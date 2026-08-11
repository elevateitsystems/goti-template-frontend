"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
}

const hiddenMoneylinePaths = [
  "/clv-tracker",
  "/correlation-engine",
  "/dfs",
  "/edge-feed",
  "/injury-impact",
  "/market-intelligence",
  "/matchup-impact",
  "/notifications",
  "/odds",
  "/parlay-builder",
  "/player-analytics",
  "/player-props",
  "/top-plays",
] as const;

function isHiddenMoneylinePath(pathname: string) {
  return hiddenMoneylinePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Role-based redirect for admin pages
    if (pathname.startsWith("/admin") && user?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (isHiddenMoneylinePath(pathname)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, pathname, router]);

  // Loading state visual wrapper (short-circuit to avoid flashing content if redirecting)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1423]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-body">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1423]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-body">Access Denied. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (isHiddenMoneylinePath(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1423]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-body">Opening your PrimeIQ dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
