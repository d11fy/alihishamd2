export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ScholarshipsPageClient from "./ScholarshipsPageClient";

export const metadata: Metadata = {
  title: "المنح الدراسية",
  description: "استعرض جميع المنح الدراسية المتاحة لطلاب غزة حول العالم",
};

async function getScholarships(params: {
  search?: string;
  country?: string;
  type?: string;
  degree?: string;
  page?: number;
}) {
  const pageSize = 12;
  const page = params.page || 1;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = { isPublished: true };

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { provider: { contains: params.search, mode: "insensitive" } },
      { country: { contains: params.search, mode: "insensitive" } },
      { shortDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.country) where.country = params.country;
  if (params.type) where.scholarshipType = params.type;
  if (params.degree) where.degreeLevel = { has: params.degree };

  const [scholarships, total] = await Promise.all([
    prisma.scholarship.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.scholarship.count({ where }),
  ]);

  // Get unique countries for filter
  const allCountries = await prisma.scholarship.findMany({
    where: { isPublished: true },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  return {
    scholarships,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    countries: allCountries.map((s) => s.country),
  };
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    type?: string;
    degree?: string;
    page?: string;
  }>;
}

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getScholarships({
    search: params.search,
    country: params.country,
    type: params.type,
    degree: params.degree,
    page: params.page ? parseInt(params.page) : 1,
  });

  return <ScholarshipsPageClient {...data} currentParams={params} />;
}
