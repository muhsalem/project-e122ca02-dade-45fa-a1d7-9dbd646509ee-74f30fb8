import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Landmark,
  Building2,
  HeartHandshake,
  Sparkles,
  Layers,
  ListTree,
  BookOpen,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitSectorGuide } from "@/lib/sector-guide.functions";

export const Route = createFileRoute("/sector-guide")({
  head: () => ({
    meta: [
      { title: "دليل اختيار القطاع والصناعات — ISCO · GICS · NAICS | بوصلة" },
      {
        name: "description",
        content:
          "اختر القطاع (حكومي / خاص ربحي / أهلي) ومسمّاك الوظيفي، واحصل على تقرير يربطك بنظام الأيزكو الدولي والتصنيف العربي للمهن، وترشيح GICS (Sector/Industry Group/Industry/Sub-Industry) وربطها بنشاط الأعمال NAICS.",
      },
    ],
  }),
  component: SectorGuidePage,
});

type SectorType = "government" | "private";
type PrivateType = "for_profit" | "non_profit";

const SECTOR_OPTIONS: {
  value: SectorType;
  ar: string;
  en: string;
  desc: string;
  Icon: typeof Landmark;
}[] = [
  {
    value: "government",
    ar: "القطاع الحكومي",
    en: "Public Sector",
    desc: "وزارات، هيئات، شركات قابضة حكومية، قطاع عام. استقرار وأمان وظيفي ومعاش تقاعدي.",
    Icon: Landmark,
  },
  {
    value: "private",
    ar: "القطاع الخاص",
    en: "Private Sector",
    desc: "شركات تجارية، مؤسسات أهلية، منظمات غير ربحية. مرونة وحوافز أعلى ومخاطر أكبر.",
    Icon: Building2,
  },
];

const PRIVATE_OPTIONS: {
  value: PrivateType;
  ar: string;
  en: string;
  desc: string;
  Icon: typeof Building2;
}[] = [
  {
    value: "for_profit",
    ar: "ربحي (شركات تجارية)",
    en: "For-Profit",
    desc: "شركات مساهمة، ذات مسؤولية محدودة، ناشئة. هدفها الربح وزيادة قيمة السهم.",
    Icon: Building2,
  },
  {
    value: "non_profit",
    ar: "أهلي / غير ربحي",
    en: "Non-Profit / NGO",
    desc: "جمعيات أهلية، مؤسسات وقفية، منظمات تنموية. هدفها الأثر المجتمعي لا الربح.",
    Icon: HeartHandshake,
  },
];

// مجموعات GICS الـ 11 الكبرى — كمرجع بصري للمستخدم
const GICS_SECTORS = [
  { code: "10", ar: "الطاقة", en: "Energy" },
  { code: "15", ar: "المواد", en: "Materials" },
  { code: "20", ar: "الصناعات", en: "Industrials" },
  { code: "25", ar: "السلع الاستهلاكية الكمالية", en: "Consumer Discretionary" },
  { code: "30", ar: "السلع الاستهلاكية الأساسية", en: "Consumer Staples" },
  { code: "35", ar: "الرعاية الصحية", en: "Health Care" },
  { code: "40", ar: "المالية", en: "Financials" },
  { code: "45", ar: "تقنية المعلومات", en: "Information Technology" },
  { code: "50", ar: "خدمات الاتصالات", en: "Communication Services" },
  { code: "55", ar: "المرافق", en: "Utilities" },
  { code: "60", ar: "العقارات", en: "Real Estate" },
];

