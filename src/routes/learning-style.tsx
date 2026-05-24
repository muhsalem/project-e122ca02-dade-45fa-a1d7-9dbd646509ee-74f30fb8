import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, BookOpen, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitLearningStyle } from "@/lib/learning-style.functions";

export const Route = createFileRoute("/learning-style")({
  head: () => ({
    meta: [
      { title: "اكتشف نمط تعلمك وتخصصك الدراسي بالذكاء الاصطناعي — بوصلة" },
      { name: "description", content: "تقييم متكامل يكشف نمط تعلمك وفق 9 نماذج عالمية ويقترح أنسب التخصصات الدراسية الجامعية لك، مع تقرير شامل وكود لمناقشته مع مرشد نفسي." },
    ],
  }),
  component: LearningStylePage,
});

type Question = {
  id: string;
  q: string;
  type: "single" | "multi";
  options: string[];
  maxSelect?: number;
};
type Section = { key: string; title: string; intro: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    key: "vark",
    title: "نموذج VARK (القنوات الحسية)",
    intro: "كيف تستقبل المعلومة وتعالجها؟",
    questions: [
      {
        id: "vark_learn_best",
        q: "أتعلم أفضل عندما:",
        type: "single",
        options: [
          "أشاهد رسومًا/مخططات/فيديو (بصري)",
          "أستمع لشرح أو محاضرة أو نقاش (سمعي)",
          "أقرأ نصًا وأكتب ملخصات (قرائي-كتابي)",
          "أجرّب بيدي وأتحرك وأطبّق (حركي)",
        ],
      },
      {
        id: "vark_remember",
        q: "أتذكر المعلومة أكثر عندما:",
        type: "single",
        options: [
          "أتخيلها كصورة أو خريطة ذهنية",
          "أعيدها بصوت مرتفع أو أناقشها",
          "أكتبها بأسلوبي وأراجع ملاحظاتي",
          "أمارسها عمليًا أو أربطها بحركة",
        ],
      },
      {
        id: "vark_directions",
        q: "حين أتعلم طريقة لمكان جديد أفضّل:",
        type: "single",
        options: ["خريطة مرسومة", "شخص يصف لي الطريق", "تعليمات مكتوبة خطوة بخطوة", "أن أمشي/أقود بنفسي لأحفظه"],
      },
      {
        id: "vark_explain",
        q: "حين أشرح فكرة للآخرين، أميل إلى:",
        type: "single",
        options: ["الرسم وتوضيح بصري", "الشرح الشفوي والقصص", "إعطاء مستند مكتوب", "تجربة عملية وتطبيق مباشر"],
      },
    ],
  },
  {
    key: "kolb",
    title: "نموذج كولب Kolb LSI",
    intro: "كيف تمر بدورة التعلم التجريبي؟",
    questions: [
      {
        id: "kolb_approach",
        q: "أقرب طريقة تتعامل بها مع موضوع جديد:",
        type: "single",
        options: [
          "أعيش التجربة وأحس بها أولًا (CE)",
          "أتأمل وأراقب من بعيد قبل أن أتصرف (RO)",
          "أبني نموذجًا مفاهيميًا منطقيًا (AC)",
          "أجرّب وأطبّق وأرى النتيجة (AE)",
        ],
      },
      {
        id: "kolb_strength",
        q: "نقطة قوتك الأبرز عند التعلم:",
        type: "single",
        options: [
          "توليد أفكار متعددة من زوايا مختلفة (متباعد)",
          "بناء نماذج ونظريات مترابطة (مستوعب)",
          "تطبيق الأفكار لحل مشكلات محددة (متقارب)",
          "التكيّف السريع والتعلم بالتجربة (متكيف)",
        ],
      },
      {
        id: "kolb_pref",
        q: "في ورشة عمل تفضّل:",
        type: "single",
        options: [
          "العصف الذهني والنقاش المفتوح",
          "محاضرة منظمة بمراجع وقراءات",
          "حل مشكلات وتمارين عملية محددة",
          "مشاريع ميدانية وتجارب حية",
        ],
      },
    ],
  },
  {
    key: "honey",
    title: "Honey & Mumford LSQ",
    intro: "أربعة أنماط: ناشط، متأمل، منظّر، براغماتي.",
    questions: [
      {
        id: "honey_new",
        q: "عندما تواجه مهمة جديدة:",
        type: "single",
        options: [
          "أندفع وأجرّب فورًا وأتعلم من الأخطاء (ناشط)",
          "أتراجع لأراقب وأجمع معلومات (متأمل)",
          "أبحث عن النظرية والإطار وراءها (منظّر)",
          "أبحث عن تطبيق عملي واضح (براغماتي)",
        ],
      },
      {
        id: "honey_meeting",
        q: "في الاجتماعات أكون:",
        type: "single",
        options: ["متحمسًا أطرح أفكارًا كثيرة", "أستمع أكثر مما أتكلم", "أحلل وأناقش المنطق", "أركز على ما يمكن تنفيذه"],
      },
      {
        id: "honey_dislike",
        q: "أكره أكثر شيء حين أتعلم:",
        type: "single",
        options: ["التكرار والروتين البطيء", "أن أُجبر على القرار قبل التأمل", "الفوضى والقفز بين المواضيع", "النظريات المجردة بلا تطبيق"],
      },
    ],
  },
  {
    key: "ils",
    title: "Felder–Silverman (ILS)",
    intro: "أربعة محاور تكشف نمط معالجتك للمعلومات.",
    questions: [
      {
        id: "ils_active",
        q: "أفهم المحتوى أكثر عندما:",
        type: "single",
        options: ["أناقشه مع غيري وأطبّقه (نشط)", "أفكر فيه وحدي بهدوء (تأملي)"],
      },
      {
        id: "ils_sensing",
        q: "أميل أكثر إلى:",
        type: "single",
        options: ["الحقائق والتفاصيل الملموسة (حسي)", "النظريات والاحتمالات والمفاهيم (حدسي)"],
      },
      {
        id: "ils_visual",
        q: "أستوعب أفضل من خلال:",
        type: "single",
        options: ["الصور والمخططات والرسوم (بصري)", "الكلام والشرح اللفظي والقراءة (لفظي)"],
      },
      {
        id: "ils_seq",
        q: "أتقدّم في الفهم عبر:",
        type: "single",
        options: ["خطوات متسلسلة منطقية (تسلسلي)", "قفزات شاملة ثم أربط الصورة الكبيرة (شمولي)"],
      },
    ],
  },
  {
    key: "mi",
    title: "الذكاءات المتعددة (Gardner)",
    intro: "أي الذكاءات أقرب إليك؟",
    questions: [
      {
        id: "mi_top",
        q: "أبرز الذكاءات لديك (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: [
          "لغوي (كلمات وكتابة)",
          "منطقي/رياضي (أرقام وتحليل)",
          "بصري/مكاني (تصور وتصميم)",
          "موسيقي (إيقاع ونغمة)",
          "جسدي/حركي (رياضة وحرف)",
          "اجتماعي (تواصل وإقناع)",
          "ذاتي (وعي ذاتي وتأمل)",
          "طبيعي (طبيعة وكائنات)",
          "وجودي (أسئلة كبرى/فلسفية)",
        ],
      },
      {
        id: "mi_activity",
        q: "النشاط الذي تستمتع به أكثر:",
        type: "single",
        options: ["الكتابة والقراءة", "حل الألغاز والمسائل", "التصميم والرسم", "العزف أو الاستماع للموسيقى", "الرياضة أو الحرف اليدوية", "العمل ضمن فريق", "التأمل والاستبطان", "النشاطات في الطبيعة"],
      },
      {
        id: "mi_subject",
        q: "أكثر مادة دراسية أحبها/كنت تحبها:",
        type: "single",
        options: ["اللغات والأدب", "الرياضيات/الفيزياء", "الفنون والتصميم", "الموسيقى", "التربية البدنية/المختبرات", "علوم اجتماعية", "الفلسفة/علم النفس", "الأحياء/الجغرافيا"],
      },
    ],
  },
  {
    key: "gregorc",
    title: "Gregorc Style Delineator",
    intro: "كيف ترتب المعلومات وتدركها؟",
    questions: [
      {
        id: "gregorc_perceive",
        q: "أدرك المعلومات أكثر عبر:",
        type: "single",
        options: ["الحواس الملموسة والواقع المادي", "العقل والمفاهيم المجردة"],
      },
      {
        id: "gregorc_order",
        q: "أرتّب المعلومات بطريقة:",
        type: "single",
        options: ["متسلسلة منطقية خطوة بخطوة", "عشوائية حدسية تقفز بين النقاط"],
      },
      {
        id: "gregorc_profile",
        q: "أقرب وصف لك:",
        type: "single",
        options: [
          "عملي منظم يحب التعليمات الواضحة (ملموس متسلسل)",
          "تحليلي يحب القراءة والتفكير المنهجي (مجرد متسلسل)",
          "حدسي عاطفي يحب النقاش والمعنى (مجرد عشوائي)",
          "مغامر يجرّب ويبتكر بحرية (ملموس عشوائي)",
        ],
      },
    ],
  },
  {
    key: "dunn",
    title: "Dunn & Dunn LSI",
    intro: "تفضيلاتك الشخصية أثناء الدراسة.",
    questions: [
      {
        id: "dunn_social",
        q: "تفضل الدراسة:",
        type: "single",
        options: ["وحدي تمامًا", "مع زميل واحد", "في مجموعة صغيرة", "تحت إشراف معلم/مرشد"],
      },
      {
        id: "dunn_time",
        q: "أعلى تركيز لديك في:",
        type: "single",
        options: ["الصباح الباكر", "منتصف النهار", "بعد الظهر", "المساء/الليل المتأخر"],
      },
      {
        id: "dunn_movement",
        q: "خلال الدراسة تحتاج إلى:",
        type: "single",
        options: ["الجلوس بثبات تام", "حركة بسيطة (مشي ذهابًا وإيابًا)", "فواصل حركية متكررة", "نشاط حركي مستمر (رياضة خفيفة)"],
      },
    ],
  },
  {
    key: "peps",
    title: "PEPS (التفضيلات البيئية والإنتاجية)",
    intro: "البيئة التي تنتج فيها أفضل.",
    questions: [
      {
        id: "peps_light",
        q: "تفضل الإضاءة:",
        type: "single",
        options: ["ساطعة جدًا", "متوسطة", "خافتة وهادئة"],
      },
      {
        id: "peps_sound",
        q: "الصوت أثناء الدراسة:",
        type: "single",
        options: ["صمت تام", "موسيقى هادئة في الخلفية", "موسيقى نشطة/إيقاع", "ضوضاء عامة (مقهى)"],
      },
      {
        id: "peps_temp",
        q: "تفضل الحرارة:",
        type: "single",
        options: ["باردة", "معتدلة", "دافئة"],
      },
      {
        id: "peps_structure",
        q: "هيكلية المهام تفضّلها:",
        type: "single",
        options: ["محددة جدًا بتعليمات دقيقة", "خطة مرنة بإطار عام", "حرية كاملة بلا قيود"],
      },
    ],
  },
  {
    key: "cognitive",
    title: "الأساليب المعرفية (Cognitive Styles)",
    intro: "كيف يعمل عقلك في معالجة المعلومات؟",
    questions: [
      {
        id: "cog_field",
        q: "حين تحلّل موقفًا، أنت أقرب إلى:",
        type: "single",
        options: [
          "رؤية الصورة الكبيرة كاملة (معتمد على المجال)",
          "عزل العناصر وتحليلها بمعزل عن السياق (مستقل عن المجال)",
        ],
      },
      {
        id: "cog_holistic",
        q: "تفضّل التفكير:",
        type: "single",
        options: ["شموليًا يربط كل شيء بكل شيء", "تحليليًا يقسم المشكلة لأجزاء صغيرة"],
      },
      {
        id: "cog_impulsive",
        q: "اتخاذ القرار لديك يميل إلى:",
        type: "single",
        options: ["السرعة والاندفاع (اندفاعي)", "البطء والتأمل قبل القرار (تأملي)"],
      },
      {
        id: "cog_motivation",
        q: "أكثر ما يحفّزك على التعلم:",
        type: "single",
        options: ["الفضول الذاتي", "التحدي والمنافسة", "الجائزة/التقدير الخارجي", "خدمة هدف أكبر/معنى"],
      },
    ],
  },
];

