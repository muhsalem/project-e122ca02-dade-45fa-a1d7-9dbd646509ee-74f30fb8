import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  photo_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  bio: z.string().trim().min(40).max(2000),
  specializations: z.array(z.string().min(1).max(60)).min(1).max(10),
  certifications: z.string().trim().max(1000).optional().or(z.literal("")),
  experience_years: z.number().int().min(0).max(80),
  hourly_price: z.number().min(0).max(100000).optional().nullable(),
  currency: z.enum(["SAR", "AED", "EGP", "USD", "EUR", "KWD", "QAR", "OMR", "BHD", "JOD"]).default("SAR"),
  languages: z.array(z.string().min(1).max(40)).min(1).max(8),
  linkedin_url: z.string().trim().url().max(300).optional().or(z.literal("")),
  website_url: z.string().trim().url().max(300).optional().or(z.literal("")),
});

export const submitCoachApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      city: data.city || null,
      photo_url: data.photo_url || null,
      bio: data.bio,
      specializations: data.specializations,
      certifications: data.certifications || null,
      experience_years: data.experience_years,
      hourly_price: data.hourly_price ?? null,
      currency: data.currency,
      languages: data.languages,
      linkedin_url: data.linkedin_url || null,
      website_url: data.website_url || null,
    };

    const { data: row, error } = await supabaseAdmin
      .from("coaches")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("Coach insert error:", error);
      throw new Error("تعذّر حفظ الطلب. حاول مرة أخرى.");
    }

    return { id: row.id, status: "pending" as const };
  });

export const listApprovedCoaches = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("coaches")
      .select("id, full_name, photo_url, country, city, bio, specializations, experience_years, hourly_price, currency, languages, linkedin_url, website_url")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("List coaches error:", error);
      return { coaches: [] };
    }
    return { coaches: data ?? [] };
  });
