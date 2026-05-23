import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import MobileWhatsAppCTA from "@/components/MobileWhatsAppCTA";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <TestimonialsSection />
      <Footer />
      <MobileWhatsAppCTA />
    </main>
  );
}
// Trigger Vercel Redeployment for Env Vars
