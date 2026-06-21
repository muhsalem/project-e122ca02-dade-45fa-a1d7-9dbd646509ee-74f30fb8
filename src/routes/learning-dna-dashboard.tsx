import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Brain, ArrowLeft, MessagesSquare, Sparkles } from "lucide-react";
import { listMyLearningDna } from "@/lib/learning-dna.functions";
import { METRIC_LABELS } from "@/lib/learning-dna-scoring";
import { LearningDnaRadar } from "@/components/site/LearningDnaRadar";
import { AXIS_LABELS } from "@/data/learning-dna-bank";

export const Route = createFileRoute("/learning-dna-dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة Learning DNA الشخصية | بوصلة" },
      { name: "description", content: "تابع تطوّر بصمتك التعليمية عبر الزمن مع رادار المؤشرات السبعة وتنبيهات ذكية." },
    ],
  }),
  component: DashboardPage,
});

type Row = Awaited<ReturnType<typeof listMyLearningDna>>[number];

function DashboardPage() {
  const fetchList = useServerFn(listMyLearningDna);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchList().then(setRows).catch((e) => setErr(e?.message ?? "تعذّر التحميل"));
  }, [fetchList]);

  if (err) return <div className="container-page py-10 text-sm text-destructive">{err}</div>;
  if (!rows) return <div className="container-page py-10 text-sm text-muted-foreground">جارٍ التحميل…</div>;

  if (rows.length === 0) {
    return (
      <section className="container-page py-12 text-center">
        <Brain className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-3 font-serif text-2xl text-primary">لا توجد نتائج بعد</h1>
        <p className="mt-2 text-sm text-muted-foreground">أكمل تقييم Learning DNA لتظهر لوحتك الشخصية.</p>
        <Link to="/learning-dna" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          ابدأ التقييم <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const latest = rows[rows.length - 1];
  const radarData = (Object.entries(METRIC_LABELS) as [keyof typeof METRIC_LABELS, string][])
    .map(([k, name]) => ({ name, value: Number((latest as any)[k.toLowerCase()] ?? 0) }));
  const axisData = (() => {
    const ax = (latest.dimension_scores as any)?.axisScores ?? {};
    return Object.entries(AXIS_LABELS).map(([k, name]) => ({ name, value: Number(ax[k] ?? 0) }));
  })();

  const focLow = Number(latest.foc ?? 0) < 50;

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl text-primary md:text-3xl">لوحة Learning DNA</h1>
            <p className="text-xs text-muted-foreground">
              آخر تقييم: {new Date(latest.created_at as any).toLocaleDateString("ar-EG")} —
              التصنيف: <b>{latest.band}</b>
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/learning-coach" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
              <MessagesSquare className="h-3.5 w-3.5" /> AI Coach
            </Link>
            <Link to="/learning-dna" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" /> إعادة التقييم
            </Link>
          </div>
        </header>

        {focLow && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-300">
            ⚠️ مؤشر التركيز (FOC) منخفض — جرّب جلسات Pomodoro 25/5 وقلِّل الإشعارات قبل المراجعة.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 font-serif text-base text-primary">المؤشرات السبعة</h2>
            <LearningDnaRadar data={radarData} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 font-serif text-base text-primary">المحاور الستة</h2>
            <LearningDnaRadar data={axisData} />
          </div>
        </div>

        {/* Trend */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 font-serif text-base text-primary">تطوّر المؤشرات عبر الزمن</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {(Object.entries(METRIC_LABELS) as [keyof typeof METRIC_LABELS, string][]).map(([k, name]) => {
              const series = rows.map((r) => Number((r as any)[k.toLowerCase()] ?? 0));
              return <Sparkline key={k} label={name} values={series} />;
            })}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/my-assessments" className="underline">عرض كل تقاريرك</Link>
        </div>
      </div>
    </section>
  );
}

function Sparkline({ label, values }: { label: string; values: number[] }) {
  const w = 220, h = 48, pad = 4;
  const max = Math.max(100, ...values);
  const min = 0;
  const pts = values.length === 0 ? "" : values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const last = values[values.length - 1] ?? 0;
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-primary">{last}/100</span>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="mt-1">
        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={pts} />
      </svg>
    </div>
  );
}
