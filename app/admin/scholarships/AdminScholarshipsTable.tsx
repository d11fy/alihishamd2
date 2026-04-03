"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Edit2, Trash2, Eye, EyeOff, Star, StarOff,
  MoreVertical, ExternalLink, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { deleteScholarship, toggleScholarshipPublished, toggleScholarshipFeatured } from "@/actions/scholarships";
import { SCHOLARSHIP_TYPE_LABELS, SCHOLARSHIP_STATUS_LABELS } from "@/types";
import { getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Scholarship } from "@/types";

interface AdminScholarshipsTableProps {
  scholarships: (Scholarship & { _count: { applications: number } })[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch?: string;
  currentStatus?: string;
}

export default function AdminScholarshipsTable({
  scholarships, total, page, totalPages, currentSearch, currentStatus
}: AdminScholarshipsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function applySearch() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentStatus) params.set("status", currentStatus);
    router.push(`/admin/scholarships?${params.toString()}`);
  }

  async function handleTogglePublish(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleScholarshipPublished(id, !current);
      if (result.success) {
        toast({ title: current ? "تم إخفاء المنحة" : "تم نشر المنحة" });
        router.refresh();
      } else {
        toast({ title: "خطأ", description: result.error, variant: "destructive" });
      }
    });
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleScholarshipFeatured(id, !current);
      if (result.success) {
        toast({ title: current ? "تم إلغاء التمييز" : "تم تمييز المنحة" });
        router.refresh();
      } else {
        toast({ title: "خطأ", description: result.error, variant: "destructive" });
      }
    });
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteScholarship(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (result.success) {
      toast({ title: "تم حذف المنحة بنجاح" });
      router.refresh();
    } else {
      toast({ title: "خطأ", description: result.error, variant: "destructive" });
    }
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="بحث بالعنوان، الدولة، الجهة..."
              className="pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <select
            value={currentStatus || ""}
            onChange={(e) => {
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              if (e.target.value) params.set("status", e.target.value);
              router.push(`/admin/scholarships?${params.toString()}`);
            }}
            className="h-11 px-3 rounded-xl border border-input bg-background text-sm"
          >
            <option value="">كل الحالات</option>
            {Object.entries(SCHOLARSHIP_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <Button onClick={applySearch}>
            <Search className="w-4 h-4" />
            بحث
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">المنحة</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">النوع</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">الطلبات</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">الحالة</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scholarships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    لا توجد منح
                  </td>
                </tr>
              ) : (
                scholarships.map((scholarship) => (
                  <tr key={scholarship.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {scholarship.isFeatured && (
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{scholarship.title}</p>
                          <p className="text-xs text-gray-400">{scholarship.provider} · {scholarship.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType]}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText className="w-3.5 h-3.5" />
                        {scholarship._count.applications}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`status-badge text-xs ${scholarship.isPublished ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                          {scholarship.isPublished ? "منشورة" : "مسودة"}
                        </span>
                        <span className={`status-badge text-xs ${getStatusColor(scholarship.status)}`}>
                          {SCHOLARSHIP_STATUS_LABELS[scholarship.status]}
                        </span>
                      </div>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/scholarships/${scholarship.id}/edit`} className="cursor-pointer">
                                <Edit2 className="w-4 h-4 ml-2" /> تعديل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/scholarships/${scholarship.slug}`} target="_blank" className="cursor-pointer">
                                <ExternalLink className="w-4 h-4 ml-2" /> عرض
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleTogglePublish(scholarship.id, scholarship.isPublished)}
                            >
                              {scholarship.isPublished ? (
                                <><EyeOff className="w-4 h-4 ml-2" /> إخفاء</>
                              ) : (
                                <><Eye className="w-4 h-4 ml-2" /> نشر</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleToggleFeatured(scholarship.id, scholarship.isFeatured)}
                            >
                              {scholarship.isFeatured ? (
                                <><StarOff className="w-4 h-4 ml-2" /> إلغاء التمييز</>
                              ) : (
                                <><Star className="w-4 h-4 ml-2" /> تمييز</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => setDeleteId(scholarship.id)}
                            >
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
            <p className="text-sm text-gray-500">
              صفحة {page} من {totalPages} ({total} منحة)
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" onClick={() => {
                  const params = new URLSearchParams();
                  if (currentSearch) params.set("search", currentSearch);
                  params.set("page", String(page - 1));
                  router.push(`/admin/scholarships?${params.toString()}`);
                }}>السابق</Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" onClick={() => {
                  const params = new URLSearchParams();
                  if (currentSearch) params.set("search", currentSearch);
                  params.set("page", String(page + 1));
                  router.push(`/admin/scholarships?${params.toString()}`);
                }}>التالي</Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">هل أنت متأكد من حذف هذه المنحة؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع الطلبات المرتبطة بها.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "جارٍ الحذف..." : "حذف نهائيًا"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
