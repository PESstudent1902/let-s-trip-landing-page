"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, Compass, Ship, Wind, Snowflake, 
  MessageSquare, DollarSign, Award 
} from "lucide-react";
import { type Destination, type Package } from "@/lib/packageStore";
import { fetchDestinations, fetchPackages } from "@/app/actions";

function getAdventureIcon(id: string) {
  if (id.includes("bungee")) return <Compass className="text-black group-hover:text-white" size={20} />;
  if (id.includes("rafting")) return <Ship className="text-black group-hover:text-white" size={20} />;
  if (id.includes("paragliding")) return <Wind className="text-black group-hover:text-white" size={20} />;
  return <Snowflake className="text-black group-hover:text-white" size={20} />;
}

export default function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const loadData = useCallback(async () => {
    const [dests, pkgs] = await Promise.all([fetchDestinations(), fetchPackages()]);
    setDestinations(dests);
    setPackages(pkgs);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Helper arrays filtered for sections
  const expertPickDests = destinations.filter(d => 
    ["thailand", "france", "egypt", "maldives"].includes(d.id)
  );

  const adventurePkgs = packages.filter(p => 
    p.sections?.includes("adventures") || ["pkg-bungee", "pkg-rafting", "pkg-paragliding", "pkg-skiing"].includes(p.id)
  );

  const domesticDests = destinations.filter(d => 
    ["lucerne", "laax", "interlaken", "zurich", "zermatt"].includes(d.id)
  );

  return (
    <section id="destinations" className="relative py-20 overflow-hidden bg-[#050B1F]">
      <div className="absolute inset-0 bg-[#050B1F] z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B1F] via-[#0A1628] to-[#050B1F] opacity-80 z-0" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 space-y-24 md:space-y-32">

        {/* ============================================================
           1. EXPERT PICKS ITINERARIES
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Expert Picks Itineraries
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan to-transparent opacity-20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertPickDests.map((dest) => (
              <Link 
                href={`/destinations/${dest.id}`} 
                key={dest.id} 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg"
              >
                <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white font-bold text-lg md:text-xl">
                  <MapPin size={18} className="text-cyan animate-pulse" />
                  <span style={{ fontFamily: "var(--font-headline)" }}>{dest.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================
           2. ADVENTURES FOR YOU
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Adventures for you
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange to-transparent opacity-20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adventurePkgs.map((pkg) => (
              <Link 
                href={`/packages/${pkg.id}`} 
                key={pkg.id} 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg"
              >
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* White bottom banner overlapping the bottom of the card */}
                <div className="absolute bottom-5 left-4 right-4 bg-white text-black p-3.5 rounded-2xl flex items-center gap-3 shadow-2xl transition-all duration-300 group-hover:bg-cyan group-hover:text-white">
                  <div className="p-2 rounded-xl bg-black/5 transition-colors group-hover:bg-white/20">
                    {getAdventureIcon(pkg.id)}
                  </div>
                  <span className="font-bold text-sm md:text-base tracking-wide" style={{ fontFamily: "var(--font-headline)" }}>
                    {pkg.name.replace(" Adventure", "").replace(" in River Rapids", "").replace(" Tandem Flight", "").replace(" Experience", "")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================
           3. HONEYMOON SPECIAL WIDE BANNER
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Honeymoon
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent opacity-20" />
          </div>

          <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[340px] md:min-h-[400px] flex items-center p-8 md:p-16">
            <Image src="/almaty.png" alt="Big Almaty Lake" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-0" />
            
            <div className="relative z-10 max-w-2xl text-left">
              <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan uppercase block mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                #KazakhstanWithDook
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 text-white" style={{ fontFamily: "var(--font-headline)" }}>
                Mountain Magic, Modern Vibes,<br />Endless Hospitality.
              </h3>
              <p className="text-lg sm:text-xl font-medium text-text-secondary mb-8" style={{ fontFamily: "var(--font-headline)" }}>
                Discover Almaty.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/packages/pkg-almaty" className="px-8 py-4 rounded-2xl bg-[#FF385C] hover:bg-[#FF385C]/90 text-white font-bold text-sm tracking-wide text-center transition-all shadow-xl hover:scale-[1.02]">
                  RESERVE YOUR SPOT
                </Link>
                <span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                  Starting @72,990* PP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
           4. DOMESTIC TOURS (SWISS CARDS IN THE SCREENSHOT)
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Domestic Tours
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400 to-transparent opacity-20" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {domesticDests.map((dest) => (
              <Link 
                href={`/destinations/${dest.id}`} 
                key={dest.id} 
                className="relative aspect-[3/5] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg"
              >
                <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                  <span className="text-white font-bold text-base md:text-lg block transition-colors group-hover:text-cyan" style={{ fontFamily: "var(--font-headline)" }}>
                    {dest.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================
           5. EXPLORE DESTINATIONS
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Explore Destinations
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-violet to-transparent opacity-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Maldives */}
            <Link href="/destinations/maldives" className="relative aspect-[3/4] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg">
              <Image src="/maldives.png" alt="Maldives" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-bold text-2xl flex items-center gap-2">
                <MapPin size={22} className="text-cyan" />
                <span style={{ fontFamily: "var(--font-headline)" }}>Maldives</span>
              </div>
            </Link>

            {/* Canada */}
            <Link href="/destinations/canada" className="relative aspect-[3/4] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg">
              <Image src="/canada.png" alt="Canada" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                  <MapPin size={22} className="text-cyan" />
                  <span style={{ fontFamily: "var(--font-headline)" }}>Canada</span>
                </div>
                <div className="h-px bg-white/20 my-3" />
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span className="font-semibold" style={{ fontFamily: "var(--font-body)" }}>3+ Tour Packages</span>
                  <span className="text-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ fontFamily: "var(--font-headline)" }}>
                    Explore →
                  </span>
                </div>
              </div>
            </Link>

            {/* Italy */}
            <Link href="/destinations/italy" className="relative aspect-[3/4] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg">
              <Image src="/italy.png" alt="Italy" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-bold text-2xl flex items-center gap-2">
                <MapPin size={22} className="text-cyan" />
                <span style={{ fontFamily: "var(--font-headline)" }}>Italy</span>
              </div>
            </Link>
          </div>
        </div>

        {/* ============================================================
           6. WHY CHOOSE US
           ============================================================ */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
              Why Choose Us
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-2" style={{ fontFamily: "var(--font-body)" }}>
              We believe that travel is more than just visiting new places.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-cyan-subtle border border-cyan/20 text-cyan mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                500+ Destinations
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Handpicked locations across the globe for every kind of traveler.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-orange-glow/10 border border-orange/20 text-orange mb-6">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Best Price Guarantee
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                We match any price – luxury travel without the luxury price tag.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-violet-glow/10 border border-violet/20 text-violet mb-6">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Top Notch Support
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                24/7 dedicated support – just a WhatsApp message away.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
