// Emotional Intelligence items derived from the International Personality Item Pool (IPIP).
// Source: IPIP (Goldberg, L. R., 1999) — https://ipip.ori.org
// License: PUBLIC DOMAIN. Free to use, translate, and modify without permission.
// Arabic translation: prepared by Bosla team — experimental.

export const IPIP_EI_SOURCE = {
  name: "IPIP Emotional Intelligence (16 items, 4 facets)",
  authors: "Goldberg (1999) — IPIP",
  license: "Public Domain (IPIP)",
  arabicStatus: "ترجمة تجريبية — لم تُقنّن على العينة العربية بعد",
  url: "https://ipip.ori.org/",
} as const;

// SEA = Self-Emotion Appraisal, OEA = Others' Emotion Appraisal
// UOE = Use of Emotion, ROE = Regulation of Emotion
export type EiFacet = "SEA" | "OEA" | "UOE" | "ROE";

export const EI_LABELS: Record<EiFacet, { ar: string; desc: string }> = {
  SEA: { ar: "الوعي بمشاعري", desc: "فهم مشاعرك الخاصة والتعرّف عليها في اللحظة." },
  OEA: { ar: "الوعي بمشاعر الآخرين", desc: "قراءة مشاعر من حولك وفهم ما يشعرون به." },
  UOE: { ar: "توظيف المشاعر", desc: "استخدام مشاعرك بشكل بنّاء لتحفيز نفسك وتحقيق أهدافك." },
  ROE: { ar: "تنظيم المشاعر", desc: "التعافي من الانفعالات القوية والتحكم في ردود فعلك." },
};

export type EiItem = { id: string; text: string; facet: EiFacet; reverse?: boolean };

export const IPIP_EI_ITEMS: EiItem[] = [
  // Self-Emotion Appraisal (4)
  { id: "SEA1", facet: "SEA", text: "أعرف مشاعري في معظم الأوقات." },
  { id: "SEA2", facet: "SEA", text: "أفهم بسرعة سبب انزعاجي عند حدوثه." },
  { id: "SEA3", facet: "SEA", text: "أواجه صعوبة في تسمية ما أشعر به.", reverse: true },
  { id: "SEA4", facet: "SEA", text: "أخلط أحيانًا بين مشاعري المختلفة.", reverse: true },
  // Others' Emotion Appraisal (4)
  { id: "OEA1", facet: "OEA", text: "أستطيع قراءة مشاعر الآخرين من تعابير وجوههم." },
  { id: "OEA2", facet: "OEA", text: "ألاحظ حين يكون شخص مقرّب مني منزعجًا حتى قبل أن يقول." },
  { id: "OEA3", facet: "OEA", text: "أُفاجَأ حين أعرف أن شخصًا كان يشعر بشيء مختلف عمّا ظننت.", reverse: true },
  { id: "OEA4", facet: "OEA", text: "من الصعب عليّ فهم لماذا يتصرّف الناس كما يتصرّفون.", reverse: true },
  // Use of Emotion (4)
  { id: "UOE1", facet: "UOE", text: "أُحفّز نفسي بأن أستحضر شعورًا إيجابيًا." },
  { id: "UOE2", facet: "UOE", text: "أستطيع تحويل غضبي إلى طاقة للعمل." },
  { id: "UOE3", facet: "UOE", text: "أضيّع الوقت في التفكير بمشاعري دون أن أفعل شيئًا.", reverse: true },
  { id: "UOE4", facet: "UOE", text: "حين أفشل أستسلم بدلاً من المحاولة مجددًا.", reverse: true },
  // Regulation of Emotion (4)
  { id: "ROE1", facet: "ROE", text: "أستعيد هدوئي بسرعة بعد موقف صعب." },
  { id: "ROE2", facet: "ROE", text: "أتحكّم في مشاعري في المواقف الحرجة." },
  { id: "ROE3", facet: "ROE", text: "أنفعل بسرعة على أشياء صغيرة.", reverse: true },
  { id: "ROE4", facet: "ROE", text: "يبقى مزاجي السيّئ معي طويلاً.", reverse: true },
];
