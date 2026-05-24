import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  group_code: z.string().min(1).max(32).regex(/^[A-Z0-9_-]+$/),
});

export const getCohortReports = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("assessment_reports")
      .select("code, name, age, stage, created_at")
      .eq("group_code", data.group_code)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("Cohort fetch error:", error);
      throw new Error("تعذر جلب تقارير المجموعة.");
    }
    return { rows: rows ?? [] };
  });
