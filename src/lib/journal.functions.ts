import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CreateSchema = z.object({
  mood: z.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1).max(5000),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
});

export const createJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error, data: row } = await supabase
      .from("journal_entries")
      .insert({
        user_id: userId,
        mood: data.mood,
        title: data.title ?? null,
        content: data.content,
        tags: data.tags,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const listJournalEntries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, mood, title, content, tags, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { entries: data ?? [] };
  });

export const deleteJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase.from("journal_entries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
