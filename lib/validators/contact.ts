import { z } from "zod";

export const consultationSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[\d+\s()-]+$/, "رقم الجوال غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  message: z
    .string()
    .min(20, "الرسالة مطلوبة (20 حرفًا على الأقل)")
    .max(2000, "الرسالة لا تتجاوز 2000 حرف"),
});

export const contactSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .regex(/^[\d+\s()-]+$/, "رقم الجوال غير صالح")
    .optional()
    .or(z.literal("")),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  subject: z.string().min(5, "الموضوع مطلوب"),
  message: z
    .string()
    .min(20, "الرسالة مطلوبة (20 حرفًا على الأقل)")
    .max(2000, "الرسالة لا تتجاوز 2000 حرف"),
});

export type ConsultationSchemaType = z.infer<typeof consultationSchema>;
export type ContactSchemaType = z.infer<typeof contactSchema>;
