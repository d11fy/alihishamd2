"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { updateMessageStatus, deleteMessage } from "@/actions/contact";
import { MESSAGE_STATUS_LABELS } from "@/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ContactMessage } from "@/types";

interface Props {
  messages: ContactMessage[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus?: string;
}

export default function AdminMessagesClient({ messages, total, page, totalPages, currentStatus }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleMarkStatus(id: string, status: string) {
    await updateMessageStatus(id, status);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteMessage(deleteId);
    setDeleteId(null);
    if (result.success) { toast({ title: "تم الحذف" }); router.refresh(); }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-4">
        <select
          value={currentStatus || ""}
          onChange={(e) => router.push(`/admin/messages?status=${e.target.value}`)}
          className="h-11 px-3 rounded-xl border border-input bg-background text-sm"
        >
          <option value="">كل الحالات</option>
          {Object.entries(MESSAGE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">المرسل</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">الموضوع</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">التاريخ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">لا توجد رسائل</td></tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} className={`hover:bg-gray-50 ${m.status === "UNREAD" ? "font-semibold" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="text-gray-800">{m.fullName}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 line-clamp-1">{m.subject}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{formatDateTime(m.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge text-xs ${getStatusColor(m.status)}`}>{MESSAGE_STATUS_LABELS[m.status]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelected(m); handleMarkStatus(m.id, "READ"); }}>
                              <Eye className="w-4 h-4 ml-2" /> عرض
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleMarkStatus(m.id, "REPLIED")}>
                              تمت الإجابة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleMarkStatus(m.id, "ARCHIVED")}>
                              أرشفة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setDeleteId(m.id)}>
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
              {page > 1 && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/messages?page=${page - 1}`)}>السابق</Button>}
              {page < totalPages && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/messages?page=${page + 1}`)}>التالي</Button>}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>تفاصيل الرسالة</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[["الاسم", selected.fullName], ["البريد", selected.email], ["الجوال", selected.phone ?? "-"], ["الموضوع", selected.subject]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className="font-semibold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-400 mb-2">الرسالة</p>
                <p className="text-blue-800 leading-relaxed">{selected.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelected(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">تأكيد الحذف</DialogTitle></DialogHeader>
          <p>هل تريد حذف هذه الرسالة؟</p>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
