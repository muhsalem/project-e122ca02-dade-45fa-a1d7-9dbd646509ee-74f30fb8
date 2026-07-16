import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollText, CheckCircle2, AlertTriangle, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/licensing")({
  component: LicensingPage,
  head: () => ({
    meta: [
      { title: "تراخيص المقاييس النفسية والمهنية — بوصلة" },
      {
        name: "description",
        content:
          "توضيح قانوني لتراخيص كل مقياس مستخدم في منصّة بوصلة: مفتوح المصدر، بحثي، أو تجاري، ومتى يلزم الحصول على إذن رسمي قبل الاستخدام.",
      },
      { property: "og:title", content: "تراخيص المقاييس — بوصلة" },
      {
        property: "og:description",
        content:
          "دليل شفاف لتراخيص المقاييس النفسية والمهنية في بوصلة وشروط استخدامها بحثيًا وتجاريًا.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/licensing" },
    ],
    links: [{ rel: "canonical", href: "/licensing" }],
  }),
});

type Row = {
  name: string;
  arabicName?: string;
  license: string;
  useCase: "مسموح تجاريًا" | "بحثي فقط" | "يتطلّب إذنًا رسميًا" | "ملكية خاصة";
  source: string;
  notes: string;
};

const scales: Row[] = [
  {
    name: "IPIP-NEO-60 / IPIP-NEO-120",
    arabicName: "بديل مفتوح لـ NEO-PI-R (السمات الخمس الكبرى)",
    license: "Public Domain (IPIP.ori.org)",
    useCase: "مسموح تجاريًا",
    source: "International Personality Item Pool — Goldberg (1999)",
    notes:
      "بنود متاحة للجمهور بلا قيود، ويمكن استخدامها تجاريًا وتعديلها وترجمتها. نستخدمه بديلًا مفتوحًا عن NEO-PI-R المُقيَّد.",
  },
  {
    name: "O*NET Interest Profiler (Short)",
    arabicName: "بديل مفتوح لـ Strong / SDS في نموذج RIASEC",
    license: "Public Domain — U.S. Department of Labor",
    useCase: "مسموح تجاريًا",
    source: "O*NET Resource Center — onetcenter.org",
    notes:
      "أداة حكومية أمريكية مجانية بالكامل، مسموح استخدامها تجاريًا مع الإشارة إلى المصدر.",
  },
  {
    name: "OLBI — Oldenburg Burnout Inventory",
    arabicName: "بديل مفتوح لـ MBI-GS",
    license: "Public Domain (Demerouti et al., 2003)",
    useCase: "مسموح تجاريًا",
    source: "Demerouti, E., Bakker, A. B., et al. (2003)",
    notes:
      "متاح للاستخدام البحثي والتجاري مع الاستشهاد بالمصدر. نستخدمه بديلًا عن MBI الذي يتطلّب ترخيصًا مدفوعًا من Mind Garden.",
  },
  {
    name: "IPIP-EI (Emotional Intelligence facets)",
    license: "Public Domain (IPIP)",
    useCase: "مسموح تجاريًا",
    source: "International Personality Item Pool",
    notes:
      "بديل مفتوح لمقاييس EI التجارية كـ MSCEIT و EQ-i.",
  },
  {
    name: "IPIP-Values",
    arabicName: "قيم العمل — بديل عن Schein Career Anchors",
    license: "Public Domain (IPIP)",
    useCase: "مسموح تجاريًا",
    source: "International Personality Item Pool",
    notes:
      "يحلّ محل مقياس Schein Career Anchors الذي يتطلّب ترخيصًا تجاريًا من Wiley.",
  },
  {
    name: "VISA — Vocational Identity Status Assessment",
    license: "Public Domain (Porfeli & Lee, 2012)",
    useCase: "مسموح تجاريًا",
    source: "Porfeli, E. J., & Lee, B. (2012)",
    notes:
      "بديل مفتوح لـ CDSE (Career Decision Self-Efficacy Scale) المقيّد بترخيص Betz & Taylor.",
  },
  {
    name: "PHQ-2 / GAD-2",
    license: "Public Domain (Pfizer, Inc. — مجاني للاستخدام)",
    useCase: "مسموح تجاريًا",
    source: "Kroenke, Spitzer, & Williams (2003)",
    notes:
      "أدوات فرز مختصرة للاكتئاب والقلق. مجانية عالميًا، لكنها للفرز الأولي فقط وليست بديلًا عن التشخيص السريري.",
  },
  {
    name: "VARK / Kolb Learning Styles",
    license: "أدوات تعليمية للتفضيلات — دون ادعاءات علمية",
    useCase: "يتطلّب إذنًا رسميًا",
    source: "Fleming (VARK) / Kolb Learning Style Inventory",
    notes:
      "نستخدمها كأداة تفضيلات تعليمية فقط دون ادّعاء صلاحية علمية. الاستخدام التجاري لبنود Kolb الأصلية يتطلّب ترخيصًا من Hay Group.",
  },
  {
    name: "MBI (Maslach Burnout Inventory)",
    license: "ملكية خاصة — Mind Garden, Inc.",
    useCase: "ملكية خاصة",
    source: "Maslach & Jackson (1981)",
    notes:
      "غير مُستخدم في بوصلة. أي استخدام تجاري يستلزم شراء ترخيص لكل مستخدم من Mind Garden.",
  },
  {
    name: "NEO-PI-R / NEO-PI-3",
    license: "ملكية خاصة — PAR Inc.",
    useCase: "ملكية خاصة",
    source: "Costa & McCrae (1992)",
    notes:
      "غير مُستخدم في بوصلة. نعتمد IPIP-NEO كبديل مفتوح.",
  },
  {
    name: "Schein Career Anchors",
    license: "ملكية خاصة — Wiley",
    useCase: "ملكية خاصة",
    source: "Edgar H. Schein (1978)",
    notes:
      "غير مُستخدم. تم استبداله بـ IPIP-Values.",
  },
  {
    name: "CDSE — Career Decision Self-Efficacy",
    license: "ملكية خاصة — Betz & Taylor",
    useCase: "ملكية خاصة",
    source: "Betz, Klein, & Taylor (1996)",
    notes:
      "غير مُستخدم. تم استبداله بـ VISA.",
  },
];

