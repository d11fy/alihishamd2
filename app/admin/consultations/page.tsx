export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminConsultationsClient from "./AdminConsultationsClient";

export const metadata: Metadata = { title: "طلبات الاستشارة | مسارات غزة" };

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminConsultationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = 15;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.consultation.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">طلبات الاستشارة</h1>
        <p className="text-sm text-gray-500 mt-1">إجمالي {total} طلب</p>
      </div>
      <AdminConsultationsClient
        consultations={consultations}
        total={total}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        currentStatus={params.status}
      />
    </div>
  );
}
