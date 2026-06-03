
import { Footer } from "../components/marketing/Footer";
import { Navbar } from "../components/marketing/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0A1423] min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
