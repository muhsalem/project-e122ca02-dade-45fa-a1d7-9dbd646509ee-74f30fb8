import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Goal = { id: string; title: string; due?: string; done: boolean };
export type PlanDTO = { track: string | null; goals: Goal[] };

export const getMyPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PlanDTO> => {
    const { data, error } = await context.supabase
      .from("career_plans")
      .select("track, goals")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return { track: null, goals: [] };
    return {
      track: data.track,
      goals: Array.isArray(data.goals) ? (data.goals as unknown as Goal[]) : [],
    };
  });

export const saveMyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PlanDTO) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("career_plans")
      .upsert(
        {
          user_id: context.userId,
          track: data.track,
          goals: data.goals as never,
        },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
