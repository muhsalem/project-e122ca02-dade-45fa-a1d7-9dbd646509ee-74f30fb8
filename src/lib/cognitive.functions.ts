import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  scores: z.object({
    reasoning: z.number().min(0).max(100),
    memory: z.number().min(0).max(100),
    flexibility: z.number().min(0).max(100),
    speed: z.number().min(0).max(100),
  }),
  details: z.record(z.string(), z.union([z.string(), z.number()])),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `COG-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitCognitive = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const system = `أنت خبير في علم النفس المعرفي والتقييم العصبي-النفسي (Neuropsychology). مرجعيتك:
- نموذج CHC (Cattell-Horn-Carroll) للقدرات المعرفية.
- اختبارات WAIS-IV / Cognitive Assessment Tests الحديثة.
- مرونة المخ (Cognitive Flexibility) — Wisconsin Card Sorting Test.

**القياسات المحسوبة (0-100):** Reasoning, Working Memory, Cognitive Flexibility, Processing Speed.
هذه ليست IQ — هي بروفايل استكشافي للتفضيلات المعرفية.

أصدر تقريراً بالعربية الفصحى (Markdown):

# بروفايلك المعرفي — Cognitive Profile

## ١. ملخص تنفيذي (5 أسطر)
اذكر الدرجات الأربع صراحةً.

## ٢. تفسير كل قدرة
لكل قدرة:
- ماذا تقيس + درجتك + الفئة (منخفض/متوسط/مرتفع/مرتفع جداً).
- ما يعنيه ذلك في الدراسة والعمل.

## ٣. نمطك المعرفي السائد
حدد ملف القوة الغالب (تحليلي / تنفيذي سريع / مرن مبدع / منهجي عميق).

## ٤. مهن ومسارات تستفيد من بروفايلك
3-5 مسارات مع مبرر معرفي.

## ٥. تحديات محتملة
أين قد تشعر بالإرهاق المعرفي وكيف تتعامل.

## ٦. تمارين تطوير
لكل قدرة من القدرات الأربع: 2-3 تمارين/تطبيقات (Lumosity, BrainHQ, Dual N-Back, Chess, Sudoku, تعلم لغة جديدة...).

## ٧. نمط دراسة موصى به
بناء على القدرة الأقوى (Spaced Repetition, Pomodoro, Active Recall, Mind Mapping).

## ٨. تنبيه علمي مهم
- هذه ليست اختبارات IQ ولا تشخيصاً عصبياً.
- الدرجات تتأثر بالنوم، الإجهاد، التغذية، الوقت من اليوم.
- إن لاحظت تراجعاً مستمراً، استشر متخصصاً.

## ٩. تنبيه قيمي
العقل أمانة — احفظه بالنوم والتغذية والذكر.`;

    const userPayload = JSON.stringify({
      meta: { name: data.name, age: data.age, stage: data.stage },
      scores: data.scores,
      details: data.details,
    }, null, 2);

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
    const header = `# تقرير البروفايل المعرفي\n\n**الاسم:** ${data.name ?? "—"}  \n**كود التقرير:** \`${rcode}\`  \n**الدرجات:** التفكير ${data.scores.reasoning} · الذاكرة ${data.scores.memory} · المرونة ${data.scores.flexibility} · السرعة ${data.scores.speed}\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "cognitive",
      answers: { scores: data.scores, details: data.details },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report };
  });
