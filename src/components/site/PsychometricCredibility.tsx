import { Award, BookOpen, ShieldCheck, Users, ExternalLink, BadgeCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

const OPEN_SCALES = [
  {
    code: "BFI-2",
    name: "Big Five Inventory-2",
    use: "الشخصية (60 بند)",
    license: "مجاني للبحث · Soto & John (2017)",
    note: "الاستخدام التجاري يتطلب إذناً من المؤلفين",
    authors: "Soto, C. J., & John, O. P. (2017)",
    citation: "Journal of Personality and Social Psychology, 113(1), 117–143.",
    doi: "https://doi.org/10.1037/pspp0000096",
    url: "https://www.colby.edu/psych/personality-lab/",
  },
  {
    code: "O*NET IP",
    name: "Interest Profiler",
    use: "الميول المهنية RIASEC",
    license: "Public Domain (U.S. DoL)",
    authors: "U.S. Department of Labor / O*NET Resource Center",
    citation: "Rounds, J., Su, R., Lewis, P., & Rivkin, D. (2010). O*NET Interest Profiler Short Form Psychometric Characteristics.",
    url: "https://www.onetcenter.org/IP.html",
  },
  {
    code: "OLBI",
    name: "Oldenburg Burnout Inventory",
    use: "الاحتراق المهني (بُعدَي الإنهاك والانفصال)",
    license: "مجاني للبحث · Demerouti et al.",
    authors: "Demerouti, E., Bakker, A. B., Vardakou, I., & Kantas, A. (2003)",
    citation: "European Journal of Psychological Assessment, 19(1), 12–23.",
    doi: "https://doi.org/10.1027/1015-5759.19.1.12",
    url: "https://www.wilmarschaufeli.nl/tests/",
  },
  {
    code: "UWES-9",
    name: "Utrecht Work Engagement Scale",
    use: "الاندماج الوظيفي (9 بنود)",
    license: "مجاني للبحث · Schaufeli & Bakker",
    note: "يتطلب إذناً كتابياً للاستخدام التجاري",
    authors: "Schaufeli, W. B., Bakker, A. B., & Salanova, M. (2006)",
    citation: "Educational and Psychological Measurement, 66(4), 701–716.",
    doi: "https://doi.org/10.1177/0013164405282471",
    url: "https://www.wilmarschaufeli.nl/tests/",
  },
  {
    code: "VISA",
    name: "Vocational Identity Status Assessment",
    use: "الهوية والاستكشاف المهني",
    license: "Open Access · Porfeli et al.",
    authors: "Porfeli, E. J., Lee, B., Vondracek, F. W., & Weigold, I. K. (2011)",
    citation: "Journal of Vocational Behavior, 79(3), 853–871.",
    doi: "https://doi.org/10.1016/j.jvb.2011.02.001",
    url: "https://sites.google.com/view/erik-porfeli/measures",
  },
];


export function PsychometricCredibility() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            <BadgeCheck className="h-4 w-4" />
            Open-license psychometrics · 5 أدوات مفتوحة الترخيص فقط
          </div>
          <h2 className="mt-4 font-serif text-2xl text-primary md:text-3xl">
            خمس أدوات مفتوحة الترخيص — لا مقاييس تجارية مقيّدة
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            اعتمدنا فقط: <strong>BFI-2</strong> للشخصية، <strong>O*NET Interest Profiler</strong> للميول،{" "}
            <strong>OLBI</strong> للاحتراق، <strong>UWES-9</strong> للاندماج الوظيفي، و<strong>VISA</strong> للهوية المهنية.
            استبعدنا كل الأدوات التجارية المقيّدة (MBI، NEO-PI-R، Schein Anchors…). التفاصيل القانونية في{" "}
            <Link to="/licensing" className="text-primary underline-offset-4 hover:underline">
              صفحة تراخيص المقاييس
            </Link>.
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/40 bg-amber-50 px-4 py-3 text-right text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>إفصاح سيكومتري:</strong> النسخ العربية من هذه المقاييس ترجمات داخلية أعدّها
            فريق بوصلة، وهي قيد التقنين على عيّنة عربية. تُعرض النتائج بنطاق ثقة تقريبي ±10٪،
            وستُنشر جداول الصدق والثبات (Cronbach&apos;s α + CFA + Norms) فور اكتمال الدراسة.
            الأدوات ذات ترخيص «مجاني للبحث» (BFI-2 و UWES-9) نستخدمها بعد الحصول على إذن كتابي من مؤلفيها.
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {OPEN_SCALES.map((m) => (
            <div key={m.code} className="relative rounded-xl border border-border bg-card p-4">
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                <BadgeCheck className="h-3 w-3" /> Open
              </span>
              <div className="font-mono text-xs text-gold">{m.code}</div>
              <div className="mt-1 font-serif text-sm font-semibold text-primary">{m.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.use}</div>
              <div className="mt-2 text-[11px] text-muted-foreground/80">{m.license}</div>
              {m.note && (
                <div className="mt-1 text-[10px] italic text-amber-700 dark:text-amber-300">{m.note}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: BookOpen, t: "شفافية المصدر", d: "كل مقياس يظهر اسمه ومؤلفيه وترخيصه ورابطه الأصلي في صفحته وفي التقرير." },
            { icon: Users, t: "ترجمة داخلية موثّقة", d: "الترجمات العربية أعدّها فريق بوصلة، وهي قيد التقنين على عيّنة عربية." },
            { icon: ShieldCheck, t: "أداة استكشاف لا تشخيص", d: "نوصي بإحالة الحالات السريرية إلى مختصين معتمدين." },
          ].map((b) => (
            <div key={b.t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <b.icon className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <div className="font-serif text-sm font-semibold text-primary">{b.t}</div>
                <div className="mt-1 text-xs leading-6 text-muted-foreground">{b.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-lg font-semibold text-primary">مصادر ومراجع المقاييس</h3>
          </div>
          <p className="mb-5 text-xs leading-6 text-muted-foreground">
            روابط مباشرة للمقاييس الأصلية ومعلومات الترخيص والاقتباس الأكاديمي (APA). ننصح بمراجعة صفحة المؤلف قبل أي استخدام تجاري.
          </p>
          <ul className="divide-y divide-border">
            {OPEN_SCALES.map((s) => (
              <li key={s.code} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-gold">{s.code}</span>
                    <span className="ms-2 font-serif text-sm font-semibold text-primary">{s.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    <BadgeCheck className="h-3 w-3" /> {s.license}
                  </span>
                </div>
                <div className="mt-1 text-xs leading-6 text-muted-foreground">
                  <div>{s.authors}. <em>{s.citation}</em></div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" /> المصدر الرسمي
                    </a>
                    {s.doi && (
                      <a href={s.doi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> DOI
                      </a>
                    )}
                  </div>
                  {s.note && (
                    <div className="mt-1 text-[11px] italic text-amber-700 dark:text-amber-300">ملاحظة ترخيص: {s.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/licensing"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10"
          >
            <Award className="h-4 w-4" />
            استعرض جدول التراخيص الكامل
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
