export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminApplicationsClient from "./AdminApplicationsClient";

export const metadata: Metadata = { title: "طلبات التقديم | مسارات غزة" };

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = 15;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;

  const [applications, total] = await Promise.all([
    prisma.scholarshipApplication.findMany({
      where,
      include: { scholarship: { select: { id: true, title: true, country: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.scholarshipApplication.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">طلبات التقديم</h1>
        <p className="text-sm text-gray-500 mt-1">إجمالي {total} طلب</p>
      </div>
      <AdminApplicationsClient
        applications={applications}
        total={total}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        currentStatus={params.status}
      />
    </div>
  );
}
