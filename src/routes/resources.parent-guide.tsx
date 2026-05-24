import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/resources/parent-guide")({
  head: () => ({
    meta: [
      { title: "دليل ولي الأمر لمساعدة ابنه في اختيار التخصص — بوصلة" },
      { name: "description", content: "كيف تدعم ابنك أو ابنتك في قرار التخصص الجامعي بدون ضغط أو إسقاط طموحاتك — دليل مبني على علم النفس التربوي." },
      { property: "og:title", content: "دليل ولي الأمر — كيف تساعد ابنك في اختيار تخصصه" },
      { property: "og:url", content: "/resources/parent-guide" },
    ],
    links: [{ rel: "canonical", href: "/resources/parent-guide" }],
  }),
  component: Article,
});

function Article() {
  return (
    <article className="container-page max-w-3xl py-14">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/resources" className="hover:text-primary">الموارد</Link>
        <span>/</span>
        <span>دليل ولي الأمر</span>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
        <Heart className="h-3.5 w-3.5 text-gold" /> أولياء الأمور · 8 دقائق قراءة
      </span>

      <h1 className="mt-4 text-4xl text-primary md:text-5xl leading-tight">كيف تساعد ابنك في اختيار تخصصه دون أن تختار له؟</h1>

      <p className="mt-6 text-lg leading-9 text-muted-foreground">
        أكبر سبب لندم الطلاب على تخصصاتهم هو "ضغط الأهل". هذا الدليل يعلّمك كيف تكون <span className="text-primary">مرشدًا داعمًا</span> لا قاضيًا. خمس قواعد ذهبية مبنية على أبحاث علم النفس التربوي.
      </p>

      <h2 className="mt-12 text-2xl text-primary">1. افصل طموحك عن طموحه</h2>
      <p className="mt-3 leading-8">
        ابنك ليس فرصتك الثانية. إذا كنت تتمنى أن يكون طبيبًا لأنك لم تستطع، فأنت تسقط رغبتك عليه. اسأل نفسك: هل أرى موهبته الحقيقية أم أرى نفسي فيه؟
      </p>

      <div className="my-6 rounded-2xl border border-gold/30 bg-gold/5 p-5">
        <p className="text-sm leading-7"><span className="font-semibold text-primary">تمرين عملي:</span> اكتب 5 تخصصات تتمناها لابنك، ثم اكتب لماذا. إذا كانت الإجابات عن المكانة أو الدخل فقط، فأنت تختار لنفسك لا له.</p>
      </div>

      <h2 className="mt-12 text-2xl text-primary">2. استمع بدون مقاطعة</h2>
      <p className="mt-3 leading-8">
        خصّص جلسة 30 دقيقة لتسمعه يتحدث عن ميوله. لا توجّه، لا تُقيّم، لا تقل "هذا ما يأكل عيش". فقط اسأل: <span className="text-primary">"ماذا يجعلك تشعر بالحماس؟"</span> ثم <span className="text-primary">"ولماذا؟"</span>.
      </p>

      <h2 className="mt-12 text-2xl text-primary">3. استبدل النصيحة بالأسئلة</h2>
      <ul className="mt-4 space-y-2 text-sm leading-7">
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />بدلًا من "ادرس هندسة"، اسأل: "ما المهارات التي تستمتع باستخدامها؟"</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />بدلًا من "هذا التخصص بلا مستقبل"، اسأل: "كيف تتخيل يومك في هذا المجال بعد 10 سنوات؟"</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />بدلًا من "أنا أعرف مصلحتك"، قل: "ما المعلومة التي تنقصك لاتخاذ القرار؟"</li>
      </ul>

      <h2 className="mt-12 text-2xl text-primary">4. اعتمدوا على بيانات لا مشاعر</h2>
      <p className="mt-3 leading-8">
        النقاش العاطفي يقود لصراع. النقاش بالبيانات يقود لقرار. اطلب من ابنك أن يخضع لتقييم RIASEC والذكاءات المتعددة (متاح مجانًا على <Link to="/career-type-assessment" className="text-primary underline">بوصلة</Link>)، واقرأ التقرير معه. سترى ميوله بشكل علمي لا انطباعي.
      </p>

      <h2 className="mt-12 text-2xl text-primary">5. اشرح الواقع بدون تخويف</h2>
      <p className="mt-3 leading-8">
        من حقك تنبيهه لتحديات السوق، لكن بأسلوب موضوعي. شاركه <Link to="/labor-market" className="text-primary underline">بيانات سوق العمل</Link> الحقيقية: الرواتب، نسب البطالة في كل تخصص، فرص العمل الحر والريموت. الواقع يقنع أكثر من التهديد.
      </p>

      <div className="my-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /><span className="font-semibold">تحذير</span></div>
        <p className="mt-2 text-sm leading-7">إذا أجبرت ابنك على تخصص لا يحبه، احتمال تركه للجامعة في السنة الأولى يرتفع 60% (دراسة OECD 2023)، ويزيد الاكتئاب 3 أضعاف. الضغط ليس استثمارًا، بل خسارة مزدوجة.</p>
      </div>

      <h2 className="mt-12 text-2xl text-primary">خاتمة: كن مرشدًا، لا مديرًا</h2>
      <p className="mt-3 leading-8">
        الأبوة الناجحة ليست في توجيه القرار، بل في تمكين القرار. ابنك سيقضي 40 سنة في مهنته — اجعله يختارها بقناعة، فيشكرك طوال عمره.
      </p>

      <div className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
        <MessageSquare className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-3 font-serif text-xl text-primary">احصل على تقرير شامل لابنك</h3>
        <p className="mt-2 text-sm text-muted-foreground">يخوض ابنك التقييمات، وتحصل أنت على تقرير PDF مبسّط بدورك كولي أمر.</p>
        <Link to="/comprehensive-assessment" className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">ابدأ التقييم الشامل</Link>
      </div>
    </article>
  );
}
