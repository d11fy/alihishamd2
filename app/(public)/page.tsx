export const dynamic = "force-dynamic";
import { Metadata } from "next";
import HeroSection from "@/components/public/sections/HeroSection";
import AboutSection from "@/components/public/sections/AboutSection";
import ServicesSection from "@/components/public/sections/ServicesSection";
import FeaturedScholarships from "@/components/public/sections/FeaturedScholarships";
import TestimonialsSection from "@/components/public/sections/TestimonialsSection";
import ConsultationSection from "@/components/public/sections/ConsultationSection";
import StatsSection from "@/components/public/sections/StatsSection";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "مسارات غزة | Gaza Pathways - نوصلك للعالم",
  description:
    "منصة مسارات غزة - متخصصون في المنح الدراسية الخارجية، القبولات الجامعية، وتجهيز ملفات السفر. نوصلك من غزة للعالم بخطوات واضحة.",
};

async function getFeaturedScholarships() {
  try {
    return await prisma.scholarship.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [scholarshipsCount, applicationsCount] = await Promise.all([
      prisma.scholarship.count({ where: { isPublished: true } }),
      prisma.scholarshipApplication.count({ where: { status: "COMPLETED" } }),
    ]);
    return { scholarshipsCount, applicationsCount };
  } catch {
    return { scholarshipsCount: 50, applicationsCount: 5000 };
  }
}

export default async function HomePage() {
  const [featuredScholarships, testimonials, stats] = await Promise.all([
    getFeaturedScholarships(),
    getTestimonials(),
    getStats(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <AboutSection />
      <ServicesSection />
      <FeaturedScholarships scholarships={featuredScholarships} />
      <TestimonialsSection testimonials={testimonials} />
      <ConsultationSection />
    </>
  );
}
