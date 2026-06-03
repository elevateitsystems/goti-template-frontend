import { ReduxProvider } from "@/redux/provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrimeIQ Intelligence",
  description:
    "The Bloomberg Terminal for Sports Betting — Premium Analytics Platform",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0A1423] min-h-screen">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
