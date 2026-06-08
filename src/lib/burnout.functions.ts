import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  exhaustion: z.number().min(0).max(36),
  cynicism: z.number().min(0).max(30),
  efficacy: z.number().min(0).max(36),
  context: z.string().max(1000).optional(),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `BRN-${s.slice(0, 4)}-${s.slice(4)}`;
}

function riskLevel(ex: number, cy: number, ef: number) {
  // High burnout: high exhaustion + high cynicism + low efficacy
  let score = 0;
  if (ex >= 27) score += 2; else if (ex >= 17) score += 1;
  if (cy >= 13) score += 2; else if (cy >= 7) score += 1;
  if (ef <= 23) score += 2; else if (ef <= 30) score += 1;
  if (score >= 5) return "مرتفع جداً";
  if (score >= 3) return "مرتفع";
  if (score >= 2) return "متوسط";
  return "منخفض";
}

export const submitBurnout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "burnout", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const risk = riskLevel(data.exhaustion, data.cynicism, data.efficacy);

    const system = `أنت أخصائي صحة نفسية مهنية، مرجعيتك Maslach Burnout Inventory (MBI-GS) ومعايير ICD-11 لاحتراق العمل (QD85).

**الدرجات المحسوبة (لا تُعدّل):**
- Emotional Exhaustion: ${data.exhaustion}/36
- Cynicism / Depersonalization: ${data.cynicism}/30
- Professional Efficacy: ${data.efficacy}/36
- **مستوى الخطر: ${risk}**

أصدر تقريراً بالعربية (Markdown) — حانٍ، علمي، عملي:

# مؤشر صحتك المهنية — Burnout Index

## ١. مستواك الحالي
اشرح بصدق ومحبة معنى المستوى (${risk}) دون مبالغة ولا تهوين.

## ٢. تحليل الأبعاد الثلاثة
- الإرهاق العاطفي ${data.exhaustion}/36 — ما يعنيه.
- التبلّد/السلبية ${data.cynicism}/30 — ما يعنيه.
- الفاعلية المهنية ${data.efficacy}/36 — ما يعنيها.

## ٣. الأعراض التي قد تلاحظها
جسديّة + ذهنيّة + سلوكيّة + علاقيّة (مبنية على درجاتك).

## ٤. الأسباب المحتملة (Job-Person Mismatch)
حسب نموذج Maslach: عبء العمل، التحكم، المكافأة، المجتمع، العدالة، القيم.

## ٥. خطة تعافٍ 30 يوماً
- أسبوع 1: استرداد جسدي (نوم، رياضة، تغذية).
- أسبوع 2: حدود رقمية ومهنيّة.
- أسبوع 3: استعادة المعنى (Reconnect with values).
- أسبوع 4: تفاوض/إعادة تصميم الدور.

## ٦. تقنيات يومية مجرّبة
- تنفس صندوقي 4-4-4-4.
- Time Blocking.
- Digital Sunset.
- Gratitude Journaling.
- Pomodoro معكوس.

## ٧. متى تطلب مساعدة متخصصة
${risk === "مرتفع" || risk === "مرتفع جداً" ? "**مستواك يستدعي التواصل مع أخصائي نفسي مرخّص خلال الأسبوعين القادمين.**" : "إن استمرت الأعراض > 4 أسابيع رغم التحسينات."}

## ٨. تنبيه قيمي
> "وَلَا تَقْتُلُوا أَنفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا" (النساء: 29). 
> راحتك عبادة، والاهتمام بنفسك أمانة.

## ٩. حدود التقرير
أداة فرز (Screening) مبنية على MBI-GS مختصر — ليست تشخيصاً سريرياً.`;

    const userPayload = JSON.stringify({ ...data, risk }, null, 2);

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
    const header = `# مؤشر الاحتراق المهني\n\n**الاسم:** ${data.name ?? "—"}  \n**كود التقرير:** \`${rcode}\`  \n**مستوى الخطر:** **${risk}**\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "burnout",
      answers: { ...data, risk },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report, risk };
  });
