"use client";
import { Home } from "lucide-react";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: "var(--bg)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" 
             style={{ backgroundColor: "var(--gold)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-md">
        <div className="card rounded-[5px] p-10 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Payment Cancelled
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            You have cancelled the payment process.<br />
            No charges were made.
          </p>

          <div className="space-y-4">
            <Link href="/register" className="block w-full py-3 rounded-[5px] border font-medium" 
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
              Try Again
            </Link>

            <Link href="/" className="block w-full py-3 rounded-[5px] text-white font-semibold flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--emerald)" }}>
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}