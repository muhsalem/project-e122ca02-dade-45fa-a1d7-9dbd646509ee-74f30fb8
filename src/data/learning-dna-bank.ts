// بنك أسئلة Learning DNA — البصمة التعليمية الشخصية
// 6 محاور × 30+ بُعد فرعي. Likert 5 موحَّد.
// المرجعية: Cognitive Load Theory, Metacognition, Self-Regulated Learning,
// Deliberate Practice, Growth Mindset, Spacing/Testing Effects, Dual Coding.

export type DnaAxis =
  | "input" | "processing" | "memory" | "attention" | "motivation" | "environment";

export type DnaDimension =
  // Input
  | "in_visual" | "in_auditory" | "in_reading" | "in_kinesthetic"
  | "in_observation" | "in_discussion" | "in_experiment"
  // Processing
  | "pr_analytic" | "pr_logical" | "pr_creative" | "pr_critical"
  | "pr_systemic" | "pr_inductive" | "pr_deductive"
  // Memory
  | "mem_short" | "mem_long" | "mem_recall" | "mem_association" | "mem_retention"
  // Attention
  | "at_duration" | "at_distraction" | "at_pressure" | "at_interrupt" | "at_deep"
  // Motivation
  | "mo_intrinsic" | "mo_extrinsic" | "mo_explore" | "mo_curiosity" | "mo_grit"
  // Environment
  | "en_solo" | "en_group" | "en_compete" | "en_collab" | "en_flex" | "en_structured";

export interface DnaItem {
  id: string;
  text: string;
  axis: DnaAxis;
  dimension: DnaDimension;
  reverse?: boolean;
}

export interface DnaSection {
  key: DnaAxis;
  title: string;
  intro: string;
  items: DnaItem[];
}

export const DNA_SECTIONS: DnaSection[] = [
  {
    key: "input",
    title: "أولاً: كيف تستقبل المعلومات",
    intro: "قنواتك المفضّلة لتلقّي المعرفة الجديدة (تفضيلات استكشافية لا تصنيف ثابت).",
    items: [
      { id: "in1", axis: "input", dimension: "in_visual", text: "أفهم الأفكار بسرعة أكبر عندما أراها في رسوم بيانية أو خرائط ذهنية." },
      { id: "in2", axis: "input", dimension: "in_auditory", text: "أتذكّر المعلومات أفضل عندما أستمع إليها (محاضرة، بودكاست)." },
      { id: "in3", axis: "input", dimension: "in_reading", text: "أُفضّل قراءة النصوص المكتوبة على مشاهدة شرحها." },
      { id: "in4", axis: "input", dimension: "in_kinesthetic", text: "أتعلّم بشكل أسرع عندما أُجرِّب بيدي وأطبّق عملياً." },
      { id: "in5", axis: "input", dimension: "in_observation", text: "أستفيد كثيراً من ملاحظة الخبراء وهم يعملون قبل أن أُجرِّب بنفسي." },
      { id: "in6", axis: "input", dimension: "in_discussion", text: "تَتَّضح لي الأفكار عندما أناقشها مع آخرين." },
      { id: "in7", axis: "input", dimension: "in_experiment", text: "أُحبّ التعلّم بالتجربة المباشرة حتى لو ارتكبت أخطاء." },
    ],
  },
  {
    key: "processing",
    title: "ثانياً: كيف تعالج المعلومات",
    intro: "أنماط تفكيرك السائدة عند مواجهة معلومة جديدة أو مشكلة.",
    items: [
      { id: "pr1", axis: "processing", dimension: "pr_analytic", text: "أُفكّك المشكلات الكبيرة إلى أجزاء صغيرة قبل حلّها." },
      { id: "pr2", axis: "processing", dimension: "pr_logical", text: "أعتمد على الخطوات المنطقية المتسلسلة في تفكيري." },
      { id: "pr3", axis: "processing", dimension: "pr_creative", text: "أقترح حلولاً غير تقليدية للمشكلات المألوفة." },
      { id: "pr4", axis: "processing", dimension: "pr_critical", text: "أُشكّك في المعلومة وأبحث عن دليلها قبل قبولها." },
      { id: "pr5", axis: "processing", dimension: "pr_systemic", text: "أرى كيف تتشابك الأجزاء وتؤثّر ببعضها داخل الصورة الكاملة." },
      { id: "pr6", axis: "processing", dimension: "pr_inductive", text: "أنطلق من أمثلة جزئية لأستنتج قاعدة عامة." },
      { id: "pr7", axis: "processing", dimension: "pr_deductive", text: "أنطلق من قاعدة عامة لتطبيقها على حالات مفردة." },
    ],
  },
  {
    key: "memory",
    title: "ثالثاً: ذاكرتك وتذكّرك",
    intro: "كيف تُخزِّن وتستدعي المعلومات.",
    items: [
      { id: "me1", axis: "memory", dimension: "mem_short", text: "أحتفظ بعدّة أرقام أو تعليمات في ذهني دون كتابة." },
      { id: "me2", axis: "memory", dimension: "mem_long", text: "أتذكّر تفاصيل تعلَّمتها قبل أشهر دون مراجعة كثيرة." },
      { id: "me3", axis: "memory", dimension: "mem_recall", text: "تخطر المعلومة المطلوبة على ذهني بسرعة عند الحاجة." },
      { id: "me4", axis: "memory", dimension: "mem_association", text: "أربط المعلومة الجديدة بشيء أعرفه مسبقاً لأحفظها." },
      { id: "me5", axis: "memory", dimension: "mem_retention", text: "ما أتعلّمه يبقى معي طويلاً، لا يتبخّر بعد الاختبار." },
    ],
  },
  {
    key: "attention",
    title: "رابعاً: تركيزك وانتباهك",
    intro: "قدرتك على التعمّق ومقاومة المشتّتات.",
    items: [
      { id: "at1", axis: "attention", dimension: "at_duration", text: "أستطيع التركيز في مهمّة واحدة لأكثر من 45 دقيقة دون كلل." },
      { id: "at2", axis: "attention", dimension: "at_distraction", text: "أُكمل عملي حتى لو حولي ضوضاء أو إشعارات." },
      { id: "at3", axis: "attention", dimension: "at_pressure", text: "أُؤدّي أفضل عندما تكون عليّ ضغوط زمنية." },
      { id: "at4", axis: "attention", dimension: "at_interrupt", text: "أعود بسرعة إلى تركيزي بعد أي مقاطعة." },
      { id: "at5", axis: "attention", dimension: "at_deep", text: "أدخل في حالة انغماس عميق (Deep Work) أثناء التعلّم." },
    ],
  },
  {
    key: "motivation",
    title: "خامساً: ما يحرّكك للتعلّم",
    intro: "الدوافع الداخلية والخارجية التي تشحنك.",
    items: [
      { id: "mo1", axis: "motivation", dimension: "mo_intrinsic", text: "أتعلَّم لأنّي أستمتع بذاتها لا لأجل مكافأة." },
      { id: "mo2", axis: "motivation", dimension: "mo_extrinsic", text: "الشهادات والترقيات والمكافآت تزيد حماسي للتعلّم." },
      { id: "mo3", axis: "motivation", dimension: "mo_explore", text: "أُحبّ استكشاف موضوعات جديدة دون هدف محدّد." },
      { id: "mo4", axis: "motivation", dimension: "mo_curiosity", text: "تُثيرني الأسئلة المفتوحة وأذهب وراء «لماذا» باستمرار." },
      { id: "mo5", axis: "motivation", dimension: "mo_grit", text: "أُكمل ما بدأتُه من تعلّم حتى لو تعقّد الأمر." },
    ],
  },
  {
    key: "environment",
    title: "سادساً: بيئتك المثالية للتعلّم",
    intro: "الإطار الذي تنتج فيه أفضل أداء تعليمي.",
    items: [
      { id: "en1", axis: "environment", dimension: "en_solo", text: "أُنجز أكثر عندما أتعلّم وحدي بهدوء." },
      { id: "en2", axis: "environment", dimension: "en_group", text: "أتعلّم بشكل أعمق ضمن مجموعة دراسية فعّالة." },
      { id: "en3", axis: "environment", dimension: "en_compete", text: "المنافسة الصحية ترفع أدائي." },
      { id: "en4", axis: "environment", dimension: "en_collab", text: "أستفيد من التعاون وحلّ المهام مع زملاء أكفاء." },
      { id: "en5", axis: "environment", dimension: "en_flex", text: "أحتاج جدولاً مرناً يسمح لي بتغيير الأوقات والمكان." },
      { id: "en6", axis: "environment", dimension: "en_structured", text: "أحتاج جدولاً مُنظَّماً وخطّة محدَّدة لأتعلّم بانتظام." },
    ],
  },
];

