export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { getSiteSettings } from "@/actions/settings";
import AdminSettingsClient from "./AdminSettingsClient";

export const metadata: Metadata = { title: "إعدادات الموقع | مسارات غزة" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">إعدادات الموقع</h1>
        <p className="text-sm text-gray-500 mt-1">تعديل نصوص ومعلومات الموقع</p>
      </div>
      <AdminSettingsClient initialSettings={settings} />
    </div>
  );
}
