import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Sparkles, Layers, Network, Map, GraduationCap, ArrowLeft } from "lucide-react";
import { AcademicTabs } from "@/components/site/AcademicTabs";

export const Route = createFileRoute("/academic-journey")({
  head: () => ({
    meta: [
      { title: "مسار التخصصات الأكاديمية — رحلة واحدة متكاملة | بوصلة" },
      {
        name: "description",
        content:
          "مسار موحّد يجمع مطابقة التخصص، بوصلة التخصصات الذكية، قاعدة ISCED-F v9، الخريطة، التخصصات البينية، واختصارات الدرجات في رحلة واحدة مرتبة.",
      },
      { property: "og:title", content: "مسار التخصصات الأكاديمية — رحلة واحدة متكاملة | بوصلة" },
      {
        property: "og:description",
        content: "من المطابقة إلى الاستكشاف إلى المرجع: كل أدوات التخصصات الجامعية في مسار واحد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademicJourney,
});

type Step = {
  stage: string;
  to: string;
  label: string;
  desc: string;
  icon: typeof Compass;
  badge?: string;
};

const STEPS: Step[] = [
  {
    stage: "الخطوة ١ — ابدأ",
    to: "/major-match",
    label: "مطابقة التخصص — Bawsala Match",
    desc: "محرّك المطابقة (RIASEC + Big Five + الطموحات) لترشيح أقرب التخصصات لك.",
    icon: Compass,
    badge: "أساسي",
  },
  {
    stage: "الخطوة ٢ — اختبر",
    to: "/academic-major",
    label: "اختيار التخصص الجامعي (AI)",
    desc: "تقييم موجّه يُنتج كود تقرير (MAJ-) بترشيحات مبنية على ISCED-F.",
    icon: GraduationCap,
    badge: "أساسي",
  },
  {
    stage: "الخطوة ٣ — حلّل",
    to: "/specialization-compass",
    label: "بوصلة التخصصات (AI)",
    desc: "تقييم عميق، مقارنة تخصصات، تحديد الموقع المعرفي، وبناء خريطة مجال.",
    icon: Sparkles,
    badge: "موصى به",
  },
  {
    stage: "الخطوة ٤ — استكشف",
    to: "/academic-disciplines",
    label: "قاعدة التخصصات (ISCED-F 2013 · v9)",
    desc: "٣٩ مجالًا و١٢٨ تخصصًا عامًا و٥٨٥ تخصصًا دقيقًا.",
    icon: Layers,
  },
  {
    stage: "الخطوة ٤ — استكشف",
    to: "/specializations",
    label: "خريطة التخصصات",
    desc: "عرض بصري متشعّب للمجالات وفروعها.",
    icon: Map,
  },
  {
    stage: "الخطوة ٤ — استكشف",
    to: "/interdisciplinary",
    label: "التخصصات البينية",
    desc: "مجالات التقاطع (Bio-X، AI-X، …) والفرص الناشئة.",
    icon: Network,
  },
  {
    stage: "الخطوة ٥ — مرجع",
    to: "/degrees",
    label: "اختصارات الدرجات (MBA/PhD/…)",
    desc: "دليل الدرجات الأكاديمية ومستوياتها ومجالاتها.",
    icon: GraduationCap,
  },
];

function AcademicJourney() {
  const stages = Array.from(new Set(STEPS.map((s) => s.stage)));

  return (
    <div dir="rtl" className="min-h-dvh bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Compass className="h-3.5 w-3.5 text-gold" />
            كل أدوات التخصصات في مسار واحد
          </span>
          <h1 className="mt-5 font-serif text-3xl text-primary md:text-4xl">مسار التخصصات الأكاديمية</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-9">
            بدل التنقّل بين صفحات متفرّقة، اتبع هذا الترتيب: طابِق ← اختبر ← حلّل ← استكشف ← راجع المرجع.
            جميع الصفحات تبقى متاحة كما هي.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <AcademicTabs />

        <ol className="mx-auto max-w-4xl space-y-10">
          {stages.map((stage) => (
            <li key={stage}>
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {stage}
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {STEPS.filter((s) => s.stage === stage).map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-lg"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-serif text-base text-primary">{s.label}</span>
                          {s.badge && (
                            <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] text-primary">
                              {s.badge}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground leading-6">{s.desc}</span>
                      </span>
                      <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-gold" />
                    </Link>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
          أنهيت المسار الأكاديمي؟ اجمع نتائجك في{" "}
          <Link to="/comprehensive-assessment" className="font-semibold text-primary underline-offset-4 hover:underline">
            التقييم الشامل الموحّد
          </Link>{" "}
          أو تابع في{" "}
          <Link to="/paths" className="font-semibold text-primary underline-offset-4 hover:underline">
            خريطة المسارات
          </Link>
          .
        </div>
      </section>
    </div>
  );
}
