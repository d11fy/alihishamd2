"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Plus, X, RefreshCw, Upload, ImageIcon, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { scholarshipSchema, type ScholarshipSchemaType } from "@/lib/validators/scholarship";
import { createScholarship, updateScholarship } from "@/actions/scholarships";
import { parseScholarshipText } from "@/actions/ai-parse";
import { generateSlug } from "@/lib/utils";
import { DEGREE_LEVEL_LABELS, SCHOLARSHIP_TYPE_LABELS, FUNDING_TYPE_LABELS, SCHOLARSHIP_STATUS_LABELS } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import type { Scholarship } from "@/types";

interface ScholarshipFormProps {
  scholarship?: Scholarship;
}

function ArrayInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  label?: string;
}) {
  const [inputVal, setInputVal] = useState("");

  function add() {
    if (!inputVal.trim()) return;
    onChange([...value, inputVal.trim()]);
    setInputVal("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {label && <Label className="input-label">{label}</Label>}
      <div className="flex gap-2 mb-2">
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={add} variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span key={i} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full border border-primary-100">
              {item}
              <button type="button" onClick={() => remove(i)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScholarshipForm({ scholarship }: ScholarshipFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [aiText, setAiText] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ScholarshipSchemaType>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: scholarship
      ? {
          title: scholarship.title,
          slug: scholarship.slug,
          provider: scholarship.provider,
          country: scholarship.country,
          city: scholarship.city ?? undefined,
          degreeLevel: scholarship.degreeLevel as ScholarshipSchemaType["degreeLevel"],
          scholarshipType: scholarship.scholarshipType as ScholarshipSchemaType["scholarshipType"],
          fundingType: scholarship.fundingType as ScholarshipSchemaType["fundingType"],
          deadline: scholarship.deadline
            ? new Date(scholarship.deadline).toISOString().split("T")[0]
            : undefined,
          status: scholarship.status as ScholarshipSchemaType["status"],
          shortDescription: scholarship.shortDescription,
          fullDescription: scholarship.fullDescription,
          majors: scholarship.majors,
          benefits: scholarship.benefits,
          requirements: scholarship.requirements,
          requiredDocuments: scholarship.requiredDocuments,
          applicationMethod: scholarship.applicationMethod ?? undefined,
          externalLink: scholarship.externalLink ?? undefined,
          coverImage: scholarship.coverImage ?? undefined,
          isFeatured: scholarship.isFeatured,
          isPublished: scholarship.isPublished,
          sortOrder: scholarship.sortOrder,
        }
      : {
          degreeLevel: [],
          scholarshipType: "FULLY_FUNDED",
          fundingType: "GOVERNMENT",
          status: "ACTIVE",
          majors: [],
          benefits: [],
          requirements: [],
          requiredDocuments: [],
          isFeatured: false,
          isPublished: false,
          sortOrder: 0,
        },
  });

  const title = watch("title");

  function autoSlug() {
    if (title) setValue("slug", generateSlug(title));
  }

  async function handleAiFill() {
    if (!aiText.trim()) return;
    setAiLoading(true);
    const result = await parseScholarshipText(aiText);
    setAiLoading(false);

    if (!result.success) {
      toast({ title: "فشل التحليل", description: result.error, variant: "destructive" });
      return;
    }

    const d = result.data;
    if (d.title) setValue("title", d.title);
    if (d.provider) setValue("provider", d.provider);
    if (d.country) setValue("country", d.country);
    if (d.city) setValue("city", d.city);
    if (d.degreeLevel?.length) setValue("degreeLevel", d.degreeLevel as ScholarshipSchemaType["degreeLevel"]);
    if (d.scholarshipType) setValue("scholarshipType", d.scholarshipType as ScholarshipSchemaType["scholarshipType"]);
    if (d.fundingType) setValue("fundingType", d.fundingType as ScholarshipSchemaType["fundingType"]);
    if (d.deadline) setValue("deadline", d.deadline);
    if (d.shortDescription) setValue("shortDescription", d.shortDescription);
    if (d.fullDescription) setValue("fullDescription", d.fullDescription);
    if (d.majors?.length) setValue("majors", d.majors);
    if (d.benefits?.length) setValue("benefits", d.benefits);
    if (d.requirements?.length) setValue("requirements", d.requirements);
    if (d.requiredDocuments?.length) setValue("requiredDocuments", d.requiredDocuments);
    if (d.applicationMethod) setValue("applicationMethod", d.applicationMethod);
    if (d.externalLink) setValue("externalLink", d.externalLink);

    // auto-generate slug from title if empty
    if (d.title && !watch("slug")) setValue("slug", generateSlug(d.title));

    setAiOpen(false);
    setAiText("");
    toast({ title: "تم التعبئة التلقائية بنجاح!", description: "راجع البيانات وعدّل ما تحتاج قبل الحفظ" });
  }

  async function onSubmit(data: ScholarshipSchemaType) {
    startTransition(async () => {
      const result = scholarship
        ? await updateScholarship(scholarship.id, data)
        : await createScholarship(data);

      if (result.success) {
        toast({ title: scholarship ? "تم تحديث المنحة" : "تم إنشاء المنحة", variant: "default" });
        router.push("/admin/scholarships");
        router.refresh();
      } else {
        toast({ title: "خطأ", description: result.error, variant: "destructive" });
      }
    });
  }

  function onInvalid(errs: typeof errors) {
    const messages = Object.entries(errs).map(([field, err]) => {
      const labels: Record<string, string> = {
        title: "اسم المنحة", slug: "Slug", provider: "الجهة المانحة",
        country: "الدولة", degreeLevel: "المرحلة الدراسية",
        shortDescription: "النبذة المختصرة", fullDescription: "الوصف الكامل",
        benefits: "المميزات", requirements: "الشروط", externalLink: "رابط التقديم",
      };
      return `${labels[field] ?? field}: ${(err as { message?: string })?.message ?? "مطلوب"}`;
    });
    toast({
      title: "يوجد حقول ناقصة أو غير صحيحة",
      description: messages.slice(0, 3).join(" | "),
      variant: "destructive",
    });
    // scroll to first error
    const firstError = document.querySelector(".border-red-300, [data-error]");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const DEGREE_OPTIONS = Object.entries(DEGREE_LEVEL_LABELS);
  const currentDegrees = watch("degreeLevel") ?? [];

  function toggleDegree(degree: string) {
    const current = currentDegrees as string[];
    if (current.includes(degree)) {
      setValue("degreeLevel", current.filter((d) => d !== degree) as ScholarshipSchemaType["degreeLevel"]);
    } else {
      setValue("degreeLevel", [...current, degree] as ScholarshipSchemaType["degreeLevel"]);
    }
  }

  return (
    <div className="space-y-6">
    {/* AI Auto-fill Panel */}
    <div className="bg-gradient-to-l from-primary-50 to-teal-50 border border-primary-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setAiOpen(!aiOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-right"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-primary-800 text-sm">تعبئة تلقائية بالذكاء الاصطناعي</p>
            <p className="text-xs text-primary-600">الصق تفاصيل المنحة وسيتم ملء الحقول تلقائياً</p>
          </div>
        </div>
        {aiOpen ? <ChevronUp className="w-5 h-5 text-primary-600" /> : <ChevronDown className="w-5 h-5 text-primary-600" />}
      </button>

      {aiOpen && (
        <div className="px-6 pb-5 space-y-3 border-t border-primary-200">
          <p className="text-xs text-primary-700 pt-3">
            الصق أي نص يحتوي تفاصيل المنحة (من موقع، بريد إلكتروني، إعلان...) وسيستخرج الذكاء الاصطناعي البيانات تلقائياً.
          </p>
          <Textarea
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder="مثال: منحة الحكومة التركية YTB 2025 تشمل بكالوريوس وماجستير ودكتوراه، ممولة بالكامل، تشمل راتب شهري 700 دولار، سكن مجاني، تأمين صحي، الموعد النهائي 20 فبراير 2025، يشترط إجادة اللغة التركية أو الإنجليزية، رابط التقديم: scholarship.gov.tr"
            rows={6}
            className="bg-white text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => { setAiText(""); setAiOpen(false); }}>
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAiFill}
              disabled={aiLoading || !aiText.trim()}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {aiLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin ml-1" /> جارٍ التحليل...</>
              ) : (
                <><Sparkles className="w-4 h-4 ml-1" /> تحليل وتعبئة</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>

    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">1</span>
          المعلومات الأساسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="input-label">اسم المنحة *</Label>
            <Input placeholder="منحة دراسية في جامعة..." {...register("title")} className={errors.title ? "border-red-300" : ""} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label className="input-label">Slug (URL) *</Label>
            <div className="flex gap-2">
              <Input placeholder="scholarship-name" dir="ltr" {...register("slug")} className={errors.slug ? "border-red-300" : ""} />
              <Button type="button" onClick={autoSlug} variant="outline" size="icon" title="توليد تلقائي">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <Label className="input-label">الجهة المانحة *</Label>
            <Input placeholder="اسم الجامعة أو المنظمة" {...register("provider")} className={errors.provider ? "border-red-300" : ""} />
            {errors.provider && <p className="text-xs text-red-500 mt-1">{errors.provider.message}</p>}
          </div>
          <div>
            <Label className="input-label">الدولة *</Label>
            <Input placeholder="تركيا، ألمانيا..." {...register("country")} className={errors.country ? "border-red-300" : ""} />
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>
          <div>
            <Label className="input-label">المدينة</Label>
            <Input placeholder="اختياري" {...register("city")} />
          </div>
        </div>
      </div>

      {/* Type & Funding */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">2</span>
          نوع المنحة والتمويل
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="input-label">نوع المنحة *</Label>
            <select {...register("scholarshipType")} className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {Object.entries(SCHOLARSHIP_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label className="input-label">مصدر التمويل *</Label>
            <select {...register("fundingType")} className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {Object.entries(FUNDING_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label className="input-label">حالة المنحة *</Label>
            <select {...register("status")} className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {Object.entries(SCHOLARSHIP_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label className="input-label">الموعد النهائي</Label>
            <Input type="date" dir="ltr" {...register("deadline")} />
          </div>
          <div>
            <Label className="input-label">ترتيب الظهور</Label>
            <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
          </div>
        </div>

        {/* Degree Level */}
        <div className="mt-4">
          <Label className="input-label">المرحلة الدراسية * (اختر واحدة أو أكثر)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DEGREE_OPTIONS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleDegree(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  currentDegrees.includes(key as never)
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.degreeLevel && <p className="text-xs text-red-500 mt-1">{errors.degreeLevel.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">3</span>
          الوصف والتفاصيل
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="input-label">النبذة المختصرة *</Label>
            <Textarea
              placeholder="وصف مختصر يظهر في بطاقة المنحة (20-500 حرف)"
              rows={3}
              {...register("shortDescription")}
              className={errors.shortDescription ? "border-red-300" : ""}
            />
            {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription.message}</p>}
          </div>
          <div>
            <Label className="input-label">الوصف الكامل *</Label>
            <Textarea
              placeholder="تفاصيل كاملة عن المنحة..."
              rows={6}
              {...register("fullDescription")}
              className={errors.fullDescription ? "border-red-300" : ""}
            />
            {errors.fullDescription && <p className="text-xs text-red-500 mt-1">{errors.fullDescription.message}</p>}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">4</span>
          الشروط والمميزات
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="benefits"
            render={({ field }) => (
              <ArrayInput value={field.value} onChange={field.onChange} placeholder="أضف ميزة (Enter)" label="المميزات *" />
            )}
          />
          <Controller
            control={control}
            name="requirements"
            render={({ field }) => (
              <ArrayInput value={field.value} onChange={field.onChange} placeholder="أضف شرطًا (Enter)" label="الشروط *" />
            )}
          />
          <Controller
            control={control}
            name="requiredDocuments"
            render={({ field }) => (
              <ArrayInput value={field.value} onChange={field.onChange} placeholder="أضف مستندًا مطلوبًا (Enter)" label="المستندات المطلوبة" />
            )}
          />
          <Controller
            control={control}
            name="majors"
            render={({ field }) => (
              <ArrayInput value={field.value} onChange={field.onChange} placeholder="أضف تخصصًا (Enter)" label="التخصصات المقبولة" />
            )}
          />
        </div>
      </div>

      {/* Application */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">5</span>
          طريقة التقديم والروابط
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="input-label">طريقة التقديم</Label>
            <Textarea placeholder="شرح خطوات التقديم على المنحة..." rows={3} {...register("applicationMethod")} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="input-label">رابط التقديم المباشر</Label>
              <Input type="url" placeholder="https://..." dir="ltr" {...register("externalLink")} />
              {errors.externalLink && <p className="text-xs text-red-500 mt-1">{errors.externalLink.message}</p>}
            </div>
            <div>
              <Label className="input-label">صورة الغلاف</Label>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <div className="space-y-3">
                    {field.value ? (
                      <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={field.value}
                          alt="صورة الغلاف"
                          width={600}
                          height={315}
                          className="w-full h-36 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <p className="text-xs">لم يتم اختيار صورة</p>
                      </div>
                    )}
                    <UploadButton
                      endpoint="scholarshipImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) field.onChange(res[0].url);
                        toast({ title: "تم رفع الصورة بنجاح" });
                      }}
                      onUploadError={(error) => {
                        toast({ title: "فشل رفع الصورة", description: error.message, variant: "destructive" });
                      }}
                      appearance={{
                        button: "bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-xl w-full ut-uploading:bg-primary-400",
                        allowedContent: "hidden",
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (isUploading) return <><Loader2 className="w-4 h-4 animate-spin inline ml-1" /> جارٍ الرفع...</>;
                          if (ready) return <><Upload className="w-4 h-4 inline ml-1" /> {field.value ? "تغيير الصورة" : "رفع صورة"}</>;
                          return "جارٍ التهيئة...";
                        },
                      }}
                    />
                    <p className="text-xs text-gray-400 text-center">
                      المقاس المناسب: <span className="font-semibold text-gray-600">1200 × 630 بكسل</span> (نسبة 16:9) · الحد الأقصى: 4MB · JPG أو PNG أو WEBP
                    </p>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publish Options */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-brand-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">6</span>
          خيارات النشر
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("isPublished")} className="w-4 h-4 rounded text-primary-500" />
            <div>
              <p className="font-semibold text-gray-800">نشر المنحة</p>
              <p className="text-xs text-gray-500">ستظهر في الموقع العام</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("isFeatured")} className="w-4 h-4 rounded text-gold-500" />
            <div>
              <p className="font-semibold text-gray-800">منحة مميزة</p>
              <p className="text-xs text-gray-500">ستظهر في الصفحة الرئيسية</p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" />جارٍ الحفظ...</>
          ) : (
            <><Save className="w-4 h-4" />{scholarship ? "تحديث المنحة" : "إنشاء المنحة"}</>
          )}
        </Button>
      </div>
    </form>
    </div>
  );
}
