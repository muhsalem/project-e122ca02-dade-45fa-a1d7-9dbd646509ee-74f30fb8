import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

const LICENSE_STATUS = [
  "commercial_ok",
  "research_only",
  "permission_required",
  "proprietary",
  "deprecated",
] as const;

// ============ SCALES ============

export const listScales = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [scales, versions, items, sources] = await Promise.all([
      supabaseAdmin.from("psych_scales").select("*").order("code"),
      supabaseAdmin.from("psych_scale_versions").select("*").order("released_at", { ascending: false }),
      supabaseAdmin.from("psych_scale_items").select("*").order("sort_order"),
      supabaseAdmin.from("psych_scale_sources").select("*").order("created_at", { ascending: false }),
    ]);
    if (scales.error) throw new Error(scales.error.message);
    return {
      scales: scales.data ?? [],
      versions: versions.data ?? [],
      items: items.data ?? [],
      sources: sources.data ?? [],
    };
  });

const scaleSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1).max(80),
  name_ar: z.string().min(1),
  name_en: z.string().optional().nullable(),
  license: z.string().min(1),
  license_status: z.enum(LICENSE_STATUS),
  source_org: z.string().optional().nullable(),
  source_url: z.string().url().optional().nullable().or(z.literal("")),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const upsertScale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => scaleSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, source_url: data.source_url || null };
    const { data: row, error } = data.id
      ? await supabaseAdmin.from("psych_scales").update(payload).eq("id", data.id).select().single()
      : await supabaseAdmin.from("psych_scales").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteScale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("psych_scales").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ VERSIONS ============

const versionSchema = z.object({
  id: z.string().uuid().optional(),
  scale_id: z.string().uuid(),
  version: z.string().min(1).max(40),
  changelog: z.string().optional().nullable(),
  released_at: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
});

export const upsertVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => versionSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, released_at: data.released_at || null };
    if (data.is_current) {
      await supabaseAdmin
        .from("psych_scale_versions")
        .update({ is_current: false })
        .eq("scale_id", data.scale_id);
    }
    const { data: row, error } = data.id
      ? await supabaseAdmin.from("psych_scale_versions").update(payload).eq("id", data.id).select().single()
      : await supabaseAdmin.from("psych_scale_versions").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("psych_scale_versions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ITEMS ============

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  scale_id: z.string().uuid(),
  version_id: z.string().uuid().optional().nullable(),
  item_code: z.string().min(1).max(80),
  text_ar: z.string().min(1),
  text_en: z.string().optional().nullable(),
  dimension: z.string().optional().nullable(),
  reverse_scored: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const upsertItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => itemSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, version_id: data.version_id || null };
    const { data: row, error } = data.id
      ? await supabaseAdmin.from("psych_scale_items").update(payload).eq("id", data.id).select().single()
      : await supabaseAdmin.from("psych_scale_items").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("psych_scale_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ SOURCES ============

const sourceSchema = z.object({
  id: z.string().uuid().optional(),
  scale_id: z.string().uuid(),
  citation: z.string().min(1),
  url: z.string().url().optional().nullable().or(z.literal("")),
  license_ref: z.string().optional().nullable(),
  retrieved_at: z.string().optional().nullable(),
});

export const upsertSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => sourceSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, url: data.url || null, retrieved_at: data.retrieved_at || null };
    const { data: row, error } = data.id
      ? await supabaseAdmin.from("psych_scale_sources").update(payload).eq("id", data.id).select().single()
      : await supabaseAdmin.from("psych_scale_sources").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("psych_scale_sources").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
