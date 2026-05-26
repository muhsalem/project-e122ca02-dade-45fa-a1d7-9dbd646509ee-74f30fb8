import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — بوصلة" },
      {
        name: "description",
        content:
          "كيف نجمع ونحمي بياناتك في منصة بوصلة وفق نظام حماية البيانات الشخصية السعودي (PDPL) واللائحة الأوروبية (GDPR).",
      },
      { property: "og:title", content: "سياسة الخصوصية — بوصلة" },
      { property: "og:description", content: "سياسة حماية البيانات وفق PDPL وGDPR." },
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
      <p className="mt-2 text-sm text-muted-foreground">
        آخر تحديث: {new Date().toLocaleDateString("ar-EG")} — مُتوافقة مع نظام
        حماية البيانات الشخصية السعودي (PDPL) واللائحة الأوروبية لحماية البيانات
        (GDPR).
      </p>

      <section className="mt-8 space-y-4 text-foreground/90">
        <h2 className="font-serif text-2xl text-primary">١. هويّتنا ومسؤول حماية البيانات</h2>
        <p>
          مُشغّل المنصة: <strong>بوصلة (Bosla)</strong>. مسؤول حماية البيانات
          (DPO) للتواصل في كل ما يخصّ بياناتك:{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">
            dpo@bosla.app
          </a>
          .
        </p>

        <h2 className="font-serif text-2xl text-primary">٢. البيانات التي نجمعها</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>بيانات تعريفية اختيارية: الاسم، المرحلة الدراسية، العمر، الدولة.</li>
          <li>إجاباتك على التقييمات لإصدار تقريرك (تُعالَج لأغراض الإرشاد فقط).</li>
          <li>
            بيانات حسّاسة — اختياريّة: نتائج فحوصات نفسية مختصرة (PHQ-2، GAD-2).
            تُخزَّن فقط إذا منحتَ <strong>موافقة صريحة منفصلة</strong> داخل
            الأداة، ولك حذفها في أي وقت.
          </li>
          <li>بيانات تواصل عند حجز جلسة (الاسم، البريد، رقم الهاتف).</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٣. الأساس النظامي للمعالجة</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>موافقتك الصريحة على إنشاء الحساب وإجراء التقييم.</li>
          <li>تنفيذ العقد بينك وبين المنصة لتقديم الخدمة.</li>
          <li>مصلحة مشروعة في تحسين جودة الخدمة بصورة مُجمَّعة ومجهولة الهوية.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٤. بيانات القاصرين (دون ١٨ سنة)</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            استخدام المنصة لمن هم دون ١٨ سنة يستلزم <strong>موافقة وليّ الأمر</strong>
            داخل النموذج، وإقرار الطالب بذلك.
          </li>
          <li>لوليّ الأمر حق الاطلاع على بيانات ابنه/ابنته وطلب حذفها كلياً.</li>
          <li>لا نُفعّل أي تتبّع تسويقي على حسابات القاصرين.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٥. حقوقك (PDPL / GDPR)</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>الوصول إلى بياناتك والحصول على نسخة منها.</li>
          <li>
            <strong>نقل البيانات (Portability)</strong>: طلب تصديرها بصيغة
            مقروءة آلياً (JSON / CSV).
          </li>
          <li>التصحيح أو تقييد المعالجة.</li>
          <li>
            <strong>حق النسيان (Right to be Forgotten)</strong>: لك أن تطلب
            <strong> حذف حسابك وكل بياناتك وتقاريرك نهائياً</strong> من قواعد بياناتنا
            وأي نُسخ احتياطية خلال مدّة أقصاها <strong>٣٠ يوماً</strong> من تاريخ
            الطلب، عدا ما يلزمنا الاحتفاظ به نظاماً (كالفواتير المحاسبية). يصلك
            تأكيد كتابي عند الإتمام.
          </li>
          <li>سحب الموافقة في أي وقت دون أثر رجعي.</li>
          <li>
            <strong>حق رفض القرار الآلي</strong>: لك أن تطلب مراجعة بشريّة
            إلزامية لأي تقرير أصدره الذكاء الاصطناعي قبل اتخاذ قرار مصيري بناءً
            عليه.
          </li>
          <li>
            رفع شكوى للهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA) أو الجهة
            المختصّة في بلدك.
          </li>
        </ul>
        <p>
          لممارسة أيٍّ من هذه الحقوق راسِلنا على{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">
            dpo@bosla.app
          </a>
          .
        </p>

        <h2 className="font-serif text-2xl text-primary">٦. كيف نستخدم البيانات</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>إصدار تقرير الإرشاد المهني واسترجاعه بكود فريد.</li>
          <li>تنسيق الجلسات مع المرشد أو الكوتش المهني الذي تختاره.</li>
          <li>تحسين جودة الخدمة بشكل مُجمَّع ومجهول الهوية.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٧. حماية البيانات</h2>
        <p>
          بنية تحتية سحابية آمنة، تشفير أثناء النقل (HTTPS/TLS)، وسياسات وصول
          صارمة على مستوى قاعدة البيانات (Row-Level Security).
        </p>

        <h2 className="font-serif text-2xl text-primary">٨. مزوّدو الخدمة (Sub-Processors)</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <strong>Lovable Cloud / Supabase</strong>: استضافة قاعدة البيانات
            وخدمات المصادقة (وفق اتفاقية معالجة بيانات DPA).
          </li>
          <li>
            <strong>مزوّد نماذج الذكاء الاصطناعي</strong>: لتوليد التقارير، بدون
            تمرير اسمك الكامل أو بريدك.
          </li>
        </ul>
        <p>لا نبيع ولا نُؤجّر بياناتك لأي طرف ثالث لأغراض تسويقية.</p>

        <h2 className="font-serif text-2xl text-primary">٩. مدّة الاحتفاظ</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>تقارير التقييم: حتى تطلب حذفها أو حتى ٣٦ شهراً من آخر نشاط.</li>
          <li>نتائج الفحوصات النفسية: حتى ١٢ شهراً ثم تُحذف تلقائياً ما لم تُجدِّد الموافقة.</li>
          <li>بيانات الحجز والفواتير: وفق المدد النظامية المحاسبية.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">١٠. ملفات تعريف الارتباط</h2>
        <p>
          نستخدم الكوكيز الضرورية فقط لتشغيل المنصة. التفاصيل في{" "}
          <a className="text-primary underline" href="/cookies">سياسة الكوكيز</a>.
        </p>

        <h2 className="font-serif text-2xl text-primary">١١. التواصل</h2>
        <p>
          لطلبات الخصوصية:{" "}
          <a className="text-primary underline" href="mailto:privacy@bosla.app">
            privacy@bosla.app
          </a>{" "}
          — لمسؤول حماية البيانات:{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">
            dpo@bosla.app
          </a>
          .
        </p>
      </section>
    </article>
  );
}
