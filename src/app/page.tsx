import { Navbar } from "./components/marketing/Navbar";
import { Hero } from "./components/marketing/Hero";
import { TrustIndicators } from "./components/marketing/TrustIndicators";
import { BettorsTrap } from "./components/marketing/BettorsTrap";
import { DashboardDemo } from "./components/marketing/DashboardDemo";
import { CorePillars } from "./components/marketing/CorePillars";
import { AdvancedTools } from "./components/marketing/AdvancedTools";
import { Pricing } from "./components/marketing/Pricing";
import { Footer } from "./components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="bg-[#0A1423] min-h-screen selection:bg-accent-green selection:text-navy-DEFAULT">
      <Navbar />
      <main>
        <Hero />
        <TrustIndicators />
        <BettorsTrap />
        <DashboardDemo />
        <CorePillars />
        <AdvancedTools />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
