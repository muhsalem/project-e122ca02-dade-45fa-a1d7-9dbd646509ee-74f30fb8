import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Brain, Compass, GraduationCap, Sparkles, Target, Users, BookOpen, ShieldCheck, Briefcase, Flame, HeartPulse, Gauge, TrendingUp, MapPin, Lightbulb, Route as RouteIcon, Star, CheckCircle2, Search, Repeat, Rocket, Activity, Layers } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { SocialProof } from "@/components/site/SocialProof";
import { Illustration } from "@/components/site/Illustration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بوصلة — الإرشاد التربوي والأكاديمي والمهني" },
      { name: "description", content: "منصة عربية متخصّصة في الإرشاد التربوي والأكاديمي والمهني: تقييمات مفتوحة الترخيص، توجيه دراسي وجامعي، وتخطيط مسار مهني للطلاب والخريجين والمرشدين." },
      { property: "og:title", content: "بوصلة — الإرشاد التربوي والأكاديمي والمهني" },
      { property: "og:description", content: "إرشاد تربوي وأكاديمي ومهني بمنهجية علمية: من اكتشاف الذات إلى اختيار التخصص وبناء المسار المهني." },
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
              متخصّصون في الإرشاد التربوي والأكاديمي والمهني
            </span>
            <h1 className="mt-6 text-4xl leading-tight text-primary md:text-6xl">
              إرشاد <span className="text-gold">تربوي وأكاديمي ومهني</span>
              <br />
              يرافقك من المدرسة إلى سوق العمل.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-muted-foreground">
              منصة عربية متخصّصة في الإرشاد التربوي والأكاديمي والمهني: نساعد الطلاب
              وأولياء الأمور والمرشدين على اتخاذ قرارات دراسية ومهنية واعية،
              بمنهجية علمية ومقاييس مفتوحة الترخيص.
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
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border bg-[#0b1a3a] shadow-[var(--shadow-elegant)] dark:ring-1 dark:ring-gold/20">
              <img src={heroImage} alt="رحلة اكتشاف المسار المهني مع بوصلة" width={1408} height={992} className="h-full w-full object-contain" fetchPriority="high" />
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-background/60 via-transparent to-transparent dark:block" />
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container-page py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-gold">تخصّصنا</p>
            <h2 className="mt-3 text-3xl text-primary md:text-4xl">
              ثلاثة محاور للإرشاد… رحلة واحدة متكاملة
            </h2>
            <p className="mt-4 text-muted-foreground">
              نجمع بين الإرشاد التربوي (مهارات التعلّم والدافعية والرفاه النفسي)،
              والإرشاد الأكاديمي (اختيار التخصص والمسار الدراسي)، والإرشاد المهني
              (المسار الوظيفي وتطوير الأداء) — بأُطر معروفة مثل Holland و Super و GROW.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "الإرشاد التربوي", desc: "تنمية عادات التعلّم والدافعية والتوازن النفسي عبر Study OS و Learning DNA." },
              { icon: GraduationCap, title: "الإرشاد الأكاديمي", desc: "توجيه اختيار التخصص الجامعي والمسار الدراسي بأدوات قياس ميول علمية." },
              { icon: Briefcase, title: "الإرشاد المهني", desc: "بناء خطة مهنية واضحة وتطوير المسار الوظيفي بمنهجية Super و GROW." },
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

      {/* WIIFM — ماذا تكسب أنت شخصيًا؟ */}
      <section className="border-b border-border bg-gradient-to-b from-background via-gold/5 to-background">
        <div className="container-page py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-gold">WIIFM · ماذا في الأمر لي؟</p>
            <h2 className="mt-3 text-3xl text-primary md:text-4xl">ماذا تكسب أنت شخصيًا من بوصلة؟</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              لا نطلب منك وقتك دون مقابل واضح. إليك ما ستحصل عليه فعليًا — نتائج ملموسة يمكنك قياسها والاحتفاظ بها.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Compass, t: "وضوح فوري في المسار", d: "تعرف تخصصك ومهنتك الأنسب بنسب توافق مبنية على 5 مقاييس علمية مفتوحة." },
              { icon: Gauge, t: "توفير سنوات من التخبّط", d: "قرارات مبنية على بيانات شخصيتك وميولك بدل التجربة والخطأ المكلف." },
              { icon: ShieldCheck, t: "تقرير PDF تحتفظ به", d: "نتائجك كاملة قابلة للتصدير والمشاركة مع مرشدك أو عائلتك متى شئت." },
              { icon: TrendingUp, t: "خطة تنفيذية أسبوعية", d: "ليس مجرد تحليل — بل خطوات عملية محددة توصلك من نقطتك الحالية لهدفك." },
              { icon: HeartPulse, t: "حماية من الاحتراق", d: "مؤشرات مبكرة عبر OLBI و UWES-9 تنبّهك قبل أن يستنزفك مسار لا يناسبك." },
              { icon: Sparkles, t: "خصوصية كاملة وشفافية", d: "بياناتك ملكك، ومصادر كل مقياس معلنة بترخيصها — بلا صناديق سوداء." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-primary">{b.t}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/passport"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-all hover:shadow-lg"
            >
              ابدأ رحلتك الآن — مجانًا
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">لا يتطلب بطاقة ائتمانية · النتائج جاهزة خلال 20 دقيقة</p>
          </div>
        </div>
      </section>



      {/* START HERE — تبويبات المسارات الثلاثة */}
      <StartHereTabs />


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
                لم يعد يشبهك. كثيرون مرّوا من هنا، ثم نهضوا أوضح وأكثر توافقاً مع
                ذواتهم. اليوم دورك: قِف لحظة، اقرأ نفسك بصدق، ثم أعد رسم
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

// ============================================================
// StartHereTabs — قسم "ابدأ من هنا" بتبويبات المسارات الثلاثة
// ============================================================
type MainTab = "educational" | "academic" | "career";
type CareerSub = "discover" | "change" | "grow";

type StepLink = { name: string; href: string; note?: string };
type TrackBlock = {
  title: string;
  desc: string;
  icon: typeof BookOpen;
  outcome: string;
  steps: StepLink[];
  cta: { label: string; href: string };
};

const EDU_TRACKS: TrackBlock[] = [
  {
    title: "أنماط التعلّم و Learning DNA",
    desc: "اكتشف كيف يعمل عقلك فعلياً: تركيز، ذاكرة، حلّ مشكلات، وأسلوب التعلّم.",
    icon: Brain,
    outcome: "٧ مؤشرات مركّبة + خطة تعلّم شخصية",
    steps: [
      { name: "نمط التعلّم التمهيدي (VARK + Kolb)", href: "/learning-style", note: "٥ دقائق فقط" },
      { name: "اختبار Learning DNA الشامل", href: "/learning-dna" },
      { name: "لوحة Learning DNA الشخصية", href: "/learning-dna-dashboard" },
    ],
    cta: { label: "ابدأ باختبار نمط التعلّم", href: "/learning-style" },
  },
  {
    title: "نظام المذاكرة — Study OS",
    desc: "عادات دراسية فعّالة: Pomodoro، بطاقات بتباعد زمني، و Check-in يومي.",
    icon: BookOpen,
    outcome: "جلسات مركّزة + متابعة أسبوعية",
    steps: [
      { name: "تشغيل Study OS", href: "/study-os" },
      { name: "مهارات ما وراء المعرفة", href: "/meta-learning" },
      { name: "AI Learning Coach", href: "/learning-coach" },
    ],
    cta: { label: "افتح Study OS", href: "/study-os" },
  },
  {
    title: "الصحّة النفسية والتوازن",
    desc: "فرز نفسي سريع للطالب أو الموظّف عند الشعور بالإرهاق.",
    icon: HeartPulse,
    outcome: "توصية فرز + إحالة عند الحاجة",
    steps: [
      { name: "الفحص النفسي المختصر (PHQ-2 + GAD-2)", href: "/wellbeing-check", note: "للفرز فقط، لا يغني عن مختصّ" },
    ],
    cta: { label: "ابدأ الفحص المختصر", href: "/wellbeing-check" },
  },
];

const ACADEMIC_TRACKS: TrackBlock[] = [
  {
    title: "أريد اختيار تخصّصي الجامعي",
    desc: "من اكتشاف الميول والقدرات إلى مطابقتها بأنسب التخصصات الجامعية.",
    icon: GraduationCap,
    outcome: "قائمة أنسب ٥ تخصّصات بنسبة توافق واضحة",
    steps: [
      { name: "١) القيم المهنية (WVI)", href: "/work-values" },
      { name: "٢) اكتشاف الذات (Big Five + O*NET)", href: "/self-discovery" },
      { name: "٣) الملف المعرفي (القدرات الأربع)", href: "/cognitive-profile" },
      { name: "٤) التخصّص الجامعي المناسب", href: "/academic-major" },
      { name: "٥) مستكشف التخصصات", href: "/specializations" },
    ],
    cta: { label: "ابدأ رحلة اختيار التخصّص", href: "/self-discovery" },
  },
  {
    title: "أنا ولي أمر / مدرسة",
    desc: "دليل مبسّط لدعم الابن في قرار التخصّص دون توجيه قسري.",
    icon: Users,
    outcome: "تقرير مبسّط + إرشادات عملية",
    steps: [
      { name: "لوحة ولي الأمر", href: "/parent-dashboard" },
      { name: "دليل المدارس", href: "/schools" },
      { name: "كيف تختار تخصّصك؟ (دليل موسّع)", href: "/resources/how-to-choose-major" },
    ],
    cta: { label: "افتح لوحة ولي الأمر", href: "/parent-dashboard" },
  },
];

const CAREER_TRACKS: Record<CareerSub, TrackBlock[]> = {
  discover: [
    {
      title: "المسار (أ) — أريد الاكتشاف",
      desc: "خرّيج أو باحث عن عمل ولم تحدّد مسارك بعد؟ ابدأ باكتشاف ذاتك.",
      icon: Search,
      outcome: "تقرير اكتشاف الذات + اقتراح أنسب ٥ مهن",
      steps: [
        { name: "١) القيم المهنية (WVI)", href: "/work-values" },
        { name: "٢) مرساة المسيرة المهنية (Schein)", href: "/career-anchors" },
        { name: "٣) اكتشاف الذات (Big Five + O*NET)", href: "/self-discovery" },
        { name: "٤) اكتشاف المسار المهني (ISCO-08)", href: "/career-type-assessment" },
        { name: "٥) هوية المسار (VISA)", href: "/career-anchors" },
      ],
      cta: { label: "ابدأ اكتشاف مسارك", href: "/self-discovery" },
    },
  ],
  change: [
    {
      title: "المسار (ب) — أريد التغيير",
      desc: "موظّف يفكّر في تغيير مساره؟ خذ قراراً واضحاً: ابقَ / طوّر / غيّر.",
      icon: Repeat,
      outcome: "قرار مبني على بيانات + خطة انتقال آمنة",
      steps: [
        { name: "١) وضوح المسار المهني", href: "/clarity-check" },
        { name: "٢) مؤشر الاحتراق (OLBI)", href: "/burnout-check" },
        { name: "٣) تشخيص تغيير المسار", href: "/career-change" },
        { name: "٤) الكفاءة الذاتية لاتخاذ القرار", href: "/career-self-efficacy" },
      ],
      cta: { label: "ابدأ تشخيص التغيير", href: "/clarity-check" },
    },
  ],
  grow: [
    {
      title: "المسار (ج) — أريد التطوّر والترقّي",
      desc: "موظّف طموح راضٍ عن مساره ويريد الترقّي والتطوير المستمر.",
      icon: Rocket,
      outcome: "خطة تطوير فردية (IDP) ٩٠ يوماً + سلّم مهني",
      steps: [
        { name: "١) الذكاء العاطفي (IPIP-EI)", href: "/emotional-intelligence" },
        { name: "٢) تطوير المسار الوظيفي", href: "/career-growth" },
        { name: "٣) سلالم المسارات المهنية", href: "/career-ladder" },
        { name: "٤) تقييم 360° (اختياري)", href: "/review360" },
        { name: "٥) شهادة الجاهزية المهنية", href: "/career-readiness" },
      ],
      cta: { label: "ابدأ خطة التطوير", href: "/career-growth" },
    },
  ],
};

const MAIN_TABS: { id: MainTab; label: string; sub: string; icon: typeof BookOpen; chip: string }[] = [
  { id: "educational", label: "الإرشاد التربوي", sub: "أنماط التعلّم والمذاكرة والصحّة النفسية", icon: BookOpen, chip: "للطلاب والمتدرّبين" },
  { id: "academic", label: "أبدأ مشروعي الأكاديمي", sub: "اختيار التخصّص الجامعي والمسار الدراسي", icon: GraduationCap, chip: "لطلاب الثانوية والجامعة" },
  { id: "career", label: "أبدأ مشروعي المهني", sub: "اكتشاف / تغيير / تطوير المسار المهني", icon: Briefcase, chip: "للخريجين والموظفين" },
];

const CAREER_SUBS: { id: CareerSub; label: string; icon: typeof Search }[] = [
  { id: "discover", label: "أريد الاكتشاف", icon: Search },
  { id: "change", label: "أريد التغيير", icon: Repeat },
  { id: "grow", label: "أريد التطوير", icon: Rocket },
];

function StartHereTabs() {
  const [tab, setTab] = useState<MainTab>("educational");
  const [careerSub, setCareerSub] = useState<CareerSub>("discover");

  const blocks: TrackBlock[] =
    tab === "educational" ? EDU_TRACKS :
    tab === "academic" ? ACADEMIC_TRACKS :
    CAREER_TRACKS[careerSub];

  return (
    <section id="start-here" className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary via-background to-gold/10 scroll-mt-24">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container-page relative py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Compass className="h-3.5 w-3.5 text-gold" />
            ابدأ من هنا — كل مسارات بوصلة في مكان واحد
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-primary md:text-5xl">
            اختر مسارك ثم <span className="text-gold">ابدأ خطوتك الأولى</span>
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            نظّمنا خدمات بوصلة في ثلاثة مسارات: <span className="font-semibold text-primary">تربوي</span> ·
            <span className="mx-1 font-semibold text-primary">أكاديمي</span> ·
            <span className="mx-1 font-semibold text-primary">مهني</span>.
            اختر المسار الذي يصف مرحلتك الآن، وسنعرض لك الخطوات المرتّبة.
          </p>
        </div>

        {/* Main tabs */}
        <div role="tablist" aria-label="اختر مسارك" className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-3">
          {MAIN_TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`group rounded-2xl border-2 p-5 text-right transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                    : "border-border bg-card text-primary hover:border-gold/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${active ? "text-gold" : "text-muted-foreground"}`} />
                  <span className={`text-[11px] font-medium ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {t.chip}
                  </span>
                </div>
                <div className="mt-3 font-serif text-lg">{t.label}</div>
                <div className={`mt-1 text-xs ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                  {t.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Career sub-tabs */}
        {tab === "career" && (
          <div role="tablist" aria-label="نوع الإرشاد المهني" className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {CAREER_SUBS.map((s) => {
              const Icon = s.icon;
              const active = careerSub === s.id;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCareerSub(s.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    active
                      ? "border-gold bg-gold/15 text-primary font-semibold"
                      : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4 text-gold" />
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Blocks */}
        <div className={`mx-auto mt-10 grid max-w-6xl gap-5 ${blocks.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-1"}`}>
          {blocks.map((b) => {
            const Icon = b.icon;
            return (
              <article
                key={b.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-primary">{b.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{b.desc}</p>
                  </div>
                </div>

                <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-6 text-primary">
                  <span className="font-semibold">المخرج:</span> {b.outcome}
                </p>

                <ol className="mt-4 flex-1 space-y-2">
                  {b.steps.map((st) => (
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

                <Link
                  to={b.cta.href}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  {b.cta.label}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card/70 p-5 text-center text-sm text-muted-foreground">
          لا تعرف من أين تبدأ؟{" "}
          <Link to="/start" className="font-semibold text-primary underline-offset-4 hover:underline">
            جرّب مساعد الترشيح الذكي
          </Link>{" "}
          أو اذهب إلى{" "}
          <Link to="/paths" className="font-semibold text-primary underline-offset-4 hover:underline">
            خريطة المسارات الكاملة
          </Link>
          .
        </div>
      </div>
    </section>
  );
}

