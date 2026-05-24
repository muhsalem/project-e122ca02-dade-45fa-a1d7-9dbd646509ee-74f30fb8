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
  riasec: z.object({
    R: z.number().min(0).max(5),
    I: z.number().min(0).max(5),
    A: z.number().min(0).max(5),
    S: z.number().min(0).max(5),
    E: z.number().min(0).max(5),
    C: z.number().min(0).max(5),
  }).optional(),
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

    const systemPrompt = `أنت مرشد مهني خبير في توجيه المسار الوظيفي وريادة الأعمال، ومتمكّن من نُظم التصنيف الدولية للمهن:
- **ISCO-08** (International Standard Classification of Occupations — ILO): Major Group (1 رقم) → Sub-Major (2) → Minor (3) → Unit Group (4).
- **ASCO** (التصنيف العربي المعياري للمهن — المنبثق من ISCO-08 ومعتمد لدى منظمة العمل العربية).
- نموذج Holland RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).

تساعد الأفراد في فهم نوع علاقتهم بالعمل عبر ثلاثة مستويات: مسار العمل (Job/Entrepreneur/Freelance/Occupation)، طبيعة العمل (Profession/Craft)، وميولهم RIASEC. ثم تربط النتيجة بمسمى مهني محدد وفق ISCO-08 و ASCO.

أصدر تقريرًا تشخيصيًا تفصيليًا بالعربية الفصحى وفق الهيكل التالي (Markdown):

# تقرير اكتشاف المسمى المهني المناسب

## ١. ملخص تنفيذي
4-6 أسطر تربط بين خيار المسار + طبيعة العمل + النمط الغالب من الدرجات + الكود السائد من RIASEC، وتقترح المسمى المهني المرشّح.

## ٢. تفسير اختيارك للمسار وطبيعة العمل
لماذا اختار Job/Entrepreneur/Freelance/Occupation وهل ينسجم مع Profession/Craft؟

## ٣. تحليل الدرجات الستة (المسار)
اشرح دلالة درجات Occupation/Job/Entrepreneur/Freelance/Profession/Craft وأيها يتسق وأيها يخالف الاختيار.

## ٤. تحليل ميولك RIASEC والكود الثلاثي
استخرج الكود الثلاثي (Holland Code) من أعلى ثلاث درجات (مثلاً RIA أو SEC)، واشرح ما يعنيه عمليًا.

## ٥. الربط بـ ISCO-08 و ASCO — جدول تشخيصي
قدّم جدولًا Markdown يربط نتيجتك بمسمى مهني محدد:
| المستوى | الرمز ISCO-08 | الإنجليزية | العربية (ASCO) |
|---|---|---|---|
| Major Group (1) | … | … | … |
| Sub-Major (2) | … | … | … |
| Minor (3) | … | … | … |
| Unit Group (4) | … | … | … |

تأكد من دقة الرموز (مثلاً 2511 = Systems Analysts، 2421 = Management & Organization Analysts، 1120 = Managing Directors and CEOs، 7531 = Tailors/Dressmakers/Furriers، 3322 = Commercial Sales Representatives...) وأن المسمى منطقي مع المسار + الطبيعة + RIASEC.

## ٦. مسميات مهنية مرشّحة (5-8 خيارات)
لكل مسمى:
- الاسم بالعربية والإنجليزية
- رمز ISCO-08 الكامل (4 خانات) والمسمى المعتمد في ASCO
- لماذا يناسبك (المسار + الطبيعة + Holland Code)
- درجة التوافق ٪

## ٧. خطة تنفيذية مرحلية
- 90 يومًا: خطوات تأسيسية
- 12 شهرًا: بناء الأساس
- 3-5 سنوات: التوسع/الإتقان

## ٨. متطلبات التأهيل والترخيص
شهادات، تراخيص (إن كانت Profession)، رأس مال (للريادة)، أدوات/منصات (للعمل الحر)، تدريب عملي.

## ٩. النمط الغالب والثانوي
وصف معمّق لـ${dominant} وكيف يكمّله ${secondary}.

## ١٠. تنبيهات ومخاطر
أخطاء شائعة في المسار + المسمى المرشّح.

## ١١. أسئلة للنقاش مع المرشد المهني
6-8 أسئلة عميقة مرتبطة باختياراتك وبالمسميات المقترحة.

التزم بالاستشهاد بإجابات المتقدم في كل استنتاج، وتجنّب العموميات، واحرص على دقة رموز ISCO-08.`;

    const userTrack = trackLabel[data.track];
    const userNature = natureLabel[data.nature];

    const riasecRanked = data.riasec
      ? Object.entries(data.riasec)
          .sort((a, b) => b[1] - a[1])
          .map(([k]) => k)
          .join("")
      : null;

    const userPayload = JSON.stringify(
      {
        meta: { name: data.name, age: data.age, stage: data.stage },
        userChoice: { track: userTrack, nature: userNature },
        scores: data.scores,
        dominant,
        secondary,
        riasec: data.riasec,
        hollandCode: riasecRanked?.slice(0, 3),
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

    const riasecLines = data.riasec
      ? [
          ``,
          `### ميولك RIASEC`,
          `- R الواقعي: **${data.riasec.R}/5**`,
          `- I الاستقصائي: **${data.riasec.I}/5**`,
          `- A الفني: **${data.riasec.A}/5**`,
          `- S الاجتماعي: **${data.riasec.S}/5**`,
          `- E المبادر: **${data.riasec.E}/5**`,
          `- C التقليدي: **${data.riasec.C}/5**`,
          `- **الكود الثلاثي (Holland):** ${riasecRanked?.slice(0, 3)}`,
        ]
      : [];

    const header = [
      `# تقرير اكتشاف المسمى المهني المناسب`,
      ``,
      `**الاسم:** ${data.name ?? "غير محدد"}  `,
      `**العمر:** ${data.age ?? "غير محدد"}  `,
      `**المرحلة:** ${data.stage ?? "غير محدد"}  `,
      `**كود التقرير المميز:** \`${code}\`  `,
      `**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}`,
      ``,
      `### اختيارك الأولي`,
      `- **المسار المختار:** ${userTrack}`,
      `- **طبيعة العمل:** ${userNature}`,
      ``,
      `### الدرجات التشخيصية`,
      `- Occupation (نشاط عام): **${data.scores.occupation}%**`,
      `- Job (وظيفة): **${data.scores.job}%**`,
      `- Entrepreneur (ريادة أعمال): **${data.scores.entrepreneur}%**`,
      `- Freelance (عمل حر): **${data.scores.freelance}%**`,
      `- Profession (مهنة احترافية): **${data.scores.profession}%**`,
      `- Craft (حِرفة): **${data.scores.craft}%**`,
      ``,
      `**النمط الغالب:** ${dominant}  `,
      `**النمط الثانوي:** ${secondary}`,
      ...riasecLines,
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
