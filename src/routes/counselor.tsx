import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Users,
  Loader2,
  ExternalLink,
  Search,
  GraduationCap,
  Star,
  Check,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  ClipboardList,
  UserPlus,
  Globe,
  Linkedin,
  Briefcase,
  MapPin,
} from "lucide-react";
import { getCohortReports } from "@/lib/counselor.functions";
import { submitCoachRating, getCoachRatingsSummary } from "@/lib/coach-rating.functions";
import { listApprovedCoaches } from "@/lib/coach.functions";

export const Route = createFileRoute("/counselor")({
  head: () => ({
    meta: [
      { title: "لوحة المرشد والمدرسة — بوصلة" },
      { name: "description", content: "تابع تقارير مجموعة الطلاب، استعرض دليل المرشدين والكوتشز، واطلع على تقييماتهم." },
    ],
  }),
  component: CounselorPage,
});

type Tab = "cohort" | "directory" | "ratings";


function CounselorPage() {
  const [tab, setTab] = useState<Tab>("cohort");

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" />
            لوحة المرشد / المدرسة
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">أدوات المتابعة والتقييم</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            اختر ما بين متابعة مجموعات الطلاب عبر كود المجموعة، أو مراجعة تقييمات المرشدين والكوتشز من الطلاب.
          </p>

          <div className="mx-auto mt-8 flex max-w-md justify-center gap-2 rounded-xl border border-border bg-background/60 p-1.5 backdrop-blur-sm">
            <TabButton active={tab === "cohort"} onClick={() => setTab("cohort")} icon={<ClipboardList className="h-4 w-4" />} label="متابعة المجموعات" />
            <TabButton active={tab === "ratings"} onClick={() => setTab("ratings")} icon={<BarChart3 className="h-4 w-4" />} label="تقييمات المرشدين" />
          </div>
        </div>
      </section>

      {tab === "cohort" ? <CohortTab /> : <RatingsTab />}
    </>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================= Cohort Tab ================= */
type Row = { code: string; name: string | null; age: string | null; stage: string | null; created_at: string };

function CohortTab() {
  const fetchFn = useServerFn(getCohortReports);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ data: { group_code: c } });
      setRows(res.rows as Row[]);
    } catch (e: any) {
      setError(e?.message ?? "خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <label className="flex items-center gap-2 text-sm font-medium text-primary">
            <Users className="h-4 w-4 text-gold" />
            كود المجموعة
          </label>
          <div className="mt-3 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && search()}
              maxLength={32}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
              placeholder="مثال: SCHOOL-2026-A"
            />
            <button
              onClick={search}
              disabled={loading || !code.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              بحث
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            الكود يقبل أحرفًا إنجليزية كبيرة وأرقامًا و(-_) فقط. شاركه بنفسك مع طلابك — لا يُولّد تلقائيًا.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {rows && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-primary">النتائج ({rows.length})</h2>
              {rows.length > 0 && <span className="text-xs text-muted-foreground">آخر تحديث الآن</span>}
            </div>

            {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                لا توجد تقارير مرتبطة بهذا الكود حتى الآن. تأكد من مشاركة الكود الصحيح مع طلابك.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-right">الاسم</th>
                      <th className="px-4 py-3 text-right">العمر</th>
                      <th className="px-4 py-3 text-right">المرحلة</th>
                      <th className="px-4 py-3 text-right">كود التقرير</th>
                      <th className="px-4 py-3 text-right">التاريخ</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.code} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{r.name ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.age ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.stage ?? "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs text-primary">{r.code}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="px-4 py-3 text-left">
                          <Link
                            to="/report/$code"
                            params={{ code: r.code }}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
                          >
                            فتح
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= Ratings Tab ================= */
const COACHES = ["د. سارة المنصور", "أ. خالد الرشيد", "د. ليلى الأحمد"];

type Summary = { coach_name: string; count: number; avg: number; recommend_pct: number };
type Recent = { coach_name: string; overall: number; comment: string | null; reviewer_name: string | null; created_at: string };

function RatingsTab() {
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

  const resetForm = () => {
    setDone(false);
    setOverall(0);
    setClarity(0);
    setProfessionalism(0);
    setUsefulness(0);
    setComment("");
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
          <button onClick={resetForm} className="mt-6 rounded-md border border-border px-4 py-2 text-sm">
            إضافة تقييم آخر
          </button>
        </div>
      </section>
    );
  }

  return (
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
