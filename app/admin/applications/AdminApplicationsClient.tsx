"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { updateApplicationStatus, deleteApplication } from "@/actions/applications";
import { APPLICATION_STATUS_LABELS } from "@/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ApplicationWithScholarship } from "@/types";

interface Props {
  applications: ApplicationWithScholarship[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus?: string;
}

export default function AdminApplicationsClient({ applications, total, page, totalPages, currentStatus }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedApp, setSelectedApp] = useState<ApplicationWithScholarship | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  async function handleUpdateStatus() {
    if (!selectedApp || !newStatus) return;
    startTransition(async () => {
      const result = await updateApplicationStatus(selectedApp.id, newStatus, adminNotes);
      if (result.success) {
        toast({ title: "تم تحديث الحالة" });
        setSelectedApp(null);
        router.refresh();
      } else {
        toast({ title: "خطأ", description: result.error, variant: "destructive" });
      }
    });
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteApplication(deleteId);
    setDeleteId(null);
    if (result.success) {
      toast({ title: "تم الحذف" });
      router.refresh();
    } else {
      toast({ title: "خطأ", description: result.error, variant: "destructive" });
    }
  }

  return (
    <>
      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-4">
        <div className="flex gap-3">
          <select
            value={currentStatus || ""}
            onChange={(e) => router.push(`/admin/applications?status=${e.target.value}`)}
            className="h-11 px-3 rounded-xl border border-input bg-background text-sm"
          >
            <option value="">كل الحالات</option>
            {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الطالب</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">المنحة</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">المعدل</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">التاريخ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">لا توجد طلبات</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{app.fullName}</p>
                      <p className="text-xs text-gray-400">{app.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-700 text-xs line-clamp-1">{app.scholarship.title}</p>
                      <p className="text-xs text-gray-400">{app.scholarship.country}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{app.gpa}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{formatDateTime(app.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge text-xs ${getStatusColor(app.status)}`}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                              setSelectedApp(app);
                              setNewStatus(app.status);
                              setAdminNotes(app.adminNotes ?? "");
                            }}>
                              <Eye className="w-4 h-4 ml-2" /> عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setDeleteId(app.id)}>
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
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">صفحة {page} من {totalPages} ({total} طلب)</p>
            <div className="flex gap-2">
              {page > 1 && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/applications?page=${page - 1}${currentStatus ? `&status=${currentStatus}` : ""}`)}>السابق</Button>}
              {page < totalPages && <Button variant="outline" size="sm" onClick={() => router.push(`/admin/applications?page=${page + 1}${currentStatus ? `&status=${currentStatus}` : ""}`)}>التالي</Button>}
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["الاسم", selectedApp.fullName],
                  ["الجوال", selectedApp.phone],
                  ["البريد", selectedApp.email],
                  ["المدينة", selectedApp.city],
                  ["المعدل", selectedApp.gpa],
                  ["التخصص", selectedApp.specialization],
                  ["الدرجة المطلوبة", selectedApp.desiredDegree],
                  ["المنحة", selectedApp.scholarship.title],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              {selectedApp.notes && (
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="text-xs text-blue-400 mb-1">ملاحظات الطالب</p>
                  <p className="text-sm text-blue-800">{selectedApp.notes}</p>
                </div>
              )}
              <div>
                <label className="input-label">تحديث الحالة</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">ملاحظات داخلية</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="ملاحظات للفريق الداخلي..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setSelectedApp(null)}>إلغاء</Button>
            <Button onClick={handleUpdateStatus} disabled={isPending}>
              {isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-red-600">تأكيد الحذف</DialogTitle></DialogHeader>
          <p className="text-gray-600">هل أنت متأكد من حذف هذا الطلب؟</p>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
