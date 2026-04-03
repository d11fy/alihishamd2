"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  centered = true,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(centered && "text-center", className)}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4",
            light
              ? "bg-white/20 text-white border border-white/30"
              : "bg-primary-50 text-primary-600 border border-primary-100"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          {badge}
        </motion.span>
      )}

      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4",
          light ? "text-white" : "text-gray-900"
        )}
      >
        {title}{" "}
        {highlight && (
          <span className="text-gradient-gold">{highlight}</span>
        )}
      </h2>

      {description && (
        <p
          className={cn(
            "text-lg leading-relaxed max-w-2xl",
            centered && "mx-auto",
            light ? "text-white/80" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
