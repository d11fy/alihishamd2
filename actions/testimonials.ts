"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { ActionResponse } from "@/types";

const testimonialSchema = z.object({
  studentName: z.string().min(2),
  subtitle: z.string().min(2),
  testimonial: z.string().min(20),
  avatar: z.string().optional(),
  country: z.string().optional(),
  scholarship: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export async function createTestimonial(data: unknown): Promise<ActionResponse> {
  try {
    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    await prisma.testimonial.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "فشل الإنشاء" };
  }
}

export async function updateTestimonial(id: string, data: unknown): Promise<ActionResponse> {
  try {
    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResponse> {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "فشل الحذف" };
  }
}

export async function toggleTestimonialPublished(id: string, isPublished: boolean): Promise<ActionResponse> {
  try {
    await prisma.testimonial.update({ where: { id }, data: { isPublished } });
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}
