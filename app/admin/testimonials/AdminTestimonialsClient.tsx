"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialPublished } from "@/actions/testimonials";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/types";

interface Props { testimonials: Testimonial[] }

const emptyForm = { studentName: "", subtitle: "", testimonial: "", country: "", scholarship: "", avatar: "", rating: 5, isPublished: false, sortOrder: 0 };

export default function AdminTestimonialsClient({ testimonials }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() { setEditing(null); setForm(emptyForm); setIsOpen(true); }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ studentName: t.studentName, subtitle: t.subtitle, testimonial: t.testimonial, country: t.country ?? "", scholarship: t.scholarship ?? "", avatar: t.avatar ?? "", rating: t.rating, isPublished: t.isPublished, sortOrder: t.sortOrder });
    setIsOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const result = editing
      ? await updateTestimonial(editing.id, form)
      : await createTestimonial(form);
    setSaving(false);
    if (result.success) {
      toast({ title: editing ? "تم التحديث" : "تم الإضافة" });
      setIsOpen(false);
      router.refresh();
    } else {
      toast({ title: "خطأ", description: result.error, variant: "destructive" });
    }
  }

  async function handleTogglePublish(t: Testimonial) {
    await toggleTestimonialPublished(t.id, !t.isPublished);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteTestimonial(deleteId);
    setDeleteId(null);
    toast({ title: "تم الحذف" });
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="w-4 h-4" /> إضافة شهادة</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">{t.studentName}</p>
                <p className="text-xs text-gold-600">{t.subtitle}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleTogglePublish(t)}>
                  {t.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(t.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-3 mb-3">{t.testimonial}</p>
            <span className={`status-badge text-xs ${t.isPublished ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
              {t.isPublished ? "منشورة" : "مخفية"}
            </span>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">لا توجد شهادات بعد</div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "تعديل الشهادة" : "إضافة شهادة جديدة"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="input-label">اسم الطالب *</Label><Input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} /></div>
            <div><Label className="input-label">العنوان الفرعي (مثل: حاصل على منحة في تركيا)</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div><Label className="input-label">نص الشهادة *</Label><Textarea rows={4} value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="input-label">الدولة</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
              <div><Label className="input-label">المنحة</Label><Input value={form.scholarship} onChange={(e) => setForm({ ...form, scholarship: e.target.value })} /></div>
              <div><Label className="input-label">الترتيب</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} /></div>
              <div>
                <Label className="input-label">التقييم</Label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full h-11 px-3 rounded-xl border border-input text-sm">
                  {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} نجوم</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              <span className="text-sm font-medium">نشر الشهادة</span>
            </label>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "جارٍ الحفظ..." : "حفظ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">تأكيد الحذف</DialogTitle></DialogHeader>
          <p>هل تريد حذف هذه الشهادة؟</p>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
