import { AI_GUARDRAILS } from "./ai-guardrails";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `IDP-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const generateIDP = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ report_code: z.string().min(2).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check existing
    const { data: existing } = await supabaseAdmin
      .from("development_plans")
      .select("*")
      .eq("report_code", data.report_code)
      .maybeSingle();
    if (existing) return existing;

    // Load report
    const { data: report, error: rErr } = await supabaseAdmin
      .from("assessment_reports")
      .select("name, stage, report")
      .eq("code", data.report_code)
      .maybeSingle();
    if (rErr || !report) throw new Error("لم يُعثر على التقرير.");

    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "idp", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ.");

    const systemPrompt = `أنت مرشد مهني خبير في تصميم خطط التطوير الفردية (IDP - Individual Development Plan) وفق منهجية SMART وICF.

مهمتك: تحويل تقرير التقييم إلى خطة تطوير 90 يوم قابلة للتنفيذ والتتبع.

أصدر JSON صحيح حصراً (بدون أي نص قبل أو بعد) وفق هذا المخطط:

{
  "career_goal": "هدف مهني واضح ومحدد ضمن جملة واحدة (SMART)",
  "current_stage": "وصف المرحلة الحالية ومستوى الجاهزية",
  "milestones": [
    { "week": 1, "title": "...", "description": "...", "deliverable": "...", "status": "pending" },
    ... (12 معلمًا أسبوعيًا، أسبوع 1 إلى 12)
  ],
  "skills_to_develop": [
    { "skill": "...", "priority": "high|medium|low", "current_level": 1-5, "target_level": 1-5, "rationale": "..." },
    ... (5-8 مهارات)
  ],
  "recommended_courses": [
    { "title": "...", "provider": "Coursera|Edraak|Rwaq|YouTube|LinkedIn Learning|...", "url_hint": "اسم/كلمات البحث", "duration_hours": 10, "skill_addressed": "..." },
    ... (5-7 كورسات)
  ],
  "weekly_actions": [
    { "day": "السبت", "action": "..." },
    { "day": "الأحد", "action": "..." },
    ... (7 أيام، روتين أسبوعي ثابت)
  ],
  "success_metrics": "مؤشرات النجاح القابلة للقياس بعد 90 يوماً (3-5 جمل)"
}

التزم بـ:
- ربط كل معلم/مهارة بالتقرير الفعلي.
- واقعية في الالتزام الزمني (ساعات/أسبوع معقولة).
- اقتراح كورسات عربية أو بترجمة عربية متاحة.
- لغة عربية فصحى محفّزة بدون رتابة.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 6000,
        messages: [
          { role: "system", content: systemPrompt + AI_GUARDRAILS },
          {
            role: "user",
            content: `اسم المستفيد: ${report.name ?? "غير محدد"}\nالمرحلة: ${report.stage ?? "غير محدد"}\n\nتقرير التقييم:\n${report.report}\n\nأصدر خطة IDP بصيغة JSON فقط.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تم تجاوز الحد. حاول لاحقاً.");
      if (aiRes.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      throw new Error("تعذّر إنشاء الخطة.");
    }
    const aiJson = await aiRes.json();
    let text: string = aiJson?.choices?.[0]?.message?.content ?? "";
    text = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("صيغة الخطة غير صحيحة.");
      parsed = JSON.parse(m[0]);
    }

    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: ex } = await supabaseAdmin
        .from("development_plans").select("id").eq("code", code).maybeSingle();
      if (!ex) break;
      code = generateCode();
    }

    const row = {
      code,
      report_code: data.report_code,
      career_goal: String(parsed.career_goal ?? "غير محدد"),
      current_stage: String(parsed.current_stage ?? ""),
      milestones: parsed.milestones ?? [],
      skills_to_develop: parsed.skills_to_develop ?? [],
      recommended_courses: parsed.recommended_courses ?? [],
      weekly_actions: parsed.weekly_actions ?? [],
      success_metrics: String(parsed.success_metrics ?? ""),
    };
    const { error } = await supabaseAdmin.from("development_plans").insert(row);
    if (error) {
      console.error("IDP insert error:", error);
      throw new Error("تعذّر حفظ الخطة.");
    }
    return row;
  });

export const getIDPByReport = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ report_code: z.string().min(2).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("development_plans")
      .select("*")
      .eq("report_code", data.report_code)
      .maybeSingle();
    return { plan: row };
  });
