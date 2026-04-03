export const dynamic = "force-dynamic";
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminScholarships } from "@/actions/scholarships";
import AdminScholarshipsTable from "./AdminScholarshipsTable";

export const metadata: Metadata = { title: "إدارة المنح | مسارات غزة" };

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function AdminScholarshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { scholarships, total, page, totalPages } = await getAdminScholarships({
    search: params.search,
    status: params.status,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة المنح الدراسية</h1>
          <p className="text-sm text-gray-500 mt-1">إجمالي {total} منحة</p>
        </div>
        <Button asChild>
          <Link href="/admin/scholarships/new">
            <Plus className="w-4 h-4" />
            إضافة منحة جديدة
          </Link>
        </Button>
      </div>

      <AdminScholarshipsTable
        scholarships={scholarships}
        total={total}
        page={page}
        totalPages={totalPages}
        currentSearch={params.search}
        currentStatus={params.status}
      />
    </div>
  );
}
