# نظام Learning DNA — البصمة التعليمية الشخصية

> ملاحظة: المنصة الحالية مبنية على **TanStack Start + Lovable Cloud (Supabase)** وليست Laravel. سأبني النظام بنفس الـ stack ليندمج مع `learning-style`, `cognitive-profile`, `comprehensive-assessment`, `global-advisor`, POIA, و Career Twin.

## 1) نطاق V1 (المُسلَّم الآن)

مسار موحّد باسم **"Learning DNA — بصمة التعلم"** يتضمن:

1. **استبيان متعدد الأبعاد** (~60 بنداً Likert‑5) يغطي 6 محاور و30+ بُعداً فرعياً.
2. **3 اختبارات أداء فعلية** خفيفة في المتصفح (لا تتطلب أجهزة):
   - **Memory Recall** — عرض 12 كلمة/10 ثوانٍ ثم استدعاء فوري + استدعاء مؤجل بعد إكمال قسم آخر.
   - **Focus & Distraction** — مهمة Stroop مبسطة عربية (لون/كلمة) لقياس مقاومة التشتت وزمن الاستجابة.
   - **Problem Solving** — 5 ألغاز منطقية قصيرة مؤقتة (Raven-style + استنباط).
3. **محرّك تقييم** يحسب 10 مؤشرات معيارية ويبني خريطة الـ DNA.
4. **تقرير ذكي** (Lovable AI / Gemini) يفسّر النتائج + خطة تعلم شخصية + روتين يومي + توصية محتوى.
5. **لوحة شخصية** `/learning-dna-dashboard` مع رادار للمؤشرات وتتبع زمني.
6. **AI Learning Coach** — chat مخصص يقرأ نتائج المستخدم ويعطي تغذية راجعة (server fn، بدون streaming في V1).
7. ربط النتائج بـ Global Advisor و Career Twin و POIA (سياق إضافي).

**مؤجَّل** (يُطلب صراحةً لاحقاً): اشتراكات منفصلة، PDF مخصص، Gamification/شارات، EN كاملة، اختبارات أداء متقدمة (n-back, dual-task).

## 2) المحاور والأبعاد الـ30+

| المحور | الأبعاد الفرعية |
|---|---|
| استقبال المعلومات (Input) | بصري، سمعي، قرائي، عملي، مشاهدة، نقاش، تجربة |
| المعالجة (Processing) | تحليلي، منطقي، إبداعي، نقدي، منظومي، استقرائي، استنباطي |
| الذاكرة (Memory) | قصيرة المدى، طويلة المدى، سرعة الاستدعاء، الترابط، الاحتفاظ |
| التركيز (Attention) | مدة التركيز، مقاومة التشتت، الأداء تحت الضغط، إدارة المقاطعات، التعلم العميق |
| الدافعية (Motivation) | داخلي، خارجي، استكشاف، فضول، مثابرة |
| البيئة (Environment) | فردي، جماعي، تنافسي، تعاوني، مرن، منظم |

## 3) المؤشرات المركّبة (0–100)

- **LES** Learning Efficiency Score — مرجَّح من كل المحاور.
- **RET** Retention — (ذاكرة × أداء Memory test).
- **FOC** Focus — (انتباه × أداء Focus test).
- **PSS** Problem Solving — (معالجة × أداء Problem test).
- **LAS** Learning Agility — (إبداعي + استقرائي + سرعة الاستدعاء).
- **SLS** Self-Learning — (داخلي + فضول + مثابرة + فردي).
- **DLS** Deep Learning — (نقدي + منظومي + تركيز عميق).
- **InputProfile**, **ProcessingProfile**, **EnvProfile** — متجهات نسبية.

التصنيف: ممتاز ≥80، جيد 65–79، متوسط 50–64، يحتاج تطوير <50.

## 4) الملفات الجديدة

