# خطة دمج نظام "قياس الأثر المهني والصحي للمهنة" (POIA)

> ملاحظة مهمة: منصتك الحالية مبنية على **TanStack Start + Lovable Cloud (Supabase)** وليست Laravel. سأنفّذ النظام بنفس الـ stack الحالي حتى يندمج مع بقية الاختبارات (RIASEC، Big Five، Burnout، Wellbeing، Career Twin، التقرير الشامل…)، ويُعاد استخدام بنيتك السيكومترية (`src/lib/psychometrics.ts`) ومحرّك التقارير الذكي (`global-advisor.functions.ts`).

---

## 1) النطاق المُسلَّم في هذه المرحلة (V1)

أبني **مساراً متكاملاً واحداً** باسم **"قياس الأثر المهني والصحي"** يربط بين كل ما تطلبه عبر:

1. اختبار POIA موحّد (بنك أسئلة عربي/إنجليزي، Likert‑5، مع بنود عكسية).
2. محرّك تقييم يحسب 6 مؤشرات معيارية.
3. تقرير ذكي (Lovable AI / Gemini) يفسّر النتائج ويقترح مسارات.
4. لوحة مؤشرات شخصية + متابعة زمنية (sparkline لكل مؤشر).
5. مقارنة مهن (تبدأ ببذرة 20 مهنة شائعة، قابلة للتوسعة).
6. ربط النتائج بـ **توأم المسار** و **التقرير الشامل** و **اختبار الاحتراق** الموجودة.

ما لا أُسلّمه الآن (يُؤجَّل لمراحل لاحقة بطلب صريح): نظام اشتراكات جديد، PDF مخصّص للتقرير، Gamification، دعم EN كامل لواجهة الأسئلة (سأضع بنية i18n جاهزة فقط)، شهادات إتمام منفصلة.

---

## 2) المحاور والمؤشرات (المعادلات)

كل بند Likert 1–5. متوسط البنود ضمن المقياس الفرعي ثم `toPercent` (الموجود لديك).

| المؤشر | المدخلات | المعادلة |
|---|---|---|
| Professional Impact (PI) | إنتاجية، جودة، ابتكار، قيادة، تعاون، خدمة عملاء، أثر مؤسسي | متوسط مرجّح (القيادة والأثر المؤسسي ×1.2) |
| Occupational Health (OH) | صحة جسدية + نفسية + اجتماعية | (Phys×0.35 + Psych×0.4 + Social×0.25) |
| Burnout Risk (BRI) | إرهاق عاطفي، فقدان حماس، انخفاض إنجاز، نية ترك | **عكسي**: 100 − متوسط |
| Career Sustainability (CSI) | استمرار 5/10 سنوات، توافق نمط حياة، مرونة | متوسط مع عقوبة −15 إذا BRI<40 |
| Career Fit (CFS) | شخصية، مهارات، قيم، اهتمامات، رسالة | متوسط بسيط، يدمج RIASEC السابق إن وُجد |
| Quality of Work Life (QWL) | (PI + OH + (100−BRI) + CSI + CFS) / 5 | المجمَّع النهائي |

تصنيفات: ممتاز ≥80، جيد 65–79، متوسط 50–64، منخفض 35–49، حرج <35.

---

## 3) بنك الأسئلة (V1)

≈ **70 سؤالاً** موزعة:
- الأثر المهني: 14
- الصحة الجسدية: 8 — النفسية: 10 — الاجتماعية: 6
- الاحتراق: 8 (مستوحى من MBI/Oldenburg، صياغة عربية)
- الاستدامة: 7
- التوافق: 12 (شخصية/قيم/اهتمامات/رسالة)
- 5 بنود سياقية (ساعات العمل، نمط الدوام، الراتب التقديري، القطاع، المسمى)

تُخزَّن في ملف TS واحد `src/data/poia-bank.ts` مع `reverse` و `subscale` لكل بند، لتسهيل التحرير العلمي لاحقاً.

---

## 4) الملفات الجديدة / المعدَّلة

```text
src/
├── data/
│   └── poia-bank.ts                 # بنك الأسئلة + الميتاداتا
│   └── poia-occupations.ts          # 20 مهنة بذرة + متوسطات قياسية
├── lib/
│   ├── poia-scoring.ts              # حساب المؤشرات الستة + التصنيفات
│   └── poia.functions.ts            # createServerFn: submitPOIA, generatePOIAReport, listMyPOIA, compareOccupations
├── components/site/
│   ├── PoiaRadarChart.tsx           # رسم سداسي للمؤشرات (recharts)
│   └── PoiaTrendline.tsx            # متابعة زمنية
├── routes/
│   ├── poia.tsx                     # صفحة الاختبار (مقسّمة لأقسام، حفظ تقدم محلي)
│   ├── poia-dashboard.tsx           # لوحة المؤشرات الشخصية + المقارنات
│   └── poia-compare.tsx             # مقارنة المهن
└── routes/paths.tsx                 # إضافة المسار تحت "خريطة الاختبارات"
```

