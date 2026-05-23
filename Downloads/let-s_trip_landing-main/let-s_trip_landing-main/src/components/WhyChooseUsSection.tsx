"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plane, Compass, Palmtree } from "lucide-react";

const features = [
  { icon: Plane, title: "500+ Destinations", description: "Handpicked locations across the globe for every kind of traveler", accent: "from-cyan/20 to-violet/10", iconColor: "text-cyan" },
  { icon: Compass, title: "Best Price Guarantee", description: "We match any price — luxury travel without the luxury price tag", accent: "from-orange/20 to-gold/10", iconColor: "text-orange" },
  { icon: Palmtree, title: "Top Notch Support", description: "24/7 dedicated support — just a WhatsApp message away", accent: "from-violet/20 to-cyan/10", iconColor: "text-violet" },
];

export default function WhyChooseUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] rounded-full bg-cyan/3 blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-10 md:mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-orange/30 text-orange text-sm tracking-wide mb-4 md:mb-6" style={{ fontFamily: "var(--font-handwritten)" }}>
            <span className="w-2 h-2 rounded-full bg-orange pulse-glow" />
            Why LetsTrip
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Why Choose </span>
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">Us</span>
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-handwritten)" }}>
            We believe that travel is more than just visiting new places.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center gap-4 md:gap-5 hover:border-white/15 transition-all duration-500 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`relative z-10 p-4 rounded-2xl border border-dashed border-white/10 group-hover:border-white/20 transition-all ${feat.iconColor}`}>
                <feat.icon size={36} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 text-center">
                <h3 className="text-xl md:text-2xl mb-2" style={{ fontFamily: "var(--font-brush)" }}>{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed" style={{ fontFamily: "var(--font-handwritten)" }}>{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
