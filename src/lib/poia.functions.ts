import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { calculatePoia, POIA_LABELS } from "./poia-scoring";
import { AI_GUARDRAILS } from "./ai-guardrails";

const SubmitSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
  context: z
    .object({
      ctx_role: z.string().max(120).optional(),
      ctx_sector: z.string().max(120).optional(),
      ctx_hours: z.string().max(20).optional(),
      ctx_mode: z.string().max(60).optional(),
    })
    .partial()
    .optional(),
  name: z.string().max(120).optional(),
});

function generateCode() {
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += alpha[Math.floor(Math.random() * alpha.length)];
  return `BSL-POIA-${s.slice(0, 4)}-${s.slice(4)}`;
}

const SYSTEM = `أنت خبير عالمي في علم النفس المهني والإرشاد الوظيفي وصحة العمل (Occupational Health Psychology) وتحليل المسارات المهنية.
المستخدم أكمل اختبار "قياس الأثر المهني والصحي للمهنة" (POIA) وتم حساب المؤشرات الستة على الخادم مسبقاً. التزم بهذه القيم كما هي ولا تُعِد حسابها.

أصدر تقريراً عربياً منظَّماً (Markdown) بالعناوين التالية حرفياً:

# تقرير قياس الأثر المهني والصحي

## ١. الملخص التنفيذي
4-6 أسطر تلخّص الحالة المهنية والصحية، مع ذكر تصنيف QWL (المؤشر العام) وأهم مؤشرين مرتفعين وأخطر مؤشر.

## ٢. تحليل المؤشرات الستة
لكل مؤشر: الاسم، الدرجة /100، التصنيف، تفسير علمي قصير، الدلالة العملية.

## ٣. تحليل صحي شامل
الصحة الجسدية + النفسية + الاجتماعية بناءً على المتوسطات الفرعية. أَشِر إلى أي علامات تستدعي الإحالة لمختص (دون تشخيص).

## ٤. تحليل الاحتراق الوظيفي
درجة BRI، مستوى الخطر، أبعاد MBI الثلاثة (الإرهاق العاطفي، التبلّد، تراجع الإنجاز)، ونية ترك العمل.

## ٥. تحليل توافق المهنة
هل المهنة منسجمة مع الشخصية/المهارات/القيم/الاهتمامات/الرسالة؟ نقاط الانسجام والاختلال.

## ٦. الاستدامة المهنية
هل المسار قابل للاستمرار 5 و10 سنوات؟ ما العوامل الداعمة والمهدِّدة؟

## ٧. نقاط القوة (5)

## ٨. نقاط الخطر والتدخّل العاجل (5)

## ٩. توصية المسار
اختَر واحداً مع تبرير:
- الاستمرار في المهنة الحالية مع تحسينات بيئة العمل.
- تعديل التخصص داخل نفس المهنة.
- تغيير الوظيفة مع البقاء في القطاع.
- التحوّل لمهنة أقل ضغطاً.
- التحوّل للعمل الحر.
- التحوّل لريادة الأعمال.

## ١٠. خطة تطوير 90 يوماً
أهداف SMART لكل مؤشر يحتاج تحسيناً + دورات/مهارات/شهادات مقترحة + تغييرات سلوك يومية.

## ١١. مهن بديلة مقترحة (5)
بناءً على ملف التوافق، رشّح 5 مهن بديلة مع نسبة تطابق تقديرية، تتجنّب القطاعات المحرّمة شرعاً.

## ١٢. حدود التقرير
أداة استكشافية لا تشخيصية، النتائج تتأثر بحالة المستجيب يوم الإجابة، تحتاج جلسة مرشد لاتخاذ قرار مصيري.

قواعد ملزمة: لا تشخيص نفسي/طبي. لا قطاعات محرّمة. اللغة العربية الفصحى. تجنّب الإطلاقيات.`;