const badgeStyle: Record<Row["useCase"], string> = {
  "مسموح تجاريًا": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "بحثي فقط": "bg-amber-100 text-amber-800 border-amber-300",
  "يتطلّب إذنًا رسميًا": "bg-orange-100 text-orange-800 border-orange-300",
  "ملكية خاصة": "bg-rose-100 text-rose-800 border-rose-300",
};

function LicensingPage() {
  return (
    <article className="container-page mx-auto max-w-5xl py-16 text-right" dir="rtl">
      <header className="mb-10">
        <div className="mb-4 flex items-center justify-end gap-3">
          <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            تراخيص المقاييس النفسية والمهنية
          </h1>
          <ScrollText className="h-8 w-8 text-gold" aria-hidden="true" />
        </div>
        <p className="text-base leading-8 text-muted-foreground">
          نلتزم في <strong>بوصلة</strong> بالشفافية القانونية الكاملة تجاه المقاييس المستخدمة داخل المنصّة.
          يوضّح هذا القسم نوع ترخيص كل مقياس، وما إذا كان استخدامه مسموحًا تجاريًا أو يتطلّب إذنًا رسميًا
          من أصحاب الحقوق قبل التطبيق. آخر تحديث: 16 يوليو 2026.
        </p>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h3 className="font-serif text-lg font-semibold text-emerald-900">سياستنا</h3>
          </div>
          <p className="text-sm leading-7 text-emerald-900/90">
            نستخدم فقط مقاييس مفتوحة المصدر (Public Domain) أو مرخّصة صراحةً للاستخدام التجاري.
            أي مقياس مقيّد يُستبدَل ببديل مفتوح موثّق علميًا قبل نشره في المنصّة.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden="true" />
            <h3 className="font-serif text-lg font-semibold text-amber-900">متى نحتاج إذنًا رسميًا؟</h3>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm leading-7 text-amber-900/90">
            <li>عند استخدام أي مقياس مصنّف "ملكية خاصة" لأول مرة.</li>
            <li>عند ترجمة مقياس مقيّد إلى العربية للنشر التجاري.</li>
            <li>عند تعديل بنود مقياس مرخّص أو دمجها في تقارير مدفوعة.</li>
            <li>عند تصدير النتائج لجهات خارجية (مؤسسات، جامعات) بصيغة تُنسب للمقياس الأصلي.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-right text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="p-3 font-serif">المقياس</th>
              <th className="p-3 font-serif">الترخيص</th>
              <th className="p-3 font-serif">الحالة</th>
              <th className="p-3 font-serif">المصدر / المرجع</th>
              <th className="p-3 font-serif">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scales.map((s) => (
              <tr key={s.name} className="align-top">
                <td className="p-3">
                  <div className="font-semibold text-foreground">{s.name}</div>
                  {s.arabicName && (
                    <div className="mt-1 text-xs text-muted-foreground">{s.arabicName}</div>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{s.license}</td>
                <td className="p-3">
                  <span
                    className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${badgeStyle[s.useCase]}`}
                  >
                    {s.useCase}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{s.source}</td>
                <td className="p-3 text-xs leading-6 text-muted-foreground">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-10 rounded-xl border border-border bg-secondary/40 p-6">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-primary">الاستشهاد الأكاديمي</h2>
        </div>
        <p className="mb-3 text-sm leading-7 text-muted-foreground">
          عند استخدام نتائج بوصلة في أبحاث أكاديمية أو تقارير رسمية، يرجى الاستشهاد بالمصدر الأصلي
          للمقياس (كما هو موضّح في الجدول أعلاه) وليس بمنصّة بوصلة وحدها. نحن لا نمتلك حقوق البنود
          الأصلية للمقاييس مفتوحة المصدر — نحن فقط ننفّذها ونترجمها.
        </p>
        <p className="text-sm leading-7 text-muted-foreground">
          الترجمات العربية للبنود التي أعدّها فريق بوصلة متاحة للاستخدام البحثي غير التجاري
          بموجب رخصة <strong>CC BY-NC 4.0</strong>. للاستخدام التجاري تواصل معنا.
        </p>
      </section>

      <section className="mb-10 rounded-xl border border-rose-200 bg-rose-50/40 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-700" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-rose-900">إخلاء مسؤولية</h2>
        </div>
        <p className="text-sm leading-7 text-rose-900/90">
          المقاييس المستخدمة في بوصلة أدوات إرشادية ذاتية للفرز والاستكشاف، ولا تُعدّ بديلًا عن التشخيص
          السريري الذي يقدّمه أخصائي نفسي مرخّص. النتائج للاستخدام التوجيهي فقط.
        </p>
      </section>

      <section className="rounded-xl border border-border p-6">
        <div className="mb-3 flex items-center gap-2">
          <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-primary">استفسارات الترخيص</h2>
        </div>
        <p className="mb-2 text-sm leading-7 text-muted-foreground">
          لأي طلب استخدام تجاري، ترجمة، أو تكامل مؤسسي لمقاييس بوصلة، أو للإبلاغ عن مخاوف حقوق ملكية فكرية:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>البريد القانوني: <strong>legal@bosla.app</strong></li>
          <li>الاستفسارات العامة: <strong>info@bosla.app</strong></li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/terms" className="text-primary underline-offset-4 hover:underline">الشروط والأحكام</Link>
          <Link to="/privacy" className="text-primary underline-offset-4 hover:underline">سياسة الخصوصية</Link>
          <Link to="/refund" className="text-primary underline-offset-4 hover:underline">سياسة الاسترداد</Link>
        </div>
      </section>
    </article>
  );
}
