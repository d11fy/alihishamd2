"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  GraduationCap,
  ArrowLeft,
  Star,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEGREE_LEVEL_LABELS,
  SCHOLARSHIP_TYPE_LABELS,
  type Scholarship,
} from "@/types";
import { formatDate, isDeadlineSoon, isDeadlinePassed, truncateText } from "@/lib/utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  index?: number;
}

const scholarshipTypeColors: Record<string, string> = {
  FULLY_FUNDED: "gold",
  PARTIALLY_FUNDED: "teal",
  TUITION_ONLY: "blue",
  LIVING_ALLOWANCE: "purple",
  RESEARCH_GRANT: "green",
  EXCHANGE: "orange",
};

export default function ScholarshipCard({ scholarship, index = 0 }: ScholarshipCardProps) {
  const deadlineSoon = isDeadlineSoon(scholarship.deadline);
  const deadlinePassed = isDeadlinePassed(scholarship.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-brand-sm hover:shadow-brand-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-brand overflow-hidden flex-shrink-0">
        {scholarship.coverImage ? (
          <Image
            src={scholarship.coverImage}
            alt={scholarship.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-dots">
            <GraduationCap className="w-16 h-16 text-white/30" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {scholarship.isFeatured && (
            <span className="flex items-center gap-1 bg-gold-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              <Star className="w-3 h-3 fill-white" />
              مميزة
            </span>
          )}
          {deadlineSoon && !deadlinePassed && (
            <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              <Clock className="w-3 h-3" />
              تنتهي قريبًا
            </span>
          )}
          {deadlinePassed && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              منتهية
            </span>
          )}
        </div>

        {/* Country badge */}
        <div className="absolute bottom-3 right-3">
          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
            <MapPin className="w-3 h-3" />
            {scholarship.country}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Type badge */}
        <div className="mb-3">
          <Badge
            variant={
              (scholarshipTypeColors[scholarship.scholarshipType] as Parameters<typeof Badge>[0]["variant"]) ?? "default"
            }
          >
            {SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType]}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
          {scholarship.title}
        </h3>

        {/* Provider */}
        <p className="text-sm font-semibold text-gold-600 mb-2">{scholarship.provider}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1 line-clamp-2">
          {truncateText(scholarship.shortDescription, 120)}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4">
          {scholarship.deadline && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-primary-400" />
              <span>{formatDate(scholarship.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <GraduationCap className="w-3.5 h-3.5 text-primary-400" />
            <span>
              {scholarship.degreeLevel
                .slice(0, 2)
                .map((d) => DEGREE_LEVEL_LABELS[d])
                .join(" • ")}
              {scholarship.degreeLevel.length > 2 && ` +${scholarship.degreeLevel.length - 2}`}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button asChild variant="outline" className="w-full group/btn">
          <Link href={`/scholarships/${scholarship.slug}`}>
            <span>عرض التفاصيل</span>
            <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform flip-rtl" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
