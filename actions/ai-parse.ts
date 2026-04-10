"use server";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ParsedScholarship {
  title?: string;
  provider?: string;
  country?: string;
  city?: string;
  degreeLevel?: string[];
  scholarshipType?: string;
  fundingType?: string;
  deadline?: string;
  shortDescription?: string;
  fullDescription?: string;
  majors?: string[];
  benefits?: string[];
  requirements?: string[];
  requiredDocuments?: string[];
  applicationMethod?: string;
  externalLink?: string;
}

export async function parseScholarshipText(text: string): Promise<{ success: true; data: ParsedScholarship } | { success: false; error: string }> {
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `أنت مساعد متخصص في تحليل تفاصيل المنح الدراسية. استخرج المعلومات من النص التالي وأرجعها بتنسيق JSON فقط بدون أي نص إضافي.

النص:
${text}

أرجع JSON بهذا الهيكل بالضبط (اترك الحقل null إذا لم تجد المعلومة):
{
  "title": "اسم المنحة",
  "provider": "الجهة المانحة (جامعة أو منظمة)",
  "country": "الدولة",
  "city": "المدينة أو null",
  "degreeLevel": ["BACHELOR" و/أو "MASTER" و/أو "PHD" و/أو "DIPLOMA" و/أو "LANGUAGE_COURSE" و/أو "SHORT_COURSE" و/أو "ANY"],
  "scholarshipType": "FULLY_FUNDED أو PARTIALLY_FUNDED أو TUITION_ONLY أو LIVING_ALLOWANCE أو RESEARCH_GRANT أو EXCHANGE",
  "fundingType": "GOVERNMENT أو UNIVERSITY أو NGO أو PRIVATE أو INTERNATIONAL_ORGANIZATION",
  "deadline": "YYYY-MM-DD أو null",
  "shortDescription": "وصف مختصر 50-150 حرف",
  "fullDescription": "وصف كامل تفصيلي للمنحة",
  "majors": ["قائمة التخصصات المقبولة"],
  "benefits": ["قائمة مزايا المنحة مثل: تذاكر سفر، سكن مجاني، مكافأة شهرية..."],
  "requirements": ["قائمة شروط التقديم"],
  "requiredDocuments": ["قائمة المستندات المطلوبة"],
  "applicationMethod": "طريقة وخطوات التقديم أو null",
  "externalLink": "رابط التقديم إذا موجود أو null"
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return { success: false, error: "استجابة غير متوقعة من الذكاء الاصطناعي" };
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "لم يتمكن الذكاء الاصطناعي من تحليل النص" };
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedScholarship;

    // Clean nulls
    Object.keys(parsed).forEach((key) => {
      const k = key as keyof ParsedScholarship;
      if (parsed[k] === null || parsed[k] === undefined) delete parsed[k];
      if (Array.isArray(parsed[k]) && (parsed[k] as string[]).length === 0) delete parsed[k];
    });

    return { success: true, data: parsed };
  } catch (error) {
    console.error("parseScholarshipText error:", error);
    return { success: false, error: error instanceof Error ? error.message : "فشل تحليل النص" };
  }
}
