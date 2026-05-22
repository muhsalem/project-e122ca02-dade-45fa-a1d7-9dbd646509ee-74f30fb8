import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Brain } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitAssessment } from "@/lib/assessment.functions";

export const Route = createFileRoute("/deep-assessment")({
  head: () => ({
    meta: [
      { title: "التقييم المهنى الشامل بالذكاء الاصطناعي — بوصلة" },
      { name: "description", content: "تقييم شامل للوعي الذاتي والمهارات والميول والطموح يُصدر تقريرًا تفصيليًا بكود لمناقشته مع مرشدك المهني." },
    ],
  }),
  component: DeepAssessmentPage,
});

type Question = { id: string; q: string; placeholder?: string };
type Section = { key: string; title: string; intro: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    key: "self",
    title: "الوعي الذاتي",
    intro: "كيف ترى نفسك من الداخل؟ كن صادقًا، فلا توجد إجابة صحيحة أو خاطئة.",
    questions: [
      { id: "self_strengths", q: "ما أبرز نقاط قوتك التي يلاحظها الآخرون فيك؟" },
      { id: "self_weakness", q: "ما الجوانب التي تشعر أنك تحتاج لتطويرها في شخصيتك؟" },
      { id: "self_values", q: "ما القيم التي لا تستطيع التنازل عنها في حياتك أو عملك؟" },
    ],
  },
  {
    key: "skills",
    title: "المهارات والمواهب",
    intro: "ما الذي تجيده فعلًا، وما الذي يقول الناس إنك موهوب فيه؟",
    questions: [
      { id: "skills_have", q: "اذكر أهم 3-5 مهارات تتقنها (تقنية، اجتماعية، إبداعية...)." },
      { id: "skills_talents", q: "ما المواهب الفطرية التي تشعر أنك ولدت بها؟" },
      { id: "skills_develop", q: "ما المهارات التي تتمنى اكتسابها خلال السنة القادمة؟" },
    ],
  },
  {
    key: "habits",
    title: "العادات والاتجاهات",
    intro: "عاداتك اليومية وطريقة تفكيرك تشكّل مسارك المهني.",
    questions: [
      { id: "habits_positive", q: "ما العادات الإيجابية التي تمارسها بانتظام؟" },
      { id: "habits_negative", q: "ما العادات التي تعطّل تقدمك وتريد التخلص منها؟" },
      { id: "habits_attitude", q: "كيف تتعامل عادةً مع التحديات والفشل؟" },
    ],
  },
  {
    key: "interests",
    title: "الميول والاهتمامات",
    intro: "ما المجالات التي تشدّك حتى دون مقابل مادي؟",
    questions: [
      { id: "interests_topics", q: "ما المواضيع أو المجالات التي تقرأ عنها أو تتابعها باستمرار؟" },
      { id: "interests_activities", q: "ما الأنشطة التي تفقد معها الإحساس بالوقت؟" },
      { id: "interests_environment", q: "هل تفضل العمل بمفردك، أو ضمن فريق، أو مع الناس؟ ولماذا؟" },
    ],
  },
  {
    key: "dreams",
    title: "الرغبات والأحلام",
    intro: "ما الذي تتمنى تحقيقه لو كانت كل الموارد متاحة لك؟",
    questions: [
      { id: "dreams_wish", q: "لو ضمنتَ النجاح، ما المهنة أو المشروع الذي ستختاره فورًا؟" },
      { id: "dreams_life", q: "صف يومًا مثاليًا في حياتك المهنية بعد 5 سنوات." },
      { id: "dreams_legacy", q: "ما الأثر الذي تريد أن تتركه في العالم؟" },
    ],
  },
  {
    key: "abilities",
    title: "القدرات والإمكانيات",
    intro: "ما الموارد المتاحة لك فعلًا الآن (وقت، شهادات، شبكة علاقات، رأس مال...)؟",
    questions: [
      { id: "ability_resources", q: "ما الموارد الحالية المتاحة لك (تعليم، خبرة، علاقات، وقت، تمويل)؟" },
      { id: "ability_obstacles", q: "ما العقبات الحقيقية التي تواجهك الآن؟" },
      { id: "ability_support", q: "من يدعمك في رحلتك المهنية؟ ومن يحبطك؟" },
    ],
  },
  {
    key: "ambition",
    title: "الطموح والأشياء المفضلة",
    intro: "أخيرًا، حدثنا عن طموحك وما تحبه.",
    questions: [
      { id: "amb_goal_1y", q: "ما هدفك المهني الأهم خلال 12 شهرًا القادمة؟" },
      { id: "amb_goal_5y", q: "أين ترى نفسك مهنيًا بعد 5 سنوات؟" },
      { id: "amb_favorites", q: "ما أكثر 3 أشياء مفضلة لديك (كتب، شخصيات ملهمة، مجالات، أماكن...)؟" },
    ],
  },
];

