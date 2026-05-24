import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — بوصلة" },
      { name: "description", content: "كيف نجمع ونحمي بياناتك في منصة بوصلة للإرشاد المهني." },
      { property: "og:title", content: "سياسة الخصوصية — بوصلة" },
      { property: "og:description", content: "سياسة جمع وحماية البيانات في منصة بوصلة." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="container-page max-w-3xl py-16 leading-relaxed">
      <h1 className="font-serif text-4xl text-primary">سياسة الخصوصية</h1>
      <p className="mt-2 text-sm text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString("ar-EG")}</p>

      <section className="mt-8 space-y-4 text-foreground/90">
        <h2 className="font-serif text-2xl text-primary">1. البيانات التي نجمعها</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>بيانات تعريفية اختيارية: الاسم، المرحلة الدراسية، العمر.</li>
          <li>إجاباتك على التقييمات لإصدار تقريرك.</li>
          <li>بيانات تواصل عند حجز جلسة (الاسم، البريد، رقم الهاتف).</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">2. كيف نستخدم البيانات</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>إصدار تقرير الإرشاد المهني الشامل.</li>
          <li>تمكينك من استرجاع تقريرك بكود فريد.</li>
          <li>تنسيق الجلسات مع المرشد أو الكوتش المهني.</li>
          <li>تحسين جودة الخدمة بشكل مجمَّع ومجهول.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">3. حماية البيانات</h2>
        <p>نستخدم بنية تحتية سحابية آمنة مع تشفير أثناء النقل، وسياسات وصول صارمة على مستوى قاعدة البيانات (Row-Level Security).</p>

        <h2 className="font-serif text-2xl text-primary">4. المشاركة مع أطراف ثالثة</h2>
        <p>لا نبيع ولا نؤجر بياناتك. قد نشارك الحد الأدنى الضروري مع المرشد المختار من قِبَلك فقط.</p>

        <h2 className="font-serif text-2xl text-primary">5. ملفات تعريف الارتباط (Cookies)</h2>
        <p>نستخدمها لتشغيل المنصة وتحسين تجربتك، ولا تحتوي على معلومات حساسة.</p>

        <h2 className="font-serif text-2xl text-primary">6. حقوقك</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>الاطلاع على بياناتك أو طلب حذفها.</li>
          <li>سحب الموافقة في أي وقت.</li>
          <li>تقديم شكوى عبر البريد الرسمي.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">7. التواصل</h2>
        <p>لطلبات الخصوصية: <a className="text-primary underline" href="mailto:privacy@busala.app">privacy@busala.app</a></p>
      </section>
    </article>
  );
}
