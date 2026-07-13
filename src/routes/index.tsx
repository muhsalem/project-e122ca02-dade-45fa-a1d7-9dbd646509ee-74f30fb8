import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Compass, GraduationCap, Sparkles, Target, Users, BookOpen, ShieldCheck, Briefcase, Flame, HeartPulse, Gauge, TrendingUp, MapPin, Lightbulb, Route as RouteIcon, Star } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { SocialProof } from "@/components/site/SocialProof";
import { Illustration } from "@/components/site/Illustration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بوصلة — اكتشف مسارك المهني بثقة" },
      { name: "description", content: "منصة إرشاد مهني عربية: تقييمات نفسية-مهنية تجريبية مبنية على مقاييس دولية، جلسات كوتشينج فردية، ودليل تخصصات جامعية موسّع." },
      { property: "og:title", content: "بوصلة — اكتشف مسارك المهني بثقة" },
      { property: "og:description", content: "تقييمات نفسية-مهنية تجريبية، جلسات كوتشينج فردية، ودليل تخصصات جامعية." },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "بوصلة",
          url: "/",
          inLanguage: "ar",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/40 via-background to-background dark:from-primary/10 dark:via-background dark:to-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40"
          style={{ backgroundImage: "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%), radial-gradient(40% 40% at 10% 100%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)" }} />
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="relative">
            {/* (Removed decorative floating emblem — it was clipped by the section edge on tablet widths) */}
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 py-1.5 pe-4 ps-1.5 text-xs font-medium text-primary shadow-sm">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card ring-1 ring-gold/30">
                <img src={logo} alt="شعار بوصلة" width={28} height={28} className="h-7 w-7 object-contain" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              معايير دولية في الإرشاد النفسي المهني
            </span>
            <h1 className="mt-6 text-4xl leading-tight text-primary md:text-6xl">
              اكتشف ذاتك،
              <br />
              وارسم <span className="text-gold">مسارك المهني</span> بثقة.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-muted-foreground">
              منصة عربية للإرشاد المهني والكوتشينج، تخدم طلبة المدارس
              والجامعات والخريجين عبر تقييمات نفسية-مهنية تجريبية وجلسات فردية.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/career-type-assessment"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
              >
                ابدأ التقييم المجاني
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-card px-6 py-3 text-sm font-medium text-primary hover:bg-secondary"
              >
                احجز جلسة إرشاد أو كوتشينج
              </Link>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/30 to-primary/30 blur-2xl dark:from-gold/20 dark:to-primary/40" />
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)] dark:ring-1 dark:ring-gold/20">
              <img src={heroImage} alt="رحلة اكتشاف المسار المهني مع بوصلة" width={1408} height={992} className="h-full w-full object-cover" fetchPriority="high" />
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-background/60 via-transparent to-transparent dark:block" />
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container-page py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-gold">المنهجية</p>
            <h2 className="mt-3 text-3xl text-primary md:text-4xl">
              أسس علمية، نتائج ملموسة
            </h2>
            <p className="mt-4 text-muted-foreground">
              نستند إلى أُطر مرجعية معروفة في الإرشاد المهني مثل نموذج Holland
              للميول ونموذج Super لتطوير المسار، مع بنية جلسات مستوحاة من نموذج
              GROW للكوتشينج، وبتكييف يحترم الثقافة العربية وسوق العمل الإقليمي.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Brain, title: "علم النفس المهني", desc: "قياس الميول والشخصية عبر نسخ عربية تجريبية من مقاييس دولية معروفة." },
              { icon: Target, title: "تخطيط المسار", desc: "بناء خطة مهنية واضحة قصيرة وطويلة المدى مستوحاة من نموذج Super." },
              { icon: ShieldCheck, title: "كوتشينج ببنية GROW", desc: "جلسات فردية تتبع بنية GROW مع التزام بالأخلاقيات المهنية للكوتشينج." },
            ].map((p) => (
              <article key={p.title} className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-primary">{p.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="border-b border-border">
        <div className="container-page py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card p-8 text-primary">
              <Illustration name="journey" className="h-full w-full" />
            </div>
            <div>
              <p className="font-serif text-sm uppercase tracking-widest text-gold">لمن نقدم خدماتنا</p>
              <h2 className="mt-3 text-3xl text-primary md:text-4xl">رفيق رحلتك في كل مرحلة</h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: GraduationCap, t: "طلبة المدارس", d: "اكتشاف الميول مبكراً واختيار التخصص الجامعي الأنسب." },
                  { icon: BookOpen, t: "طلبة الجامعات", d: "توضيح المسار الأكاديمي وبناء مهارات التوظيف." },
                  { icon: Users, t: "الخريجون والمحترفون", d: "التحول المهني، التطوير القيادي، وتخطيط المسار." },
                ].map((a) => (
                  <div key={a.t} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-primary">{a.t}</h3>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">{a.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY — بداية المسار ولمن يريد الاكتشاف */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary via-background to-gold/10">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Compass className="h-3.5 w-3.5 text-gold" />
                مساحة آمنة لمن يبحث عن البداية
              </span>
              <h2 className="mt-6 font-serif text-3xl leading-tight text-primary md:text-5xl">
                لم تعرف بعد من أنت؟
                <br />
                <span className="text-gold">هنا تبدأ رحلتك بثقة.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
                التيه في بداية الطريق ليس ضياعاً، بل فرصةٌ لتكتشف نفسك قبل أن تختار.
                نأخذك خطوةً بخطوة من أسئلةٍ بسيطةٍ عن ميولك إلى صورةٍ واضحةٍ عن
                تخصصك ومسارك المهني — بأدواتٍ علميةٍ معتمدةٍ دولياً ولغةٍ تشبهك.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {[
                  "اكتشاف الذات والميول وفق نموذج Holland",
                  "تحديد نمط تعلمك المفضل بدقة",
                  "خريطة لأكثر من 400 تخصص جامعي",
                  "توصية بأنسب مسار مهني يشبه شخصيتك",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/self-discovery"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-90"
                >
                  ابدأ رحلة اكتشاف الذات
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/start"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-card px-6 py-3.5 text-sm font-medium text-primary hover:bg-secondary"
                >
                  أرني الطريق المناسب لي
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-sm italic leading-7 text-muted-foreground">
                «لا تختر مسارك من قائمةٍ جاهزة، بل من معرفةٍ صادقةٍ بنفسك… حينها فقط
                يصبح الطريق يشبهك.»
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-gold/30 to-primary/20 blur-2xl" />
                <div className="relative rounded-3xl border border-gold/30 bg-card p-8 shadow-[var(--shadow-elegant)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">رحلة الاكتشاف</p>
                      <p className="font-serif text-lg text-primary">من السؤال إلى الوضوح</p>
                    </div>
                  </div>
                  <ol className="mt-6 space-y-5">
                    {[
                      { n: "1", icon: Lightbulb, t: "اسأل", d: "من أنا؟ ما الذي يستهويني حقاً؟" },
                      { n: "2", icon: Brain, t: "اكتشف", d: "ميولك وقدراتك وقيمك بأدواتٍ علمية." },
                      { n: "3", icon: RouteIcon, t: "اختر", d: "التخصص والمسار الذي يشبه ذاتك." },
                      { n: "4", icon: Star, t: "انطلق", d: "بخطةٍ واضحةٍ وثقةٍ راسخة." },
                    ].map((s) => (
                      <li key={s.n} className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                          <s.icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-serif text-base text-primary">{s.t}</p>
                          <p className="mt-0.5 text-xs leading-6 text-muted-foreground">{s.d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BURNOUT — صحوة وانطلاقة جديدة */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-[#2a1810] via-primary to-[#1a0f08] text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
                <Flame className="h-3.5 w-3.5" />
                مساحة آمنة لمن أنهكه الطريق
              </span>
              <h2 className="mt-6 font-serif text-3xl leading-tight md:text-5xl">
                مُتعَب؟ مُستنزَف؟
                <br />
                <span className="text-gold">هذا ليس نهايتك… بل بداية وعيك.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-primary-foreground/85">
                الاحتراق المهني ليس ضعفاً، بل إشارة من داخلك بأن المسار الذي تسير فيه
                لم يعد يشبهك. آلاف الناجحين مرّوا من هنا، ثم نهضوا أقوى وأوضح وأكثر
                توافقاً مع ذواتهم. اليوم دورك: قِف لحظة، اقرأ نفسك بصدق، ثم أعد رسم
                خريطتك من جديد.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-primary-foreground/80 sm:grid-cols-2">
                {[
                  "قياس علمي لمستوى الإنهاك خلال 5 دقائق",
                  "تقرير شخصي بأسباب الاستنزاف ومحفزاته",
                  "خطة تعافٍ تدريجية تبدأ من اليوم",
                  "جسر مباشر لإعادة اكتشاف ذاتك ومسارك",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/burnout-check"
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-elegant)] hover:opacity-90"
                >
                  ابدأ مؤشر الاحتراق المهني
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/self-discovery"
                  className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
                >
                  أعد اكتشاف ذاتك من جديد
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-sm italic leading-7 text-primary-foreground/60">
                «أعظم تحوّلات الإنسان تبدأ من اللحظة التي يعترف فيها بإرهاقه،
                ثم يختار أن يبدأ من جديد.»
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-gold/40 to-orange-500/20 blur-2xl" />
                <div className="relative rounded-3xl border border-gold/20 bg-primary-foreground/5 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">رحلة التعافي</p>
                      <p className="font-serif text-lg">من الإنهاك إلى الوضوح</p>
                    </div>
                  </div>
                  <ol className="mt-6 space-y-5">
                    {[
                      { n: "1", t: "اعترِف", d: "اقرأ مؤشراتك بصدق دون لوم." },
                      { n: "2", t: "افهَم", d: "اكتشف جذور الاستنزاف الحقيقية." },
                      { n: "3", t: "أعِد التعريف", d: "ابنِ صورة جديدة عن ذاتك وقيمك." },
                      { n: "4", t: "انطلق", d: "ارسم مساراً يحترم طاقتك ومعناك." },
                    ].map((s) => (
                      <li key={s.n} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-sm text-gold">
                          {s.n}
                        </span>
                        <div>
                          <p className="font-serif text-base text-primary-foreground">{s.t}</p>
                          <p className="mt-0.5 text-xs leading-6 text-primary-foreground/70">{s.d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS GAP — اعرف فجوتك تَعبُر إليها */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/15 blur-2xl" />
                <div className="relative rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">مثال على التحليل</p>
                      <p className="mt-1 font-serif text-lg text-primary">مهندس بيانات → قائد فريق</p>
                    </div>
                    <Gauge className="h-8 w-8 text-gold" />
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      { s: "SQL متقدم", v: 92, c: "bg-emerald-500" },
                      { s: "تصميم الأنظمة", v: 65, c: "bg-gold" },
                      { s: "قيادة الفِرق", v: 38, c: "bg-orange-500" },
                      { s: "التواصل الاستراتيجي", v: 45, c: "bg-orange-500" },
                    ].map((k) => (
                      <div key={k.s}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary">{k.s}</span>
                          <span className="text-muted-foreground">{k.v}%</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full ${k.c}`} style={{ width: `${k.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl border border-dashed border-gold/40 bg-gold/5 p-4 text-xs leading-6 text-primary">
                    <span className="font-semibold text-gold">التوصية:</span>
                    {" "}ركّز على مهارات القيادة والتواصل خلال 90 يوماً لتجاوز الفجوة.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
                <TrendingUp className="h-3.5 w-3.5 text-gold" />
                خرائط دقيقة بين ما تملكه وما تحتاجه
              </span>
              <h2 className="mt-6 font-serif text-3xl leading-tight text-primary md:text-5xl">
                الفجوة ليست عيباً…
                <br />
                <span className="text-gold">بل خريطة طريقك القادم.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
                تحليل فجوة المهارات يُريك بدقّة أين تقف اليوم، وأين يجب أن تكون
                للوصول إلى دورك المستهدف. لا تخمين، لا حشو دورات عشوائية —
                خطة تطوير ذكية مبنية على بياناتك أنت ومتطلبات السوق الحقيقية.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {[
                  "مقارنة مهاراتك بمتطلبات الدور المستهدف",
                  "تحديد المهارات الحرجة ذات الأولوية القصوى",
                  "خطة تطوير 90 يوماً بمصادر تعلّم موثوقة",
                  "تتبّع تقدّمك ومراجعة الفجوة دورياً",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/skills-gap"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
                >
                  ابدأ تحليل فجوة المهارات
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/career-readiness"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-card px-6 py-3.5 text-sm font-medium text-primary hover:bg-secondary"
                >
                  تحقّق من شهادة الجاهزية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* JOURNEY */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-gold">رحلتك معنا</p>
            <h2 className="mt-3 text-3xl md:text-4xl">أربع خطوات نحو وضوح المسار</h2>
          </div>
          <ol className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              { n: "01", t: "التقييم", d: "أكمل تقييم الميول والشخصية المهنية." },
              { n: "02", t: "النتائج", d: "احصل على تقرير مفصل بنقاط القوة والمسارات الملائمة." },
              { n: "03", t: "الجلسة", d: "اختر مرشدك واحجز جلسة كوتشينج فردية." },
              { n: "04", t: "الخطة", d: "ابدأ تنفيذ خطتك المهنية بثقة ومتابعة." },
            ].map((s) => (
              <li key={s.n} className="border-t-2 border-gold/40 pt-5">
                <span className="font-serif text-3xl text-gold">{s.n}</span>
                <h3 className="mt-3 font-serif text-xl text-primary-foreground">{s.t}</h3>
                <p className="mt-2 text-sm leading-7 text-primary-foreground/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-b border-border">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card">
            <Briefcase className="h-20 w-20 text-primary/20" />
          </div>
          <figure>
            <p className="font-serif text-sm uppercase tracking-widest text-gold">قصة نجاح</p>
            <blockquote className="mt-4 font-serif text-2xl leading-relaxed text-primary md:text-3xl">
              «كنت تائهة بين التخصصات. بعد جلستين مع مرشدتي، صار عندي وضوح كامل
              ومسار محدد. الفرق كان حقيقياً.»
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted-foreground">
              — نور الحربي، طالبة جامعية، الرياض
            </figcaption>
            <Link
              to="/booking"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground hover:opacity-90"
            >
              ابدأ قصتك الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </figure>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <SocialProof />

      {/* CTA */}
      <section>
        <div className="container-page py-20 text-center">
          <Compass className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-4 text-3xl text-primary md:text-4xl">جاهز لتبدأ؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            خطوة واحدة تفصلك عن وضوح كامل في مسارك المهني.
          </p>
          <Link
            to="/career-type-assessment"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            ابدأ التقييم المجاني
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
