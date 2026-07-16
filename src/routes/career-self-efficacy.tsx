import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Target, RotateCcw, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { LikertValue, scoreSubscale, toPercent, bandFromAvg } from "@/lib/psychometrics";
import { VISA_ITEMS, VISA_SOURCE, VISA_LABELS, type VisaDim } from "@/data/scales/visa";

export const Route = createFileRoute("/career-self-efficacy")({
  head: () => ({
    meta: [
      { title: "حالة الهوية المهنية (VISA) | بوصلة" },
      { name: "description", content: "قيّم حالة هويتك المهنية عبر 6 أبعاد وفق مقياس Vocational Identity Status Assessment (Porfeli & Lee, 2011) — مفتوح للاستخدام البحثي." },
    ],
  }),
  component: VISAPage,
});

const DIMS: VisaDim[] = ["CE", "CI", "CC", "IC", "CSC", "CFC"];

const ITEMS_BY_DIM: Record<VisaDim, typeof VISA_ITEMS> = {
  CE: VISA_ITEMS.filter((i) => i.dim === "CE"),
  CI: VISA_ITEMS.filter((i) => i.dim === "CI"),
  CC: VISA_ITEMS.filter((i) => i.dim === "CC"),
  IC: VISA_ITEMS.filter((i) => i.dim === "IC"),
  CSC: VISA_ITEMS.filter((i) => i.dim === "CSC"),
  CFC: VISA_ITEMS.filter((i) => i.dim === "CFC"),
};

function VISAPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = VISA_ITEMS.length;
  const answered = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answered / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<VisaDim, number>;
    DIMS.forEach((k) => { out[k] = scoreSubscale(answers, ITEMS_BY_DIM[k]); });
    return out;
  }, [answers]);

  // High commitment + high identification + low self-doubt = "Achieved" identity
  const identityStatus = useMemo(() => {
    const commit = (scores.CC + scores.IC) / 2;
    const doubt = scores.CSC;
    const explore = (scores.CE + scores.CI) / 2;
    if (commit >= 3.75 && doubt < 2.5) return { label: "هوية مهنية ناضجة (Achieved)", tone: "emerald" };
    if (explore >= 3.5 && commit < 3.0) return { label: "مرحلة استكشاف نشط (Moratorium)", tone: "sky" };
    if (commit >= 3.5 && explore < 2.5) return { label: "التزام مبكّر دون استكشاف كافٍ (Foreclosed)", tone: "amber" };
    if (explore < 2.5 && commit < 2.5) return { label: "هوية غير متبلورة بعد (Diffused)", tone: "rose" };
    return { label: "هوية قيد التشكّل", tone: "primary" };
  }, [scores]);

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Target className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">حالة الهوية المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            30 عبارة تكشف مرحلتك في بناء الهوية المهنية عبر 6 أبعاد — مبني على مقياس <strong>VISA</strong>
            (Porfeli, Lee, Vondracek & Weigold, 2011).
          </p>
        </header>

        <ShariaNotice variant="general" className="mt-6" />

        {!showRes && (
          <>
            <div className="sticky top-14 z-10 my-6 rounded-xl border border-border bg-background/95 p-3 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{answered} / {total}</span><span>{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-5">
              {DIMS.map((k) => (
                <LikertGroup
                  key={k}
                  title={VISA_LABELS[k].ar}
                  intro={VISA_LABELS[k].desc}
                  items={ITEMS_BY_DIM[k]}
                  answers={answers}
                  onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v as LikertValue }))}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button type="button" disabled={answered < total} onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                اكشف حالتي
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center">
              <p className="text-xs text-muted-foreground">حالة هويتك المهنية</p>
              <p className="mt-1 font-serif text-2xl text-primary md:text-3xl">{identityStatus.label}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">تفصيل الأبعاد الستة</h3>
              <ul className="mt-4 space-y-3">
                {DIMS.map((k) => (
                  <li key={k}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-primary">{VISA_LABELS[k].ar}</span>
                      <span className="text-xs text-muted-foreground">{toPercent(scores[k])}% — {bandFromAvg(scores[k])}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${toPercent(scores[k])}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{VISA_LABELS[k].desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => { setShowRes(false); setAnswers({}); }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">
                <RotateCcw className="h-4 w-4" /> أعد الاختبار
              </button>
              <Link to="/paths" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                خريطة الاختبارات <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        <SourceAttribution source={VISA_SOURCE} />
      </div>
    </section>
  );
}
