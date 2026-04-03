import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب (3 أحرف على الأقل)"),
  slug: z
    .string()
    .min(3, "الـ slug مطلوب")
    .regex(/^[a-z0-9-]+$/, "الـ slug يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة فقط"),
  provider: z.string().min(2, "الجهة المانحة مطلوبة"),
  country: z.string().min(2, "الدولة مطلوبة"),
  city: z.string().optional(),
  degreeLevel: z
    .array(
      z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA", "LANGUAGE_COURSE", "SHORT_COURSE", "ANY"])
    )
    .min(1, "حدد مرحلة دراسية واحدة على الأقل"),
  scholarshipType: z.enum([
    "FULLY_FUNDED",
    "PARTIALLY_FUNDED",
    "TUITION_ONLY",
    "LIVING_ALLOWANCE",
    "RESEARCH_GRANT",
    "EXCHANGE",
  ]),
  fundingType: z.enum([
    "GOVERNMENT",
    "UNIVERSITY",
    "NGO",
    "PRIVATE",
    "INTERNATIONAL_ORGANIZATION",
  ]),
  deadline: z.string().optional(),
  status: z.enum(["ACTIVE", "CLOSED", "COMING_SOON", "PAUSED"]).default("ACTIVE"),
  shortDescription: z
    .string()
    .min(20, "النبذة القصيرة مطلوبة (20 حرفًا على الأقل)")
    .max(500, "النبذة القصيرة لا تتجاوز 500 حرف"),
  fullDescription: z.string().min(50, "الوصف الكامل مطلوب (50 حرفًا على الأقل)"),
  majors: z.array(z.string()).default([]),
  benefits: z.array(z.string()).min(1, "أضف ميزة واحدة على الأقل"),
  requirements: z.array(z.string()).min(1, "أضف شرطًا واحدًا على الأقل"),
  requiredDocuments: z.array(z.string()).default([]),
  applicationMethod: z.string().optional(),
  externalLink: z
    .string()
    .url("رابط غير صالح")
    .optional()
    .or(z.literal("")),
  coverImage: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ScholarshipSchemaType = z.infer<typeof scholarshipSchema>;
