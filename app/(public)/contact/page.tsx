export const dynamic = "force-dynamic";
import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق مسارات غزة واحجز استشارتك المجانية",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
