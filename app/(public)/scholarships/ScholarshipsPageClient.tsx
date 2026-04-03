"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScholarshipCard from "@/components/public/ScholarshipCard";
import {
  SCHOLARSHIP_TYPE_LABELS,
  DEGREE_LEVEL_LABELS,
  type Scholarship,
  type ScholarshipType,
  type DegreeLevel,
} from "@/types";

interface ScholarshipsPageClientProps {
  scholarships: Scholarship[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  countries: string[];
  currentParams: {
    search?: string;
    country?: string;
    type?: string;
    degree?: string;
    page?: string;
  };
}

export default function ScholarshipsPageClient({
  scholarships,
  total,
  page,
  totalPages,
  countries,
  currentParams,
}: ScholarshipsPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(currentParams.search || "");
  const [country, setCountry] = useState(currentParams.country || "");
  const [type, setType] = useState(currentParams.type || "");
  const [degree, setDegree] = useState(currentParams.degree || "");

  function applyFilters(overrides?: Partial<typeof currentParams>) {
    const params = new URLSearchParams();
    const values = {
      search,
      country,
      type,
      degree,
      ...overrides,
    };
    if (values.search) params.set("search", values.search);
    if (values.country) params.set("country", values.country);
    if (values.type) params.set("type", values.type);
    if (values.degree) params.set("degree", values.degree);

    startTransition(() => {
      router.push(`/scholarships?${params.toString()}`);
    });
  }

  function clearFilters() {
    setSearch("");
    setCountry("");
    setType("");
    setDegree("");
    startTransition(() => {
      router.push("/scholarships");
    });
  }

  const hasActiveFilters = !!currentParams.search || !!currentParams.country || !!currentParams.type || !!currentParams.degree;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Page Header */}
      <div className="bg-gradient-brand py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            المنح الدراسية
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            اكتشف {total} منحة دراسية مختارة بعناية لطلاب غزة حول العالم
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 shadow-brand-sm sticky top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث عن منحة، دولة، أو جهة منحة..."
                className="pr-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              فلترة
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-gold-500" />
              )}
            </Button>

            {/* Desktop Filters */}
            <div className={`flex gap-3 flex-wrap ${showFilters ? "flex" : "hidden md:flex"}`}>
              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); applyFilters({ country: e.target.value }); }}
                className="h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">كل الدول</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => { setType(e.target.value); applyFilters({ type: e.target.value }); }}
                className="h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">نوع المنحة</option>
                {Object.entries(SCHOLARSHIP_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={degree}
                onChange={(e) => { setDegree(e.target.value); applyFilters({ degree: e.target.value }); }}
                className="h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">المرحلة الدراسية</option>
                {Object.entries(DEGREE_LEVEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <Button onClick={() => applyFilters()} disabled={isPending}>
                <Search className="w-4 h-4" />
                بحث
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <X className="w-4 h-4" />
                  مسح
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            عرض{" "}
            <span className="font-bold text-gray-900">{scholarships.length}</span>{" "}
            من أصل{" "}
            <span className="font-bold text-gray-900">{total}</span>{" "}
            منحة
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              مسح الفلاتر
            </button>
          )}
        </div>

        {scholarships.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد منح مطابقة</h3>
            <p className="text-gray-500 mb-6">جرّب تغيير معايير البحث أو مسح الفلاتر</p>
            <Button onClick={clearFilters} variant="outline">مسح الفلاتر</Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship, i) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams(currentParams as Record<string, string>);
                      params.set("page", String(page - 1));
                      router.push(`/scholarships?${params.toString()}`);
                    }}
                  >
                    السابق
                  </Button>
                )}
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  صفحة {page} من {totalPages}
                </span>
                {page < totalPages && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams(currentParams as Record<string, string>);
                      params.set("page", String(page + 1));
                      router.push(`/scholarships?${params.toString()}`);
                    }}
                  >
                    التالي
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
