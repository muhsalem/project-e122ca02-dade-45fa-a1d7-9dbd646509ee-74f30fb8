import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/resources/cv-writing")({
  head: () => ({
    meta: [
      { title: "كيف تكتب سيرة ذاتية تتجاوز خوارزميات ATS — دليل 2026 | بوصلة" },
      { name: "description", content: "أسرار كتابة CV احترافي يجتاز أنظمة التتبع ATS ويلفت أنظار التوظيف — قوالب وأمثلة عربية وإنجليزية." },
      { property: "og:title", content: "بناء سيرة ذاتية تتجاوز خوارزميات التوظيف" },
      { property: "og:url", content: "/resources/cv-writing" },
    ],
    links: [{ rel: "canonical", href: "/resources/cv-writing" }],
  }),
  component: Article,
});

function Article() {
  return (
    <article className="container-page max-w-3xl py-14">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/resources" className="hover:text-primary">الموارد</Link><span>/</span><span>كتابة السيرة الذاتية</span>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
        <FileText className="h-3.5 w-3.5 text-gold" /> خريجون · 8 دقائق قراءة
      </span>

      <h1 className="mt-4 text-4xl text-primary md:text-5xl leading-tight">سيرة ذاتية تتجاوز خوارزميات ATS — دليل 2026</h1>

      <p className="mt-6 text-lg leading-9 text-muted-foreground">
        75% من السير الذاتية تُرفض قبل أن يراها بشر. السبب: أنظمة التتبع الآلي (ATS). هذا الدليل يعلّمك كيف تكتب CV يتجاوز الفلتر ويلفت أنظار التوظيف خلال 6 ثوانٍ.
      </p>

      <h2 className="mt-10 text-2xl text-primary">1. هيكل ATS-Friendly</h2>
      <ul className="mt-3 space-y-2 text-sm leading-7">
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />استخدم تنسيقًا واحد العمود (single column)، لا تستخدم الجداول أو الأعمدة المتعددة.</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />خط Arial أو Calibri بحجم 11–12، تجنّب الخطوط المزخرفة.</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />احفظ الملف بصيغة .docx أو .pdf نصي (لا صور!).</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />عناوين أقسام معيارية: Experience, Education, Skills.</li>
      </ul>

      <h2 className="mt-10 text-2xl text-primary">2. الكلمات المفتاحية (Keywords)</h2>
      <p className="mt-3 leading-8">انسخ 3 إعلانات وظيفية مشابهة، استخرج المهارات المتكررة، وضعها حرفيًا في سيرتك. ATS يبحث عن تطابق نصي، لا عن مرادفات.</p>

      <h2 className="mt-10 text-2xl text-primary">3. صياغة الإنجازات بصيغة CAR</h2>
      <p className="mt-3 leading-8">بدلًا من "مسؤول عن التسويق"، اكتب:</p>
      <div className="my-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-7">
        <span className="font-semibold text-primary">Challenge:</span> انخفاض المتابعين 20% خلال Q3<br/>
        <span className="font-semibold text-primary">Action:</span> أعدت بناء استراتيجية المحتوى بـ 4 صيغ فيديو<br/>
        <span className="font-semibold text-primary">Result:</span> نمو 150% خلال 90 يومًا و 3 عقود رعاية
      </div>

      <h2 className="mt-10 text-2xl text-primary">4. اللغة: عربي أم إنجليزي؟</h2>
      <p className="mt-3 leading-8">في الخليج: <span className="text-primary">إنجليزي</span> هو القاعدة (إلا للوظائف الحكومية). في مصر والشام: ابعث الاثنين إن أمكن. في الوظائف التقنية: إنجليزي حصرًا.</p>

      <h2 className="mt-10 text-2xl text-primary">5. الطول المثالي</h2>
      <p className="mt-3 leading-8">صفحة واحدة لأقل من 5 سنوات خبرة، صفحتان للمزيد. لا تتجاوز ذلك إطلاقًا — مديرو التوظيف يقضون 6 ثوانٍ فقط على CV.</p>

      <div className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
        <h3 className="font-serif text-xl text-primary">حلّل فجوة مهاراتك أولًا</h3>
        <p className="mt-2 text-sm text-muted-foreground">قبل كتابة CV، اعرف أي مهارات تحتاج لإبرازها لكل دور تستهدفه.</p>
        <Link to="/skills-gap" className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">ابدأ تحليل فجوة المهارات</Link>
      </div>
    </article>
  );
}
