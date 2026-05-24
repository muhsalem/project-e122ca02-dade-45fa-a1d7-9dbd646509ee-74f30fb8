import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Check, Loader2, ThumbsUp, MessageSquare } from "lucide-react";
import { submitCoachRating, getCoachRatingsSummary } from "@/lib/coach-rating.functions";

export const Route = createFileRoute("/rate-coach")({
  head: () => ({
    meta: [
      { title: "قيّم المرشد أو الكوتش — بوصلة" },
      { name: "description", content: "شارك تجربتك بعد الجلسة وقيّم المرشد أو الكوتش لمساعدة الآخرين." },
    ],
  }),
  component: RateCoachPage,
});

const COACHES = ["د. سارة المنصور", "أ. خالد الرشيد", "د. ليلى الأحمد"];

type Summary = { coach_name: string; count: number; avg: number; recommend_pct: number };
type Recent = { coach_name: string; overall: number; comment: string | null; reviewer_name: string | null; created_at: string };

function RateCoachPage() {
  const submit = useServerFn(submitCoachRating);
  const fetchSummary = useServerFn(getCoachRatingsSummary);

  const [coach, setCoach] = useState<string>(COACHES[0]);
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

  const loadSummary = async () => {
    try {
      const res = await fetchSummary({});
      setSummary(res.summary as Summary[]);
      setRecent(res.recent as Recent[]);
    } catch {}
  };
  useEffect(() => { loadSummary(); }, []);

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

  if (done) {
    return (
      <section className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-primary">شكرًا لك</h1>
          <p className="mt-3 text-muted-foreground">تم تسجيل تقييمك، رأيك يساعد غيرك على الاختيار الصحيح.</p>
          <button onClick={() => { setDone(false); setOverall(0); setClarity(0); setProfessionalism(0); setUsefulness(0); setComment(""); }} className="mt-6 rounded-md border border-border px-4 py-2 text-sm">
            إضافة تقييم آخر
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Star className="h-3.5 w-3.5 text-gold" />
            تقييم ما بعد الجلسة
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">قيّم المرشد أو الكوتش</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            شاركنا تجربتك بعد الجلسة لتساعد الآخرين على اختيار المرشد الأنسب ولتطوير جودة الخدمة.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div>
            <label className="text-sm font-medium text-primary">المرشد / الكوتش</label>
            <select value={coach} onChange={(e) => setCoach(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {COACHES.map((c) => <option key={c} value={c}>{c}</option>)}
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
                    <span className="flex items-center gap-0.5 text-gold">{Array.from({ length: r.overall }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}</span>
                  </div>
                  <p className="mt-2 text-foreground/90">{r.comment}</p>
                </li>
              ))}
              {recent.filter(r => r.comment).length === 0 && <li className="text-xs text-muted-foreground">لا توجد تعليقات بعد.</li>}
            </ul>
          </div>
        </aside>
      </section>
    </>
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
