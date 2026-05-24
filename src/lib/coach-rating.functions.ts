import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RatingInput = z.object({
  coach_name: z.string().min(1).max(120),
  overall: z.number().int().min(1).max(5),
  clarity: z.number().int().min(1).max(5),
  professionalism: z.number().int().min(1).max(5),
  usefulness: z.number().int().min(1).max(5),
  would_recommend: z.boolean(),
  comment: z.string().max(2000).optional().nullable(),
  reviewer_name: z.string().max(120).optional().nullable(),
  reviewer_email: z.string().email().max(255).optional().nullable(),
  session_date: z.string().max(32).optional().nullable(),
});

export const submitCoachRating = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RatingInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("coach_ratings").insert({
      coach_name: data.coach_name,
      overall: data.overall,
      clarity: data.clarity,
      professionalism: data.professionalism,
      usefulness: data.usefulness,
      would_recommend: data.would_recommend,
      comment: data.comment || null,
      reviewer_name: data.reviewer_name || null,
      reviewer_email: data.reviewer_email || null,
      session_date: data.session_date || null,
    });
    if (error) {
      console.error("Rating insert error:", error);
      throw new Error("تعذر حفظ التقييم.");
    }
    return { ok: true };
  });

export const getCoachRatingsSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("coach_ratings")
      .select("coach_name, overall, clarity, professionalism, usefulness, would_recommend, comment, reviewer_name, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("Rating fetch error:", error);
      throw new Error("تعذر جلب التقييمات.");
    }
    const rows = data ?? [];
    const byCoach = new Map<string, { count: number; sum: number; rec: number }>();
    for (const r of rows) {
      const e = byCoach.get(r.coach_name) ?? { count: 0, sum: 0, rec: 0 };
      e.count++;
      e.sum += r.overall;
      if (r.would_recommend) e.rec++;
      byCoach.set(r.coach_name, e);
    }
    const summary = Array.from(byCoach.entries()).map(([name, v]) => ({
      coach_name: name,
      count: v.count,
      avg: Number((v.sum / v.count).toFixed(2)),
      recommend_pct: Math.round((v.rec / v.count) * 100),
    }));
    return { summary, recent: rows.slice(0, 30) };
  });
