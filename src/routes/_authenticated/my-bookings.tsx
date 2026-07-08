import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, X, Edit3, Bell, Check, Loader2 } from "lucide-react";
import { listMyBookings, cancelBooking, updateBookingSchedule, type BookingDTO } from "@/lib/bookings.functions";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  head: () => ({
    meta: [
      { title: "حجوزاتي — بوصلة" },
      { name: "description", content: "تابع جلساتك القادمة والسابقة، ألغِ الحجز أو أعد جدولته، وفعّل التذكيرات." },
    ],
  }),
  component: MyBookingsPage,
});

function bookingDate(b: BookingDTO): Date {
  return new Date(`${b.session_date}T${b.session_time}:00`);
}

function MyBookingsPage() {
  const list = useServerFn(listMyBookings);
  const cancel = useServerFn(cancelBooking);
  const reschedule = useServerFn(updateBookingSchedule);
  const [items, setItems] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [perm, setPerm] = useState<NotificationPermission>("default");

  const refresh = () => list().then(setItems);

  useEffect(() => {
    list().then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
    if (typeof window !== "undefined" && "Notification" in window) {
      setPerm(Notification.permission);
    }
  }, [list]);

  const now = Date.now();
  const upcoming = items
    .filter((b) => b.status === "confirmed" && bookingDate(b).getTime() >= now)
    .sort((a, b) => bookingDate(a).getTime() - bookingDate(b).getTime());
  const past = items
    .filter((b) => b.status !== "confirmed" || bookingDate(b).getTime() < now)
    .sort((a, b) => bookingDate(b).getTime() - bookingDate(a).getTime());

  const onCancel = async (id: string) => {
    if (!confirm("هل تريد إلغاء هذا الحجز؟")) return;
    await cancel({ data: { id } });
    refresh();
  };

  const startEdit = (b: BookingDTO) => {
    setEditing(b.id);
    setNewDate(b.session_date);
    setNewTime(b.session_time);
  };

  const saveEdit = async (id: string) => {
    if (!newDate || !newTime) return;
    await reschedule({ data: { id, session_date: newDate, session_time: newTime } });
    setEditing(null);
    refresh();
  };

  const enableReminders = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPerm(p);
    if (p === "granted") {
      upcoming.forEach((b) => {
        const fireAt = bookingDate(b).getTime() - 30 * 60 * 1000;
        const delay = fireAt - Date.now();
        if (delay > 0 && delay < 2_147_000_000) {
          setTimeout(() => {
            try {
              new Notification("تذكير بجلسة بوصلة", {
                body: `جلستك مع ${b.coach_name} بعد 30 دقيقة (${b.session_time}).`,
                tag: `booking-${b.id}`,
              });
            } catch { /* ignore */ }
          }, delay);
        }
      });
    }
  };

  if (loading) {
    return (
      <section className="container-page py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">جارٍ تحميل حجوزاتك…</p>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-8 w-8 text-gold" />
            <h1 className="text-4xl text-primary md:text-5xl">حجوزاتي</h1>
          </div>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            تابع جلساتك القادمة والسابقة، ألغِ الحجز أو أعد جدولته، وفعّل تذكير المتصفح قبل الموعد.
          </p>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4 text-gold" />
            <span>التذكيرات: {perm === "granted" ? "مفعّلة ✓" : perm === "denied" ? "محظورة من المتصفح" : "غير مفعّلة"}</span>
          </div>
          {perm !== "granted" && (
            <button onClick={enableReminders} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
              فعّل تذكير قبل 30 دقيقة
            </button>
          )}
          <Link to="/booking" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">
            + احجز جلسة جديدة
          </Link>
        </div>
      </section>

      <section className="container-page pb-8">
        <h2 className="font-serif text-2xl text-primary">الجلسات القادمة ({upcoming.length})</h2>
        <ul className="mt-4 space-y-3">
          {upcoming.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              لا توجد جلسات قادمة. <Link to="/booking" className="text-primary underline">احجز الآن</Link>
            </li>
          )}
          {upcoming.map((b) => (
            <li key={b.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-serif text-base text-primary">{b.coach_name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {b.session_date} — {b.session_time}
                  </div>
                  {b.notes && <p className="mt-2 text-xs text-foreground/70">{b.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(b)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <Edit3 className="h-3.5 w-3.5" /> إعادة جدولة
                  </button>
                  <button onClick={() => onCancel(b.id)} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                    <X className="h-3.5 w-3.5" /> إلغاء
                  </button>
                </div>
              </div>
              {editing === b.id && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="rounded-md border border-input bg-card px-3 py-2 text-sm" />
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-md border border-input bg-card px-3 py-2 text-sm" />
                  <button onClick={() => saveEdit(b.id)} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground hover:opacity-90">
                    <Check className="h-3.5 w-3.5" /> حفظ
                  </button>
                  <button onClick={() => setEditing(null)} className="rounded-md border border-border px-3 py-2 text-xs hover:bg-muted">إلغاء</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-16">
        <h2 className="font-serif text-2xl text-primary">السجل ({past.length})</h2>
        <ul className="mt-4 space-y-2">
          {past.length === 0 && <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">لا يوجد سجل بعد.</li>}
          {past.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
              <div>
                <span className="text-foreground/80">{b.coach_name}</span>
                <span className="mr-2 text-xs text-muted-foreground">— {b.session_date} {b.session_time}</span>
              </div>
              <span className={`text-xs ${b.status === "cancelled" ? "text-destructive" : "text-muted-foreground"}`}>
                {b.status === "cancelled" ? "ملغاة" : "منتهية"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