// NAICS Sectors (20 sector)
const NAICS_SECTORS = [
  { code: "11", ar: "الزراعة، الغابات، الصيد", en: "Agriculture, Forestry, Fishing" },
  { code: "21", ar: "التعدين واستخراج النفط والغاز", en: "Mining, Oil & Gas Extraction" },
  { code: "22", ar: "المرافق", en: "Utilities" },
  { code: "23", ar: "الإنشاءات", en: "Construction" },
  { code: "31-33", ar: "الصناعات التحويلية", en: "Manufacturing" },
  { code: "42", ar: "تجارة الجملة", en: "Wholesale Trade" },
  { code: "44-45", ar: "تجارة التجزئة", en: "Retail Trade" },
  { code: "48-49", ar: "النقل والتخزين", en: "Transportation & Warehousing" },
  { code: "51", ar: "المعلومات", en: "Information" },
  { code: "52", ar: "المالية والتأمين", en: "Finance & Insurance" },
  { code: "53", ar: "العقارات والإيجار", en: "Real Estate, Rental & Leasing" },
  { code: "54", ar: "الخدمات المهنية والعلمية والتقنية", en: "Professional, Scientific & Technical" },
  { code: "55", ar: "إدارة الشركات", en: "Management of Companies" },
  { code: "56", ar: "الخدمات الإدارية ومعالجة النفايات", en: "Administrative & Waste Services" },
  { code: "61", ar: "الخدمات التعليمية", en: "Educational Services" },
  { code: "62", ar: "الرعاية الصحية والمساعدة الاجتماعية", en: "Health Care & Social Assistance" },
  { code: "71", ar: "الفنون والترفيه", en: "Arts, Entertainment & Recreation" },
  { code: "72", ar: "خدمات الإقامة والمأكولات", en: "Accommodation & Food Services" },
  { code: "81", ar: "خدمات أخرى", en: "Other Services" },
  { code: "92", ar: "الإدارة العامة", en: "Public Administration" },
];

// ISCO-08 Major Groups (10)
const ISCO_MAJORS = [
  { code: "0", ar: "المهن العسكرية", en: "Armed Forces Occupations" },
  { code: "1", ar: "المديرون", en: "Managers" },
  { code: "2", ar: "المهنيون / الاختصاصيون", en: "Professionals" },
  { code: "3", ar: "الفنيون والمساعدون", en: "Technicians & Associate Professionals" },
  { code: "4", ar: "الكتبة والموظفون الإداريون", en: "Clerical Support Workers" },
  { code: "5", ar: "عمال الخدمات والبيع", en: "Services & Sales Workers" },
  { code: "6", ar: "العمال المهرة في الزراعة والغابات", en: "Skilled Agricultural Workers" },
  { code: "7", ar: "عمال الحرف والمهن المرتبطة بها", en: "Craft & Related Trades Workers" },
  { code: "8", ar: "مشغلو المصانع والآلات", en: "Plant & Machine Operators" },
  { code: "9", ar: "المهن الأولية", en: "Elementary Occupations" },
];

function SectorGuidePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitSectorGuide);

  // Steps: 0=meta, 1=sectorType, 2=privateType(if private), 3=jobTitle, 4=details, 5=review
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [sectorType, setSectorType] = useState<SectorType | null>(null);
  const [privateType, setPrivateType] = useState<PrivateType | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [educationField, setEducationField] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // dynamic steps array
  const steps: string[] = [
    "بياناتك",
    "نوع القطاع",
    ...(sectorType === "private" ? ["نوع القطاع الخاص"] : []),
    "المسمى الوظيفي",
    "التفاصيل التكميلية",
    "المراجعة والإرسال",
  ];
  const totalSteps = steps.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  // Map step index to logical step name (handles skipping privateType)
  const logicalStep = (() => {
    if (step === 0) return "meta";
    if (step === 1) return "sector";
    if (sectorType === "private") {
      if (step === 2) return "private";
      if (step === 3) return "job";
      if (step === 4) return "details";
      if (step === 5) return "review";
    } else {
      if (step === 2) return "job";
      if (step === 3) return "details";
      if (step === 4) return "review";
    }
    return "review";
  })();

  const canNext = (() => {
    switch (logicalStep) {
      case "meta":
        return name.trim().length > 0;
      case "sector":
        return !!sectorType;
      case "private":
        return !!privateType;
      case "job":
        return jobTitle.trim().length >= 2;
      case "details":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  })();

  async function handleSubmit() {
    if (!sectorType || jobTitle.trim().length < 2) return;
    if (sectorType === "private" && !privateType) return;
    setLoading(true);
    setError(null);
    try {
      const res = await submit({
        data: {
          name: name.trim() || undefined,
          age: age.trim() || undefined,
          stage: stage.trim() || undefined,
          sectorType,
          privateType: sectorType === "private" ? privateType! : undefined,
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim() || undefined,
          interests: interests.trim() || undefined,
          skills: skills.trim() || undefined,
          educationField: educationField.trim() || undefined,
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
            <Layers className="h-4 w-4 text-gold" />
            <span>دليل اختيار القطاع والصناعات</span>
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-primary md:text-4xl">
            اختر قطاعك وصناعتك بذكاء
          </h1>
          <p className="mx-auto max-w-2xl text-foreground/70">
            دليل تشخيصي يربط مسمّاك الوظيفي بنظام <strong>ISCO-08</strong> الدولي والتصنيف العربي
            المعياري للمهن، ويرشّح لك تصنيف <strong>GICS</strong> (Sector → Industry Group →
            Industry → Sub-Industry) ويربطه بنشاط الأعمال وفق <strong>NAICS</strong>.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mb-6 max-w-3xl">
          <div className="mb-2 flex justify-between text-xs text-foreground/60">
            <span>
              الخطوة {step + 1} من {totalSteps} — {steps[step]}
            </span>
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
          {/* Step: meta */}
          {logicalStep === "meta" && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary">بياناتك</h2>
              <p className="text-sm text-foreground/70">
                المعلومات تُستخدم لتخصيص التقرير وتُحفظ سرّيًا مرتبطة بكود التقرير فقط.
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
                    placeholder="مثال: 27"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">المرحلة الحالية</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="طالب / موظف / باحث عن عمل..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: sector */}
          {logicalStep === "sector" && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الأول</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                ما القطاع الذي تميل للعمل فيه؟
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {SECTOR_OPTIONS.map((opt) => {
                  const isSel = sectorType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSectorType(opt.value);
                        if (opt.value === "government") setPrivateType(null);
                      }}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-right transition-all ${
                        isSel
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isSel ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}
                      >
                        <opt.Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {opt.ar}{" "}
                          <span className="text-xs text-foreground/50">({opt.en})</span>
                        </div>
                        <div className="mt-1 text-xs text-foreground/70">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: private */}
          {logicalStep === "private" && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الثاني</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                أي نوع من القطاع الخاص يناسبك؟
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {PRIVATE_OPTIONS.map((opt) => {
                  const isSel = privateType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPrivateType(opt.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-right transition-all ${
                        isSel
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isSel ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}
                      >
                        <opt.Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {opt.ar}{" "}
                          <span className="text-xs text-foreground/50">({opt.en})</span>
                        </div>
                        <div className="mt-1 text-xs text-foreground/70">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: job */}
          {logicalStep === "job" && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">المستوى الثالث</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                ما المسمى الوظيفي الذي تستهدفه؟
              </h2>
              <p className="text-sm text-foreground/70">
                اكتب المسمى بأي صياغة، وسيقوم النظام بربطه بأقرب رمز <strong>ISCO-08</strong> و
                <strong> التصنيف العربي المعياري للمهن (ASCO)</strong> تلقائيًا.
              </p>
              <div>
                <label className="mb-1 block text-sm font-medium">المسمى الوظيفي *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="مثال: مهندس برمجيات / محلل مالي / مدرّس ابتدائي / ممرض"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  وصف موجز للمهام (اختياري)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="اذكر طبيعة المهام التي تقوم بها أو تريد القيام بها لمساعدة النظام في الترميز الدقيق."
                />
              </div>

              {/* Reference panel: ISCO majors */}
              <details className="rounded-lg border border-border bg-background/50 p-3">
                <summary className="cursor-pointer text-sm font-medium text-primary">
                  <ListTree className="me-1 inline h-4 w-4" />
                  المجموعات الكبرى في ISCO-08 (مرجع للاسترشاد)
                </summary>
                <ul className="mt-3 grid gap-1 text-xs text-foreground/70 md:grid-cols-2">
                  {ISCO_MAJORS.map((m) => (
                    <li key={m.code}>
                      <span className="font-mono font-semibold text-gold">{m.code}</span> —{" "}
                      {m.ar}{" "}
                      <span className="text-foreground/40">({m.en})</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          {/* Step: details */}
          {logicalStep === "details" && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gold">معلومات تكميلية</div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                ساعدنا في ترشيح الصناعة الأنسب
              </h2>
              <p className="text-sm text-foreground/70">
                هذه المعلومات تُحسّن دقة الترشيح في <strong>GICS</strong> و<strong>NAICS</strong>.
              </p>

              <div>
                <label className="mb-1 block text-sm font-medium">التخصص الدراسي</label>
                <input
                  type="text"
                  value={educationField}
                  onChange={(e) => setEducationField(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="مثال: علوم حاسب / محاسبة / طب بشري / هندسة كيميائية"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  اهتماماتك أو الصناعات التي تجذبك
                </label>
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="مثال: التكنولوجيا المالية، الطاقة المتجددة، الرعاية الصحية، العقارات..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  أبرز مهاراتك الفنية والتقنية
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="مثال: تحليل بيانات، إدارة مشاريع، تطوير ويب، تصميم..."
                />
              </div>

              {/* Reference panels */}
              <div className="grid gap-3 md:grid-cols-2">
                <details className="rounded-lg border border-border bg-background/50 p-3">
                  <summary className="cursor-pointer text-sm font-medium text-primary">
                    قطاعات GICS الـ 11
                  </summary>
                  <ul className="mt-3 grid gap-1 text-xs text-foreground/70">
                    {GICS_SECTORS.map((s) => (
                      <li key={s.code}>
                        <span className="font-mono font-semibold text-gold">{s.code}</span> —{" "}
                        {s.ar}{" "}
                        <span className="text-foreground/40">({s.en})</span>
                      </li>
                    ))}
                  </ul>
                </details>
                <details className="rounded-lg border border-border bg-background/50 p-3">
                  <summary className="cursor-pointer text-sm font-medium text-primary">
                    قطاعات NAICS
                  </summary>
                  <ul className="mt-3 grid gap-1 text-xs text-foreground/70">
                    {NAICS_SECTORS.map((s) => (
                      <li key={s.code}>
                        <span className="font-mono font-semibold text-gold">{s.code}</span> —{" "}
                        {s.ar}{" "}
                        <span className="text-foreground/40">({s.en})</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          )}

          {/* Step: review */}
          {logicalStep === "review" && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary">
                مراجعة قبل إصدار التقرير
              </h2>
              <ul className="space-y-2 rounded-lg border border-border bg-background/50 p-4 text-sm">
                <li>
                  <strong>الاسم:</strong> {name || "—"}
                </li>
                <li>
                  <strong>القطاع:</strong>{" "}
                  {sectorType === "government"
                    ? "حكومي"
                    : privateType === "non_profit"
                      ? "خاص — أهلي/غير ربحي"
                      : "خاص — ربحي"}
                </li>
                <li>
                  <strong>المسمى الوظيفي:</strong> {jobTitle}
                </li>
                {educationField && (
                  <li>
                    <strong>التخصص الدراسي:</strong> {educationField}
                  </li>
                )}
                {interests && (
                  <li>
                    <strong>الاهتمامات:</strong> {interests}
                  </li>
                )}
                {skills && (
                  <li>
                    <strong>المهارات:</strong> {skills}
                  </li>
                )}
              </ul>
              <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm text-foreground/80">
                <Sparkles className="me-1 inline h-4 w-4 text-gold" />
                سيُنشئ النظام تقريرًا تفصيليًا يربط مسمّاك الوظيفي بـ <strong>ISCO-08</strong>{" "}
                والتصنيف العربي، ويرشّح لك <strong>GICS</strong> كاملاً (Sector / Industry Group
                / Industry / Sub-Industry)، ثم يربطه بنشاط الأعمال في <strong>NAICS</strong>.
              </div>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || loading}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </button>

            {!isLastStep ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-l from-primary to-gold px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري إصدار التقرير...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    إصدار التقرير
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl text-center text-xs text-foreground/60">
          <BookOpen className="me-1 inline h-3.5 w-3.5" />
          مرجعيات معتمدة: ISCO-08 (ILO) · ASCO (الجامعة العربية) · GICS (MSCI/S&P) · NAICS
          (الولايات المتحدة/كندا/المكسيك).{" "}
          <Link to="/resources" className="text-primary underline">
            المزيد في الموارد
          </Link>
        </div>
      </div>
    </div>
  );
}
