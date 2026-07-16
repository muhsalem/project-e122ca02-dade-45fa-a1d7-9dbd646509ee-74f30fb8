import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Compass, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { LikertValue, scoreSubscale, toPercent, rankSubscales } from "@/lib/psychometrics";
import { IPIP_VALUES_ITEMS, IPIP_VALUES_SOURCE, WORK_VALUES_LABELS, type WorkValue } from "@/data/scales/ipip-values";

export const Route = createFileRoute("/work-values")({
  head: () => ({
    meta: [
      { title: "القيم المهنية — مبني على O*NET Work Values | بوصلة" },
      { name: "description", content: "اكتشف أهم 3 قيم مهنية لديك من الأبعاد الستة لـ O*NET Work Values باستخدام بنود IPIP مفتوحة المصدر." },
    ],
  }),
  component: WorkValuesPage,
});

const VALUES: WorkValue[] = ["ACHIEVEMENT", "INDEPENDENCE", "RECOGNITION", "RELATIONSHIPS", "SUPPORT", "WORKING"];

const ITEMS_BY_VALUE: Record<WorkValue, typeof IPIP_VALUES_ITEMS> = {
  ACHIEVEMENT: IPIP_VALUES_ITEMS.filter((i) => i.value === "ACHIEVEMENT"),
  INDEPENDENCE: IPIP_VALUES_ITEMS.filter((i) => i.value === "INDEPENDENCE"),
  RECOGNITION: IPIP_VALUES_ITEMS.filter((i) => i.value === "RECOGNITION"),
  RELATIONSHIPS: IPIP_VALUES_ITEMS.filter((i) => i.value === "RELATIONSHIPS"),
  SUPPORT: IPIP_VALUES_ITEMS.filter((i) => i.value === "SUPPORT"),
  WORKING: IPIP_VALUES_ITEMS.filter((i) => i.value === "WORKING"),
};

function WorkValuesPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = IPIP_VALUES_ITEMS.length;
  const answeredCount = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answeredCount / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<WorkValue, number>;
    VALUES.forEach((k) => { out[k] = scoreSubscale(answers, ITEMS_BY_VALUE[k]); });
    return out;
  }, [answers]);

  const ranked = useMemo(() => rankSubscales(scores), [scores]);
  const top3 = ranked.slice(0, 3);

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Compass className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">القيم المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            24 عبارة لتحديد أهم 3 قيم مهنية لديك — مبني على الأبعاد الستّة لـ <strong>O*NET Work Values</strong>
            (الإنجاز، الاستقلالية، التقدير، العلاقات، الدعم، بيئة العمل) وبنود IPIP مفتوحة المصدر.
          </p>
        </header>

        <ShariaNotice variant="general" className="mt-6" />

        {!showRes && (
          <>
            <div className="sticky top-14 z-10 my-6 rounded-xl border border-border bg-background/95 p-3 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>التقدّم: {answeredCount} / {total}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-5">
              {VALUES.map((k) => (
                <LikertGroup
                  key={k}
                  title={WORK_VALUES_LABELS[k].ar}
                  intro={WORK_VALUES_LABELS[k].desc}
                  items={ITEMS_BY_VALUE[k]}
                  answers={answers}
                  onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v as LikertValue }))}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={answeredCount < total}
                onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-50"
              >
                عرض قيمي الثلاث الكبرى
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <h2 className="font-serif text-xl text-primary md:text-2xl">قيَمك المهنية الثلاث الكبرى</h2>
              <ol className="mt-4 space-y-3">
                {top3.map((r, i) => (
                  <li key={r.key} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary">{WORK_VALUES_LABELS[r.key].ar}</h3>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{r.pct}%</span>
                      </div>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">{WORK_VALUES_LABELS[r.key].desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">ترتيب كامل لقيمك</h3>
              <ul className="mt-4 space-y-2">
                {ranked.map((r) => (
                  <li key={r.key} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm text-primary">{WORK_VALUES_LABELS[r.key].ar}</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${toPercent(r.avg)}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-left text-xs text-muted-foreground">{toPercent(r.avg)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-sm leading-7 text-primary">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong>توصية:</strong> عند تقييم أي فرصة عمل، اسأل نفسك: «هل تخدم أهم 3 قيم لديّ؟»
                  إن كان الجواب لا، فأنت توافق بالعقل لا بالقلب — وسرعان ما يظهر التذمّر.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setShowRes(false); setAnswers({}); }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> أعد الاختبار
              </button>
              <Link to="/paths" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                العودة لخريطة الاختبارات <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        <SourceAttribution source={IPIP_VALUES_SOURCE} />
      </div>
    </section>
  );
}
