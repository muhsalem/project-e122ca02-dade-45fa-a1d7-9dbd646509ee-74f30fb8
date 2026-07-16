import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const schema = z.object({
  assessment_key: z.string().min(1).max(80),
  consent_text: z.string().max(4000),
  student_age: z.number().int().min(6).max(120).default(18),
  is_minor: z.boolean().default(false),
  guardian_name: z.string().max(200).optional().nullable(),
  guardian_relation: z.string().max(80).optional().nullable(),
  guardian_contact: z.string().max(200).optional().nullable(),
  guardian_confirmed: z.boolean().default(false),
});

export const logAssessmentConsent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("consent_log").insert({
      user_id: context.userId,
      assessment_key: data.assessment_key,
      consent_text: data.consent_text,
      student_age: data.student_age,
      is_minor: data.is_minor,
      guardian_name: data.guardian_name ?? null,
      guardian_relation: data.guardian_relation ?? null,
      guardian_contact: data.guardian_contact ?? null,
      guardian_confirmed: data.guardian_confirmed,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
