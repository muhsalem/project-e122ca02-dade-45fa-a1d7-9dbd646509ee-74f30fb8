import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, GraduationCap, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitAcademicMajor } from "@/lib/academic-major.functions";

export const Route = createFileRoute("/academic-major")({
  head: () => ({
    meta: [
      { title: "اكتشف تخصصك الدراسي المناسب بالذكاء الاصطناعي — بوصلة" },
      { name: "description", content: "تقييم ذكي يحلل ميولك ومهاراتك ويقترح أفضل 5 تخصصات جامعية مناسبة لك مع نسبة توافق وخارطة طريق." },
    ],
  }),
  component: AcademicMajorPage,
});

type Question = { id: string; q: string; type: "single" | "multi"; options: string[]; maxSelect?: number };
type Section = { key: string; title: string; intro: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    key: "interests",
    title: "الميول الأكاديمية",
    intro: "اكتشف المواد والمشكلات التي تجذبك.",
    questions: [
      {
        id: "acad_favorite_subjects",
        q: "أكثر المواد التي تستمتع بها (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: [
          "الرياضيات", "الفيزياء", "الكيمياء", "الأحياء وعلوم الحياة",
          "الحاسب والبرمجة", "اللغات والأدب", "التاريخ والجغرافيا",
          "علم النفس والاجتماع", "الاقتصاد والإدارة", "الفنون والتصميم",
          "التربية الإسلامية/الشريعة", "التربية البدنية والصحة",
        ],
      },
      {
        id: "acad_problem_type",
        q: "أي نوع من المشكلات تستمتع بحلها أكثر؟",
        type: "single",
        options: [
          "مشكلات رقمية/حسابية ومنطقية",
          "مشكلات تقنية وهندسية تتعلق بأجهزة وأنظمة",
          "مشكلات إنسانية وسلوكية تتعلق بالناس",
          "مشكلات إبداعية تتعلق بالتصميم والجمال",
          "مشكلات إدارية واقتصادية تتعلق بالأعمال",
          "مشكلات صحية/بيولوجية تتعلق بالجسم والحياة",
        ],
      },
      {
        id: "acad_inclination_family",
        q: "أقرب عائلة تخصصات إلى ميولك:",
        type: "single",
        options: [
          "العلوم الطبية والصحية (طب، صيدلة، تمريض، علاج طبيعي)",
          "الهندسة والتقنية (مدنية، كهربائية، ميكانيكية، حاسوب)",
          "تقنية المعلومات وعلوم الحاسب (برمجة، أمن سيبراني، بيانات، ذكاء اصطناعي)",
          "العلوم الأساسية (رياضيات، فيزياء، كيمياء، أحياء، فلك)",
          "إدارة الأعمال والاقتصاد (محاسبة، تمويل، تسويق، إدارة)",
          "القانون والعلوم السياسية والشريعة",
          "العلوم الإنسانية والاجتماعية (نفس، اجتماع، تاريخ، فلسفة)",
          "اللغات والترجمة والإعلام",
          "الفنون والتصميم والعمارة",
          "التعليم والتربية",
          "الزراعة والبيئة والعلوم الطبيعية التطبيقية",
          "السياحة والضيافة والخدمات",
        ],
      },
    ],
  },
  {
    key: "skills",
    title: "المهارات والقدرات",
    intro: "حدّد نقاط قوتك.",
    questions: [
      {
        id: "acad_skills_strength",
        q: "مهاراتك الأقوى (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: [
          "التفكير المنطقي والتحليل", "الحساب والأرقام",
          "الكتابة والتعبير اللغوي", "التواصل والإقناع",
          "القيادة وتنظيم الفرق", "الإبداع والتصميم البصري",
          "المهارات اليدوية والتقنية", "البحث وجمع المعلومات",
          "التعاطف ومساعدة الآخرين", "حفظ المعلومات وتذكّرها",
        ],
      },
      {
        id: "acad_grades_strength",
        q: "في أي مجال درجاتك أعلى عادةً؟",
        type: "single",
        options: [
          "المواد العلمية (رياضيات/فيزياء/كيمياء)",
          "المواد الأدبية (لغات/تاريخ/جغرافيا)",
          "المواد الحيوية (أحياء/صحة)",
          "المواد التقنية (حاسوب/تكنولوجيا)",
          "المواد الفنية والإبداعية",
          "متوسط في كل المواد",
        ],
      },
    ],
  },
  {
    key: "environment",
    title: "بيئة العمل والمسار",
    intro: "البيئة التي تزدهر فيها.",
    questions: [
      {
        id: "acad_work_environment",
        q: "بيئة العمل المثالية لك:",
        type: "single",
        options: [
          "مختبر علمي أو ورشة تقنية",
          "مكتب هادئ مع حاسوب",
          "ميدان وتعامل مباشر مع الناس",
          "مستشفى/عيادة أو مركز صحي",
          "استوديو فني/تصميم",
          "محكمة/مؤسسة قانونية أو إدارية",
          "مدرسة/جامعة/مركز تدريب",
          "الطبيعة والعمل الميداني الخارجي",
        ],
      },
      {
        id: "acad_study_intensity",
        q: "مدى استعدادك لسنوات دراسية طويلة وكثيفة:",
        type: "single",
        options: [
          "مستعد لـ 6+ سنوات دراسة كثيفة (طب، هندسة معمارية، دكتوراه...)",
          "مستعد لـ 4-5 سنوات بانتظام",
          "أفضّل دراسة 2-3 سنوات (دبلوم/تقني) ثم العمل",
          "أفضّل التعلم العملي والتدريب على الشهادات الطويلة",
        ],
      },
      {
        id: "acad_motivation",
        q: "ما الذي يحركك أكثر عند اختيار التخصص؟",
        type: "single",
        options: [
          "الشغف الشخصي والاستمتاع بالمجال",
          "العائد المادي والفرص الوظيفية",
          "إحداث أثر اجتماعي وخدمة الناس",
          "السمعة والمكانة الاجتماعية للتخصص",
          "سهولة الدراسة والقبول",
          "توافقه مع قدراتي ودرجاتي",
        ],
      },
    ],
  },
];

