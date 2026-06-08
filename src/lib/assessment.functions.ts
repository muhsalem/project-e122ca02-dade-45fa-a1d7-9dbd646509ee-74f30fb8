import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  group_code: z.string().min(1).max(32).regex(/^[A-Z0-9_-]+$/).optional(),
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
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "assessment", limit: 30, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `أنت مرشد مهني ومدرب حياتي (Career Coach + ICF Coach) عربي خبير، تستند إلى أسس علم النفس المهني والقياس النفسي والكوتشينج المعتمد (ICF Core Competencies + GROW).
مهمتك تحليل إجابات المتدرب وإصدار تقرير ارشادي مهني عميق ومنظم باللغة العربية الفصحى الواضحة.

**قواعد علمية مُلزِمة:**
1. لا تستخدم أرقاماً قطعية للنسب (مثال: «أنت 87% تحليلي»). استخدم بدلاً عنها مستويات نوعية: «ميل واضح / ميل معتدل / ميل ناشئ».
2. ابدأ التقرير دائماً بـ **شريط ثقة النتيجة (Confidence Band)** المأخوذ من المفاتيح \`_quality_*\` في الإجابات:
   - \`_quality_band = high\` → "ثقة عالية في النتائج — أجاب المتدرب بتركيز وتنوع".
   - \`_quality_band = moderate\` → "ثقة متوسطة — توجد مؤشرات تستحق المراجعة مع المرشد".
   - \`_quality_band = low\` → "ثقة منخفضة — يُنصح بإعادة الاختبار في بيئة هادئة قبل اتخاذ قرارات مصيرية".
   اذكر أي تنبيهات من \`_quality_flags\` بصراحة.
3. اعتمد منهجية **التثليث (Triangulation):** قارن بين القياس الذاتي (السلوكي) ووحدة ليكرت النفسية وتأملات GROW، وأشر صراحةً إلى أي تناقض بينها.
4. تجنب أدوات غير مُقننة (MBTI، Learning Styles المتعددة). استند إلى Big Five / RIASEC / O*NET Work Values.

التزم بهذا الهيكل بدقة باستخدام Markdown:

# تقرير الإرشاد المهني الشامل

## ٠. شريط ثقة النتيجة (Result Confidence Band)
استخدم \`_quality_*\` لتحديد الشريط، ولخّص المؤشرات (اجتياز فحص الانتباه، نمط الإجابة، سرعة الاستجابة) في 3-4 أسطر.

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

## ٧. ملف القدرات العقلية (Aptitude Profile)
حلل القدرات السبع (لفظية، عددية، منطقية، مكانية، ذاكرة، سرعة إدراكية، حل مشكلات). صنّفها (قوي/متوسط/يحتاج تطوير) واربطها بأنواع المهام والوظائف المناسبة.

## ٨. قيم العمل (Work Values)
استخرج أعلى 4 قيم عمل للمتدرب وفق نموذج Super/Schwartz، وحلل المفاضلات (المال vs المعنى، الأمان vs النمو، الثقافة المؤسسية، الأثر المنشود). اربطها بنوع المؤسسة والقطاع المناسب.

## ٩. وحدة القياس النفسي المتقدمة (Likert Module)
حلل عبارات ليكرت الثمانية (الكفاءة الذاتية، الانفتاح، الانضباط، التواصل الاجتماعي، الاتزان الانفعالي) — مع الانتباه أن العبارات المُعَلَّمة بـ \`_rev\` معكوسة الترميز. اعرض مستوى نوعياً (مرتفع/متوسط/منخفض) لكل بُعد.

## ١٠. الرغبات والأحلام والطموح
تحليل واقعية الأحلام، الفجوة بين الواقع والطموح، ومدى الوضوح.

## ١١. القدرات والإمكانيات
الموارد الذاتية والبيئية المتاحة وكيفية توظيفها.

## ١٢. تأملات الكوتشينج (GROW Reflection)
استشهد بإجابات المتدرب على أسئلة GROW الأربعة (Goal/Reality/Options/Will) وعلّق على وضوحها، واربطها بالمسارات المقترحة. إذا كانت الإجابات سطحية، اقترح أسئلة عميقة على المرشد طرحها في الجلسة.

## ١٣. المسارات المهنية المقترحة
اقترح 3-5 مسارات مهنية محددة مع شرح سبب المناسبة لكل مسار، مع ربطها صراحةً بنتائج القدرات (Aptitude) وقيم العمل (Work Values) ووحدة ليكرت.

## ١٤. خطة التطوير (90 يومًا)
خطوات عملية مرقمة قابلة للتنفيذ خلال 30/60/90 يومًا، تشمل تطوير القدرة الأضعف من ملف Aptitude.

## ١٥. أسئلة للنقاش مع المرشد المهني
5-7 أسئلة عميقة يطرحها المتدرب على مرشده في الجلسة، نصفها مستمد من إجابات GROW.

كن صادقًا ومحترمًا، استشهد بإجابات المتدرب حين تذكر استنتاجًا، وتجنب العموميات والأحكام القاطعة. كل استنتاج يجب أن يكون قابلاً للتحقق من إجابات المتدرب.`;

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
          { role: "user", content: `إليك إجابات المتدرب على اكتشاف ذاتك. قم بتحليلها وإصدار التقرير وفق الهيكل المحدد:\n\n${userPayload}` },
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
      console.error("Empty AI response. finish_reason:", choice?.finish_reason, "usage:", aiJson?.usage, "raw:", JSON.stringify(aiJson).slice(0, 500));
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

    // Header + answer log + referral footer
    const header = [
      `# تقرير الإرشاد المهني الشامل`,
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
      answerLog = `\n\n---\n\n## ١٦. ملخص إجاباتك النهائية حسب المحاور\n\n`;
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
      `## ١٧. الإحالة لمرشد مهني للمناقشة`,
      ``,
      `${data.name ? `عزيزي/عزيزتي **${data.name}**، ` : ""}هذا التقرير نقطة انطلاق وليس نهاية الطريق. ننصح بشدة بحجز جلسة مع مرشد مهني معتمد لمناقشة هذه النتائج بعمق وتحويلها إلى خطة عملية واضحة.`,
      ``,
      `**خطوات الإحالة:**`,
      `1. احفظ كود التقرير: \`${code}\``,
      `2. احجز جلسة استشارة من صفحة [حجز جلسة](/booking).`,
      `3. شارك الكود مع المرشد ليطّلع على التقرير كاملًا قبل الجلسة.`,
      `4. حضّر أسئلتك من قسم "أسئلة للنقاش مع المرشد المهني" أعلاه.`,
      ``,
      `> 💼 **ملاحظة:** التقرير سري ولا يُشارك إلا بمعرفة صاحبه عبر هذا الكود.`,
      ``,
    ].join("\n");

    const report = header + aiReport + answerLog + referral;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: data.stage ?? null,
      group_code: data.group_code ?? null,
      answers: data.answers,
      report,
    });
    if (error) {
      console.error("Insert error:", error);
      throw new Error("تعذر حفظ التقرير.");
    }

    return { code, report };
  });
