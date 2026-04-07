"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { scholarshipSchema } from "@/lib/validators/scholarship";
import { generateSlug } from "@/lib/utils";
import type { ActionResponse } from "@/types";

export async function createScholarship(data: unknown): Promise<ActionResponse<{ id: string; slug: string }>> {
  try {
    const parsed = scholarshipSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    }

    const { deadline, ...rest } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.scholarship.findUnique({ where: { slug: rest.slug } });
    if (existing) {
      return { success: false, error: "الـ slug محجوز، استخدم slug آخر" };
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        ...rest,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    revalidatePath("/scholarships");
    revalidatePath("/admin/scholarships");
    revalidatePath("/");

    return { success: true, data: { id: scholarship.id, slug: scholarship.slug } };
  } catch (error) {
    console.error("createScholarship error:", error);
    return { success: false, error: error instanceof Error ? error.message : "فشل إنشاء المنحة" };
  }
}

export async function updateScholarship(
  id: string,
  data: unknown
): Promise<ActionResponse> {
  try {
    const parsed = scholarshipSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    }

    const { deadline, ...rest } = parsed.data;

    // Check slug uniqueness (exclude current)
    const existing = await prisma.scholarship.findFirst({
      where: { slug: rest.slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "الـ slug محجوز، استخدم slug آخر" };
    }

    await prisma.scholarship.update({
      where: { id },
      data: {
        ...rest,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    revalidatePath("/scholarships");
    revalidatePath(`/scholarships/${rest.slug}`);
    revalidatePath("/admin/scholarships");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("updateScholarship error:", error);
    return { success: false, error: error instanceof Error ? error.message : "فشل تحديث المنحة" };
  }
}

export async function deleteScholarship(id: string): Promise<ActionResponse> {
  try {
    const scholarship = await prisma.scholarship.findUnique({ where: { id } });
    if (!scholarship) return { success: false, error: "المنحة غير موجودة" };

    await prisma.scholarship.delete({ where: { id } });

    revalidatePath("/scholarships");
    revalidatePath("/admin/scholarships");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("deleteScholarship error:", error);
    return { success: false, error: "فشل حذف المنحة" };
  }
}

export async function toggleScholarshipPublished(
  id: string,
  isPublished: boolean
): Promise<ActionResponse> {
  try {
    await prisma.scholarship.update({ where: { id }, data: { isPublished } });
    revalidatePath("/scholarships");
    revalidatePath("/admin/scholarships");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}

export async function toggleScholarshipFeatured(
  id: string,
  isFeatured: boolean
): Promise<ActionResponse> {
  try {
    await prisma.scholarship.update({ where: { id }, data: { isFeatured } });
    revalidatePath("/scholarships");
    revalidatePath("/admin/scholarships");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}

export async function getAdminScholarships(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = 15;
  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { provider: { contains: params.search, mode: "insensitive" } },
      { country: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params?.status) where.status = params.status;

  const [scholarships, total] = await Promise.all([
    prisma.scholarship.findMany({
      where,
      include: { _count: { select: { applications: true } } },
      orderBy: [{ isPublished: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.scholarship.count({ where }),
  ]);

  return { scholarships, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
