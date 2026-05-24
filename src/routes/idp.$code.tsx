import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateIDP, getIDPByReport } from "@/lib/idp.functions";
import { ContentProtection } from "@/components/site/ContentProtection";
import { Target, BookOpen, Calendar, TrendingUp, Award, Loader2 } from "lucide-react";

export const Route = createFileRoute("/idp/$code")({
  head: () => ({
    meta: [
      { title: "خطة التطوير الفردية — بوصلة" },
      { name: "description", content: "خطة تطوير 90 يوم مبنية على نتائج تقييمك المهني." },
    ],
  }),
  component: IDPPage,
});

type Plan = {
  career_goal: string;
  current_stage: string | null;
  milestones: Array<{ week: number; title: string; description: string; deliverable: string; status?: string }>;
  skills_to_develop: Array<{ skill: string; priority: string; current_level: number; target_level: number; rationale: string }>;
  recommended_courses: Array<{ title: string; provider: string; url_hint: string; duration_hours: number; skill_addressed: string }>;
  weekly_actions: Array<{ day: string; action: string }>;
  success_metrics: string | null;
};

function IDPPage() {
  const { code } = useParams({ from: "/idp/$code" });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const get = useServerFn(getIDPByReport);
  const gen = useServerFn(generateIDP);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await get({ data: { report_code: code } });
        if (cancel) return;
        if (r.plan) { setPlan(r.plan as any); setLoading(false); }
        else {
          setGenerating(true);
          const np = await gen({ data: { report_code: code } });
          if (!cancel) { setPlan(np as any); setLoading(false); setGenerating(false); }
        }
      } catch (e: any) {
        if (!cancel) { setError(e?.message ?? "خطأ"); setLoading(false); setGenerating(false); }
      }
    })();
    return () => { cancel = true; };
  }, [code, get, gen]);

  if (loading) {
    return (
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
        <p className="mt-4 text-muted-foreground">{generating ? "جارٍ توليد خطة التطوير الفردية… قد يستغرق 30 ثانية" : "جارٍ التحميل…"}</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="container-page py-20 text-center">
        <p className="text-destructive">{error}</p>
        <Link to="/report/$code" params={{ code }} className="mt-4 inline-block text-primary underline">العودة للتقرير</Link>
      </section>
    );
  }
  if (!plan) return null;

  return (
    <>
      <ContentProtection />
      <section className="container-page py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Target className="mx-auto h-10 w-10 text-gold" />
            <h1 className="mt-4 text-3xl text-primary md:text-4xl">خطة التطوير الفردية (IDP)</h1>
            <p className="mt-2 text-sm text-muted-foreground">مرتبطة بتقرير: <code className="rounded bg-secondary px-2 py-0.5">{code}</code></p>
          </div>

          {/* Goal */}
          <div className="mt-10 rounded-2xl border-2 border-gold/30 bg-card p-6">
            <p className="font-serif text-xs uppercase tracking-widest text-gold">الهدف المهني</p>
            <p className="mt-2 text-xl font-medium leading-9 text-primary">{plan.career_goal}</p>
            {plan.current_stage && <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.current_stage}</p>}
          </div>

          {/* Milestones */}
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-primary">
              <Calendar className="h-5 w-5 text-gold" /> المعالم الأسبوعية (12 أسبوعاً)
            </h2>
            <div className="space-y-3">
              {plan.milestones.map((m, i) => (
                <div key={i} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif font-bold text-primary">{m.week}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-primary">{m.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                    <p className="mt-2 text-xs"><strong>الناتج المتوقع:</strong> {m.deliverable}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-primary">
              <TrendingUp className="h-5 w-5 text-gold" /> مهارات يجب تطويرها
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {plan.skills_to_develop.map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-primary">{s.skill}</h3>
                    <span className={`rounded px-2 py-0.5 text-xs ${s.priority === "high" ? "bg-destructive/15 text-destructive" : s.priority === "medium" ? "bg-amber-500/15 text-amber-700" : "bg-secondary text-muted-foreground"}`}>
                      {s.priority === "high" ? "عالي" : s.priority === "medium" ? "متوسط" : "منخفض"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{s.rationale}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span>الحالي: <strong>{s.current_level}/5</strong></span>
                    <span>←</span>
                    <span>المستهدف: <strong className="text-gold">{s.target_level}/5</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-primary">
              <BookOpen className="h-5 w-5 text-gold" /> كورسات مقترحة
            </h2>
            <div className="space-y-3">
              {plan.recommended_courses.map((c, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-medium text-primary">{c.title}</h3>
                    <span className="text-xs text-muted-foreground">{c.provider} · {c.duration_hours} ساعة</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">للمهارة: {c.skill_addressed}</p>
                  <p className="mt-2 text-xs">ابحث عن: <code className="rounded bg-secondary px-1.5 py-0.5">{c.url_hint}</code></p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly routine */}
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-primary">
              <Calendar className="h-5 w-5 text-gold" /> روتينك الأسبوعي
            </h2>
            <div className="grid gap-2 md:grid-cols-7">
              {plan.weekly_actions.map((w, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3 text-center">
                  <p className="font-serif text-sm font-bold text-gold">{w.day}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{w.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Success metrics */}
          {plan.success_metrics && (
            <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6">
              <h2 className="mb-3 flex items-center gap-2 font-serif text-xl text-primary">
                <Award className="h-5 w-5 text-gold" /> مؤشرات النجاح بعد 90 يوماً
              </h2>
              <p className="text-sm leading-8 text-muted-foreground">{plan.success_metrics}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/clarity-check" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
              قِس وضوحك بعد التطبيق
            </Link>
            <Link to="/booking" className="rounded-md border border-primary/30 bg-card px-6 py-3 text-sm font-medium text-primary hover:bg-secondary">
              احجز جلسة لمراجعة الخطة
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