const TOTAL_STEPS = 1 + SECTIONS.length;

function AcademicMajorPage() {
  const navigate = useNavigate();
  const submitFn = useServerFn(submitAcademicMajor);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState({ name: "", age: "", stage: "" });
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;
  const currentSection = step > 0 ? SECTIONS[step - 1] : null;

  const toggle = (q: Question, opt: string) => {
    setSelections((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === "single") return { ...prev, [q.id]: [opt] };
      if (cur.includes(opt)) return { ...prev, [q.id]: cur.filter((x) => x !== opt) };
      if (q.maxSelect && cur.length >= q.maxSelect) return prev;
      return { ...prev, [q.id]: [...cur, opt] };
    });
  };

  const canProceed = () => {
    if (step === 0) return meta.stage.trim().length > 0;
    if (!currentSection) return false;
    return currentSection.questions.every((q) => (selections[q.id]?.length ?? 0) > 0);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const answers: Record<string, string> = {};
      for (const k of Object.keys(selections)) answers[k] = selections[k].join("، ");
      const sections = SECTIONS.map((s) => ({
        title: s.title,
        items: s.questions.map((q) => ({ q: q.q, a: (selections[q.id] ?? []).join("، ") || "—" })),
      }));
      const res = await submitFn({
        data: {
          name: meta.name || undefined,
          age: meta.age || undefined,
          stage: meta.stage || undefined,
          answers,
          sections,
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
            <GraduationCap className="h-3.5 w-3.5 text-gold" />
            اكتشف تخصصك الدراسي المناسب
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">اكتشف تخصصك الدراسي</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            تقييم ذكي يحلل ميولك ومهاراتك وبيئة العمل التي تفضّلها، ويقترح أفضل 5 تخصصات جامعية مناسبة لك مع نسبة توافق وخارطة طريق عملية.
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
              <h2 className="mt-6 font-serif text-2xl text-primary">يحلل الذكاء الاصطناعي ميولك...</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                نقوم بتجميع قائمة التخصصات الأنسب لك مع نسبة التوافق. قد يستغرق هذا حتى دقيقة.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-gold" />
                <h2 className="font-serif text-2xl text-primary">قبل أن نبدأ</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">معلومات اختيارية لتخصيص التقرير.</p>
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
                    placeholder="مثال: 17"
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
                    <option value="ثانوي - الصف الأول">ثانوي - الصف الأول</option>
                    <option value="ثانوي - الصف الثاني">ثانوي - الصف الثاني</option>
                    <option value="ثانوي - الصف الثالث">ثانوي - الصف الثالث (مقبل على الجامعة)</option>
                    <option value="طالب جامعي يفكر بتغيير التخصص">طالب جامعي يفكر بتغيير التخصص</option>
                    <option value="خريج يفكر بدراسة أخرى">خريج يفكر بدراسة أخرى</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          ) : currentSection ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <span className="text-xs font-medium text-gold">القسم {step} من {SECTIONS.length}</span>
                <h2 className="mt-1 font-serif text-2xl text-primary">{currentSection.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{currentSection.intro}</p>
              </div>

              <div className="space-y-8">
                {currentSection.questions.map((q, i) => {
                  const cur = selections[q.id] ?? [];
                  return (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-foreground">{i + 1}. {q.q}</label>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt) => {
                          const selected = cur.includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggle(q, opt)}
                              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-right text-sm transition ${
                                selected
                                  ? "border-gold bg-gold/10 text-primary"
                                  : "border-border bg-background hover:border-primary/40"
                              }`}
                            >
                              <span>{opt}</span>
                              {selected && <Check className="h-4 w-4 shrink-0 text-gold" />}
                            </button>
                          );
                        })}
                      </div>
                      {q.type === "multi" && (
                        <div className="mt-1.5 text-left text-xs text-muted-foreground">
                          {cur.length}{q.maxSelect ? `/${q.maxSelect}` : ""} مختار
                        </div>
                      )}
                    </div>
                  );
                })}
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
