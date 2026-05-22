import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Compass, GraduationCap, Sparkles, Target, Users, BookOpen, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import compassImg from "@/assets/compass.jpg";
import coachingImg from "@/assets/coaching.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بوصلة — اكتشف مسارك المهني بثقة" },
      { name: "description", content: "منصة إرشاد مهني عربية شاملة: تقييمات علمية، جلسات كوتشينج فردية، وموارد لكل مرحلة." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              معايير دولية في الإرشاد النفسي المهني
            </span>
            <h1 className="mt-6 text-4xl leading-tight text-primary md:text-6xl">
              اكتشف ذاتك،
              <br />
              وارسم <span className="text-gold">مسارك المهني</span> بثقة.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-muted-foreground">
              منصة عربية متكاملة للإرشاد المهني والكوتشينج، تخدم طلبة المدارس
              والجامعات والخريجين عبر تقييمات علمية وجلسات فردية مع مرشدين معتمدين.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/assessments"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
              >
                ابدأ التقييم المجاني
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-card px-6 py-3 text-sm font-medium text-primary hover:bg-secondary"
              >
                احجز جلسة كوتشينج
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { v: "+12K", l: "متدرب" },
                { v: "50+", l: "مرشد معتمد" },
                { v: "97%", l: "رضا المستفيدين" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-serif text-3xl font-bold text-primary">{s.v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/20 blur-2xl" />
            <img
              src={heroImg}
              alt="جلسة إرشاد مهني تعاونية"
              width={1600}
              height={1100}
              className="relative rounded-3xl shadow-[var(--shadow-elegant)]"
            />
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
              نعتمد على نماذج Holland و Super و ICF الدولية للكوتشينج، مع تكييف عربي
              يحترم الثقافة وسوق العمل الإقليمي.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Brain, title: "علم النفس المهني", desc: "تقييم الميول والشخصية والقدرات بأدوات معيارية موثقة." },
              { icon: Target, title: "تخطيط المسار", desc: "بناء خطة مهنية واضحة قصيرة وطويلة المدى وفق نموذج Super." },
              { icon: ShieldCheck, title: "كوتشينج ICF", desc: "جلسات فردية مع مرشدين ملتزمين بأخلاقيات الفيدرالية الدولية." },
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
            <img
              src={compassImg}
              alt="بوصلة المسار المهني"
              width={1200}
              height={900}
              loading="lazy"
              className="rounded-2xl border border-border"
            />
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
          <img src={coachingImg} alt="جلسة كوتشينج" width={1200} height={900} loading="lazy" className="rounded-2xl border border-border" />
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

      {/* CTA */}
      <section>
        <div className="container-page py-20 text-center">
          <Compass className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-4 text-3xl text-primary md:text-4xl">جاهز لتبدأ؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            خطوة واحدة تفصلك عن وضوح كامل في مسارك المهني.
          </p>
          <Link
            to="/assessments"
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
