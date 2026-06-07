import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام والسياسات — بوصلة" },
      {
        name: "description",
        content:
          "الشروط والأحكام، سياسة الخصوصية، سياسة الكوكيز، والميثاق الأخلاقي والقيمي لمنصة بوصلة في وثيقة واحدة شاملة.",
      },
      { property: "og:title", content: "الشروط والأحكام والسياسات — بوصلة" },
      { property: "og:description", content: "وثيقة شاملة لجميع السياسات القانونية والأخلاقية لمنصة بوصلة." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="container-page max-w-3xl py-16 leading-relaxed">
      <h1 className="font-serif text-4xl text-primary">الشروط والأحكام والسياسات</h1>
      <p className="mt-2 text-sm text-muted-foreground">آخر تحديث: مايو 2026</p>

      {/* فهرس */}
      <nav className="mt-6 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
        <h2 className="mb-2 font-serif text-base text-primary">فهرس الوثيقة</h2>
        <ul className="grid gap-1 md:grid-cols-2">
          <li><a href="#terms" className="text-primary hover:underline">الجزء الأول: الشروط والأحكام</a></li>
          <li><a href="#privacy" className="text-primary hover:underline">الجزء الثاني: سياسة الخصوصية</a></li>
          <li><a href="#cookies" className="text-primary hover:underline">الجزء الثالث: سياسة الكوكيز</a></li>
          <li><a href="#ethics" className="text-primary hover:underline">الجزء الرابع: الميثاق الأخلاقي والقيمي</a></li>
        </ul>
      </nav>

      {/* ============ الشروط والأحكام ============ */}
      <section id="terms" className="mt-12 scroll-mt-24 space-y-4 text-foreground/90">
        <h2 className="font-serif text-3xl text-primary">الجزء الأول: الشروط والأحكام</h2>

        <h3 className="font-serif text-xl text-primary">١. قبول الشروط</h3>
        <p>
          باستخدامك منصة <strong>بوصلة</strong> فإنك توافق على هذه الشروط والأحكام كاملة. إن لم توافق فلا تستخدم المنصة.
        </p>

        <h3 className="font-serif text-xl text-primary">٢. طبيعة الخدمة</h3>
        <p>
          تُقدّم بوصلة أدوات تقييم وإرشاد مهني وكوتشينج عبر الإنترنت. النتائج إرشاديّة استكشافية، ولا تُعدّ تشخيصاً نفسياً أو طبياً، ولا قراراً نهائياً.
        </p>

        <h3 className="font-serif text-xl text-primary">٣. شروط استخدام القاصرين</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>استخدام المنصة لمن هم دون ١٨ سنة يستلزم <strong>موافقة وليّ الأمر</strong> مُسجّلة داخل المنصة.</li>
          <li>لوليّ الأمر حق طلب نسخة من بيانات ابنه/ابنته أو حذفها كلّياً.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٤. الملكيّة الفكريّة</h3>
        <p>
          جميع محتويات المنصة — الأسماء، الشعار، التصاميم، الأسئلة، التقارير، الأكواد البرمجيّة، وأدلّة القطاعات — ملكيّة حصريّة لـ <strong>بوصلة</strong>، محميّة بحقوق النشر والعلامات التجاريّة. يُمنع النسخ أو إعادة الإنتاج أو الاستخدام التجاري دون إذن خطّي مسبق.
        </p>

        <h3 className="font-serif text-xl text-primary">٥. الاستخدام المسموح</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>الاستخدام الشخصي وغير التجاري.</li>
          <li>عدم محاولة الوصول غير المصرّح به للأنظمة أو البيانات.</li>
          <li>عدم استخدام المنصة بطريقة تُضرّ بالمستخدمين أو بالمنصة.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٦. التقارير والأكواد</h3>
        <p>كل تقرير يحمل كوداً فريداً، وأنت المسؤول عن حفظه ومشاركته بحذر.</p>

        <h3 className="font-serif text-xl text-primary">٧. القرارات الآلية ومراجعة البشر</h3>
        <p>
          تستخدم بوصلة الذكاء الاصطناعي لإعداد تقارير مساعِدة. لك في أي وقت <strong>طلب مراجعة بشريّة</strong> من مرشد معتمد قبل اعتماد أي توصية في قرار مصيري (تخصّص، وظيفة، تغيير مسار).
        </p>

        <h3 className="font-serif text-xl text-primary">٨. حدود المسؤوليّة</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>تُقدَّم الخدمة «كما هي» ودون ضمانات صريحة أو ضمنية بدقّة النتائج لأي قرار شخصي أو مهني.</li>
          <li>القرارات المصيريّة تبقى مسؤوليّتك بعد استشارة مختصّ مرخّص، ولا تتحمّل المنصة تبعات الاعتماد الكلّي على تقرير آلي دون مراجعة بشريّة.</li>
          <li>في كل الأحوال، تنحصر مسؤوليّة المنصة في قيمة الاشتراك المدفوع خلال آخر ١٢ شهراً.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٩. التعديلات</h3>
        <p>يحقّ للمنصة تعديل هذه الشروط، ويسري التعديل فور نشره مع إشعار المستخدمين عند التغييرات الجوهريّة.</p>

        <h3 className="font-serif text-xl text-primary">١٠. القانون المعمول به</h3>
        <p>
          تخضع هذه الشروط لأنظمة المملكة العربية السعوديّة، بما فيها نظام حماية البيانات الشخصيّة (PDPL)، وتختصّ محاكمها بأي نزاع.
        </p>

        <h3 className="font-serif text-xl text-primary">١١. التواصل القانوني</h3>
        <p>
          لأي استفسار قانوني:{" "}
          <a className="text-primary underline" href="mailto:legal@bosla.app">legal@bosla.app</a>
        </p>
      </section>

      {/* ============ سياسة الخصوصية ============ */}
      <section id="privacy" className="mt-16 scroll-mt-24 space-y-4 border-t border-border pt-10 text-foreground/90">
        <h2 className="font-serif text-3xl text-primary">الجزء الثاني: سياسة الخصوصية</h2>
        <p className="text-sm text-muted-foreground">
          مُتوافقة مع نظام حماية البيانات الشخصية السعودي (PDPL) واللائحة الأوروبية لحماية البيانات (GDPR).
        </p>

        <h3 className="font-serif text-xl text-primary">١. هويّتنا ومسؤول حماية البيانات</h3>
        <p>
          مُشغّل المنصة: <strong>بوصلة (Bosla)</strong>. مسؤول حماية البيانات (DPO):{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">dpo@bosla.app</a>.
        </p>

        <h3 className="font-serif text-xl text-primary">٢. البيانات التي نجمعها</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>بيانات تعريفية اختيارية: الاسم، المرحلة الدراسية، العمر، الدولة.</li>
          <li>إجاباتك على التقييمات لإصدار تقريرك (تُعالَج لأغراض الإرشاد فقط).</li>
          <li>
            بيانات حسّاسة — اختياريّة: نتائج فحوصات نفسية مختصرة (PHQ-2، GAD-2). تُخزَّن فقط إذا منحتَ <strong>موافقة صريحة منفصلة</strong> داخل الأداة، ولك حذفها في أي وقت.
          </li>
          <li>بيانات تواصل عند حجز جلسة (الاسم، البريد، رقم الهاتف).</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٣. الأساس النظامي للمعالجة</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>موافقتك الصريحة على إنشاء الحساب وإجراء التقييم.</li>
          <li>تنفيذ العقد بينك وبين المنصة لتقديم الخدمة.</li>
          <li>مصلحة مشروعة في تحسين جودة الخدمة بصورة مُجمَّعة ومجهولة الهوية.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٤. بيانات القاصرين (دون ١٨ سنة)</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>استخدام المنصة لمن هم دون ١٨ سنة يستلزم <strong>موافقة وليّ الأمر</strong> داخل النموذج، وإقرار الطالب بذلك.</li>
          <li>لوليّ الأمر حق الاطلاع على بيانات ابنه/ابنته وطلب حذفها كلياً.</li>
          <li>لا نُفعّل أي تتبّع تسويقي على حسابات القاصرين.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٥. حقوقك (PDPL / GDPR)</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>الوصول إلى بياناتك والحصول على نسخة منها.</li>
          <li><strong>نقل البيانات (Portability)</strong>: طلب تصديرها بصيغة مقروءة آلياً (JSON / CSV).</li>
          <li>التصحيح أو تقييد المعالجة.</li>
          <li>
            <strong>حق النسيان (Right to be Forgotten)</strong>: لك أن تطلب <strong>حذف حسابك وكل بياناتك وتقاريرك نهائياً</strong> من قواعد بياناتنا وأي نُسخ احتياطية خلال مدّة أقصاها <strong>٣٠ يوماً</strong>، عدا ما يلزمنا الاحتفاظ به نظاماً.
          </li>
          <li>سحب الموافقة في أي وقت دون أثر رجعي.</li>
          <li><strong>حق رفض القرار الآلي</strong>: مراجعة بشريّة إلزامية لأي تقرير قبل اتخاذ قرار مصيري بناءً عليه.</li>
          <li>رفع شكوى للهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA) أو الجهة المختصّة في بلدك.</li>
        </ul>
        <p>
          لممارسة أيٍّ من هذه الحقوق راسِلنا على{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">dpo@bosla.app</a>.
        </p>

        <h3 className="font-serif text-xl text-primary">٦. كيف نستخدم البيانات</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>إصدار تقرير الإرشاد المهني واسترجاعه بكود فريد.</li>
          <li>تنسيق الجلسات مع المرشد أو المدرب المهني (الكوتش) المهني الذي تختاره.</li>
          <li>تحسين جودة الخدمة بشكل مُجمَّع ومجهول الهوية.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٧. حماية البيانات</h3>
        <p>بنية تحتية سحابية آمنة، تشفير أثناء النقل (HTTPS/TLS)، وسياسات وصول صارمة على مستوى قاعدة البيانات (Row-Level Security).</p>

        <h3 className="font-serif text-xl text-primary">٨. مزوّدو الخدمة (Sub-Processors)</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li><strong>Lovable Cloud</strong>: استضافة قاعدة البيانات وخدمات المصادقة (وفق اتفاقية معالجة بيانات DPA).</li>
          <li><strong>مزوّد نماذج الذكاء الاصطناعي</strong>: لتوليد التقارير، بدون تمرير اسمك الكامل أو بريدك.</li>
        </ul>
        <p>لا نبيع ولا نُؤجّر بياناتك لأي طرف ثالث لأغراض تسويقية.</p>

        <h3 className="font-serif text-xl text-primary">٩. مدّة الاحتفاظ</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>تقارير التقييم: حتى تطلب حذفها أو حتى ٣٦ شهراً من آخر نشاط.</li>
          <li>نتائج الفحوصات النفسية: حتى ١٢ شهراً ثم تُحذف تلقائياً ما لم تُجدِّد الموافقة.</li>
          <li>بيانات الحجز والفواتير: وفق المدد النظامية المحاسبية.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">١٠. التواصل</h3>
        <p>
          لطلبات الخصوصية:{" "}
          <a className="text-primary underline" href="mailto:privacy@bosla.app">privacy@bosla.app</a>
          {" "}— لمسؤول حماية البيانات:{" "}
          <a className="text-primary underline" href="mailto:dpo@bosla.app">dpo@bosla.app</a>.
        </p>
      </section>

      {/* ============ سياسة الكوكيز ============ */}
      <section id="cookies" className="mt-16 scroll-mt-24 space-y-4 border-t border-border pt-10 text-foreground/90">
        <h2 className="font-serif text-3xl text-primary">الجزء الثالث: سياسة ملفات تعريف الارتباط (Cookies)</h2>
        <p>
          نستخدم في منصة <strong>بوصلة</strong> أدنى قدر من ملفات تعريف الارتباط اللازمة لتشغيل الخدمة، وفقاً لـ PDPL وGDPR.
        </p>

        <h3 className="font-serif text-xl text-primary">١. ما الكوكيز التي نستخدمها؟</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-border text-sm">
            <thead className="bg-secondary/60 text-right">
              <tr>
                <th className="border border-border p-2">النوع</th>
                <th className="border border-border p-2">الغرض</th>
                <th className="border border-border p-2">الموافقة</th>
              </tr>
            </thead>
            <tbody className="text-right">
              <tr>
                <td className="border border-border p-2">ضرورية (Essential)</td>
                <td className="border border-border p-2">جلسة الدخول، حالة المصادقة، تفضيلات الواجهة (RTL/الوضع الداكن)، حفظ خيار الموافقة على هذا التنبيه.</td>
                <td className="border border-border p-2">لا تتطلب موافقة</td>
              </tr>
              <tr>
                <td className="border border-border p-2">وظيفية</td>
                <td className="border border-border p-2">حفظ تقدّم الإجابة في التقييم محلياً حتى لا تفقد إجاباتك.</td>
                <td className="border border-border p-2">ضمنية بالاستخدام</td>
              </tr>
              <tr>
                <td className="border border-border p-2">تحليلات / تسويق</td>
                <td className="border border-border p-2">لا نُفعّلها حالياً. عند تفعيلها مستقبلاً سيظهر لك خيار صريح للقبول أو الرفض.</td>
                <td className="border border-border p-2">صريحة (Opt-in)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-serif text-xl text-primary">٢. كيف تتحكّم بها؟</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>من إعدادات متصفّحك يمكنك حذفها أو منعها.</li>
          <li>منع الكوكيز الضرورية قد يعطّل تسجيل الدخول وحفظ التقارير.</li>
          <li>لإعادة عرض تنبيه الموافقة: امسح بيانات الموقع من المتصفّح.</li>
        </ul>
      </section>

      {/* ============ الميثاق الأخلاقي والقيمي ============ */}
      <section id="ethics" className="mt-16 scroll-mt-24 space-y-4 border-t border-border pt-10 text-foreground/90">
        <h2 className="font-serif text-3xl text-primary">الجزء الرابع: الميثاق الأخلاقي والقيمي</h2>
        <p>
          نؤمن في <strong>بوصلة</strong> أن الإرشاد المهني أمانة، وأن توجيه الإنسان نحو مساره الصحيح من أعظم صور النصيحة. لذلك نلتزم بمرجعية قيمية واضحة تجمع بين العلم الحديث والثوابت الأخلاقية.
        </p>

        <h3 className="font-serif text-xl text-primary">١. مرجعية الشريعة الإسلامية</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>لا نُرشّح المستخدم للعمل في مجالات محرّمة شرعاً (الربا، الخمور، القمار، التأمين التجاري الإشكالي، إنتاج المحرّمات).</li>
          <li>عند ظهور ميل للمستخدم نحو هذه المجالات، نقترح <strong>البديل الحلال المكافئ</strong> ضمن نفس مجال الاهتمام.</li>
          <li>نُذكّر بأن الأخذ بالأسباب لا يُغني عن التوكل على الله والاستخارة قبل القرارات المصيرية.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٢. الحياد العقدي في أدوات الكوتشينج</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>نعتمد الأدوات السلوكية والمعرفية المحايدة علمياً (CBT، GROW، ICF).</li>
          <li>نتجنّب المحتوى المرتبط بمدارس فيها إشكال عقدي (تأليه الذات، قانون الجذب، التأمل التجاوزي ذو الخلفية الفلسفية المخالفة).</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٣. صدق التقييمات وعدم القطعية</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>نتائج التقييمات <strong>اجتهادية وظنية</strong>، تُعين على التفكير ولا تُلزم بقرار.</li>
          <li>نوضّح مراجع كل أداة (Holland, MBTI-like, PHQ-2, GAD-2) ومحدوديتها.</li>
          <li>لا نقدّم تشخيصاً طبياً أو نفسياً؛ نُحيل للمختص عند الحاجة.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٤. ضوابط الذكاء الاصطناعي والمراجعة البشرية</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>الذكاء الاصطناعي عندنا <strong>أداة معاونة</strong>، لا تُفتي ولا تُشخّص.</li>
          <li>نمنع النموذج من إصدار فتاوى شرعيّة أو تشخيصات طبيّة أو نفسيّة.</li>
          <li><strong>المراجعة البشرية إلزامية</strong> قبل أي قرار مصيري؛ كل تقرير يحمل زر «اطلب مراجعة مرشد بشري».</li>
          <li>نُوجّه النموذج لاحترام الثوابت القيميّة، ونحتفظ بسجلّ المطالبات (Prompts) للمراجعة.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٥. أمانة المعلومات وحق النسيان</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>بياناتك أمانة؛ لا تُباع ولا تُؤجَّر، ولا تُشارك للتسويق.</li>
          <li>نطبّق سياسات وصول صارمة (RLS) وتشفير أثناء النقل.</li>
          <li>لك حق طلب حذف حسابك وبياناتك نهائياً خلال ٣٠ يوماً عبر <a className="text-primary underline" href="mailto:dpo@bosla.app">dpo@bosla.app</a>.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٦. النصح الصادق</h3>
        <p>
          إن لم يكن المستخدم بحاجة فعلية لجلسة كوتشينج مدفوعة، نوجّهه لمصادر مجانية. وإن ظهرت مؤشرات لاضطراب نفسي، نُحيله لمعالج مرخّص قبل أي خطوة مهنية.
        </p>

        <h3 className="font-serif text-xl text-primary">٧. ضوابط الجلسات وعدم الاختلاط</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>الجلسات الفردية بين المُرشِد والمُسترشِد من <strong>نفس الجنس افتراضياً</strong>.</li>
          <li>عند الحاجة لمرشد من الجنس الآخر، تُسجَّل الجلسة وتكون عبر منصة احترافية مفتوحة، مع التزام كامل بالحشمة.</li>
          <li>الجلسات الجماعية تُراعى فيها الفصل البصري عند الإمكان.</li>
          <li>تُمنع المحادثات الخاصة خارج المنصّة بين الجنسين إلا لضرورة موثّقة.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٨. الضوابط المالية وبوابات الدفع</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            بوابات دفع <strong>متوافقة مع الضوابط الشرعية</strong>: مدى / Apple Pay / STC Pay، التحويل البنكي عبر بنوك إسلامية، تابي/تمارا بدفعة واحدة فقط.
          </li>
          <li>سياسة استرداد عادلة وشفافية كاملة في الأسعار، رفعاً للغرر.</li>
          <li>لا اشتراكات تلقائية متجدّدة دون إعلام وسهولة إلغاء قبل التجديد بـ ٧ أيام.</li>
          <li>تنبيه بعدم استخدام بطاقات ائتمانية تترتّب عليها فوائد ربوية.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">٩. اللجنة الشرعية والمراجعة</h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>للمنصّة <strong>مستشار شرعي</strong> يُراجع تصنيف المهن، صياغة التقارير، العقود، وبوابات الدفع.</li>
          <li>تُعرض القرارات الإشكاليّة على هيئة شرعيّة استشاريّة خارجيّة عند الحاجة.</li>
          <li>ملاحظات شرعيّة:{" "}<a className="text-primary underline" href="mailto:shariah@bosla.app">shariah@bosla.app</a>.</li>
        </ul>

        <h3 className="font-serif text-xl text-primary">١٠. التطوير المستمر للميثاق</h3>
        <p>
          نُحدّث هذا الميثاق كلما اتسعت خدمات المنصة، ونرحّب بالملاحظات على:{" "}
          <a className="text-primary underline" href="mailto:ethics@bosla.app">ethics@bosla.app</a>
        </p>

        <p className="mt-8 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
          <strong>تذكير:</strong> «وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ» — التوبة. عملك أمانة، واختيار مسارك عبادة إذا أحسنتَ النية.
        </p>
      </section>
    </article>
  );
}
