"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  MessageCircle, Instagram, MapPin, Send, CheckCircle2, Loader2, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactSchemaType } from "@/lib/validators/contact";
import { submitContactMessage } from "@/actions/contact";

const contactInfo = [
  {
    icon: MessageCircle,
    title: "واتساب",
    value: "+970 567 841 404",
    href: "https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة",
    color: "bg-green-100 text-green-600",
    hoverColor: "hover:bg-green-500 hover:text-white",
  },
  {
    icon: Instagram,
    title: "إنستغرام",
    value: "@gaza.pathways",
    href: "https://instagram.com/gaza.pathways",
    color: "bg-pink-100 text-pink-600",
    hoverColor: "hover:bg-pink-500 hover:text-white",
  },
  {
    icon: MapPin,
    title: "الموقع",
    value: "غزة، فلسطين",
    href: null,
    color: "bg-teal-100 text-teal-600",
    hoverColor: "",
  },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchemaType>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactSchemaType) {
    const result = await submitContactMessage(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Page Header */}
      <div className="bg-gradient-brand py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">تواصل معنا</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            فريقنا جاهز للإجابة على استفساراتك ومساعدتك في رحلتك الدراسية
          </p>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="grid lg:grid-cols-2 gap-14 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              طرق التواصل معنا
            </h2>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-brand-sm ${item.hoverColor} transition-all duration-300 hover:shadow-brand group`}
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-white transition-colors">{item.title}</p>
                        <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-brand-sm">
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-brand rounded-2xl p-6 text-center">
              <h3 className="font-black text-white text-lg mb-2">أسرع طريقة للتواصل</h3>
              <p className="text-white/70 text-sm mb-4">تحدث مع فريقنا مباشرة عبر واتساب</p>
              <a
                href="https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                تحدث معنا الآن
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-brand-lg p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم الإرسال!</h3>
                <p className="text-gray-500 mb-6">سنتواصل معك في أقرب وقت</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>إرسال آخر</Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">أرسل رسالة</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="input-label">الاسم *</Label>
                      <Input placeholder="اسمك" {...register("fullName")} className={errors.fullName ? "border-red-300" : ""} />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <Label className="input-label">الجوال</Label>
                      <Input placeholder="+970..." dir="ltr" {...register("phone")} />
                    </div>
                  </div>
                  <div>
                    <Label className="input-label">البريد الإلكتروني *</Label>
                    <Input type="email" placeholder="email@example.com" dir="ltr" {...register("email")} className={errors.email ? "border-red-300" : ""} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label className="input-label">الموضوع *</Label>
                    <Input placeholder="موضوع رسالتك" {...register("subject")} className={errors.subject ? "border-red-300" : ""} />
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <Label className="input-label">الرسالة *</Label>
                    <Textarea placeholder="اكتب رسالتك هنا..." rows={5} {...register("message")} className={errors.message ? "border-red-300" : ""} />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />جارٍ الإرسال...</>
                    ) : (
                      <><Send className="w-4 h-4" />إرسال الرسالة</>
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
