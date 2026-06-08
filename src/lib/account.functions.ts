import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Delete the authenticated user's account and all associated personal data (PDPL/GDPR right to erasure). */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { audit } = await import("./security.server");

    // Best-effort delete of user-owned rows (RLS would also enforce, but we run as admin for cascade).
    const tables = [
      "assessment_reports",
      "wellbeing_screenings",
      "clarity_scores",
      "development_plans",
      "journal_entries",
      "review_requests",
      "review_responses",
      "coach_ratings",
      "profiles",
      "user_roles",
    ] as const;

    for (const t of tables) {
      const { error } = await supabaseAdmin.from(t).delete().eq("user_id", userId);
      if (error && !String(error.message).includes("does not exist")) {
        console.error(`delete ${t} failed:`, error.message);
      }
    }

    await audit({
      action: "account.delete",
      actorId: userId,
      targetType: "user",
      targetId: userId,
    });

    // Finally remove the auth user — invalidates all sessions immediately.
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authErr) {
      console.error("auth deleteUser failed:", authErr.message);
      throw new Error("تعذّر حذف الحساب. تواصل معنا على privacy@bosla.app");
    }

    return { ok: true };
  });
