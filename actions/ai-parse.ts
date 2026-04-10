"use server";

import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

export async function parseScholarshipText(
  text: string
): Promise<{ success: true; data: ParsedScholarship } | { success: false; error: string }> {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `أنت مساعد متخصص في تحليل تفاصيل المنح الدراسية. استخرج المعلومات من النص وأرجعها بتنسيق JSON فقط.

الهيكل المطلوب:
{
  "title": "اسم المنحة",
  "provider": "الجهة المانحة",
  "country": "الدولة",
  "city": "المدينة أو null",
  "degreeLevel": ["BACHELOR","MASTER","PHD","DIPLOMA","LANGUAGE_COURSE","SHORT_COURSE","ANY"] (اختر ما ينطبق),
  "scholarshipType": "FULLY_FUNDED أو PARTIALLY_FUNDED أو TUITION_ONLY أو LIVING_ALLOWANCE أو RESEARCH_GRANT أو EXCHANGE",
  "fundingType": "GOVERNMENT أو UNIVERSITY أو NGO أو PRIVATE أو INTERNATIONAL_ORGANIZATION",
  "deadline": "YYYY-MM-DD أو null",
  "shortDescription": "وصف مختصر 50-150 حرف",
  "fullDescription": "وصف كامل تفصيلي",
  "majors": ["التخصصات المقبولة"],
  "benefits": ["مزايا المنحة"],
  "requirements": ["شروط التقديم"],
  "requiredDocuments": ["المستندات المطلوبة"],
  "applicationMethod": "طريقة التقديم أو null",
  "externalLink": "رابط التقديم أو null"
}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "لم تصل استجابة من الذكاء الاصطناعي" };
    }

    const parsed = JSON.parse(content) as ParsedScholarship;

    // Clean nulls and empty arrays
    (Object.keys(parsed) as (keyof ParsedScholarship)[]).forEach((key) => {
      if (parsed[key] === null || parsed[key] === undefined) delete parsed[key];
      if (Array.isArray(parsed[key]) && (parsed[key] as string[]).length === 0) delete parsed[key];
    });

    return { success: true, data: parsed };
  } catch (error) {
    console.error("parseScholarshipText error:", error);
    return { success: false, error: error instanceof Error ? error.message : "فشل تحليل النص" };
  }
}
