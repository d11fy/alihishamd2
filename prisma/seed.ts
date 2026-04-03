import {
  PrismaClient,
  DegreeLevel,
  ScholarshipType,
  FundingType,
  ScholarshipStatus,
  SettingType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات التجريبية...");

  // ===========================
  // Admin Account
  // ===========================
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Admin@123456",
    12
  );

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@masarat-gaza.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@masarat-gaza.com",
      password: adminPassword,
      name: "مدير مسارات غزة",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ تم إنشاء حساب الأدمن");

  // ===========================
  // Scholarships
  // ===========================
  const scholarships = [
    {
      title: "منحة الحكومة التركية - YTB 2025",
      slug: "ytb-turkey-scholarship-2025",
      provider: "رئاسة الأتراك في الخارج - YTB",
      country: "تركيا",
      city: "أنقرة / إسطنبول",
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
      scholarshipType: ScholarshipType.FULLY_FUNDED,
      fundingType: FundingType.GOVERNMENT,
      deadline: new Date("2025-02-28"),
      status: ScholarshipStatus.ACTIVE,
      shortDescription:
        "منحة حكومية تركية مرموقة تشمل تمويلًا كاملًا للدراسة في أفضل الجامعات التركية لجميع المراحل الدراسية مفتوحة لطلاب فلسطين.",
      fullDescription: `منحة الحكومة التركية (YTB) من أكثر المنح الدراسية الخارجية طلبًا بين الطلاب الفلسطينيين. تقدم هذه المنحة فرصة ذهبية للدراسة في أرقى الجامعات التركية بتمويل حكومي كامل.

تشمل المنحة:
- رسوم الدراسة كاملة
- مكافأة شهرية مناسبة
- سكن في المدن الطلابية
- تذكرة طيران ذهابًا وإيابًا
- تأمين صحي شامل
- دورة مكثفة في اللغة التركية`,
      majors: ["الطب", "الهندسة", "العلوم", "الآداب", "الاقتصاد", "الإدارة"],
      benefits: [
        "تمويل كامل للرسوم الدراسية",
        "مكافأة شهرية 700-1400 ليرة تركية",
        "سكن مجاني في المدن الطلابية",
        "تذكرة طيران ذهابًا وإيابًا سنويًا",
        "تأمين صحي شامل",
        "دورة مكثفة في اللغة التركية",
      ],
      requirements: [
        "ألا يتجاوز عمر المتقدم 21 سنة للبكالوريوس، 30 للماجستير، 35 للدكتوراه",
        "معدل لا يقل عن 70% للبكالوريوس و 75% للماجستير والدكتوراه",
        "إجادة اللغة التركية أو الإنجليزية",
        "عدم حمل الجنسية التركية",
      ],
      requiredDocuments: [
        "جواز سفر ساري المفعول",
        "شهادة الثانوية العامة (مصدقة)",
        "كشف الدرجات",
        "شهادات اللغة (إن وجدت)",
        "رسالة دوافع",
        "صورة شخصية",
      ],
      applicationMethod:
        "التقديم يتم إلكترونيًا من خلال الموقع الرسمي لـ YTB. تأكد من تجهيز جميع المستندات المطلوبة قبل البدء في التقديم.",
      externalLink: "https://www.turkiyeburslari.gov.tr/",
      coverImage:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: "منحة الحكومة الهنغارية - Stipendium Hungaricum",
      slug: "stipendium-hungaricum-2025",
      provider: "وزارة التعليم الهنغارية",
      country: "هنغاريا",
      city: "بودابست",
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
      scholarshipType: ScholarshipType.FULLY_FUNDED,
      fundingType: FundingType.GOVERNMENT,
      deadline: new Date("2025-01-15"),
      status: ScholarshipStatus.ACTIVE,
      shortDescription:
        "منحة حكومية هنغارية تمويل كامل للدراسة في جامعات المجر المرموقة، متاحة لجميع التخصصات وجميع المراحل الدراسية.",
      fullDescription: `برنامج Stipendium Hungaricum هو مبادرة الحكومة الهنغارية لاستقطاب الطلاب الدوليين الموهوبين للدراسة في المجر. يعد من أكثر البرامج شمولًا وتنافسية في أوروبا الوسطى.`,
      majors: ["جميع التخصصات"],
      benefits: [
        "إعفاء كامل من رسوم الدراسة",
        "بدل معيشة شهري",
        "سكن في المدن الطلابية أو بدل إيجار",
        "تأمين صحي",
      ],
      requirements: [
        "معدل أكاديمي ممتاز",
        "شهادة لغة إنجليزية معتمدة",
        "عمر أقل من 35 سنة",
      ],
      requiredDocuments: [
        "جواز سفر",
        "الشهادات الأكاديمية",
        "شهادة اللغة الإنجليزية",
        "رسالة توصية",
        "خطة بحثية (للدكتوراه)",
      ],
      applicationMethod:
        "التقديم عبر البوابة الرسمية للبرنامج بعد الحصول على قبول من الجامعة الهنغارية.",
      externalLink: "https://stipendiumhungaricum.hu/",
      coverImage:
        "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: "منحة الملك عبدالله الثاني للتميز - الأردن",
      slug: "king-abdullah-scholarship-jordan-2025",
      provider: "مؤسسة الملك عبدالله الثاني",
      country: "الأردن",
      city: "عمّان",
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER],
      scholarshipType: ScholarshipType.PARTIALLY_FUNDED,
      fundingType: FundingType.GOVERNMENT,
      deadline: new Date("2025-03-31"),
      status: ScholarshipStatus.ACTIVE,
      shortDescription:
        "منحة مرموقة للطلاب المتميزين من فلسطين للدراسة في الجامعات الأردنية الحكومية والخاصة بتمويل جزئي.",
      fullDescription: `توفر مؤسسة الملك عبدالله الثاني للتنمية منحًا للطلاب الفلسطينيين المتميزين للالتحاق بالجامعات الأردنية في مختلف التخصصات.`,
      majors: ["الطب", "الهندسة", "الصيدلة", "القانون", "الاقتصاد"],
      benefits: [
        "تخفيض 50% في الرسوم الدراسية",
        "مساعدة في إيجاد السكن",
        "دعم أكاديمي",
      ],
      requirements: [
        "معدل 85% فأكثر",
        "فلسطيني الجنسية",
        "أقل من 25 سنة",
      ],
      requiredDocuments: ["جواز سفر", "شهادة الثانوية", "شهادات تقدير"],
      applicationMethod: "التقديم المباشر لمؤسسة الملك عبدالله الثاني.",
      coverImage:
        "https://images.unsplash.com/photo-1571260899304-425eee4c7efd?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isPublished: true,
      sortOrder: 3,
    },
    {
      title: "منحة ماليزيا للطلاب الدوليين - MARA",
      slug: "mara-malaysia-scholarship-2025",
      provider: "مجلس أمانة راكيات (MARA)",
      country: "ماليزيا",
      city: "كوالالمبور",
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER],
      scholarshipType: ScholarshipType.FULLY_FUNDED,
      fundingType: FundingType.GOVERNMENT,
      deadline: new Date("2025-04-30"),
      status: ScholarshipStatus.COMING_SOON,
      shortDescription:
        "منحة حكومية ماليزية لطلاب من الدول الإسلامية للدراسة في أفضل الجامعات الماليزية.",
      fullDescription: `تقدم حكومة ماليزيا هذه المنحة ضمن إطار التعاون مع دول العالم الإسلامي. ماليزيا وجهة دراسية مميزة بتكلفة معيشية منخفضة وجودة تعليم عالية.`,
      majors: ["الهندسة", "تقنية المعلومات", "الأعمال", "العلوم الطبية"],
      benefits: [
        "رسوم الدراسة كاملة",
        "بدل معيشة شهري",
        "تذكرة طيران",
        "بدل كتب",
      ],
      requirements: [
        "معدل لا يقل عن 80%",
        "إجادة اللغة الإنجليزية",
        "أقل من 30 سنة",
      ],
      requiredDocuments: [
        "جواز سفر",
        "شهادات أكاديمية",
        "شهادة IELTS أو TOEFL",
        "رسالة توصية",
      ],
      applicationMethod: "التقديم عبر الموقع الرسمي لـ MARA.",
      coverImage:
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
    },
    {
      title: "منحة جامعة القاهرة للطلاب الدوليين",
      slug: "cairo-university-scholarship-2025",
      provider: "جامعة القاهرة",
      country: "مصر",
      city: "القاهرة",
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
      scholarshipType: ScholarshipType.TUITION_ONLY,
      fundingType: FundingType.UNIVERSITY,
      deadline: new Date("2025-06-30"),
      status: ScholarshipStatus.ACTIVE,
      shortDescription:
        "منحة جزئية من جامعة القاهرة العريقة للطلاب الدوليين والفلسطينيين تشمل الإعفاء من الرسوم الدراسية.",
      fullDescription: `جامعة القاهرة من أعرق الجامعات في العالم العربي، وتقدم منحًا للطلاب الدوليين بما فيهم الفلسطينيون. التقديم متاح طوال العام.`,
      majors: ["الطب", "القانون", "الهندسة", "الاقتصاد", "الآداب", "العلوم"],
      benefits: [
        "إعفاء من الرسوم الدراسية",
        "مكتبة جامعية ضخمة",
        "أنشطة طلابية متنوعة",
      ],
      requirements: ["معدل 75% فأكثر", "شهادة الثانوية معادلة"],
      requiredDocuments: [
        "جواز سفر",
        "شهادة الثانوية",
        "كشف الدرجات",
        "صورة شخصية",
      ],
      applicationMethod:
        "التقديم مباشرة عبر مكتب القبول والتسجيل في الجامعة.",
      coverImage:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isPublished: true,
      sortOrder: 5,
    },
    {
      title: "منحة الدراسات العليا في ألمانيا - DAAD",
      slug: "daad-germany-scholarship-2025",
      provider: "هيئة التبادل الأكاديمي الألمانية (DAAD)",
      country: "ألمانيا",
      city: "متعددة",
      degreeLevel: [DegreeLevel.MASTER, DegreeLevel.PHD],
      scholarshipType: ScholarshipType.FULLY_FUNDED,
      fundingType: FundingType.GOVERNMENT,
      deadline: new Date("2024-11-15"),
      status: ScholarshipStatus.CLOSED,
      shortDescription:
        "منحة DAAD الألمانية المرموقة للدراسات العليا في أفضل الجامعات الألمانية. تمويل كامل وفرصة للدراسة في بيئة أكاديمية عالمية.",
      fullDescription: `DAAD من أكبر منظمات تمويل المنح الدراسية في العالم. توفر منحًا للطلاب الدوليين للدراسة في ألمانيا على مستوى الماجستير والدكتوراه.`,
      majors: ["جميع التخصصات العلمية والإنسانية"],
      benefits: [
        "مكافأة شهرية 861 يورو للماجستير",
        "تأمين صحي",
        "بدل سفر",
        "دورات لغة ألمانية",
      ],
      requirements: [
        "درجة بكالوريوس بامتياز",
        "خبرة أكاديمية أو مهنية سنة على الأقل",
        "إتقان الإنجليزية أو الألمانية",
      ],
      requiredDocuments: [
        "السيرة الذاتية",
        "خطة البحث",
        "رسائل توصية (2)",
        "شهادات أكاديمية",
      ],
      applicationMethod: "التقديم عبر البوابة الإلكترونية لـ DAAD.",
      externalLink: "https://www.daad.de/",
      coverImage:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isPublished: true,
      sortOrder: 6,
    },
  ];

  for (const scholarship of scholarships) {
    await prisma.scholarship.upsert({
      where: { slug: scholarship.slug },
      update: {},
      create: scholarship,
    });
  }
  console.log(`✅ تم إنشاء ${scholarships.length} منح دراسية`);

  // ===========================
  // Testimonials
  // ===========================
  const testimonials = [
    {
      studentName: "يوسف السيد",
      subtitle: "طالب دكتوراه في إسطنبول",
      testimonial:
        "لم أكن أتخيل يومًا أنني سأدرس في تركيا، لكن بفضل مسارات غزة وإرشادهم المستمر، حصلت على منحة YTB الكاملة. الفريق رافقني في كل خطوة وجهّز معي الملف بطريقة احترافية لم أتوقعها.",
      country: "تركيا - إسطنبول",
      scholarship: "منحة YTB التركية",
      rating: 5,
      isPublished: true,
      sortOrder: 1,
    },
    {
      studentName: "رنا الأغا",
      subtitle: "طالبة ماجستير في بودابست",
      testimonial:
        "فريق مسارات غزة ليسوا مجرد مستشارين، هم شركاء حقيقيون في رحلتك. ساعدوني في اختيار التخصص المناسب والجامعة المناسبة، وتابعوا معي كل خطوة حتى وصلت لهنغاريا.",
      country: "هنغاريا - بودابست",
      scholarship: "منحة Stipendium Hungaricum",
      rating: 5,
      isPublished: true,
      sortOrder: 2,
    },
    {
      studentName: "خالد محمد",
      subtitle: "مهندس - خريج جامعة ماليزية",
      testimonial:
        "قبل مسارات غزة كنت أبحث في الإنترنت بلا نتائج. بعد التواصل معهم، تغير كل شيء. خلال 3 أشهر كنت قد قُبلت في جامعة ماليزية بمنحة كاملة. لا أملك كلمات تعبر عن الامتنان.",
      country: "ماليزيا - كوالالمبور",
      scholarship: "منحة MARA ماليزيا",
      rating: 5,
      isPublished: true,
      sortOrder: 3,
    },
    {
      studentName: "فاطمة الزهراء",
      subtitle: "طبيبة - دراسة الطب في القاهرة",
      testimonial:
        "مسارات غزة غيرت مسار حياتي بالكامل. كنت أحلم بدراسة الطب ولم أجد الطريق. الآن أنا في السنة الثالثة طب بمنحة جامعة القاهرة. أنصح كل طالب بالتواصل معهم.",
      country: "مصر - القاهرة",
      scholarship: "منحة جامعة القاهرة",
      rating: 5,
      isPublished: true,
      sortOrder: 4,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log(`✅ تم إنشاء ${testimonials.length} شهادات`);

  // ===========================
  // Site Settings
  // ===========================
  const siteSettings = [
    { key: "hero_title", value: "نوصلك من غزة للعالم بخطوات واضحة وسهلة", type: SettingType.TEXT, group: "hero", label: "عنوان Hero" },
    { key: "hero_subtitle", value: "منصة متخصصة في المنح الدراسية الخارجية، القبولات الجامعية، وتجهيز ملفات السفر.", type: SettingType.TEXTAREA, group: "hero", label: "وصف Hero" },
    { key: "hero_cta_text", value: "احجز استشارة مجانية", type: SettingType.TEXT, group: "hero", label: "نص زر CTA" },
    { key: "about_title", value: "أكثر من مجرد منصة", type: SettingType.TEXT, group: "about", label: "عنوان من نحن" },
    { key: "about_description", value: "مسارات غزة ليست مجرد منصة للمنح، بل هي شريكك الحقيقي.", type: SettingType.TEXTAREA, group: "about", label: "وصف من نحن" },
    { key: "whatsapp_number", value: "970567841404", type: SettingType.PHONE, group: "contact", label: "رقم واتساب" },
    { key: "instagram_url", value: "https://instagram.com/gaza.pathways", type: SettingType.URL, group: "contact", label: "رابط انستغرام" },
    { key: "location", value: "غزة، فلسطين", type: SettingType.TEXT, group: "contact", label: "الموقع" },
    { key: "seo_title", value: "مسارات غزة | Gaza Pathways - منح دراسية وقبولات جامعية", type: SettingType.TEXT, group: "seo", label: "عنوان SEO" },
    { key: "seo_description", value: "منصة مسارات غزة - متخصصون في المنح الدراسية الخارجية والقبولات الجامعية لطلاب غزة", type: SettingType.TEXTAREA, group: "seo", label: "وصف SEO" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ تم إنشاء إعدادات الموقع");

  console.log("\n🎉 تم إضافة جميع البيانات التجريبية بنجاح!");
  console.log("\n📌 بيانات الدخول:");
  console.log(`   البريد: ${process.env.ADMIN_EMAIL ?? "admin@masarat-gaza.com"}`);
  console.log(`   كلمة المرور: ${process.env.ADMIN_PASSWORD ?? "Admin@123456"}`);
}

main()
  .catch((e) => {
    console.error("❌ خطأ في Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
