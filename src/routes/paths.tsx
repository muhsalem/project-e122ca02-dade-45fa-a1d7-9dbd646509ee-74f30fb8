import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain, GraduationCap, Briefcase, ArrowLeft, CheckCircle2,
  Sparkles, Search, RefreshCw, TrendingUp, Rocket, HeartPulse, Clock, ShieldCheck, Info,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/paths")({
  head: () => ({
    meta: [
      { title: "ابدأ من هنا — كيف تتعلم؟ · التخصصات · المسار المهني | بوصلة" },
      { name: "description", content: "ثلاث مسارات واضحة لبناء مستقبلك: كيف تتعلم، اختيار التخصص الجامعي، والمسار المهني (اكتشاف · تغيير · تطوير) — مع مدّة كل أداة ومخرجها وحالة ترخيصها." },
      { property: "og:title", content: "ابدأ من هنا — بوصلة" },
      { property: "og:description", content: "من التعلم إلى الدراسة إلى العمل — رحلة مرتّبة بخطوات علمية شفافة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PathsPage,
});

type Tier = "core" | "recommended" | "enrichment";
type License = "open" | "restricted" | "heuristic";

type Step = {
  name: string;
  href: string;
  note?: string;
  /** المقياس المطبَّق فعليًا داخل الأداة */
  instrument?: string;
  mins?: number;
  items?: number;
  outcome?: string;
  tier: Tier;
  license?: License;
  prereq?: string;
};

type SubTrack = { key: string; title: string; icon: typeof Search; outcome: string; steps: Step[] };
type Track = {
  key: "learn" | "academic" | "career";
  label: string;
  emoji: string;
  tagline: string;
  goal: string;
  icon: typeof Brain;
  accent: string;
  chip: string;
  steps?: Step[];
  subs?: SubTrack[];
};

const TIER_META: Record<Tier, { label: string; cls: string }> = {
  core: { label: "أساسي", cls: "border-primary/40 bg-primary/10 text-primary" },
  recommended: { label: "موصى به", cls: "border-gold/40 bg-gold/10 text-gold" },
  enrichment: { label: "إثرائي", cls: "border-border bg-muted text-muted-foreground" },
};

const LICENSE_META: Record<License, { label: string; cls: string }> = {
  open: { label: "مفتوح الترخيص", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600" },
  restricted: { label: "مقيّد — يتطلب إذنًا", cls: "border-amber-500/40 bg-amber-500/10 text-amber-600" },
  heuristic: { label: "استرشادي (غير تشخيصي)", cls: "border-violet-500/40 bg-violet-500/10 text-violet-600" },
};

/** بوابة السلامة النفسية — تُعرض قبل كل مسار (مبدأ Safety First) */
const WELLBEING_GATE: Step = {
  name: "الفرز النفسي المختصر (PHQ-2 + GAD-2)",
  href: "/wellbeing-check",
  instrument: "PHQ-2 · GAD-2",
  mins: 2,
  items: 6,
  outcome: "إشارة أمان + توصية إحالة عند تجاوز العتبة",
  tier: "recommended",
  license: "open",
  note: "خطوة صفر اختيارية: القرارات المصيرية تحت ضغط نفسي مرتفع تكون أقل ثباتًا — ابدأ بها إن شعرت بإرهاق.",
};

const TRACKS: Track[] = [
  {
    key: "learn",
    label: "كيف تتعلم؟",
    emoji: "🧠",
    tagline: "افهم نفسك كمتعلّم، وطوّر أداءك الدراسي والتعلّم مدى الحياة.",
    goal: "مساعدتك على فهم طريقة تعلّمك وتطوير مهاراتك الدراسية والشخصية.",
    icon: Brain,
    accent: "from-violet-500/15 to-violet-500/5 border-violet-500/30",
    chip: "للطلاب والمتدرّبين والمتعلّمين مدى الحياة",
    steps: [
      {
        name: "البصمة التعليمية — Learning DNA",
        href: "/learning-dna",
        instrument: "بنود مطوّرة داخليًا + مهام أداء",
        mins: 20,
        items: 0,
        outcome: "ملف تعلّم مركّب (انتباه · ذاكرة · حل مشكلات)",
        tier: "core",
        license: "open",
        note: "نقطة البداية الأساسية لهذا المسار — قياس سلوكي فعلي وليس تقرير ذاتي فقط.",
      },
      {
        name: "التعلّم المثالي — المثابرة والعقلية وما وراء المعرفة",
        href: "/meta-learning",
        instrument: "Grit-12 · Growth Mindset-3 · MAI-19",
        mins: 12,
        items: 34,
        outcome: "ثلاث درجات + توصيات تدريبية فورية",
        tier: "core",
        license: "open",
        prereq: "يُفضَّل بعد البصمة التعليمية",
      },
      {
        name: "لوحة بصمة التعلم",
        href: "/learning-dna-dashboard",
        mins: 3,
        outcome: "متابعة الفروق قبل/بعد على مدى الأسابيع",
        tier: "recommended",
        note: "أعد قياس MAI بعد 6 أسابيع من العمل بالخطة لرصد الأثر.",
        prereq: "يتطلب نتيجة بصمة تعليمية واحدة على الأقل",
      },
      {
        name: "المدرب الذكي للتعلم",
        href: "/learning-coach",
        mins: 5,
        outcome: "خطة مذاكرة أسبوعية مخصّصة",
        tier: "recommended",
        prereq: "يعتمد على نتائجك السابقة",
      },
      {
        name: "نمط التعلّم التمهيدي (VARK + Kolb)",
        href: "/learning-style",
        instrument: "VARK · Kolb LSI",
        mins: 8,
        items: 19,
        outcome: "تصنيف تمهيدي لتفضيلاتك",
        tier: "enrichment",
        license: "heuristic",
        note: "للتوعية الذاتية فقط — فرضية «أنماط التعلّم» لم تصمد أمام المراجعات التجريبية، ولا تُبنى عليها قرارات.",
      },
    ],
  },
  {
    key: "academic",
    label: "التخصصات الدراسية والجامعية",
    emoji: "🎓",
    tagline: "اختر تخصصك وابنِ مشروعك الأكاديمي بخطوات مدروسة.",
    goal: "تمكينك من اتخاذ قرارات أكاديمية مدروسة وبناء مشروعك التعليمي.",
    icon: GraduationCap,
    accent: "from-blue-500/15 to-blue-500/5 border-blue-500/30",
    chip: "لطلاب الثانوية والجامعة وأولياء الأمور",
    steps: [
      {
        name: "اكتشاف الذات (الميول + الشخصية)",
        href: "/self-discovery",
        instrument: "O*NET Interest Profiler (RIASEC) · IPIP-NEO-60",
        mins: 25,
        items: 120,
        outcome: "كود ميول ثلاثي + ملف الشخصية الخماسي",
        tier: "core",
        license: "open",
        note: "الأساس القياسي لكل التوصيات الأكاديمية والمهنية — ابدأ به.",
      },
      {
        name: "اختيار التخصص الجامعي (مطابقة ذكية)",
        href: "/academic-major",
        mins: 6,
        outcome: "قائمة تخصصات مرتّبة بدرجة الملاءمة",
        tier: "core",
        prereq: "يتطلب نتيجة اكتشاف الذات",
      },
      {
        name: "بوصلة التخصصات (تحليل معمّق بالذكاء الاصطناعي)",
        href: "/specialization-compass",
        mins: 2,
        outcome: "تقرير موسّع عن تخصص أو مقارنة بين تخصصات",
        tier: "recommended",
      },
      {
        name: "استكشاف التخصصات (قاعدة ISCED-F 2013)",
        href: "/specializations",
        mins: 10,
        outcome: "تصفّح 39 مجالًا و585 تخصصًا دقيقًا",
        tier: "recommended",
      },
      {
        name: "خريطة الاختبارات (دليل الاختيار)",
        href: "/comprehensive-assessment",
        mins: 3,
        outcome: "توجيهك إلى الاختبار المناسب لحالتك",
        tier: "enrichment",
      },
      {
        name: "لوحة ولي الأمر / خطتي التعليمية",
        href: "/parent-dashboard",
        mins: 5,
        outcome: "متابعة الخطة ومشاركة النتائج",
        tier: "enrichment",
      },
      {
        name: "جواز بوصلة — تنسيق الرحلة",
        href: "/passport",
        mins: 4,
        outcome: "الخطوة التالية الأنسب + ملخص تفسيري موحّد",
        tier: "recommended",
      },
    ],
  },
  {
    key: "career",
    label: "المسار المهني",
    emoji: "💼",
    tagline: "اكتشف، غيّر، أو طوّر مسارك المهني — بخطوات مبنيّة على العلم.",
    goal: "بناء مسار مهني واضح ومستدام حسب مرحلتك الحالية.",
    icon: Briefcase,
    accent: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30",
    chip: "للخريجين والموظفين والمديرين",
    subs: [
      {
        key: "discovery",
        title: "أريد الاكتشاف",
        icon: Search,
        outcome: "تقرير اكتشاف الذات + اقتراح أنسب المهن",
        steps: [
          {
            name: "اكتشاف المهنة (الميول + الشخصية)",
            href: "/self-discovery",
            instrument: "O*NET Interest Profiler · IPIP-NEO-60",
            mins: 25,
            items: 120,
            outcome: "كود RIASEC + ملف الشخصية",
            tier: "core",
            license: "open",
          },
          {
            name: "تحديد نوع المسار (وظيفة/ريادة/حر) + ISCO-08",
            href: "/career-type-assessment",
            mins: 8,
            outcome: "مسمّى مهني وفق ISCO-08 و ASCO",
            tier: "core",
            prereq: "يُنصح بإجرائه بعد اكتشاف الذات لتفادي تكرار قياس الميول",
            note: "يحتوي وحدة RIASEC مختصرة — إن أكملت اكتشاف الذات فاعتمد نتيجتها الأدق.",
          },
          {
            name: "القيم المهنية",
            href: "/work-values",
            instrument: "IPIP-Values (بديل مفتوح لـ WVI)",
            mins: 8,
            items: 30,
            outcome: "ترتيب قيمك المهنية العليا",
            tier: "recommended",
            license: "open",
          },
          {
            name: "مرساة المسيرة المهنية",
            href: "/career-anchors",
            instrument: "مستوحى من Schein Career Anchors",
            mins: 10,
            outcome: "المرساة المهنية المسيطرة",
            tier: "enrichment",
            license: "restricted",
            note: "النسخة الأصلية (COI) تجارية — النسخة المعروضة استرشادية بصياغة مستقلة.",
          },
          { name: "نظرة عامة على الاستكشاف", href: "/track/discovery", mins: 2, tier: "enrichment" },
          { name: "حواري المهني (محاكاة ذكية)", href: "/career-twin", mins: 6, tier: "enrichment" },
        ],
      },
      {
        key: "change",
        title: "أريد التغيير",
        icon: RefreshCw,
        outcome: "قرار واضح: ابقَ / طوّر / غيّر",
        steps: [
          {
            name: "الاحتراق الوظيفي",
            href: "/burnout-check",
            instrument: "OLBI (بديل مفتوح لـ MBI)",
            mins: 6,
            items: 16,
            outcome: "درجتا الإنهاك والانفصال + مستوى الخطورة",
            tier: "core",
            license: "open",
            note: "ابدأ به: الإنهاك يفسّر جزءًا كبيرًا من الرغبة في التغيير.",
          },
          {
            name: "وضوح المسار والقلق المهني",
            href: "/clarity-check",
            mins: 5,
            outcome: "مؤشر وضوح + مصادر التردد",
            tier: "core",
          },
          {
            name: "التحول الوظيفي — خطة الانتقال",
            href: "/career-change",
            mins: 10,
            outcome: "قرار (ابقَ/طوّر/غيّر) + خطوات انتقال",
            tier: "core",
            prereq: "بعد الاحتراق ووضوح المسار",
          },
          { name: "نظرة عامة على التغيير", href: "/track/change", mins: 2, tier: "enrichment" },
        ],
      },
      {
        key: "growth",
        title: "أريد التطوير",
        icon: TrendingUp,
        outcome: "خطة تطوير فردية (IDP) + سلّم مهني",
        steps: [
          {
            name: "بناء الخطة المهنية (IDP)",
            href: "/career-growth",
            mins: 12,
            outcome: "خطة تطوير فردية بأهداف SMART",
            tier: "core",
          },
          {
            name: "سلّم الترقّي وتحقيق الأهداف",
            href: "/career-ladder",
            mins: 8,
            outcome: "خريطة درجات وظيفية ومتطلباتها",
            tier: "core",
          },
          {
            name: "حالة الهوية المهنية",
            href: "/career-self-efficacy",
            instrument: "VISA — Vocational Identity Status Assessment",
            mins: 8,
            items: 30,
            outcome: "ستة أبعاد للهوية المهنية (استكشاف · التزام · إعادة نظر)",
            tier: "recommended",
            license: "open",
            note: "يقيس حالة الهوية المهنية — وليس الكفاءة الذاتية لاتخاذ القرار (CDSE).",
          },
          {
            name: "الذكاء العاطفي",
            href: "/emotional-intelligence",
            instrument: "بنود IPIP مفتوحة (4 أوجه)",
            mins: 6,
            items: 16,
            outcome: "مؤشر إجمالي + تفصيل أربعة أوجه",
            tier: "recommended",
            license: "open",
          },
          {
            name: "الجاهزية وتطوير الأداء",
            href: "/career-readiness",
            mins: 7,
            outcome: "مؤشر جاهزية + فجوات المهارات",
            tier: "recommended",
          },
          { name: "الملف المعرفي والقيادي", href: "/cognitive-profile", mins: 15, tier: "enrichment" },
          { name: "ريادة الأعمال", href: "/track/entrepreneurship", mins: 4, tier: "enrichment" },
          { name: "نظرة عامة على التطوير", href: "/track/growth", mins: 2, tier: "enrichment" },
        ],
      },
    ],
  },
];

function Badges({ step }: { step: Step }) {
  const tier = TIER_META[step.tier];
  const lic = step.license ? LICENSE_META[step.license] : null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${tier.cls}`}>{tier.label}</span>
      {lic && (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${lic.cls}`}>
          <ShieldCheck className="h-2.5 w-2.5" /> {lic.label}
        </span>
      )}
      {!!step.mins && (
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" /> ~{step.mins} د
        </span>
      )}
      {!!step.items && (
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
          {step.items} بند
        </span>
      )}
    </div>
  );
}

