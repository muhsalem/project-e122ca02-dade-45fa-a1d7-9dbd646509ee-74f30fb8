import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* =============== Flashcards =============== */

const flashcardSchema = z.object({
  id: z.string().uuid().optional(),
  front: z.string().min(1).max(2000),
  back: z.string().min(1).max(2000),
  deck: z.string().min(1).max(100).default("عام"),
  ease: z.number().min(1.3).max(3.5).default(2.5),
  interval_days: z.number().int().min(0).max(3650).default(0),
  reps: z.number().int().min(0).max(10000).default(0),
  due_at: z.string().datetime().optional(),
});

export const listFlashcards = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("study_flashcards")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertFlashcard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => flashcardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const row = {
      user_id: context.userId,
      front: data.front,
      back: data.back,
      deck: data.deck,
      ease: data.ease,
      interval_days: data.interval_days,
      reps: data.reps,
      due_at: data.due_at ?? new Date().toISOString(),
      ...(data.id ? { id: data.id } : {}),
    };
    const { data: out, error } = await context.supabase
      .from("study_flashcards")
      .upsert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return out;
  });

export const deleteFlashcard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("study_flashcards").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* =============== Pomodoro daily counter =============== */

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const getPomodoroToday = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const day = today();
    const { data, error } = await context.supabase
      .from("study_pomodoro_days")
      .select("completed_count")
      .eq("user_id", context.userId)
      .eq("day", day)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { day, completed: data?.completed_count ?? 0 };
  });

export const incrementPomodoro = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const day = today();
    const { data: existing } = await context.supabase
      .from("study_pomodoro_days")
      .select("completed_count")
      .eq("user_id", context.userId)
      .eq("day", day)
      .maybeSingle();
    const next = (existing?.completed_count ?? 0) + 1;
    const { error } = await context.supabase
      .from("study_pomodoro_days")
      .upsert(
        { user_id: context.userId, day, completed_count: next },
        { onConflict: "user_id,day" },
      );
    if (error) throw new Error(error.message);
    return { day, completed: next };
  });

/* =============== Daily plan =============== */

const planSchema = z.object({
  plan: z.object({
    motivation: z.string(),
    recommendations: z.array(z.string()),
    schedule: z.array(z.object({
      start: z.string(),
      end: z.string(),
      kind: z.enum(["study", "break-short", "break-long"]),
      task: z.string(),
    })),
    closing: z.string(),
  }),
  inputs: z.record(z.string(), z.unknown()).optional(),
});

export const getTodayPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const day = today();
    const { data, error } = await context.supabase
      .from("study_daily_plans")
      .select("plan, inputs, day")
      .eq("user_id", context.userId)
      .eq("day", day)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const saveTodayPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => planSchema.parse(input))
  .handler(async ({ data, context }) => {
    const day = today();
    const { error } = await context.supabase
      .from("study_daily_plans")
      .upsert(
        { user_id: context.userId, day, plan: data.plan as never, inputs: (data.inputs ?? null) as never },
        { onConflict: "user_id,day" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
