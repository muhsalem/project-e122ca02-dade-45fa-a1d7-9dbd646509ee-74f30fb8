import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  currentRole: z.string().trim().min(2).max(120),
  targetRole: z.string().trim().min(2).max(120),
  currentSkills: z.string().trim().min(5).max(2000),
  experienceYears: z.string().trim().max(20).optional(),
});

export const analyzeSkillsGap = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const prompt = `أنت مستشار مهني خبير. قم بإجراء تحليل فجوة مهارات (Skills Gap Analysis) دقيق ومنظم بالعربية الفصحى.

الدور الحالي: ${data.currentRole}
الدور المستهدف: ${data.targetRole}
سنوات الخبرة: ${data.experienceYears || "غير محدد"}
المهارات الحالية: ${data.currentSkills}

أعد التقرير بصيغة Markdown بالأقسام التالية بالضبط:

## 1. ملخص الجاهزية
نسبة مئوية تقديرية لجاهزية الانتقال + تقييم موجز (3 أسطر).

## 2. المهارات المطلوبة للدور المستهدف
قائمة 8-12 مهارة (تقنية + ناعمة).

## 3. المهارات التي تمتلكها بالفعل ✅
قائمة من مهاراتك المتطابقة.

## 4. الفجوات الحرجة 🔴
3-5 مهارات يجب اكتسابها فوراً، مع شرح أهمية كل واحدة.

## 5. الفجوات المتوسطة 🟡
3-5 مهارات يفضل اكتسابها.

## 6. خطة 90 يوماً
- **الشهر 1:** مهام محددة + موارد (دورات Coursera/Udemy/SkillShare بأسماء حقيقية).
- **الشهر 2:** مشاريع تطبيقية.
- **الشهر 3:** بناء معرض أعمال + تقديم.

## 7. شهادات احترافية موصى بها
3-5 شهادات معتمدة مع الجهة المانحة وتقدير التكلفة والمدة.

## 8. تحذير قيمي
سطر واحد يذكّر بأن السعي مسؤولية والتوفيق من الله.

اجعل التحليل واقعياً ومبنياً على معايير سوق العمل في المنطقة العربية 2026.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`فشل توليد التحليل: ${res.status} ${t.slice(0, 200)}`);
    }
    const json = await res.json();
    const report: string = json.choices?.[0]?.message?.content ?? "";
    return { report };
  });
