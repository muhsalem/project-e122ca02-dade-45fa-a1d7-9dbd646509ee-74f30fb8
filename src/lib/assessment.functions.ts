import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  answers: z.record(z.string(), z.string().max(3000)),
  sections: z.array(z.object({
    title: z.string().max(100),
    items: z.array(z.object({ q: z.string().max(500), a: z.string().max(2000) })).max(20),
  })).max(20).optional(),
});

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `BSL-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitAssessment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SectionSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `أنت مرشد مهني ومدرب حياتي عربي خبير، تستند إلى أسس علم النفس المهني والكوتشينج المعتمد (ICF). 
مهمتك تحليل إجابات المتدرب وإصدار تقرير ارشادي مهني عميق ومنظم باللغة العربية الفصحى الواضحة.

التزم بهذا الهيكل بدقة باستخدام Markdown:

# تقرير الإرشاد المهني الشامل

## ١. ملخص تنفيذي
فقرة تجمع أبرز ملامح شخصية المتدرب المهنية في 4-6 أسطر.

## ٢. الوعي الذاتي
تحليل لمستوى الوعي الذاتي ونقاط القوة والنقاط التي تحتاج تطوير.

## ٣. تحليل الشخصية
حدد النزعة الرئيسية للمتدرب (انطوائي/انبساطي، تحليلي/حدسي، ضغط المواقف، أسلوب اتخاذ القرار) وكيف تؤثر على اختيار بيئة العمل والمسارات المهنية.

## ٤. خريطة المهارات والمواهب
- مهارات ظاهرة
- مواهب كامنة محتملة
- مهارات يُنصح بتطويرها

## ٥. العادات والاتجاهات
تحليل العادات الإيجابية والسلبية واتجاهات التفكير ومدى توافقها مع الأهداف.

## ٦. الميول والاهتمامات (وفق نموذج Holland/RIASEC حين يتضح)
حدد النمط أو الأنماط المسيطرة مع تبرير من إجابات المتدرب.

## ٧. الرغبات والأحلام والطموح
تحليل واقعية الأحلام، الفجوة بين الواقع والطموح، ومدى الوضوح.

## ٨. القدرات والإمكانيات
الموارد الذاتية والبيئية المتاحة وكيفية توظيفها.

## ٩. المسارات المهنية المقترحة
اقترح 3-5 مسارات مهنية محددة مع شرح سبب المناسبة لكل مسار.

## ١٠. خطة التطوير (90 يومًا)
خطوات عملية مرقمة قابلة للتنفيذ خلال 30/60/90 يومًا.

## ١١. أسئلة للنقاش مع المرشد المهني
5-7 أسئلة عميقة يطرحها المتدرب على مرشده في الجلسة.

كن صادقًا ومحترمًا، استشهد بإجابات المتدرب حين تذكر استنتاجًا، وتجنب العموميات.`;

    const userPayload = JSON.stringify({
      meta: { name: data.name, age: data.age, stage: data.stage },
      answers: data.answers,
    }, null, 2);

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `إليك إجابات المتدرب على التقييم الشامل. قم بتحليلها وإصدار التقرير وفق الهيكل المحدد:\n\n${userPayload}` },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تم تجاوز الحد المسموح من الطلبات. حاول لاحقًا.");
      if (aiRes.status === 402) throw new Error("نفدت رصيد الذكاء الاصطناعي. يرجى شحن الرصيد.");
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      throw new Error("تعذر إنشاء التقرير. حاول مرة أخرى.");
    }

    const aiJson = await aiRes.json();
    const report: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!report) throw new Error("استجابة فارغة من الذكاء الاصطناعي.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("assessment_reports").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: data.stage ?? null,
      answers: data.answers,
      report,
    });
    if (error) {
      console.error("Insert error:", error);
      throw new Error("تعذر حفظ التقرير.");
    }

    return { code, report };
  });
