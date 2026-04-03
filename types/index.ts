import type {
  Scholarship,
  ScholarshipApplication,
  Testimonial,
  Consultation,
  ContactMessage,
  Admin,
  DegreeLevel,
  ScholarshipType,
  FundingType,
  ScholarshipStatus,
  ApplicationStatus,
  ConsultationStatus,
  MessageStatus,
  AdminRole,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Scholarship,
  ScholarshipApplication,
  Testimonial,
  Consultation,
  ContactMessage,
  Admin,
  DegreeLevel,
  ScholarshipType,
  FundingType,
  ScholarshipStatus,
  ApplicationStatus,
  ConsultationStatus,
  MessageStatus,
  AdminRole,
};

// Extended types
export type ScholarshipWithApplicationCount = Scholarship & {
  _count: {
    applications: number;
  };
};

export type ApplicationWithScholarship = ScholarshipApplication & {
  scholarship: Pick<Scholarship, "id" | "title" | "slug" | "country">;
};

// Form types
export interface ScholarshipFormData {
  title: string;
  slug: string;
  provider: string;
  country: string;
  city?: string;
  degreeLevel: DegreeLevel[];
  scholarshipType: ScholarshipType;
  fundingType: FundingType;
  deadline?: Date;
  status: ScholarshipStatus;
  shortDescription: string;
  fullDescription: string;
  majors: string[];
  benefits: string[];
  requirements: string[];
  requiredDocuments: string[];
  applicationMethod?: string;
  externalLink?: string;
  coverImage?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export interface ApplicationFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  gpa: string;
  specialization: string;
  desiredDegree: string;
  notes?: string;
  cvFile?: string;
  transcriptFile?: string;
  passportFile?: string;
  extraFile?: string;
}

export interface ConsultationFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactFormData {
  fullName: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalScholarships: number;
  publishedScholarships: number;
  totalApplications: number;
  newApplications: number;
  totalConsultations: number;
  newConsultations: number;
  totalMessages: number;
  unreadMessages: number;
}

// Utility types
export type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Degree level labels
export const DEGREE_LEVEL_LABELS: Record<DegreeLevel, string> = {
  BACHELOR: "بكالوريوس",
  MASTER: "ماجستير",
  PHD: "دكتوراه",
  DIPLOMA: "دبلوم",
  LANGUAGE_COURSE: "دورة لغة",
  SHORT_COURSE: "دورة قصيرة",
  ANY: "جميع المراحل",
};

export const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
  FULLY_FUNDED: "ممولة بالكامل",
  PARTIALLY_FUNDED: "ممولة جزئيًا",
  TUITION_ONLY: "رسوم دراسية فقط",
  LIVING_ALLOWANCE: "بدل معيشة",
  RESEARCH_GRANT: "منحة بحثية",
  EXCHANGE: "تبادل طلابي",
};

export const FUNDING_TYPE_LABELS: Record<FundingType, string> = {
  GOVERNMENT: "حكومية",
  UNIVERSITY: "جامعية",
  NGO: "منظمة غير حكومية",
  PRIVATE: "خاصة",
  INTERNATIONAL_ORGANIZATION: "منظمة دولية",
};

export const SCHOLARSHIP_STATUS_LABELS: Record<ScholarshipStatus, string> = {
  ACTIVE: "نشطة",
  CLOSED: "مغلقة",
  COMING_SOON: "قريبًا",
  PAUSED: "متوقفة",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  CONTACTED: "تم التواصل",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
};

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  NEW: "جديد",
  IN_PROGRESS: "جارٍ المعالجة",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  UNREAD: "غير مقروءة",
  READ: "مقروءة",
  REPLIED: "تمت الإجابة",
  ARCHIVED: "مؤرشفة",
};