تعديلات صغيرة:
- `src/routes/report.$code.tsx` → عرض شارة POIA إن كان الاختبار من نوع poia.
- `src/lib/global-advisor.functions.ts` → يستهلك تلقائياً آخر تقرير POIA (لا تغيير في البرومبت، فقط البيانات مضمّنة).
- `src/lib/career-twin.functions.ts` → يقرأ مؤشرات POIA الأخيرة كسياق.
- `src/components/site/Header.tsx` → بند جديد "الأثر المهني والصحي".

---

## 5) قاعدة البيانات (Lovable Cloud / Supabase)

سأطلب migration واحدة (موافقتك مطلوبة):

```text
poia_submissions
  id, user_id, code (BSL-POIA-XXXX), answers jsonb, context jsonb,
  pi_score, oh_score, bri_score, csi_score, cfs_score, qwl_score,
  band text, ai_report text, created_at, updated_at
poia_occupations              -- بذرة قابلة للتوسعة
  id, name_ar, name_en, sector, avg_satisfaction, avg_pressure,
  avg_burnout, avg_income_band, avg_wlb, avg_health_impact, source
```

RLS:
- `poia_submissions`: المستخدم يقرأ/يكتب صفوفه فقط. service_role full.
- `poia_occupations`: anon SELECT (جدول مرجعي عام).

سيُكتب التقرير الذكي في `assessment_reports` بـ `stage='poia'` ليظهر في `/my-assessments` و`/report/$code` بنفس التجربة الحالية.

---

## 6) تجربة المستخدم

- صفحة `/poia` بأقسام منهجية (سياق → أثر → صحة → احتراق → استدامة → توافق) مع شريط تقدم و autosave (`use-autosave` الموجود).
- بعد الإرسال: انتقال إلى `/report/<code>` مع رادار + جدول المؤشرات + التقرير الذكي + زر "ضمّه للتقرير الشامل".
- لوحة `/poia-dashboard`: آخر نتائج + رسم زمني لكل مؤشر + تنبيهات إذا BRI≥65 (إحالة إلى wellbeing-check + EmergencyHelpline).
- مقارنة `/poia-compare`: المستخدم يختار حتى 3 مهن من جدول `poia_occupations` ويرى مؤشراته مقابل المتوسطات.

---

## 7) المعايير العلمية المرجعية

البنود مستلهمة (بإعادة صياغة عربية بدون نسخ) من: MBI-GS، Oldenburg Burnout، UWES، JD‑R، Karasek Demand‑Control، WHOQOL‑BREF، Holland RIASEC، Big Five، Gallup CliftonStrengths، Schein Career Anchors. تبقى الضوابط القيمية الحالية (لا قطاعات محرّمة، لا تشخيص طبي، الإحالة للمختص).

---

## 8) التحقق قبل التسليم

- بناء نظيف، لا أخطاء lint.
- اختبار يدوي: إرسال إجابات وهمية → ظهور التقرير → ظهوره في `/my-assessments` و`/global-advisor`.
- التحقق من RLS عبر `supabase--read_query`.

---

## 9) خطة تحقيق الدخل والتوسع (مختصرة، تُكتب داخل `/institutions` كنموذج B2B إضافي)

- **أفراد**: POIA مجاني نتيجة موجزة + اشتراك سنوي للتقرير الكامل ومتابعة زمنية.
- **شركات**: تقرير مجمّع مجهول الهوية (Wellbeing & Burnout Heatmap) للموارد البشرية، تسعير per‑seat.
- **حكومي/أكاديمي**: تراخيص مشروع لقياس الأثر المهني على القطاعات (مع تكامل ISCO‑08).
- توسع إقليمي: واجهة EN جاهزة + بنك أسئلة قابل للترجمة + بنك مهن لكل سوق.

---

## 10) ترتيب التنفيذ

1. Migration (`poia_submissions` + `poia_occupations` + بذرة 20 مهنة) — **يتطلب موافقتك**.
2. بنك الأسئلة + محرّك التقييم.
3. صفحة `/poia` + حفظ + توليد التقرير الذكي.
4. لوحة `/poia-dashboard` + مقارنة `/poia-compare`.
5. ربط Header + paths + تقرير شامل + توأم المسار.

هل تعتمد الخطة لأبدأ بالـ migration ثم التنفيذ؟
