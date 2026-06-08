import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, Gift, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "الأسعار والباقات — بوصلة" },
      { name: "description", content: "أسعار شفافة لجلسات الإرشاد والكوتشينج، مع جلسة تعارف مجانية 15 دقيقة قبل أي التزام." },
      { property: "og:title", content: "الأسعار والباقات — بوصلة" },
      { property: "og:description", content: "تقييمات مجانية، جلسة تعارف مجانية، وباقات كوتشينج بأسعار واضحة." },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "هل التقييمات مجانية؟", acceptedAnswer: { "@type": "Answer", text: "نعم، جميع التقييمات الذاتية (RIASEC، Big Five، الفحص النفسي، تحليل فجوة المهارات) مجانية بالكامل." } },
          { "@type": "Question", name: "كم سعر جلسة الكوتشينج؟", acceptedAnswer: { "@type": "Answer", text: "350 ريالاً للجلسة الفردية (60 دقيقة)، و1,500 ريال لباقة 5 جلسات، مع جلسة تعارف مجانية أولى مدتها 15 دقيقة." } },
          { "@type": "Question", name: "هل يمكنني الإلغاء؟", acceptedAnswer: { "@type": "Answer", text: "نعم، يمكن إلغاء الجلسة قبل 24 ساعة من موعدها مع استرداد كامل." } },
          { "@type": "Question", name: "هل تتوفر باقات للمؤسسات؟", acceptedAnswer: { "@type": "Answer", text: "نعم، نوفر باقات مخصصة للمدارس والجامعات وأقسام الموارد البشرية مع لوحة تحكم للمشرفين وتقارير إجمالية." } },
        ],
      }),
    }],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "التقييمات الذاتية",
    price: "مجاني",
    sub: "بدون تسجيل",
    features: [
      "اكتشف ذاتك (Holland RIASEC)",
      "مؤشر الاحتراق المهني (MBI)",
      "نمط التعلم وتخصصك الدراسي",
      "تقرير AI مفصل بصيغة PDF",
    ],
    cta: { label: "ابدأ الآن", to: "/start" },
    highlighted: false,
  },
  {
    name: "جلسة كوتشينج فردية",
    price: "350",
    currency: "ر.س",
    sub: "60 دقيقة — مرشد معتمد ICF",
    features: [
      "جلسة تعارف مجانية 15 دقيقة قبل الحجز",
      "مدرب مهني (كوتش) معتمد (ACC/PCC)",
      "تفضيل جنس المدرب مكفول",
      "تقرير جلسة + خطة عمل مكتوبة",
      "دفع متوافق شرعياً (مدى، STC Pay، تابي دفعة واحدة)",
    ],
    cta: { label: "احجز جلسة تعارف مجانية", to: "/booking" },
    highlighted: true,
  },
  {
    name: "باقة المسار الكامل",
    price: "1,500",
    currency: "ر.س",
    sub: "5 جلسات + تقييم شامل",
    features: [
      "التقييم الشامل (RIASEC + MBI + UWES)",
      "5 جلسات كوتشينج (60 دق/جلسة)",
      "خطة تطوير فردية (IDP) لمدة 90 يوم",
      "متابعة عبر واتساب بين الجلسات",
      "توفير 250 ر.س مقابل الحجز الفردي",
    ],
    cta: { label: "ابدأ باقتي", to: "/booking" },
    highlighted: false,
  },
];

function PricingPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold">
            <Gift className="h-3.5 w-3.5" />
            جلسة تعارف 15 دقيقة مجانية لكل عميل جديد
          </div>
          <h1 className="mt-5 font-serif text-3xl text-primary md:text-5xl">أسعار شفافة بلا مفاجآت</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-9">
            نؤمن بأن وضوح السعر جزء من الثقة. التقييمات الأساسية مجانية للجميع،
            وجلسات الكوتشينج تبدأ بجلسة تعارف مجانية للتأكد من توافقك مع المدرب المهني (الكوتش) قبل أي دفع.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border-2 p-6 ${
                t.highlighted ? "border-gold bg-gold/5 shadow-lg" : "border-border bg-card"
              }`}
            >
              {t.highlighted && (
                <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3 w-3" />
                  الأكثر طلباً
                </div>
              )}
              <h3 className="font-serif text-xl text-primary">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{t.price}</span>
                {t.currency && <span className="text-sm text-muted-foreground">{t.currency}</span>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.sub}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={t.cta.to}
                className={`mt-6 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium ${
                  t.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-background hover:bg-muted"
                }`}
              >
                {t.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container-page grid gap-8 py-14 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "ضمان الرضا", d: "إن لم تشعر بالفائدة بعد الجلسة الأولى، نُعيد كامل القيمة." },
            { icon: Gift, t: "جلسة تعارف مجانية", d: "15 دقيقة مع المدرب المهني (الكوتش) قبل أي حجز للتأكد من التوافق." },
            { icon: Check, t: "متوافق شرعياً", d: "تابي دفعة واحدة فقط — لا فوائد، لا غرامات تأخير." },
          ].map((b) => (
            <div key={b.t} className="text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-serif text-lg text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center font-serif text-2xl text-primary">للمؤسسات والمدارس</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          نقدّم باقات مخصصة بأسعار جماعية للمدارس والجامعات والشركات،
          مع لوحة HR لمتابعة تقدّم الفريق.
        </p>
        <div className="mt-6 text-center">
          <Link
            to="/institutions"
            className="inline-flex rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
          >
            تواصل لطلب عرض سعر
          </Link>
        </div>
      </section>
    </>
  );
}
