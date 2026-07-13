import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AI_GUARDRAILS } from "./ai-guardrails";

const SYSTEM_PROMPT = `أنت مستشار تربوي عربي متمرّس يخاطب وليّ الأمر (أب/أم/وليّ رعاية) مباشرةً بلغة دافئة ومحترمة وواضحة، دون مصطلحات فنية معقّدة.

مهمّتك: تحويل تقرير الإرشاد المهني الخاصّ بابنه/ابنته إلى **تقرير مُرافِق لوليّ الأمر (Parent-Companion Report)** يساعده على فهم شخصية ابنه/ابنته المهنية ودعمها بحكمة، دون فرض أو تشخيص.

## قواعد ملزمة
1. **لا تُشخِّص ولا تُصنِّف**: لا تصف الابن/الابنة بـ"يعاني" أو "ضعيف في…". استخدم لغة إيجابية وصفية: "يظهر ميلاً واضحاً إلى…"، "قد يستفيد من دعم في…".
2. **لا تُقارن مع الإخوة أو الأقران** أبداً.
3. **لا تُفشِ تفاصيل حساسة** قد تكون خاصة بالابن/الابنة (مخاوف عميقة، مشاعر خاصة). اذكر فقط ما يخدم الدعم العملي.
4. **احترم استقلالية الابن/الابنة**: ذكّر وليّ الأمر أن القرار المهني له/لها في النهاية، وأنّ دور الوليّ هو التمكين لا القرار.
5. **لغة عربية فصيحة دافئة**، جمل قصيرة، بدون إنجليزية.
6. طول التقرير: 700-1100 كلمة تقريباً.

## الهيكل الإلزامي (Markdown، بهذا الترتيب حرفياً)

# رسالة إلى وليّ الأمر

## 1) لمحة سريعة (في دقيقة واحدة)
فقرة دافئة من 3-4 أسطر تصف الشخصية المهنية الظاهرة لابنك/ابنتك بلغة إيجابية، وتذكر أهمّ 3 نقاط قوّة.

## 2) ما الذي يشعل حماسه/حماسها؟
قائمة من 4-6 نقاط عن الاهتمامات والميول المهنية الظاهرة في التقرير، بلغة يفهمها وليّ الأمر.

## 3) كيف يفكّر ويتعلّم؟
2-3 فقرات قصيرة عن أسلوب التفكير والتعلّم المميّز، مع أمثلة عملية لما قد يعنيه ذلك في الحياة اليومية والدراسة.

## 4) 5 طرق تدعمه/تدعمها بها هذا الأسبوع
قائمة مرقّمة من 5 أفعال محدّدة صغيرة يستطيع وليّ الأمر البدء بها فوراً (مثال: "اسأله عن أكثر مشروع مدرسي أحبّه هذا الشهر واستمع دون مقاطعة")، وليست نصائح عامّة.

## 5) 3 أشياء تجنّبها بلطف
قائمة من 3 سلوكيات شائعة يُنصح بتجنّبها (مثل المقارنة، التقليل من اهتماماته، فرض تخصّص) مع بديل عملي لكلّ منها.

## 6) 5 أسئلة قوّة لتفتح حواراً معه/معها
أسئلة مفتوحة (ليست استجواباً) يمكن طرحها في وقت هادئ لتعميق الحوار حول المسار، مثل: "لو استطعت قضاء يوم كامل في أيّ عمل، ماذا ستختار ولماذا؟".

## 7) متى تطلب مساعدة مختصّ؟
فقرة قصيرة تُذكر فيها أنّ استشارة مرشد مهني محايد ليست علامة قصور بل استثمار — واذكر متى تكون خطوة مفيدة (تردّد شديد، ضغط دراسي، اختيار جامعي وشيك). لا تفرض، فقط اقترح.

## 8) رسالة ختامية قصيرة
3-4 أسطر بلغة داعمة تؤكّد ثقتك بدور وليّ الأمر وأنّ حضوره الواعي أهمّ من أيّ اختبار.

---
*ملاحظة تلقائية في نهاية التقرير*: هذه قراءة مُرافِقة استكشافية تكميلية لتقرير ابنك/ابنتك، وليست بديلاً عن جلسة إرشاد مهني متخصّصة.`;

