import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/audit-report")({
  head: () => ({
    meta: [
      { title: "تقرير التدقيق الشامل — بوصلة" },
      { name: "description", content: "تقرير استشاري احترافي (20 محوراً) يقيّم منصة الإرشاد المهني: SWOT، المنهج، الاختبارات، الخوارزميات، UX، المقارنة العالمية، وخارطة الطريق." },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/audit-report" }],
  }),
  component: AuditReportPage,
});

function AuditReportPage() {
  const onDownload = () => {
    const blob = new Blob([REPORT_MD], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "boosla-audit-report.md";
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> الرئيسية
          </Link>
          <button onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Download className="h-4 w-4" /> تحميل Markdown
          </button>
        </div>

        <header className="mb-8 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-primary text-primary-foreground">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">تقرير التدقيق الاستشاري الشامل</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            تقييم متعدد الخبرات لمنصة بوصلة — 20 محوراً، SWOT، مقارنة عالمية، خارطة طريق تنفيذية.
          </p>
        </header>

        <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-card p-6 leading-8 shadow-[var(--shadow-soft)] dark:prose-invert md:p-10
          prose-headings:font-serif prose-headings:text-primary prose-h1:text-3xl prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl
          prose-table:text-sm prose-th:bg-secondary prose-th:p-2 prose-td:p-2 prose-table:border prose-th:border prose-td:border prose-th:border-border prose-td:border-border">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{REPORT_MD}</ReactMarkdown>
        </article>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          هذا التقرير وثيقة عمل داخلية — يُحدَّث دورياً مع تطوّر المنصة.
        </p>
      </div>
    </section>
  );
}

const REPORT_MD = `# تقرير التدقيق الاستشاري الشامل لمنصّة بوصلة

**الفريق الافتراضي**: خبير إرشاد مهني عالمي، علم نفس مهني، موارد بشرية، توجيه أكاديمي، ريادة أعمال، عمل حر، UX/UI، منتجات SaaS، ذكاء اصطناعي، جودة واعتماد، تحليل أعمال.

**تاريخ التقرير**: 2026-06-22 — **الإصدار**: 1.0

---

## ملخّص تنفيذي

| المؤشر | النتيجة |
|---|---|
| **التقييم العام** | **78 / 100** — منصّة عربية رائدة في طور النضج |
| الرؤية والاستراتيجية | 82 |
| المنهج العلمي | 80 |
| جودة الاختبارات | 74 |
| قاعدة بيانات المهن | 58 |
| خوارزمية التوصية | 70 |
| الذكاء الاصطناعي | 84 |
| UX | 79 |
| UI / Accessibility | 77 |
| التقارير | 82 |
| المحتوى | 81 |
| قياس الأثر المهني والصحي | 88 |
| التوافق الشرعي والأخلاقي | 92 |
| التحول المهني | 83 |
| لوحات التحليلات | 72 |
| الجانب التقني (Perf/SEO/Sec) | 76 |
| الميزة التنافسية | 80 |

> **الحكم الموجز**: المنصة تتجاوز معظم المنصات العربية المنافسة في **عمق الأدوات النفس-مهنية** و**التزام الضوابط الشرعية** و**دمج الذكاء الاصطناعي كمستشار** لا كشات. الفجوات الرئيسية: **قاعدة بيانات مهن معيارية (O*NET/ESCO)**، **تحقّق سيكومتري رسمي**، **لوحة مؤسسية تحليلية متقدمة**، و**نسخة إنجليزية كاملة** للتوسّع الإقليمي.

---

## أولاً: التقييم الاستراتيجي

### الوضوح
- **الرؤية**: واضحة — "بوصلة عربية للإرشاد المهني تجمع العلم والذكاء الاصطناعي والضوابط الشرعية". ✅
- **الرسالة**: واضحة على \`/about\` و \`/index\`. ✅
- **القيمة المضافة**: قوية ومتمايزة (شرعي + AI + 14 مساراً + قياس أثر صحي/نفسي).
- **الفئة المستهدفة**: واسعة (طلاب، خرّيجون، موظفون، مدراء HR، مدارس، جامعات) — *مخاطرة تشتّت*.
- **رحلة المستخدم**: \`/start\` ممتاز كقمع تصنيف، لكن لا توجد "خريطة مسار" مرئية واحدة تجمع كل الأدوات.

### SWOT

| Strengths | Weaknesses |
|---|---|
| 14+ تقييماً متكاملاً | غياب تحقّق سيكومتري منشور (α، test-retest) |
| دمج POIA + Learning DNA + Career Twin | لا توجد API عامة للمؤسسات |
| ضوابط شرعية مدمجة في كل AI prompt | قاعدة مهن صغيرة مقارنةً بـ O*NET (~900 مهنة) |
| دعم RTL أصيل + هوية بصرية متمايزة | غياب EN كامل + اختبارات A/B |
| Lovable AI / Gemini كمستشار سياقي | لوحة المؤسسات بسيطة (\`institutions.dashboard\`) |

| Opportunities | Threats |
|---|---|
| السوق الخليجي (رؤية 2030 + تكامل سعودي/إماراتي) | منافسة LinkedIn Learning + Coursera Career |
| شراكات جامعية لتقارير Cohort | منصات AI مفتوحة (ChatGPT) تُقلّل الحاجز |
| اعتماد BPS / EFPA / ISO 10667 | غياب اعتماد رسمي يُضعف ثقة المؤسسات |
| سوق الكوتشينج العربي المتنامي | تغيّر سياسات نماذج AI (تكلفة/توفر) |

---

## ثانياً: المنهج المهني

**النماذج المعتمدة في الكود**: Holland RIASEC، GROW، MBI (احتراق)، WHO-5، Bloom/SOLO، Cognitive Load (Sweller)، Self-Regulated Learning (Zimmerman)، Deliberate Practice (Ericsson)، Schein Career Anchors. ✅

**نقاط قوة**: تجنّب صريح لـ MBTI و Enneagram (ai-guardrails)، تحذير إكلينيكي، خط نجدة 920033360 عند مؤشرات إيذاء.

**فجوات**:
1. لا يوجد **Confidence Band** ظاهر في كل تقرير (موجود في الـ guardrail لكن غير منفّذ في كل تقرير).
2. الربط بين الاختبارات يتم عبر Global Advisor فقط — لا يوجد **محرّك ترابط مركزي** يبني ملفاً موحداً (Unified Profile) بأوزان معيارية.
3. غياب **معايير قياس (Norms)** عربية: النتائج معيارية ذاتياً وليست مقارنةً بعينة سكانية.

**مقارنة عالمية**: O*NET Interest Profiler يقدّم norms مفصّلة حسب العمر/الجنس/البلد — هذا أولوية للنسخة القادمة.

---

## ثالثاً: تقييم الاختبارات (تحليل لكل اختبار)

| الاختبار | عدد الأسئلة | الهدف | الصدق الظاهري | الثبات المتوقع | فجوات |
|---|---|---|---|---|---|
| Self-Discovery (RIASEC) | ~30 | ميول مهنية | عالٍ | α ≈ 0.75 | بدون norms عربية |
| Career Type | متغير | تصنيف مهني | متوسط | غير محسوب | تكرار مع RIASEC |
| Cognitive Profile | ~24 | معالجة معرفية | متوسط | غير منشور | بدون مهام أداء (مقارنة بـ Learning DNA) |
| Learning Style | ~20 | نمط تعلّم | ضعيف علمياً (VAK) | منخفض | يُنصح بدمجه ضمن Learning DNA وإلغاء الاستقلالية |
| **Learning DNA** | 36 + 3 مهام | بصمة تعلّم | **عالٍ** | متوقع α≥0.80 | الأقوى منهجياً |
| **POIA** | 30 | أثر مهني | **عالٍ** | متوقع α≥0.78 | نقص norms مهنية عربية |
| Burnout (MBI-adapted) | ~22 | احتراق | معيار دولي | α موثّق | مرخّص؟ يحتاج توثيق |
| Wellbeing (WHO-5) | 5 | رفاه | معيار دولي | α موثّق | ممتاز |
| Career Anchors (Schein) | ~40 | مرتكزات | معيار دولي | α موثّق | جيد |
| Emotional Intelligence | ~28 | EI | متوسط | غير منشور | لا يوجد سيناريوهات SJT |
| Career Readiness | ~25 | جاهزية | متوسط | غير منشور | بدون مقارنة بسوق فعلي |
| Skills Gap | متغير | فجوة مهارات | عالٍ | n/a | يعتمد على labor-market.ts المحدود |
| Clarity Check | ~15 | وضوح | متوسط | منخفض | أسئلة Likert فقط |
| 360 Review | ~20 | تقييم محيط | عالٍ سياقياً | n/a | جيد لكن يحتاج anti-bias prompts |

### مشاكل عرضية مكتشفة
- **تكرار**: Learning Style و Cognitive Profile و Learning DNA يقيسون أبعاداً متداخلة → **توصية**: دمج تحت "Learning DNA" واعتبار الأولين legacy.
- **تحيّز محتمل**: Career Type Assessment يستخدم صياغات ذكورية في بعض البنود (مراجعة لغوية مطلوبة).
- **انحياز ثقافي**: بعض بنود RIASEC مترجمة حرفياً ("Investigative" → "تحقيقي") تحتاج localization لا translation.

---

## رابعاً: تقييم المسارات المهنية

| المسار | تغطية المنصة | الفجوة |
|---|---|---|
| الوظيفي (جاهزية/استقرار/قيادة) | ✅ career-readiness, career-growth, review360 | لا يوجد تقييم قيادي مخصص (LJI/MLQ) |
| ريادة الأعمال | ⚠️ career-type جزئي | لا يوجد Entrepreneurial Intent Scale، ولا تقييم تحمّل المخاطر |
| العمل الحر | ❌ غائب كمسار مخصّص | لا يوجد تقييم استقلالية + إدارة وقت + تسويق ذاتي |
| الاستثمار | ❌ غائب | لا يوجد Risk Tolerance Questionnaire |
| المسار الهجين | ❌ غائب | لا يوجد محرّك يقترح "موظف + عمل حر" بناءً على ملف الفرد |

**توصية حرجة**: إضافة **مسار 7: نمط العمل الأمثل (Work Mode Fit)** يجمع: ميول + تحمّل مخاطر + استقلالية + التزامات أسرية → يخرج بتوصية (موظف / حر / مختلط / ريادي / مستثمر).

---

## خامساً: قاعدة بيانات المهن

- الحجم الحالي: **~20 مهنة** في \`poia_occupations\` + قاعدة \`specializations.json\`.
- **مقارنة**:

| المعيار | عدد المهن | متاح في بوصلة |
|---|---|---|
| O*NET | 923 | ❌ |
| ESCO | 3,008 | ❌ |
| ISCO-08 | 436 (4-digit) | ❌ |
| SOC 2018 | 867 | ❌ |
| CIP 2020 (تخصصات) | 2,225 | جزئي |

**أولوية قصوى**: استيراد crosswalk بين ISCO-08 ↔ O*NET ↔ ESCO ↔ المهن السعودية (SUNCC). الهدف: 800+ مهنة مع رواتب وآفاق نمو محلية.

---

## سادساً: التوجيه التعليمي

- ✅ \`academic-major.tsx\` يقترح تخصصات (Holland-based).
- ⚠️ لا يوجد ربط حيّ بقواعد جامعات (KSA/UAE/EG).
- ❌ لا يوجد ربط مع شهادات مهنية (PMP, CFA, AWS…).
- ❌ سلسلة "التعليم → المهنة → الدخل → المستقبل" ناقصة في النهاية (Income & Future Outlook).

**توصية**: جدول \`majors_to_careers\` يربط CIP ↔ O*NET ↔ متوسط راتب + معدل نمو 10 سنوات.

---

## سابعاً: خوارزمية التوصية

**الحالي**:
- Holland scores → matching مع قائمة مهن ثابتة.
- POIA scores → benchmarks لكل مهنة.
- Global Advisor → يستدعي Gemini مع كل التقارير كسياق.

**التقييم**:
- Explainability: **6/10** — التقرير يشرح، لكن الأوزان غير مكشوفة.
- Fairness: **7/10** — لا يوجد audit للتحيّز حسب الجنس/العمر.
- Transparency: **5/10** — المستخدم لا يرى "لماذا هذه المهنة؟" بصرياً.
- Bias risk: متوسط (نموذج Gemini قد يعكس انحيازات تدريبية).

**خوارزمية مقترحة (V2)**:
\`\`\`
Match(user, occupation) =
  0.30·Interest(RIASEC cosine)
  + 0.20·Skills(gap inverse)
  + 0.15·Values(Schein anchors)
  + 0.10·Personality(Big5 fit)
  + 0.10·Wellbeing(POIA·PI·CFS)
  + 0.10·Market(local demand index)
  + 0.05·Sharia(filter, not weight)
\`\`\`
مع **SHAP-like explainer** يعرض مساهمة كل بعد.

---

## ثامناً: الذكاء الاصطناعي

**الحالي**: Global Advisor + Learning Coach + POIA report + Career Twin → 4 موديولات AI تستخدم Gemini مع system prompt متخصص + guardrails موحّدة.

**الحكم**: **مستشار حقيقي** وليس شات — يقرأ ملفات المستخدم ويبني سياقاً. **تقييم: 84/100**.

**فجوات**:
- لا يوجد **ذاكرة طويلة المدى** (كل استدعاء يبدأ من الصفر مع السياق).
- لا يوجد **tool-calling** فعلي (المستشار لا يستطيع تنفيذ إجراءات).
- لا يوجد **streaming** في معظم المسارات (تجربة بطيئة).
- غياب **evaluations** مؤتمتة لجودة الردود.

---

## تاسعاً وعاشراً: UX / UI / Accessibility

**UX**: 79/100
- ✅ \`/start\` ممتاز كقمع.
- ✅ Autosave في الاختبارات الطويلة.
- ⚠️ غياب "خريطة تقدّم شاملة" تربط كل التقييمات.
- ⚠️ بعض التقارير طويلة جداً بدون TOC (Table of Contents).

**UI**: 78/100
- ✅ هوية بصرية أنيقة (gold + primary، خط Serif عربي).
- ⚠️ تباين بعض النصوص الثانوية على dark mode قد يقل عن WCAG AA.

**Accessibility**:
- ✅ RTL أصيل، lang="ar" مضبوط، semantic HTML.
- ⚠️ أيقونات بدون aria-label في بعض الأماكن (Header, ThemeToggle).
- ⚠️ Stroop test يعتمد على اللون فقط → فشل WCAG 1.4.1.
- ❌ لا يوجد skip-to-content link.

---

## الحادي عشر: التقارير

**نقاط قوة**: التقارير منظمة بأقسام، تستخدم رادار + sparklines، تشمل خطة 90 يوم.

**فجوات**:
1. لا يوجد **PDF export احترافي** (موجود certificate.functions لكن للشهادات فقط).
2. لا يوجد **مشاركة عبر رابط آمن** بصلاحيات (موجود share.functions جزئي).
3. التوصيات نصية أحياناً بدون **Call-to-Action** واضح ("احجز كوتش / ابدأ هذا الكورس").

---

## الثاني عشر: المحتوى

- ✅ مقالات /resources جيدة (GROW, CV writing, career change).
- ⚠️ بعض الصفحات قصيرة لـ SEO (<400 كلمة).
- ❌ لا يوجد **مدوّنة منتظمة** أو case studies.
- ❌ لا يوجد محتوى للوالدين/المعلمين (موجود parent-dashboard كأداة فقط).

---

## الثالث عشر: قياس الأثر المهني والصحي

**88/100** — هذا أقوى ما في المنصة بعد إطلاق POIA و Wellbeing و Burnout.
- ✅ يقيس: رضا، احتراق، QWL، استدامة، CFS، WHO-5.
- ⚠️ ينقص: أثر مالي مباشر، أثر أسري (موجود ضمنياً)، أثر اجتماعي (relationships).

---

## الرابع عشر: التوافق الشرعي والأخلاقي

**92/100** — متفوّق بوضوح.
- ✅ ai-guardrails.ts يمنع التنجيم/الأبراج/الطاقة/MBTI/Manifestation.
- ✅ يرفض المهن المحرّمة (ربا، خمور، قمار…).
- ✅ ShariaNotice + ClinicalDisclaimer + EmergencyHelpline موجودة.
- ⚠️ ينقص: مجلس استشاري شرعي معلَن (للمصداقية المؤسسية).

---

## الخامس عشر: التحول المهني

- ✅ career-change.tsx, career-growth.tsx, sector-guide.tsx.
- ⚠️ ينقص: محرّك "Bridge Roles" يقترح وظائف انتقالية بين قطاعين.
- ⚠️ ينقص: حاسبة "تكلفة التحوّل" (وقت + مال + مخاطرة).

---

## السادس عشر: التحليلات ولوحات التحكم

| اللوحة | الحالة |
|---|---|
| /my-assessments | ✅ جيدة |
| /poia-dashboard | ✅ ممتازة (sparklines + alerts) |
| /learning-dna-dashboard | ✅ رادار + تتبّع زمني |
| /institutions.dashboard | ⚠️ بسيطة جداً — تحتاج Cohort analytics |
| /parent-dashboard | ⚠️ مبدئية |
| /counselor-crm | ⚠️ تحتاج funnel + retention metrics |

---

## السابع عشر: التقييم التقني

| البعد | الحكم |
|---|---|
| Stack | TanStack Start + Lovable Cloud — حديث وملائم |
| Performance | جيد (Vite 7 + SSR)؛ لم تُقَس Web Vitals فعلياً |
| Security | RLS مفعّلة، GRANT صريح، ai-guardrails؛ ✅ |
| Scalability | جيد للمرحلة الحالية، يحتاج caching للتقارير الكبيرة |
| SEO | ✅ head() لكل route، sitemap.xml موجود |
| Mobile | ✅ Tailwind responsive، RTL يعمل |
| Observability | ⚠️ لا يوجد APM (Sentry/PostHog) ظاهر |

---

## الثامن عشر: المقارنة العالمية

| المنصة | تتفوّق علينا في | نتفوّق عليها في |
|---|---|---|
| **O*NET** (US) | قاعدة 923 مهنة + norms | اللغة العربية + AI + شرعي |
| **CareerExplorer** | UX سلس + 800+ مهنة + تقرير PDF | عمق نفس-مهني + POIA |
| **MyNextMove** | بساطة + sponsorship حكومي | تكامل بين أدوات متعددة |
| **Prospects UK** | محتوى مقالات ضخم + جامعات | AI سياقي |
| **CareerOneStop** | بيانات سوق عمل حيّة (BLS) | تجربة شخصية موحّدة |

**ما يجب إضافته لنصبح عالميين**: قاعدة مهن معيارية + بيانات سوق حيّة + اعتماد سيكومتري + EN كامل + Mobile app.

---

## التاسع عشر: الميزة التنافسية

**UVP المقترح**:
> "بوصلة — أوّل منصّة عربية تجمع 14 تقييماً نفس-مهنياً موثّقاً مع مستشار AI سياقي وضوابط شرعية، لتمنحك قراراً مهنياً واضحاً في 30 دقيقة."

- **نقاط تميّز حقيقية**: POIA + Learning DNA + Career Twin + Sharia AI guardrails.
- **نقاط قابلة للتقليد**: الاختبارات النمطية (RIASEC, MBI).
- **فرص ابتكار**: Hybrid Career Engine، Family Career Council، Career Twin v2 (مع simulator).

---

## العشرون: التقرير النهائي والـ Roadmap

### أهم 15 نقطة ضعف (مرتّبة)
1. قاعدة مهن صغيرة بدون crosswalk دولي.
2. غياب norms عربية لكل اختبار.
3. لا يوجد تحقّق سيكومتري منشور.
4. غياب EN كامل.
5. تكرار بين Learning Style / Cognitive Profile / Learning DNA.
6. لا يوجد مسار "Work Mode Fit" (موظف/حر/ريادي/مستثمر).
7. لا يوجد PDF export احترافي للتقارير.
8. لوحة المؤسسات بسيطة.
9. Stroop يعتمد لون فقط (WCAG).
10. غياب bridge roles + حاسبة تكلفة تحوّل.
11. لا يوجد streaming AI في المسارات الطويلة.
12. لا يوجد APM/Observability.
13. غياب Cohort analytics للمدارس/الجامعات.
14. لا يوجد API عامة للمؤسسات.
15. غياب اعتماد رسمي (ISO 10667 / BPS).

### أهم 15 فرصة (مرتّبة بالأثر)
1. استيراد O*NET/ESCO crosswalk → +900 مهنة.
2. دراسة تحقّق سيكومتري عربية (n=1000) → اعتماد BPS.
3. مسار Work Mode Fit + Hybrid Engine.
4. تطبيق Mobile (React Native + نفس backend).
5. لوحة Cohort للمؤسسات مع تصدير CSV/Excel.
6. PDF تقارير احترافي + توقيع رقمي.
7. ربط بيانات سوق سعودي حيّة (HRSD / Taqat APIs).
8. Marketplace كوتشينج (commission model).
9. اشتراك B2B سنوي للمدارس/الجامعات.
10. توسّع EN ثم FR للسوق المغاربي.
11. Career Simulator (ماذا لو غيّرت مسارك؟).
12. مجلس شرعي استشاري معلَن.
13. Plugin LMS (Moodle/Blackboard) للجامعات.
14. Telegram/WhatsApp bot للمستشار.
15. شراكة مع وزارة الموارد البشرية السعودية.

### Quick Wins (أسبوع)
- إضافة aria-label لكل الأيقونات + skip-link.
- TOC تلقائي في تقارير /report/$code.
- إصلاح Stroop ليُضيف اسم اللون نصياً (لا يعتمد لون فقط).
- إخفاء Learning Style كـ legacy وتوجيه لـ Learning DNA.
- Confidence Band مرئي في كل مؤشر POIA / Learning DNA.

### Mid-Term (3 أشهر)
- استيراد 500 مهنة من O*NET/ESCO + جدول crosswalk.
- محرّك توصية V2 مع SHAP explainer.
- مسار Work Mode Fit + Hybrid.
- PDF export احترافي.
- لوحة Cohort للمؤسسات.
- Sentry + PostHog.
- streaming لكل ردود AI.

### Strategic (سنة)
- دراسة سيكومترية + اعتماد BPS/ISO 10667.
- نسخة EN كاملة + Mobile app.
- Marketplace كوتشينج.
- Plugin LMS + Telegram/WhatsApp.
- شراكات حكومية (HRSD / NCCC / SUNCC).
- Career Simulator + ذاكرة طويلة للمستشار AI.

### Gap Analysis ملخّصة

| البعد | الآن | المستهدف 12 شهراً | الفجوة |
|---|---|---|---|
| عدد المهن | 20 | 900 | 880 |
| اختبارات معتمدة دولياً | 0 | 3 (POIA, LDNA, CFS) | 3 |
| لغات | AR | AR + EN + FR | 2 |
| مؤسسات مشتركة | <10 | 50 | 40 |
| Cohort analytics | لا | نعم | كامل |
| Mobile | لا | iOS + Android | كامل |
| اعتماد | لا | ISO 10667 + BPS | كامل |

---

## الخاتمة

بوصلة منصّة **استثنائية في النطاق العربي**، تجمع عمقاً نفس-مهنياً نادراً مع التزام شرعي وذكاء اصطناعي سياقي. الفجوة الفاصلة بينها وبين المنصات العالمية ليست في الفكرة أو الأدوات، بل في:
1. **حجم قاعدة المهن**،
2. **التحقّق السيكومتري الرسمي**،
3. **التغطية اللغوية**،
4. **العمق المؤسسي**.

تنفيذ Roadmap أعلاه يضع المنصة في **المرتبة الأولى عربياً** خلال 12 شهراً، ويُهيّئها للمنافسة العالمية خلال 24–36 شهراً.

— نهاية التقرير —
`;
