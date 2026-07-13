import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Brain, Sparkles, Target, RefreshCw, Info } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import {
  META_SECTIONS, META_ALL_ITEMS, FACET_LABELS, SCALE_LABELS,
  type MetaFacet, type MetaScale,
} from "@/data/meta-learning-bank";
import { scoreSubscale, toPercent, bandFromAvg } from "@/lib/psychometrics";

export const Route = createFileRoute("/meta-learning")({
  head: () => ({
    meta: [
      { title: "مقاييس التعلّم-الميتا — Grit + Mindset + MAI | بوصلة" },
      { name: "description", content: "قِس مثابرتك (Grit-12)، وعقليتك (Growth Mindset-3)، ووعيك ما وراء المعرفي (MAI-19) في اختبار واحد مع توصيات فورية." },
      { property: "og:title", content: "مقاييس التعلّم-الميتا — Grit + Mindset + MAI" },
      { property: "og:description", content: "34 بنداً موثّقاً علمياً (Duckworth, Dweck, Schraw & Dennison) بترجمة عربية." },
    ],
  }),
  component: MetaLearningPage,
});

const FACETS: MetaFacet[] = [
  "grit_perseverance", "grit_consistency", "mindset_growth",
  "mai_declarative", "mai_procedural", "mai_conditional",
  "mai_planning", "mai_monitoring", "mai_evaluation",
];

function recommend(facet: MetaFacet, pct: number): string {
  const low = pct < 50;
  const mid = pct >= 50 && pct < 70;
  switch (facet) {
    case "grit_perseverance":
      return low ? "ابدأ بهدف صغير (SMART) لأسبوعين واحتفل بإتمامه لبناء عادة الإنجاز."
        : mid ? "اربط أهدافك بمعنى شخصي أكبر لرفع مقاومتك للانتكاسات." : "استثمر مثابرتك في مشروع بعيد المدى ذي أثر."
    case "grit_consistency":
      return low ? "طبّق قاعدة 'ثلاثة أشهر' قبل تغيير الاهتمام؛ وثّق أسباب البقاء لا الترك."
        : mid ? "راجع أهدافك ربع سنوياً بدل تغييرها شهرياً." : "ثبات اهتمامك ممتاز — احذر فقط الانغلاق عن فرص جديدة حقيقية."
    case "mindset_growth":
      return low ? "درّب دماغك على عبارة 'لا أُتقنها بعد'؛ اقرأ كتاب Mindset لدويك أو ملخّصه."
        : mid ? "احتفل بجهدك واستراتيجيتك، لا بذكائك، عند كل إنجاز." : "عقلية نموّك متجذّرة — انقلها لمن حولك عبر التغذية الراجعة البنّاءة."
    case "mai_declarative":
      return low ? "اكتب قائمة بنقاط قوّتك الفكرية الثلاث الأبرز وضعفَين قابلَين للتطوير."
        : mid ? "طوّر خريطة ذهنية لأنواع المعرفة التي تُتقنها مقابل الغامضة." : "مستوى وعي ممتاز بمعرفتك."
    case "mai_procedural":
      return low ? "تعلّم 3 استراتيجيات تعلّم أساسية: التلخيص، الاسترجاع النشط، التباعد الزمني."
        : mid ? "جرّب استراتيجية Feynman: اشرح ما تعلّمته لطفل." : "أنت متمكّن من استراتيجياتك."
    case "mai_conditional":
      return low ? "اسأل بعد كل جلسة: 'ما الاستراتيجية التي نجحت هنا ولماذا؟'"
        : mid ? "طوّر جدولاً يربط نوع المهمّة بالاستراتيجية الأنسب." : "مرونتك في اختيار الاستراتيجية عالية."
    case "mai_planning":
      return low ? "خصّص 5 دقائق قبل كل جلسة تعلّم للإجابة عن: هدفي؟ أدواتي؟ الوقت؟"
        : mid ? "استخدم قالب SMART أو GROW لتخطيط أهدافك الأسبوعية." : "تخطيطك منظّم؛ ادفعه للأمام بمراجعة ربع سنوية."
    case "mai_monitoring":
      return low ? "طبّق تقنية 'وقفة كل 25 دقيقة' (Pomodoro) واسأل: هل فهمت؟"
        : mid ? "استخدم Retrieval Practice بعد كل قسم لاختبار فهمك مباشرة." : "مراقبتك الذاتية قوية."
    case "mai_evaluation":
      return low ? "اكتب 3 جُمَل بعد كل جلسة: ما تعلّمته، ما استعصى، خطوتي التالية."
        : mid ? "طبّق نموذج KWL (أعرف/أريد/تعلّمت) لتقييم أعمق." : "تقييمك البعدي ممتاز؛ شارك خلاصاتك مع مجتمع تعلّم."
  }
}

function MetaLearningPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const total = META_ALL_ITEMS.length;
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / total) * 100);
  const done = answered === total;

  const results = useMemo(() => {
    if (!done) return null;
    const facetScores = {} as Record<MetaFacet, { avg: number; pct: number; band: string }>;
    for (const f of FACETS) {
      const items = META_ALL_ITEMS.filter((it) => it.facet === f);
      const avg = scoreSubscale(answers, items);
      facetScores[f] = { avg, pct: toPercent(avg), band: bandFromAvg(avg) };
    }
    const scaleScore = (scale: MetaScale) => {
      const items = META_ALL_ITEMS.filter((it) => it.scale === scale);
      const avg = scoreSubscale(answers, items);
      return { avg, pct: toPercent(avg), band: bandFromAvg(avg) };
    };
    return {
      facets: facetScores,
      grit: scaleScore("grit"),
      mindset: scaleScore("mindset"),
      mai: scaleScore("mai"),
    };
  }, [answers, done]);

  const set = (id: string, v: number) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">مقاييس التعلّم-الميتا</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            34 بنداً في اختبار واحد يقيس: <strong>المثابرة (Grit-12)</strong> + <strong>عقلية النموّ (Mindset-3)</strong> + <strong>الوعي ما وراء المعرفي (MAI-19)</strong>.
            نتائج ورأي فوري.
          </p>
        </header>

        <div className="mb-4 rounded-xl border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>الأدوات مترجمة عربياً بناء على المراجع الأصلية (Duckworth 2009، Dweck 2006، Schraw & Dennison 1994).
              التحقّق السيكومتري (ألفا كرونباخ) على العيّنة العربية جارٍ. النتائج استكشافية لا تشخيصية.</span>
          </p>
        </div>

        {!showResults && (
          <>
            <div className="mb-4 rounded-xl border border-border bg-card p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">التقدّم</span>
                <span className="font-semibold text-primary">{answered} / {total} ({progress}%)</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-to-r from-primary to-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-5">
              {META_SECTIONS.map((sec) => (
                <LikertGroup
                  key={sec.key}
                  title={sec.title}
                  intro={sec.intro}
                  items={sec.items}
                  answers={answers}
                  onChange={set}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => { setShowResults(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={!done}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {done ? "احسب نتيجتي الآن" : `أكمل ${total - answered} بنداً للحصول على النتيجة`}
              </button>
            </div>
          </>
        )}

        {showResults && results && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              {(["grit", "mindset", "mai"] as MetaScale[]).map((s) => (
                <div key={s} className="rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
                  <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{SCALE_LABELS[s]}</p>
                  <p className="mt-1 font-serif text-3xl text-primary">{results[s].pct}<span className="text-lg">/100</span></p>
                  <p className="mt-1 text-xs font-semibold text-gold">{results[s].band}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <h2 className="mb-4 font-serif text-lg text-primary">النتائج التفصيلية والتوصيات</h2>
              <ul className="space-y-4">
                {FACETS.map((f) => {
                  const r = results.facets[f];
                  return (
                    <li key={f} className="rounded-xl border border-border/70 bg-background/60 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-primary">{FACET_LABELS[f]}</h3>
                        <span className="rounded-md bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">{r.pct}٪ — {r.band}</span>
                      </div>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-to-r from-primary to-gold" style={{ width: `${r.pct}%` }} />
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">💡 {recommend(f, r.pct)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setAnswers({}); setShowResults(false); }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-primary hover:bg-secondary/50"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة الاختبار
              </button>
              <a href="/learning-dna" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                أكمل مع Learning DNA — البصمة التعليمية
              </a>
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              النتائج استكشافية. للتحليل الشخصي المتعمّق راجع مرشداً مختصّاً.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
