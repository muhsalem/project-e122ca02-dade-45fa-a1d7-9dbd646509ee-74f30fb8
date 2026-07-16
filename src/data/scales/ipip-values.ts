// Work Values items adapted from IPIP-JVIS-style value markers.
// Source: International Personality Item Pool (Goldberg, 1999) — https://ipip.ori.org
// License: PUBLIC DOMAIN. Free to use, translate, and modify.
// Arabic translation: prepared by Bosla team — experimental.
// Aligned with the six O*NET Work Values dimensions (public domain).

export const IPIP_VALUES_SOURCE = {
  name: "Work Values (IPIP + O*NET aligned, 24 items)",
  authors: "Goldberg (1999); O*NET Work Values (US DoL)",
  license: "Public Domain",
  arabicStatus: "ترجمة تجريبية — لم تُقنّن على العينة العربية بعد",
  url: "https://www.onetonline.org/find/descriptor/browse/Work_Values/",
} as const;

// Six O*NET work values
export type WorkValue =
  | "ACHIEVEMENT"    // الإنجاز
  | "INDEPENDENCE"   // الاستقلالية
  | "RECOGNITION"    // التقدير
  | "RELATIONSHIPS"  // العلاقات
  | "SUPPORT"        // الدعم
  | "WORKING";       // بيئة العمل

export const WORK_VALUES_LABELS: Record<WorkValue, { ar: string; desc: string }> = {
  ACHIEVEMENT:   { ar: "الإنجاز", desc: "استخدام قدراتك ورؤية نتائج ملموسة لعملك." },
  INDEPENDENCE:  { ar: "الاستقلالية", desc: "العمل بمفردك واتخاذ قراراتك الخاصة." },
  RECOGNITION:   { ar: "التقدير", desc: "التقدّم، المكانة، والاعتراف بجهدك." },
  RELATIONSHIPS: { ar: "العلاقات", desc: "خدمة الآخرين والعمل في بيئة ودّية غير تنافسية." },
  SUPPORT:       { ar: "الدعم", desc: "إشراف داعم من الإدارة وتوجيه واضح." },
  WORKING:       { ar: "بيئة العمل", desc: "استقرار الوظيفة، ظروف العمل، والتعويض." },
};

export type ValueItem = { id: string; text: string; value: WorkValue };

// 4 items × 6 values = 24
export const IPIP_VALUES_ITEMS: ValueItem[] = [
  // Achievement
  { id: "ACH1", value: "ACHIEVEMENT", text: "أرغب في وظيفة تسمح لي باستخدام قدراتي بالكامل." },
  { id: "ACH2", value: "ACHIEVEMENT", text: "من المهم أن أرى نتائج ملموسة لعملي." },
  { id: "ACH3", value: "ACHIEVEMENT", text: "أفضّل التحديات التي تُشعِرني بالإنجاز." },
  { id: "ACH4", value: "ACHIEVEMENT", text: "الشعور بالتقدّم في المهنة أهمّ لي من الراتب." },
  // Independence
  { id: "IND1", value: "INDEPENDENCE", text: "أُفضّل أن أقرّر بنفسي كيف أنجز عملي." },
  { id: "IND2", value: "INDEPENDENCE", text: "أرغب في وظيفة تمنحني حرية التصرّف." },
  { id: "IND3", value: "INDEPENDENCE", text: "أُبدع أكثر حين أعمل بمفردي." },
  { id: "IND4", value: "INDEPENDENCE", text: "أشعر بالضيق من الإشراف المكثّف." },
  // Recognition
  { id: "REC1", value: "RECOGNITION", text: "من المهم أن يُعترف بإنجازاتي علنًا." },
  { id: "REC2", value: "RECOGNITION", text: "أرغب في مسار مهني يوفّر ترقيات واضحة." },
  { id: "REC3", value: "RECOGNITION", text: "المكانة الوظيفية مهمّة لي." },
  { id: "REC4", value: "RECOGNITION", text: "أُقدّر أن يكون لعملي تأثير يراه الآخرون." },
  // Relationships
  { id: "REL1", value: "RELATIONSHIPS", text: "أرغب في زملاء أثق بهم وأشعر بالراحة معهم." },
  { id: "REL2", value: "RELATIONSHIPS", text: "من المهم أن يكون عملي مفيدًا للآخرين." },
  { id: "REL3", value: "RELATIONSHIPS", text: "أُفضّل بيئة تعاونية غير تنافسية." },
  { id: "REL4", value: "RELATIONSHIPS", text: "خدمة المجتمع من خلال عملي قيمة أساسية لي." },
  // Support
  { id: "SUP1", value: "SUPPORT", text: "أحتاج توجيهًا واضحًا من مديري." },
  { id: "SUP2", value: "SUPPORT", text: "أعمل أفضل حين تكون التوقّعات محدّدة." },
  { id: "SUP3", value: "SUPPORT", text: "أُقدّر تدريبًا وتوجيهًا مستمرًّا في العمل." },
  { id: "SUP4", value: "SUPPORT", text: "دعم الإدارة من أهمّ عوامل رضاي." },
  // Working Conditions
  { id: "WRK1", value: "WORKING", text: "استقرار الوظيفة عامل حاسم بالنسبة لي." },
  { id: "WRK2", value: "WORKING", text: "أُهمّ ببيئة العمل المريحة (مكان، جدول، معدّات)." },
  { id: "WRK3", value: "WORKING", text: "الراتب والمزايا من أولوياتي عند اختيار وظيفة." },
  { id: "WRK4", value: "WORKING", text: "التوازن بين العمل والحياة الشخصية أساسي لي." },
];
