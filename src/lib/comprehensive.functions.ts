import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  selfDiscoveryCode: z.string().max(32).regex(/^BSL-[A-Z0-9-]+$/).optional().or(z.literal("")),
  learningStyleCode: z.string().max(32).regex(/^LSA-[A-Z0-9-]+$/).optional().or(z.literal("")),
  academicMajorCode: z.string().max(32).regex(/^MAJ-[A-Z0-9-]+$/).optional().or(z.literal("")),
  careerTitleCode: z.string().max(32).regex(/^CPT-[A-Z0-9-]+$/).optional().or(z.literal("")),
  userId: z.string().uuid().optional(),
});

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `ALL-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitComprehensive = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const codes = [
      { label: "اكتشاف ذاتك", code: data.selfDiscoveryCode },
      { label: "اكتشاف نمط تعلمك", code: data.learningStyleCode },
      { label: "اكتشاف تخصصك الدراسي", code: data.academicMajorCode },
      { label: "اكتشف مسماك المهني", code: data.careerTitleCode },
    ].filter((c) => c.code && c.code.length > 0);

    if (codes.length < 2) {
      throw new Error("الرجاء إدخال كودين على الأقل من التقييمات السابقة.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const fetched: { label: string; code: string; report: string; name?: string | null }[] = [];
    for (const c of codes) {
      const { data: row, error } = await supabaseAdmin
        .from("assessment_reports")
        .select("code, name, report")
        .eq("code", c.code!)
        .maybeSingle();
      if (error || !row) throw new Error(`الكود ${c.code} غير موجود في قاعدة البيانات.`);
      fetched.push({ label: c.label, code: row.code, report: row.report, name: row.name });
    }

    const userName = data.name || fetched.find((f) => f.name)?.name || "غير محدد";

    const reportsBlock = fetched
      .map(
        (f) =>
          `\n\n===== تقرير: ${f.label} (كود: ${f.code}) =====\n${f.report.slice(0, 6000)}`,
      )
      .join("\n");

    const systemPrompt = `أنت مستشار مهني خبير مدمج بمهارات: علم النفس المهني، الكوتشينج (ICF)، تخطيط المسار الأكاديمي والمهني، ذكاء سوق العمل، التصنيف الدولي للقطاعات (GICS/NAICS) والمهن (ISCO-08 / ASCO).\n\nسيُعرض عليك مجموعة تقارير سابقة لنفس المتقدم: قد تشمل (اكتشاف ذاتك / اكتشاف نمط تعلمك / اكتشاف تخصصك الدراسي / اكتشف مسماك المهني). مهمتك توليد **تقرير تقييم شامل موحّد** بالعربية الفصحى يدمج كل هذه المخرجات في رؤية واحدة متكاملة، ويُتوّجها بترشيح قطاع/صناعة محددة.\n\nالتزم بالهيكل التالي (Markdown):\n\n# التقييم الشامل الموحّد — رؤية متكاملة لمسارك\n\n## ١. ملخص تنفيذي عام\n6-8 أسطر تجمع: نمط الشخصية + نمط التعلم + التخصص الدراسي المرشّح + المسمى المهني المرشّح + القطاع المقترح.\n\n## ٢. الخريطة الشخصية المتكاملة\n- نقاط القوة الجوهرية (مع الاستشهاد بالتقارير).\n- القيم الدافعة.\n- نمط التعلم السائد وكيف يؤثر على اختيار التخصص والمهنة.\n\n## ٣. التوافق بين التقارير\nجدول يوضّح مدى الاتساق/التعارض بين مخرجات التقارير المختلفة، وأي إشارات تتطلب إعادة معايرة.\n\n## ٤. التخصص الأكاديمي المُرَشَّح (الأقوى)\nالمسار الدراسي الأنسب + بدائل، مع ربطه بنمط التعلم والشخصية.\n\n## ٥. المسمى المهني المُرَشَّح وفق ISCO-08 / ASCO\nأعد ربط النتيجة بمسمى وظيفي ورمز ISCO-08 من 4 خانات + الاسم العربي المعتمد في ASCO.\n\n## ٦. ترشيح القطاع والصناعة المناسبة\n- **القطاع** (حكومي/خاص ربحي/أهلي) — والسبب.\n- **الصناعة وفق GICS**: Sector → Industry Group → Industry → Sub-Industry.\n- **النشاط وفق NAICS** (إن أمكن).\n- 3-5 صناعات مُرشّحة مرتّبة بدرجة التوافق ٪.\n\n## ٧. خارطة الطريق الموحّدة (10 خطوات)\nخطة عملية تجمع المخرجات في تسلسل واضح خلال 6-12 شهرًا.\n\n## ٨. خطة مهارات وتأهيل\n- مهارات صلبة مطلوبة للمسمى/القطاع المرشّح.\n- مهارات ناعمة.\n- شهادات وتراخيص.\n\n## ٩. مؤشرات نجاح ومتابعة (KPIs)\nكيف تقيس تقدّمك كل 90 يومًا.\n\n## ١٠. تنبيهات مخصصة وأخطاء يجب تجنّبها\nبناءً على ما لاحظته من التقارير.\n\n## ١١. أسئلة جوهرية للنقاش مع المرشد\n8-10 أسئلة عميقة مدمجة من كل تقرير.\n\nاستشهد بكل تقرير بالاسم عند الحاجة، وتجنّب التكرار، وقدّم رؤية موحّدة لا مجرّد تلخيص.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `اسم المتقدم: ${userName}\n\nهذه التقارير السابقة:\n${reportsBlock}\n\nأصدر التقرير الشامل الموحّد وفق الهيكل المحدد.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تم تجاوز الحد المسموح من الطلبات.");
      if (aiRes.status === 402) throw new Error("نفدت رصيد الذكاء الاصطناعي.");
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      throw new Error("تعذر إنشاء التقرير الشامل.");
    }

    const aiJson = await aiRes.json();
    const aiReport: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!aiReport) throw new Error("لم يكتمل توليد التقرير. حاول مرة أخرى.");

    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("assessment_reports").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = [
      `# التقييم الشامل الموحّد`,
      ``,
      `**الاسم:** ${userName}  `,
      `**كود التقرير الشامل:** \`${code}\`  `,
      `**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}`,
      ``,
      `### التقارير المدمجة`,
      ...fetched.map((f) => `- ${f.label}: \`${f.code}\``),
      ``,
      `---`,
      ``,
    ].join("\n");

    const referral = [
      ``, `---`, ``,
      `## ١٢. الإحالة لمرشد مهني`,
      `احفظ الكود \`${code}\` واحجز جلسة عبر [حجز جلسة](/booking) لمناقشة الخطة الموحّدة.`,
      ``,
      `---`,
      ``,
      `> **تذكير قيمي:** هذه النتائج اجتهادية وظنية، تُعين على التفكير ولا تُلزم بقرار. خذ بالأسباب، واستخر الله، واستشر أهل الخبرة قبل القرارات المصيرية. اطّلع على [ميثاقنا الأخلاقي والقيمي](/ethics).`,
      ``,
    ].join("\n");

    const report = header + aiReport + referral;

    const { error: insErr } = await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: userName,
      answers: { __sources: fetched.map((f) => ({ label: f.label, code: f.code })) },
      report,
      user_id: data.userId ?? null,
    });
    if (insErr) {
      console.error("Insert error:", insErr);
      throw new Error("تعذر حفظ التقرير.");
    }

    return { code };
  });
