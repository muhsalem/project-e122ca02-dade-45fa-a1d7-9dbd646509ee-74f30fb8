import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getReviewRequest, submitReview } from "@/lib/review360.functions";
import { toast } from "sonner";
import { Heart, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/review-submit/$code")({
  head: () => ({
    meta: [
      { title: "أكمل التقييم 360° — بوصلة" },
      { name: "description", content: "ساعد صديقك في فهم نقاط قوّته المهنية." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmitPage,
});

const DIMENSIONS = [
  { k: "strengths", l: "نقاط القوة العامة" },
  { k: "communication", l: "مهارات التواصل" },
  { k: "responsibility", l: "تحمّل المسؤولية" },
  { k: "leadership", l: "القيادة والمبادرة" },
  { k: "problem_solving", l: "حل المشكلات" },
  { k: "teamwork", l: "العمل ضمن فريق" },
  { k: "adaptability", l: "التكيّف مع التغيير" },
  { k: "work_ethic", l: "الانضباط والأخلاقيات" },
] as const;

const RELATIONS = [
  { v: "parent", l: "ولي أمر" },
  { v: "teacher", l: "معلّم / أستاذ" },
  { v: "peer", l: "زميل دراسة / عمل" },
  { v: "manager", l: "مدير سابق / حالي" },
  { v: "mentor", l: "مرشد / موجّه" },
  { v: "friend", l: "صديق مقرّب" },
  { v: "other", l: "أخرى" },
];

function SubmitPage() {
  const { code } = Route.useParams();
  const [subject, setSubject] = useState<string | null>(null);
  const [context, setContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relation, setRelation] = useState<string>("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [text, setText] = useState({ strengths_text: "", improvement_text: "", suggested_career: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const get = useServerFn(getReviewRequest);
  const send = useServerFn(submitReview);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await get({ data: { code } });
        if (cancel) return;
        if (!r.request) { setNotFound(true); }
        else { setSubject(r.request.subject_name); setContext(r.request.context); }
      } finally { if (!cancel) setLoading(false); }
    })();
    return () => { cancel = true; };
  }, [code, get]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!relation) { toast.error("حدد علاقتك بصاحب التقييم"); return; }
    if (DIMENSIONS.some((d) => !ratings[d.k])) { toast.error("أكمل تقييم جميع الأبعاد"); return; }
    setBusy(true);
    try {
      await send({ data: { request_code: code, reviewer_relation: relation as any, ...(ratings as any), ...text } });
      setDone(true);
    } catch (err: any) {
      toast.error(err?.message ?? "خطأ");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="container-page flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  if (notFound) return (
    <div className="container-page py-20 text-center">
      <h1 className="font-serif text-2xl text-primary">رابط التقييم غير صحيح أو منتهي</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">العودة للرئيسية</Link>
    </div>
  );

  if (done) return (
    <div className="container-page py-20 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
      <h1 className="mt-4 font-serif text-3xl text-primary">شكراً لك!</h1>
      <p className="mx-auto mt-3 max-w-md leading-8 text-muted-foreground">
        تم إرسال تقييمك بشكل مجهول إلى <strong>{subject}</strong>. ساهمت في مساعدته على فهم نفسه بشكل أفضل واتخاذ قرار مهني واعٍ.
      </p>
      <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-6 py-2.5 text-sm text-primary-foreground">استكشف بوصلة</Link>
    </div>
  );

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Heart className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">تقييم 360° لـ {subject}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            ردودك <strong>مجهولة الهوية تماماً</strong> ولن يعرف صاحب التقييم من أرسل ماذا. كن صادقاً وموضوعياً.
          </p>
          {context && (
            <p className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-xs italic leading-6 text-muted-foreground">
              "{context}"
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div>
            <label className="mb-2 block text-sm font-medium">علاقتك بـ {subject} *</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {RELATIONS.map((r) => (
                <button key={r.v} type="button" onClick={() => setRelation(r.v)}
                  className={`rounded-md border px-3 py-2 text-xs ${relation === r.v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {r.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-sm font-medium text-primary">قيّم {subject} في 8 أبعاد (1 = ضعيف جداً، 5 = ممتاز)</p>
            {DIMENSIONS.map((d) => (
              <div key={d.k} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">{d.l}</label>
                  {ratings[d.k] && <span className="font-bold text-gold">{ratings[d.k]}/5</span>}
                </div>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setRatings({ ...ratings, [d.k]: n })}
                      className={`flex-1 rounded-md border py-2 text-sm ${ratings[d.k] === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div>
              <label className="mb-2 block text-sm font-medium">أبرز 3 نقاط قوة تراها في {subject} (اختياري)</label>
              <textarea value={text.strengths_text} onChange={(e) => setText({ ...text, strengths_text: e.target.value })}
                rows={3} maxLength={1000}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">أبرز 3 نقاط تحسين (اختياري)</label>
              <textarea value={text.improvement_text} onChange={(e) => setText({ ...text, improvement_text: e.target.value })}
                rows={3} maxLength={1000}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">مسار مهني تراه مناسباً له/ها (اختياري)</label>
              <input value={text.suggested_career} onChange={(e) => setText({ ...text, suggested_career: e.target.value })}
                maxLength={300} placeholder="مثال: التصميم الإبداعي، الهندسة المدنية، التدريس..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <button type="submit" disabled={busy}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy ? "جارٍ الإرسال…" : "أرسل التقييم"}
          </button>
        </form>
      </div>
    </section>
  );
}
