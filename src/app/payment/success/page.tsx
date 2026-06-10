"use client";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: "var(--bg)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" 
             style={{ backgroundColor: "var(--emerald)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-md">
        <div className="card rounded-[5px] p-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20" style={{ color: "var(--emerald)" }} />
          </div>

          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Payment Successful!
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Thank you! Your subscription has been activated.
          </p>

          <div className="space-y-4">
            <Link href="/dashboard" className="block w-full py-3 rounded-[5px] text-white font-semibold" 
                  style={{ backgroundColor: "var(--emerald)" }}>
              Go to Dashboard
            </Link>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-[5px] border font-medium flex items-center justify-center gap-2 hover:bg-[var(--bg-surface)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}