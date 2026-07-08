import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const getAdminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [
      profiles,
      bookings,
      poia,
      wellbeing,
      clarity,
      learningDna,
      journal,
      plans,
      reports,
      coaches,
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("bookings").select("id, status, created_at, price_amount"),
      supabaseAdmin.from("poia_submissions").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("wellbeing_screenings").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("clarity_scores").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("learning_dna_submissions").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("journal_entries").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("career_plans").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("assessment_reports").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("coaches").select("id", { count: "exact", head: true }),
    ]);

    const bookingsRows = (bookings.data ?? []) as Array<{
      status: string;
      created_at: string;
      price_amount: number | null;
    }>;

    const now = Date.now();
    const last30 = bookingsRows.filter(
      (b) => now - new Date(b.created_at).getTime() < 30 * 24 * 3600 * 1000,
    );

    const bookingsByStatus = bookingsRows.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    }, {});

    const revenue = bookingsRows
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (Number(b.price_amount) || 0), 0);

    const totalAssessments =
      (poia.count ?? 0) +
      (wellbeing.count ?? 0) +
      (clarity.count ?? 0) +
      (learningDna.count ?? 0);

    return {
      users: profiles.count ?? 0,
      totalAssessments,
      assessments: {
        poia: poia.count ?? 0,
        wellbeing: wellbeing.count ?? 0,
        clarity: clarity.count ?? 0,
        learningDna: learningDna.count ?? 0,
      },
      journal: journal.count ?? 0,
      plans: plans.count ?? 0,
      reports: reports.count ?? 0,
      coaches: coaches.count ?? 0,
      bookings: {
        total: bookingsRows.length,
        last30: last30.length,
        byStatus: bookingsByStatus,
        revenue,
      },
    };
  });
