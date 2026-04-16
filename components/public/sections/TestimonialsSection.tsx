"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/public/SectionHeading";
import TestimonialCard from "@/components/public/TestimonialCard";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  settings?: Record<string, string>;
}

export default function TestimonialsSection({ testimonials, settings = {} }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-gradient-brand relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge={settings.testimonials_badge ?? "قصص النجاح"}
          title={settings.testimonials_title ?? "طلاب وصلوا"}
          highlight={settings.testimonials_highlight ?? "للعالم"}
          description={settings.testimonials_description ?? "قصص حقيقية لطلاب من غزة حققوا أحلامهم بالدراسة في الخارج"}
          light
          className="mb-14"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
