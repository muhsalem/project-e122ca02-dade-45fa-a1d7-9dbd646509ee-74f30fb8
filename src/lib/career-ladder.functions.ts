import { createServerFn } from "@tanstack/react-start";

export const listCareerLadders = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("career_ladders")
    .select("role_family, isco, level_order, level_title, years_experience, key_responsibilities, next_step_skills")
    .order("role_family", { ascending: true })
    .order("level_order", { ascending: true });
  if (error) throw new Error(error.message);
  return { ladders: data ?? [] };
});
