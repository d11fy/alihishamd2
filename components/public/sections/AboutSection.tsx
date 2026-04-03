"use client";

import { motion } from "framer-motion";
import { CheckCircle, Target, Heart, Zap } from "lucide-react";
import SectionHeading from "@/components/public/SectionHeading";

const values = [
  {
    icon: Target,
    title: "نتائج مضمونة",
    description: "لا نبدأ مشوارك إلا بعد دراسة وضعك كاملًا وتحديد أفضل الفرص المناسبة لك",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: Heart,
    title: "اهتمام حقيقي",
    description: "نتعامل مع كل طالب كقضية شخصية، لأن حلمك يستحق اهتمامًا حقيقيًا",
    color: "text-gold-500",
    bg: "bg-gold-50",
  },
  {
    icon: Zap,
    title: "خطوات واضحة",
    description: "نحوّل رحلة التقديم المعقدة إلى خطوات بسيطة وواضحة يفهمها الجميع",
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
];

const points = [
  "خبرة متراكمة في مجال المنح الدراسية الدولية",
  "فريق متخصص ومتابعة شخصية لكل طالب",
  "شبكة علاقات واسعة مع الجامعات والمنظمات الدولية",
  "نتائج حقيقية وقصص نجاح موثقة من غزة للعالم",
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <SectionHeading
              badge="من نحن"
              title="أكثر من مجرد"
              highlight="منصة"
              description="مسارات غزة ليست مجرد منصة للمنح، بل هي شريكك الحقيقي في رحلة البحث عن مستقبل أفضل. نؤمن بأن كل طالب في غزة يستحق فرصة حقيقية للوصول للعالم."
              centered={false}
            />

            <div className="mt-8 space-y-4">
              {points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 font-medium">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cards side */}
          <div className="grid grid-cols-1 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-brand-sm hover:shadow-brand transition-all group"
              >
                <div className={`w-12 h-12 ${value.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-6 h-6 ${value.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
