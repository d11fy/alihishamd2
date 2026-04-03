import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "primary" | "gold" | "teal" | "red" | "green" | "purple";
  trend?: { value: number; label: string };
}

const colorClasses = {
  primary: { bg: "bg-primary-50", icon: "text-primary-600", value: "text-primary-700", border: "border-primary-100" },
  gold: { bg: "bg-gold-50", icon: "text-gold-600", value: "text-gold-700", border: "border-gold-100" },
  teal: { bg: "bg-teal-50", icon: "text-teal-600", value: "text-teal-700", border: "border-teal-100" },
  red: { bg: "bg-red-50", icon: "text-red-600", value: "text-red-700", border: "border-red-100" },
  green: { bg: "bg-green-50", icon: "text-green-600", value: "text-green-700", border: "border-green-100" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", value: "text-purple-700", border: "border-purple-100" },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = "primary", trend }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={cn("bg-white rounded-2xl border p-5 shadow-brand-sm hover:shadow-brand transition-all", colors.border)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", trend.value > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className={cn("text-3xl font-black mb-1", colors.value)}>{value}</p>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
