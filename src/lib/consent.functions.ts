import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const consentSchema = z.object({
  assessmentKey: z.string().min(1).max(80),
  studentAge: z.number().int().min(3).max(120),
  guardianName: z.string().trim().max(120).optional(),
  guardianRelation: z.string().trim().max(60).optional(),
  guardianContact: z.string().trim().max(160).optional(),
  guardianConfirmed: z.boolean(),
  consentText: z.string().max(2000).optional(),
});

export const recordConsent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => consentSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const isMinor = data.studentAge < 18;

    if (isMinor) {
      if (!data.guardianConfirmed || !data.guardianName || !data.guardianContact) {
        throw new Error("موافقة وليّ الأمر مطلوبة للطلاب دون 18 عاماً.");
      }
    }

    const ip =
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
      getRequestHeader("x-real-ip") ||
      null;
    const ua = getRequestHeader("user-agent") ?? null;

    const { data: row, error } = await supabase
      .from("consent_log")
      .insert({
        user_id: userId,
        assessment_key: data.assessmentKey,
        student_age: data.studentAge,
        is_minor: isMinor,
        guardian_name: data.guardianName ?? null,
        guardian_relation: data.guardianRelation ?? null,
        guardian_contact: data.guardianContact ?? null,
        guardian_confirmed: data.guardianConfirmed,
        consent_text: data.consentText ?? null,
        ip_address: ip,
        user_agent: ua,
      })
      .select("id, created_at")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id, createdAt: row.created_at, isMinor };
  });

export const getLatestConsent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ assessmentKey: z.string().min(1).max(80) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("consent_log")
      .select("id, student_age, is_minor, guardian_confirmed, created_at")
      .eq("user_id", userId)
      .eq("assessment_key", data.assessmentKey)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return row;
  });
