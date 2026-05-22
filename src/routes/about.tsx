import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Lightbulb, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — بوصلة" },
      { name: "description", content: "منصة بوصلة: قصتنا، رسالتنا، وفريق المرشدين المعتمدين." },
    ],
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
