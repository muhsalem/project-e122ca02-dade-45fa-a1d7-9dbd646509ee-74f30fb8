import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "سياسة ملفات تعريف الارتباط — بوصلة" },
      {
        name: "description",
        content:
          "كيف نستخدم ملفات تعريف الارتباط (Cookies) في منصة بوصلة بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL).",
      },
      { property: "og:title", content: "سياسة ملفات تعريف الارتباط — بوصلة" },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <article className="container-page max-w-3xl py-16 leading-relaxed">
      <h1 className="font-serif text-4xl text-primary">سياسة ملفات تعريف الارتباط</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        آخر تحديث: مايو 2026
      </p>

      <section className="mt-8 space-y-5 text-foreground/90">
        <p>
          نستخدم في منصة <strong>بوصلة</strong> أدنى قدر من ملفات تعريف الارتباط
          اللازمة لتشغيل الخدمة، وفقاً لنظام حماية البيانات الشخصية السعودي
          (PDPL) واللائحة الأوروبية لحماية البيانات (GDPR).
        </p>

        <h2 className="font-serif text-2xl text-primary">١. ما الكوكيز التي نستخدمها؟</h2>
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
                <td className="border border-border p-2">
                  جلسة الدخول، حالة المصادقة، تفضيلات الواجهة (RTL/الوضع الداكن)،
                  حفظ خيار الموافقة على هذا التنبيه.
                </td>
                <td className="border border-border p-2">لا تتطلب موافقة</td>
              </tr>
              <tr>
                <td className="border border-border p-2">وظيفية</td>
                <td className="border border-border p-2">
                  حفظ تقدّم الإجابة في التقييم محلياً حتى لا تفقد إجاباتك.
                </td>
                <td className="border border-border p-2">ضمنية بالاستخدام</td>
              </tr>
              <tr>
                <td className="border border-border p-2">تحليلات / تسويق</td>
                <td className="border border-border p-2">
                  لا نُفعّلها حالياً. عند تفعيلها مستقبلاً سيظهر لك خيار صريح
                  للقبول أو الرفض.
                </td>
                <td className="border border-border p-2">صريحة (Opt-in)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-serif text-2xl text-primary">٢. كيف تتحكّم بها؟</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>من إعدادات متصفّحك يمكنك حذفها أو منعها.</li>
          <li>منع الكوكيز الضرورية قد يعطّل تسجيل الدخول وحفظ التقارير.</li>
          <li>لإعادة عرض تنبيه الموافقة: امسح بيانات الموقع من المتصفّح.</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٣. مزوّدو الخدمة (Processors)</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>بنية تحتية سحابية مُدارة (Lovable Cloud / Supabase) لتخزين البيانات.</li>
          <li>مزوّد نماذج ذكاء اصطناعي لتوليد التقارير (بدون أسماء أو بيانات تعريفية مباشرة).</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary">٤. تواصل</h2>
        <p>
          لأي استفسار:{" "}
          <a className="text-primary underline" href="mailto:privacy@bosla.app">
            privacy@bosla.app
          </a>
        </p>
      </section>
    </article>
  );
}
