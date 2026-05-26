import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  themeScores: z.record(z.string(), z.number()),
  top5: z.array(z.string()).length(5),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `STR-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitStrengths = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const system = `أنت خبير سيكومتري متخصص في علم نقاط القوة (Strengths Psychology) — مرجعيتك:
- Gallup CliftonStrengths (34 موهبة موزعة على 4 مجالات: Executing / Influencing / Relationship Building / Strategic Thinking).
- VIA Character Strengths (Peterson & Seligman, 2004).

**Top 5 محسوبة مسبقاً ولا تُعدّل.** اشرحها واربطها بمواقف عمليّة.

أصدر تقريراً بالعربية الفصحى (Markdown):

# تقرير نقاط القوة — كوكبة قوتك

## ١. ملخص تنفيذي (4 أسطر)
## ٢. نقاط قوتك الخمس الكبرى
لكل واحدة:
- اسمها بالعربية والإنجليزية + المجال (Executing/Influencing/Relationship/Strategic).
- كيف تظهر عندك في الحياة اليومية.
- استخداماتها المهنيّة المثلى.
- محاذيرها عند الإفراط (Shadow Side).

## ٣. التكامل بين الخمس
كيف تتفاعل قوتك مع بعضها لتصنع توقيعاً فريداً (مثلاً Strategic + Achiever = منفّذ بصيرة).

## ٤. أدوار وبيئات عمل تزدهر فيها
3-5 أدوار + نوع البيئة (تعاوني/مستقل/قيادي/تحليلي).

## ٥. أدوار يجب تجنّبها أو تطويعها
أدوار تستنزف قوتك بدلاً من إطلاقها.

## ٦. خطة 90 يوماً لتوظيف قوتك
4-6 مهام/تجارب تكثّف استثمار Top 5.

## ٧. شراكات وفرق
أي أنماط أشخاص يكملونك (نقاط قوتك الضعيفة لديهم قوية).

## ٨. تنبيه قيمي
القوة أمانة — استخدمها لخدمة الآخرين.

## ٩. حدود التقرير
استبيان مستوحى من CliftonStrengths/VIA، ليس النسخة المُقنّنة الرسمية.`;

    const userPayload = JSON.stringify({
      meta: { name: data.name, age: data.age, stage: data.stage },
      themeScores: data.themeScores,
      top5: data.top5,
    }, null, 2);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 6000,
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

    const header = `# تقرير نقاط القوة\n\n**الاسم:** ${data.name ?? "—"}  \n**كود التقرير:** \`${rcode}\`  \n**Top 5:** ${data.top5.join(" · ")}\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "strengths",
      answers: { themeScores: data.themeScores, top5: data.top5 },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report };
  });
