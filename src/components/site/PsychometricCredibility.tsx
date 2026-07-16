import { Award, BookOpen, ShieldCheck, Users, ExternalLink, BadgeCheck, FileDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const REPORT_VERSION = "v1.2.0";
const REPORT_BUILD_DATE = "2026-07-16";

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
    items: 60,
    respMin: 1,
    respMax: 5,
    domains: 5,
    typicalAlpha: 0.83,
  },
  {
    code: "O*NET IP",
    name: "Interest Profiler",
    use: "الميول المهنية RIASEC",
    license: "Public Domain (U.S. DoL)",
    authors: "U.S. Department of Labor / O*NET Resource Center",
    citation: "Rounds, J., Su, R., Lewis, P., & Rivkin, D. (2010). O*NET Interest Profiler Short Form Psychometric Characteristics.",
    url: "https://www.onetcenter.org/IP.html",
    items: 60,
    respMin: 1,
    respMax: 5,
    domains: 6,
    typicalAlpha: 0.85,
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
    items: 16,
    respMin: 1,
    respMax: 4,
    domains: 2,
    typicalAlpha: 0.78,
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
    items: 9,
    respMin: 0,
    respMax: 6,
    domains: 3,
    typicalAlpha: 0.90,
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
    items: 30,
    respMin: 1,
    respMax: 5,
    domains: 6,
    typicalAlpha: 0.80,
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

function handleExportPdf(userName: string, userEmail: string) {
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const createdAtIso = new Date().toISOString();
  const reportId = `BSL-${Date.now().toString(36).toUpperCase()}`;
  const displayName = userName?.trim() || "زائر";
  const emailLine = userEmail ? ` · ${userEmail}` : "";

  // مؤشرات إجمالية للمقارنة السريعة بين المقاييس
  const maxItems = Math.max(...OPEN_SCALES.map((s) => s.items));
  const maxDomains = Math.max(...OPEN_SCALES.map((s) => s.domains));
  const maxGranularity = Math.max(...OPEN_SCALES.map((s) => s.respMax - s.respMin + 1));
  const avgItems = Math.round(OPEN_SCALES.reduce((a, s) => a + s.items, 0) / OPEN_SCALES.length);
  const avgDomains = (OPEN_SCALES.reduce((a, s) => a + s.domains, 0) / OPEN_SCALES.length).toFixed(1);
  const avgAlpha = (OPEN_SCALES.reduce((a, s) => a + s.typicalAlpha, 0) / OPEN_SCALES.length).toFixed(2);
  const totalItems = OPEN_SCALES.reduce((a, s) => a + s.items, 0);

  const summaryRows = OPEN_SCALES.map((s) => {
    const coverage = Math.round((s.items / maxItems) * 100);
    const depth = Math.round((s.domains / maxDomains) * 100);
    const granularity = Math.round(((s.respMax - s.respMin + 1) / maxGranularity) * 100);
    const alphaPct = Math.round(s.typicalAlpha * 100);
    return `
      <tr>
        <td class="c-code">${escapeHtml(s.code)}</td>
        <td>${s.items}</td>
        <td>${s.domains}</td>
        <td>${s.respMin}–${s.respMax}</td>
        <td>${s.typicalAlpha.toFixed(2)}</td>
        <td class="bar-cell">
          <div class="bar"><span style="width:${coverage}%"></span></div>
          <em>${coverage}٪</em>
        </td>
        <td class="bar-cell">
          <div class="bar bar-b"><span style="width:${depth}%"></span></div>
          <em>${depth}٪</em>
        </td>
        <td class="bar-cell">
          <div class="bar bar-c"><span style="width:${granularity}%"></span></div>
          <em>${granularity}٪</em>
        </td>
        <td class="bar-cell">
          <div class="bar bar-d"><span style="width:${alphaPct}%"></span></div>
          <em>α ${s.typicalAlpha.toFixed(2)}</em>
        </td>
      </tr>`;
  }).join("");

  const summaryHtml = `
    <section class="overall">
      <h2>الملخص الإجمالي · مقارنة سريعة بين المقاييس الخمسة</h2>
      <div class="kpis">
        <div class="kpi"><span class="k-lbl">إجمالي البنود</span><span class="k-val">${totalItems}</span></div>
        <div class="kpi"><span class="k-lbl">متوسط البنود / مقياس</span><span class="k-val">${avgItems}</span></div>
        <div class="kpi"><span class="k-lbl">متوسط النطاقات</span><span class="k-val">${avgDomains}</span></div>
        <div class="kpi"><span class="k-lbl">متوسط الثبات α</span><span class="k-val">${avgAlpha}</span></div>
        <div class="kpi"><span class="k-lbl">عدد المقاييس</span><span class="k-val">${OPEN_SCALES.length}</span></div>
      </div>
      <table class="cmp">
        <thead>
          <tr>
            <th>المقياس</th>
            <th>البنود</th>
            <th>النطاقات</th>
            <th>مدى الاستجابة</th>
            <th>α النموذجي</th>
            <th>تغطية البنود</th>
            <th>عمق النطاقات</th>
            <th>دقّة التدرّج</th>
            <th>ثبات الأداة</th>
          </tr>
        </thead>
        <tbody>${summaryRows}</tbody>
      </table>
      <p class="legend">
        <strong>كيف تُقرأ الأشرطة؟</strong>
        <span class="lg lg-a"></span> تغطية البنود = البنود ÷ أعلى مقياس.
        <span class="lg lg-b"></span> عمق النطاقات = عدد الأبعاد ÷ أعلى مقياس.
        <span class="lg lg-c"></span> دقّة التدرّج = مدى الاستجابة ÷ أوسع مدى.
        <span class="lg lg-d"></span> الثبات α النموذجي المُبلَّغ في الأدبيات.
      </p>
    </section>`;

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
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
<style>
  @page {
    size: A4;
    margin: 28mm 16mm 24mm;
  }
  @page :first { margin-top: 32mm; }
  * { box-sizing: border-box; }
  :root {
    --arabic-stack: "Noto Naskh Arabic", "Amiri", "Sakkal Majalla", "Traditional Arabic",
      "Geeza Pro", "Al Bayan", "Arabic Typesetting", "Segoe UI", "Tahoma", "Arial", serif;
  }
  html, body {
    font-family: var(--arabic-stack);
    color: #1a1a1a;
    line-height: 1.9;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-variant-ligatures: common-ligatures;
    word-spacing: 0.02em;
    hyphens: none;
  }
  body { margin: 0; padding: 0; font-size: 11pt; }

  /* ترويسة وتذييل ثابتان يتكرّران على كل صفحة عند الطباعة */
  .page-header, .page-footer {
    position: fixed;
    left: 0;
    right: 0;
    font-size: 8.5pt;
    color: #4a5a55;
    background: #ffffff;
  }
  .page-header {
    top: 0;
    padding: 6mm 16mm 4mm;
    border-bottom: 1px solid #cfe0d6;
    display: flex; justify-content: space-between; align-items: center; gap: 10px;
  }
  .page-header .brand { font-weight: 700; color: #0f3d2e; }
  .page-header .who { color: #333; }
  .page-header .rev { font-family: "Courier New", monospace; color: #a37b1e; }
  .page-footer {
    bottom: 0;
    padding: 4mm 16mm 6mm;
    border-top: 1px solid #cfe0d6;
    display: flex; justify-content: space-between; align-items: center; gap: 10px;
  }
  .page-footer .rid { font-family: "Courier New", monospace; }
  .page-footer .pageno::after { content: "صفحة " counter(page) " / " counter(pages); }

  header.top { border-bottom: 2px solid #0f3d2e; padding-bottom: 10px; margin-bottom: 18px; }
  header.top h1 { margin: 0 0 4px; font-size: 20pt; color: #0f3d2e; font-weight: 700; }
  header.top .sub { font-size: 10pt; color: #555; }
  .meta-card {
    margin: 0 0 14px;
    padding: 10px 14px;
    border: 1px solid #cfe0d6;
    background: #f8fbf9;
    border-radius: 8px;
    font-size: 10pt;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 18px;
  }
  .meta-card .lbl { color: #666; margin-inline-end: 4px; }
  .meta-card .val { color: #0f3d2e; font-weight: 600; }
  .intro { background: #f4f8f6; border: 1px solid #cfe0d6; border-radius: 8px; padding: 14px 16px; margin: 0 0 18px; font-size: 10.5pt; line-height: 2; }
  .intro strong { color: #0f3d2e; }

  /* الملخص الإجمالي والمقارنة السريعة */
  section.overall {
    border: 1px solid #cfe0d6;
    background: #ffffff;
    border-radius: 10px;
    padding: 14px 16px;
    margin: 0 0 18px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  section.overall h2 { margin: 0 0 10px; font-size: 13pt; color: #0f3d2e; font-weight: 700; }
  .kpis { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
  .kpi { border: 1px solid #e2ebe6; border-radius: 6px; padding: 6px 8px; text-align: center; background: #f8fbf9; }
  .kpi .k-lbl { display: block; font-size: 8.5pt; color: #556; }
  .kpi .k-val { display: block; font-size: 13pt; font-weight: 700; color: #0f3d2e; margin-top: 2px; }
  table.cmp { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  table.cmp th, table.cmp td { padding: 6px 6px; border-bottom: 1px solid #eee; text-align: center; vertical-align: middle; }
  table.cmp thead th { background: #f4f8f6; color: #0f3d2e; font-weight: 700; font-size: 9pt; }
  table.cmp .c-code { font-family: "Courier New", monospace; color: #a37b1e; background: #fff6e0; border-radius: 4px; }
  .bar-cell { min-width: 90px; }
  .bar { position: relative; height: 8px; background: #eef2f0; border-radius: 4px; overflow: hidden; margin: 0 auto 2px; width: 90%; }
  .bar span { position: absolute; inset: 0 auto 0 0; background: #0f3d2e; border-radius: 4px; }
  .bar.bar-b span { background: #1b6e3b; }
  .bar.bar-c span { background: #a37b1e; }
  .bar.bar-d span { background: #2b5aa8; }
  .bar-cell em { font-style: normal; font-size: 8.5pt; color: #555; }
  .legend { font-size: 8.5pt; color: #555; margin-top: 10px; line-height: 1.8; }
  .legend .lg { display: inline-block; width: 10px; height: 8px; border-radius: 3px; margin: 0 6px 0 12px; vertical-align: middle; }
  .legend .lg-a { background: #0f3d2e; }
  .legend .lg-b { background: #1b6e3b; }
  .legend .lg-c { background: #a37b1e; }
  .legend .lg-d { background: #2b5aa8; }

  section.scale {
    border: 1px solid #d8d8d8;
    border-radius: 8px;
    padding: 14px 16px;
    margin: 0 0 14px;
    page-break-inside: avoid;
    break-inside: avoid;
    orphans: 3;
    widows: 3;
  }
  /* الأقسام الطويلة: يُسمح بتقسيمها على صفحات مع هوامش داخلية أكبر للتنفس البصري */
  section.scale.long {
    page-break-inside: auto;
    break-inside: auto;
    padding-top: 18px;
    padding-bottom: 18px;
  }
  section.scale.long .followup ul { page-break-inside: auto; break-inside: auto; }
  section.scale.long .followup li { page-break-inside: avoid; break-inside: avoid; margin: 4px 0; }
  section.scale header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-bottom: 8px; border-bottom: 1px dashed #ddd; padding-bottom: 6px; }
  section.scale h2 { margin: 0; font-size: 13.5pt; color: #0f3d2e; font-weight: 700; }
  .code { font-family: "Courier New", "Menlo", monospace; font-size: 10pt; color: #a37b1e; background: #fff6e0; padding: 2px 6px; border-radius: 4px; }
  .license { margin-inline-start: auto; font-size: 9.5pt; background: #e6f4ea; color: #1b6e3b; padding: 2px 8px; border-radius: 4px; }
  p { margin: 6px 0; font-size: 10.75pt; line-height: 1.95; }
  .brief { background: #fafafa; padding: 8px 10px; border-inline-start: 3px solid #0f3d2e; border-radius: 4px; }
  .followup ul { margin: 6px 0 0; padding-inline-start: 22px; }
  .followup li { margin: 3px 0; font-size: 10.75pt; line-height: 1.9; }
  .cite { font-size: 9.75pt; color: #444; line-height: 1.7; }
  .links { font-size: 9.75pt; }
  .links a { color: #0f3d2e; text-decoration: underline; }
  .note { font-size: 9pt; color: #8a5a00; font-style: italic; }
  footer.doc-end { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 9pt; color: #666; text-align: center; }
  @media print {
    a { color: #0f3d2e; }
    .preview-bar { display: none !important; }
    body { background: #ffffff !important; padding: 0 !important; }
  }

  /* وضع المعاينة على الشاشة: إطار A4 بلون خلفية رمادي ليتضح تخطيط الصفحة */
  @media screen {
    body {
      background: #e6ecea;
      padding: 76px 20px 40px;   /* مساحة أعلى الصفحة للشريط الثابت */
    }
    /* لفّ المحتوى داخل إطار A4 عبر عناصر body المباشرة (باستثناء الشريط) */
    body > .page-header,
    body > .page-footer { display: none; }  /* هذه للطباعة فقط */
    body > header.top,
    body > .meta-card,
    body > .intro,
    body > section.overall,
    body > section.scale,
    body > footer.doc-end {
      max-width: 210mm;
      margin-inline: auto;
      background: #ffffff;
    }
    body > header.top {
      padding: 16mm 16mm 6mm;
      margin-top: 0;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 6px 24px rgba(15,61,46,0.08);
    }
    body > footer.doc-end {
      padding: 8mm 16mm 12mm;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 6px 24px rgba(15,61,46,0.08);
      margin-bottom: 40px;
    }
    body > .meta-card,
    body > .intro,
    body > section.overall,
    body > section.scale {
      margin-inline: auto;
      padding-inline: 16mm;
      border-inline: 1px solid #eef1ef;
    }
  }

  /* علامات فواصل الصفحات المتوقّعة في المعاينة */
  .page-break-marker {
    position: absolute; left: 0; right: 0;
    border-top: 2px dashed #d0433a;
    pointer-events: none;
    z-index: 50;
  }
  .page-break-marker::before {
    content: attr(data-label);
    position: absolute; top: -12px; right: 50%;
    transform: translateX(50%);
    background: #d0433a; color: #fff;
    padding: 2px 10px; border-radius: 999px;
    font-size: 9pt; font-weight: 700;
    box-shadow: 0 2px 6px rgba(208,67,58,0.35);
    white-space: nowrap;
  }
  .page-num-chip {
    position: absolute; right: calc(50% + 108mm); top: 6px;
    background: #0f3d2e; color: #ffd66b;
    font-family: "Courier New", monospace;
    font-size: 9pt; font-weight: 700;
    padding: 3px 8px; border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    z-index: 40;
    pointer-events: none;
  }
  .crosses-break {
    outline: 2px solid #e2a72e !important;
    outline-offset: 3px;
    position: relative;
  }
  .crosses-break::after {
    content: "⚠ ينكسر على صفحتين";
    position: absolute; top: -12px; left: 8px;
    background: #e2a72e; color: #4a3208;
    padding: 2px 8px; border-radius: 4px;
    font-size: 8.5pt; font-weight: 700;
    z-index: 45;
  }
  body.breaks-hidden .page-break-marker,
  body.breaks-hidden .page-num-chip { display: none !important; }
  body.breaks-hidden .crosses-break { outline: none !important; }
  body.breaks-hidden .crosses-break::after { display: none !important; }
  @media print {
    .page-break-marker, .page-num-chip, .crosses-break::after { display: none !important; }
    .crosses-break { outline: none !important; }
  }

  /* شريط المعاينة العائم */
  .preview-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 10px 18px;
    background: linear-gradient(180deg, #0f3d2e 0%, #14503c 100%);
    color: #f4f8f6;
    box-shadow: 0 4px 14px rgba(15,61,46,0.25);
    font-size: 10.5pt;
  }
  .pb-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .pb-badge {
    background: #ffd66b; color: #4a3208; font-weight: 700;
    padding: 3px 10px; border-radius: 999px; font-size: 9.5pt;
  }
  .pb-tag {
    background: rgba(255,255,255,0.14); color: #f4f8f6;
    padding: 3px 8px; border-radius: 6px; font-size: 9pt;
    border: 1px solid rgba(255,255,255,0.18);
  }
  .pb-tag.pb-rev { font-family: "Courier New", monospace; color: #ffd66b; }
  .pb-tag.pb-pages { background: rgba(255,214,107,0.18); color: #ffd66b; border-color: rgba(255,214,107,0.35); font-weight: 700; }
  .pb-actions { display: flex; gap: 8px; }
  .pb-btn {
    padding: 7px 14px; border-radius: 8px; font-size: 10pt; font-weight: 600;
    cursor: pointer; border: 1px solid transparent; font-family: inherit;
  }
  .pb-btn-primary { background: #ffd66b; color: #4a3208; }
  .pb-btn-primary:hover { background: #ffce4d; }
  .pb-btn-ghost { background: transparent; color: #f4f8f6; border-color: rgba(255,255,255,0.35); }
  .pb-btn-ghost:hover { background: rgba(255,255,255,0.1); }
  .pb-btn-toggle { background: rgba(208,67,58,0.9); color: #fff; border-color: rgba(255,255,255,0.15); }
  .pb-btn-toggle.off { background: rgba(255,255,255,0.14); color: #f4f8f6; border-color: rgba(255,255,255,0.35); }

  /* مجموعة تكبير/تصغير المعاينة */
  .pb-zoom {
    display: inline-flex; align-items: stretch;
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 8px; overflow: hidden;
  }
  .pb-zoom button {
    background: transparent; color: #f4f8f6;
    border: 0; padding: 6px 10px; font-size: 12pt; font-weight: 700;
    cursor: pointer; font-family: inherit; line-height: 1;
  }
  .pb-zoom button:hover:not(:disabled) { background: rgba(255,255,255,0.14); }
  .pb-zoom button:disabled { opacity: 0.4; cursor: not-allowed; }
  .pb-zoom .pb-zoom-val {
    padding: 6px 10px; font-size: 9.5pt; font-weight: 700;
    background: rgba(0,0,0,0.18); color: #ffd66b;
    min-width: 52px; text-align: center; align-self: center;
    font-family: "Courier New", monospace;
  }

  /* تطبيق التكبير على عناصر محتوى الصفحة فقط (لا يشمل شريط المعاينة) */
  @media screen {
    body { --zoom: 1; }
    body > header.top,
    body > .meta-card,
    body > .intro,
    body > section.overall,
    body > section.scale,
    body > footer.doc-end { zoom: var(--zoom); }
  }
</style>
</head>
<body>
  <div class="page-header">
    <span class="brand">بوصلة · Bosla</span>
    <span class="who">${escapeHtml(displayName)}${escapeHtml(emailLine)}</span>
    <span class="rev">${escapeHtml(REPORT_VERSION)}</span>
  </div>
  <div class="page-footer">
    <span class="rid">${escapeHtml(reportId)}</span>
    <span class="pageno"></span>
    <span>${escapeHtml(today)}</span>
  </div>

  <header class="top">
    <h1>تقرير المقاييس السيكومترية المفتوحة</h1>
    <div class="sub">بوصلة · Bosla — تاريخ الإصدار: ${escapeHtml(today)}</div>
  </header>
  <div class="meta-card">
    <div><span class="lbl">المستخدم:</span><span class="val">${escapeHtml(displayName)}</span></div>
    <div><span class="lbl">البريد:</span><span class="val">${escapeHtml(userEmail || "—")}</span></div>
    <div><span class="lbl">تاريخ الإنشاء:</span><span class="val">${escapeHtml(today)}</span></div>
    <div><span class="lbl">رقم التقرير:</span><span class="val">${escapeHtml(reportId)}</span></div>
    <div><span class="lbl">إصدار التقرير:</span><span class="val">${escapeHtml(REPORT_VERSION)} · ${escapeHtml(REPORT_BUILD_DATE)}</span></div>
    <div><span class="lbl">الطابع الزمني:</span><span class="val" style="font-family:monospace">${escapeHtml(createdAtIso)}</span></div>
  </div>
  <div class="intro">
    <strong>ملخص:</strong> يعتمد نظام بوصلة على خمس أدوات مفتوحة الترخيص فقط (BFI-2، O*NET IP، OLBI، UWES-9، VISA)،
    ويستبعد كل الأدوات التجارية المقيّدة. هذا التقرير يعرض لكل أداة تفسيرًا مختصرًا وتوصيات متابعة عملية.
    الأدوات استكشافية وليست تشخيصية؛ ننصح بإحالة الحالات السريرية إلى مختص معتمد.
  </div>
  ${summaryHtml}
  ${scalesHtml}
  <footer class="doc-end">© بوصلة — للتفاصيل القانونية الكاملة راجع صفحة تراخيص المقاييس على الموقع.</footer>

  <!-- شريط المعاينة (لا يظهر عند الطباعة) -->
  <div class="preview-bar" role="toolbar" aria-label="شريط معاينة PDF">
    <div class="pb-info">
      <span class="pb-badge">معاينة قبل الحفظ</span>
      <span class="pb-tag">RTL · العربية</span>
      <span class="pb-tag">A4 · 210×297 مم</span>
      <span class="pb-tag pb-pages" id="pb-pages">— صفحات</span>
      <span class="pb-tag pb-rev">${escapeHtml(REPORT_VERSION)}</span>
    </div>
    <div class="pb-actions">
      <div class="pb-zoom" role="group" aria-label="تكبير وتصغير المعاينة">
        <button type="button" id="pb-zoom-out" title="تصغير" aria-label="تصغير">−</button>
        <span class="pb-zoom-val" id="pb-zoom-val">100٪</span>
        <button type="button" id="pb-zoom-in" title="تكبير" aria-label="تكبير">+</button>
        <button type="button" id="pb-zoom-reset" title="إعادة ضبط" aria-label="إعادة ضبط">⟳</button>
      </div>
      <button type="button" id="pb-toggle-breaks" class="pb-btn pb-btn-toggle">إخفاء حدود الصفحات</button>
      <button type="button" id="pb-close" class="pb-btn pb-btn-ghost">إغلاق المعاينة</button>
      <button type="button" id="pb-print" class="pb-btn pb-btn-primary">طباعة / حفظ PDF</button>
    </div>
  </div>

  <script>
    (function() {
      // ضبط تلقائي: أي قسم أطول من ثلثي صفحة A4 يُسمح بتقسيمه ويحصل على هوامش أوسع
      var LONG_THRESHOLD_PX = 720;
      document.querySelectorAll('section.scale').forEach(function(el) {
        if (el.getBoundingClientRect().height > LONG_THRESHOLD_PX) {
          el.classList.add('long');
        }
      });

      // حساب فواصل الصفحات المتوقعة داخل A4 وإبراز العناصر التي تنكسر
      // أبعاد A4 عند 96dpi: العرض 794px، الارتفاع 1123px
      // نأخذ في الحسبان هوامش @page (28mm أعلى / 24mm أسفل ≈ 106px + 91px)،
      // مع هامش أعلى إضافي للصفحة الأولى (32mm ≈ 121px بدل 106).
      var PAGE_H = 1123;                 // ارتفاع A4 بالبكسل
      var MARGIN_TOP = 106;              // 28mm
      var MARGIN_TOP_FIRST = 121;        // 32mm
      var MARGIN_BOTTOM = 91;            // 24mm
      var USABLE_FIRST = PAGE_H - MARGIN_TOP_FIRST - MARGIN_BOTTOM;   // ~911px
      var USABLE = PAGE_H - MARGIN_TOP - MARGIN_BOTTOM;               // ~926px

      var TOOLBAR_OFFSET = 76;  // padding-top للجسم في وضع الشاشة
      var body = document.body;

      function computeBreaks() {
        // إزالة العلامات السابقة
        document.querySelectorAll('.page-break-marker, .page-num-chip').forEach(function(n){ n.remove(); });
        document.querySelectorAll('.crosses-break').forEach(function(n){ n.classList.remove('crosses-break'); });

        // محتوى الصفحة يبدأ من أول عنصر بعد الشريط
        var firstEl = document.querySelector('header.top');
        if (!firstEl) return 0;
        var startY = firstEl.offsetTop;   // نسبة إلى الجسم
        // آخر عنصر
        var endEl = document.querySelector('footer.doc-end');
        var endY = endEl ? (endEl.offsetTop + endEl.offsetHeight) : document.body.scrollHeight;
        var totalContent = endY - startY;

        // احسب مواضع الفواصل المتوقعة
        var boundaries = [];   // إحداثيات Y (نسبة إلى الجسم) حيث تبدأ صفحة جديدة
        var cursor = startY + USABLE_FIRST;
        var pageIdx = 2;
        while (cursor < endY) {
          boundaries.push({ y: cursor, page: pageIdx });
          cursor += USABLE;
          pageIdx++;
        }

        // ارسم علامة "بداية الصفحة N" عند كل حدّ
        boundaries.forEach(function(b) {
          var line = document.createElement('div');
          line.className = 'page-break-marker';
          line.style.top = b.y + 'px';
          line.setAttribute('data-label', '⇤ بداية الصفحة ' + b.page);
          body.appendChild(line);
        });

        // شارات رقم الصفحة على يسار الورقة عند بداية كل صفحة
        var pageStarts = [{ y: startY, page: 1 }].concat(boundaries);
        pageStarts.forEach(function(p) {
          var chip = document.createElement('div');
          chip.className = 'page-num-chip';
          chip.style.top = (p.y + 4) + 'px';
          chip.textContent = 'صفحة ' + p.page;
          body.appendChild(chip);
        });

        // أبرز العناصر التي تعبر أي فاصل
        var candidates = document.querySelectorAll(
          'section.scale, section.overall, .meta-card, .intro, table.cmp, .followup, header.top'
        );
        candidates.forEach(function(el) {
          var top = el.offsetTop;
          var bottom = top + el.offsetHeight;
          for (var i = 0; i < boundaries.length; i++) {
            var by = boundaries[i].y;
            if (top < by && bottom > by) {
              // نتجاهل الأقسام التي وسمناها بـ .long عمدًا لأنها مصمّمة للتقسيم
              if (!el.classList.contains('long')) {
                el.classList.add('crosses-break');
              }
              break;
            }
          }
        });

        return pageStarts.length;
      }

      function refreshBadge(n) {
        var badge = document.getElementById('pb-pages');
        if (badge) badge.textContent = n + ' صفحات متوقّعة';
      }

      function run() {
        var n = computeBreaks();
        refreshBadge(n);
      }

      // تفعيل أزرار المعاينة (بدون طباعة تلقائية — ينتظر المستخدم للمراجعة أولًا)
      var btnPrint = document.getElementById('pb-print');
      var btnClose = document.getElementById('pb-close');
      var btnToggle = document.getElementById('pb-toggle-breaks');
      if (btnPrint) btnPrint.addEventListener('click', function() {
        var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
        ready.then(function() { window.print(); });
      });
      if (btnClose) btnClose.addEventListener('click', function() { window.close(); });
      if (btnToggle) btnToggle.addEventListener('click', function() {
        var hidden = body.classList.toggle('breaks-hidden');
        btnToggle.classList.toggle('off', hidden);
        btnToggle.textContent = hidden ? 'إظهار حدود الصفحات' : 'إخفاء حدود الصفحات';
      });

      // انتظر تحميل الخطوط ثم احسب الفواصل، وأعد الحساب عند تغيير مقاس النافذة
      var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      ready.then(function() { setTimeout(run, 120); });
      var t;
      window.addEventListener('resize', function() {
        clearTimeout(t);
        t = setTimeout(run, 200);
      });

      window.scrollTo({ top: 0 });
    })();
  </script>
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
  const { user } = useAuth();
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const userName = meta.full_name || meta.name || user?.email?.split("@")[0] || "زائر";
  const userEmail = user?.email ?? "";
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
            onClick={() => handleExportPdf(userName, userEmail)}
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
