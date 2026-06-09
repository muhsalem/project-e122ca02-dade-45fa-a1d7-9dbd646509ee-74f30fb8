import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, GraduationCap, RefreshCw, TrendingUp, HeartPulse, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/paths")({
  head: () => ({
    meta: [
      { title: "اختر مسارك — خريطة الاختبارات | بوصلة" },
      { name: "description", content: "اختر مسارك المهني الحالي لتظهر لك الاختبارات المناسبة لمرحلتك: الاكتشاف، التغيير، التطوّر، أو الفرز النفسي." },
      { property: "og:title", content: "خريطة الاختبارات المهنية — بوصلة" },
      { property: "og:description", content: "9 اختبارات أساسية منظَّمة في 4 مسارات حسب مرحلتك." },
    ],
  }),
  component: PathsPage,
});

type TestItem = { name: string; href: string; note?: string };
type Track = {
  key: string;
  title: string;
  audience: string;
  outcome: string;
  icon: typeof Compass;
  accent: string;
  tests: TestItem[];
};

const TRACKS: Track[] = [
  {
    key: "discovery",
    title: "المسار 1 — الاكتشاف",
    audience: "طالب/طالبة أو خرّيج لم يحدّد مساره",
    outcome: "تقرير «اكتشاف الذات» + اقتراح أنسب 5 تخصصات",
    icon: GraduationCap,
    accent: "from-blue-500/15 to-blue-500/5 border-blue-500/30",
    tests: [
      { name: "اكتشاف الذات (Holland RIASEC + Big Five)", href: "/self-discovery" },
      { name: "اكتشاف المسار المهني (ISCO-08)", href: "/career-type-assessment" },
      { name: "الملف المعرفي (القدرات الأربع)", href: "/cognitive-profile" },
      { name: "نمط التعلّم (VARK + Kolb)", href: "/learning-style" },
      { name: "القيم المهنية (WVI) — جديد", href: "/work-values" },
      { name: "مرساة المسيرة المهنية (Schein) — جديد", href: "/career-anchors" },
      { name: "التخصص الجامعي المناسب", href: "/academic-major", note: "يستفيد تلقائيًا من نتائجك السابقة" },
    ],
  },
  {
    key: "change",
    title: "المسار 2 — التغيير",
    audience: "موظّف يفكّر في تغيير مساره",
    outcome: "قرار واضح: ابقَ / طوّر / غيّر",
    icon: RefreshCw,
    accent: "from-amber-500/15 to-amber-500/5 border-amber-500/30",
    tests: [
      { name: "وضوح المسار المهني (قبل/بعد)", href: "/clarity-check" },
      { name: "تشخيص تغيير المسار (احتراق + انخراط + دافعية)", href: "/career-change" },
      { name: "مؤشر الاحتراق المهني (MBI-GS)", href: "/burnout-check" },
      { name: "الكفاءة الذاتية لاتخاذ القرار (CDSE) — جديد", href: "/career-self-efficacy" },
    ],
  },
  {
    key: "growth",
    title: "المسار 3 — التطوّر والترقّي",
    audience: "موظّف راضٍ ويريد الترقّي",
    outcome: "خطة تطوير فردية (IDP) لـ 90 يومًا + سلّم مهني",
    icon: TrendingUp,
    accent: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30",
    tests: [
      { name: "تطوير المسار الوظيفي (الأداء + القيادة)", href: "/career-growth" },
      { name: "الذكاء العاطفي (WLEIS) — جديد", href: "/emotional-intelligence" },
      { name: "سلالم المسارات المهنية (Junior → Lead)", href: "/career-ladder" },
      { name: "تقييم 360° (اختياري بإذن العميل)", href: "/review360" },
      { name: "شهادة الجاهزية المهنية", href: "/career-readiness", note: "تُصدَر بعد إكمال 4 اختبارات" },
    ],
  },
  {
    key: "screening",
    title: "المسار 4 — الفرز النفسي",
    audience: "أداة عرضية لكل من يحتاج اطمئنانًا نفسيًا",
    outcome: "تقرير فرز موجز + توصية إحالة عند الحاجة",
    icon: HeartPulse,
    accent: "from-rose-500/15 to-rose-500/5 border-rose-500/30",
    tests: [
      { name: "الفحص النفسي المختصر (PHQ-2 + GAD-2)", href: "/wellbeing-check", note: "للفرز فقط، لا يُغني عن مختصّ" },
    ],
  },
];

function PathsPage() {
  return (
    <section className="container-page py-12 md:py-16">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <Compass className="h-3.5 w-3.5" />
          خريطة الاختبارات المهنية
        </div>
        <h1 className="mt-4 font-serif text-3xl text-primary md:text-5xl">اختر مسارك</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          نظّمنا اختبارات بوصلة في <span className="font-semibold text-primary">أربعة مسارات</span> واضحة حسب مرحلتك،
          حتى لا تتشتّت بين عشرات الأدوات. ابدأ بالمسار الذي يصف حالتك الآن.
        </p>
      </div>

      {/* Tracks */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2">
        {TRACKS.map((t) => {
          const Icon = t.icon;
          return (
            <article
              key={t.key}
              className={`rounded-2xl border bg-gradient-to-br p-6 shadow-[var(--shadow-soft)] ${t.accent}`}
            >
              <header className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-primary md:text-2xl">{t.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{t.audience}</p>
                </div>
              </header>

              <p className="mt-4 rounded-lg bg-background/70 px-3 py-2 text-xs leading-6 text-primary">
                <span className="font-semibold">المخرج:</span> {t.outcome}
              </p>

              <ul className="mt-4 space-y-2">
                {t.tests.map((test) => (
                  <li key={test.href}>
                    <Link
                      to={test.href}
                      className="group flex items-start gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm transition-colors hover:border-gold/40 hover:bg-background"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <div className="flex-1">
                        <div className="font-medium text-primary group-hover:underline">{test.name}</div>
                        {test.note && (
                          <div className="mt-0.5 text-[11px] text-muted-foreground">{test.note}</div>
                        )}
                      </div>
                      <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
        لست متأكدًا أين تبدأ؟ جرّب{" "}
        <Link to="/start" className="font-semibold text-primary underline-offset-4 hover:underline">
          مساعد الترشيح الذكي
        </Link>{" "}
        ليرشدك إلى المسار الأنسب في دقيقة واحدة.
      </div>
    </section>
  );
}
