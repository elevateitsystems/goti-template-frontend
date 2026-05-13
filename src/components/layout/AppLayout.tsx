"use client";
import { Suspense, useState } from "react";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0">
        <Suspense fallback={<div className="w-64 h-screen" style={{ backgroundColor: "var(--bg-card)", borderRight: "1px solid var(--border)" }} />}>
          <Sidebar
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto pb-20 md:pb-0 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
