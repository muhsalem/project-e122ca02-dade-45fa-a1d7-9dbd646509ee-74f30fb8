import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check, Briefcase } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitCareerType } from "@/lib/career-type.functions";

export const Route = createFileRoute("/career-type-assessment")({
  head: () => ({
    meta: [
      { title: "تقييم نوع المسار المهني — Occupation / Job / Profession / Craft | بوصلة" },
      {
        name: "description",
        content:
          "تقييم تشخيصي يحدد ميلك بين النشاط المهني العام (Occupation) والوظيفة (Job) والمهنة الاحترافية (Profession) والحِرفة (Craft) مع تقرير شامل وكود مميز للمناقشة مع مرشد مهني.",
      },
    ],
  }),
  component: CareerTypePage,
});

type Type = "occupation" | "job" | "profession" | "craft";
type Option = { label: string; type: Type };
type Question = { id: string; q: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "q1",
    q: "ما الذي يجذبك أكثر في فكرة العمل؟",
    options: [
      { label: "أي نشاط يوفّر دخلاً مستقرًا حتى لو كان عامًا", type: "occupation" },
      { label: "دور وظيفي واضح ومحدّد عند صاحب عمل معروف", type: "job" },
      { label: "مهنة راقية تحتاج شهادات وتراخيص وخبرة طويلة", type: "profession" },
      { label: "إتقان مهارة يدوية أو فنية بالممارسة والخبرة", type: "craft" },
    ],
  },
  {
    id: "q2",
    q: "كم سنة أنت مستعد للاستثمار في التعليم والتدريب؟",
    options: [
      { label: "أقل ما يمكن، أبحث عن دخل سريع", type: "occupation" },
      { label: "1-2 سنة تدريب مهني أو دبلوم", type: "job" },
      { label: "5+ سنوات جامعة وتدريب متخصص وترخيص", type: "profession" },
      { label: "3-7 سنوات تتلمذ وممارسة عملية يومية", type: "craft" },
    ],
  },
  {
    id: "q3",
    q: "ما طبيعة المخرجات التي تفضّل أن ينتجها عملك؟",
    options: [
      { label: "خدمات يومية بسيطة يحتاجها الناس", type: "occupation" },
      { label: "مهام مكتبية وتقارير وأهداف شهرية", type: "job" },
      { label: "قرارات وحلول معقدة تتطلب خبرة علمية", type: "profession" },
      { label: "منتجات ملموسة مصنوعة بيدي أتفاخر بها", type: "craft" },
    ],
  },
  {
    id: "q4",
    q: "أي بيئة عمل تجذبك فعليًا؟",
    options: [
      { label: "بيئة متغيرة، أي مكان يوفر فرصة", type: "occupation" },
      { label: "مكتب منظّم في شركة مستقرة", type: "job" },
      { label: "عيادة/مكتب احترافي/مختبر/محكمة", type: "profession" },
      { label: "ورشة أو استوديو فيها أدواتي ومعداتي", type: "craft" },
    ],
  },
  {
    id: "q5",
    q: "كيف تتعامل مع الترخيص والشهادات الرسمية؟",
    options: [
      { label: "لا أحتاجها، الخبرة الميدانية تكفي", type: "occupation" },
      { label: "أهتم بشهادة الثانوية أو الدبلوم فقط", type: "job" },
      { label: "ضرورية ولا أعمل دونها (ترخيص مهني)", type: "profession" },
      { label: "غير ضرورية لكن أهتم بسمعة الإتقان والجودة", type: "craft" },
    ],
  },
  {
    id: "q6",
    q: "ما مصدر الفخر الحقيقي لديك في عملك؟",
    options: [
      { label: "أنني أعمل وأكسب رزقي بشرف", type: "occupation" },
      { label: "ترقياتي ومسماي الوظيفي في الشركة", type: "job" },
      { label: "لقبي العلمي والمهني (د./م./أ.)", type: "profession" },
      { label: "جودة ما تصنعه يداي وسمعتي بين الناس", type: "craft" },
    ],
  },
  {
    id: "q7",
    q: "كيف تتعامل مع التغيير في صاحب العمل؟",
    options: [
      { label: "أنتقل بسهولة بين أي أعمال متوفرة", type: "occupation" },
      { label: "أبدّل الشركات بحثًا عن راتب وترقية أفضل", type: "job" },
      { label: "ألتزم بمسار مهني طويل الأمد في تخصصي", type: "profession" },
      { label: "أعمل لحسابي أو في ورشتي الخاصة", type: "craft" },
    ],
  },
  {
    id: "q8",
    q: "ما الذي تحب أن تتعلمه أكثر؟",
    options: [
      { label: "مهارات حياتية عامة وحلول عملية", type: "occupation" },
      { label: "برامج مكتبية وإدارة وقت وتواصل وظيفي", type: "job" },
      { label: "نظريات علمية وأبحاث متخصصة", type: "profession" },
      { label: "تقنيات يدوية وأدوات ومواد خام", type: "craft" },
    ],
  },
  {
    id: "q9",
    q: "ما شكل الدخل الذي تفضله؟",
    options: [
      { label: "دخل يومي/أسبوعي حسب العمل المتاح", type: "occupation" },
      { label: "راتب شهري ثابت مع مزايا وتأمين", type: "job" },
      { label: "أتعاب مرتفعة لكل خدمة احترافية", type: "profession" },
      { label: "دخل من بيع منتجاتي أو خدمات الورشة", type: "craft" },
    ],
  },
  {
    id: "q10",
    q: "كيف تصف نفسك للآخرين عند السؤال عن عملك؟",
    options: [
      { label: "أعمل في أي شيء يوفّر دخلاً", type: "occupation" },
      { label: "موظف في شركة [...]", type: "job" },
      { label: "أنا [طبيب/مهندس/محامٍ/أكاديمي]", type: "profession" },
      { label: "أنا [نجار/خزّاف/خبّاز/خياط/صانع]", type: "craft" },
    ],
  },
  {
    id: "q11",
    q: "أكثر شيء يُرهقك في العمل هو:",
    options: [
      { label: "عدم وجود فرص متاحة باستمرار", type: "occupation" },
      { label: "البيروقراطية والاجتماعات الطويلة", type: "job" },
      { label: "ضغط المسؤولية وتحديث المعرفة دائمًا", type: "profession" },
      { label: "بطء التعلم لإتقان المهارة لمستوى الاحتراف", type: "craft" },
    ],
  },
  {
    id: "q12",
    q: "إن خُيّرت بين هذه الخيارات في عمر 25، تختار:",
    options: [
      { label: "عمل سريع يدرّ دخلاً فورًا", type: "occupation" },
      { label: "وظيفة في شركة كبرى براتب جيد", type: "job" },
      { label: "إكمال الدراسات العليا والتخصص", type: "profession" },
      { label: "التتلمذ على يد حِرفي ماهر", type: "craft" },
    ],
  },
];

