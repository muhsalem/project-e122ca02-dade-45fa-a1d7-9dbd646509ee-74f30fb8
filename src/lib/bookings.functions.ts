import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type BookingDTO = {
  id: string;
  coach_id: string;
  coach_name: string;
  session_date: string;
  session_time: string;
  notes: string | null;
  status: "confirmed" | "cancelled";
  created_at: string;
};

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BookingDTO[]> => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("id, coach_id, coach_name, session_date, session_time, notes, status, created_at")
      .eq("user_id", context.userId)
      .order("session_date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as BookingDTO[];
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    coach_id: string;
    coach_name: string;
    session_date: string;
    session_time: string;
    notes?: string;
    contact_email?: string;
    contact_phone?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("bookings")
      .insert({
        user_id: context.userId,
        coach_id: data.coach_id,
        coach_name: data.coach_name,
        session_date: data.session_date,
        session_time: data.session_time,
        notes: data.notes ?? null,
        contact_email: data.contact_email ?? null,
        contact_phone: data.contact_phone ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateBookingSchedule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; session_date: string; session_time: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ session_date: data.session_date, session_time: data.session_time })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
