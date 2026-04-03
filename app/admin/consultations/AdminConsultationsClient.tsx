"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { updateConsultationStatus, deleteConsultation } from "@/actions/consultations";
import { CONSULTATION_STATUS_LABELS } from "@/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Consultation } from "@/types";

interface Props {
  consultations: Consultation[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus?: string;
}

export default function AdminConsultationsClient({ consultations, total, page, totalPages, currentStatus }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleUpdate() {
    if (!selected) return;
    setSaving(true);
    const result = await updateConsultationStatus(selected.id, newStatus, adminNote);
    setSaving(false);
    if (result.success) {
      toast({ title: "تم التحديث" });
      setSelected(null);
      router.refresh();
    } else {
      toast({ title: "خطأ", description: result.error, variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteConsultation(deleteId);
    setDeleteId(null);
    if (result.success) { toast({ title: "تم الحذف" }); router.refresh(); }
    else toast({ title: "خطأ", description: result.error, variant: "destructive" });
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-4">
        <select
          value={currentStatus || ""}
          onChange={(e) => router.push(`/admin/consultations?status=${e.target.value}`)}
          className="h-11 px-3 rounded-xl border border-input bg-background text-sm"
        >
          <option value="">كل الحالات</option>
          {Object.entries(CONSULTATION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الاسم</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">البريد / الجوال</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">التاريخ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {consultations.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">لا توجد استشارات</td></tr>
              ) : (
                consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{c.fullName}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                      <p>{c.email}</p><p>{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{formatDateTime(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge text-xs ${getStatusColor(c.status)}`}>{CONSULTATION_STATUS_LABELS[c.status]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelected(c); setNewStatus(c.status); setAdminNote(c.adminNote ?? ""); }}>
                              <Eye className="w-4 h-4 ml-2" /> عرض وتحديث
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setDeleteId(c.id)}>
                              <Trash2 className="w-4 h-4 ml-2" /> حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">صفحة {page} من {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/consultations?page=${page - 1}`)}>السابق</Button>}
              {page < totalPages && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/consultations?page=${page + 1}`)}>التالي</Button>}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>تفاصيل الاستشارة</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[["الاسم", selected.fullName], ["الجوال", selected.phone], ["البريد", selected.email]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className="font-semibold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-xs text-blue-400 mb-1">الرسالة</p>
                <p className="text-sm text-blue-800">{selected.message}</p>
              </div>
              <div>
                <label className="input-label">الحالة</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm">
                  {Object.entries(CONSULTATION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">ملاحظة داخلية</label>
                <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setSelected(null)}>إلغاء</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? "جارٍ الحفظ..." : "حفظ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">تأكيد الحذف</DialogTitle></DialogHeader>
          <p>هل أنت متأكد من الحذف؟</p>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
