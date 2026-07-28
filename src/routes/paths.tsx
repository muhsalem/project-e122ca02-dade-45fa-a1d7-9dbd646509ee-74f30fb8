import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain, GraduationCap, Briefcase, ArrowLeft, CheckCircle2,
  Sparkles, Search, RefreshCw, TrendingUp, Rocket,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/paths")({
  head: () => ({
    meta: [
      { title: "ابدأ من هنا — كيف تتعلم؟ · التخصصات · المسار المهني | بوصلة" },
      { name: "description", content: "ثلاث مسارات واضحة لبناء مستقبلك: كيف تتعلم، اختيار التخصص الجامعي، والمسار المهني (اكتشاف · تغيير · تطوير)." },
      { property: "og:title", content: "ابدأ من هنا — بوصلة" },
      { property: "og:description", content: "من التعلم إلى الدراسة إلى العمل — رحلة مرتّبة بخطوات علمية." },
    ],
  }),
  component: PathsPage,
});

type Step = { name: string; href: string; note?: string };
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
  // Either flat steps or grouped sub-tracks (career only)
  steps?: Step[];
  subs?: SubTrack[];
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
      { name: "نمط التعلّم (VARK + Kolb)", href: "/learning-style", note: "نقطة بداية سريعة" },
      { name: "البصمة التعليمية — Learning DNA", href: "/learning-dna", note: "قياس مركّب لطريقة تعلّمك الفعلية" },
      { name: "التعلّم المثالي (Grit + Mindset + MAI)", href: "/meta-learning", note: "المثابرة والعقلية وما وراء المعرفة" },
      { name: "لوحة بصمة التعلم", href: "/learning-dna-dashboard", note: "تابع تطوّر مؤشراتك" },
      { name: "المدرب الذكي للتعلم", href: "/learning-coach", note: "توصيات فورية مبنيّة على بصمتك" },
    ],
  },
  {
    key: "academic",
    label: "التخصصات الدراسية والجامعية",
    emoji: "🎓",
    tagline: "اختر تخصصك وبناء مشروعك الأكاديمي بخطوات مدروسة.",
    goal: "تمكينك من اتخاذ قرارات أكاديمية مدروسة وبناء مشروعك التعليمي.",
    icon: GraduationCap,
    accent: "from-blue-500/15 to-blue-500/5 border-blue-500/30",
    chip: "لطلاب الثانوية والجامعة وأولياء الأمور",
    steps: [
      { name: "خريطة الاختبارات (دليل الاختيار)", href: "/comprehensive-assessment", note: "دليل يساعدك على اختيار الاختبار المناسب" },
      { name: "اختيار التخصص الجامعي", href: "/academic-major", note: "يعتمد على نتائج اكتشاف الذات" },
      { name: "استكشاف التخصصات الدراسية", href: "/specializations" },
      { name: "لوحة خطتي التعليمية", href: "/parent-dashboard", note: "تنظيم الخطة ومتابعتها" },
      { name: "تحديد الأهداف الأكاديمية", href: "/career-growth", note: "أهداف SMART أكاديمية" },
      { name: "بناء المشروع الأكاديمي", href: "/passport", note: "جواز بوصلة لتنسيق رحلتك" },
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
          { name: "نظرة عامة على الاستكشاف", href: "/track/discovery" },
          { name: "اكتشاف المهنة (RIASEC + Big Five)", href: "/self-discovery" },
          { name: "استكشاف المسار (ISCO-08)", href: "/career-type-assessment" },
          { name: "القيم المهنية (WVI)", href: "/work-values" },
          { name: "مرساة المسيرة المهنية (Schein)", href: "/career-anchors" },
          { name: "حواري المهني", href: "/career-twin" },
        ],
      },
      {
        key: "change",
        title: "أريد التغيير",
        icon: RefreshCw,
        outcome: "قرار واضح: ابقَ / طوّر / غيّر",
        steps: [
          { name: "نظرة عامة على التغيير", href: "/track/change" },
          { name: "التحول الوظيفي", href: "/career-change" },
          { name: "القلق وعدم وضوح المسار", href: "/clarity-check" },
          { name: "الاحتراق الوظيفي (OLBI)", href: "/burnout-check" },
        ],
      },
      {
        key: "growth",
        title: "أريد التطوير",
        icon: TrendingUp,
        outcome: "خطة تطوير فردية (IDP) + سلّم مهني",
        steps: [
          { name: "نظرة عامة على التطوير", href: "/track/growth" },
          { name: "بناء الخطة المهنية", href: "/career-growth" },
          { name: "تحقيق الأهداف وسلم الترقي", href: "/career-ladder" },
          { name: "تطوير الأداء والجاهزية", href: "/career-readiness" },
          { name: "الكفاءة الذاتية لاتخاذ القرار", href: "/career-self-efficacy" },
          { name: "الذكاء العاطفي والتكيف (WLEIS)", href: "/emotional-intelligence" },
          { name: "الفرز النفسي المختصر", href: "/wellbeing-check" },
          { name: "ريادة الأعمال", href: "/track/entrepreneurship" },
          { name: "الملف المعرفي والقيادي", href: "/cognitive-profile" },
        ],
      },
    ],
  },
];

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

      {/* Active track details */}
      <div id="track-details" className="mx-auto mt-12 max-w-5xl scroll-mt-24">
        <header className={`rounded-2xl border bg-gradient-to-br p-6 ${active.accent}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl" aria-hidden>{active.emoji}</span>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-primary md:text-3xl">{active.label}</h3>
              <p className="mt-2 text-sm leading-7 text-primary/80">
                <span className="font-semibold">الهدف:</span> {active.goal}
              </p>
            </div>
          </div>
        </header>

        {/* Flat steps */}
        {active.steps && (
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {active.steps.map((st, i) => (
              <li key={st.href + st.name}>
                <Link
                  to={st.href}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/40 hover:bg-background"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-primary group-hover:underline">{st.name}</div>
                    {st.note && <div className="mt-1 text-[11px] text-muted-foreground">{st.note}</div>}
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
                          <div className="flex-1 font-medium text-primary group-hover:underline">
                            {st.name}
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
