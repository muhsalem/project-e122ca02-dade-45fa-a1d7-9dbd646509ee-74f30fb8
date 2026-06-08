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
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "academic-major", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    // اشتقاق مستوى ISCED 2011 من المرحلة الحالية للطالب
    const stage = (data.stage ?? "").toLowerCase();
    let iscedLevel = "ISCED 3 — التعليم الثانوي العلوي";
    let recommendedNextLevels = "ISCED 4 (ما بعد الثانوي غير العالي) أو ISCED 5 (دبلوم تقني قصير) أو ISCED 6 (بكالوريوس)";
    if (stage.includes("ثاني") || stage.includes("ثانو")) {
      iscedLevel = "ISCED 3 — التعليم الثانوي العلوي";
      recommendedNextLevels = "ISCED 5 (دبلوم تقني قصير 2–3 سنوات) أو ISCED 6 (بكالوريوس 4–6 سنوات)";
    } else if (stage.includes("جامع")) {
      iscedLevel = "ISCED 6 — بكالوريوس / مستوى جامعي أول";
      recommendedNextLevels = "ISCED 6 (تحويل تخصص) أو ISCED 7 (ماجستير) لاحقاً";
    } else if (stage.includes("خريج")) {
      iscedLevel = "ISCED 6/7 — خريج جامعي";
      recommendedNextLevels = "ISCED 7 (ماجستير/دبلوم عالٍ) أو ISCED 5 (دبلوم تطبيقي للتحوّل المهني)";
    }

    const systemPrompt = `أنت خبير في الإرشاد الأكاديمي والمهني، متخصص في مساعدة الطلاب على اختيار التخصص الجامعي المناسب وفق التصنيف الدولي الموحّد للتعليم ISCED-2011 (المستويات) و ISCED-F 2013 (مجالات التعليم والتدريب — UNESCO Institute for Statistics).

### مرجع ISCED للاستخدام الإلزامي في التقرير:

**مستويات ISCED 2011:**
- ISCED 0: التعليم قبل الابتدائي
- ISCED 1: الابتدائي
- ISCED 2: الإعدادي/الثانوي الأدنى
- ISCED 3: الثانوي العلوي
- ISCED 4: ما بعد الثانوي غير العالي
- ISCED 5: التعليم العالي قصير الأمد (دبلوم تقني/مشارك)
- ISCED 6: البكالوريوس أو ما يعادله
- ISCED 7: الماجستير أو ما يعادله
- ISCED 8: الدكتوراه أو ما يعادله

**مجالات ISCED-F 2013 الواسعة (broad fields):**
- 00 برامج ومؤهلات عامة
- 01 التربية
- 02 العلوم الإنسانية والفنون
- 03 العلوم الاجتماعية والصحافة والإعلام
- 04 الأعمال والإدارة والقانون
- 05 العلوم الطبيعية والرياضيات والإحصاء
- 06 تكنولوجيا المعلومات والاتصالات
- 07 الهندسة والصناعات التحويلية والبناء
- 08 الزراعة والحراجة وصيد الأسماك والبيطرة
- 09 الصحة والرفاه
- 10 الخدمات

**مستوى الطالب الحالي المُستنتج من إجاباته:** ${iscedLevel}
**مستويات ISCED الموصى بها للخطوة التالية:** ${recommendedNextLevels}

---

حلّل إجابات الطالب وأصدر تقريرًا مفصلًا بالعربية الفصحى وفق هذا الهيكل (Markdown):

# تقرير اكتشاف التخصص الدراسي المناسب

## ١. ملخص تنفيذي
4-6 أسطر تلخص الميول الأكاديمية للطالب وأبرز التخصصات المرشحة، مع ذكر **مستوى ISCED الحالي** و**المستوى الموصى بالانتقال إليه**.

## ٢. تحليل الميول الأكاديمية
حلّل المواد المفضلة ونوع المشكلات التي يستمتع بحلها، واستنتج اتجاهه (علمي/أدبي/تقني/فني/إنساني/طبي/إداري) واربطه بأحد **مجالات ISCED-F 2013 الواسعة**.

## ٣. تحليل المهارات والقدرات
رتّب مهارات الطالب الأقوى وكيف تنعكس على ملاءمة تخصصات بعينها.

## ٤. تحليل بيئة العمل المفضلة
استنتج البيئات المهنية التي يزدهر فيها الطالب وارتباطها بالتخصصات.

## ٥. أفضل 5 تخصصات جامعية مرشحة (مصنّفة وفق ISCED-F 2013)
لكل تخصص اذكر **بالضبط** وبهذا الترتيب:
- **اسم التخصص**
- **تصنيف ISCED-F:** \`الكود الواسع - المجال الضيق\` (مثال: \`06 - 0613 تطوير البرمجيات والتطبيقات\`)
- **مستوى ISCED 2011 المناسب** (مثال: ISCED 6 — بكالوريوس)
- **نسبة التوافق المقدّرة (%)**
- **سبب الترشيح** (مرتبط بإجاباته صراحة)
- **أبرز المسارات الوظيفية بعد التخرج**
- **متوسط سنوات الدراسة**
- **✅ مميزات هذا التخصص (3-5 نقاط):** اذكر مميزات واقعية مثل الطلب في سوق العمل العربي، مرونة المسارات، الراتب المتوقع، فرص العمل عن بُعد، إمكانية العمل الحر، التوافق مع شخصية الطالب.
- **⚠️ عيوب وتحديات هذا التخصص (3-5 نقاط):** اذكر تحديات حقيقية مثل ساعات الدراسة الطويلة، التكلفة، التشبّع في السوق، الضغط النفسي، الحاجة للتحديث المستمر، صعوبة القبول، أو تعارض محتمل مع نمط الحياة.
- **💡 ملاءمة التخصص لشخصيتك:** سطر يوضح لماذا هذه المميزات والعيوب تحديداً تنطبق على الطالب بناءً على إجاباته.

## ٦. 3 تخصصات بديلة (احتياطي)
خيارات ثانية مناسبة في حال صعوبة القبول، اذكر لكل منها: كود ISCED-F، مستوى ISCED، **✅ ميزتان رئيسيتان**، **⚠️ تحدّيان رئيسيان**.

## ٧. عائلة التخصصات الموصى بها (ISCED-F broad field)
حدّد المجال الكبير الواحد الأكثر ملاءمة (مثال: \`06 — تكنولوجيا المعلومات والاتصالات\`) وبرّر اختياره.

## ٨. مسارات دراسية مقترحة حسب ISCED
رتّب 3 مسارات وفق مستوى ISCED مناسب لاستعداده لكثافة الدراسة:
- مسار ISCED 5 (دبلوم تقني/مشارك)
- مسار ISCED 6 (بكالوريوس)
- مسار ISCED 7 (ماجستير لاحق)

## ٩. تخصصات يُفضّل تجنبها
2-3 تخصصات لا تناسب نمطه ولماذا، مع ذكر كود ISCED-F لها.

## ١٠. خارطة طريق الخطوات التالية
خطة عملية مرقمة (7-10 خطوات) للانتقال من **${iscedLevel}** إلى المستوى التالي.

## ١١. أسئلة للنقاش مع المرشد الأكاديمي/المهني
5-7 أسئلة عميقة يطرحها الطالب خلال جلسة الإرشاد.

التزم بالاستشهاد بإجابات الطالب عند كل استنتاج، وتجنّب العموميات. **يجب أن يظهر تصنيف ISCED-F وكوده الرقمي صراحة عند كل تخصص مرشّح.**`;

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
