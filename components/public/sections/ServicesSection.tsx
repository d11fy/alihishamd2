"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  FileCheck,
  Plane,
  Search,
  BookOpen,
  HeadphonesIcon,
} from "lucide-react";
import SectionHeading from "@/components/public/SectionHeading";

const services = [
  {
    icon: Search,
    title: "البحث عن المنح",
    description:
      "نبحث لك عن أفضل المنح الدراسية المناسبة لمعدلك وتخصصك وأهدافك الدراسية من قواعد بياناتنا الواسعة",
    color: "text-primary-600",
    bg: "from-primary-500/10 to-primary-500/5",
    border: "border-primary-100",
  },
  {
    icon: FileCheck,
    title: "تجهيز ملف التقديم",
    description:
      "نساعدك في تجهيز ملف تقديم احترافي يبرز نقاط قوتك ويرفع فرصك في القبول بشكل كبير",
    color: "text-gold-600",
    bg: "from-gold-500/10 to-gold-500/5",
    border: "border-gold-100",
  },
  {
    icon: BookOpen,
    title: "القبولات الجامعية",
    description:
      "نتواصل نيابةً عنك مع الجامعات ونتابع طلبات القبول حتى الحصول على رسالة القبول الرسمية",
    color: "text-teal-600",
    bg: "from-teal-500/10 to-teal-500/5",
    border: "border-teal-100",
  },
  {
    icon: Plane,
    title: "تجهيز السفر",
    description:
      "نرشدك في كل خطوات تجهيز ملف السفر بدءًا من جواز السفر حتى تأشيرة الدراسة وحجز الرحلات",
    color: "text-purple-600",
    bg: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-100",
  },
  {
    icon: GraduationCap,
    title: "الدراسة في الخارج",
    description:
      "نقدم لك دليلاً شاملاً للحياة الدراسية في الخارج، من السكن للتأمين الصحي وكل ما تحتاجه",
    color: "text-green-600",
    bg: "from-green-500/10 to-green-500/5",
    border: "border-green-100",
  },
  {
    icon: HeadphonesIcon,
    title: "المتابعة والدعم",
    description:
      "فريقنا متاح لمتابعة ملفك والإجابة على استفساراتك في كل مرحلة حتى تصل لوجهتك بأمان",
    color: "text-orange-600",
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-100",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          badge="خدماتنا"
          title="كل ما تحتاجه"
          highlight="في مكان واحد"
          description="من البحث عن المنحة حتى الوصول لمطار وجهتك، نحن معك في كل خطوة"
          className="mb-14"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${service.bg} border ${service.border} hover:shadow-brand transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="mb-4">
                <div className={`w-12 h-12 rounded-xl bg-white shadow-brand-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
