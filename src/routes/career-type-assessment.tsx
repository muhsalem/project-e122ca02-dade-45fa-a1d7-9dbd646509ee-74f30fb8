import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
  Briefcase,
  Building2,
  Rocket,
  Laptop,
  Compass,
  GraduationCap,
  Hammer,
  HelpCircle,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitCareerType } from "@/lib/career-type.functions";

export const Route = createFileRoute("/career-type-assessment")({
  head: () => ({
    meta: [
      { title: "اكتشف مسارك المهنى — ISCO-08 و ASCO | بوصلة" },
      {
        name: "description",
        content:
          "تقييم تشخيصي شامل يدمج ميول RIASEC مع تحديد نوع المسار (وظيفة/ريادة/عمل حر/نشاط) وطبيعة العمل (مهنة/حِرفة)، ويربط نتيجتك بمسمى مهني وفق التصنيف الدولي ISCO-08 والتصنيف العربي المعياري للمهن ASCO.",
      },
    ],
  }),
  component: CareerTypePage,
});

type RiasecDim = "R" | "I" | "A" | "S" | "E" | "C";
const RIASEC_DIMS: { key: RiasecDim; ar: string; en: string; desc: string }[] = [
  { key: "R", ar: "الواقعي", en: "Realistic", desc: "أعمال يدوية/تقنية/آلات" },
  { key: "I", ar: "الاستقصائي", en: "Investigative", desc: "بحث وتحليل وحل مشكلات" },
  { key: "A", ar: "الفني", en: "Artistic", desc: "إبداع وتعبير وتصميم" },
  { key: "S", ar: "الاجتماعي", en: "Social", desc: "مساعدة وتعليم الآخرين" },
  { key: "E", ar: "المبادر", en: "Enterprising", desc: "إقناع وقيادة ومبيعات" },
  { key: "C", ar: "التقليدي", en: "Conventional", desc: "تنظيم بيانات وإجراءات" },
];

type Type =
  | "occupation"
  | "job"
  | "entrepreneur"
  | "freelance"
  | "profession"
  | "craft";

