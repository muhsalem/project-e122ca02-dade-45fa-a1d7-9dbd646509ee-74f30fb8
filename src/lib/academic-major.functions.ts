import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  answers: z.record(z.string(), z.string().max(3000)),
  sections: z.array(z.object({
    title: z.string().max(150),
    items: z.array(z.object({ q: z.string().max(500), a: z.string().max(2000) })).max(20),
  })).max(10).optional(),
});

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `MAJ-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitAcademicMajor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `أنت خبير في الإرشاد الأكاديمي والمهني، متخصص في مساعدة الطلاب على اختيار التخصص الجامعي المناسب بناءً على ميولهم وقدراتهم ومهاراتهم وبيئة العمل التي يفضّلونها.

حلّل إجابات الطالب وأصدر تقريرًا مفصلًا بالعربية الفصحى وفق هذا الهيكل (Markdown):

# تقرير اكتشاف التخصص الدراسي المناسب

## ١. ملخص تنفيذي
4-6 أسطر تلخص الميول الأكاديمية للطالب وأبرز التخصصات المرشحة.

## ٢. تحليل الميول الأكاديمية
حلّل المواد المفضلة ونوع المشكلات التي يستمتع بحلها، واستنتج اتجاهه (علمي/أدبي/تقني/فني/إنساني/طبي/إداري).

## ٣. تحليل المهارات والقدرات
رتّب مهارات الطالب الأقوى وكيف تنعكس على ملاءمة تخصصات بعينها.

## ٤. تحليل بيئة العمل المفضلة
استنتج البيئات المهنية التي يزدهر فيها الطالب وارتباطها بالتخصصات.

## ٥. أفضل 5 تخصصات جامعية مرشحة
لكل تخصص:
- **اسم التخصص**
- **نسبة التوافق المقدّرة (%)**
- **سبب الترشيح** (مرتبط بإجاباته صراحة)
- **أبرز المسارات الوظيفية بعد التخرج**
- **متوسط سنوات الدراسة**

## ٦. 3 تخصصات بديلة (احتياطي)
خيارات ثانية مناسبة في حال صعوبة القبول في الخيارات الأولى.

## ٧. عائلة التخصصات الموصى بها
حدّد العائلة الكبرى (طبية/هندسية/تقنية/إدارية/إنسانية/فنية/شرعية/تعليمية...) وبرّر.

## ٨. مسارات دراسية مقترحة
بكالوريوس، دبلوم تقني، شهادات مهنية — بحسب استعداده لكثافة الدراسة.

## ٩. تخصصات يُفضّل تجنبها
2-3 تخصصات لا تناسب نمطه ولماذا.

## ١٠. خارطة طريق الخطوات التالية
خطة عملية مرقمة (7-10 خطوات) لاتخاذ قرار التخصص وتجربته (مقابلات، تظليل وظيفي، كورسات تجريبية...).

## ١١. أسئلة للنقاش مع المرشد الأكاديمي/المهني
5-7 أسئلة عميقة يطرحها الطالب خلال جلسة الإرشاد.

التزم بالاستشهاد بإجابات الطالب عند كل استنتاج، وتجنّب العموميات.`;

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
        model: "google/gemini-2.5-flash",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `إليك إجابات الطالب على تقييم اكتشاف التخصص الدراسي. حلّلها وأصدر التقرير وفق الهيكل المحدد:\n\n${userPayload}` },
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
    if (!aiReport) throw new Error("لم يكتمل توليد التقرير. حاول مرة أخرى.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("assessment_reports").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = [
      `# تقرير اكتشاف التخصص الدراسي`,
      ``,
      `**الاسم:** ${data.name ?? "غير محدد"}  `,
      `**العمر:** ${data.age ?? "غير محدد"}  `,
      `**المرحلة:** ${data.stage ?? "غير محدد"}  `,
      `**كود التقرير المميز:** \`${code}\`  `,
      `**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}`,
      ``,
      `---`,
      ``,
    ].join("\n");

    let answerLog = "";
    if (data.sections && data.sections.length) {
      answerLog = `\n\n---\n\n## ١٢. ملخص إجاباتك\n\n`;
      for (const s of data.sections) {
        answerLog += `### ${s.title}\n`;
        for (const it of s.items) {
          answerLog += `- **${it.q}**\n  - الإجابة: ${it.a}\n`;
        }
        answerLog += `\n`;
      }
    }

    const referral = [
      ``,
      `---`,
      ``,
      `## ١٣. الإحالة لمرشد أكاديمي/مهني`,
      ``,
      `${data.name ? `عزيزي/عزيزتي **${data.name}**، ` : ""}هذا التقرير نقطة انطلاق لاختيار تخصصك الجامعي. ننصح بحجز جلسة إرشاد لمناقشة الخيارات بعمق.`,
      ``,
      `**خطوات الإحالة:**`,
      `1. احفظ كود التقرير: \`${code}\``,
      `2. احجز جلسة استشارة من صفحة [حجز جلسة](/booking).`,
      `3. شارك الكود مع المرشد.`,
      ``,
    ].join("\n");

    const report = header + aiReport + answerLog + referral;

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
