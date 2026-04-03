import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/public/SectionHeading";
import ScholarshipCard from "@/components/public/ScholarshipCard";
import type { Scholarship } from "@/types";

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[];
}

export default function FeaturedScholarships({ scholarships }: FeaturedScholarshipsProps) {
  if (scholarships.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
          <SectionHeading
            badge="المنح الدراسية"
            title="أحدث"
            highlight="المنح المتاحة"
            description="اكتشف أفضل المنح الدراسية المختارة بعناية لطلاب غزة"
            centered={false}
            className="max-w-lg"
          />
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link href="/scholarships">
              عرض جميع المنح
              <ArrowLeft className="w-4 h-4 flip-rtl" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship, i) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="gold" size="lg">
            <Link href="/scholarships">
              استعرض جميع المنح الدراسية
              <ArrowLeft className="w-5 h-5 flip-rtl" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
