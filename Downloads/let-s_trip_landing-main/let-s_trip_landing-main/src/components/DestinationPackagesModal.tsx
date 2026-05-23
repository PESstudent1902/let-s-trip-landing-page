"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import Image from "next/image";
import { Package, Destination } from "@/lib/packageStore";
import { openItinerary } from "./ItineraryManager";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
  packages: Package[];
}

export default function DestinationPackagesModal({ isOpen, onClose, destination, packages }: ModalProps) {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-abyss/80 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-deep-space border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-violet/10 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-1" style={{ fontFamily: "var(--font-brush)" }}>
                  {destination?.name ? `Packages for ${destination.name}` : "All Travel Packages"}
                </h2>
                <div className="flex items-center gap-2 text-cyan text-sm">
                  <MapPin size={16} />
                  <span>{packages.length} {packages.length === 1 ? "Package" : "Packages"} available</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="relative z-10 p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto" data-lenis-prevent>
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className="group relative glass-strong border border-white/10 rounded-2xl overflow-hidden hover:border-cyan/30 transition-all cursor-pointer flex flex-col sm:flex-row h-full"
                      onClick={() => {
                        onClose();
                        openItinerary(pkg, destination || undefined);
                      }}
                    >
                      <div className="relative h-40 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden">
                        <Image 
                          src={pkg.image} 
                          alt={pkg.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-abyss/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-brush)" }}>{pkg.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pkg.durationNights && <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-md">{pkg.durationNights} Nights</span>}
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div>
                            <p className="text-xs text-text-muted mb-0.5">Starting from</p>
                            <p className="text-xl font-bold text-cyan" style={{ fontFamily: "var(--font-brush)" }}>{pkg.price}</p>
                          </div>
                          <span className="text-sm font-semibold text-white/70 group-hover:text-cyan transition-colors">View →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-text-muted">
                  <p>No packages found for this destination yet.</p>
                  <p className="mt-2 text-sm">Please check back later or contact us to customize a trip.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
