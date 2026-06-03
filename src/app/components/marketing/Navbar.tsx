"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";

const navItem = [
  {
    item: "About",
    href: "#about",
  },
  {
    item: "Core Pillers",
    href: "#core-pillers",
  },
  {
    item: "Tools",
    href: "#tools",
  },
  {
    item: "Pricing",
    href: "#pricing",
  },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-DEFAULT/80 backdrop-blur-md border-b border-navy-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* <div className=""> */}
        <Link href={"/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-green rounded-[5px] flex items-center justify-center font-bold text-navy-DEFAULT shadow-glow-green">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Prime<span className="text-accent-green">IQ</span>
          </span>
        </Link>
        {/* </div> */}

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          {navItem?.map((item) => (
            <Link
              key={item?.href}
              href={item?.href}
              className="hover:text-white transition-colors"
            >
              {item?.item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-green"
              >
                Dashboard
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5 text-white rounded-[5px] font-bold text-sm hover:scale-105 active:scale-95 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-white hover:text-accent-green transition-colors font-bold text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-accent-green text-navy-DEFAULT rounded-[5px] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-green"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
