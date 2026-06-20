// بنك أسئلة "قياس الأثر المهني والصحي للمهنة" (POIA)
// Likert 5 موحَّد عبر المنصة. كل سؤال يحمل subscale + reverse عند اللزوم.
// المصادر العلمية المُلهِمة (إعادة صياغة عربية بدون نسخ):
// MBI-GS, Oldenburg Burnout, UWES, JD-R, Karasek Demand-Control,
// WHOQOL-BREF, Holland RIASEC, Big Five, Schein Career Anchors.

export type PoiaSubscale =
  | "PI_productivity" | "PI_quality" | "PI_innovation" | "PI_leadership"
  | "PI_teamwork" | "PI_service" | "PI_impact"
  | "OH_physical" | "OH_mental" | "OH_social"
  | "BRI_exhaustion" | "BRI_cynicism" | "BRI_ineffic" | "BRI_intent"
  | "CSI_horizon" | "CSI_lifestyle" | "CSI_flex"
  | "CFS_personality" | "CFS_skills" | "CFS_values" | "CFS_interests" | "CFS_mission";

export interface PoiaItem {
  id: string;
  text: string;
  subscale: PoiaSubscale;
  reverse?: boolean;
}

export interface PoiaSection {
  key: string;
  title: string;
  intro?: string;
  items: PoiaItem[];
}

