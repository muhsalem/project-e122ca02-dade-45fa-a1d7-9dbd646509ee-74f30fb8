import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getReviewResults } from "@/lib/review360.functions";
import { ContentProtection } from "@/components/site/ContentProtection";
import { BarChart3, Users, Loader2, Sparkles, Lightbulb, Target } from "lucide-react";

export const Route = createFileRoute("/review-results/$code")({
  head: () => ({
    meta: [
      { title: "نتائج تقييم 360° — بوصلة" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

const LABELS: Record<string, string> = {
  strengths: "نقاط القوة العامة",
  communication: "مهارات التواصل",
  responsibility: "تحمّل المسؤولية",
  leadership: "القيادة والمبادرة",
  problem_solving: "حل المشكلات",
  teamwork: "العمل ضمن فريق",
  adaptability: "التكيّف مع التغيير",
  work_ethic: "الانضباط والأخلاقيات",
};
const RELATION_AR: Record<string, string> = {
  parent: "ولي أمر", teacher: "معلّم", peer: "زميل", manager: "مدير",
  mentor: "مرشد", friend: "صديق", other: "أخرى",
};

function ResultsPage() {
  const { code } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const get = useServerFn(getReviewResults);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await get({ data: { code } });
        if (!cancel) setData(r);
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "خطأ");
      }
    })();
    return () => { cancel = true; };
  }, [code, get]);

  if (err) return <div className="container-page py-20 text-center text-destructive">{err}</div>;
  if (!data) return <div className="container-page flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;

  if (data.count === 0) {
    return (
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Users className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary">لم يُكمل أحد التقييم بعد</h1>
          <p className="mt-3 text-muted-foreground">شارك رابط التقييم مع 3-7 أشخاص على الأقل ليعطوا نتيجة موثوقة.</p>
          <p className="mt-4 text-sm">رابط التقييم: <code className="rounded bg-secondary px-2 py-0.5">{typeof window !== "undefined" ? window.location.origin : ""}/review-submit/{code}</code></p>
        </div>
      </section>
    );
  }

  const max = 5;
  return (
    <>
      <ContentProtection />
      <section className="container-page py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-gold" />
            <h1 className="mt-4 text-3xl text-primary md:text-4xl">نتائج تقييمك 360°</h1>
            <p className="mt-2 text-sm text-muted-foreground">{data.request.subject_name} — استناداً إلى {data.count} مُقيِّم</p>
          </div>

          {/* Overall */}
          <div className="mt-10 rounded-2xl border-2 border-gold/40 bg-gold/5 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gold">المتوسط الكلي</p>
            <p className="mt-2 font-serif text-5xl font-bold text-primary">{data.overall}<span className="text-2xl text-muted-foreground">/5</span></p>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.overall >= 4.2 ? "تقييم استثنائي — تتمتع بحضور إيجابي قوي" :
                data.overall >= 3.5 ? "تقييم جيد جداً — قاعدة صلبة للبناء عليها" :
                data.overall >= 2.8 ? "تقييم متوسط — فرص واضحة للتطوير" :
                "يحتاج عملاً جدياً مع مرشد"}
            </p>
          </div>

          {/* Dimensions */}
          <div className="mt-10">
            <h2 className="mb-4 font-serif text-2xl text-primary">المتوسط حسب البُعد</h2>
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              {Object.entries(data.averages).map(([k, v]) => {
                const val = v as number;
                const pct = (val / max) * 100;
                return (
                  <div key={k}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground">{LABELS[k]}</span>
                      <span className="font-bold text-primary">{val}/5</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full rounded-full ${val >= 4 ? "bg-emerald-500" : val >= 3 ? "bg-gold" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Relations */}
          <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-6">
            <h2 className="mb-3 font-serif text-lg text-primary">توزيع المُقيِّمين (مجهول الهوية)</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.relations).map(([k, v]) => (
                <span key={k} className="rounded-full border border-border bg-card px-3 py-1 text-xs">
                  {RELATION_AR[k] ?? k}: <strong className="text-primary">{v as number}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Free text */}
          {data.strengths_texts.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-serif text-lg text-primary">
                <Sparkles className="h-5 w-5 text-gold" /> نقاط القوة كما يراها الآخرون
              </h2>
              <ul className="space-y-3 text-sm leading-7">
                {data.strengths_texts.map((t: string, i: number) => (
                  <li key={i} className="border-r-2 border-gold/40 bg-secondary/30 p-3 pr-4 text-muted-foreground">"{t}"</li>
                ))}
              </ul>
            </div>
          )}

          {data.improvement_texts.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-serif text-lg text-primary">
                <Lightbulb className="h-5 w-5 text-gold" /> فرص التطوير المقترحة
              </h2>
              <ul className="space-y-3 text-sm leading-7">
                {data.improvement_texts.map((t: string, i: number) => (
                  <li key={i} className="border-r-2 border-amber-500/40 bg-secondary/30 p-3 pr-4 text-muted-foreground">"{t}"</li>
                ))}
              </ul>
            </div>
          )}

          {data.career_suggestions.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-serif text-lg text-primary">
                <Target className="h-5 w-5 text-gold" /> مسارات مهنية مقترحة من المُقيِّمين
              </h2>
              <ul className="space-y-2 text-sm">
                {data.career_suggestions.map((t: string, i: number) => (
                  <li key={i} className="rounded-md bg-secondary/30 px-3 py-2 text-muted-foreground">• {t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
              ناقش هذه النتائج مع مرشد
            </Link>
            <Link to="/comprehensive-assessment" className="rounded-md border border-primary/30 bg-card px-6 py-3 text-sm font-medium text-primary hover:bg-secondary">
              قارنها مع تقييمك الذاتي
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
