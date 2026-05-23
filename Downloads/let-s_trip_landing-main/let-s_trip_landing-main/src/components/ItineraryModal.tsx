"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { Package, Destination } from "@/lib/packageStore";
import { MagneticButton } from "./Navbar";
import { useState, useEffect } from "react";

interface ItineraryModalProps {
  pkg: Package | null;
  isOpen: boolean;
  onClose: () => void;
  destination?: Destination;
}

export default function ItineraryModal({ pkg, isOpen, onClose, destination }: ItineraryModalProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!pkg) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-abyss/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A1118] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden" data-lenis-prevent>
              {/* Left Column: Summary & Image */}
              <div className="w-full md:w-2/5 flex flex-col relative flex-shrink-0">
                <div className="relative h-64 md:h-1/2 w-full">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1118] to-transparent" />
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#0A1118]">
                  <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-cyan text-sm" style={{ fontFamily: "var(--font-handwritten)" }}>
                    <div className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {destination?.name || "Destination"}
                    </div>
                    {destination?.bestTimeToVisit && (
                      <div className="inline-flex items-center gap-1.5 text-text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                        Best time: <span className="text-white/90">{destination.bestTimeToVisit}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl mb-2 text-white" style={{ fontFamily: "var(--font-brush)" }}>
                    {pkg.name}
                  </h2>
                  <div className="text-2xl text-cyan mb-6 font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                    {pkg.price}
                    <span className="text-sm font-normal text-text-muted ml-2">per person</span>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <h4 className="text-sm uppercase tracking-widest text-text-muted font-bold mb-3">Highlights</h4>
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 size={16} className="text-cyan mt-0.5 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <MagneticButton>
                    <a
                      href={`https://wa.me/918867767171?text=Hi! I am interested in booking the ${pkg.name} package.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan to-violet text-white font-bold tracking-wide hover:opacity-90 transition-opacity"
                    >
                      Book on WhatsApp <ChevronRight size={18} />
                    </a>
                  </MagneticButton>
                </div>
              </div>

              {/* Right Column: Itinerary Details */}
              <div className="w-full md:w-3/5 p-6 md:p-8 md:overflow-y-auto bg-white/[0.02]" data-lenis-prevent>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-cyan/10">
                    <Calendar className="text-cyan" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl text-white" style={{ fontFamily: "var(--font-headline)" }}>Tour Itinerary</h3>
                    <p className="text-text-muted text-sm" style={{ fontFamily: "var(--font-handwritten)" }}>
                      {pkg.durationNights ? `${pkg.durationNights} Nights / ${pkg.durationNights + 1} Days` : "Detailed Day-by-Day Plan"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  {/* Timeline connecting line */}
                  <div className="absolute left-[1.35rem] top-4 bottom-4 w-px bg-white/10 hidden sm:block" />

                  {pkg.itinerary && pkg.itinerary.length > 0 ? (
                    pkg.itinerary.map((day, i) => (
                      <div key={i} className="relative z-10 flex gap-4 sm:gap-6">
                        <div className="hidden sm:flex flex-col items-center mt-1">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${expandedDay === day.day ? 'bg-cyan text-abyss border-cyan' : 'bg-[#0A1118] text-text-muted border-white/20'}`}>
                            D{day.day}
                          </div>
                        </div>
                        
                        <div 
                          className={`flex-1 rounded-2xl border transition-all cursor-pointer ${expandedDay === day.day ? 'bg-white/[0.05] border-cyan/30' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                          onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                        >
                          <div className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="sm:hidden text-cyan font-bold text-sm bg-cyan/10 px-2 py-1 rounded-md">Day {day.day}</span>
                              <h4 className={`font-bold transition-colors ${expandedDay === day.day ? 'text-white' : 'text-text-secondary'}`}>
                                {day.title}
                              </h4>
                            </div>
                            <ChevronRight size={18} className={`text-text-muted transition-transform ${expandedDay === day.day ? 'rotate-90 text-cyan' : ''}`} />
                          </div>
                          
                          <AnimatePresence>
                            {expandedDay === day.day && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-5 sm:px-5 pt-0">
                                  <ul className="space-y-2 mt-2 border-t border-white/5 pt-4">
                                    {day.details.map((detail, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan/50 mt-1.5 flex-shrink-0" />
                                        <span className="leading-relaxed">{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 glass rounded-2xl">
                      <Clock className="mx-auto text-text-muted mb-3" size={32} />
                      <p className="text-text-secondary" style={{ fontFamily: "var(--font-handwritten)" }}>
                        Detailed itinerary will be shared upon inquiry.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
