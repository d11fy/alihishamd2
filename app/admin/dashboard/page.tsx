export const dynamic = "force-dynamic";
import { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap, FileText, MessageCircle, Mail,
  Star, BookOpen, TrendingUp, Clock, ArrowLeft
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/actions/settings";
import { formatDateRelative } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS, CONSULTATION_STATUS_LABELS } from "@/types";
import { getStatusColor } from "@/lib/utils";

export const metadata: Metadata = { title: "لوحة التحكم | مسارات غزة" };

async function getDashboardData() {
  const [stats, recentApplications, recentConsultations, recentScholarships] = await Promise.all([
    getDashboardStats(),
    prisma.scholarshipApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { scholarship: { select: { title: true } } },
    }),
    prisma.consultation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.scholarship.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, country: true, isPublished: true, createdAt: true, _count: { select: { applications: true } } },
    }),
  ]);

  return { stats, recentApplications, recentConsultations, recentScholarships };
}

export default async function DashboardPage() {
  const { stats, recentApplications, recentConsultations, recentScholarships } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 text-sm mt-1">مرحبًا بك في لوحة تحكم مسارات غزة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المنح"
          value={stats.totalScholarships}
          subtitle={`${stats.publishedScholarships} منشورة`}
          icon={GraduationCap}
          color="primary"
        />
        <StatCard
          title="طلبات التقديم"
          value={stats.totalApplications}
          subtitle={`${stats.newApplications} جديدة`}
          icon={FileText}
          color="gold"
        />
        <StatCard
          title="طلبات استشارة"
          value={stats.totalConsultations}
          subtitle={`${stats.newConsultations} جديدة`}
          icon={MessageCircle}
          color="teal"
        />
        <StatCard
          title="رسائل التواصل"
          value={stats.totalMessages}
          subtitle={`${stats.unreadMessages} غير مقروءة`}
          icon={Mail}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/scholarships/new", label: "إضافة منحة", icon: GraduationCap, color: "bg-primary-500" },
          { href: "/admin/applications", label: "الطلبات الجديدة", icon: FileText, color: "bg-gold-500", badge: stats.newApplications },
          { href: "/admin/consultations", label: "الاستشارات", icon: MessageCircle, color: "bg-teal-500", badge: stats.newConsultations },
          { href: "/admin/messages", label: "الرسائل", icon: Mail, color: "bg-red-500", badge: stats.unreadMessages },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="relative flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-brand transition-all group"
          >
            <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
              {action.label}
            </span>
            {action.badge && action.badge > 0 ? (
              <span className="absolute top-2 left-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {action.badge > 99 ? "99+" : action.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-500" />
              آخر الطلبات
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/applications" className="text-primary-600">
                عرض الكل <ArrowLeft className="w-3 h-3 flip-rtl" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApplications.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">لا توجد طلبات بعد</p>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{app.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{app.scholarship.title}</p>
                    <p className="text-xs text-gray-300">{formatDateRelative(app.createdAt)}</p>
                  </div>
                  <span className={`status-badge text-xs ${getStatusColor(app.status)}`}>
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Scholarships */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-500" />
              آخر المنح
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/scholarships" className="text-primary-600">
                عرض الكل <ArrowLeft className="w-3 h-3 flip-rtl" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentScholarships.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">لا توجد منح بعد</p>
            ) : (
              recentScholarships.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.country} · {s._count.applications} طلب</p>
                  </div>
                  <span className={`status-badge text-xs ${s.isPublished ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {s.isPublished ? "منشورة" : "مسودة"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
