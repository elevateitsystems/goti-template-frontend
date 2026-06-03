"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
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

  return <>{children}</>;
}
