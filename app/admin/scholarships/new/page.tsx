import { Metadata } from "next";
import ScholarshipForm from "@/components/admin/ScholarshipForm";

export const metadata: Metadata = { title: "إضافة منحة جديدة | مسارات غزة" };

export default function NewScholarshipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">إضافة منحة جديدة</h1>
        <p className="text-sm text-gray-500 mt-1">أضف تفاصيل المنحة الدراسية الجديدة</p>
      </div>
      <ScholarshipForm />
    </div>
  );
}
