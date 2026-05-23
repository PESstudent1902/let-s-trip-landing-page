"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { MagneticButton } from "./Navbar";

export default function ConciergeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="contact" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] rounded-full bg-green-500/5 blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mx-auto glass rounded-[2rem] p-6 sm:p-8 md:p-14 border border-green-500/10 relative overflow-hidden">
          {/* Decorative corner flourishes */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-dashed border-green-500/20 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-dashed border-green-500/20 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-dashed border-green-500/20 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-dashed border-green-500/20 rounded-br-xl" />

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-green-400/20 text-green-400 text-sm tracking-wide mb-6" style={{ fontFamily: "var(--font-handwritten)" }}>
            <MessageCircle size={14} /> Direct Connection
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl mb-4 md:mb-6" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Ready to plan your</span><br />
            <span className="bg-gradient-to-r from-green-400 to-cyan bg-clip-text text-transparent">Dream Vacation?</span>
          </h2>
          
          <p className="text-text-secondary text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-handwritten)" }}>
            Skip the forms. Connect with our travel experts directly on WhatsApp to get personalized packages tailored to your vibe and budget.
          </p>

          {/* Organic WhatsApp CTA — not a button, an invitation */}
          <MagneticButton>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer"
               className="group inline-flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
              <span className="flex items-center gap-3 text-xl md:text-2xl text-green-400 hover:text-green-300 transition-colors" style={{ fontFamily: "var(--font-brush)" }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.533-1.471A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.727-5.99-1.958l-.418-.312-2.688.872.896-2.634-.343-.446A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Chat with us on WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-green-400/50 group-hover:w-20 transition-all duration-500" />
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-green-400/60">✦</motion.span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-green-400/50 group-hover:w-20 transition-all duration-500" />
              </span>
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
