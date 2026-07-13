import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Lightbulb, Scale, ShieldCheck, Target } from "lucide-react";
import { PsychometricCredibility } from "@/components/site/PsychometricCredibility";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — بوصلة" },
      { name: "description", content: "منصة بوصلة: قصتنا، رسالتنا، وفريقنا للإرشاد المهني والكوتشينج للناطقين بالعربية." },
      { property: "og:title", content: "من نحن — بوصلة" },
      { property: "og:description", content: "قصتنا، رسالتنا، ومنهجيتنا في الإرشاد المهني والكوتشينج العربي." },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-20 text-center">
          <h1 className="text-4xl text-primary md:text-5xl">قصتنا ورسالتنا</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
            وُلدت «بوصلة» من إيمان عميق بأن كل شاب وشابة في العالم العربي
            يستحق فرصة عادلة لاكتشاف ذاته واختيار مساره المهني بثقة ووعي.
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-serif text-sm uppercase tracking-widest text-gold">رسالتنا</p>
            <h2 className="mt-3 text-3xl text-primary">تمكين جيل واعٍ بمساره</h2>
            <p className="mt-5 leading-9 text-muted-foreground">
              نقدم خدمات إرشاد مهني وكوتشينج بمعايير علمية معتمدة من
              International Coach Federation (ICF) ونماذج Holland و Super
              المعترف بها عالمياً، مع تكييف يحترم خصوصية الثقافة العربية
              وواقع سوق العمل الإقليمي.
            </p>
          </div>
          <div>
            <p className="font-serif text-sm uppercase tracking-widest text-gold">رؤيتنا</p>
            <h2 className="mt-3 text-3xl text-primary">أن يكون لكل عربي بوصلته</h2>
            <p className="mt-5 leading-9 text-muted-foreground">
              نطمح أن نكون المرجع الأول للإرشاد المهني في العالم العربي،
              وأن نسهم في تقليص فجوة المهارات وتعزيز الرضا الوظيفي للأجيال
              القادمة.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container-page py-20">
          <h2 className="text-center text-3xl text-primary">قيمنا</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { icon: Heart, t: "التعاطف", d: "نصغي بقلب مفتوح دون أحكام." },
              { icon: Award, t: "الاحترافية", d: "نلتزم بأعلى المعايير الأخلاقية." },
              { icon: Lightbulb, t: "الأصالة", d: "نقدم محتوى مصمماً للسياق العربي." },
              { icon: Target, t: "الأثر", d: "نقيس نجاحنا بنجاح مستفيدينا." },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-primary">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl text-primary">المرجعية الشرعية</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                نحرص على أن تكون جميع خدمات بوصلة وأدواتها ضمن إطار فقهي أخلاقي سليم.
                نعمل على تأسيس <strong className="text-foreground">لجنة مراجعة شرعية</strong> تضم خبراء في الفقه المعاملات
                والأخلاقيات المهنية، تُراجع المحتوى والتوصيات دورياً وتُصدر موافقاتها بشكل مستقل.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-gold" />
                قيد التأسيس — نسعى لإعلان التشكيل خلال الربع القادم
              </div>
            </div>
          </div>
        </div>
      </section>

      <PsychometricCredibility />

      <section className="container-page py-20 text-center">
        <h2 className="text-3xl text-primary">انضم لرحلة التغيير</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          سواء كنت طالباً يبحث عن مساره أو محترفاً يخطط لمرحلة جديدة، نحن هنا.
        </p>
        <Link
          to="/booking"
          className="mt-8 inline-flex rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          ابدأ معنا اليوم
        </Link>
      </section>
    </>
  );
}
