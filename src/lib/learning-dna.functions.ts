import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { calculateLearningDna, METRIC_LABELS, type TaskResults } from "./learning-dna-scoring";
import { DIMENSION_LABELS, AXIS_LABELS } from "@/data/learning-dna-bank";
import { AI_GUARDRAILS } from "./ai-guardrails";

const TaskSchema = z.object({
  memory_immediate: z.number().min(0).max(1).optional(),
  memory_delayed: z.number().min(0).max(1).optional(),
  stroop_accuracy: z.number().min(0).max(1).optional(),
  stroop_avg_ms: z.number().min(0).max(10000).optional(),
  stroop_incong_cost_ms: z.number().min(-5000).max(5000).optional(),
  problem_score: z.number().min(0).max(1).optional(),
  problem_time_ms: z.number().min(0).max(600000).optional(),
}).partial();

const SubmitSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
  tasks: TaskSchema.optional(),
  name: z.string().max(120).optional(),
});

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `LDNA-${s.slice(0, 4)}-${s.slice(4)}`;
}

const SYSTEM = `أنت خبير عالمي في علوم التعلّم (Learning Sciences)، علم النفس التربوي، التصميم التعليمي، والقياس النفسي.
المستخدم أكمل تقييم Learning DNA (استبيان متعدد الأبعاد + 3 مهام أداء عملية: ذاكرة، تركيز/Stroop، حلّ مشكلات).
تم حساب المؤشرات السبعة والأبعاد الفرعية على الخادم مسبقاً — التزم بها كما هي ولا تُعِد حسابها.

موقف علمي ملزم:
- التصنيفات الحسّية (بصري/سمعي/حركي) تُعرض كتفضيلات استكشافية لا كآلية تدريس قاطعة (Pashler 2008, Newton 2020).
- اعتمد على Cognitive Load Theory, Metacognition, Self-Regulated Learning, Deliberate Practice, Spacing/Testing Effects, Dual Coding, Growth Mindset.

أصدر تقريراً عربياً فصيحاً Markdown بهذا الهيكل حرفياً:

# تقرير Learning DNA — بصمتك التعليمية

## ١. الملخّص التنفيذي
4-6 أسطر: درجة LES، التصنيف، أبرز قناة استقبال، نمط معالجة سائد، وأهم مكسب وأهم خطر.

## ٢. خريطة التعلّم الشخصية
لكل محور من الستة (الاستقبال، المعالجة، الذاكرة، التركيز، الدافعية، البيئة): الدرجة والدلالة والتفسير العلمي القصير.

## ٣. تحليل المؤشرات السبعة
LES / RET / FOC / PSS / LAS / SLS / DLS — لكلٍّ: الدرجة، المعنى، الدلالة على سلوك التعلّم.

## ٤. تحليل اختبارات الأداء
ماذا تقول نتائج: استدعاء الذاكرة الفوري والمؤجَّل، أداء Stroop (الدقة وزمن الاستجابة وكلفة التداخل)، أداء حلّ المشكلات.

## ٥. نقاط قوّتك التعليمية (5)
سلوكيات/أدوات/سياقات تستفيد منها فعلياً، مع ربطها بأبعادك الأعلى.

## ٦. عوائق التعلّم لديك (5)
ما يُقلِّل فهمك وتركيزك واحتفاظك، مع توصية محدَّدة لكلٍّ.

## ٧. وصفة التعلّم اليومية
- مدّة الجلسة المثالية (دقائق).
- عدد الجلسات / فترات الراحة (Pomodoro موصوف لك تحديداً).
- أفضل وقت تعلّم.
- أفضل بيئة (فردي/جماعي/مرن/منظَّم).
- أفضل نوع محتوى (فيديو/قراءة/مناقشة/تطبيق).

## ٨. خطة المذاكرة والمراجعة
- كيف تذاكر (تقنيات: Active Recall, Spaced Repetition, Feynman, Interleaving).
- كيف تحفظ (Dual Coding, Mind Mapping, Mnemonics).
- كيف تراجع (جدول SR موصى به).
- كيف تستعد للاختبارات (Testing Effect + محاكاة).

## ٩. كيف تتعلّم مهارة جديدة
خطوات Deliberate Practice مخصَّصة لنمطك.

## ١٠. توصية محتوى
3 فيديوهات/قنوات + 3 كتب + 3 بودكاست + 3 دورات (عربية وعالمية)، مرتبة بأولوية بحسب نمطك.

## ١١. أفضل مسار أكاديمي/مهني
3-5 مسارات تستثمر بصمتك التعليمية.

## ١٢. خطة 30 يوماً لتطوير نقاط الضعف
أهداف SMART أسبوعية + مؤشّرات نجاح.

## ١٣. حدود التقرير
أداة استكشافية، النتائج تتأثّر بحالتك يوم التقييم، التفضيلات الحسّية ليست تصنيفاً قاطعاً.

التزم باللغة العربية، تجنّب الإطلاقيات، استشهد بدرجات المستخدم عند كل استنتاج.`;