const TOTAL_STEPS = 1 + SECTIONS.length;

function LearningStylePage() {
  const navigate = useNavigate();
  const submitFn = useServerFn(submitLearningStyle);
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
        items: s.questions.map((q) => ({
          q: q.q,
          a: (selections[q.id] ?? []).join("، ") || "—",
        })),
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
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            اكتشف نمط تعلمك وتخصصك الدراسي
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">اكتشف نمط تعلمك وتخصصك الدراسي</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            تقييم متكامل يجمع 9 نماذج عالمية لأنماط التعلم (VARK، Kolb، Honey & Mumford، Felder–Silverman، الذكاءات المتعددة، Gregorc، Dunn & Dunn، PEPS، الأساليب المعرفية) إضافة إلى قسم خاص باكتشاف التخصص الدراسي المناسب لك، ويُصدر تقريرًا تفصيليًا بكود لمناقشته مع مرشدك النفسي.
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
              <h2 className="mt-6 font-serif text-2xl text-primary">يحلل الذكاء الاصطناعي نمط تعلمك...</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                نقوم بتجميع تقريرك الشامل وإصدار كود فريد لمناقشته مع المرشد. قد يستغرق هذا حتى دقيقة.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-gold" />
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
                    <option value="متعلم ذاتي">متعلم ذاتي</option>
                    <option value="موظف يطوّر مهاراته">موظف يطوّر مهاراته</option>
                    <option value="معلم/مدرّب">معلم/مدرّب</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          ) : currentSection ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <span className="text-xs font-medium text-gold">النموذج {step} من {SECTIONS.length}</span>
                <h2 className="mt-1 font-serif text-2xl text-primary">{currentSection.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{currentSection.intro}</p>
              </div>

              <div className="space-y-8">
                {currentSection.questions.map((q, i) => {
                  const cur = selections[q.id] ?? [];
                  return (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-foreground">
                        {i + 1}. {q.q}
                      </label>
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
