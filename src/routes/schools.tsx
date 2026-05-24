import { createFileRoute, Link } from "@tanstack/react-router";
import { School, Users, FileText, BarChart3, ShieldCheck, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: "بوصلة للمدارس — لوحة الإرشاد المهني المدرسي B2B" },
      { name: "description", content: "حلّ متكامل للمدارس والجامعات: تقييمات نفسية ومهنية لكل طالب، لوحة تحكم للمرشد، تقارير لأولياء الأمور، وتحليلات على مستوى الفصل." },
      { property: "og:title", content: "بوصلة للمدارس — منصة الإرشاد المهني B2B" },
      { property: "og:description", content: "اشتراك سنوي للمدارس بدءًا من 5,000 ر.س. تقييمات + تقارير + لوحة مرشد." },
      { property: "og:url", content: "/schools" },
    ],
    links: [{ rel: "canonical", href: "/schools" }],
  }),
  component: SchoolsPage,
});

const FEATURES = [
  { icon: Users, t: "حسابات لجميع الطلاب", d: "أنشئ حسابات لـ 100–2000 طالب دفعة واحدة، مع روابط دعوة مخصّصة لكل فصل دراسي." },
  { icon: FileText, t: "تقارير AI لكل طالب", d: "تقرير شخصي بالعربية يجمع RIASEC + الذكاءات المتعددة + التخصصات الموصى بها مع مميزاتها وعيوبها." },
  { icon: BarChart3, t: "لوحة المرشد الطلابي", d: "اعرض توزيع الميول المهنية على مستوى الفصل، حدّد الطلاب الأكثر تشتتًا، وتابع تقدّمهم." },
  { icon: FileText, t: "تقرير ولي الأمر (PDF عربي)", d: "تقرير مبسّط ومُترجَم لغة الأهل: نقاط القوة، التخصصات المناسبة، وكيف يدعم ابنه/ابنته." },
  { icon: ShieldCheck, t: "متوافق مع الأخلاقيات", d: "حماية بيانات الطلاب، موافقة ولي الأمر، وميثاق أخلاقي مطابق لمعايير ICF و APA." },
  { icon: Sparkles, t: "ورش وتدريب للمرشدين", d: "تدريب فريقك على تفسير التقارير وإجراء جلسات إرشاد فردية باستخدام نموذج GROW." },
];

const PLANS = [
  { name: "مدرسة ناشئة", price: "5,000", students: "حتى 200 طالب", features: ["تقييمات RIASEC + الذكاءات", "تقارير AI فردية", "لوحة مرشد أساسية", "دعم بريدي"] },
  { name: "مدرسة متكاملة", price: "12,000", students: "حتى 800 طالب", features: ["جميع التقييمات السبعة", "تقارير ولي الأمر PDF", "لوحة تحليلات متقدمة", "ورشتان تدريبيتان للمرشدين", "دعم مخصّص"], featured: true },
  { name: "شبكة مدارس", price: "حسب الطلب", students: "+2000 طالب", features: ["جميع الميزات", "تخصيص العلامة التجارية", "تكامل مع نظام المدرسة", "مدير حساب مخصّص", "تقارير مقارنة بين الفروع"] },
];

function SchoolsPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-primary">
            <School className="h-4 w-4 text-gold" /> حلّ B2B للمدارس والجامعات
          </span>
          <h1 className="mt-5 text-4xl text-primary md:text-5xl leading-tight">
            بوصلة للمدارس
            <span className="block text-2xl mt-2 text-muted-foreground font-sans">إرشاد مهني علمي لكل طالب — في مدرستك</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-muted-foreground">
            بدلًا من نصائح عامة، يحصل كل طالب على تقرير شخصي بالعربية مبني على 7 تقييمات معتمدة. ويحصل المرشد على لوحة تحكم تكشف ميول الفصل بأكمله.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="mailto:schools@busala.app?subject=طلب%20عرض%20بوصلة%20للمدارس" className="rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">احجز عرضًا تجريبيًا</a>
            <Link to="/about" className="rounded-xl border border-border px-6 py-3 text-sm hover:bg-secondary">تعرّف على المنهج</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-3xl text-primary">ماذا تحصل عليه المدرسة؟</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6">
              <f.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-serif text-lg text-primary">{f.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="container-page">
          <h2 className="text-center text-3xl text-primary">باقات اشتراك سنوية</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">الأسعار بالريال السعودي، وتشمل التدريب والدعم الفني طوال العام الدراسي.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`rounded-2xl border bg-card p-6 ${p.featured ? "border-gold shadow-[var(--shadow-soft)]" : "border-border"}`}>
                {p.featured && <span className="rounded-full bg-gold px-3 py-1 text-xs text-gold-foreground">الأكثر طلبًا</span>}
                <h3 className="mt-3 font-serif text-xl text-primary">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl text-primary">{p.price}</span>
                  <span className="text-sm text-muted-foreground">ر.س/سنة</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.students}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-3xl text-primary">جاهزون للبدء مع مدرستك؟</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">نوفّر فترة تجريبية مجانية لمدة 14 يومًا مع 30 طالبًا لتقييم الجودة قبل الالتزام.</p>
        <a href="mailto:schools@busala.app" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">
          تواصل معنا <ArrowLeft className="h-4 w-4" />
        </a>
      </section>
    </>
  );
}
