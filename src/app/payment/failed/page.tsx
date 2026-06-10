"use client";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: "var(--bg)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" 
             style={{ backgroundColor: "#ef4444", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-md">
        <div className="card rounded-[5px] p-10 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-20 w-20" style={{ color: "#f87171" }} />
          </div>

          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Payment Failed
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Something went wrong with your payment. Please try again.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="w-full py-3 rounded-[5px] text-white font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--emerald)" }}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <Link href="/" className="block w-full py-3 rounded-[5px] border font-medium flex items-center justify-center gap-2 hover:bg-[var(--bg-surface)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}