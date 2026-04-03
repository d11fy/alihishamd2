# مسارات غزة | Gaza Pathways

منصة متخصصة في المنح الدراسية الخارجية، القبولات الجامعية، وتجهيز ملفات السفر.

## التقنيات المستخدمة

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 (Auth.js)
- **RTL**: دعم كامل للغة العربية

## متطلبات التشغيل

- Node.js 18+
- PostgreSQL 14+
- npm أو yarn

## خطوات التشغيل المحلي

### 1. نسخ المشروع وتثبيت الحزم

```bash
cd masarat-gaza
npm install
```

### 2. إعداد قاعدة البيانات

**خيار 1: محلي (PostgreSQL)**
```bash
# إنشاء قاعدة بيانات جديدة
createdb masarat_gaza
```

**خيار 2: Neon (مجاني)**
1. سجل في [neon.tech](https://neon.tech)
2. أنشئ project جديد
3. انسخ connection string

**خيار 3: Supabase (مجاني)**
1. سجل في [supabase.com](https://supabase.com)
2. أنشئ project جديد
3. اذهب إلى Settings > Database > Connection string

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
```

ثم عدّل `.env.local`:

```env
DATABASE_URL="postgresql://username:password@host:5432/masarat_gaza"
NEXTAUTH_SECRET="your-secret-key"  # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@masarat-gaza.com"
ADMIN_PASSWORD="Admin@123456"
```

### 4. تهيئة قاعدة البيانات

```bash
# توليد Prisma Client
npm run db:generate

# رفع Schema لقاعدة البيانات
npm run db:push

# إضافة البيانات التجريبية
npm run db:seed
```

### 5. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

---

## الوصول للوحة التحكم

```
URL: http://localhost:3000/admin/login
Email: admin@masarat-gaza.com
Password: Admin@123456
```

---

## هيكل المشروع

```
masarat-gaza/
├── app/
│   ├── (public)/          # الموقع العام
│   │   ├── page.tsx       # الصفحة الرئيسية
│   │   ├── scholarships/  # صفحات المنح
│   │   └── contact/       # صفحة التواصل
│   ├── admin/             # لوحة التحكم
│   │   ├── dashboard/
│   │   ├── scholarships/
│   │   ├── applications/
│   │   ├── testimonials/
│   │   ├── consultations/
│   │   ├── messages/
│   │   └── settings/
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── public/            # مكونات الموقع العام
│   └── admin/             # مكونات لوحة التحكم
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── utils.ts           # Helper functions
│   └── validators/        # Zod schemas
├── actions/               # Server Actions
├── types/                 # TypeScript types
├── hooks/                 # Custom hooks
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Seed data
```

---

## النشر على Vercel

### 1. رفع الكود على GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/masarat-gaza.git
git push -u origin main
```

### 2. إنشاء مشروع على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "New Project"
3. اختر مستودع GitHub

### 3. إضافة متغيرات البيئة في Vercel
في لوحة التحكم > Settings > Environment Variables:
```
DATABASE_URL=postgresql://...  (من Neon أو Supabase)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.vercel.app
ADMIN_EMAIL=admin@masarat-gaza.com
ADMIN_PASSWORD=your-strong-password
```

### 4. بعد النشر
```bash
# تشغيل Seed على الإنتاج (مرة واحدة)
npx prisma db push
npx tsx prisma/seed.ts
```

---

## الأوامر المتاحة

```bash
npm run dev          # تشغيل محلي
npm run build        # بناء للإنتاج
npm run start        # تشغيل الإنتاج
npm run db:push      # رفع Schema
npm run db:generate  # توليد Prisma Client
npm run db:seed      # إضافة بيانات تجريبية
npm run db:studio    # فتح Prisma Studio
```

---

## بيانات التواصل

- **واتساب**: https://wa.me/970567841404
- **انستغرام**: https://instagram.com/gaza.pathways
- **الموقع**: غزة، فلسطين

---

صُنع بـ ❤️ من أجل طلاب غزة
