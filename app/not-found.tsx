import Link from "next/link";
import { GraduationCap, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="relative text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-glass">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-8xl font-black text-white/30 mb-4">404</h1>
        <h2 className="text-2xl font-black text-white mb-4">الصفحة غير موجودة</h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
          ربما تم نقلها أو حذفها.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="gold">
            <Link href="/">
              <Home className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button asChild className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20">
            <Link href="/scholarships">
              <Search className="w-4 h-4" />
              استعرض المنح
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