function StepDetails({ step }: { step: Step }) {
  return (
    <>
      {step.instrument && (
        <div className="mt-1 text-[11px] text-muted-foreground">المقياس المطبَّق: {step.instrument}</div>
      )}
      <Badges step={step} />
      {step.outcome && (
        <div className="mt-2 text-[11px] text-primary">
          <span className="font-semibold">المخرج:</span> {step.outcome}
        </div>
      )}
      {step.prereq && (
        <div className="mt-1 text-[11px] text-muted-foreground">الشرط المسبق: {step.prereq}</div>
      )}
      {step.note && <div className="mt-1 text-[11px] leading-6 text-muted-foreground">{step.note}</div>}
    </>
  );
}

function WellbeingGate() {
  const st = WELLBEING_GATE;
  return (
    <Link
      to={st.href}
      className="mt-6 block rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 transition-colors hover:border-rose-500/60"
    >
      <div className="flex items-start gap-3">
        <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-600">خطوة صفر</span>
            <span className="font-medium text-primary">{st.name}</span>
          </div>
          <StepDetails step={st} />
        </div>
        <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}

function PathsPage() {
  const [activeKey, setActiveKey] = useState<Track["key"]>("learn");
  const active = TRACKS.find((t) => t.key === activeKey)!;

  return (
    <section className="container-page py-12 md:py-16">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          🚀 ابدأ من هنا
        </div>
        <h1 className="mt-4 font-serif text-3xl text-primary md:text-5xl">
          ما الذي تريد العمل عليه اليوم؟
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
          رحلة واحدة بثلاث محطّات مرتّبة —
          <span className="mx-1 font-semibold text-primary">كيف تتعلم؟</span>←
          <span className="mx-1 font-semibold text-primary">التخصصات الدراسية</span>←
          <span className="mx-1 font-semibold text-primary">المسار المهني</span>.
          اختر ما يناسب مرحلتك الآن.
        </p>
      </div>

      {/* Three main track cards */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
        {TRACKS.map((t) => {
          const Icon = t.icon;
          const isActive = t.key === activeKey;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveKey(t.key);
                setTimeout(() => document.getElementById("track-details")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 text-right transition-all ${t.accent} ${
                isActive ? "border-primary shadow-[var(--shadow-soft)] scale-[1.01]" : "hover:border-gold/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>{t.emoji}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="mt-4 font-serif text-xl text-primary md:text-2xl">{t.label}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{t.tagline}</p>
              <div className="mt-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {t.chip}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Info className="h-3 w-3" /> دليل الشارات:</span>
        {(Object.keys(TIER_META) as Tier[]).map((k) => (
          <span key={k} className={`rounded-full border px-2 py-0.5 font-medium ${TIER_META[k].cls}`}>{TIER_META[k].label}</span>
        ))}
        {(Object.keys(LICENSE_META) as License[]).map((k) => (
          <span key={k} className={`rounded-full border px-2 py-0.5 font-medium ${LICENSE_META[k].cls}`}>{LICENSE_META[k].label}</span>
        ))}
      </div>

      {/* Active track details */}
      <div id="track-details" className="mx-auto mt-8 max-w-5xl scroll-mt-24">
        <header className={`rounded-2xl border bg-gradient-to-br p-6 ${active.accent}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl" aria-hidden>{active.emoji}</span>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-primary">{active.label}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{active.goal}</p>
            </div>
          </div>
        </header>

        <WellbeingGate />

        {/* Flat steps */}
        {active.steps && (
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {active.steps.map((st, i) => (
              <li key={st.href + st.name}>
                <Link
                  to={st.href}
                  className="group flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/40 hover:bg-background"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-primary group-hover:underline">{st.name}</div>
                    <StepDetails step={st} />
                  </div>
                  <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ol>
        )}

        {/* Sub-tracks (career) */}
        {active.subs && (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {active.subs.map((s) => {
              const SubIcon = s.icon;
              return (
                <article key={s.key} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-2 text-primary">
                    <SubIcon className="h-5 w-5 text-gold" />
                    <h4 className="font-serif text-lg">{s.title}</h4>
                  </div>
                  <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-6 text-primary">
                    <span className="font-semibold">المخرج:</span> {s.outcome}
                  </p>
                  <ol className="mt-4 space-y-2">
                    {s.steps.map((st) => (
                      <li key={st.href + st.name}>
                        <Link
                          to={st.href}
                          className="group flex items-start gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm transition-colors hover:border-gold/40 hover:bg-background"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <div className="flex-1">
                            <div className="font-medium text-primary group-hover:underline">{st.name}</div>
                            <StepDetails step={st} />
                          </div>
                          <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-6 rounded-xl border border-border bg-secondary/40 p-4 text-[11px] leading-6 text-muted-foreground">
          <strong className="text-primary">شفافية قياسية:</strong> نعرض اسم المقياس المطبَّق فعليًا داخل كل أداة وحالة ترخيصه.
          الأدوات الاسترشادية لا تُستخدم لاتخاذ قرارات مصيرية، وأدوات الفرز النفسي ليست بديلاً عن التشخيص الإكلينيكي.{" "}
          <Link to="/licensing" className="font-semibold text-primary underline-offset-4 hover:underline">
            راجع صفحة التراخيص
          </Link>
          .
        </p>
      </div>

      {/* Footer helper */}
      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
        <Rocket className="mx-auto mb-2 h-5 w-5 text-gold" />
        لست متأكداً أين تبدأ؟ جرّب{" "}
        <Link to="/start" className="font-semibold text-primary underline-offset-4 hover:underline">
          مساعد الترشيح الذكي
        </Link>{" "}
        ليرشدك إلى أنسب خطوة في أقل من دقيقة.
      </div>
    </section>
  );
}
