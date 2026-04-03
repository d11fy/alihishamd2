"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">حدث خطأ ما</h2>
        <p className="text-gray-500 mb-8">
          عذرًا، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
