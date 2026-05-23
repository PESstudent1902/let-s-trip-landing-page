"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#destinations" },
  { label: "Contact Us", href: "https://wa.me/918867767171", external: true },
  { label: "Reviews", href: "#reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3" : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 flex items-center justify-between">
          {/* Brush Script Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <motion.div className="relative" whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <span className="text-3xl md:text-4xl text-glow-cyan" style={{ fontFamily: "var(--font-brush)" }}>
                <span className="bg-gradient-to-r from-cyan via-cyan-dim to-white bg-clip-text text-transparent">Let&apos;sTrip</span>
              </span>
              <span className="absolute -bottom-2 right-0 text-[10px] md:text-xs text-text-muted italic tracking-wider" style={{ fontFamily: "var(--font-handwritten)" }}>
                the journey begins...
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links — organic underline style, not buttons */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="adventure-link text-text-secondary hover:text-white text-sm font-medium tracking-wide"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA — flowing text link, not a button */}
          <div className="hidden md:block">
            <MagneticButton>
              <a
                href="https://wa.me/918867767171"
                target="_blank" rel="noopener noreferrer"
                className="group/cta flex items-center gap-2 text-orange hover:text-warm transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-brush)" }}
              >
                <span className="text-lg">Book Your Adventure</span>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl"
                >
                  →
                </motion.span>
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-primary p-2 z-[60] relative"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Full-screen Mobile Menu — adventure journal style */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-abyss/95 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-20">
              {/* Logo in menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
              >
                <span className="text-4xl bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent" style={{ fontFamily: "var(--font-brush)" }}>
                  Let&apos;sTrip
                </span>
              </motion.div>

              <nav className="flex flex-col items-center gap-1 mb-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => !link.external && setMobileOpen(false)}
                      className="text-3xl text-text-secondary hover:text-white transition-colors py-3 block"
                      style={{ fontFamily: "var(--font-brush)" }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* WhatsApp CTA — organic, not a button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <a
                  href="https://wa.me/918867767171"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="group inline-flex flex-col items-center gap-1"
                >
                  <span className="text-2xl text-orange" style={{ fontFamily: "var(--font-brush)" }}>
                    Start your journey
                  </span>
                  <span className="flex items-center gap-2 text-text-muted text-sm" style={{ fontFamily: "var(--font-handwritten)" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.533-1.471A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.727-5.99-1.958l-.418-.312-2.688.872.896-2.634-.343-.446A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    via WhatsApp
                  </span>
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-muted text-sm mt-8"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                +91 88677 67171
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Magnetic Button Effect */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    window.requestAnimationFrame(() => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.15;
      const y = (e.clientY - top - height / 2) * 0.15;
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    window.requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.transform = "translate(0, 0)";
      ref.current.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block transition-transform"
    >
      {children}
    </div>
  );
}

export { MagneticButton };
