"use client";

import { useState, useEffect } from "react";
import ItineraryModal from "./ItineraryModal";
import { Package, Destination } from "@/lib/packageStore";

export function openItinerary(pkg: Package, destination?: Destination) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-itinerary", { detail: { pkg, destination } }));
  }
}

export default function ItineraryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [destination, setDestination] = useState<Destination | undefined>();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedPkg(customEvent.detail.pkg);
      setDestination(customEvent.detail.destination);
      setIsOpen(true);
    };
    window.addEventListener("open-itinerary", handleOpen);
    return () => window.removeEventListener("open-itinerary", handleOpen);
  }, []);

  return (
    <ItineraryModal
      pkg={selectedPkg}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      destination={destination}
    />
  );
}
