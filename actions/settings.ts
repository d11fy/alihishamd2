"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function updateSiteSettings(
  data: Record<string, string>
): Promise<ActionResponse> {
  try {
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value, type: "TEXT" },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true, message: "تم حفظ الإعدادات بنجاح" };
  } catch (error) {
    console.error("updateSiteSettings error:", error);
    return { success: false, error: "فشل حفظ الإعدادات" };
  }
}

export async function getDashboardStats() {
  const [
    totalScholarships,
    publishedScholarships,
    totalApplications,
    newApplications,
    totalConsultations,
    newConsultations,
    totalMessages,
    unreadMessages,
  ] = await Promise.all([
    prisma.scholarship.count(),
    prisma.scholarship.count({ where: { isPublished: true } }),
    prisma.scholarshipApplication.count(),
    prisma.scholarshipApplication.count({ where: { status: "NEW" } }),
    prisma.consultation.count(),
    prisma.consultation.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
  ]);

  return {
    totalScholarships,
    publishedScholarships,
    totalApplications,
    newApplications,
    totalConsultations,
    newConsultations,
    totalMessages,
    unreadMessages,
  };
}
