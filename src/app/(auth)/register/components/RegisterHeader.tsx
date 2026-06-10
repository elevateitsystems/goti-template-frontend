import Link from "next/link";

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <Link
        href="/"
        className="w-14 h-14 rounded-[5px] flex items-center justify-center mb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--emerald), #2F7D5B)",
        }}
      >
        <span className="text-white font-bold text-xl font-body z-10">PE</span>
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