const TYPE_INFO: Record<Type, { ar: string; en: string; color: string }> = {
  occupation: { ar: "النشاط المهني العام", en: "Occupation", color: "text-blue-500" },
  job: { ar: "الوظيفة", en: "Job", color: "text-emerald-500" },
  profession: { ar: "المهنة الاحترافية", en: "Profession", color: "text-amber-500" },
  craft: { ar: "الحِرفة", en: "Craft", color: "text-rose-500" },
};

function CareerTypePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerType);

  const [step, setStep] = useState(0); // 0 = meta, 1..N = questions, then submit
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [answers, setAnswers] = useState<Record<string, { type: Type; label: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUESTIONS.length + 1;
  const progress = Math.round((step / totalSteps) * 100);

  const scores = useMemo(() => {
    const s = { occupation: 0, job: 0, profession: 0, craft: 0 };
    Object.values(answers).forEach((a) => {
      s[a.type] += 1;
    });
    const total = QUESTIONS.length || 1;
    return {
      occupation: Math.round((s.occupation / total) * 100),
      job: Math.round((s.job / total) * 100),
      profession: Math.round((s.profession / total) * 100),
      craft: Math.round((s.craft / total) * 100),
    };
  }, [answers]);

  const canNext = step === 0 ? name.trim().length > 0 : !!answers[QUESTIONS[step - 1]?.id];

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const ans: Record<string, string> = {};
      QUESTIONS.forEach((q) => {
        ans[q.q] = answers[q.id]?.label ?? "";
      });
      const res = await submit({
        data: {
          name: name.trim() || undefined,
          age: age.trim() || undefined,
          stage: stage.trim() || undefined,
          answers: ans,
          scores,
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <Briefcase className="h-4 w-4 text-gold" />
            <span>تقييم نوع المسار المهني</span>
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            هل أنت أقرب إلى Occupation أم Job أم Profession أم Craft؟
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/70">
            12 سؤالًا قصيرًا تكشف ميلك المهني الحقيقي مع تقرير تشخيصي مفصّل وكود
            لمناقشته مع مرشد مهني.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mb-6 max-w-3xl">
          <div className="mb-2 flex justify-between text-xs text-foreground/60">
            <span>الخطوة {step + 1} من {totalSteps}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-card">
            <div
              className="h-full bg-gradient-to-r from-primary to-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary">بياناتك</h2>
              <p className="text-sm text-foreground/70">
                المعلومات تُستخدم فقط لتخصيص التقرير، وتُحفظ بشكل سري مرتبط بكود
                تقريرك.
              </p>
              <div>
                <label className="mb-1 block text-sm font-medium">الاسم *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="اسمك الكامل"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">العمر</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="مثال: 24"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">المرحلة الحالية</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="طالب جامعي / موظف / باحث عن عمل..."
                  />
                </div>
              </div>
            </div>
          )}

          {step > 0 && step <= QUESTIONS.length && (() => {
            const q = QUESTIONS[step - 1];
            const selected = answers[q.id];
            return (
              <div className="space-y-4">
                <div className="text-xs text-foreground/60">السؤال {step} من {QUESTIONS.length}</div>
                <h2 className="font-serif text-xl font-bold text-primary md:text-2xl">
                  {q.q}
                </h2>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    const isSel = selected?.label === opt.label;
                    return (
                      <button
                        key={i}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-right transition-all ${
                          isSel
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/40 hover:bg-card"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            isSel ? "border-primary bg-primary" : "border-border"
                          }`}
                        >
                          {isSel && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span className="text-sm text-foreground/90">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0 || loading}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </button>

            {step < QUESTIONS.length ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext || loading}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-gold px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري إنشاء التقرير...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    احصل على تقريري
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live mini-scores */}
        {Object.keys(answers).length > 0 && step > 0 && (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-xs font-semibold text-foreground/70">
              ميولك حتى الآن
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(Object.keys(scores) as Type[]).map((k) => (
                <div key={k} className="rounded-lg bg-background p-3">
                  <div className={`text-xs ${TYPE_INFO[k].color}`}>
                    {TYPE_INFO[k].en}
                  </div>
                  <div className="font-bold text-foreground">{scores[k]}%</div>
                  <div className="text-[10px] text-foreground/60">{TYPE_INFO[k].ar}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/career-path" className="text-primary hover:underline">
            ← مراجعة تعريفات Occupation و Job و Profession و Craft أولاً
          </Link>
        </div>
      </div>
    </div>
  );
}