export const generateParentReport = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().trim().min(2).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "parent-report", limit: 20, windowSeconds: 3600 });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // كاش: نستخدم report_cache إن وُجد بالمفتاح parent:{code}
    const cacheKey = `parent:v2:${data.code}`;
    const { data: cached } = await supabaseAdmin
      .from("report_cache")
      .select("report, created_at")
      .eq("cache_key", cacheKey)
      .maybeSingle();
    if (cached?.report) {
      return { report: String(cached.report), cached: true as const };
    }

    const { data: row, error } = await supabaseAdmin
      .from("assessment_reports")
      .select("name, stage, age, report, user_id, answers")
      .eq("code", data.code)
      .maybeSingle();
    if (error || !row) throw new Error("تعذّر تحميل التقرير الأصلي.");

    // ===== إثراء السياق (Personalization) =====
    let profileCtx = "";
    let poiaCtx = "";
    let dnaCtx = "";
    let interestsCtx = "";

    // استخرج اهتمامات مباشرة من إجابات التقرير (حقول نصّية حرّة شائعة)
    try {
      const ans = (row.answers ?? {}) as Record<string, unknown>;
      const pick = (keys: string[]) =>
        keys.map((k) => ans[k]).filter((v) => typeof v === "string" && (v as string).trim()).join(" | ");
      const interests = pick(["interests", "hobbies", "favorite_subjects", "favorite_subject", "dream_job", "passion", "الاهتمامات", "الهوايات", "المواد_المفضلة"]);
      const goals = pick(["goals", "aspiration", "future", "الأهداف", "الطموح"]);
      const bits: string[] = [];
      if (interests) bits.push(`- اهتمامات/هوايات ذكرها: ${interests.slice(0, 400)}`);
      if (goals) bits.push(`- طموحات ذكرها: ${goals.slice(0, 300)}`);
      if (bits.length) interestsCtx = `\n### إشارات ذاتية من الطالب\n${bits.join("\n")}`;
    } catch { /* noqa */ }

    if (row.user_id) {
      const [profRes, poiaRes, dnaRes] = await Promise.all([
        supabaseAdmin.from("profiles").select("country, age, full_name").eq("user_id", row.user_id).maybeSingle(),
        supabaseAdmin.from("poia_submissions").select("band, pi_score, oh_score, qwl_score, csi_score, cfs_score, bri_score, context").eq("user_id", row.user_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabaseAdmin.from("learning_dna_submissions").select("band, dimension_scores, dls, les, sls, las, pss, ret, foc").eq("user_id", row.user_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);

      const prof = profRes.data;
      if (prof) {
        const parts = [
          prof.country ? `الدولة: ${prof.country}` : null,
          prof.age ? `العمر: ${prof.age}` : null,
        ].filter(Boolean);
        if (parts.length) profileCtx = `\n### السياق الشخصي\n- ${parts.join(" • ")}`;
      }

      const poia = poiaRes.data;
      if (poia) {
        const scores = [
          poia.pi_score != null ? `الشغف والاهتمام PI: ${poia.pi_score}` : null,
          poia.oh_score != null ? `صحّة المهنة OH: ${poia.oh_score}` : null,
          poia.qwl_score != null ? `جودة الحياة الوظيفية QWL: ${poia.qwl_score}` : null,
          poia.csi_score != null ? `الملاءمة الوظيفية CSI: ${poia.csi_score}` : null,
          poia.bri_score != null ? `الجاهزية للعمل BRI: ${poia.bri_score}` : null,
        ].filter(Boolean).join(" | ");
        poiaCtx = `\n### نتائج مؤشّر الميول والانسجام المهني (POIA)\n- المستوى العام: ${poia.band ?? "—"}\n- المؤشّرات: ${scores || "—"}`;
      }

      const dna = dnaRes.data;
      if (dna) {
        const dims = [
          dna.dls != null ? `أسلوب التعلّم DLS: ${dna.dls}` : null,
          dna.les != null ? `بيئة التعلّم LES: ${dna.les}` : null,
          dna.sls != null ? `الاستراتيجيات SLS: ${dna.sls}` : null,
          dna.las != null ? `الاستقلالية LAS: ${dna.las}` : null,
          dna.pss != null ? `المثابرة PSS: ${dna.pss}` : null,
          dna.ret != null ? `الاحتفاظ RET: ${dna.ret}` : null,
          dna.foc != null ? `التركيز FOC: ${dna.foc}` : null,
        ].filter(Boolean).join(" | ");
        dnaCtx = `\n### الحمض النووي للتعلّم (Learning DNA)\n- المستوى: ${dna.band ?? "—"}\n- الأبعاد: ${dims || "—"}`;
      }
    }

    const studentContext = `الاسم (إن ذُكر): ${row.name ?? "غير محدد"}
المرحلة الدراسية: ${row.stage ?? "غير محدد"}
${row.age ? `الفئة العمرية: ${row.age}` : ""}${profileCtx}${interestsCtx}${poiaCtx}${dnaCtx}

--- تقرير الإرشاد المهني الأصلي ---
${String(row.report).slice(0, 7000)}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 4000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + "\n\n" + AI_GUARDRAILS },
          {
            role: "user",
            content: `فيما يلي تقرير ابن/ابنة أحد أولياء الأمور، مع سياق إثرائي (اهتمامات، مرحلة دراسية، سياق شخصي، ونتائج اختبارات مكمّلة إن وُجدت). ادمج هذا السياق طبيعياً داخل صياغة الرسالة — اذكر مادّة/هواية/طموح محدّد ذكره الطالب حين يوجد، واربط التوصيات بمرحلته الدراسية ودولته إن ذُكرت، ولا تعِد سرد الأرقام كجدول بل ترجمها إلى لغة أهل — ثم أنتج التقرير المُرافِق كاملاً وفق الهيكل المحدّد وبنبرة دافئة.\n\n${studentContext}`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تجاوزت الحد المسموح مؤقتاً، حاول بعد قليل.");
      if (aiRes.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      const t = await aiRes.text().catch(() => "");
      console.error("parent-report AI error", aiRes.status, t);
      throw new Error("تعذّر توليد التقرير المُرافِق.");
    }

    const aiJson = await aiRes.json();
    const report: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!report || report.length < 200) {
      throw new Error("لم يكتمل توليد التقرير. حاول مرة أخرى.");
    }

    // خزّن الكاش (تجاهل أخطاء الكاش لأنّها ثانوية)
    await supabaseAdmin
      .from("report_cache")
      .upsert(
        { cache_key: cacheKey, report_type: "parent_companion", report },
        { onConflict: "cache_key" },
      )
      .then(() => undefined, () => undefined);

    return { report, cached: false as const };
  });
