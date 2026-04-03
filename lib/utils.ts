import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "en",
    trim: true,
  });
}

export function formatDate(date: Date | string, formatStr = "dd MMMM yyyy"): string {
  return format(new Date(date), formatStr, { locale: ar });
}

export function formatDateRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar });
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ar });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Application status
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
    CONTACTED: "bg-purple-100 text-purple-700 border-purple-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    // Scholarship status
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
    COMING_SOON: "bg-blue-100 text-blue-700 border-blue-200",
    PAUSED: "bg-orange-100 text-orange-700 border-orange-200",
    // Message status
    UNREAD: "bg-red-100 text-red-700 border-red-200",
    READ: "bg-gray-100 text-gray-700 border-gray-200",
    REPLIED: "bg-green-100 text-green-700 border-green-200",
    ARCHIVED: "bg-slate-100 text-slate-700 border-slate-200",
    // Consultation status
    IN_PROGRESS: "bg-purple-100 text-purple-700 border-purple-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function isDeadlineSoon(deadline: Date | null): boolean {
  if (!deadline) return false;
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 && daysLeft <= 14;
}

export function isDeadlinePassed(deadline: Date | null): boolean {
  if (!deadline) return false;
  return new Date() > deadline;
}
