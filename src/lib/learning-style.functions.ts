import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  answers: z.record(z.string(), z.string().max(3000)),
  sections: z.array(z.object({
    title: z.string().max(150),
    items: z.array(z.object({ q: z.string().max(500), a: z.string().max(2000) })).max(20),
  })).max(20).optional(),
});

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `LSA-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitLearningStyle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SectionSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `أنت خبير في علم نفس التعلم والإرشاد التربوي، متخصص في نماذج أنماط التعلم العالمية:
- VARK (فليمنغ): بصري/سمعي/قرائي-كتابي/حركي
- Kolb LSI: متباعد/مستوعب/متقارب/متكيف
- Honey & Mumford LSQ: ناشط/متأمل/منظّر/براغماتي
- Felder–Silverman ILS: نشط/تأملي، حسي/حدسي، بصري/لفظي، تسلسلي/شمولي
- Multiple Intelligences (Gardner): الذكاءات المتعددة
- Gregorc Style Delineator: ملموس متسلسل/مجرد متسلسل/مجرد عشوائي/ملموس عشوائي
- Dunn & Dunn LSI و PEPS: التفضيلات البيئية والعاطفية والاجتماعية والجسدية
- Cognitive Styles: معتمد/مستقل عن المجال، تحليلي/شمولي، اندفاعي/تأملي

حلّل إجابات المتعلم وأصدر تقريرًا تفصيليًا منظمًا بالعربية الفصحى وفق هذا الهيكل (Markdown):

# تقرير أنماط التعلم الشامل

## ١. ملخص تنفيذي
4-6 أسطر تلخص نمط المتعلم الغالب وأبرز ملامحه.

## ٢. تحليل VARK (الحسي)
حدّد المودالية المسيطرة (بصري/سمعي/قرائي/حركي) أو المختلط، مع الاستشهاد بالإجابات.

## ٣. تحليل Kolb (دورة التعلم التجريبي)
صنّف المتعلم: متباعد، مستوعب، متقارب، أم متكيف؟ ولماذا.

## ٤. تحليل Honey & Mumford
حدّد النمط الغالب: ناشط/متأمل/منظّر/براغماتي.

## ٥. تحليل Felder–Silverman (ILS)
أربعة محاور: نشط↔تأملي، حسي↔حدسي، بصري↔لفظي، تسلسلي↔شمولي.

## ٦. الذكاءات المتعددة (Gardner)
رتّب أبرز 3 ذكاءات لدى المتعلم.

## ٧. تحليل Gregorc
صنّف المتعلم ضمن أحد الأنماط الأربعة مع التبرير.

## ٨. التفضيلات البيئية والشخصية (Dunn & Dunn / PEPS)
البيئة المثلى للتعلم (إضاءة، صوت، وقت، فردي/جماعي، حركة...).

## ٩. الأسلوب المعرفي (Cognitive Style)
معتمد/مستقل، تحليلي/شمولي، اندفاعي/تأملي.

## ١٠. ملف نمط التعلم المتكامل
دمج نتائج النماذج السابقة في صورة شخصية تعلمية واحدة (Learning Profile) متماسكة.

## ١١. استراتيجيات الدراسة الموصى بها
خطة عملية مرقمة من 7-10 استراتيجيات مخصصة لنمط هذا المتعلم.

## ١٢. أدوات وتقنيات مقترحة
تطبيقات، طرق تدوين ملاحظات، أساليب مراجعة، تنظيم وقت — كلها مناسبة لنمطه.

## ١٣. تنبيهات ومخاطر يجب تجنبها
عادات وأساليب تعلم تتعارض مع نمطه وستُضعف نتائجه.

## ١٤. أسئلة للنقاش مع المرشد النفسي/التربوي
5-7 أسئلة عميقة يطرحها المتعلم خلال الجلسة.

التزم بالاستشهاد بإجابات المتعلم عند كل استنتاج، وتجنّب العموميات.`;

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
          { role: "user", content: `إليك إجابات المتعلم على تقييم أنماط التعلم الشامل. حلّلها وأصدر التقرير وفق الهيكل المحدد:\n\n${userPayload}` },
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
      `# تقرير أنماط التعلم الشامل`,
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
      answerLog = `\n\n---\n\n## ١٥. ملخص إجاباتك حسب النماذج\n\n`;
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
      `## ١٦. الإحالة لمرشد نفسي/تربوي للمناقشة`,
      ``,
      `${data.name ? `عزيزي/عزيزتي **${data.name}**، ` : ""}هذا التقرير نقطة انطلاق لتطوير أسلوبك التعليمي. ننصح بحجز جلسة مع مرشد نفسي/تربوي معتمد لمناقشة هذه النتائج بعمق وبناء خطة دراسية مخصصة.`,
      ``,
      `**خطوات الإحالة:**`,
      `1. احفظ كود التقرير: \`${code}\``,
      `2. احجز جلسة استشارة من صفحة [حجز جلسة](/booking).`,
      `3. شارك الكود مع المرشد ليطّلع على التقرير كاملًا قبل الجلسة.`,
      `4. حضّر أسئلتك من قسم "أسئلة للنقاش مع المرشد" أعلاه.`,
      ``,
      `> 📚 **ملاحظة:** التقرير سري ولا يُشارك إلا بمعرفة صاحبه عبر هذا الكود.`,
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
