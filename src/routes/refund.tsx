import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Clock, Mail } from "lucide-react";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
  head: () => ({
    meta: [
      { title: "سياسة الاسترداد — بوصلة" },
      {
        name: "description",
        content:
          "سياسة استرداد المدفوعات في منصّة بوصلة: شروط الاسترداد للخدمات المدفوعة، المدة الزمنية، واستثناء الخدمات الرقمية فور استهلاكها.",
      },
      { property: "og:title", content: "سياسة الاسترداد — بوصلة" },
      {
        property: "og:description",
        content:
          "شروط ومدة استرداد المدفوعات في بوصلة، مع توضيح الحالات المستثناة كالخدمات الرقمية بعد استهلاكها.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/refund" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
});

function RefundPage() {
  return (
    <article
      className="container-page prose prose-slate mx-auto max-w-3xl py-16 text-right"
      dir="rtl"
    >
      <div className="not-prose mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-gold">
          سياسة رسمية
        </p>
        <h1 className="mt-1 font-serif text-3xl text-primary md:text-4xl">
          سياسة الاسترداد (Refund Policy)
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          آخر تحديث: 13 يوليو 2026 • الإصدار 1.0
        </p>
      </div>

      <aside className="not-prose my-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-foreground/85">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="m-0">
            <strong>ملخّص سريع:</strong> يمكنك طلب استرداد كامل خلال{" "}
            <strong>14 يوماً</strong> من الشراء ما لم تكن قد بدأت استهلاك
            الخدمة الرقمية (كإجراء الاختبار أو توليد التقرير). بعد الاستهلاك،
            تصبح الخدمة الرقمية <strong>غير قابلة للاسترداد</strong>.
          </p>
        </div>
      </aside>

      <h2>1. نطاق هذه السياسة</h2>
      <p>
        تُطبَّق هذه السياسة على جميع المدفوعات التي تُجرى عبر منصّة بوصلة
        (bosla.app)، سواء للأفراد أو أولياء الأمور أو المؤسسات التعليمية،
        وتشمل: الاختبارات النفسية والمهنية، التقارير التفصيلية، جلسات
        الكوتشينج والإرشاد، الاشتراكات المؤسسية، وباقات الحسابات المدرسية.
      </p>

      <h2>2. مبدأ الاسترداد العام</h2>
      <p>
        نلتزم بأنظمة حماية المستهلك في المملكة العربية السعودية
        (نظام التجارة الإلكترونية) وبأفضل الممارسات الدولية. يحقّ للعميل طلب
        استرداد كامل خلال <strong>14 يوماً</strong> من تاريخ عملية الدفع،
        شريطة ألّا يكون قد استهلك الخدمة أو استهلك جزءاً جوهرياً منها.
      </p>

      <h2>3. الحالات المؤهَّلة للاسترداد الكامل</h2>
      <ul>
        <li>خطأ تقني منع الوصول للخدمة المدفوعة ولم يُحلّ خلال 72 ساعة.</li>
        <li>ازدواج في عملية الدفع أو خصم مبلغ خاطئ.</li>
        <li>
          جلسة كوتشينج أو استشارة <strong>لم تبدأ بعد</strong> ويُطلَب
          إلغاؤها قبل موعدها بـ<strong>24 ساعة على الأقل</strong>.
        </li>
        <li>
          اشتراك مؤسسي لم يُفعَّل ولم يُنشَأ فيه أيّ حساب مستخدم فعلي خلال
          14 يوماً من الشراء.
        </li>
        <li>
          اختبار أو تقرير رقمي <strong>لم يبدأ استهلاكه</strong> (لم تُبدأ
          الأسئلة ولم يُولَّد التقرير).
        </li>
      </ul>

      <h2>4. الاستثناءات — خدمات غير قابلة للاسترداد</h2>
      <div className="not-prose my-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 leading-8">
        <div className="mb-2 flex items-center gap-2 font-semibold text-destructive">
          <ShieldCheck className="h-5 w-5" />
          الخدمات الرقمية بعد الاستهلاك
        </div>
        <p className="m-0 text-sm text-foreground/85">
          طبقاً للمادة (٤٣) من اللائحة التنفيذية لنظام التجارة الإلكترونية
          السعودي وممارسات الاتحاد الأوروبي (Consumer Rights Directive
          2011/83/EU – Art. 16(m))، يسقط حق الاسترداد للمحتوى الرقمي فور
          البدء بتقديمه بموافقة العميل الصريحة.
        </p>
      </div>
      <p>لا يُسترَد المبلغ في الحالات التالية:</p>
      <ul>
        <li>
          <strong>الاختبارات النفسية والمهنية</strong> التي تمّ البدء
          بالإجابة عليها ولو جزئياً.
        </li>
        <li>
          <strong>التقارير الرقمية</strong> (Career Twin، POIA، Learning DNA،
          التقرير المُرافِق لولي الأمر، …) بعد <strong>توليدها</strong> أو
          تنزيلها أو مشاركتها عبر رابط.
        </li>
        <li>
          <strong>جلسات الكوتشينج/الإرشاد</strong> التي حضرها العميل أو تغيّب
          عنها دون إشعار مسبق ≥ 24 ساعة.
        </li>
        <li>
          الرسوم البنكية أو رسوم بوابات الدفع (Moyasar / Paymob / Tap)
          المخصومة على المعاملة، حيث يُسترَد صافي المبلغ فقط.
        </li>
        <li>
          الاشتراكات المؤسسية التي تجاوز الاستخدام الفعلي فيها 20% من الحصة
          المُتعاقد عليها.
        </li>
      </ul>

      <h2>5. الاسترداد الجزئي</h2>
      <p>
        في حال استهلاك جزء من باقة متعدّدة (مثل باقة 3 جلسات كوتشينج
        استُخدمت منها جلسة واحدة)، يُسترَد ثمن الجلسات غير المستهلكة فقط،
        مطروحاً منه رسوم المعالجة (5% كحد أقصى).
      </p>

      <h2>6. طريقة تقديم طلب الاسترداد</h2>
      <ol>
        <li>
          راسلنا على{" "}
          <a href="mailto:billing@bosla.app" className="text-primary">
            billing@bosla.app
          </a>{" "}
          من نفس البريد المُسجَّل في الحساب.
        </li>
        <li>
          أرفق: رقم العملية / تاريخ الشراء / اسم الخدمة / سبب طلب الاسترداد.
        </li>
        <li>
          سنردّ خلال <strong>3 أيام عمل</strong> بقرار مبدئي (موافقة / طلب
          توضيح / رفض مع تعليل).
        </li>
      </ol>

      <h2>7. مدة معالجة الاسترداد</h2>
      <div className="not-prose my-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          بعد الموافقة، يُعاد المبلغ إلى <strong>نفس وسيلة الدفع الأصلية</strong>{" "}
          خلال:
          <ul className="mt-2 mb-0 list-disc pr-5">
            <li>البطاقات (Visa/Mastercard/mada): 5–14 يوم عمل.</li>
            <li>Apple Pay / STC Pay: 3–7 أيام عمل.</li>
            <li>التحويل البنكي المؤسسي: 7–21 يوم عمل.</li>
          </ul>
        </div>
      </div>

      <h2>8. النزاعات (Chargebacks)</h2>
      <p>
        نُشجّع العملاء على التواصل معنا مباشرة قبل فتح نزاع لدى البنك، إذ
        يُتيح ذلك حلولاً أسرع. في حال فتح نزاع مصرفي دون مراسلتنا أولاً،
        يحق لبوصلة تعليق الحساب مؤقتاً حتى انتهاء التحقيق.
      </p>

      <h2>9. الاستفسار والتواصل</h2>
      <p className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
        للأسئلة المتعلقة بالفواتير والاسترداد:{" "}
        <a href="mailto:billing@bosla.app" className="text-primary">
          billing@bosla.app
        </a>
      </p>
      <p className="text-sm text-muted-foreground">
        اطّلع أيضاً على{" "}
        <Link to="/terms" className="text-primary hover:underline">
          الشروط والأحكام
        </Link>{" "}
        و
        <Link to="/privacy" className="text-primary hover:underline">
          سياسة الخصوصية
        </Link>
        .
      </p>
    </article>
  );
}