export const DNA_ALL_ITEMS: DnaItem[] = DNA_SECTIONS.flatMap((s) => s.items);

export const DIMENSION_LABELS: Record<DnaDimension, string> = {
  in_visual: "بصري", in_auditory: "سمعي", in_reading: "قرائي", in_kinesthetic: "عملي/حركي",
  in_observation: "بالملاحظة", in_discussion: "بالنقاش", in_experiment: "بالتجربة",
  pr_analytic: "تحليلي", pr_logical: "منطقي", pr_creative: "إبداعي", pr_critical: "نقدي",
  pr_systemic: "منظومي", pr_inductive: "استقرائي", pr_deductive: "استنباطي",
  mem_short: "ذاكرة قصيرة", mem_long: "ذاكرة طويلة", mem_recall: "سرعة الاستدعاء",
  mem_association: "الترابط الذهني", mem_retention: "الاحتفاظ",
  at_duration: "مدة التركيز", at_distraction: "مقاومة التشتت", at_pressure: "أداء تحت الضغط",
  at_interrupt: "إدارة المقاطعات", at_deep: "التعلّم العميق",
  mo_intrinsic: "دافع داخلي", mo_extrinsic: "دافع خارجي", mo_explore: "حب الاستكشاف",
  mo_curiosity: "الفضول", mo_grit: "المثابرة",
  en_solo: "فردي", en_group: "جماعي", en_compete: "تنافسي", en_collab: "تعاوني",
  en_flex: "مرن", en_structured: "منظّم",
};

export const AXIS_LABELS: Record<DnaAxis, string> = {
  input: "استقبال المعلومات",
  processing: "معالجة المعلومات",
  memory: "الذاكرة",
  attention: "التركيز",
  motivation: "الدافعية",
  environment: "البيئة التعليمية",
};