const TOTAL_STEPS = 1 + SECTIONS.length; // intro + sections

function DeepAssessmentPage() {
  const navigate = useNavigate();
  const submitFn = useServerFn(submitAssessment);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState({ name: "", age: "", stage: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;

  const currentSection = step > 0 ? SECTIONS[step - 1] : null;

  const canProceed = () => {
    if (step === 0) return meta.stage.trim().length > 0;
    if (!currentSection) return false;
    return currentSection.questions.every((q) => (answers[q.id] ?? "").trim().length >= 5);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitFn({
        data: {
          name: meta.name || undefined,
          age: meta.age || undefined,
          stage: meta.stage || undefined,
          answers,
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            تقييم شامل بالذكاء الاصطناعي
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">رحلة استكشاف الذات المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            7 محاور تشمل الوعي الذاتي، المهارات، العادات، الميول، الأحلام، القدرات والطموح. في النهاية تحصل على تقرير تفصيلي بكود مميز لمناقشته مع مرشدك المهني.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>الخطوة {step + 1} من {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>

          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-[var(--shadow-soft)]">
              <Loader2 className="h-10 w-10 animate-spin text-gold" />
              <h2 className="mt-6 font-serif text-2xl text-primary">يحلل الذكاء الاصطناعي إجاباتك...</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                نقوم بتجميع تقريرك الشامل وإصدار كود فريد لمناقشته مع المرشد المهني. قد يستغرق هذا حتى دقيقة.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-gold" />
                <h2 className="font-serif text-2xl text-primary">قبل أن نبدأ</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                هذه المعلومات اختيارية، تساعدنا على تخصيص التقرير لك.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-foreground">الاسم (اختياري)</label>
                  <input
                    value={meta.name}
                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                    maxLength={100}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="مثال: محمد"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">العمر (اختياري)</label>
                  <input
                    value={meta.age}
                    onChange={(e) => setMeta({ ...meta, age: e.target.value })}
                    maxLength={20}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="مثال: 22"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-foreground">المرحلة الحالية <span className="text-destructive">*</span></label>
                  <select
                    value={meta.stage}
                    onChange={(e) => setMeta({ ...meta, stage: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">اختر مرحلتك...</option>
                    <option value="طالب مدرسة">طالب مدرسة</option>
                    <option value="طالب جامعي">طالب جامعي</option>
                    <option value="خريج حديث">خريج حديث</option>
                    <option value="موظف يبحث عن تحول مهني">موظف يبحث عن تحول مهني</option>
                    <option value="باحث عن عمل">باحث عن عمل</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          ) : currentSection ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <span className="text-xs font-medium text-gold">المحور {step} من {SECTIONS.length}</span>
                <h2 className="mt-1 font-serif text-2xl text-primary">{currentSection.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{currentSection.intro}</p>
              </div>

              <div className="space-y-6">
                {currentSection.questions.map((q, i) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-foreground">
                      {i + 1}. {q.q}
                    </label>
                    <textarea
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      maxLength={3000}
                      rows={3}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:border-primary focus:outline-none"
                      placeholder="اكتب إجابتك بصدق..."
                    />
                    <div className="mt-1 text-left text-xs text-muted-foreground">
                      {(answers[q.id] ?? "").length}/3000
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
                السابق
              </button>

              {step < TOTAL_STEPS - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
                >
                  التالي
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-gold-foreground disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  إصدار التقرير
                </button>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            لديك كود تقرير سابق؟{" "}
            <Link to="/report" className="text-primary underline">افتح تقريرك</Link>
          </div>
        </div>
      </section>
    </>
  );
}
