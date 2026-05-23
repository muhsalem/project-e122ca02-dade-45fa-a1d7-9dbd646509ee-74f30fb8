import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  answers: z.record(z.string(), z.string().max(500)),
  scores: z.object({
    occupation: z.number().min(0).max(100),
    job: z.number().min(0).max(100),
    profession: z.number().min(0).max(100),
    craft: z.number().min(0).max(100),
  }),
});

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `CPT-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitCareerType = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const sorted = Object.entries(data.scores).sort((a, b) => b[1] - a[1]);
    const labelMap: Record<string, string> = {
      occupation: "Occupation — النشاط المهني العام",
      job: "Job — الوظيفة",
      profession: "Profession — المهنة الاحترافية",
      craft: "Craft — الحِرفة",
    };
    const dominant = labelMap[sorted[0][0]];
    const secondary = labelMap[sorted[1][0]];

    const systemPrompt = `أنت مرشد مهني خبير ومتخصص في توجيه المسار الوظيفي. تساعد الأفراد في فهم نوع علاقتهم بالعمل عبر التمييز بين أربعة مفاهيم:
1) Occupation: نشاط عام لكسب الرزق، يشمل أعمالًا متنوعة بلا اشتراط تخصص.
2) Job: وظيفة محددة عند صاحب عمل بمهام وراتب وساعات واضحة، قابلة للتغيير.
3) Profession: مهنة تتطلب تعليمًا عاليًا وتدريبًا وترخيصًا ومعايير أخلاقية.
4) Craft: حِرفة تعتمد على المهارة اليدوية والممارسة الطويلة والخبرة العملية.

أصدر تقريرًا تشخيصيًا تفصيليًا بالعربية الفصحى وفق الهيكل التالي (Markdown):

# تقرير اكتشاف نوع المسار المهني

## ١. ملخص تنفيذي
4-6 أسطر تبيّن النمط المهني الغالب للمتقدم، ولماذا يميل إليه، وما الفرص والتحديات.

## ٢. تحليل النتائج العددية
اشرح دلالة الدرجات الأربع، وأيها الغالب، وأيها الثانوي، وما يعنيه التداخل بينها.

## ٣. النمط المهني الغالب
وصف معمّق للنمط الأعلى (تعريفه، سماته، نوع الالتزام، طبيعة الدخل، مستوى الاستقلالية).

## ٤. النمط المهني الثانوي
كيف يكمّل النمط الثاني الأول؟ وما المسارات الهجينة الممكنة؟

## ٥. الفجوات بين الأنماط
أي أنماط حصلت على درجة منخفضة؟ وهل يُفترض تطويرها أم تجنبها؟

## ٦. المسارات المقترحة (5-8 مسارات محددة)
قدّم مسارات وظيفية/مهنية/حِرفية فعلية تناسب ملف المتقدم، مع تبرير لكل مسار.

## ٧. خطة عمل مرحلية
- مدى قصير (3 أشهر)
- مدى متوسط (سنة)
- مدى طويل (3-5 سنوات)

## ٨. متطلبات التأهيل
شهادات، تراخيص، تدريب، تدريب عملي، أو خبرة يحتاجها المتقدم لتحقيق النمط الغالب.

## ٩. تنبيهات ومخاطر
أخطاء شائعة قد يقع فيها المتقدم بناءً على نمطه.

## ١٠. أسئلة للنقاش مع المرشد المهني
6-8 أسئلة عميقة يطرحها خلال جلسة الاستشارة.

التزم بالاستشهاد بإجابات المتقدم في كل استنتاج، وتجنّب العموميات المبهمة.`;

    const userPayload = JSON.stringify(
      {
        meta: { name: data.name, age: data.age, stage: data.stage },
        scores: data.scores,
        dominant,
        secondary,
        answers: data.answers,
      },
      null,
      2,
    );

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `إليك إجابات وتقييم المتقدم. حلّلها وأصدر التقرير وفق الهيكل المحدد:\n\n${userPayload}` },
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
    const choice = aiJson?.choices?.[0];
    const aiReport: string = choice?.message?.content ?? "";
    if (!aiReport) {
      console.error("Empty AI response. finish_reason:", choice?.finish_reason, "usage:", aiJson?.usage);
      throw new Error("لم يكتمل توليد التقرير. حاول مرة أخرى.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("assessment_reports").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = [
      `# تقرير اكتشاف نوع المسار المهني`,
      ``,
      `**الاسم:** ${data.name ?? "غير محدد"}  `,
      `**العمر:** ${data.age ?? "غير محدد"}  `,
      `**المرحلة:** ${data.stage ?? "غير محدد"}  `,
      `**كود التقرير المميز:** \`${code}\`  `,
      `**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}`,
      ``,
      `### الدرجات`,
      `- Occupation (نشاط عام): **${data.scores.occupation}%**`,
      `- Job (وظيفة): **${data.scores.job}%**`,
      `- Profession (مهنة احترافية): **${data.scores.profession}%**`,
      `- Craft (حِرفة): **${data.scores.craft}%**`,
      ``,
      `**النمط الغالب:** ${dominant}  `,
      `**النمط الثانوي:** ${secondary}`,
      ``,
      `---`,
      ``,
    ].join("\n");

    const referral = [
      ``, `---`, ``,
      `## ١١. الإحالة لمرشد مهني للمناقشة`,
      ``,
      `${data.name ? `عزيزي/عزيزتي **${data.name}**، ` : ""}هذا التقرير نقطة انطلاق لاختيار مسارك بوعي. ننصح بحجز جلسة مع مرشد مهني معتمد لمناقشة النتائج وبناء خطة تنفيذية.`,
      ``,
      `**خطوات الإحالة:**`,
      `1. احفظ كود التقرير: \`${code}\``,
      `2. احجز جلسة من صفحة [حجز جلسة](/booking).`,
      `3. شارك الكود مع المرشد قبل الجلسة.`,
      `4. حضّر أسئلتك من قسم "أسئلة للنقاش".`,
      ``,
      `> 🔒 التقرير سري ولا يُشارك إلا بمعرفة صاحبه عبر هذا الكود.`,
      ``,
    ].join("\n");

    const report = header + aiReport + referral;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: data.stage ?? null,
      answers: { ...data.answers, __scores: JSON.stringify(data.scores) },
      report,
    });
    if (error) {
      console.error("Insert error:", error);
      throw new Error("تعذر حفظ التقرير.");
    }

    return { code, report };
  });
