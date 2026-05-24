import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ScaleItem = z.number().int().min(0).max(3);

const Schema = z.object({
  code: z.string().min(2).max(64),
  phq2_q1: ScaleItem,
  phq2_q2: ScaleItem,
  gad2_q1: ScaleItem,
  gad2_q2: ScaleItem,
  career_anx_q1: ScaleItem,
  career_anx_q2: ScaleItem,
  career_anx_q3: ScaleItem,
});

export const submitWellbeing = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const phq2 = data.phq2_q1 + data.phq2_q2;
    const gad2 = data.gad2_q1 + data.gad2_q2;
    const carAnx = data.career_anx_q1 + data.career_anx_q2 + data.career_anx_q3;

    // PHQ-2 ≥3 = positive depression screen; GAD-2 ≥3 = positive anxiety
    const referral = phq2 >= 3 || gad2 >= 3;
    const risk: "low" | "moderate" | "high" =
      phq2 >= 5 || gad2 >= 5 ? "high" : referral || carAnx >= 6 ? "moderate" : "low";

    const { error } = await supabaseAdmin.from("wellbeing_screenings").insert({
      ...data,
      phq2_total: phq2,
      gad2_total: gad2,
      career_anx_total: carAnx,
      referral_needed: referral,
      risk_level: risk,
    });
    if (error) {
      console.error("Wellbeing insert error:", error);
      throw new Error("تعذّر حفظ الفحص.");
    }
    return { phq2, gad2, carAnx, referral, risk };
  });
