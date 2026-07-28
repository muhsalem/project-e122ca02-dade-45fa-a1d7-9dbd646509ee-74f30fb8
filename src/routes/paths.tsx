import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass, GraduationCap, BookOpen, Briefcase, ArrowLeft, CheckCircle2,
  Sparkles, HeartPulse, Activity, Brain, RefreshCw, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/paths")({
  head: () => ({
    meta: [
      { title: "اختر مسارك — الإرشاد التربوي والأكاديمي والمهني | بوصلة" },
      { name: "description", content: "ثلاثة مسارات إرشاد متكاملة: تربوي (التعلّم والدافعية)، أكاديمي (التخصص الجامعي)، ومهني (اكتشاف/تغيير/تطوّر) — بخطوات واضحة لكل مسار." },
      { property: "og:title", content: "اختر مسارك — بوصلة" },
      { property: "og:description", content: "ثلاثة مسارات إرشاد: تربوي وأكاديمي ومهني، بخطوات مرتّبة وأدوات علمية مفتوحة الترخيص." },
    ],
  }),
  component: PathsPage,
});

type Step = { name: string; href: string; note?: string };
type SubTrack = { key: string; title: string; audience: string; outcome: string; steps: Step[] };
type Domain = {
  key: "educational" | "academic" | "career";
  label: string;
  tagline: string;
  icon: typeof Compass;
  accent: string;
  chip: string;
  subs: SubTrack[];
};

const DOMAINS: Domain[] = [
  {
    key: "educational",
    label: "الإرشاد التربوي",
    tagline: "كيف تتعلّم؟ كيف تُدير طاقتك ودافعيتك وصحتك النفسية؟",
    icon: BookOpen,
    accent: "from-violet-500/15 to-violet-500/5 border-violet-500/30",
    chip: "للطلاب والمتدربين وأولياء الأمور",
    subs: [
      {
        key: "learning-dna",
        title: "بصمتك التعليمية — Learning DNA",
        audience: "من يريد قياساً متقدّماً لطريقة تعلّمه الفعلية",
        outcome: "٧ مؤشرات مركّبة + خطة تعلّم شخصية ومدرّب AI",
        steps: [
          { name: "١) اختبار Learning DNA الشامل", href: "/learning-dna", note: "استبيان + ذاكرة + Stroop + حلّ مشكلات" },
          { name: "٢) لوحة Learning DNA الشخصية", href: "/learning-dna-dashboard", note: "تابع تطوّر مؤشراتك السبعة" },
          { name: "٣) AI Learning Coach", href: "/learning-coach", note: "توصيات فورية مبنيّة على بصمتك" },
        ],
      },
      {
        key: "study-os",
        title: "نظام المذاكرة — Study OS",
        audience: "طالب/متدرّب يريد بناء عادات دراسية فعّالة",
        outcome: "جلسات Pomodoro + Flashcards بتباعد + Check-in يومي",
        steps: [
          { name: "١) نمط التعلّم التمهيدي (VARK + Kolb)", href: "/learning-style", note: "نقطة بداية سريعة" },
          { name: "٢) تشغيل Study OS", href: "/study-os", note: "Pomodoro وFlashcards وخطة يومية متكيّفة" },
          { name: "٣) مهارات ما وراء المعرفة", href: "/meta-learning" },
        ],
      },
      {
        key: "wellbeing",
        title: "الصحة النفسية والتوازن",
        audience: "لكل طالب/موظّف يحتاج اطمئناناً نفسياً سريعاً",
        outcome: "فرز موجز + توصية إحالة عند الحاجة",
        steps: [
          { name: "الفحص النفسي المختصر (PHQ-2 + GAD-2)", href: "/wellbeing-check", note: "للفرز فقط، لا يُغني عن مختصّ" },
        ],
      },
    ],
  },
  {
    key: "academic",
    title: "",
    label: "الإرشاد الأكاديمي",
    tagline: "أي تخصص جامعي يناسبك؟ وكيف تربطه بميولك وقدراتك؟",
    icon: GraduationCap,
    accent: "from-blue-500/15 to-blue-500/5 border-blue-500/30",
    chip: "لطلاب الثانوية والجامعة",
    subs: [
      {
        key: "major",
        title: "اختيار التخصص الجامعي",
        audience: "طالب/طالبة أمام قرار التخصص",
        outcome: "قائمة أنسب ٥ تخصصات مع نسبة توافق واضحة",
        steps: [
          { name: "١) القيم المهنية (WVI)", href: "/work-values", note: "البوصلة الأخلاقية قبل أي قرار" },
          { name: "٢) اكتشاف الذات (Big Five + O*NET Interest Profiler)", href: "/self-discovery" },
          { name: "٣) الملف المعرفي (القدرات الأربع)", href: "/cognitive-profile" },
          { name: "٤) التخصص الجامعي المناسب", href: "/academic-major", note: "يستخدم نتائجك السابقة تلقائياً" },
          { name: "٥) مستكشف التخصصات", href: "/specializations" },
        ],
      },
      {
        key: "parent",
        title: "دليل ولي الأمر",
        audience: "أولياء الأمور والمدارس",
        outcome: "تقرير مبسّط + إرشادات لدعم الابن دون توجيهه قسراً",
        steps: [
          { name: "لوحة ولي الأمر", href: "/parent-dashboard" },
          { name: "دليل المدارس", href: "/schools" },
        ],
      },
    ],
  },
  {
    key: "career",
    label: "الإرشاد المهني",
    tagline: "اكتشف، غيّر، أو طوّر مسارك — بخطوات مبنيّة على العلم.",
    icon: Briefcase,
    accent: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30",
    chip: "للخريجين والموظفين والمديرين",
    subs: [
      {
        key: "discovery",
        title: "المسار (أ) — الاكتشاف",
        audience: "خريج/باحث عن عمل لم يحدّد مساره",
        outcome: "تقرير اكتشاف الذات + اقتراح أنسب ٥ مهن",
        steps: [
          { name: "١) القيم المهنية (WVI)", href: "/work-values" },
          { name: "٢) مرساة المسيرة المهنية (Schein)", href: "/career-anchors" },
          { name: "٣) اكتشاف الذات (Big Five + O*NET)", href: "/self-discovery" },
          { name: "٤) اكتشاف المسار المهني (ISCO-08)", href: "/career-type-assessment" },
          { name: "٥) هوية المسار (VISA)", href: "/career-anchors" },
        ],
      },
      {
        key: "change",
        title: "المسار (ب) — التغيير",
        audience: "موظّف يفكّر في تغيير مساره",
        outcome: "قرار واضح: ابقَ / طوّر / غيّر",
        steps: [
          { name: "١) وضوح المسار المهني", href: "/clarity-check" },
          { name: "٢) مؤشر الاحتراق (OLBI)", href: "/burnout-check" },
          { name: "٣) تشخيص تغيير المسار", href: "/career-change" },
          { name: "٤) الكفاءة الذاتية لاتخاذ القرار", href: "/career-self-efficacy" },
        ],
      },
      {
        key: "growth",
        title: "المسار (ج) — التطوّر والترقّي",
        audience: "موظّف راضٍ يريد الترقّي",
        outcome: "خطة تطوير فردية (IDP) لـ ٩٠ يوماً + سلّم مهني",
        steps: [
          { name: "١) الذكاء العاطفي (IPIP-EI)", href: "/emotional-intelligence" },
          { name: "٢) تطوير المسار الوظيفي", href: "/career-growth" },
          { name: "٣) سلالم المسارات المهنية", href: "/career-ladder" },
          { name: "٤) تقييم 360° (اختياري)", href: "/review360" },
          { name: "٥) شهادة الجاهزية المهنية", href: "/career-readiness" },
        ],
      },
      {
        key: "impact",
        title: "الأثر المهني والصحي (POIA)",
        audience: "كل من يريد قياس أثر عمله على حياته",
        outcome: "٦ مؤشرات + مقارنة مع ٢٠ مهنة",
        steps: [
          { name: "١) قياس POIA", href: "/poia" },
          { name: "٢) لوحة المؤشرات", href: "/poia-dashboard" },
          { name: "٣) مقارنة المهن", href: "/poia-compare" },
        ],
      },
    ],
  },
];

