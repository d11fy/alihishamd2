"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Globe, Award } from "lucide-react";

interface StatsSectionProps {
  stats: {
    scholarshipsCount: number;
    applicationsCount: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    {
      icon: GraduationCap,
      value: `+${stats.scholarshipsCount}`,
      label: "منحة متاحة",
      color: "from-primary-500 to-teal-500",
      bg: "bg-primary-50",
      iconColor: "text-primary-600",
    },
    {
     icon: Users,
      value: "+5000",
      label: "طالب استفاد",
      color: "from-gold-500 to-gold-400",
      bg: "bg-gold-50",
      iconColor: "text-gold-600",
    },
    {
      icon: Globe,
      value: "+30",
      label: "دولة حول العالم",
      color: "from-teal-500 to-teal-400",
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      icon: Award,
      value: "98%",
      label: "نسبة رضا الطلاب",
      color: "from-purple-500 to-purple-400",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-gray-100 shadow-brand-sm hover:shadow-brand transition-all"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <p className={`text-3xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.value}
              </p>
              <p className="text-gray-500 text-sm font-medium mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
