import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getReport = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ code: z.string().min(1).max(64) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("assessment_reports")
      .select("report,name,stage,created_at")
      .eq("code", data.code)
      .maybeSingle();
    if (error) throw new Error("تعذّر تحميل التقرير.");
    if (!row) return null;
    return row as { report: string; name: string | null; stage: string | null; created_at: string };
  });
