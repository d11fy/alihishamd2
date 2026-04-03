"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/scholarships", label: "المنح الدراسية" },
  { href: "/#about", label: "من نحن" },
  { href: "/#services", label: "خدماتنا" },
  { href: "/#testimonials", label: "قصص النجاح" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-brand border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span
                className={cn(
                  "block text-lg font-black leading-tight transition-colors",
                  scrolled ? "text-primary-600" : "text-white"
                )}
              >
                مسارات غزة
              </span>
              <span
                className={cn(
                  "block text-xs font-medium transition-colors",
                  scrolled ? "text-gold-500" : "text-gold-300"
                )}
              >
                Gaza Pathways
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  scrolled
                    ? "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                scrolled
                  ? "text-primary-600 border-2 border-primary-200 hover:bg-primary-50"
                  : "text-white border-2 border-white/30 hover:bg-white/10"
              )}
            >
              <Phone className="w-4 h-4" />
              واتساب
            </a>
            <Button
              asChild
              variant="gold"
              size="sm"
              className="shadow-gold hover:shadow-gold"
            >
              <Link href="/contact">احجز استشارة</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            )}
            aria-label="القائمة"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-glass-lg overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <a
                  href="https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-200 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  واتساب
                </a>
                <Button asChild variant="gold" className="flex-1">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    احجز استشارة
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
