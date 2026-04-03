import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "https://masarat-gaza.com"
  ),
  title: {
    default: "مسارات غزة | Gaza Pathways - منح دراسية وقبولات جامعية",
    template: "%s | مسارات غزة",
  },
  description:
    "نوصلك من غزة للعالم بخطوات واضحة وسهلة. منصة متخصصة في المنح الدراسية الخارجية، القبولات الجامعية، وتجهيز ملفات السفر.",
  keywords: [
    "مسارات غزة",
    "Gaza Pathways",
    "منح دراسية",
    "قبول جامعي",
    "دراسة خارج غزة",
    "منح فلسطين",
    "scholarships Gaza",
    "study abroad Palestine",
  ],
  authors: [{ name: "مسارات غزة" }],
  creator: "مسارات غزة",
  openGraph: {
    type: "website",
    locale: "ar_PS",
    url: "https://masarat-gaza.com",
    title: "مسارات غزة | Gaza Pathways",
    description:
      "نوصلك من غزة للعالم بخطوات واضحة وسهلة. منصة متخصصة في المنح الدراسية والقبولات الجامعية.",
    siteName: "مسارات غزة",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "مسارات غزة | Gaza Pathways",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مسارات غزة | Gaza Pathways",
    description: "نوصلك من غزة للعالم بخطوات واضحة وسهلة",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="font-cairo antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
