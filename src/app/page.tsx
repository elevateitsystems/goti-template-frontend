import { Navbar } from "./components/marketing/Navbar";
import { Hero } from "./components/marketing/Hero";
import { EdgeFeed } from "./components/marketing/EdgeFeed";
import { FeatureGrid } from "./components/marketing/FeatureGrid";
import { WhyChooseUs } from "./components/marketing/WhyChooseUs";
import { AboutUs } from "./components/marketing/AboutUs";
import { ContactUs } from "./components/marketing/ContactUs";
import { Footer } from "./components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="bg-[#0A1423] min-h-screen selection:bg-accent-green selection:text-navy-DEFAULT">
      <Navbar />
      <main>
        <Hero />
        <EdgeFeed />
        <FeatureGrid />
        <WhyChooseUs />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
