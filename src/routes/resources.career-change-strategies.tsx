import { createFileRoute, Link } from "@tanstack/react-router";
import { Rocket, ArrowLeft, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/resources/career-change-strategies")({
  head: () => ({
    meta: [
      { title: "خمس استراتيجيات للتحول المهني دون خسارة الخبرة | بوصلة" },
      { name: "description", content: "كيف تنتقل إلى مجال جديد كلياً مع الاستفادة من سنوات خبرتك السابقة — 5 استراتيجيات مجرّبة في سوق العمل العربي 2026." },
      { property: "og:title", content: "5 استراتيجيات للتحول المهني" },
      { property: "og:description", content: "انتقل لمجال جديد دون أن تخسر ما بنيته." },
    ],
  }),
  component: Article,
});

function Article() {
  const strategies = [
    {
      n: "١",
      t: "استراتيجية الجسر (Bridging)",
      d: "ابحث عن دور وسيط يجمع بين خبرتك القديمة ومجالك الجديد. مثال: محاسب يريد العمل في تحليل البيانات → يبدأ كـ Financial Data Analyst قبل القفز لـ Data Scientist.",
    },
    {
      n: "٢",
      t: "استراتيجية التراكب (Stacking)",
      d: "أضف مهارة جديدة بجانب مسارك الحالي لمدة 6-12 شهراً قبل الانتقال الكامل. مثال: مهندس مدني يتعلم إدارة المشاريع → ينتقل لـ PM في الإنشاءات.",
    },
    {
      n: "٣",
      t: "استراتيجية إعادة التموضع (Repositioning)",
      d: "لا تغيّر المجال، غيّر السرد. اكتب سيرتك الذاتية مع التركيز على المهارات القابلة للنقل: قيادة، تواصل، حل مشكلات، إدارة أصحاب المصلحة.",
    },
    {
      n: "٤",
      t: "استراتيجية المشروع الجانبي (Side Project)",
      d: "ابدأ مشروعاً صغيراً في مجالك الجديد بعد ساعات العمل — يصبح معرض أعمالك. كثير من المتحولين دخلوا التصميم والكتابة والبرمجة عبر هذا الطريق.",
    },
    {
      n: "٥",
      t: "استراتيجية الدراسة المتخصصة (Credentialing)",
      d: "بعض المجالات تتطلب شهادة معتمدة للدخول (طب، محاماة، تمريض، كوتشينج ICF). احسب التكلفة والمدة والعائد المتوقع قبل البدء.",
    },
  ];

  return (
    <article className="container-page max-w-3xl py-14">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/resources" className="hover:text-primary">الموارد</Link>
        <span>/</span>
        <span>التحول المهني</span>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
        <Rocket className="h-3.5 w-3.5 text-gold" /> خريجون ومحترفون · 10 دقائق قراءة
      </span>

      <h1 className="mt-4 text-4xl text-primary md:text-5xl leading-tight">
        خمس استراتيجيات للتحول المهني دون خسارة سنوات خبرتك
      </h1>

      <p className="mt-6 text-lg leading-9 text-foreground/85">
        التحول المهني ليس قفزة في الفراغ — إنه عملية منهجية. الخطأ الأكثر شيوعاً هو الاستقالة قبل تجهيز الجسر،
        فينتهي الشخص يبدأ من الصفر براتب جونيور بعد 8 سنوات خبرة. في هذا الدليل خمس استراتيجيات مجرّبة استخدمها آلاف
        المتحولين في الخليج ومصر خلال 2024-2026.
      </p>

      <div className="mt-10 space-y-6">
        {strategies.map((s) => (
          <div key={s.n} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-bold text-primary">
                {s.n}
              </div>
              <div>
                <h2 className="font-serif text-xl text-primary">{s.t}</h2>
                <p className="mt-2 leading-8 text-foreground/85">{s.d}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-2xl text-primary">قبل القرار: 4 أسئلة محورية</h2>
      <ol className="mt-3 list-decimal space-y-2 pr-6 leading-8 text-foreground/85">
        <li>هل لديك مدخرات تكفي 6-12 شهراً من المصروفات الأساسية؟</li>
        <li>هل تحدثت مع 3 أشخاص على الأقل يعملون في المجال الجديد منذ 5+ سنوات؟</li>
        <li>هل جرّبت المجال الجديد عبر دورة أو مشروع تطوعي قبل القفز؟</li>
        <li>هل لدى من حولك (أسرة، شريك حياة) فهم وموافقة على فترة الانتقال؟</li>
      </ol>

      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-50/40 p-6 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 font-bold text-primary">
          <AlertTriangle className="h-5 w-5 text-amber-600" /> تذكير قيمي
        </div>
        <p className="mt-2 text-sm leading-7 text-foreground/85">
          السعي مسؤولية والتوفيق من الله. لا تتعجّل القرار، ولا تتأخر بعد وضوحه. صلِّ الاستخارة، استشر من تثق به، ثم امضِ.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Link to="/skills-gap" className="rounded-xl border border-border bg-card p-5 hover:border-gold">
          <p className="font-serif text-lg text-primary">حلّل فجوة مهاراتك الآن</p>
          <p className="mt-1 text-sm text-muted-foreground">احصل على خطة 90 يوماً للانتقال لدورك المستهدف.</p>
        </Link>
        <Link to="/career-ladder" className="rounded-xl border border-border bg-card p-5 hover:border-gold">
          <p className="font-serif text-lg text-primary">سلالم المسارات المهنية</p>
          <p className="mt-1 text-sm text-muted-foreground">شاهد المسار الكامل من Junior إلى Lead.</p>
        </Link>
      </div>

      <div className="mt-10 text-center">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> العودة للموارد
        </Link>
      </div>
    </article>
  );
}
