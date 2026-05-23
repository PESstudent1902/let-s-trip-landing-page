"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    text: "We had our itinerary customized as per our need and LetsTrip did a good job in addressing our list. The recommendation and issues were heard. LetsTrip is a reliable source and would definitely recommended as you would get surety of services.",
    name: "Amrita Keshari",
    location: "Thailand",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amrita",
  },
  {
    text: "Everything was so good. Your team services and arrangements were very good. Eagerly waiting for planning my next trip with you again. Your agent handling our trip did an amazing job for us.",
    name: "Himanshu Gupta",
    location: "Maldives",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Himanshu",
  },
  {
    text: "The cultural immersion in Thailand was unforgettable. Our guide knew every hidden gem, every secret temple, every authentic restaurant. We felt like locals. Truly unforgettable. Highly recommended!",
    name: "Meera K.",
    location: "Thailand",
    rating: 4.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
  },
  {
    text: "Our family took a trip to Indonesia this summer booked through LetsTrip. All of the flights went smoothly and there was an english speaking tour guide to pick us up at each location. Five-star treatment!",
    name: "Priya Sharma",
    location: "Bali",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="reviews" className="relative py-20 md:py-28 overflow-hidden bg-abyss">
      {/* Abstract Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-cyan/30 text-cyan text-sm tracking-wide mb-6" style={{ fontFamily: "var(--font-handwritten)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" />
            Guest Experiences
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl leading-tight" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Stories from the </span>
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">road</span>
          </h2>
        </motion.div>

        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 glass-strong rounded-full border border-white/10 hover:border-cyan/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft className="text-cyan" size={28} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 glass-strong rounded-full border border-white/10 hover:border-cyan/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight className="text-cyan" size={28} />
          </button>

        {/* Horizontal Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[320px] sm:min-w-[400px] md:min-w-[450px] snap-start"
            >
              <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 h-full relative overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col border border-white/10">
                {/* Red Stamp visual element */}
                <div className="absolute top-8 right-8 w-16 h-16 md:w-20 md:h-20 opacity-30 group-hover:opacity-50 transition-opacity rotate-12 pointer-events-none">
                  <div className="w-full h-full border-2 border-orange/80 rounded-lg flex items-center justify-center p-1">
                    <div className="w-full h-full border border-orange/60 rounded flex flex-col items-center justify-center text-[8px] md:text-[10px] text-orange/80 font-bold uppercase tracking-tighter">
                      <span>LetsTrip</span>
                      <div className="w-8 h-px bg-orange/40 my-1" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                <Quote className="text-cyan mb-6 md:mb-8" size={40} strokeWidth={1} />

                <p className="text-white text-base md:text-lg leading-relaxed mb-8 md:mb-12 flex-1 italic font-light" style={{ fontFamily: "var(--font-handwritten)" }}>
                  "{t.text}"
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-cyan/20 bg-white/5 flex items-center justify-center">
                      <User size={24} className="text-cyan/50" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base md:text-lg" style={{ fontFamily: "var(--font-headline)" }}>{t.name}</h4>
                      <p className="text-cyan/80 text-xs md:text-sm" style={{ fontFamily: "var(--font-handwritten)" }}>{t.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, starIdx) => (
                        <Star 
                          key={starIdx} 
                          size={14} 
                          className={starIdx < Math.floor(t.rating) ? "text-orange fill-orange" : "text-white/20"} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Rating {t.rating}/5</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

        {/* Scroll Progress indicator */}
        <div className="flex justify-center gap-3 mt-4">
          {testimonials.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/10" />
          ))}
        </div>
      </div>
    </section>
  );
}
