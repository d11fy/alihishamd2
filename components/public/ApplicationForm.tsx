"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { applicationSchema, type ApplicationSchemaType } from "@/lib/validators/application";
import { submitApplication } from "@/actions/applications";

interface ApplicationFormProps {
  scholarshipId: string;
  scholarshipTitle: string;
}

const gpaOptions = [
  { value: "3.7-4.0", label: "ممتاز (3.7 - 4.0)" },
  { value: "3.4-3.69", label: "جيد جدًا (3.4 - 3.69)" },
  { value: "3.0-3.39", label: "جيد (3.0 - 3.39)" },
  { value: "2.5-2.99", label: "مقبول (2.5 - 2.99)" },
  { value: "below-2.5", label: "أقل من 2.5" },
];

const degreeOptions = [
  "بكالوريوس",
  "ماجستير",
  "دكتوراه",
  "دبلوم",
  "دورة تدريبية",
];

export default function ApplicationForm({ scholarshipId, scholarshipTitle }: ApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationSchemaType>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { scholarshipId },
  });

  async function onSubmit(data: ApplicationSchemaType) {
    const result = await submitApplication(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h3>
        <p className="text-gray-500 mb-2">
          استلمنا طلبك على منحة <strong>{scholarshipTitle}</strong>
        </p>
        <p className="text-gray-400 text-sm mb-6">سيتواصل معك فريقنا خلال 24-48 ساعة</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          إرسال طلب آخر
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("scholarshipId")} />

      {/* Personal Info */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          المعلومات الشخصية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="input-label">الاسم الكامل *</Label>
            <Input
              placeholder="محمد أحمد محمد"
              {...register("fullName")}
              className={errors.fullName ? "border-red-300" : ""}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label className="input-label">رقم الجوال *</Label>
            <Input
              placeholder="+970 5X XXX XXXX"
              dir="ltr"
              {...register("phone")}
              className={errors.phone ? "border-red-300" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label className="input-label">البريد الإلكتروني *</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              {...register("email")}
              className={errors.email ? "border-red-300" : ""}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label className="input-label">المدينة *</Label>
            <Input
              placeholder="غزة، رفح، خانيونس..."
              {...register("city")}
              className={errors.city ? "border-red-300" : ""}
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          المعلومات الأكاديمية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="input-label">المعدل التراكمي *</Label>
            <select
              {...register("gpa")}
              className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">اختر معدلك</option>
              {gpaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.gpa && <p className="text-xs text-red-500 mt-1">{errors.gpa.message}</p>}
          </div>
          <div>
            <Label className="input-label">التخصص *</Label>
            <Input
              placeholder="هندسة برمجيات، طب..."
              {...register("specialization")}
              className={errors.specialization ? "border-red-300" : ""}
            />
            {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization.message}</p>}
          </div>
          <div>
            <Label className="input-label">الدرجة المطلوبة *</Label>
            <select
              {...register("desiredDegree")}
              className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">اختر الدرجة</option>
              {degreeOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.desiredDegree && <p className="text-xs text-red-500 mt-1">{errors.desiredDegree.message}</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label className="input-label">ملاحظات إضافية</Label>
        <Textarea
          placeholder="أي معلومات إضافية تريد إضافتها..."
          rows={3}
          {...register("notes")}
        />
      </div>

      {/* File Upload Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-700 mb-1">رفع المستندات</p>
            <p className="text-xs text-blue-600">
              بعد إرسال طلبك، سيتواصل معك فريقنا عبر واتساب لاستلام مستنداتك (CV، كشف درجات، جواز سفر).
            </p>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جارٍ إرسال الطلب...
          </>
        ) : (
          "إرسال طلب التقديم"
        )}
      </Button>
    </form>
  );
}
