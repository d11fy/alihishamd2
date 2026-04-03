"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";
import type { ActionResponse } from "@/types";

export async function submitContactMessage(data: unknown): Promise<ActionResponse> {
  try {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "بيانات غير صالحة" };
    }

    await prisma.contactMessage.create({ data: parsed.data });
    return { success: true, message: "تم إرسال رسالتك بنجاح" };
  } catch (error) {
    console.error("submitContactMessage error:", error);
    return { success: false, error: "حدث خطأ، يرجى المحاولة مرة أخرى" };
  }
}

export async function updateMessageStatus(
  id: string,
  status: string
): Promise<ActionResponse> {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status as Parameters<typeof prisma.contactMessage.update>[0]["data"]["status"],
      },
    });
    return { success: true };
  } catch {
    return { success: false, error: "فشل التحديث" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse> {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false, error: "فشل الحذف" };
  }
}
