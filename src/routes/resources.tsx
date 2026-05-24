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
  { cat: "اكتشاف المسار", t: "ما الفرق بين العمل والوظيفة والمهنة والحِرفة؟", e: "تفريق بين Occupation وJob وProfession وCraft مع السمات والأمثلة ومميزات وعيوب كل مسار.", time: 9, to: "/resources/career-path-terms" },
  { cat: "طلاب المدارس", t: "كيف تختار تخصصك الجامعي دون ندم — 7 خطوات علمية", e: "دليل عملي مبني على RIASEC وأبحاث علم النفس المهني لاختيار التخصص المناسب.", time: 6, to: "/resources/how-to-choose-major" },
  { cat: "خريجون", t: "خمس استراتيجيات للتحول المهني", e: "كيف تنتقل لمجال جديد دون أن تخسر سنوات خبرتك.", time: 10, to: "/resources/career-change-strategies" },
  { cat: "أولياء أمور", t: "كيف تساعد ابنك في اختيار تخصصه دون أن تختار له؟", e: "دليل لولي الأمر مبني على علم النفس التربوي — 5 قواعد ذهبية.", time: 8, to: "/resources/parent-guide" },
  { cat: "خريجون", t: "سيرة ذاتية تتجاوز خوارزميات ATS — دليل 2026", e: "75% من السير تُرفض قبل أن يراها بشر. تعلّم كيف تجتاز فلتر ATS.", time: 8, to: "/resources/cv-writing" },
  { cat: "كوتشينج", t: "نموذج GROW: أداة الكوتش الأساسية", e: "إطار عمل ICF لتحديد الأهداف وتحقيقها — مع أسئلة جاهزة بالعربية.", time: 7, to: "/resources/grow-model" },
  { cat: "أدوات", t: "سلالم المسارات المهنية من Junior إلى Lead", e: "خرائط مرئية لأهم 5 مسارات مهنية مع المهارات المطلوبة لكل مستوى.", time: 5, to: "/career-ladder" },
  { cat: "أدوات", t: "تحليل فجوة المهارات — Skills Gap Analysis", e: "أداة ذكية تكشف الفجوة بين مهاراتك ومتطلبات دورك المستهدف.", time: 4, to: "/skills-gap" },
  { cat: "أدوات", t: "خريطة المنح الدراسية والتدريب الحكومي 2026", e: "دليل تجميعي لأهم المنح والتدريب في 5 دول عربية + 3 منح دولية.", time: 5, to: "/scholarships" },
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
