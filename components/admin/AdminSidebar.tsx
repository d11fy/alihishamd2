"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GraduationCap, FileText, MessageCircle,
  Star, Settings, X, Users, Mail, GraduationCap as Logo
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/scholarships", label: "المنح الدراسية", icon: GraduationCap },
  { href: "/admin/applications", label: "طلبات التقديم", icon: FileText },
  { href: "/admin/consultations", label: "طلبات الاستشارة", icon: MessageCircle },
  { href: "/admin/testimonials", label: "قصص النجاح", icon: Star },
  { href: "/admin/messages", label: "رسائل التواصل", icon: Mail },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-100 shadow-glass-lg z-50 transition-transform duration-300 flex flex-col",
          "lg:translate-x-0 lg:static lg:shadow-none",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-brand">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-primary-700 leading-tight">مسارات غزة</p>
              <p className="text-xs text-gray-400">لوحة التحكم</p>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "admin-sidebar-link",
                  isActive && "active"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Site */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            عرض الموقع العام
          </Link>
        </div>
      </aside>
    </>
  );
}
