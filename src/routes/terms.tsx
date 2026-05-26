import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام — بوصلة" },
      {
        name: "description",
        content:
          "الشروط والأحكام الخاصة باستخدام منصة بوصلة للإرشاد المهني والكوتشينج.",
      },
      { property: "og:title", content: "الشروط والأحكام — بوصلة" },
      { property: "og:description", content: "الشروط والأحكام الخاصة بمنصة بوصلة." },
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
      <p className="mt-2 text-sm text-muted-foreground">
        آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
      </p>

      <section className="mt-8 space-y-4 text-foreground/90">
        <h2 className="font-serif text-2xl text-primary">١. قبول الشروط</h2>
        <p>
          باستخدامك منصة <strong>بوصلة</strong> فإنك توافق على هذه الشروط
          والأحكام كاملة. إن لم توافق فلا تستخدم المنصة.
        </p>

        <h2 className="font-serif text-2xl text-primary">٢. طبيعة الخدمة</h2>
        <p>
          تُقدّم بوصلة أدوات تقييم وإرشاد مهني وكوتشينج عبر الإنترنت. النتائج
          إرشاديّة استكشافية، ولا تُعدّ تشخيصاً نفسياً أو طبياً، ولا قراراً
          نهائياً.
        </p>

        <h2 className="font-serif text-2xl text-primary">٣. شروط استخدام القاصرين</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            استخدام المنصة لمن هم دون ١٨ سنة يستلزم <strong>موافقة وليّ الأمر</strong>
            مُسجّلة داخل المنصة.
          </li>
          <li>لوليّ الأمر حق طلب نسخة من بيانات ابنه/ابنته أو حذفها كلّياً.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٤. الملكيّة الفكريّة</h2>
        <p>
          جميع محتويات المنصة — الأسماء، الشعار، التصاميم، الأسئلة، التقارير،
          الأكواد البرمجيّة، وأدلّة القطاعات — ملكيّة حصريّة لـ <strong>بوصلة</strong>،
          محميّة بحقوق النشر والعلامات التجاريّة. يُمنع النسخ أو إعادة الإنتاج أو
          الاستخدام التجاري دون إذن خطّي مسبق.
        </p>

        <h2 className="font-serif text-2xl text-primary">٥. الاستخدام المسموح</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>الاستخدام الشخصي وغير التجاري.</li>
          <li>عدم محاولة الوصول غير المصرّح به للأنظمة أو البيانات.</li>
          <li>عدم استخدام المنصة بطريقة تُضرّ بالمستخدمين أو بالمنصة.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٦. التقارير والأكواد</h2>
        <p>
          كل تقرير يحمل كوداً فريداً، وأنت المسؤول عن حفظه ومشاركته بحذر.
        </p>

        <h2 className="font-serif text-2xl text-primary">٧. القرارات الآلية ومراجعة البشر</h2>
        <p>
          تستخدم بوصلة الذكاء الاصطناعي لإعداد تقارير مساعِدة. لك في أي وقت
          <strong> طلب مراجعة بشريّة</strong> من مرشد معتمد قبل اعتماد أي توصية
          في قرار مصيري (تخصّص، وظيفة، تغيير مسار).
        </p>

        <h2 className="font-serif text-2xl text-primary">٨. حدود المسؤوليّة</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            تُقدَّم الخدمة «كما هي» ودون ضمانات صريحة أو ضمنية بدقّة النتائج لأي
            قرار شخصي أو مهني.
          </li>
          <li>
            القرارات المصيريّة تبقى مسؤوليّتك بعد استشارة مختصّ مرخّص، ولا
            تتحمّل المنصة تبعات الاعتماد الكلّي على تقرير آلي دون مراجعة بشريّة.
          </li>
          <li>
            في كل الأحوال، تنحصر مسؤوليّة المنصة في قيمة الاشتراك المدفوع خلال
            آخر ١٢ شهراً.
          </li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٩. التعديلات</h2>
        <p>
          يحقّ للمنصة تعديل هذه الشروط، ويسري التعديل فور نشره مع إشعار
          المستخدمين عند التغييرات الجوهريّة.
        </p>

        <h2 className="font-serif text-2xl text-primary">١٠. القانون المعمول به</h2>
        <p>
          تخضع هذه الشروط لأنظمة المملكة العربية السعوديّة، بما فيها نظام حماية
          البيانات الشخصيّة (PDPL)، وتختصّ محاكمها بأي نزاع.
        </p>

        <h2 className="font-serif text-2xl text-primary">١١. التواصل</h2>
        <p>
          لأي استفسار قانوني:{" "}
          <a className="text-primary underline" href="mailto:legal@bosla.app">
            legal@bosla.app
          </a>
        </p>
      </section>
    </article>
  );
}
