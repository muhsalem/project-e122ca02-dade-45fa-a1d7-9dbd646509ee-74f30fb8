import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  code: z.string().min(2).max(64),
  phase: z.enum(["pre", "post"]),
  q1_self_awareness: z.number().int().min(1).max(10),
  q2_career_options: z.number().int().min(1).max(10),
  q3_decision_confidence: z.number().int().min(1).max(10),
  q4_action_plan: z.number().int().min(1).max(10),
  q5_future_optimism: z.number().int().min(1).max(10),
});

export const submitClarityScore = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const total =
      data.q1_self_awareness + data.q2_career_options + data.q3_decision_confidence +
      data.q4_action_plan + data.q5_future_optimism;
    const { error } = await supabaseAdmin.from("clarity_scores").insert({
      ...data,
      total_score: total,
    });
    if (error) {
      console.error("Clarity insert error:", error);
      throw new Error("تعذّر حفظ المقياس.");
    }
    return { total, max: 50, percent: Math.round((total / 50) * 100) };
  });

export const getClarityComparison = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(2).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("clarity_scores")
      .select("phase, total_score, created_at")
      .eq("code", data.code)
      .order("created_at", { ascending: true });
    if (error) throw new Error("تعذّر جلب البيانات.");
    const pre = rows?.find((r) => r.phase === "pre")?.total_score ?? null;
    const post = rows?.find((r) => r.phase === "post")?.total_score ?? null;
    return { pre, post, improvement: pre && post ? post - pre : null };
  });
