import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/resources/grow-model")({
  head: () => ({
    meta: [
      { title: "نموذج GROW: الأداة الأساسية في الكوتشينج | بوصلة" },
      { name: "description", content: "تعرّف على إطار عمل GROW المعتمد من ICF: Goal, Reality, Options, Will — مع أمثلة عربية وأسئلة جاهزة." },
      { property: "og:title", content: "نموذج GROW في الكوتشينج" },
      { property: "og:url", content: "/resources/grow-model" },
    ],
    links: [{ rel: "canonical", href: "/resources/grow-model" }],
  }),
  component: Article,
});

const STEPS = [
  { letter: "G", title: "Goal — الهدف", color: "text-gold", desc: "اسأل: ما الذي تريد تحقيقه تحديدًا؟ كيف ستعرف أنك حققته؟ ما المهلة؟", qs: ["ما هدفك من جلستنا اليوم؟", "بنهاية 6 أشهر، كيف تبدو حياتك المهنية المثالية؟", "ما الذي يجعل هذا الهدف مهمًا لك الآن؟"] },
  { letter: "R", title: "Reality — الواقع", color: "text-primary", desc: "افحص الوضع الحالي بصدق: ما المتاح؟ ما العقبات؟ ما حاولت من قبل؟", qs: ["أين أنت الآن من هذا الهدف على مقياس 1–10؟", "ما الذي جربته سابقًا ولم ينجح؟", "ما الموارد المتاحة لديك بالفعل؟"] },
  { letter: "O", title: "Options — الخيارات", color: "text-gold", desc: "ولّد بدائل متعددة قبل اختيار واحد. المدرب المهني (الكوتش) لا يقترح — بل يستخرج.", qs: ["ما 5 طرق مختلفة للوصول لهدفك؟", "لو لم تكن أي قيود، ماذا ستفعل؟", "من تعرف نجح في موقف مشابه؟ كيف فعلها؟"] },
  { letter: "W", title: "Will — الالتزام", color: "text-primary", desc: "حوّل النية إلى خطة محددة بالخطوة الأولى والمهلة وآلية المتابعة.", qs: ["ما أول خطوة ستتخذها هذا الأسبوع؟", "ما العقبة المحتملة وكيف ستتعامل معها؟", "متى نراجع التقدم؟ وكيف ستحاسب نفسك؟"] },
];

function Article() {
  return (
    <article className="container-page max-w-3xl py-14">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/resources" className="hover:text-primary">الموارد</Link><span>/</span><span>نموذج GROW</span>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
        <Target className="h-3.5 w-3.5 text-gold" /> كوتشينج · 7 دقائق قراءة
      </span>

      <h1 className="mt-4 text-4xl text-primary md:text-5xl leading-tight">نموذج GROW: أداة المدرب المهني (الكوتش) الأساسية</h1>

      <p className="mt-6 text-lg leading-9 text-muted-foreground">
        طوّره John Whitmore عام 1992، واعتمده الاتحاد الدولي للمدربين (ICF) كإطار عمل أساسي. أربع خطوات بسيطة تنقل العميل من الحلم إلى التنفيذ.
      </p>

      <div className="mt-10 space-y-6">
        {STEPS.map((s) => (
          <div key={s.letter} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 font-serif text-3xl ${s.color}`}>{s.letter}</div>
              <h2 className="font-serif text-2xl text-primary">{s.title}</h2>
            </div>
            <p className="mt-4 leading-8">{s.desc}</p>
            <p className="mt-4 text-sm font-semibold text-primary">أسئلة جاهزة:</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-7">
              {s.qs.map((q) => <li key={q} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />{q}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl text-primary">قاعدة ذهبية</h2>
      <p className="mt-3 leading-8">المدرب المهني (الكوتش) لا يقدّم حلولًا. مهمته أن يسأل أسئلة تجعل العميل يكتشف الحل بنفسه. اقطع نفسك كلما شعرت أنك تنصح، وحوّل النصيحة إلى سؤال.</p>

      <div className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
        <h3 className="font-serif text-xl text-primary">جرّب GROW مع مدرب مهني (كوتش) معتمد</h3>
        <Link to="/booking" className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">احجز جلسة كوتشينج</Link>
      </div>
    </article>
  );
}
