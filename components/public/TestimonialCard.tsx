"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative bg-white rounded-2xl p-6 shadow-brand border border-gray-100 hover:shadow-brand-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Quote icon */}
      <div className="absolute -top-4 right-6 w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center shadow-gold">
        <Quote className="w-4 h-4 text-white fill-white" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4 mt-2">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
        "{testimonial.testimonial}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-400 to-teal-400">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.studentName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {testimonial.studentName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{testimonial.studentName}</p>
          <p className="text-xs text-gold-600 font-medium">{testimonial.subtitle}</p>
          {testimonial.country && (
            <p className="text-xs text-gray-400">{testimonial.country}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
