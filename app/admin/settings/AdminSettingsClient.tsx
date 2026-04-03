"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/actions/settings";
import { useToast } from "@/hooks/use-toast";

interface Props {
  initialSettings: Record<string, string>;
}

const settingGroups = [
  {
    title: "الصفحة الرئيسية - Hero",
    fields: [
      { key: "hero_title", label: "العنوان الرئيسي", type: "textarea" },
      { key: "hero_subtitle", label: "الوصف التعريفي", type: "textarea" },
      { key: "hero_cta_text", label: "نص زر الدعوة", type: "input" },
    ],
  },
  {
    title: "من نحن",
    fields: [
      { key: "about_title", label: "عنوان القسم", type: "input" },
      { key: "about_description", label: "وصف من نحن", type: "textarea" },
    ],
  },
  {
    title: "بيانات التواصل",
    fields: [
      { key: "whatsapp_number", label: "رقم واتساب", type: "input" },
      { key: "instagram_url", label: "رابط انستغرام", type: "input" },
      { key: "location", label: "الموقع الجغرافي", type: "input" },
      { key: "email", label: "البريد الإلكتروني", type: "input" },
    ],
  },
  {
    title: "إعدادات SEO",
    fields: [
      { key: "seo_title", label: "عنوان الصفحة (SEO)", type: "input" },
      { key: "seo_description", label: "وصف الصفحة (SEO)", type: "textarea" },
      { key: "seo_keywords", label: "الكلمات المفتاحية", type: "input" },
    ],
  },
];

export default function AdminSettingsClient({ initialSettings }: Props) {
  const { toast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateSiteSettings(settings);
    setSaving(false);
    if (result.success) {
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    } else {
      toast({ title: "خطأ", description: result.error, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      {settingGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">{group.title}</h2>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <Label className="input-label">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={settings[field.key] ?? ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    rows={3}
                    placeholder={`أدخل ${field.label}`}
                  />
                ) : (
                  <Input
                    value={settings[field.key] ?? ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={`أدخل ${field.label}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" />جارٍ الحفظ...</>
          ) : (
            <><Save className="w-4 h-4" />حفظ جميع الإعدادات</>
          )}
        </Button>
      </div>
    </div>
  );
}
