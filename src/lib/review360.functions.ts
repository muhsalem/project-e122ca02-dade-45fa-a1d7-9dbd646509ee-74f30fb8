import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `R360-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const createReviewRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      subject_name: z.string().trim().min(2).max(120),
      subject_email: z.string().trim().email().max(255).optional().or(z.literal("")),
      context: z.string().trim().max(500).optional().or(z.literal("")),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: ex } = await supabaseAdmin
        .from("review_requests").select("id").eq("code", code).maybeSingle();
      if (!ex) break;
      code = generateCode();
    }
    const { error } = await supabaseAdmin.from("review_requests").insert({
      code,
      subject_name: data.subject_name,
      subject_email: data.subject_email || null,
      context: data.context || null,
    });
    if (error) {
      console.error("Review request insert error:", error);
      throw new Error("تعذّر إنشاء الطلب.");
    }
    return { code };
  });

const Rating = z.number().int().min(1).max(5);

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      request_code: z.string().min(2).max(64),
      reviewer_relation: z.enum(["parent","teacher","peer","manager","mentor","friend","other"]),
      strengths: Rating, communication: Rating, responsibility: Rating, leadership: Rating,
      problem_solving: Rating, teamwork: Rating, adaptability: Rating, work_ethic: Rating,
      strengths_text: z.string().trim().max(1000).optional().or(z.literal("")),
      improvement_text: z.string().trim().max(1000).optional().or(z.literal("")),
      suggested_career: z.string().trim().max(300).optional().or(z.literal("")),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Ensure request exists and not expired
    const { data: req } = await supabaseAdmin
      .from("review_requests")
      .select("id, expires_at, subject_name")
      .eq("code", data.request_code)
      .maybeSingle();
    if (!req) throw new Error("رابط التقييم غير صحيح.");
    if (new Date(req.expires_at) < new Date()) throw new Error("انتهت صلاحية رابط التقييم.");

    const { error } = await supabaseAdmin.from("review_responses").insert({
      request_code: data.request_code,
      reviewer_relation: data.reviewer_relation,
      strengths: data.strengths,
      communication: data.communication,
      responsibility: data.responsibility,
      leadership: data.leadership,
      problem_solving: data.problem_solving,
      teamwork: data.teamwork,
      adaptability: data.adaptability,
      work_ethic: data.work_ethic,
      strengths_text: data.strengths_text || null,
      improvement_text: data.improvement_text || null,
      suggested_career: data.suggested_career || null,
    });
    if (error) {
      console.error("Review submit error:", error);
      throw new Error("تعذّر إرسال التقييم.");
    }
    return { ok: true, subject_name: req.subject_name };
  });

export const getReviewRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(2).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: req } = await supabaseAdmin
      .from("review_requests")
      .select("code, subject_name, context, expires_at, created_at")
      .eq("code", data.code)
      .maybeSingle();
    return { request: req };
  });

export const getReviewResults = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(2).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: req } = await supabaseAdmin
      .from("review_requests")
      .select("code, subject_name, context, created_at")
      .eq("code", data.code)
      .maybeSingle();
    if (!req) throw new Error("رابط النتائج غير صحيح.");

    const { data: rows } = await supabaseAdmin
      .from("review_responses")
      .select("*")
      .eq("request_code", data.code);

    const responses = rows ?? [];
    const n = responses.length;
    const DIMENSIONS = ["strengths","communication","responsibility","leadership","problem_solving","teamwork","adaptability","work_ethic"] as const;
    const averages: Record<string, number> = {};
    for (const d of DIMENSIONS) {
      averages[d] = n > 0 ? Math.round((responses.reduce((s, r: any) => s + (r[d] ?? 0), 0) / n) * 10) / 10 : 0;
    }
    const overall = n > 0 ? Math.round((Object.values(averages).reduce((a, b) => a + b, 0) / 8) * 10) / 10 : 0;

    // Anonymize relations distribution
    const relations: Record<string, number> = {};
    for (const r of responses as any[]) {
      relations[r.reviewer_relation] = (relations[r.reviewer_relation] ?? 0) + 1;
    }

    // Collect free text (anonymous)
    const strengths_texts = (responses as any[]).map((r) => r.strengths_text).filter(Boolean);
    const improvement_texts = (responses as any[]).map((r) => r.improvement_text).filter(Boolean);
    const career_suggestions = (responses as any[]).map((r) => r.suggested_career).filter(Boolean);

    return {
      request: req,
      count: n,
      averages,
      overall,
      relations,
      strengths_texts,
      improvement_texts,
      career_suggestions,
    };
  });
