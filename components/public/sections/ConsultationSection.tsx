"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { consultationSchema, type ConsultationSchemaType } from "@/lib/validators/contact";
import { submitConsultation } from "@/actions/consultations";
import SectionHeading from "@/components/public/SectionHeading";

export default function ConsultationSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationSchemaType>({
    resolver: zodResolver(consultationSchema),
  });

  async function onSubmit(data: ConsultationSchemaType) {
    const result = await submitConsultation(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    }
  }

  return (
    <section id="consultation" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div>
            <SectionHeading
              badge="احجز استشارة"
              title="ابدأ رحلتك"
              highlight="معنا اليوم"
              description="احجز استشارة مجانية مع فريقنا المتخصص وناقش فرصك الدراسية. لا نبيع وعودًا، نبيع خطوات حقيقية نحو مستقبلك."
              centered={false}
            />

            <div className="mt-8 flex flex-col gap-4">
              <a
                href="https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl hover:bg-green-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">واتساب - تواصل فوري</p>
                  <p className="text-sm text-gray-500">+970 567 841 404</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-brand-lg p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-500 mb-6">
                  شكرًا لك. سيتواصل معك فريقنا خلال 24 ساعة.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  إرسال طلب آخر
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-6">أرسل طلب استشارة</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cons-name" className="input-label">الاسم الكامل</Label>
                      <Input
                        id="cons-name"
                        placeholder="محمد أحمد"
                        {...register("fullName")}
                        className={errors.fullName ? "border-red-300 focus-visible:ring-red-200" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cons-phone" className="input-label">رقم الجوال</Label>
                      <Input
                        id="cons-phone"
                        placeholder="+970 5X XXX XXXX"
                        dir="ltr"
                        {...register("phone")}
                        className={errors.phone ? "border-red-300 focus-visible:ring-red-200" : ""}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cons-email" className="input-label">البريد الإلكتروني</Label>
                    <Input
                      id="cons-email"
                      type="email"
                      placeholder="example@email.com"
                      dir="ltr"
                      {...register("email")}
                      className={errors.email ? "border-red-300 focus-visible:ring-red-200" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cons-message" className="input-label">رسالتك</Label>
                    <Textarea
                      id="cons-message"
                      placeholder="أخبرنا عن هدفك الدراسي وأي تفاصيل تريد الاستفسار عنها..."
                      rows={4}
                      {...register("message")}
                      className={errors.message ? "border-red-300 focus-visible:ring-red-200" : ""}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
