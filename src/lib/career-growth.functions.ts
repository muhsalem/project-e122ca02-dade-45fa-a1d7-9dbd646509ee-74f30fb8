import { AI_GUARDRAILS } from "./ai-guardrails";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Item = z.number().int().min(0).max(4);

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  job: z.string().max(120).optional(),
  years: z.string().max(20).optional(),
  // 18 mixed items: 6 per dimension
  performance: z.array(Item).length(6),
  decisionMaking: z.array(Item).length(6),
  leadership: z.array(Item).length(6),
  goal: z.string().max(500).optional(),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `GRW-${s.slice(0, 4)}-${s.slice(4)}`;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const pct = (score: number, max: number) => Math.round((score / max) * 100);
const level = (p: number) => (p >= 75 ? "متقدم" : p >= 55 ? "متوسط" : p >= 35 ? "نامٍ" : "يحتاج تطوير");

export const submitCareerGrowth = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "career-growth", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const scores = {
      performance: pct(sum(data.performance), 24),
      decisionMaking: pct(sum(data.decisionMaking), 24),
      leadership: pct(sum(data.leadership), 24),
    };
    const levels = {
      performance: level(scores.performance),
      decisionMaking: level(scores.decisionMaking),
      leadership: level(scores.leadership),
    };

    const system = `أنت مدرّب تطوير قادة (Executive Coach) معتمد ICF، مرجعيتك:
- Korn Ferry Leadership Architect
- DDI Leadership Competencies
- Vroom-Yetton Decision Model
- Edwards & Morrison Performance Framework
- Kouzes & Posner — The Leadership Challenge

**درجات الموظف (نسب مئوية ومستويات):**
- الأداء والكفاءة: ${scores.performance}% (${levels.performance})
- اتخاذ القرار وحل المشكلات: ${scores.decisionMaking}% (${levels.decisionMaking})
- القيادة والإدارة: ${scores.leadership}% (${levels.leadership})

**هدف الموظف:** ${data.goal ?? "تطوير مساره العام"}

أصدر تقريراً عربياً (Markdown) — استراتيجي، عملي، طموح:

# خطة تطوير مسارك الوظيفي

## ١. ملخص قدراتك الحالية
3-4 أسطر تربط الأبعاد الثلاثة بصورتك المهنية.

## ٢. تحليل الأبعاد الثلاثة
لكل بُعد: المستوى، نقاط القوة المرجّحة، الفجوات.

## ٣. منطقة نموك القادمة (Next Zone)
حدّد البُعد الذي يجب أن يكون أولوية الـ 6 أشهر القادمة ولماذا.

## ٤. خطة تطوير 12 شهراً (IDP)
- ربع 1: مهارات أساس (تحت كل بُعد).
- ربع 2: مشروع تطبيقي.
- ربع 3: قيادة مبادرة/فريق صغير.
- ربع 4: مراجعة 360° + ترقية مستهدفة.

## ٥. 5 ممارسات يومية للقادة
ممارسات قابلة للتنفيذ من اليوم.

## ٦. كتب ودورات موصى بها (3 من كل)
عربية أو إنجليزية، حديثة.

## ٧. مؤشرات نجاحك (KPIs)
كيف تقيس تقدمك خلال 90 يوماً.

## ٨. أدوات بوصلة المقترحة
- "شهادة الجاهزية المهنية" لقياس استعدادك للترقية.
- "توأم المسار" لمحاكاة قرارات قيادية.
- جلسة كوتشينج تنفيذي لتفعيل الخطة.

## ٩. تنبيه قيمي
> "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَنْ يُتْقِنَهُ" (رواه البيهقي).
> التطوير عبادة وأمانة.

## ١٠. حدود التقرير
تقييم ذاتي — يُكمَّل بمراجعة 360° وملاحظات المدير المباشر.`;

    const userPayload = JSON.stringify({ ...data, scores, levels }, null, 2);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 5000,
        messages: [
          { role: "system", content: system + AI_GUARDRAILS },
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
    const header = `# خطة تطوير مسارك الوظيفي\n\n**الاسم:** ${data.name ?? "—"}  \n**الوظيفة:** ${data.job ?? "—"}  \n**كود التقرير:** \`${rcode}\`\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "career-growth",
      answers: { ...data, scores, levels },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report, scores, levels };
  });
