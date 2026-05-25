import Link from "next/link";

export default function LendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1423]">
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Lending — Coming Soon
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          We're building lending features right now. Sign up for updates or check
          back soon — exciting things are coming.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-accent-green text-navy-DEFAULT rounded-[5px] font-medium"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
