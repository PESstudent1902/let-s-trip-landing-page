"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Camera, Globe, MessageSquare, Play, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const quickLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Contact Us", href: "#contact" },
  { label: "Reviews", href: "#reviews" },
];

const destinations = ["Thailand", "Dubai", "Singapore", "Bali", "Maldives", "Vietnam"];

const socials = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: MessageSquare, href: "#", label: "Twitter" },
  { icon: Play, href: "#", label: "Youtube" },
];

/* Accordion section for mobile */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <h4 className="text-sm font-bold tracking-[0.1em] uppercase text-text-muted" style={{ fontFamily: "var(--font-headline)" }}>{title}</h4>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-glass-border">
      <div className="absolute inset-0 bg-gradient-to-t from-[#020810] to-abyss" />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>
                <span className="text-cyan">Lets</span><span className="text-text-primary">Trip</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Curated luxury travel experiences designed to make every moment extraordinary. Your journey begins here.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="p-2.5 glass rounded-xl hover:border-cyan/30 hover:text-cyan transition-all text-text-muted">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-secondary hover:text-cyan transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((d) => (
                <li key={d}>
                  <Link href="#destinations" className="text-text-secondary hover:text-cyan transition-colors text-sm flex items-center gap-2">
                    <MapPin size={12} className="text-cyan/50" /> {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Get In Touch</h4>
            <ContactInfo />
          </div>
        </div>

        {/* Mobile Layout: Accordion + Brand */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-6 pb-6 border-b border-white/5">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>
                <span className="text-cyan">Lets</span><span className="text-text-primary">Trip</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Curated luxury travel experiences designed to make every moment extraordinary. Your journey begins here.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="p-2.5 glass rounded-xl text-text-muted">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <AccordionSection title="Quick Links">
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-secondary text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title="Destinations">
            <ul className="space-y-3">
              {destinations.map((d) => (
                <li key={d}>
                  <Link href="#destinations" className="text-text-secondary text-sm flex items-center gap-2">
                    <MapPin size={12} className="text-cyan/50" /> {d}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title="Get In Touch">
            <ContactInfo />
          </AccordionSection>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs text-center md:text-left">© 2026 LetsTrip. All rights reserved. Crafted with ✦ for wanderers.</p>
          <div className="flex gap-4 md:gap-6 text-text-muted text-xs">
            <Link href="#" className="hover:text-cyan transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-cyan transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-cyan transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Shared contact info */
function ContactInfo() {
  return (
    <ul className="space-y-4">
      <li className="flex items-start gap-3 text-text-secondary text-sm">
        <div className="p-2 glass rounded-lg mt-1 border border-white/5">
          <MapPin size={14} className="text-cyan" />
        </div>
        <div>
          <span className="block font-semibold text-text-primary mb-1">Store Location</span>
          Indira Nagar, HAL, Bangalore
        </div>
      </li>
      <li className="flex items-start gap-3 text-text-secondary text-sm">
        <div className="p-2 glass rounded-lg mt-1 border border-green-400/20">
          <Phone size={14} className="text-green-400" />
        </div>
        <div>
          <span className="block font-semibold text-text-primary mb-1">Phone Number</span>
          <a href="https://wa.me/918867767171" className="hover:text-green-400 transition-colors">+91 88677 67171</a>
        </div>
      </li>
      <li className="flex items-start gap-3 text-text-secondary text-sm">
        <div className="p-2 glass rounded-lg mt-1 border border-orange/20">
          <Phone size={14} className="text-orange" />
        </div>
        <div>
          <span className="block font-semibold text-text-primary mb-1">Product Expert</span>
          <a href="https://wa.me/918867767474" className="hover:text-orange transition-colors">+91 88677 67474</a>
        </div>
      </li>
      <li className="flex items-start gap-3 text-text-secondary text-sm">
        <div className="p-2 glass rounded-lg mt-1 border border-cyan/20">
          <Mail size={14} className="text-cyan" />
        </div>
        <div>
          <span className="block font-semibold text-text-primary mb-1">Email us</span>
          <a href="mailto:connect@letstrip.co.in" className="hover:text-cyan transition-colors">connect@letstrip.co.in</a>
        </div>
      </li>
      <li className="text-xs text-text-muted mt-2">
        Mondays - Sundays<br />
        10am to 8pm
      </li>
    </ul>
  );
}
