export const dynamic = "force-dynamic";
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } else {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <Label className="input-label">البريد الإلكتروني</Label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder="admin@masarat-gaza.com"
            className="pr-10"
            dir="ltr"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label className="input-label">كلمة المرور</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-10 pl-10"
            dir="ltr"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" />جارٍ تسجيل الدخول...</>
        ) : (
          "تسجيل الدخول"
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-glass-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-brand">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">مسارات غزة</h1>
            <p className="text-gray-500 text-sm mt-1">لوحة التحكم</p>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
            تسجيل دخول المدير
          </h2>

          <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
