export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminMessagesClient from "./AdminMessagesClient";

export const metadata: Metadata = { title: "رسائل التواصل | مسارات غزة" };

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = 15;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">رسائل التواصل</h1>
        <p className="text-sm text-gray-500 mt-1">إجمالي {total} رسالة</p>
      </div>
      <AdminMessagesClient messages={messages} total={total} page={page} totalPages={Math.ceil(total / pageSize)} currentStatus={params.status} />
    </div>
  );
}
