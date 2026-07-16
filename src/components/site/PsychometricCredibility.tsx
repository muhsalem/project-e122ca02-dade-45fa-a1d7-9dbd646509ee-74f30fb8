import { Award, BookOpen, ShieldCheck, Users, ExternalLink, BadgeCheck, FileDown } from "lucide-react";
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

const INTERPRETATIONS: Record<string, { brief: string; followUp: string[] }> = {
  "BFI-2": {
    brief: "يقيس السمات الخمس الكبرى (الانفتاح، الضمير الحي، الانبساط، المقبولية، العصابية) عبر 60 بندًا. يعطي قراءة متوازنة للشخصية دون تصنيف تشخيصي.",
    followUp: [
      "اربط سمتك الأعلى بميولك في O*NET IP لتحديد بيئات العمل الأنسب.",
      "إن كانت العصابية مرتفعة، ابدأ بأدوات تنظيم الضغط (Study OS · Pomodoro).",
      "راجع النتيجة بعد 6 أشهر لرصد التغيّر الطبيعي في السمات.",
    ],
  },
  "O*NET IP": {
    brief: "يحدّد ملفك المهني وفق نموذج RIASEC (واقعي/استقصائي/فنّي/اجتماعي/ريادي/تقليدي) اعتمادًا على 60 نشاطًا مهنيًا.",
    followUp: [
      "استخدم أعلى حرفين من RIASEC كفلتر لاختيار Career Micro-Sims.",
      "ابحث في قاعدة O*NET عن مهن مطابقة لملفك ذات الطلب المرتفع.",
      "قابل ممارسًا واحدًا على الأقل في مجالك الأعلى قبل تثبيت القرار.",
    ],
  },
  "OLBI": {
    brief: "يقيس الاحتراق عبر بُعدَي الإنهاك والانفصال (16 بندًا). أداة استكشاف — ليست تشخيصًا سريريًا.",
    followUp: [
      "إن كان المؤشّر مرتفعًا: احجز جلسة كوتشينج قصيرة قبل أي قرار مهني كبير.",
      "راجع نمط النوم وحدود العمل، وطبّق فحصًا يوميًا في Study OS.",
      "أعِد التقييم بعد 4–6 أسابيع من تطبيق التوصيات.",
    ],
  },
  "UWES-9": {
    brief: "يقيس الاندماج الوظيفي عبر الحيوية والتفاني والاستغراق (9 بنود). يعكس علاقتك الإيجابية بعملك.",
    followUp: [
      "اندماج منخفض؟ ابحث عن معنى داخل مهامك أو أعِد تصميم دورك (Job Crafting).",
      "اندماج عالٍ؟ وقت مناسب لمشاريع تطويرية طموحة أو قيادة مبادرة.",
      "قارن نتيجتك مع نتيجة OLBI: الاندماج العالي مع احتراق مرتفع مؤشّر إنذار.",
    ],
  },
  "VISA": {
    brief: "يصنّف وضعك في تكوين الهوية المهنية: مُحقّقة، تسويف/استكشاف نشط، مُغلقة، مُشتّتة، أو باحثة.",
    followUp: [
      "هوية مُحقّقة: انتقل مباشرة إلى التخطيط والتنفيذ.",
      "استكشاف نشط: حدّد موعدًا نهائيًا للحسم، وجرّب Micro-Sims.",
      "هوية مُغلقة أو مُشتّتة: قابل ممارسين واستكشف قبل الالتزام.",
    ],
  },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function handleExportPdf() {
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const scalesHtml = OPEN_SCALES.map((s) => {
    const interp = INTERPRETATIONS[s.code];
    return `
      <section class="scale">
        <header>
          <span class="code">${escapeHtml(s.code)}</span>
          <h2>${escapeHtml(s.name)}</h2>
          <span class="license">${escapeHtml(s.license)}</span>
        </header>
        <p class="use"><strong>الاستخدام:</strong> ${escapeHtml(s.use)}</p>
        <p class="brief"><strong>تفسير مختصر:</strong> ${escapeHtml(interp?.brief ?? "")}</p>
        <div class="followup">
          <strong>توصيات المتابعة:</strong>
          <ul>${(interp?.followUp ?? []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        </div>
        <p class="cite">${escapeHtml(s.authors)}. <em>${escapeHtml(s.citation)}</em></p>
        <p class="links">
          <a href="${escapeHtml(s.url)}">المصدر الرسمي</a>
          ${s.doi ? `· <a href="${escapeHtml(s.doi)}">DOI</a>` : ""}
        </p>
        ${s.note ? `<p class="note">ملاحظة ترخيص: ${escapeHtml(s.note)}</p>` : ""}
      </section>`;
  }).join("");

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>تقرير المقاييس السيكومترية المفتوحة — بوصلة</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { font-family: "Noto Naskh Arabic", "Amiri", "Segoe UI", "Tahoma", serif; color: #1a1a1a; line-height: 1.75; }
  body { margin: 0; padding: 0; }
  header.top { border-bottom: 2px solid #0f3d2e; padding-bottom: 10px; margin-bottom: 18px; }
  header.top h1 { margin: 0 0 4px; font-size: 20pt; color: #0f3d2e; }
  header.top .sub { font-size: 10pt; color: #555; }
  .intro { background: #f4f8f6; border: 1px solid #cfe0d6; border-radius: 8px; padding: 12px 14px; margin: 0 0 16px; font-size: 10.5pt; }
  .intro strong { color: #0f3d2e; }
  section.scale { border: 1px solid #d8d8d8; border-radius: 8px; padding: 12px 14px; margin: 0 0 12px; page-break-inside: avoid; }
  section.scale header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-bottom: 6px; border-bottom: 1px dashed #ddd; padding-bottom: 6px; }
  section.scale h2 { margin: 0; font-size: 13pt; color: #0f3d2e; }
  .code { font-family: "Courier New", monospace; font-size: 10pt; color: #a37b1e; background: #fff6e0; padding: 2px 6px; border-radius: 4px; }
  .license { margin-inline-start: auto; font-size: 9pt; background: #e6f4ea; color: #1b6e3b; padding: 2px 6px; border-radius: 4px; }
  p { margin: 6px 0; font-size: 10.5pt; }
  .brief { background: #fafafa; padding: 6px 8px; border-inline-start: 3px solid #0f3d2e; }
  .followup ul { margin: 4px 0 0; padding-inline-start: 20px; }
  .followup li { margin: 2px 0; font-size: 10.5pt; }
  .cite { font-size: 9.5pt; color: #444; }
  .links { font-size: 9.5pt; }
  .links a { color: #0f3d2e; text-decoration: underline; }
  .note { font-size: 9pt; color: #8a5a00; font-style: italic; }
  footer { margin-top: 18px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 9pt; color: #666; text-align: center; }
</style>
</head>
<body>
  <header class="top">
    <h1>تقرير المقاييس السيكومترية المفتوحة</h1>
    <div class="sub">بوصلة · Bosla — تاريخ الإصدار: ${escapeHtml(today)}</div>
  </header>
  <div class="intro">
    <strong>ملخص:</strong> يعتمد نظام بوصلة على خمس أدوات مفتوحة الترخيص فقط (BFI-2، O*NET IP، OLBI، UWES-9، VISA)،
    ويستبعد كل الأدوات التجارية المقيّدة. هذا التقرير يعرض لكل أداة تفسيرًا مختصرًا وتوصيات متابعة عملية.
    الأدوات استكشافية وليست تشخيصية؛ ننصح بإحالة الحالات السريرية إلى مختص معتمد.
  </div>
  ${scalesHtml}
  <footer>© بوصلة — للتفاصيل القانونية الكاملة راجع صفحة تراخيص المقاييس على الموقع.</footer>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) {
    alert("يرجى السماح بالنوافذ المنبثقة لتصدير التقرير.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}


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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          <Link
            to="/licensing"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10"
          >
            <Award className="h-4 w-4" />
            استعرض جدول التراخيص الكامل
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
          >
            <FileDown className="h-4 w-4" />
            تصدير تقرير PDF
          </button>
        </div>

      </div>
    </section>
  );
}