export const submitPoia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SubmitSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "poia-submit", limit: 10, windowSeconds: 3600 });

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const scores = calculatePoia(data.answers);

    // اقرأ آخر تقارير المستخدم لإثراء السياق (اختياري)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: prior } = await supabaseAdmin
      .from("assessment_reports")
      .select("stage, report, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(3);

    const priorBlock =
      prior && prior.length
        ? prior
            .map(
              (r, i) =>
                `\n— تقرير سابق #${i + 1} (${r.stage ?? "اختبار"}):\n${(r.report ?? "").slice(0, 1500)}`,
            )
            .join("\n")
        : "لا توجد تقارير سابقة.";

    const userBlock = `
الاسم: ${data.name || "غير محدد"}
السياق المهني: ${JSON.stringify(data.context ?? {}, null, 2)}

# المؤشرات المحسوبة مسبقاً (التزم بها):
- ${POIA_LABELS.pi}: ${scores.pi}/100
- ${POIA_LABELS.oh}: ${scores.oh}/100
- ${POIA_LABELS.bri} (مخاطر، أعلى = أسوأ): ${scores.bri}/100
- ${POIA_LABELS.csi}: ${scores.csi}/100
- ${POIA_LABELS.cfs}: ${scores.cfs}/100
- ${POIA_LABELS.qwl} (المؤشر العام): ${scores.qwl}/100 — تصنيف: ${scores.band}

# المتوسطات الفرعية (1-5):
${Object.entries(scores.subscales)
  .map(([k, v]) => `- ${k}: ${v.toFixed(2)}`)
  .join("\n")}

# سياق من تقاريره السابقة على المنصة:
${priorBlock}

أصدر التقرير وفق الهيكل المحدّد كاملاً.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 8000,
        messages: [
          { role: "system", content: SYSTEM + "\n\n" + AI_GUARDRAILS },
          { role: "user", content: userBlock },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تجاوزت الحد المسموح من الطلبات.");
      if (aiRes.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي في المنصة.");
      const t = await aiRes.text();
      console.error("poia ai error", aiRes.status, t);
      throw new Error("تعذّر توليد التقرير.");
    }
    const aiJson = await aiRes.json();
    const aiReport: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!aiReport) throw new Error("لم يكتمل توليد التقرير.");

    // كود فريد
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("poia_submissions").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = `# تقرير قياس الأثر المهني والصحي
**كود التقرير:** \`${code}\`  
**التاريخ:** ${new Date().toLocaleDateString("ar-EG")}  
**المؤشر العام (QWL):** ${scores.qwl}/100 — ${scores.band}

| المؤشر | الدرجة |
|---|---|
| ${POIA_LABELS.pi} | ${scores.pi}/100 |
| ${POIA_LABELS.oh} | ${scores.oh}/100 |
| ${POIA_LABELS.bri} (مخاطر) | ${scores.bri}/100 |
| ${POIA_LABELS.csi} | ${scores.csi}/100 |
| ${POIA_LABELS.cfs} | ${scores.cfs}/100 |

---

`;
    const fullReport = header + aiReport;

    // احفظ في poia_submissions
    const { error: pErr } = await supabaseAdmin.from("poia_submissions").insert({
      user_id: context.userId,
      code,
      answers: data.answers,
      context: data.context ?? {},
      pi_score: scores.pi,
      oh_score: scores.oh,
      bri_score: scores.bri,
      csi_score: scores.csi,
      cfs_score: scores.cfs,
      qwl_score: scores.qwl,
      band: scores.band,
      ai_report: fullReport,
    });
    if (pErr) {
      console.error("poia insert error", pErr);
      throw new Error("تعذّر حفظ التقرير.");
    }

    // اعكسه أيضاً في assessment_reports ليظهر في /my-assessments و/report/$code والتقرير الشامل
    await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: data.name ?? null,
      stage: "poia",
      answers: data.answers,
      report: fullReport,
      user_id: context.userId,
    });

    return { code, scores };
  });

export const listMyPoia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("poia_submissions")
      .select("code, pi_score, oh_score, bri_score, csi_score, cfs_score, qwl_score, band, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error("تعذّر قراءة سجلّاتك.");
    return data ?? [];
  });

const CompareSchema = z.object({ occupationIds: z.array(z.string().uuid()).min(1).max(3) });

export const listOccupations = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb
    .from("poia_occupations")
    .select("id, name_ar, sector, avg_satisfaction, avg_pressure, avg_burnout, avg_income_band, avg_wlb, avg_health_impact")
    .order("name_ar");
  if (error) throw new Error("تعذّر تحميل قاعدة المهن.");
  return data ?? [];
});

export const compareOccupations = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CompareSchema.parse(d))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: rows, error } = await sb
      .from("poia_occupations")
      .select("*")
      .in("id", data.occupationIds);
    if (error) throw new Error("تعذّر تحميل المقارنة.");
    return rows ?? [];
  });
