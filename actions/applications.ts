"use server";

import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validators/application";
import type { ActionResponse } from "@/types";

export async function submitApplication(
  data: unknown
): Promise<ActionResponse<{ id: string }>> {
  try {
    const parsed = applicationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    }

    const { scholarshipId, ...rest } = parsed.data;

    // Check scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId, isPublished: true },
    });

    if (!scholarship) {
      return { success: false, error: "المنحة غير موجودة" };
    }

    const application = await prisma.scholarshipApplication.create({
      data: { scholarshipId, ...rest },
    });

    return { success: true, data: { id: application.id }, message: "تم إرسال طلبك بنجاح" };
  } catch (error) {
    console.error("submitApplication error:", error);
    return { success: false, error: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى" };
  }
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  adminNotes?: string
): Promise<ActionResponse> {
  try {
    await prisma.scholarshipApplication.update({
      where: { id },
      data: {
        status: status as Parameters<typeof prisma.scholarshipApplication.update>[0]["data"]["status"],
        adminNotes,
      },
    });
    return { success: true, message: "تم تحديث الحالة" };
  } catch {
    return { success: false, error: "فشل تحديث الحالة" };
  }
}

export async function deleteApplication(id: string): Promise<ActionResponse> {
  try {
    await prisma.scholarshipApplication.delete({ where: { id } });
    return { success: true, message: "تم الحذف بنجاح" };
  } catch {
    return { success: false, error: "فشل الحذف" };
  }
}

export async function getApplications(params?: {
  scholarshipId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const where: Record<string, unknown> = {};

  if (params?.scholarshipId) where.scholarshipId = params.scholarshipId;
  if (params?.status) where.status = params.status;

  const [applications, total] = await Promise.all([
    prisma.scholarshipApplication.findMany({
      where,
      include: {
        scholarship: { select: { title: true, slug: true, country: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.scholarshipApplication.count({ where }),
  ]);

  return { applications, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
