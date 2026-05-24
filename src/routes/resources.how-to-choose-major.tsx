import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/resources/how-to-choose-major")({
  head: () => ({
    meta: [
      { title: "كيف تختار تخصصك الجامعي دون ندم — 7 خطوات علمية | بوصلة" },
      { name: "description", content: "دليل عملي مبني على نموذج RIASEC وأبحاث علم النفس المهني لاختيار التخصص الجامعي المناسب لميولك وقدراتك وسوق العمل العربي 2026." },
      { property: "og:title", content: "كيف تختار تخصصك الجامعي دون ندم" },
      { property: "og:description", content: "7 خطوات عملية لاختيار تخصص يناسب ميولك وسوق العمل." },
    ],
  }),
  component: Article,
});

function Article() {
  return (
    <article className="container-page max-w-3xl py-14">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/resources" className="hover:text-primary">الموارد</Link>
        <span>/</span>
        <span>اختيار التخصص الجامعي</span>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
        <GraduationCap className="h-3.5 w-3.5 text-gold" /> طلاب المدارس · 6 دقائق قراءة
      </span>

      <h1 className="mt-4 text-4xl text-primary md:text-5xl leading-tight">كيف تختار تخصصك الجامعي دون ندم — 7 خطوات علمية</h1>

      <p className="mt-6 text-lg leading-9 text-foreground/85">
        أكثر من <strong>54٪ من خريجي الجامعات العرب</strong> يصرّحون أنهم سيختارون تخصصاً آخر لو عاد بهم الزمن (بحسب استطلاع Bayt 2024).
        السبب الرئيسي ليس قلة المعلومات، بل اعتمادهم على ثلاثة معايير ضعيفة: <em>المعدل، وضغط الأسرة، ورأي الأصدقاء</em>.
        في هذا الدليل نقدم 7 خطوات مبنية على علم النفس المهني وبيانات سوق العمل لتختار باطمئنان.
      </p>

      <h2 className="mt-12 font-serif text-2xl text-primary">١. ابدأ بنفسك لا بالتخصص</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        قبل أن تفتح قائمة التخصصات، أجب عن سؤالين: <strong>ما الأنشطة التي أفقد فيها الإحساس بالوقت؟</strong> و<strong>ما المشكلات التي أحب حلها؟</strong>
        هذا هو جوهر نموذج RIASEC الذي يصنّف الميول إلى ست فئات: واقعي، استقصائي، فني، اجتماعي، مبادر، تقليدي.
        ابدأ بـ <Link to="/self-discovery" className="text-primary underline">اختبار اكتشاف الذات</Link> لتعرف فئتك الرئيسية.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-primary">٢. افصل بين الميل والقدرة والقيمة</h2>
      <ul className="mt-3 space-y-3">
        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" /><span><strong>الميل</strong>: ما الذي تستمتع به؟</span></li>
        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" /><span><strong>القدرة</strong>: ما الذي تجيده فعلاً (لا ما تتمناه)؟</span></li>
        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" /><span><strong>القيمة</strong>: ما الذي يستحق وقتك؟ (دخل، أثر، استقرار، إبداع)</span></li>
      </ul>

      <h2 className="mt-10 font-serif text-2xl text-primary">٣. تحقق من المخرجات الفعلية للتخصص</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        لا تكتفِ باسم التخصص. اقرأ <strong>الخطة الدراسية</strong> كاملة من موقع الجامعة، وابحث عن خريجين على LinkedIn وانظر:
        أين يعملون؟ ما المسميات الوظيفية الأكثر شيوعاً؟ ما متوسط الراتب بعد 3 سنوات؟ راجع <Link to="/labor-market" className="text-primary underline">صفحة نبض السوق</Link>.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-primary">٤. اختبر التخصص قبل التخصص</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        خذ دورة مجانية مكثفة في مجال التخصص (Coursera, edX, Bayt Learning) لمدة 4-6 أسابيع. إن نفد حماسك في الأسبوع الثاني فتلك إشارة جدية.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-primary">٥. تحدث مع 3 ممارسين فعليين</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        لا تسأل أستاذ التخصص فقط — اسأل من يعمل في المهنة منذ 5+ سنوات. اسأله: <em>ما الذي لم يخبرك به أحد عن هذا المسار؟</em>
      </p>

      <h2 className="mt-10 font-serif text-2xl text-primary">٦. ضع الخطة البديلة قبل الاختيار</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        أي تخصص تختاره يجب أن يكون لديك إجابة عن: <strong>ماذا لو لم تتوفر وظائف؟</strong> التخصصات المرنة (هندسة، حاسب، إدارة أعمال، علم نفس)
        تفتح أبواباً متعددة. التخصصات المتخصصة جداً تتطلب خطة B واضحة.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-primary">٧. استشر مرشداً مهنياً مستقلاً</h2>
      <p className="mt-3 leading-8 text-foreground/85">
        المرشد المهني المحايد (ليس مسوّق جامعة) يساعدك على تجميع كل المعطيات في قرار. احجز جلسة مع
        <Link to="/booking" className="text-primary underline mx-1">مرشد معتمد</Link> قبل تقديم الأوراق.
      </p>

      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-50/40 p-6 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 font-bold text-primary">
          <AlertTriangle className="h-5 w-5 text-amber-600" /> تذكير قيمي
        </div>
        <p className="mt-2 text-sm leading-7 text-foreground/85">
          الاختيار مسؤولية، والتوفيق من الله. خذ بالأسباب، استشر أهل الخبرة، صلِّ الاستخارة، ثم توكّل وامضِ بثقة.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Link to="/academic-major" className="rounded-xl border border-border bg-card p-5 hover:border-gold">
          <p className="font-serif text-lg text-primary">ابدأ اختبار اكتشاف تخصصك</p>
          <p className="mt-1 text-sm text-muted-foreground">15 سؤالاً → 3 تخصصات موصى بها مع أسباب علمية.</p>
        </Link>
        <Link to="/resources/career-path-terms" className="rounded-xl border border-border bg-card p-5 hover:border-gold">
          <p className="font-serif text-lg text-primary">الفرق بين العمل والوظيفة والمهنة</p>
          <p className="mt-1 text-sm text-muted-foreground">مقارنة شاملة قبل اختيار مسارك.</p>
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
