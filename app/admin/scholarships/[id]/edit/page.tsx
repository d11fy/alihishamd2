export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ScholarshipForm from "@/components/admin/ScholarshipForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scholarship = await prisma.scholarship.findUnique({ where: { id }, select: { title: true } });
  return { title: scholarship ? `تعديل: ${scholarship.title}` : "تعديل المنحة" };
}

export default async function EditScholarshipPage({ params }: PageProps) {
  const { id } = await params;
  const scholarship = await prisma.scholarship.findUnique({ where: { id } });

  if (!scholarship) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">تعديل المنحة</h1>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{scholarship.title}</p>
      </div>
      <ScholarshipForm scholarship={scholarship} />
    </div>
  );
}
