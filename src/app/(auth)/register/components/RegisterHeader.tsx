import Link from "next/link";
import { PrimeIQLogo } from "@/components/brand/PrimeIQLogo";

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <Link
        href="/"
        className="mb-4 transition-transform hover:scale-105"
        aria-label="PrimeIQ home"
      >
        <PrimeIQLogo className="h-28 w-auto" priority />
      </Link>
      <h1
        className="font-display text-2xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Create Your Account
      </h1>
      <p
        className="text-sm font-body mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        Start getting an edge today
      </p>
    </div>
  );
}