type Track = "job" | "entrepreneur" | "freelance" | "occupation";
type Nature = "profession" | "craft" | "undecided";
type Option = { label: string; type: Type };
type Question = { id: string; q: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "q1",
    q: "ما الذي يجذبك أكثر في فكرة العمل؟",
    options: [
      { label: "أي نشاط يوفّر دخلاً مستقرًا حتى لو كان عامًا", type: "occupation" },
      { label: "دور وظيفي واضح ومحدّد عند صاحب عمل معروف", type: "job" },
      { label: "تأسيس مشروع/شركة وتحمّل المخاطرة مقابل الملكية", type: "entrepreneur" },
      { label: "تقديم خدمات لعدة عملاء بمرونة كاملة", type: "freelance" },
      { label: "مهنة راقية تحتاج شهادات وتراخيص وخبرة طويلة", type: "profession" },
      { label: "إتقان مهارة يدوية أو فنية بالممارسة والخبرة", type: "craft" },
    ],
  },
  {
    id: "q2",
    q: "ما طبيعة العلاقة التي تفضّلها مع جهة العمل؟",
    options: [
      { label: "عمل يومي/أسبوعي حسب المتاح", type: "occupation" },
      { label: "عقد طويل الأمد مع صاحب عمل واحد", type: "job" },
      { label: "أنا صاحب العمل، أوظّف غيري", type: "entrepreneur" },
      { label: "عقود قصيرة مع عملاء متعددين", type: "freelance" },
      { label: "علاقة تعاقدية احترافية محكومة بمعايير المهنة", type: "profession" },
      { label: "علاقة مباشرة مع الزبون لإنجاز قطعة أو منتج", type: "craft" },
    ],
  },
  {
    id: "q3",
    q: "كيف تتعامل مع المخاطرة المالية؟",
    options: [
      { label: "أتجنبها قدر الإمكان وأقبل بأي دخل متاح", type: "occupation" },
      { label: "أريد راتبًا مضمونًا وتأمينًا وإجازات", type: "job" },
      { label: "مستعد لأخسر سنوات/مالاً مقابل فرصة كبرى", type: "entrepreneur" },
      { label: "أقبل بدخل متذبذب مقابل المرونة", type: "freelance" },
      { label: "أتعاب احترافية مرتفعة مقابل سنوات تأهيل طويلة", type: "profession" },
      { label: "دخل متوسط لكنه مستقر من بيع منتجاتي/خدمتي", type: "craft" },
    ],
  },
  {
    id: "q4",
    q: "أين تفضّل أن تنجز عملك يوميًا؟",
    options: [
      { label: "أي مكان توفّره الفرصة", type: "occupation" },
      { label: "مكتب الشركة في مواعيد ثابتة", type: "job" },
      { label: "مقر شركتي/مشروعي الذي أبنيه", type: "entrepreneur" },
      { label: "من البيت/أي مقهى/أي مدينة", type: "freelance" },
      { label: "عيادة/مكتب احترافي/مختبر/محكمة", type: "profession" },
      { label: "ورشة أو استوديو فيه أدواتي", type: "craft" },
    ],
  },
  {
    id: "q5",
    q: "كم سنة أنت مستعد للاستثمار في التأهيل قبل الدخل المرتفع؟",
    options: [
      { label: "أقل ما يمكن، أبحث عن دخل سريع", type: "occupation" },
      { label: "دبلوم/شهادة أساسية تفتح لي وظيفة", type: "job" },
      { label: "سنوات بناء المشروع قبل الربح", type: "entrepreneur" },
      { label: "بناء سمعة وبورتفوليو عبر مشاريع صغيرة", type: "freelance" },
      { label: "5+ سنوات جامعة وتدريب وترخيص", type: "profession" },
      { label: "3-7 سنوات تتلمذ وممارسة يومية", type: "craft" },
    ],
  },
  {
    id: "q6",
    q: "كيف ترى نفسك بعد 10 سنوات؟",
    options: [
      { label: "أعمل في أي مجال يوفر دخلاً كافيًا", type: "occupation" },
      { label: "مدير في شركة كبرى بمنصب مرموق", type: "job" },
      { label: "مؤسس شركة ناجحة توظّف عشرات الناس", type: "entrepreneur" },
      { label: "خبير مستقل مطلوب من عملاء عالميين", type: "freelance" },
      { label: "خبير معتمد ومرجع في تخصصي", type: "profession" },
      { label: "حِرفي ماهر معروف بجودة منتجاتي", type: "craft" },
    ],
  },
  {
    id: "q7",
    q: "ما الذي يحفّزك أكثر؟",
    options: [
      { label: "الكسب اليومي البسيط", type: "occupation" },
      { label: "الترقية والاستقرار الوظيفي", type: "job" },
      { label: "بناء شيء من الصفر وامتلاكه", type: "entrepreneur" },
      { label: "حرية اختيار العملاء والمشاريع", type: "freelance" },
      { label: "الاعتراف العلمي والمهني واللقب", type: "profession" },
      { label: "إتقان المهارة وفخر الصنعة", type: "craft" },
    ],
  },
  {
    id: "q8",
    q: "كيف تتعامل مع المسؤولية القيادية؟",
    options: [
      { label: "أفضّل ألا أتحمل مسؤولية كبيرة", type: "occupation" },
      { label: "أتدرّج في السلم الإداري للشركة", type: "job" },
      { label: "أقود فريقي وأبني هيكلي الخاص", type: "entrepreneur" },
      { label: "أقود نفسي فقط ولا أوظف غيري", type: "freelance" },
      { label: "أتحمل مسؤولية مهنية تجاه العميل/المريض/الموكل", type: "profession" },
      { label: "أتحمل مسؤولية جودة منتجي تجاه الزبون", type: "craft" },
    ],
  },
  {
    id: "q9",
    q: "ما شكل الدخل الذي تطمح إليه؟",
    options: [
      { label: "دخل يومي/أسبوعي يكفي للحاجات", type: "occupation" },
      { label: "راتب شهري ثابت + مزايا + تأمين", type: "job" },
      { label: "أرباح المشروع + قيمة الحصص لاحقًا", type: "entrepreneur" },
      { label: "أتعاب مرنة لكل مشروع/ساعة", type: "freelance" },
      { label: "أتعاب مهنية مرتفعة لكل استشارة/خدمة", type: "profession" },
      { label: "دخل من بيع قطع/خدمات الورشة", type: "craft" },
    ],
  },
  {
    id: "q10",
    q: "كيف تصف نفسك للآخرين عند السؤال؟",
    options: [
      { label: "أعمل في أي شيء يوفّر دخلاً", type: "occupation" },
      { label: "موظف في شركة [...]", type: "job" },
      { label: "أنا مؤسس/شريك في شركة [...]", type: "entrepreneur" },
      { label: "أنا مستقل أعمل في [...]", type: "freelance" },
      { label: "أنا [طبيب/مهندس/محامٍ/أكاديمي]", type: "profession" },
      { label: "أنا [نجار/خزّاف/خبّاز/خياط/صانع]", type: "craft" },
    ],
  },
  {
    id: "q11",
    q: "أكثر شيء يُرهقك في العمل:",
    options: [
      { label: "عدم انتظام الفرص", type: "occupation" },
      { label: "البيروقراطية والاجتماعات", type: "job" },
      { label: "ضغط رأس المال والمسؤولية تجاه الفريق", type: "entrepreneur" },
      { label: "ملاحقة العملاء وعدم استقرار الدخل", type: "freelance" },
      { label: "تحديث المعرفة المتخصصة باستمرار", type: "profession" },
      { label: "بطء إتقان المهارة لمستوى الاحتراف", type: "craft" },
    ],
  },
  {
    id: "q12",
    q: "إن خُيّرت بين هذه الخيارات في عمر 25، تختار:",
    options: [
      { label: "عمل سريع يدرّ دخلاً فورًا", type: "occupation" },
      { label: "وظيفة في شركة كبرى براتب جيد", type: "job" },
      { label: "إطلاق مشروعك الخاص مع شريك", type: "entrepreneur" },
      { label: "الاستقلال والعمل عن بُعد لعملاء متعددين", type: "freelance" },
      { label: "إكمال الدراسات العليا والتخصص", type: "profession" },
      { label: "التتلمذ على يد حِرفي ماهر", type: "craft" },
    ],
  },
];

