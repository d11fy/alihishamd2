import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[\d+\s()-]+$/, "رقم الجوال غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  gpa: z.string().min(1, "المعدل مطلوب"),
  specialization: z.string().min(2, "التخصص مطلوب"),
  desiredDegree: z.string().min(2, "الدرجة المطلوبة مطلوبة"),
  notes: z.string().max(1000, "الملاحظات لا تتجاوز 1000 حرف").optional(),
  cvFile: z.string().optional(),
  transcriptFile: z.string().optional(),
  passportFile: z.string().optional(),
  extraFile: z.string().optional(),
  scholarshipId: z.string().min(1, "منحة غير محددة"),
});

export type ApplicationSchemaType = z.infer<typeof applicationSchema>;