function PathsPage() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <Compass className="h-3.5 w-3.5" />
          ثلاثة مسارات إرشاد متكاملة
        </div>
        <h1 className="mt-4 font-serif text-3xl text-primary md:text-5xl">اختر مسارك</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          نظّمنا خدمات بوصلة في ثلاثة مسارات رئيسية:
          <span className="mx-1 font-semibold text-primary">تربوي</span>·
          <span className="mx-1 font-semibold text-primary">أكاديمي</span>·
          <span className="mx-1 font-semibold text-primary">مهني</span>.
          اختر المسار الذي يصف مرحلتك الآن، ثم اتّبع الخطوات بالترتيب.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
          {DOMAINS.map((d) => (
            <a key={d.key} href={`#${d.key}`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 hover:border-gold/40">
              <d.icon className="h-3.5 w-3.5 text-gold" />
              {d.label}
            </a>
          ))}
          <Link to="/start" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> مساعد الترشيح الذكي
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl space-y-14">
        {DOMAINS.map((d) => {
          const Icon = d.icon;
          return (
            <section key={d.key} id={d.key} className="scroll-mt-24">
              <header className={`rounded-2xl border bg-gradient-to-br p-6 ${d.accent}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{d.chip}</div>
                    <h2 className="mt-1 font-serif text-2xl text-primary md:text-3xl">{d.label}</h2>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">{d.tagline}</p>
                  </div>
                </div>
              </header>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {d.subs.map((s) => (
                  <article key={s.key} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                    <h3 className="font-serif text-lg text-primary">{s.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{s.audience}</p>
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
                              {st.note && <div className="mt-0.5 text-[11px] text-muted-foreground">{st.note}</div>}
                            </div>
                            <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
        لست متأكدًا أين تبدأ؟ جرّب{" "}
        <Link to="/start" className="font-semibold text-primary underline-offset-4 hover:underline">
          مساعد الترشيح الذكي
        </Link>{" "}
        ليرشدك إلى المسار الأنسب في دقيقة واحدة.
      </div>
    </section>
  );
}
