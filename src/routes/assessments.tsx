import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "التقييمات المهنية — بوصلة" },
      { name: "description", content: "تقييم RIASEC لاكتشاف ميولك المهنية وفق نموذج Holland العالمي." },
    ],
  }),
  component: AssessmentsPage,
});

type Type = "R" | "I" | "A" | "S" | "E" | "C";

const TYPES: Record<Type, { name: string; desc: string; careers: string[] }> = {
  R: { name: "الواقعي", desc: "تحب العمل اليدوي والتقني والآلات.", careers: ["هندسة ميكانيكية", "تقنية معلومات", "زراعة", "طب أسنان"] },
  I: { name: "الاستقصائي", desc: "تستمتع بالبحث والتحليل وحل المشكلات.", careers: ["طب", "علوم بيانات", "أبحاث", "فيزياء"] },
  A: { name: "الفني", desc: "إبداعي تعبيري تميل للفنون والتصميم.", careers: ["تصميم", "إعلام", "عمارة", "كتابة"] },
  S: { name: "الاجتماعي", desc: "تستمتع بمساعدة وتعليم الآخرين.", careers: ["تعليم", "إرشاد نفسي", "موارد بشرية", "تمريض"] },
  E: { name: "المبادر", desc: "قيادي يحب الإقناع والمبيعات والمشاريع.", careers: ["إدارة أعمال", "ريادة", "تسويق", "قانون"] },
  C: { name: "التقليدي", desc: "منظم دقيق تحب البيانات والإجراءات.", careers: ["محاسبة", "تدقيق", "إدارة مكتبية", "تحليل مالي"] },
};

const QUESTIONS: { q: string; t: Type }[] = [
  { q: "أحب إصلاح الأجهزة والأدوات بيدي.", t: "R" },
  { q: "أستمتع ببناء أشياء أو تجميعها.", t: "R" },
  { q: "تستهويني التجارب العلمية والاكتشافات.", t: "I" },
  { q: "أحب تحليل البيانات والمعلومات المعقدة.", t: "I" },
  { q: "أعبّر عن نفسي عبر الرسم أو الكتابة أو الموسيقى.", t: "A" },
  { q: "أحب الأعمال التي تتيح حرية إبداعية.", t: "A" },
  { q: "أستمتع بمساعدة الآخرين على حل مشكلاتهم.", t: "S" },
  { q: "أحب تعليم أو تدريب الآخرين.", t: "S" },
  { q: "أحب إقناع الآخرين بأفكاري ومشاريعي.", t: "E" },
  { q: "أطمح لقيادة فريق أو إدارة مشروع خاص.", t: "E" },
  { q: "أحب تنظيم الملفات والبيانات بدقة.", t: "C" },
  { q: "أفضّل المهام ذات الخطوات الواضحة والإجراءات المحددة.", t: "C" },
];

function AssessmentsPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  const submit = () => {
    setDone(true);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const scores = (() => {
    const s: Record<Type, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([i, v]) => {
      const t = QUESTIONS[Number(i)].t;
      s[t] += v;
    });
    return s;
  })();

  const ranked = (Object.entries(scores) as [Type, number][])
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            تقييم RIASEC — نموذج Holland
          </span>
          <h1 className="mt-5 text-4xl text-primary md:text-5xl">اكتشف ميولك المهنية</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            ١٢ سؤال قصير تكشف لك أنماطك المهنية المسيطرة ومسارات تتناسب معها.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        {!done ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
              <span>السؤال {step + 1} من {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <p className="font-serif text-2xl leading-relaxed text-primary">
                {QUESTIONS[step].q}
              </p>

              <div className="mt-8 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((v) => {
                  const selected = answers[step] === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setAnswers({ ...answers, [step]: v })}
                      className={`rounded-lg border py-4 text-sm font-medium transition-all ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>لا ينطبق</span>
                <span>ينطبق تماماً</span>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                  السابق
                </button>

                {step < QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!answers[step]}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    التالي
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={Object.keys(answers).length < QUESTIONS.length}
                    className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-2 text-sm font-semibold text-gold-foreground disabled:opacity-40"
                  >
                    عرض النتائج
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-3xl text-primary md:text-4xl">نتائجك</h2>
            <p className="mt-2 text-center text-muted-foreground">
              نمطك المهني السائد:{" "}
              <span className="font-bold text-gold">{TYPES[ranked[0][0]].name}</span> +{" "}
              <span className="font-bold text-gold">{TYPES[ranked[1][0]].name}</span>
            </p>

            <div className="mt-10 space-y-4">
              {ranked.map(([t, v]) => {
                const pct = (v / 10) * 100;
                return (
                  <div key={t} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-lg text-primary">{TYPES[t].name}</h3>
                      <span className="text-sm text-muted-foreground">{v}/10</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-to-l from-gold to-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{TYPES[t].desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TYPES[t].careers.map((c) => (
                        <span key={c} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm">
                <RotateCcw className="h-4 w-4" />
                إعادة التقييم
              </button>
              <Link to="/booking" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                ناقش نتائجك مع مرشد
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
