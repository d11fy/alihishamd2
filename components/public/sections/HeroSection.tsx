"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, GraduationCap, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: GraduationCap, label: "منح دراسية" },
  { icon: Globe, label: "قبولات جامعية" },
  { icon: FileText, label: "تجهيز الملفات" },
];

interface HeroSectionProps {
  settings?: Record<string, string>;
}

export default function HeroSection({ settings = {} }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-primary-400/10 blur-2xl animate-float" style={{ animationDelay: "0.7s" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Dots pattern */}
        <div className="absolute inset-0 bg-dots opacity-20" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/90 text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            {settings.hero_badge ?? "لا نبيع خدمات، نبيع نتائج"}
            <Sparkles className="w-4 h-4 text-gold-400" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            {settings.hero_title_line1 ?? "نوصلك من غزة"}
            <br />
            <span className="text-gradient-gold">للعالم</span>
            <br />
            بخطوات{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-teal-400">واضحة وسهلة</span>
              <motion.span
                className="absolute bottom-2 left-0 right-0 h-3 bg-teal-500/20 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Sub heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {settings.hero_subtitle ?? "منصة متخصصة في المنح الدراسية الخارجية، القبولات الجامعية، وتجهيز ملفات السفر. حلمك بالدراسة في الخارج نحوّله لواقع بخطوات مدروسة ونتائج مضمونة."}
          </motion.p>

          {/* Features pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-teal-400" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild variant="gold" size="xl" className="min-w-[200px] shadow-gold-glow">
              <Link href="/scholarships">
                <GraduationCap className="w-5 h-5" />
                {settings.hero_cta_primary ?? "استعرض المنح"}
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="min-w-[200px] bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm shadow-none"
            >
              <Link href="/contact">
                {settings.hero_cta_secondary ?? "احجز استشارة مجانية"}
                <ArrowLeft className="w-5 h-5 flip-rtl" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs font-medium">مرر للأسفل</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
          >
            <span className="w-1 h-2 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
