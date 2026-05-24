import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Search,
  GraduationCap,
  Star,
  Check,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Globe,
  Linkedin,
  Briefcase,
  MapPin,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
} from "lucide-react";
import { listApprovedCoaches } from "@/lib/coach.functions";
import { submitCoachRating, getCoachRatingsSummary } from "@/lib/coach-rating.functions";

export const Route = createFileRoute("/counselor")({
  head: () => ({
    meta: [
      { title: "تعرف على الكوتشين والمرشدين المهنيين — بوصلة" },
      { name: "description", content: "تصفح دليل المرشدين والكوتشز المعتمدين، واطلع على تقييماتهم واحجز جلستك." },
    ],
  }),
  component: CounselorPage,
});

/* ================================================================ */
/* ======================= Page Shell ============================= */
/* ================================================================ */

function CounselorPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" />
            دليل المرشدين والكوتشز
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">
            تعرف على الكوتشين والمرشدين المهنيين
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            تصفح ملفات المرشدين والكوتشز المعتمدين، اطلع على تقييماتهم، واحجز جلستك المهنية بكل سهولة.
          </p>

          <div className="mt-5 flex justify-center">
            <Link
              to="/join-as-coach"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-primary to-gold px-5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <UserPlus className="h-3.5 w-3.5" />
              انضم كمرشد أو كوتش مهني
            </Link>
          </div>
        </div>
      </section>

      <DirectorySection />
      <BookingSection />
      <RatingsSection />
    </>
  );
}

/* ================================================================ */
/* ======================= Directory ============================== */
/* ================================================================ */

type CoachRow = {
  id: string;
  full_name: string;
  photo_url: string | null;
  country: string | null;
  city: string | null;
  bio: string;
  specializations: string[];
  experience_years: number;
  hourly_price: number | null;
  currency: string | null;
  languages: string[];
  linkedin_url: string | null;
  website_url: string | null;
};

