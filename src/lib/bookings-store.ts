// تخزين محلي لحجوزات الجلسات + جدولة تذكير متصفح قبل الموعد.
// MVP بدون خادم — يحفظ في localStorage ويرسل إشعار قبل 30 دقيقة.

export type Booking = {
  id: string;
  coachId: string;
  coachName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: "confirmed" | "cancelled";
  remindAt?: number; // epoch ms
  createdAt: number;
};

const KEY = "bosla:bookings:v1";

export function listBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Booking[];
  } catch {
    return [];
  }
}

export function saveBookings(items: Booking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addBooking(b: Omit<Booking, "id" | "status" | "createdAt">): Booking {
  const item: Booking = { ...b, id: `${Date.now()}`, status: "confirmed", createdAt: Date.now() };
  const list = listBookings();
  list.push(item);
  saveBookings(list);
  scheduleReminderFor(item);
  return item;
}

export function updateBooking(id: string, patch: Partial<Booking>) {
  const list = listBookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
  saveBookings(list);
  const updated = list.find((b) => b.id === id);
  if (updated && updated.status === "confirmed") scheduleReminderFor(updated);
}

export function cancelBooking(id: string) {
  updateBooking(id, { status: "cancelled" });
}

export function bookingDateTime(b: Booking): Date {
  return new Date(`${b.date}T${b.time}:00`);
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") return Notification.permission;
  return Notification.requestPermission();
}

const timers: Record<string, ReturnType<typeof setTimeout>> = {};

export function scheduleReminderFor(b: Booking, minutesBefore = 30) {
  if (typeof window === "undefined") return;
  if (b.status !== "confirmed") return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const fireAt = bookingDateTime(b).getTime() - minutesBefore * 60 * 1000;
  const delay = fireAt - Date.now();
  if (delay <= 0 || delay > 2_147_000_000) return; // setTimeout max ~24.8 days
  if (timers[b.id]) clearTimeout(timers[b.id]);
  timers[b.id] = setTimeout(() => {
    try {
      new Notification("تذكير بجلسة بوصلة", {
        body: `جلستك مع ${b.coachName} بعد ${minutesBefore} دقيقة (${b.time}).`,
        tag: `booking-${b.id}`,
      });
    } catch {
      // ignore
    }
  }, delay);
}

export function scheduleAllReminders() {
  listBookings().forEach((b) => scheduleReminderFor(b));
}
