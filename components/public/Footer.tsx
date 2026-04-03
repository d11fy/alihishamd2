import Link from "next/link";
import { GraduationCap, Instagram, MessageCircle, MapPin, Mail, Phone, Heart } from "lucide-react";

const footerLinks = {
  services: [
    { label: "المنح الدراسية", href: "/scholarships" },
    { label: "القبولات الجامعية", href: "/scholarships" },
    { label: "تجهيز ملفات السفر", href: "/contact" },
    { label: "حجز استشارة", href: "/contact" },
  ],
  quickLinks: [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/#about" },
    { label: "خدماتنا", href: "/#services" },
    { label: "قصص النجاح", href: "/#testimonials" },
    { label: "تواصل معنا", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary-900 to-[#0a1520] text-white">
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-gold-500 via-teal-500 to-primary-400" />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-gold">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="block text-xl font-black text-white">مسارات غزة</span>
                <span className="block text-sm text-gold-400">Gaza Pathways</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              نوصلك من غزة للعالم بخطوات واضحة وسهلة. نحن لا نبيع خدمات، نبيع نتائج.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/gaza.pathways"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-all duration-200 hover:shadow-gold"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/970567841404?text=مرحباً،%20أريد%20حجز%20استشارة%20مع%20مسارات%20غزة"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-green-500 flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-5">
              خدماتنا
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-400 text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-5">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-teal-400 text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-5">
              تواصل معنا
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/970567841404"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm">+970 567 841 404</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/gaza.pathways"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 group-hover:bg-pink-500/30 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Instagram className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-sm">@gaza.pathways</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-sm">غزة، فلسطين</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center">
            © {new Date().getFullYear()} مسارات غزة | Gaza Pathways. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            صُنع بـ <Heart className="w-3 h-3 text-red-400 fill-red-400" /> من أجل طلاب غزة
          </p>
        </div>
      </div>
    </footer>
  );
}