export const submitLearningDna = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SubmitSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "ldna-submit", limit: 10, windowSeconds: 3600 });

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const scores = calculateLearningDna(data.answers, (data.tasks ?? {}) as TaskResults);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const dimsBlock = Object.entries(scores.dimensions)
      .map(([k, v]) => `- ${DIMENSION_LABELS[k as keyof typeof DIMENSION_LABELS] ?? k}: ${v.toFixed(2)}/5`)
      .join("\n");

    const axesBlock = Object.entries(scores.axisScores)
      .map(([k, v]) => `- ${AXIS_LABELS[k as keyof typeof AXIS_LABELS] ?? k}: ${v}/100`)
      .join("\n");

    const metricsBlock = (Object.entries(scores.metrics) as [keyof typeof METRIC_LABELS, number][])
      .map(([k, v]) => `- ${METRIC_LABELS[k]} (${k}): ${v}/100`)
      .join("\n");

    const tasksBlock = data.tasks
      ? JSON.stringify(data.tasks, null, 2)
      : "لم يكمل المستخدم اختبارات الأداء.";

    const userBlock = `
الاسم: ${data.name || "غير محدد"}
LES (الكفاءة): ${scores.metrics.LES}/100 — التصنيف: ${scores.band}

# المحاور الستة:
${axesBlock}

# المؤشرات السبعة:
${metricsBlock}

# الأبعاد الفرعية (متوسط 1-5):
${dimsBlock}

# نتائج اختبارات الأداء:
${tasksBlock}

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
      if (aiRes.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      const t = await aiRes.text();
      console.error("ldna ai error", aiRes.status, t);
      throw new Error("تعذّر توليد التقرير.");
    }
    const aiJson = await aiRes.json();
    const aiReport: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!aiReport) throw new Error("لم يكتمل توليد التقرير.");

    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("learning_dna_submissions").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = `# تقرير Learning DNA — بصمتك التعليمية
**كود التقرير:** \`${code}\`  
**التاريخ:** ${new Date().toLocaleDateString("ar-EG")}  
**كفاءة التعلّم (LES):** ${scores.metrics.LES}/100 — ${scores.band}

| المؤشر | الدرجة |
|---|---|
${(Object.entries(scores.metrics) as [keyof typeof METRIC_LABELS, number][])
  .map(([k, v]) => `| ${METRIC_LABELS[k]} (${k}) | ${v}/100 |`).join("\n")}

---

`;
    const fullReport = header + aiReport;

    const { data: inserted, error: pErr } = await supabaseAdmin
      .from("learning_dna_submissions").insert({
        user_id: context.userId,
        code,
        answers: data.answers,
        task_results: data.tasks ?? {},
        dimension_scores: {
          dimensions: scores.dimensions,
          axisScores: scores.axisScores,
        },
        les: scores.metrics.LES, ret: scores.metrics.RET, foc: scores.metrics.FOC,
        pss: scores.metrics.PSS, las: scores.metrics.LAS, sls: scores.metrics.SLS,
        dls: scores.metrics.DLS,
        band: scores.band, ai_report: fullReport,
      }).select("id").maybeSingle();
    if (pErr) {
      console.error("ldna insert", pErr);
      throw new Error("تعذّر حفظ التقرير.");
    }

    await supabaseAdmin.from("assessment_reports").insert({
      code, name: data.name ?? null, stage: "learning-dna",
      answers: data.answers, report: fullReport, user_id: context.userId,
    });

    return { code, scores, submissionId: inserted?.id };
  });

export const listMyLearningDna = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("learning_dna_submissions")
      .select("id, code, les, ret, foc, pss, las, sls, dls, band, dimension_scores, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error("تعذّر قراءة السجل.");
    return data ?? [];
  });

// === AI Learning Coach ===
const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
});

export const sendCoachMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ChatSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "ldna-coach", limit: 30, windowSeconds: 3600 });

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // آخر تقرير DNA كسياق
    const { data: last } = await supabaseAdmin
      .from("learning_dna_submissions")
      .select("id, les, ret, foc, pss, las, sls, dls, band, dimension_scores")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1).maybeSingle();

    // آخر 12 رسالة من المحادثة
    const { data: history } = await supabaseAdmin
      .from("learning_coach_messages")
      .select("role, content")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(12);
    const ordered = (history ?? []).reverse();

    const contextBlock = last
      ? `بصمة التعلّم الحالية للمستخدم (الأحدث):
- LES ${last.les} | RET ${last.ret} | FOC ${last.foc} | PSS ${last.pss} | LAS ${last.las} | SLS ${last.sls} | DLS ${last.dls}
- التصنيف العام: ${last.band}
- الأبعاد/المحاور: ${JSON.stringify(last.dimension_scores).slice(0, 1500)}`
      : "لم يُكمل المستخدم تقييم Learning DNA بعد. شجّعه على إكماله أولاً للحصول على توصيات دقيقة.";

    const system = `أنت AI Learning Coach — مدرّب تعلّم شخصي بالعربية، خبير في علوم التعلّم.
- اعتمد على بصمة تعلّم المستخدم أدناه. لا تخترع درجات.
- ردودك قصيرة، عملية، خطوات قابلة للتنفيذ اليوم.
- استخدم Active Recall, Spaced Repetition, Pomodoro, Deliberate Practice حيثما يناسب.
- لا تشخيص طبي/نفسي. أَحِل لمختصّ عند الحاجة.
${contextBlock}`;

    const messages = [
      { role: "system", content: system + "\n\n" + AI_GUARDRAILS },
      ...ordered.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.message },
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 1500,
        messages,
      }),
    });
    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تجاوزت الحد المسموح.");
      if (aiRes.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      const t = await aiRes.text();
      console.error("coach error", aiRes.status, t);
      throw new Error("تعذّر الردّ الآن.");
    }
    const aiJson = await aiRes.json();
    const reply: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!reply) throw new Error("ردّ فارغ من المدرّب.");

    await supabaseAdmin.from("learning_coach_messages").insert([
      { user_id: context.userId, submission_id: last?.id ?? null, role: "user", content: data.message },
      { user_id: context.userId, submission_id: last?.id ?? null, role: "assistant", content: reply },
    ]);

    return { reply };
  });

export const listCoachHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("learning_coach_messages")
      .select("role, content, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error("تعذّر قراءة المحادثة.");
    return data ?? [];
  });
