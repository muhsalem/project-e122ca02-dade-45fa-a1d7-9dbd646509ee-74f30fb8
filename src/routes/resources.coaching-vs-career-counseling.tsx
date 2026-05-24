import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2, HelpCircle, Lightbulb, Target, User } from "lucide-react";

export const Route = createFileRoute("/resources/coaching-vs-career-counseling")({
  head: () => ({
    meta: [
      { title: "هل أحتاج إلى كوتشينج أم إرشاد مهني عند اختيار المهنة؟ — بوصلة" },
      {
        name: "description",
        content:
          "الفرق الجوهري بين الإرشاد المهني والكوتشينج، ومتى تحتاج كل منهما في رحلتك المهنية.",
      },
    ],
  }),
  component: ArticlePage,
});

const SECTIONS = [
  {
    id: "intro",
    icon: BookOpen,
    title: "مقدمة",
    body: `يُعد اختيار المهنة من أهم القرارات المصيرية في حياة الإنسان، لما له من تأثير مباشر على الاستقرار النفسي، والرضا الذاتي، والمسار الحياتي والاقتصادي للفرد. ومع ازدياد تعقيد سوق العمل وتعدد الخيارات، أصبح كثير من الناس في حيرة: هل أحتاج إلى كوتشينج أم إلى إرشاد مهني؟ ورغم استخدام المصطلحين أحيانًا بالتبادل، إلا أن لكل منهما دورًا مختلفًا وتوقيتًا مناسبًا.`,
  },
  {
    id: "career-counseling",
    icon: User,
    title: "أولًا: ما هو الإرشاد المهني؟",
    body: `الإرشاد المهني هو عملية منظمة تهدف إلى مساعدة الفرد على فهم نفسه من حيث: الميول والاهتمامات، القدرات والمهارات، القيم الشخصية، السمات الشخصية؛ ثم ربط هذه الجوانب بالفرص المهنية المتاحة في سوق العمل، للوصول إلى اختيار مهني واعٍ ومناسب.`,
    bullets: [
      "توضيح البدائل المهنية الممكنة",
      "تقليل الحيرة والقلق المرتبطين بالاختيار",
      "مساعدة الفرد على اتخاذ قرار مبني على معرفة ذاتية وواقعية",
      "تقديم رؤية طويلة المدى للمسار المهني",
    ],
    whenTitle: "متى أحتاج إلى الإرشاد المهني؟",
    whenBullets: [
      "عند بداية الحياة المهنية",
      "في حالة الحيرة وعدم وضوح الاتجاه",
      "عند التفكير في تغيير مجال العمل كليًا",
      "عند الشعور بعدم التوافق بين الشخص ومهنته الحالية",
    ],
  },
  {
    id: "coaching",
    icon: Target,
    title: "ثانيًا: ما هو الكوتشينج المهني؟",
    body: `الكوتشينج المهني هو عملية تطويرية تركز على المستقبل والتنفيذ، ويهدف إلى مساعدة الفرد على تحقيق أهداف مهنية محددة، تحسين الأداء، تطوير المهارات، وتجاوز التحديات العملية. الكوتش لا يقدّم اختيارات جاهزة، بل يساعد الشخص على التحرك بفعالية داخل المسار الذي اختاره بالفعل.`,
    bullets: [
      "تحويل الأهداف إلى خطط عملية",
      "رفع مستوى الالتزام والانضباط",
      "تعزيز الثقة بالنفس",
      "دعم الانتقال المهني أو الترقي الوظيفي",
    ],
    whenTitle: "متى أحتاج إلى الكوتشينج؟",
    whenBullets: [
      "عندما يكون لدي وضوح في اختياري المهني",
      "عند الرغبة في التطور أو الترقّي",
      "في حالة الشعور بالتوقف أو الجمود المهني",
      "عند الانتقال إلى دور قيادي أو مشروع خاص",
    ],
  },
];