function DirectorySection() {
  const fetchFn = useServerFn(listApprovedCoaches);
  const [coaches, setCoaches] = useState<CoachRow[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchFn({})
      .then((r) => setCoaches((r.coaches ?? []) as CoachRow[]))
      .catch(() => setCoaches([]));
  }, [fetchFn]);

  const filtered = (coaches ?? []).filter((c) => {
    if (!q.trim()) return true;
    const t = q.trim().toLowerCase();
    return (
      c.full_name.toLowerCase().includes(t) ||
      c.specializations.some((s) => s.toLowerCase().includes(t)) ||
      (c.country ?? "").toLowerCase().includes(t)
    );
  });

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-primary">دليل المرشدين والكوتشز المعتمدين</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              الملفات المعروضة هنا اجتازت مراجعة فريق بوصلة وأصبحت متاحة لاستقبال الحجوزات.
            </p>
          </div>
          <Link
            to="/join-as-coach"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            <UserPlus className="h-3.5 w-3.5" />
            انضم للدليل
          </Link>
        </div>

        <div className="mb-5">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالاسم، التخصص، أو الدولة..."
              className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {coaches === null ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            لا يوجد مرشدون معتمدون في الدليل بعد. كن أول من ينضم عبر صفحة{" "}
            <Link to="/join-as-coach" className="text-primary underline-offset-2 hover:underline">
              انضم كمرشد
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <article key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <header className="flex items-start gap-4">
                  {c.photo_url ? (
                    <img src={c.photo_url} alt={c.full_name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-primary">{c.full_name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {(c.country || c.city) && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {[c.city, c.country].filter(Boolean).join("، ")}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {c.experience_years} سنة خبرة
                      </span>
                      {c.hourly_price != null && (
                        <span className="font-medium text-gold">
                          {c.hourly_price} {c.currency ?? "SAR"} / جلسة
                        </span>
                      )}
                    </div>
                  </div>
                </header>

                <p className="mt-3 line-clamp-3 text-sm text-foreground/90">{c.bio}</p>

                {c.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.specializations.slice(0, 6).map((s) => (
                      <span key={s} className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[11px] text-foreground/80">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <footer className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    {c.languages.length > 0 ? c.languages.join(" · ") : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    {c.linkedin_url && (
                      <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary" aria-label="LinkedIn">
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {c.website_url && (
                      <a href={c.website_url} target="_blank" rel="noreferrer" className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary" aria-label="الموقع">
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90"
                    >
                      احجز جلسة
                    </Link>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================ */
/* ======================= Ratings ================================ */
/* ================================================================ */

type Summary = { coach_name: string; count: number; avg: number; recommend_pct: number };
type Recent = { coach_name: string; overall: number; comment: string | null; reviewer_name: string | null; created_at: string };

function RatingsSection() {
  const submit = useServerFn(submitCoachRating);
  const fetchSummary = useServerFn(getCoachRatingsSummary);
  const fetchCoaches = useServerFn(listApprovedCoaches);

  const [coachOptions, setCoachOptions] = useState<string[]>([]);
  const [coach, setCoach] = useState<string>("");

  const [overall, setOverall] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [usefulness, setUsefulness] = useState(0);
  const [recommend, setRecommend] = useState(true);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<Summary[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [open, setOpen] = useState(false);

  const loadSummary = async () => {
    try {
      const res = await fetchSummary({});
      setSummary(res.summary as Summary[]);
      setRecent(res.recent as Recent[]);
    } catch {}
  };
  useEffect(() => { loadSummary(); }, []);

  useEffect(() => {
    fetchCoaches({})
      .then((r) => {
        const names = (r.coaches ?? []).map((c: { full_name: string }) => c.full_name);
        if (names.length > 1) {
          setCoachOptions(names);
          setCoach(names[0]);
        } else if (names.length === 1) {
          setCoachOptions(names);
          setCoach(names[1]);
        }
      })
      .catch(() => {});
  }, [fetchCoaches]);

  const canSubmit = overall > 0 && clarity > 0 && professionalism > 0 && usefulness > 0 && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await submit({ data: {
        coach_name: coach, overall, clarity, professionalism, usefulness,
        would_recommend: recommend,
        comment: comment.trim() || null,
        reviewer_name: name.trim() || null,
        reviewer_email: email.trim() || null,
        session_date: date || null,
      }});
      setDone(true);
      await loadSummary();
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDone(false);
    setOverall(0);
    setClarity(0);
    setProfessionalism(0);
    setUsefulness(0);
    setComment("");
  };

  return (
    <section className="container-page pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex w-full items-center justify-between px-6 py-4 text-right hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-lg text-primary">تقييمات المرشدين والكوتشز</h2>
            </div>
            {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </button>

          {open && (
            <div className="border-t border-border px-6 pb-6">
              {done ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-primary">شكرًا لك</h3>
                  <p className="mt-3 text-muted-foreground">تم تسجيل تقييمك، رأيك يساعد غيرك على الاختيار الصحيح.</p>
                  <button onClick={resetForm} className="mt-6 rounded-md border border-border px-4 py-2 text-sm">
                    إضافة تقييم آخر
                  </button>
                </div>
              ) : (
                <div className="grid gap-8 pt-6 lg:grid-cols-3">
                  <form onSubmit={onSubmit} className="space-y-6 lg:col-span-2">
                    <div>
                      <label className="text-sm font-medium text-primary">المرشد / الكوتش</label>
                      <select value={coach} onChange={(e) => setCoach(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        {coachOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <StarRow label="التقييم العام" value={overall} onChange={setOverall} />
                    <StarRow label="وضوح الشرح" value={clarity} onChange={setClarity} />
                    <StarRow label="الاحترافية والالتزام" value={professionalism} onChange={setProfessionalism} />
                    <StarRow label="مدى الاستفادة" value={usefulness} onChange={setUsefulness} />

                    <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 p-3">
                      <input id="rec" type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} className="h-4 w-4" />
                      <label htmlFor="rec" className="text-sm">أنصح الآخرين بهذا المرشد</label>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary">تعليقك (اختياري)</label>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={4} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="ما الذي أعجبك؟ وما الذي يمكن تحسينه؟" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-xs text-muted-foreground">اسمك (اختياري)</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">البريد (اختياري)</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">تاريخ الجلسة</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                    </div>

                    {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                    <button type="submit" disabled={!canSubmit} className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                      إرسال التقييم
                    </button>
                  </form>

                  <aside className="space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                      <h2 className="flex items-center gap-2 font-serif text-lg text-primary">
                        <ThumbsUp className="h-4 w-4 text-gold" />
                        متوسطات المرشدين
                      </h2>
                      <ul className="mt-3 space-y-3">
                        {summary.length === 0 && <li className="text-xs text-muted-foreground">لا توجد تقييمات بعد.</li>}
                        {summary.map((s) => (
                          <li key={s.coach_name} className="rounded-md border border-border p-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{s.coach_name}</span>
                              <span className="flex items-center gap-1 text-gold"><Star className="h-3.5 w-3.5 fill-current" />{s.avg}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                              <span>{s.count} تقييم</span>
                              <span>{s.recommend_pct}% يوصون</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                      <h2 className="flex items-center gap-2 font-serif text-lg text-primary">
                        <MessageSquare className="h-4 w-4 text-gold" />
                        أحدث التعليقات
                      </h2>
                      <ul className="mt-3 space-y-3">
                        {recent.filter(r => r.comment).slice(0, 5).map((r, i) => (
                          <li key={i} className="rounded-md border border-border p-3 text-sm">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{r.reviewer_name ?? "زائر"} · {r.coach_name}</span>
                              <span className="flex items-center gap-1 text-gold">{Array.from({ length: r.overall }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}</span>
                            </div>
                            <p className="mt-2 text-foreground/90">{r.comment}</p>
                          </li>
                        ))}
                        {recent.filter(r => r.comment).length === 0 && <li className="text-xs text-muted-foreground">لا توجد تعليقات بعد.</li>}
                      </ul>
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const fetchCoaches = useServerFn(listApprovedCoaches);
  const [open, setOpen] = useState(false);
  const [coachOptions, setCoachOptions] = useState<{ id: string; name: string }[]>([]);
  const [coach, setCoach] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  useEffect(() => {
    fetchCoaches({})
      .then((r) => {
        const list = (r.coaches ?? []).map((c: { id: string; full_name: string }) => ({ id: c.id, name: c.full_name }));
        setCoachOptions(list);
        if (list.length > 0) setCoach(list[0].name);
      })
      .catch(() => {});
  }, [fetchCoaches]);

  const canSubmit = coach && date && time && name.trim() && email.trim();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setDone(true);
  };

  const reset = () => {
    setDone(false);
    setDate(""); setTime(""); setName(""); setEmail(""); setPhone(""); setNotes("");
  };

  return (
    <section className="container-page pb-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex w-full items-center justify-between px-6 py-4 text-right hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-lg text-primary">احجز جلسة مع مرشد أو كوتش مهني</h2>
            </div>
            {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </button>

          {open && (
            <div className="border-t border-border px-6 pb-6 pt-6">
              {done ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-primary">تم استلام طلب الحجز</h3>
                  <p className="mt-3 text-muted-foreground">
                    سنتواصل معك خلال 24 ساعة لتأكيد جلستك مع <span className="font-semibold text-primary">{coach}</span> بتاريخ {date} الساعة {time}.
                  </p>
                  <button onClick={reset} className="mt-6 rounded-md border border-border px-4 py-2 text-sm">حجز جلسة أخرى</button>
                </div>
              ) : coachOptions.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  لا يوجد مرشدون معتمدون للحجز حاليًا.
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary">المرشد / الكوتش</label>
                    <select value={coach} onChange={(e) => setCoach(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {coachOptions.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> التاريخ</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> الوقت</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TIMES.map((t) => (
                        <button key={t} type="button" onClick={() => setTime(t)}
                          className={`rounded-md border px-3 py-1.5 text-xs ${time === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">الاسم</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">البريد الإلكتروني</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground">رقم الجوال (اختياري)</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground">ملاحظات (اختياري)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="حدثنا باختصار عن هدفك من الجلسة" />
                  </div>

                  <div className="md:col-span-2">
                    <button type="submit" disabled={!canSubmit} className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40">
                      <Calendar className="h-4 w-4" /> تأكيد طلب الحجز
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StarRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">{label}</label>
        <span className="text-xs text-muted-foreground">{value > 0 ? `${value}/5` : "—"}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} نجوم`} className="rounded p-1 transition-transform hover:scale-110">
            <Star className={`h-7 w-7 ${n <= value ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
