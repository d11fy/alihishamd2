export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminTestimonialsClient from "./AdminTestimonialsClient";

export const metadata: Metadata = { title: "قصص النجاح | مسارات غزة" };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">قصص النجاح</h1>
        <p className="text-sm text-gray-500 mt-1">إجمالي {testimonials.length} شهادة</p>
      </div>
      <AdminTestimonialsClient testimonials={testimonials} />
    </div>
  );
}
