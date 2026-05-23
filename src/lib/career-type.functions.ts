import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  answers: z.record(z.string(), z.string().max(500)),
  track: z.enum(["job", "entrepreneur", "freelance", "occupation"]),
  nature: z.enum(["profession", "craft", "undecided"]),
  scores: z.object({
    occupation: z.number().min(0).max(100),
    job: z.number().min(0).max(100),
    entrepreneur: z.number().min(0).max(100),
    freelance: z.number().min(0).max(100),
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
      entrepreneur: "Entrepreneur — ريادة الأعمال",
      freelance: "Freelance — العمل الحر",
      profession: "Profession — المهنة الاحترافية",
      craft: "Craft — الحِرفة",
    };
    const trackLabel: Record<string, string> = {
      job: "وظيفة (Job)",
      entrepreneur: "ريادة أعمال (Entrepreneur)",
      freelance: "عمل حر (Freelance)",
      occupation: "نشاط مهني عام (Occupation)",
    };
    const natureLabel: Record<string, string> = {
      profession: "مهنة احترافية (Profession)",
      craft: "حِرفة (Craft)",
      undecided: "لم يحسم بعد",
    };
    const dominant = labelMap[sorted[0][0]];
    const secondary = labelMap[sorted[1][0]];

    const systemPrompt = `أنت مرشد مهني خبير في توجيه المسار الوظيفي وريادة الأعمال. تساعد الأفراد في فهم نوع علاقتهم بالعمل عبر مستويين من الاختيار:

المستوى الأول — مسار العمل (Career Track):
1) Job (وظيفة): التزام عند صاحب عمل واحد بمهام وراتب وساعات ثابتة، استقرار عالٍ ومخاطرة منخفضة.
2) Entrepreneur (رائد أعمال): تأسيس مشروع/شركة، تحمل مخاطر مالية مقابل عائد ومُلكية وتأثير أكبر.
3) Freelance (عمل حر مستقل): تقديم خدمات لعدة عملاء بمرونة عالية بدون التزام طويل الأمد.
4) Occupation (نشاط مهني عام): أي عمل لكسب الرزق دون التزام بهيكل مهني محدد.

المستوى الثاني — طبيعة العمل (Work Nature):
- Profession (مهنة احترافية): تتطلب شهادات عليا، ترخيصًا، معايير أخلاقية.
- Craft (حِرفة): تعتمد على المهارة اليدوية والممارسة الطويلة.

أصدر تقريرًا تشخيصيًا تفصيليًا بالعربية الفصحى وفق الهيكل التالي (Markdown):

# تقرير اكتشاف نوع المسار المهني

## ١. ملخص تنفيذي
4-6 أسطر تبيّن خيار المسار + طبيعة العمل + النمط المهيمن من الدرجات، وما يعنيه ذلك عمليًا.

## ٢. تفسير اختيارك للمسار
لماذا اختار Job/Entrepreneur/Freelance/Occupation؟ وما الذي يكشفه هذا الاختيار عن دوافعك واحتمال نجاحك فيه.

## ٣. تفسير اختيارك لطبيعة العمل (Profession vs Craft)
هل اختيارك (مهنة/حِرفة) ينسجم مع المسار؟ وما الفرص والمخاطر في هذا المزج تحديدًا.

## ٤. تحليل النتائج العددية للأنماط الستة
اشرح دلالة الدرجات الست (Occupation/Job/Entrepreneur/Freelance/Profession/Craft) وأيها يتسق مع اختيارك وأيها يخالفه (تناقضات داخلية).

## ٥. النمط الغالب والثانوي
وصف معمّق لـ${dominant} (السمات، نوع الالتزام، الدخل، الاستقلالية، نموذج العمل) ثم كيف يكمّله ${secondary}.

## ٦. توافق المسار مع شخصيتك
هل اختيارك العلوي (المسار + الطبيعة) متسق مع الدرجات؟ وضّح أي تعارض بصراحة، واقترح إعادة معايرة عند الحاجة.

## ٧. مسارات عمل محددة (6-10 خيارات)
مسارات فعلية تجمع بين اختيارك للمسار + الطبيعة + النمط الغالب، مع تبرير. مثال: "Freelance + Profession + Profession-leaning → مستشار قانوني مستقل".

## ٨. خطة تنفيذية مرحلية
- 90 يومًا: خطوات تأسيسية فورية
- 12 شهرًا: بناء الأساس
- 3-5 سنوات: مرحلة التوسع/الإتقان

## ٩. متطلبات التأهيل والأدوات
شهادات، تراخيص، رأس مال (للريادة)، أدوات/منصات (للعمل الحر)، شبكة علاقات، تدريب عملي.

## ١٠. تنبيهات ومخاطر مخصصة
أخطاء شائعة في المسار المختار تحديدًا (مثلًا: الريادي يخلط بين الفكرة والسوق، الموظف يتجاهل التطوير الذاتي...).

## ١١. أسئلة للنقاش مع المرشد المهني
6-8 أسئلة عميقة مرتبطة باختياراتك تحديدًا.

التزم بالاستشهاد بإجابات المتقدم في كل استنتاج وتجنّب العموميات.`;

    const userTrack = trackLabel[data.track];
    const userNature = natureLabel[data.nature];

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
