"use server";

import { prisma } from "@/lib/prisma";
import { consultationSchema } from "@/lib/validators/contact";
import type { ActionResponse } from "@/types";

export async function submitConsultation(data: unknown): Promise<ActionResponse> {
  try {
    const parsed = consultationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    }

    await prisma.consultation.create({ data: parsed.data });
    return { success: true, message: "تم إرسال طلب الاستشارة بنجاح" };
  } catch (error) {
    console.error("submitConsultation error:", error);
    return { success: false, error: "حدث خطأ، يرجى المحاولة مرة أخرى" };
  }
}

export async function updateConsultationStatus(
  id: string,
  status: string,
  adminNote?: string
): Promise<ActionResponse> {
  try {
    await prisma.consultation.update({
      where: { id },
      data: {
        status: status as Parameters<typeof prisma.consultation.update>[0]["data"]["status"],
        adminNote,
      },
    });
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}

export async function deleteConsultation(id: string): Promise<ActionResponse> {
  try {
    await prisma.consultation.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false, error: "فشل الحذف" };
  }
}
