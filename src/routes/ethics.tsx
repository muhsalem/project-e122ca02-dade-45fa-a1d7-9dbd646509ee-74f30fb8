import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "الالتزام الأخلاقي والقيمي — بوصلة" },
      { name: "description", content: "مرجعية بوصلة الأخلاقية والقيمية: ضوابط شرعية ومهنية تحكم التقييمات والإرشاد والذكاء الاصطناعي." },
      { property: "og:title", content: "الالتزام الأخلاقي والقيمي — بوصلة" },
      { property: "og:description", content: "ميثاق بوصلة الأخلاقي والشرعي والمهني." },
      { property: "og:url", content: "/ethics" },
    ],
    links: [{ rel: "canonical", href: "/ethics" }],
  }),
  component: EthicsPage,
});

function EthicsPage() {
  return (
    <article className="container-page max-w-3xl py-16 leading-relaxed">
      <h1 className="font-serif text-4xl text-primary">ميثاق الالتزام الأخلاقي والقيمي</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        مرجعيتنا في تصميم التقييمات والتقارير والإرشاد المهني.
      </p>

      <section className="mt-8 space-y-5 text-foreground/90">
        <p>
          نؤمن في <strong>بوصلة</strong> أن الإرشاد المهني أمانة، وأن توجيه الإنسان نحو
          مساره الصحيح من أعظم صور النصيحة. لذلك نلتزم بمرجعية قيمية واضحة تجمع بين
          العلم الحديث والثوابت الأخلاقية.
        </p>

        <h2 className="font-serif text-2xl text-primary">١. مرجعية الشريعة الإسلامية</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>لا نُرشّح المستخدم للعمل في مجالات محرّمة شرعاً (الربا، الخمور، القمار، التأمين التجاري الإشكالي، إنتاج المحرّمات).</li>
          <li>عند ظهور ميل للمستخدم نحو هذه المجالات، نقترح <strong>البديل الحلال المكافئ</strong> ضمن نفس مجال الاهتمام.</li>
          <li>نُذكّر بأن الأخذ بالأسباب لا يُغني عن التوكل على الله والاستخارة قبل القرارات المصيرية.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٢. الحياد العقدي في أدوات الكوتشينج</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>نعتمد الأدوات السلوكية والمعرفية المحايدة علمياً (CBT، GROW، ICF).</li>
          <li>نتجنّب المحتوى المرتبط بمدارس فيها إشكال عقدي (تأليه الذات، قانون الجذب، التأمل التجاوزي ذو الخلفية الفلسفية المخالفة).</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٣. صدق التقييمات وعدم القطعية</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>نتائج التقييمات <strong>اجتهادية وظنية</strong>، تُعين على التفكير ولا تُلزم بقرار.</li>
          <li>نوضّح مراجع كل أداة (Holland, MBTI-like, PHQ-2, GAD-2) ومحدوديتها.</li>
          <li>لا نقدّم تشخيصاً طبياً أو نفسياً؛ نُحيل للمختص عند الحاجة.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٤. ضوابط الذكاء الاصطناعي</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>الذكاء الاصطناعي عندنا <strong>أداة معاونة</strong>، لا تُفتي ولا تُشخّص.</li>
          <li>نمنع النموذج من إصدار فتاوى شرعيّة أو تشخيصات طبيّة أو نفسيّة.</li>
          <li>نُوجّه النموذج لاحترام الثوابت القيميّة في كل تقرير يُولّده.</li>
          <li>لك الحق في طلب <strong>مراجعة بشريّة</strong> لأي تقرير قبل اتخاذ قرار مصيري.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٥. أمانة المعلومات</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>بياناتك أمانة؛ لا تُباع ولا تُؤجَّر، ولا تُشارك للتسويق.</li>
          <li>نطبّق سياسات وصول صارمة على مستوى قاعدة البيانات (RLS) وتشفير أثناء النقل.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٦. النصح الصادق</h2>
        <p>
          إن لم يكن المستخدم بحاجة فعلية لجلسة كوتشينج مدفوعة، نوجّهه لمصادر مجانية. وإن
          ظهرت لدينا مؤشرات لاضطراب نفسي، نُحيله لمعالج مرخّص قبل أي خطوة مهنية.
        </p>

        <h2 className="font-serif text-2xl text-primary">٧. الالتزام المالي المستقبلي</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>عند تفعيل المدفوعات، نسعى لاختيار بوابات دفع متوافقة مع الضوابط الشرعية.</li>
          <li>سياسة استرداد عادلة وشفافية كاملة في الأسعار، رفعاً للغرر.</li>
          <li>لا اشتراكات تلقائية متجدّدة دون إعلام واضح وسهولة إلغاء.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٨. التطوير المستمر للميثاق</h2>
        <p>
          نُحدّث هذا الميثاق كلما اتسعت خدمات المنصة، ونرحّب بالملاحظات على:{" "}
          <a className="text-primary underline" href="mailto:ethics@bosla.app">ethics@bosla.app</a>
        </p>

        <p className="mt-8 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
          <strong>تذكير:</strong> «وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ
          وَالْمُؤْمِنُونَ» — التوبة. عملك أمانة، واختيار مسارك عبادة إذا أحسنتَ النية.
        </p>
      </section>
    </article>
  );
}
