import { createFileRoute, Link } from "@tanstack/react-router";

const FAQS = [
  {
    q: "ما هي منصة بوصلة؟",
    a: "منصة عربية متكاملة للإرشاد النفسي المهني والكوتشينج، تجمع أدوات تقييم علمية (RIASEC، Big Five، PHQ-2/GAD-2)، ومساعد ذكاء اصطناعي، وكوتشات معتمدين، وخطط تطوير فردية (IDP).",
  },
  {
    q: "هل الأدوات النفسية المستخدمة معتمدة علمياً؟",
    a: "نعم — نعتمد على أدوات مبنية على معايير APA و ITC، مع نسخة عربية تحت التحقّق السيكومتري المستمر. كل نتيجة تُعرض مع نطاق ثقة (±10%) وليس رقماً مطلقاً.",
  },
  {
    q: "ما موقف المنصة من MBTI والأبراج والتنجيم؟",
    a: "لا نستخدم MBTI أو Enneagram إلا للنقد العلمي، ونمنع مطلقاً أي محتوى يتعلق بالتنجيم أو الطاقة الكونية أو Law of Attraction — التزاماً بالضوابط الشرعية والعلمية.",
  },
  {
    q: "هل بياناتي آمنة؟",
    a: "نعم. نستخدم تشفير TLS 1.3، Row Level Security على قاعدة البيانات، سجل تدقيق كامل، وحدّ معدل لكل الطلبات. نلتزم بنظام حماية البيانات الشخصية السعودي (PDPL) و GDPR.",
  },
  {
    q: "هل أستطيع حذف حسابي وبياناتي؟",
    a: "نعم، من صفحة الملف الشخصي يمكنك تصدير بياناتك (JSON/PDF) أو حذف حسابك بالكامل خلال 30 يوماً.",
  },
  {
    q: "كيف تعمل جلسات الكوتشينج؟",
    a: "بعد إكمال التقييم، ستُعرض عليك قائمة الكوتشات المعتمدين المناسبين لحالتك. تحجز جلسة، يتلقّى الكوتش تقريرك (بموافقتك)، وتُجرى الجلسة عبر Cal.com.",
  },
  {
    q: "هل الأداة بديل عن العلاج النفسي؟",
    a: "لا. أداة الفحص (PHQ-2 + GAD-2) للتنبيه المبكر فقط. عند أي إشارة حرجة نوجّهك فوراً إلى الخط الصحي 937 أو مركز الاتزان 920033360.",
  },
  {
    q: "كم يستغرق التقييم الشامل؟",
    a: "بين 25 و 40 دقيقة حسب سرعتك. يمكنك الحفظ والعودة لاحقاً في أي وقت.",
  },
  {
    q: "هل الخدمة مجانية؟",
    a: "التقييمات الأساسية والتقارير مجانية. جلسات الكوتشينج المدفوعة وباقات المؤسسات لها تسعير منفصل — راجع صفحة الأسعار.",
  },
  {
    q: "كيف أتواصل مع الدعم؟",
    a: "عبر البريد support@bosla.app أو نموذج التواصل، ونلتزم بالرد خلال 24 ساعة عمل.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — بوصلة" },
      {
        name: "description",
        content: "إجابات موثوقة حول منصة بوصلة: الأدوات النفسية، الخصوصية، الكوتشينج، الأمان، والتسعير.",
      },
      { property: "og:title", content: "الأسئلة الشائعة — بوصلة" },
      { property: "og:description", content: "كل ما تريد معرفته عن بوصلة قبل البدء." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <article className="container-page mx-auto max-w-3xl py-16 text-right" dir="rtl">
      <div className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          الرئيسية
        </Link>
        <span className="mx-1">/</span>
        <span>الأسئلة الشائعة</span>
      </div>

      <h1 className="font-serif text-4xl text-primary md:text-5xl">الأسئلة الشائعة</h1>
      <p className="mt-3 text-muted-foreground">
        إجابات موجزة عن أكثر ما يسأل عنه المستخدمون قبل البدء.
      </p>

      <div className="mt-10 space-y-4">
        {FAQS.map((f, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] open:border-gold/40"
          >
            <summary className="cursor-pointer list-none font-serif text-lg text-primary marker:hidden">
              <span className="ml-2 inline-block rounded-md bg-gold/15 px-2 py-0.5 text-xs text-gold">
                {i + 1}
              </span>
              {f.q}
            </summary>
            <p className="mt-3 leading-8 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">لم تجد إجابتك؟</p>
        <a
          href="mailto:support@bosla.app"
          className="mt-2 inline-block font-medium text-primary underline decoration-gold/60 underline-offset-4"
        >
          راسلنا على support@bosla.app
        </a>
      </div>
    </article>
  );
}
