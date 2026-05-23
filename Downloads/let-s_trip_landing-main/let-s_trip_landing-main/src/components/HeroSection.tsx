"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDestinations } from "@/app/actions";
import { Destination } from "@/lib/packageStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Generates a deterministic low-discrepancy sequence value.
 * Used for stable particle placement without render-time randomness.
 */
function halton(index: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  width: `${2 + Math.floor(halton(i + 1, 2) * 5)}px`,
  height: `${2 + Math.floor(halton(i + 1, 3) * 5)}px`,
  left: `${Math.round(halton(i + 1, 5) * 100)}%`,
  top: `${Math.round(halton(i + 1, 7) * 100)}%`,
}));

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>("");

  useEffect(() => {
    fetchDestinations().then((dests) => {
      setDestinations(dests);
    });
  }, []);

  const handleSearch = () => {
    if (selectedDestId) {
      router.push(`/destinations/${selectedDestId}`);
    } else {
      document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!parallaxRef.current || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(parallaxRef.current, {
        y: 200,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const particles = document.querySelectorAll(".hero-particle");
      particles.forEach((particle) => {
        gsap.to(particle, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          opacity: "random(0.2, 0.8)",
          duration: "random(3, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);



  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 z-0 gpu-accelerated">
        <Image src="/hero-bg.png" alt="Breathtaking aerial view of tropical waters" fill className="object-cover" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/40 to-abyss" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/50 via-transparent to-abyss/50" />
      </div>

      {PARTICLES.map((particle, i) => (
        <div key={i} className="hero-particle absolute rounded-full bg-cyan/20" style={{ ...particle, filter: "blur(1px)" }} />
      ))}

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 text-center pt-28 pb-10 md:pb-16">
        {/* Handwritten badge — like a passport stamp */}
        <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-cyan/30 text-cyan text-sm md:text-base tracking-wide" style={{ fontFamily: "var(--font-handwritten)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" />
            Curated Luxury Travel Experiences ✦
          </span>
        </motion.div>

        {/* Main headline — brush script for emotional impact */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-4 md:mb-6">
          <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Where </span>
            <span className="bg-gradient-to-r from-cyan via-cyan-dim to-violet bg-clip-text text-transparent text-glow-cyan">Wanderlust</span>
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-secondary mt-2 md:mt-3" style={{ fontFamily: "var(--font-handwritten)" }}>
            meets experience
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-text-secondary text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed px-2">
          Curated luxury travel experiences designed to make every moment extraordinary. From Bali sunsets to Dubai skylines.
        </motion.p>

        {/* Search Bar — ClearTrip Style */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl mx-auto">
          <div className="glass-strong p-3 md:p-4 rounded-3xl flex flex-col md:flex-row gap-3 shadow-2xl border border-white/20">
            
            <div className="flex-1 flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-2xl px-4 py-3 border border-white/10 group cursor-pointer relative">
              <MapPin className="text-cyan mr-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="flex-1 text-left">
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-0.5">Where to?</p>
                <select 
                  className="w-full bg-transparent text-white font-bold text-lg md:text-xl appearance-none outline-none cursor-pointer" 
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  <option value="" className="bg-abyss text-white">Any Destination</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id} className="bg-abyss text-white">{d.name}</option>
                  ))}
                </select>
              </div>
              <ChevronDown className="text-white/50 pointer-events-none absolute right-4" size={20} />
            </div>



            <button onClick={handleSearch} className="md:w-auto w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan to-violet hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
              <Search className="text-white group-hover:scale-110 transition-transform" size={20} />
              <span className="text-white font-bold tracking-wide" style={{ fontFamily: "var(--font-headline)" }}>Explore</span>
            </button>
            
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 md:mt-12 hidden md:block">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-text-muted text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-handwritten)" }}>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2">
              <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-cyan" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* No modal required (hyperlink routing enabled) */}
    </section>
  );
}