const COMPARISON = [
  { label: "الهدف", career: "اختيار المهنة المناسبة", coaching: "النجاح داخل المهنة" },
  { label: "السؤال الأساسي", career: "ماذا أختار؟ ولماذا؟", coaching: "كيف أتحرك وأنجح؟" },
  { label: "التركيز", career: "الفهم والوعي", coaching: "التنفيذ والإنجاز" },
  { label: "التوقيت", career: "قبل الاختيار", coaching: "بعد الاختيار" },
  { label: "الفئة المستفيدة", career: "المبتدئون أو الحائرون", coaching: "أصحاب الأهداف الواضحة" },
];

function ArticlePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/resources" className="hover:text-primary transition-colors">
            الموارد والمقالات
          </Link>
          <span>/</span>
          <span className="text-foreground">كوتشينج وإرشاد مهني</span>
        </div>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-foreground">
            إرشاد مهني
          </span>
          <h1 className="font-serif text-3xl font-bold leading-snug text-primary md:text-4xl">
            هل أحتاج إلى كوتشينج أم إرشاد مهني عند اختيار المهنة؟
          </h1>
          <p className="mt-4 text-muted-foreground">
            دليلك لفهم الفرق الجوهري بين الإرشاد المهني والكوتشينج، ومتى تختار كل منهما في رحلتك المهنية.
          </p>
        </div>

        {/* Body */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {/* Intro */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">مقدمة</h2>
              </div>
              <p className="text-foreground/80 leading-8">
                يُعد اختيار المهنة من أهم القرارات المصيرية في حياة الإنسان، لما له من تأثير مباشر على الاستقرار النفسي، والرضا الذاتي، والمسار الحياتي والاقتصادي للفرد. ومع ازدياد تعقيد سوق العمل وتعدد الخيارات، أصبح كثير من الناس في حيرة:
                <strong className="text-foreground"> هل أحتاج إلى كوتشينج أم إلى إرشاد مهني؟</strong>
                ورغم استخدام المصطلحين أحيانًا بالتبادل، إلا أن لكل منهما دورًا مختلفًا وتوقيتًا مناسبًا.
              </p>
            </section>

            {/* Career Counseling */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">أولًا: ما هو الإرشاد المهني؟</h2>
              </div>
              <p className="mb-5 text-foreground/80 leading-8">
                الإرشاد المهني هو عملية منظمة تهدف إلى مساعدة الفرد على فهم نفسه من حيث: الميول والاهتمامات، القدرات والمهارات، القيم الشخصية، السمات الشخصية؛ ثم ربط هذه الجوانب بالفرص المهنية المتاحة في سوق العمل، للوصول إلى اختيار مهني واعٍ ومناسب.
              </p>
              <h3 className="mb-3 font-semibold text-foreground">دور الإرشاد المهني</h3>
              <ul className="mb-6 space-y-2">
                {[
                  "توضيح البدائل المهنية الممكنة",
                  "تقليل الحيرة والقلق المرتبطين بالاختيار",
                  "مساعدة الفرد على اتخاذ قرار مبني على معرفة ذاتية وواقعية",
                  "تقديم رؤية طويلة المدى للمسار المهني",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-foreground/80">
                    <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-border bg-secondary/40 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  متى أحتاج إلى الإرشاد المهني؟
                </h3>
                <ul className="space-y-2">
                  {[
                    "عند بداية الحياة المهنية",
                    "في حالة الحيرة وعدم وضوح الاتجاه",
                    "عند التفكير في تغيير مجال العمل كليًا",
                    "عند الشعور بعدم التوافق بين الشخص ومهنته الحالية",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Coaching */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">ثانيًا: ما هو الكوتشينج المهني؟</h2>
              </div>
              <p className="mb-5 text-foreground/80 leading-8">
                الكوتشينج المهني هو عملية تطويرية تركز على المستقبل والتنفيذ، ويهدف إلى مساعدة الفرد على تحقيق أهداف مهنية محددة، تحسين الأداء، تطوير المهارات، وتجاوز التحديات العملية. الكوتش لا يقدّم اختيارات جاهزة، بل يساعد الشخص على التحرك بفعالية داخل المسار الذي اختاره بالفعل.
              </p>
              <h3 className="mb-3 font-semibold text-foreground">دور الكوتشينج</h3>
              <ul className="mb-6 space-y-2">
                {[
                  "تحويل الأهداف إلى خطط عملية",
                  "رفع مستوى الالتزام والانضباط",
                  "تعزيز الثقة بالنفس",
                  "دعم الانتقال المهني أو الترقي الوظيفي",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-foreground/80">
                    <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-border bg-secondary/40 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  متى أحتاج إلى الكوتشينج؟
                </h3>
                <ul className="space-y-2">
                  {[
                    "عندما يكون لدي وضوح في اختياري المهني",
                    "عند الرغبة في التطور أو الترقّي",
                    "في حالة الشعور بالتوقف أو الجمود المهني",
                    "عند الانتقال إلى دور قيادي أو مشروع خاص",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">الفرق الجوهري بين الإرشاد المهني والكوتشينج</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-3 font-semibold text-foreground">وجه المقارنة</th>
                      <th className="py-3 px-3 font-semibold text-primary">الإرشاد المهني</th>
                      <th className="py-3 px-3 font-semibold text-primary">الكوتشينج</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/80">
                    {COMPARISON.map((row) => (
                      <tr key={row.label} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-3 font-medium text-foreground">{row.label}</td>
                        <td className="py-3 px-3">{row.career}</td>
                        <td className="py-3 px-3">{row.coaching}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Conclusion */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">الخلاصة</h2>
              </div>
              <p className="mb-4 text-foreground/80 leading-8">
                اختيار المهنة خطوة تأسيسية، وأي بناء قوي يحتاج إلى أساس سليم. لذلك:
              </p>
              <ul className="mb-5 space-y-3">
                <li className="flex items-start gap-3 rounded-xl bg-secondary/40 p-4">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </span>
                  <span className="text-foreground/80 leading-7">
                    إذا كنت في مرحلة الحيرة أو البحث عن الاتجاه → <strong className="text-foreground">الإرشاد المهني هو الخيار الصحيح.</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-secondary/40 p-4">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </span>
                  <span className="text-foreground/80 leading-7">
                    إذا كنت قد اخترت بالفعل وتسعى للتقدم والإنجاز → <strong className="text-foreground">الكوتشينج هو الأداة الأنسب.</strong>
                  </span>
                </li>
              </ul>
              <p className="text-foreground/80 leading-8">
                وفي كثير من الأحيان، يبدأ الفرد بالإرشاد المهني ليصل إلى الوضوح، ثم ينتقل لاحقًا إلى الكوتشينج لتحقيق النجاح والنمو.
              </p>
            </section>

            {/* Final */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary">خاتمة</h2>
              </div>
              <p className="text-foreground/80 leading-8">
                التمييز بين الإرشاد المهني والكوتشينج ليس رفاهية، بل وعي ضروري يوفر الوقت والجهد والموارد. فلكل مرحلة أداة، ولكل سؤال منهج، والاختيار الصحيح للدعم المهني هو أول خطوة في طريق النجاح الحقيقي.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-bold text-primary">في هذا المقال</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#career-counseling" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    ما هو الإرشاد المهني؟
                  </a>
                </li>
                <li>
                  <a href="#coaching" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    ما هو الكوتشينج المهني؟
                  </a>
                </li>
                <li>
                  <a href="#comparison" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    الفرق الجوهري بينهما
                  </a>
                </li>
                <li>
                  <a href="#conclusion" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    الخلاصة والخاتمة
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center">
              <h3 className="mb-2 font-serif text-lg font-bold text-primary">جاهز تبدأ رحلتك؟</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                احجز جلسة إرشاد مهني أو كوتشينج مع مرشد متخصص يساعدك في اختيار مسارك.
              </p>
              <Link
                to="/booking"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                احجز جلستك الآن
              </Link>
            </div>
          </aside>
        </div>

        {/* Back */}
        <div className="mt-12">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة إلى الموارد والمقالات
          </Link>
        </div>
      </div>
    </div>
  );
}