const TYPE_INFO: Record<Type, { ar: string; en: string; color: string }> = {
  occupation: { ar: "نشاط عام", en: "Occupation", color: "text-blue-500" },
  job: { ar: "وظيفة", en: "Job", color: "text-emerald-500" },
  entrepreneur: { ar: "ريادة أعمال", en: "Entrepreneur", color: "text-purple-500" },
  freelance: { ar: "عمل حر", en: "Freelance", color: "text-cyan-500" },
  profession: { ar: "مهنة احترافية", en: "Profession", color: "text-amber-500" },
  craft: { ar: "حِرفة", en: "Craft", color: "text-rose-500" },
};

const TRACK_OPTIONS: { value: Track; ar: string; en: string; desc: string; Icon: typeof Briefcase }[] = [
  {
    value: "job",
    ar: "وظيفة",
    en: "Job",
    desc: "راتب ثابت ومزايا والتزام بصاحب عمل واحد. استقرار ومخاطر منخفضة.",
    Icon: Building2,
  },
  {
    value: "entrepreneur",
    ar: "ريادة أعمال",
    en: "Entrepreneur",
    desc: "تأسيس مشروع/شركة، مخاطرة مالية مقابل ملكية وعائد وتأثير أكبر.",
    Icon: Rocket,
  },
  {
    value: "freelance",
    ar: "عمل حر مستقل",
    en: "Freelance",
    desc: "خدمات لعملاء متعددين بمرونة كاملة في الوقت والمكان والسعر.",
    Icon: Laptop,
  },
  {
    value: "occupation",
    ar: "نشاط مهني عام",
    en: "Occupation",
    desc: "أي عمل لكسب الرزق دون التزام بهيكل مهني محدد.",
    Icon: Compass,
  },
];

const NATURE_OPTIONS: { value: Nature; ar: string; en: string; desc: string; Icon: typeof Briefcase }[] = [
  {
    value: "profession",
    ar: "مهنة احترافية",
    en: "Profession",
    desc: "تتطلب تعليمًا عاليًا وتدريبًا متخصصًا وترخيصًا (طب، هندسة، محاماة...).",
    Icon: GraduationCap,
  },
  {
    value: "craft",
    ar: "حِرفة",
    en: "Craft",
    desc: "تعتمد على المهارة اليدوية والممارسة الطويلة (نجارة، خزف، خياطة...).",
    Icon: Hammer,
  },
  {
    value: "undecided",
    ar: "لم أحسم بعد",
    en: "Undecided",
    desc: "أحتاج التقييم ليساعدني في تحديد ما إن كنت أميل لمهنة أم حِرفة.",
    Icon: HelpCircle,
  },
];

function CareerTypePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerType);

  // Steps: 0=meta, 1=track, 2=nature, 3..N+2 = questions
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [nature, setNature] = useState<Nature | null>(null);
  const [answers, setAnswers] = useState<Record<string, { type: Type; label: string }>>({});
  const [riasec, setRiasec] = useState<Record<RiasecDim, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const META_STEPS = 4; // meta + track + nature + RIASEC
  const totalSteps = META_STEPS + QUESTIONS.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const scores = useMemo(() => {
    const s: Record<Type, number> = {
      occupation: 0,
      job: 0,
      entrepreneur: 0,
      freelance: 0,
      profession: 0,
      craft: 0,
    };
    Object.values(answers).forEach((a) => {
      s[a.type] += 1;
    });
    const total = QUESTIONS.length || 1;
    const pct = (n: number) => Math.round((n / total) * 100);
    return {
      occupation: pct(s.occupation),
      job: pct(s.job),
      entrepreneur: pct(s.entrepreneur),
      freelance: pct(s.freelance),
      profession: pct(s.profession),
      craft: pct(s.craft),
    };
  }, [answers]);

  const qIndex = step - META_STEPS; // -1 means we're in meta
  const currentQuestion = qIndex >= 0 && qIndex < QUESTIONS.length ? QUESTIONS[qIndex] : null;

  const riasecComplete = RIASEC_DIMS.every((d) => riasec[d.key] > 0);
  const canNext = (() => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return !!track;
    if (step === 2) return !!nature;
    if (step === 3) return riasecComplete;
    if (currentQuestion) return !!answers[currentQuestion.id];
    return false;
  })();

  async function handleSubmit() {
    if (!track || !nature) return;
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
          track,
          nature,
          scores,
          riasec,
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <Briefcase className="h-4 w-4 text-gold" />
            <span>تقييم تشخيصي شامل مرتبط بـ ISCO-08 و ASCO</span>
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            اكتشف مسارك المهنى
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/70">
            تقييم مدمج: مسارك (وظيفة/ريادة/عمل حر/نشاط) + طبيعة العمل (مهنة/حِرفة) + ميولك RIASEC،
            ثم ربط نتيجتك بمسمى مهني وفق التصنيف الدولي ISCO-08 والتصنيف العربي المعياري للمهن ASCO.
          </p>
        </div>

        <ComplementaryTools tools={["clarity"]} title="مدمج في رحلتك" />

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
          {/* Step 0: Meta */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary">بياناتك</h2>
              <p className="text-sm text-foreground/70">
                المعلومات تُستخدم فقط لتخصيص التقرير، وتُحفظ بشكل سري مرتبط بكود تقريرك.
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

          {/* Step 1: Track */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الأول</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                ما المسار الذي تميل إليه؟
              </h2>
              <p className="text-sm text-foreground/70">
                اختر طبيعة علاقتك المفضلة بالعمل. هذه الإجابة الأولى التي تحدد إطار تقريرك.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {TRACK_OPTIONS.map((opt) => {
                  const isSel = track === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTrack(opt.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-right transition-all ${
                        isSel
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isSel ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}>
                        <opt.Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {opt.ar} <span className="text-xs text-foreground/50">({opt.en})</span>
                        </div>
                        <div className="mt-1 text-xs text-foreground/70">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Nature */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الثاني</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                هل ترى عملك مهنة احترافية أم حِرفة؟
              </h2>
              <p className="text-sm text-foreground/70">
                بعد اختيار المسار، حدّد طبيعة العمل. لا بأس باختيار "لم أحسم بعد".
              </p>
              <div className="grid gap-3">
                {NATURE_OPTIONS.map((opt) => {
                  const isSel = nature === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setNature(opt.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-right transition-all ${
                        isSel
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isSel ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}>
                        <opt.Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {opt.ar} <span className="text-xs text-foreground/50">({opt.en})</span>
                        </div>
                        <div className="mt-1 text-xs text-foreground/70">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: RIASEC mini */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الثالث</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                ميولك المهنية (RIASEC — Holland)
              </h2>
              <p className="text-sm text-foreground/70">
                قيّم مدى ميلك إلى كلٍ من الأبعاد الستة (1 = منخفض جدًا، 5 = مرتفع جدًا). هذه الميول
                ستُربط لاحقًا بمسمى مهني محدد وفق ISCO-08 و ASCO.
              </p>
              <div className="space-y-3">
                {RIASEC_DIMS.map((d) => (
                  <div key={d.key} className="rounded-xl border border-border bg-background p-4">
                    <div className="mb-2 flex items-baseline justify-between">
                      <div>
                        <span className="font-semibold text-foreground">{d.ar}</span>{" "}
                        <span className="text-xs text-foreground/50">({d.en})</span>
                        <div className="text-xs text-foreground/60">{d.desc}</div>
                      </div>
                      <span className="text-xs text-foreground/60">{riasec[d.key] || "—"}/5</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((v) => {
                        const sel = riasec[d.key] === v;
                        return (
                          <button
                            key={v}
                            onClick={() => setRiasec({ ...riasec, [d.key]: v })}
                            className={`rounded-md border py-2 text-sm font-medium transition-all ${
                              sel
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/40"
                            }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {currentQuestion && (
            <div className="space-y-4">
              <div className="text-xs text-foreground/60">
                السؤال {qIndex + 1} من {QUESTIONS.length}
              </div>
              <h2 className="font-serif text-xl font-bold text-primary md:text-2xl">
                {currentQuestion.q}
              </h2>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt, i) => {
                  const isSel = answers[currentQuestion.id]?.label === opt.label;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
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
          )}

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

            {!isLastStep ? (
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
        {Object.keys(answers).length > 0 && qIndex >= 0 && (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-xs font-semibold text-foreground/70">
              ميولك حتى الآن
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
