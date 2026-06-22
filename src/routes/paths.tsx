import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, GraduationCap, RefreshCw, TrendingUp, HeartPulse, BookOpen, Activity, ArrowLeft, CheckCircle2, Brain } from "lucide-react";

export const Route = createFileRoute("/paths")({
  head: () => ({
    meta: [
      { title: "اختر مسارك — خريطة الاختبارات | بوصلة" },
      { name: "description", content: "اختبارات بوصلة منظَّمة في 7 مسارات: الاكتشاف، التغيير، التطوّر، علم نفس التعلّم، Learning DNA، الفرز النفسي، والأثر المهني والصحي." },
      { property: "og:title", content: "خريطة الاختبارات المهنية — بوصلة" },
      { property: "og:description", content: "اختبارات منظَّمة في سبعة مسارات حسب مرحلتك ووفق تسلسل قياسي معتمد في الإرشاد المهني." },
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
      { name: "1) القيم المهنية (WVI)", href: "/work-values", note: "نبدأ بالقيم لأنها البوصلة الأخلاقية لأي قرار مهني" },
      { name: "2) مرساة المسيرة المهنية (Schein)", href: "/career-anchors", note: "ما الذي لا يمكنك التنازل عنه في عملك؟" },
      { name: "3) اكتشاف الذات (Holland RIASEC + Big Five)", href: "/self-discovery", note: "الميول والشخصية" },
      { name: "4) اكتشاف المسار المهني (ISCO-08)", href: "/career-type-assessment" },
      { name: "5) الملف المعرفي (القدرات الأربع)", href: "/cognitive-profile", note: "تحقق من تطابق القدرات مع الميول" },
      { name: "6) التخصص الجامعي المناسب", href: "/academic-major", note: "يستفيد تلقائيًا من نتائجك السابقة" },
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
      { name: "1) وضوح المسار المهني (قبل/بعد)", href: "/clarity-check", note: "قياس أساس قبل أي تشخيص" },
      { name: "2) مؤشر الاحتراق المهني (MBI-GS)", href: "/burnout-check", note: "هل المشكلة احتراق ظرفي أم عدم توافق جذري؟" },
      { name: "3) تشخيص تغيير المسار (احتراق + انخراط + دافعية)", href: "/career-change" },
      { name: "4) الكفاءة الذاتية لاتخاذ القرار (CDSE)", href: "/career-self-efficacy", note: "هل أنت جاهز نفسيًا للقرار؟" },
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
      { name: "1) الذكاء العاطفي (WLEIS)", href: "/emotional-intelligence", note: "حجر الأساس للقيادة والترقّي" },
      { name: "2) تطوير المسار الوظيفي (الأداء + القيادة)", href: "/career-growth" },
      { name: "3) سلالم المسارات المهنية (Junior → Lead)", href: "/career-ladder" },
      { name: "4) تقييم 360° (اختياري بإذن العميل)", href: "/review360" },
      { name: "5) شهادة الجاهزية المهنية", href: "/career-readiness", note: "تُصدَر بعد إكمال 4 اختبارات" },
    ],
  },
  {
    key: "learning",
    title: "المسار 4 — علم نفس التعلّم",
    audience: "طالب/متدرّب يريد فهم قناة استقباله ودورة معالجته للمعرفة",
    outcome: "تعرّف على نمط التعلّم الكلاسيكي (VARK/Kolb) كنقطة بداية تمهيدية",
    icon: BookOpen,
    accent: "from-violet-500/15 to-violet-500/5 border-violet-500/30",
    tests: [
      { name: "اكتشاف نمط التعلّم (VARK + Kolb)", href: "/learning-style", note: "نموذجان كلاسيكيان تمهيديّان — للنتيجة الأعمق انتقل إلى Learning DNA" },
    ],
  },
  {
    key: "learning-dna",
    title: "المسار 5 — Learning DNA · البصمة التعليمية",
    audience: "كل من يريد قياساً علمياً متقدّماً لطريقة تعلّمه الفعلية",
    outcome: "30+ بُعد + 3 اختبارات أداء + 7 مؤشرات مركّبة + خطة تعلّم شخصية ومدرّب AI",
    icon: Brain,
    accent: "from-indigo-500/15 to-indigo-500/5 border-indigo-500/30",
    tests: [
      { name: "1) Learning DNA — الاختبار الشامل", href: "/learning-dna", note: "استبيان (36 بنداً) + ذاكرة + Stroop + حلّ مشكلات" },
      { name: "2) لوحة Learning DNA الشخصية", href: "/learning-dna-dashboard", note: "تابع تطوّر مؤشراتك السبعة (LES · RET · FOC · PSS · LAS · SLS · DLS)" },
      { name: "3) AI Learning Coach — مدرّب التعلّم الذكي", href: "/learning-coach", note: "محادثة مع مدرّب يقرأ بصمتك ويعطيك توصيات فورية" },
    ],
  },



  {
    key: "screening",
    title: "المسار 6 — الفرز النفسي",
    audience: "أداة عرضية لكل من يحتاج اطمئنانًا نفسيًا",
    outcome: "تقرير فرز موجز + توصية إحالة عند الحاجة",
    icon: HeartPulse,
    accent: "from-rose-500/15 to-rose-500/5 border-rose-500/30",
    tests: [
      { name: "الفحص النفسي المختصر (PHQ-2 + GAD-2)", href: "/wellbeing-check", note: "للفرز فقط، لا يُغني عن مختصّ" },
    ],
  },
  {
    key: "poia",
    title: "المسار 7 — الأثر المهني والصحي (POIA)",
    audience: "لكل موظّف أو مهني يريد قياس أثر وظيفته على حياته",
    outcome: "ستة مؤشرات (PI · OH · BRI · CSI · CFS · QWL) + تقرير ذكي + مقارنة مهن",
    icon: Activity,
    accent: "from-fuchsia-500/15 to-fuchsia-500/5 border-fuchsia-500/30",
    tests: [
      { name: "1) قياس الأثر المهني والصحي (POIA)", href: "/poia", note: "يقيس أثر العمل على الجسد والنفس والعلاقات والاستدامة" },
      { name: "2) لوحة المؤشرات الشخصية", href: "/poia-dashboard", note: "متابعة تطوّرك عبر الزمن" },
      { name: "3) مقارنة المهن", href: "/poia-compare", note: "قارن مؤشراتك بمتوسطات 20 مهنة" },
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
