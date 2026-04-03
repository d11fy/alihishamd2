import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Calendar, GraduationCap, ExternalLink, CheckCircle,
  FileText, BookOpen, Users, Clock, ArrowRight, Star
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplicationForm from "@/components/public/ApplicationForm";
import {
  DEGREE_LEVEL_LABELS,
  SCHOLARSHIP_TYPE_LABELS,
  FUNDING_TYPE_LABELS,
  SCHOLARSHIP_STATUS_LABELS,
} from "@/types";
import { formatDate, isDeadlineSoon, isDeadlinePassed } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getScholarship(slug: string) {
  const scholarship = await prisma.scholarship.findUnique({
    where: { slug, isPublished: true },
    include: { _count: { select: { applications: true } } },
  });
  if (scholarship) {
    await prisma.scholarship.update({
      where: { id: scholarship.id },
      data: { viewCount: { increment: 1 } },
    });
  }
  return scholarship;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scholarship = await prisma.scholarship.findUnique({
    where: { slug },
    select: { title: true, shortDescription: true, coverImage: true, country: true, provider: true },
  });
  if (!scholarship) return { title: "منحة غير موجودة" };
  return {
    title: scholarship.title,
    description: scholarship.shortDescription,
    openGraph: {
      title: `${scholarship.title} | مسارات غزة`,
      description: scholarship.shortDescription,
      images: scholarship.coverImage ? [scholarship.coverImage] : [],
    },
  };
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scholarship = await getScholarship(slug);

  if (!scholarship) notFound();

  const deadlineSoon = isDeadlineSoon(scholarship.deadline);
  const deadlinePassed = isDeadlinePassed(scholarship.deadline);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 bg-gradient-brand overflow-hidden">
        {scholarship.coverImage && (
          <Image src={scholarship.coverImage} alt={scholarship.title} fill className="object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-8">
            <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white">الرئيسية</Link>
              <ArrowRight className="w-3 h-3 flip-rtl" />
              <Link href="/scholarships" className="hover:text-white">المنح الدراسية</Link>
              <ArrowRight className="w-3 h-3 flip-rtl" />
              <span className="text-white line-clamp-1">{scholarship.title}</span>
            </nav>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="gold">{SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType]}</Badge>
              {scholarship.isFeatured && (
                <Badge variant="gold">
                  <Star className="w-3 h-3 fill-current" /> مميزة
                </Badge>
              )}
              {deadlineSoon && !deadlinePassed && (
                <Badge variant="orange">
                  <Clock className="w-3 h-3" /> تنتهي قريبًا
                </Badge>
              )}
              {deadlinePassed && <Badge variant="red">منتهية</Badge>}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">
              {scholarship.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: "الدولة", value: `${scholarship.country}${scholarship.city ? ` - ${scholarship.city}` : ""}`, color: "text-primary-500" },
                  { icon: GraduationCap, label: "المرحلة", value: scholarship.degreeLevel.map(d => DEGREE_LEVEL_LABELS[d]).join("، "), color: "text-teal-500" },
                  { icon: Calendar, label: "آخر موعد", value: scholarship.deadline ? formatDate(scholarship.deadline) : "غير محدد", color: "text-gold-500" },
                  { icon: Users, label: "المتقدمون", value: `${(scholarship as typeof scholarship & { _count: { applications: number } })._count?.applications || 0} طالب`, color: "text-purple-500" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="text-center">
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-700 leading-tight">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                نبذة عن المنحة
              </h2>
              <p className="text-gray-600 leading-relaxed">{scholarship.shortDescription}</p>
              {scholarship.fullDescription && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {scholarship.fullDescription}
                </div>
              )}
            </div>

            {/* Benefits */}
            {scholarship.benefits.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-500" />
                  مميزات المنحة
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {scholarship.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {scholarship.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  شروط التقديم
                </h2>
                <ul className="space-y-2">
                  {scholarship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents */}
            {scholarship.requiredDocuments.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-500" />
                  المستندات المطلوبة
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {scholarship.requiredDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 bg-teal-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                      <span className="text-teal-700 text-sm font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Method */}
            {scholarship.applicationMethod && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">طريقة التقديم</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {scholarship.applicationMethod}
                </p>
                {scholarship.externalLink && (
                  <a
                    href={scholarship.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-primary-500 text-white px-5 py-2.5 rounded-xl hover:bg-primary-600 transition-colors font-semibold text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    التقديم المباشر
                  </a>
                )}
              </div>
            )}

            {/* Application Form */}
            {!deadlinePassed && (
              <div id="apply" className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  قدّم على هذه المنحة
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                  أرسل طلبك وسيتواصل معك فريقنا لمساعدتك في إتمام التقديم
                </p>
                <ApplicationForm scholarshipId={scholarship.id} scholarshipTitle={scholarship.title} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">معلومات المنحة</h3>
              <dl className="space-y-3">
                {[
                  { label: "الجهة المانحة", value: scholarship.provider },
                  { label: "نوع المنحة", value: SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType] },
                  { label: "مصدر التمويل", value: FUNDING_TYPE_LABELS[scholarship.fundingType] },
                  { label: "الحالة", value: SCHOLARSHIP_STATUS_LABELS[scholarship.status] },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-semibold text-gray-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Majors */}
            {scholarship.majors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">التخصصات المقبولة</h3>
                <div className="flex flex-wrap gap-2">
                  {scholarship.majors.map((major, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold border border-primary-100">
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {!deadlinePassed ? (
              <div className="bg-gradient-brand rounded-2xl p-6 text-center">
                <h3 className="font-black text-white text-lg mb-2">مهتم بهذه المنحة؟</h3>
                <p className="text-white/70 text-sm mb-4">دعنا نساعدك في التقديم بنجاح</p>
                <Button asChild variant="gold" className="w-full">
                  <a href="#apply">قدّم الآن</a>
                </Button>
                <a
                  href="https://wa.me/970567841404?text=مرحباً،%20أريد%20الاستفسار%20عن%20منحة:%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  أو تواصل عبر واتساب
                </a>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-6 text-center">
                <p className="text-gray-600 font-semibold mb-3">انتهت فترة التقديم</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/scholarships">منح أخرى متاحة</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