export const POIA_SECTIONS: PoiaSection[] = [
  {
    key: "impact",
    title: "أولاً: أثرك المهني على المؤسسة",
    intro: "كيف ترى مساهمتك الفعلية في العمل والفريق.",
    items: [
      { id: "pi1", subscale: "PI_productivity", text: "أُنجز ما يُتوقَّع منّي في الوقت المحدَّد بكفاءة." },
      { id: "pi2", subscale: "PI_quality", text: "جودة عملي تفوق المعايير المطلوبة عادةً." },
      { id: "pi3", subscale: "PI_innovation", text: "أقترح أفكاراً أو حلولاً مبتكرة تُحسِّن طريقة العمل." },
      { id: "pi4", subscale: "PI_leadership", text: "أتولّى المبادرة وأقود الآخرين عند الحاجة." },
      { id: "pi5", subscale: "PI_teamwork", text: "أتعاون بفعالية مع زملائي وأرفع روح الفريق." },
      { id: "pi6", subscale: "PI_service", text: "أتعامل مع العملاء/المستفيدين باحتراف وحرص على رضاهم." },
      { id: "pi7", subscale: "PI_impact", text: "أشعر أن وجودي يُحدِث فرقاً حقيقياً في مؤسستي." },
    ],
  },
  {
    key: "health",
    title: "ثانياً: أثر المهنة على صحّتك",
    intro: "صحّتك الجسدية والنفسية والاجتماعية بسبب عملك الحالي.",
    items: [
      { id: "oh1", subscale: "OH_physical", text: "ينتهي يومي المهني وأنا في حالة بدنية جيدة، لا منهك." },
      { id: "oh2", subscale: "OH_physical", text: "أعاني من آلام جسدية متكرّرة (ظهر، رقبة، مفاصل) بسبب عملي.", reverse: true },
      { id: "oh3", subscale: "OH_physical", text: "نومي منتظم وكافٍ خلال أيام العمل." },
      { id: "oh4", subscale: "OH_mental", text: "أشعر بالرضا النفسي عن عملي بشكل عام." },
      { id: "oh5", subscale: "OH_mental", text: "تنتابني مستويات عالية من القلق أو التوتر بسبب العمل.", reverse: true },
      { id: "oh6", subscale: "OH_mental", text: "أجد معنى وهدفاً في ما أقوم به مهنياً." },
      { id: "oh7", subscale: "OH_social", text: "وقتي مع أسرتي ومن أحبّ كافٍ وذو جودة." },
      { id: "oh8", subscale: "OH_social", text: "علاقاتي الاجتماعية تتأثر سلباً بضغط العمل.", reverse: true },
    ],
  },
  {
    key: "burnout",
    title: "ثالثاً: مؤشرات الاحتراق الوظيفي",
    intro: "مستوحى من MBI-GS — للفرز فقط لا للتشخيص.",
    items: [
      { id: "br1", subscale: "BRI_exhaustion", text: "أشعر باستنزاف عاطفي شديد في نهاية يوم العمل.", reverse: true },
      { id: "br2", subscale: "BRI_exhaustion", text: "أستيقظ صباحاً منهكاً ومُحبَطاً من فكرة الذهاب للعمل.", reverse: true },
      { id: "br3", subscale: "BRI_cynicism", text: "فقدت حماسي لعملي مقارنة بما كنت عليه سابقاً.", reverse: true },
      { id: "br4", subscale: "BRI_cynicism", text: "أصبحت أكثر برودة وأقلّ اهتماماً بمشاكل من حولي في العمل.", reverse: true },
      { id: "br5", subscale: "BRI_ineffic", text: "أشعر أنّ إنجازي وأثري الشخصي تراجَع مؤخراً.", reverse: true },
      { id: "br6", subscale: "BRI_intent", text: "أُفكّر جدياً في ترك وظيفتي/مهنتي الحالية.", reverse: true },
    ],
  },
  {
    key: "sustain",
    title: "رابعاً: استدامة المسار المهني",
    intro: "هل هذا المسار قابل للاستمرار خمس وعشر سنوات؟",
    items: [
      { id: "cs1", subscale: "CSI_horizon", text: "أتخيّل نفسي مستمرّاً في هذه المهنة بنجاح خلال 5 سنوات." },
      { id: "cs2", subscale: "CSI_horizon", text: "أتخيّل نفسي مستمرّاً في هذا المسار خلال 10 سنوات." },
      { id: "cs3", subscale: "CSI_lifestyle", text: "هذه المهنة منسجمة مع نمط الحياة الذي أريده." },
      { id: "cs4", subscale: "CSI_lifestyle", text: "يمكنني الاستمرار فيها مع تقدّمي في السنّ." },
      { id: "cs5", subscale: "CSI_flex", text: "تمنحني المهنة مرونة كافية للتكيّف مع تغيّرات حياتي." },
    ],
  },
  {
    key: "fit",
    title: "خامساً: توافق المهنة مع ذاتك",
    intro: "مدى انسجامها مع شخصيّتك ومهاراتك وقيمك واهتماماتك ورسالتك.",
    items: [
      { id: "cf1", subscale: "CFS_personality", text: "طبيعة هذا العمل تنسجم مع شخصيّتي." },
      { id: "cf2", subscale: "CFS_skills", text: "أستثمر أفضل مهاراتي وقدراتي فيه." },
      { id: "cf3", subscale: "CFS_values", text: "هذا العمل لا يتعارض مع قيمي الجوهرية." },
      { id: "cf4", subscale: "CFS_interests", text: "موضوع العمل يشدّ اهتمامي ولا يُملِّني." },
      { id: "cf5", subscale: "CFS_mission", text: "أرى أن هذه المهنة جزء من رسالتي في الحياة." },
    ],
  },
];

export const POIA_ALL_ITEMS: PoiaItem[] = POIA_SECTIONS.flatMap((s) => s.items);

// أسئلة سياقية (اختيارية، لا تدخل المعادلات)
export const POIA_CONTEXT_FIELDS = [
  { id: "ctx_role", label: "المسمى الوظيفي الحالي", placeholder: "مثال: مهندس برمجيات" },
  { id: "ctx_sector", label: "القطاع", placeholder: "تقنية، صحة، تعليم..." },
  { id: "ctx_hours", label: "متوسط ساعات العمل أسبوعياً", placeholder: "40" },
  { id: "ctx_mode", label: "نمط الدوام", placeholder: "حضوري / هجين / عن بُعد" },
] as const;
