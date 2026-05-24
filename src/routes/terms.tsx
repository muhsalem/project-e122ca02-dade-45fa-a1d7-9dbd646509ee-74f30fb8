import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام — بوصلة" },
      { name: "description", content: "الشروط والأحكام الخاصة باستخدام منصة بوصلة للإرشاد المهني والكوتشينج." },
      { property: "og:title", content: "الشروط والأحكام — بوصلة" },
      { property: "og:description", content: "الشروط والأحكام الخاصة باستخدام منصة بوصلة." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="container-page max-w-3xl py-16 leading-relaxed">
      <h1 className="font-serif text-4xl text-primary">الشروط والأحكام</h1>
      <p className="mt-2 text-sm text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString("ar-EG")}</p>

      <section className="mt-8 space-y-4 text-foreground/90">
        <h2 className="font-serif text-2xl text-primary">1. قبول الشروط</h2>
        <p>باستخدامك منصة <strong>بوصلة</strong> فإنك توافق على هذه الشروط والأحكام كاملة. إن لم توافق، يُرجى عدم استخدام المنصة.</p>

        <h2 className="font-serif text-2xl text-primary">2. طبيعة الخدمة</h2>
        <p>تقدم بوصلة أدوات تقييم وإرشاد مهني وكوتشينج عبر الإنترنت. النتائج إرشادية ولا تُعدّ تشخيصاً نفسياً أو طبياً.</p>

        <h2 className="font-serif text-2xl text-primary">3. الملكية الفكرية</h2>
        <p>جميع محتويات المنصة — تشمل الأسماء، الشعار، التصاميم، التقييمات، الأسئلة، التقارير، الأكواد البرمجية، وأدلة القطاعات — هي ملكية حصرية لـ <strong>بوصلة</strong> ومحمية بحقوق النشر والعلامات التجارية. يُمنع منعاً باتاً النسخ أو إعادة الإنتاج أو التوزيع أو الاستخدام التجاري دون إذن خطي مسبق.</p>

        <h2 className="font-serif text-2xl text-primary">4. الاستخدام المسموح</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>الاستخدام الشخصي وغير التجاري فقط.</li>
          <li>عدم محاولة الوصول غير المصرّح به للأنظمة أو البيانات.</li>
          <li>عدم استخدام المنصة بطريقة تضر بالمستخدمين الآخرين أو بالمنصة.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">5. التقارير والأكواد</h2>
        <p>كل تقرير يُنشأ يحمل كوداً فريداً، وأنت المسؤول عن حفظه. لا تتحمل المنصة مسؤولية مشاركتك للكود مع أطراف أخرى.</p>

        <h2 className="font-serif text-2xl text-primary">6. حدود المسؤولية</h2>
        <p>تُقدَّم الخدمة "كما هي". لا نضمن دقة أو ملاءمة النتائج لأي قرار شخصي أو مهني. القرارات النهائية تبقى مسؤوليتك.</p>

        <h2 className="font-serif text-2xl text-primary">7. التعديلات</h2>
        <p>يحق للمنصة تعديل هذه الشروط في أي وقت، ويسري التعديل فور نشره.</p>

        <h2 className="font-serif text-2xl text-primary">8. القانون المعمول به</h2>
        <p>تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص محاكمها بأي نزاع.</p>

        <h2 className="font-serif text-2xl text-primary">9. التواصل</h2>
        <p>لأي استفسار قانوني: <a className="text-primary underline" href="mailto:legal@busala.app">legal@busala.app</a></p>
      </section>
    </article>
  );
}