```
src/data/
  learning-dna-bank.ts          # ~60 سؤال + meta (محور، بُعد، reverse)
  learning-dna-tasks.ts         # محفّزات اختبارات الأداء (كلمات، Stroop، ألغاز)
src/lib/
  learning-dna-scoring.ts       # حساب الأبعاد والمؤشرات الـ10
  learning-dna.functions.ts     # submitLearningDna, listMyLearningDna, chatLearningCoach
src/components/site/
  MemoryRecallTask.tsx          # واجهة اختبار الذاكرة
  FocusStroopTask.tsx           # واجهة اختبار التركيز
  ProblemSolvingTask.tsx        # واجهة اختبار حل المشكلات
  LearningDnaRadar.tsx          # رادار سداسي/عشاري
src/routes/
  learning-dna.tsx              # مسار الاختبار (استبيان + 3 مهام)
  learning-dna-dashboard.tsx    # لوحة المؤشرات والخطة الشخصية
  learning-coach.tsx            # AI Learning Coach
```

تعديلات صغيرة: `paths.tsx` (إضافة المسار)، `global-advisor.functions.ts` (قراءة آخر DNA كسياق)، `Header.tsx`.

## 5) قاعدة البيانات (Lovable Cloud)

migration واحدة:

```
learning_dna_submissions
  id, user_id, code (LDNA-XXXX-XXXX),
  answers jsonb, task_results jsonb,
  dimension_scores jsonb,          -- 30+ بُعد
  les, ret, foc, pss, las, sls, dls (numeric),
  band text, ai_report text,
  created_at, updated_at

learning_coach_messages
  id, user_id, submission_id, role (user|assistant),
  content text, created_at
```

RLS: المستخدم يقرأ/يكتب صفوفه فقط. service_role كامل. GRANT صريح.
يُحفظ التقرير أيضاً في `assessment_reports` للظهور في `/my-assessments` و `/report/$code`.

## 6) تجربة المستخدم

- `/learning-dna`: 6 أقسام استبيان + 3 مهام أداء بشريط تقدم و autosave.
- بعد الإرسال: انتقال إلى `/report/<code>` مع رادار + جدول المؤشرات + خطة التعلم + روتين يومي + توصية محتوى.
- `/learning-dna-dashboard`: تتبع زمني + تنبيهات (مثلاً تركيز منخفض ← تمارين Pomodoro موجّهة).
- `/learning-coach`: chat بسيط يقرأ آخر DNA + رسائل سابقة ويرد بـ Gemini.

## 7) المرجعية العلمية

Bloom's & SOLO Taxonomies، Cognitive Load Theory (Sweller)، Metacognition (Flavell)، Self-Regulated Learning (Zimmerman)، Deliberate Practice (Ericsson)، Growth Mindset (Dweck)، Spacing/Testing Effects، Dual Coding. تجنّب التصنيف القاطع بأنماط VAK/Honey-Mumford كآلية تدريس (أُشير إليها كتفضيلات استكشافية فقط).

## 8) خطة الدخل والتوسع (تُضاف لاحقاً في `/institutions`)

- **أفراد**: ملخص مجاني + اشتراك سنوي للتقرير الكامل والمدرّب الذكي ومتابعة التطور.
- **مدارس/جامعات**: تقارير DNA مجمّعة (Cohort) لتوجيه أساليب التدريس، تسعير per-seat.
- **شركات L&D**: ربط بمؤشرات Skills Gap و POIA لتصميم برامج تدريب مخصصة.

## 9) ترتيب التنفيذ

1. Migration (`learning_dna_submissions` + `learning_coach_messages`) — **يتطلب موافقتك**.
2. بنك الأسئلة + محفّزات المهام + محرّك التقييم.
3. صفحة `/learning-dna` (استبيان + 3 مهام + تقرير ذكي).
4. لوحة `/learning-dna-dashboard`.
5. `/learning-coach` (AI Coach).
6. ربط Header + paths + Global Advisor.

هل تعتمد الخطة لأبدأ بالـ migration ثم التنفيذ؟
