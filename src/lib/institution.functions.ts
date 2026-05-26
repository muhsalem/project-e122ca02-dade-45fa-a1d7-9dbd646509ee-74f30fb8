import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  groupCode: z.string().min(3).max(40),
});

export const getInstitutionDashboard = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: reports, error } = await supabaseAdmin
      .from("assessment_reports")
      .select("code, name, stage, age, created_at")
      .eq("group_code", data.groupCode)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("تعذر جلب البيانات.");

    const total = reports?.length ?? 0;
    const byStage: Record<string, number> = {};
    const uniqueStudents = new Set<string>();

    for (const r of reports ?? []) {
      const s = r.stage ?? "general";
      byStage[s] = (byStage[s] || 0) + 1;
      if (r.name) uniqueStudents.add(r.name);
    }

    const recent = (reports ?? []).slice(0, 50).map((r) => ({
      code: r.code,
      name: r.name,
      stage: r.stage,
      age: r.age,
      created_at: r.created_at,
    }));

    return {
      total,
      uniqueStudents: uniqueStudents.size,
      byStage,
      recent,
    };
  });
