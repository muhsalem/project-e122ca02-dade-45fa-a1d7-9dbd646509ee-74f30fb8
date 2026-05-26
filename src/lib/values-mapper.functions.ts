import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  schwartzScores: z.record(z.string(), z.number()),
  ikigai: z.object({
    love: z.string().max(500),
    good_at: z.string().max(500),
    world_needs: z.string().max(500),
    paid_for: z.string().max(500),
  }),
  topValues: z.array(z.string()).min(1).max(10),
});

function code() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `VAL-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitValuesMapper = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const system = `أنت خبير سيكومتري في علم القيم والمعنى، مرجعك الأكاديمي:
- نظرية القيم العالمية لـ Schwartz (1992, 2012) — 10 قيم أساسية موزعة على 4 أبعاد عليا.
- نموذج Ikigai الياباني لتقاطع: ما تحبه × ما تجيده × ما يحتاجه العالم × ما يُدفع لك مقابله.

**النتائج المحسوبة مسبقاً (لا تُعدّل):**
- درجات القيم العشر (Self-Direction, Stimulation, Hedonism, Achievement, Power, Security, Conformity, Tradition, Benevolence, Universalism).
- أعلى 3-5 قيم للمستخدم.
- إجابات Ikigai الأربع.

أصدر تقريراً بالعربية الفصحى بهيكل Markdown:

# تقرير القيم والمعنى — Schwartz × Ikigai

## ١. ملخص تنفيذي (5 أسطر)
## ٢. قيمك العليا (Top Values)
اشرح كل قيمة من قيم المستخدم العليا، بُعدها (Openness to Change / Self-Enhancement / Conservation / Self-Transcendence)، وما تكشفه عن دوافعه.

## ٣. خريطة القيم الكاملة
جدول بالعشر قيم مرتبة، مع تفسير الترتيب.

## ٤. التوتّرات الداخلية المحتملة
حدد القيم المتعارضة (مثلاً Achievement vs Benevolence) واقترح كيف يديرها.

## ٥. تحليل Ikigai
- ما يحبه ✓ ما يجيده ✓ ما يحتاجه العالم ✓ ما يُدفع له
- نقطة التقاطع المقترحة (الـ Ikigai) — جملتان دقيقتان.
- المناطق الناقصة (Passion / Mission / Profession / Vocation) وما يفعله لردمها.

## ٦. توصيات مهنيّة مبنيّة على القيم
3-5 مسارات تتسق مع قيمك العليا و Ikigai، مع مبرر لكل واحد.

## ٧. قرارات حياتيّة موصى بها هذا العام
4-6 قرارات عمليّة (تطوع، تعلم، علاقات، إنتاج محتوى…).

## ٨. تنبيه قيمي
سطر يذكّر بأن السعي مسؤولية والتوفيق من الله.

## ٩. حدود التقرير
PVQ نسخة مختصرة وليست المقياس الكامل؛ Ikigai أداة استكشافية لا تشخيصية.`;

    const userPayload = JSON.stringify({
      meta: { name: data.name, age: data.age, stage: data.stage },
      schwartzScores: data.schwartzScores,
      topValues: data.topValues,
      ikigai: data.ikigai,
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
      if (res.status === 429) throw new Error("تجاوزت الحد المسموح. حاول لاحقاً.");
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

    const header = `# تقرير القيم والمعنى\n\n**الاسم:** ${data.name ?? "—"}  \n**كود التقرير:** \`${rcode}\`  \n**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}\n\n---\n\n`;
    const report = header + aiReport;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: rcode,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: "values-mapper",
      answers: { schwartzScores: data.schwartzScores, topValues: data.topValues, ikigai: data.ikigai },
      report,
    });
    if (error) throw new Error("تعذر حفظ التقرير.");
    return { code: rcode, report };
  });
