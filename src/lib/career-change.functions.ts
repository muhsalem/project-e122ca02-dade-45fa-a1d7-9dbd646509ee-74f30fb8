import { AI_GUARDRAILS } from "./ai-guardrails";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Item = z.number().int().min(0).max(4);

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  job: z.string().max(120).optional(),
  years: z.string().max(20).optional(),
  // 21 mixed items: 3 per dimension
  burnout: z.array(Item).length(3),
  engagement: z.array(Item).length(3),
  motivation: z.array(Item).length(3),
  satisfaction: z.array(Item).length(3),
  fit: z.array(Item).length(3),
  resilience: z.array(Item).length(3),
  mentalHealth: z.array(Item).length(3),
  context: z.string().max(1000).optional(),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `CHG-${s.slice(0, 4)}-${s.slice(4)}`;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
// invert: high score = positive; for negatively-worded scales (burnout) we keep as-is = high = bad
function pct(score: number, max: number) {
  return Math.round((score / max) * 100);
}

export const submitCareerChange = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "career-change", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const scores = {
      burnout: pct(sum(data.burnout), 12),
      engagement: pct(sum(data.engagement), 12),
      motivation: pct(sum(data.motivation), 12),
      satisfaction: pct(sum(data.satisfaction), 12),
      fit: pct(sum(data.fit), 12),
      resilience: pct(sum(data.resilience), 12),
      mentalHealth: pct(sum(data.mentalHealth), 12),
    };

    // Change-readiness signal
    const changeUrgency =
      scores.burnout >= 60 || scores.satisfaction <= 35 || scores.fit <= 35
        ? "مرتفعة"
        : scores.burnout >= 40 || scores.satisfaction <= 50 || scores.fit <= 50
          ? "متوسطة"
          : "منخفضة";

    const system = `أنت مرشد مهني متخصص في تحولات المسار المهني (Career Pivot)، مرجعيتك: 
- Maslach Burnout Inventory (MBI)
- Utrecht Work Engagement Scale (UWES-9)
- Self-Determination Theory (Deci & Ryan)
- Minnesota Satisfaction Questionnaire (MSQ)
- Person-Job Fit (Edwards)
- Career Adapt-Abilities Scale (Savickas)
- WHO-5 Wellbeing Index

**الدرجات (نسب مئوية):**
- الاحتراق النفسي والضغط: ${scores.burnout}%
- الالتزام والانخراط: ${scores.engagement}%
- الدافعية والتحفيز: ${scores.motivation}%
- الرضا الوظيفي: ${scores.satisfaction}%
- التوافق المهني (Person-Job Fit): ${scores.fit}%
- المرونة النفسية المهنية: ${scores.resilience}%
- الصحة النفسية المهنية: ${scores.mentalHealth}%
- **مؤشر الحاجة للتغيير: ${changeUrgency}**

أصدر تقريراً عربياً (Markdown) — صادق، تحليلي، عملي:

# تشخيص مرحلة "أريد تغيير مساري"

## ١. قراءة سريعة لوضعك
ملخص في 4-5 أسطر يربط بين الأبعاد السبعة.

## ٢. خريطة أبعادك السبعة
جدول واضح: البُعد | الدرجة | المعنى | الإشارة.

## ٣. هل التغيير هو الحل فعلاً؟
حلّل بصدق:
- هل المشكلة في **الوظيفة** (بيئة/مدير/عبء) أم في **المهنة نفسها** (لا تناسب قيمك ومهاراتك)؟
- متى يكون التغيير قراراً ناضجاً ومتى يكون هروباً؟

## ٤. خيارات أمامك (4 سيناريوهات)
- **Job Crafting**: إعادة تشكيل وظيفتك الحالية.
- **Internal Pivot**: تحول داخل نفس المؤسسة.
- **Industry Pivot**: نفس المهارة في قطاع جديد.
- **Full Career Change**: تغيير جذري للمهنة.
اشرح متى يناسب كل سيناريو وضعك.

## ٥. خطة 90 يوماً للانتقال الذكي
- شهر 1: تشخيص + إيقاف النزيف النفسي.
- شهر 2: استكشاف بدائل (مقابلات معلوماتية، تجارب صغيرة).
- شهر 3: قرار + خطة تنفيذ مالية وزمنية.

## ٦. أدوات بوصلة المقترحة لك
وفق درجاتك: 
- إن كان الاحتراق ≥ 60% → "مؤشر الاحتراق المهني" + جلسة كوتشينج.
- إن كان التوافق ≤ 40% → "اكتشف ذاتك" + "اكتشف مسارك المهني" + "تحليل فجوة المهارات".
- إن كانت الصحة النفسية منخفضة → "فحص الصحة المهنية".

## ٧. تنبيه قيمي
> "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ" (الطلاق: 3).
> التغيير ليس فشلاً، بل وعي ونضج.

## ٨. حدود التقرير
أداة فرز مهني مبنية على مقاييس مختصرة — لا تُغني عن جلسة كوتشينج فردية.`;

    const userPayload = JSON.stringify({ ...data, scores, changeUrgency }, null, 2);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 5000,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPayload },
        ],
      }),
    });
    if (!res.ok) {
      if (res.status === 429) throw new Error("تجاوزت الحد المسموح.");
      if (res.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      throw new Error("تعذر إنشاء التقرير.");
    }
    const json = await res.json();
    const aiReport: string = json?.choices?.[0]?.message?.content ?? "";
    if (!aiReport) throw new Error("تقرير فارغ.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let rcode = code();
    for (let i = 0; i < 5; i++) {
      const { data: e } = await supabaseAdmin.from("assessment_reports").select("id").eq("code", rcode).maybeSingle();
      if (!e) break;
      rcode = code();
    }
    const header = `# تشخيص "أريد تغيير مساري"\n\n**الاسم:** ${data.name ?? "—"}  \n**الوظيفة الحالية:** ${data.job ?? "—"}  \n**كود التقرير:** \`${rcode}\`  \n**مؤشر الحاجة للتغيير:** **${changeUrgency}**\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "career-change",
      answers: { ...data, scores, changeUrgency },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report, changeUrgency, scores };
  });
