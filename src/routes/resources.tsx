import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "الموارد والمقالات — بوصلة" },
      { name: "description", content: "مقالات وأدلة في الإرشاد المهني والكوتشينج." },
    ],
  }),
  component: ResourcesPage,
});

const ARTICLES = [
  { cat: "إرشاد مهني", t: "هل أحتاج إلى كوتشينج أم إرشاد مهني عند اختيار المهنة؟", e: "الفرق الجوهري بين الإرشاد المهني والكوتشينج ومتى تختار كل منهما في رحلتك المهنية.", time: 12, to: "/resources/coaching-vs-career-counseling" },
  { cat: "طلاب المدارس", t: "كيف تختار تخصصك الجامعي دون ندم", e: "خطوات عملية لتقييم ميولك وقدراتك قبل اتخاذ القرار المصيري.", time: 6 },
  { cat: "طلاب الجامعات", t: "بناء سيرة ذاتية تلفت الأنظار", e: "أسرار كتابة CV احترافي يتجاوز خوارزميات التوظيف.", time: 8 },
  { cat: "خريجون", t: "خمس استراتيجيات للتحول المهني", e: "كيف تنتقل لمجال جديد دون أن تخسر سنوات خبرتك.", time: 10 },
  { cat: "كوتشينج", t: "نموذج GROW: أداة الكوتش الأساسية", e: "تعرّف على إطار عمل ICF لتحديد الأهداف وتحقيقها.", time: 7 },
  { cat: "علم نفس", t: "نموذج RIASEC: لماذا يهمك؟", e: "شرح مبسط لأشهر نموذج للتوجيه المهني عالمياً.", time: 5 },
  { cat: "مهارات", t: "ذكاء عاطفي = نجاح مهني", e: "العلاقة العلمية بين EQ والترقيات وفرص القيادة.", time: 9 },
];

function ResourcesPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16 text-center">
          <h1 className="text-4xl text-primary md:text-5xl">الموارد والمقالات</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            محتوى عربي أصيل في الإرشاد المهني والكوتشينج وعلم النفس التطبيقي.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => {
            const Wrapper = a.to ? Link : "article";
            const wrapperProps = a.to ? { to: a.to, className: "group block cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]" } : { className: "group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]" };
            return (
              <Wrapper key={a.t} {...wrapperProps}>
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-gold/15 px-3 py-1 font-medium text-gold-foreground">{a.cat}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.time} دقائق
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-xl leading-relaxed text-primary group-hover:text-gold">
                  {a.t}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{a.e}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                  <BookOpen className="h-4 w-4" />
                  اقرأ المقال
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>
    </>
  );
}
