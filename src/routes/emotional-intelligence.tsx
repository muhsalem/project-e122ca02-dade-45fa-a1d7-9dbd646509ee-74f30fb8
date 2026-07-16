import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HeartHandshake, RotateCcw, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { LikertValue, scoreSubscale, toPercent, bandFromAvg } from "@/lib/psychometrics";
import { IPIP_EI_ITEMS, IPIP_EI_SOURCE, EI_LABELS, type EiFacet } from "@/data/scales/ipip-ei";

export const Route = createFileRoute("/emotional-intelligence")({
  head: () => ({
    meta: [
      { title: "الذكاء العاطفي — بنود IPIP مفتوحة الترخيص | بوصلة" },
      { name: "description", content: "تقييم الذكاء العاطفي عبر 4 أبعاد باستخدام بنود من International Personality Item Pool (IPIP) — نطاق عام (Public Domain)." },
    ],
  }),
  component: EIPage,
});

const FACETS: EiFacet[] = ["SEA", "OEA", "UOE", "ROE"];

const ITEMS_BY_FACET: Record<EiFacet, typeof IPIP_EI_ITEMS> = {
  SEA: IPIP_EI_ITEMS.filter((i) => i.facet === "SEA"),
  OEA: IPIP_EI_ITEMS.filter((i) => i.facet === "OEA"),
  UOE: IPIP_EI_ITEMS.filter((i) => i.facet === "UOE"),
  ROE: IPIP_EI_ITEMS.filter((i) => i.facet === "ROE"),
};

function EIPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = IPIP_EI_ITEMS.length;
  const answered = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answered / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<EiFacet, number>;
    FACETS.forEach((k) => { out[k] = scoreSubscale(answers, ITEMS_BY_FACET[k]); });
    return out;
  }, [answers]);

  const overall = useMemo(() => {
    const arr = Object.values(scores);
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  }, [scores]);

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">الذكاء العاطفي</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            16 عبارة لقياس 4 أوجه للذكاء العاطفي — البنود مأخوذة من مجمّع <strong>IPIP</strong> مفتوح المصدر.
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
              {FACETS.map((k) => (
                <LikertGroup
                  key={k}
                  title={EI_LABELS[k].ar}
                  intro={EI_LABELS[k].desc}
                  items={ITEMS_BY_FACET[k]}
                  answers={answers}
                  onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v as LikertValue }))}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={answered < total}
                onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                احسب نتيجتي
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center">
              <p className="text-xs text-muted-foreground">المؤشر الإجمالي</p>
              <p className="mt-1 font-serif text-4xl text-primary">{toPercent(overall)}%</p>
              <p className="mt-2 text-sm text-muted-foreground">المستوى: <strong className="text-primary">{bandFromAvg(overall)}</strong></p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">تفصيل الأوجه الأربعة</h3>
              <ul className="mt-4 space-y-3">
                {FACETS.map((k) => (
                  <li key={k}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-primary">{EI_LABELS[k].ar}</span>
                      <span className="text-xs text-muted-foreground">{toPercent(scores[k])}% — {bandFromAvg(scores[k])}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${toPercent(scores[k])}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{EI_LABELS[k].desc}</p>
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

        <SourceAttribution source={IPIP_EI_SOURCE} />
      </div>
    </section>
  );
}
