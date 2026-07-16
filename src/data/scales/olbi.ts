// OLBI — Oldenburg Burnout Inventory (16 items)
// Original: Demerouti, E., Bakker, A. B., Vardakou, I., & Kantas, A. (2003).
// "The convergent validity of two burnout instruments: A multitrait-multimethod analysis."
// European Journal of Psychological Assessment, 19(1), 12–23.
// English validation: Halbesleben & Demerouti (2005), Work & Stress, 19(3), 208–220.
// License: Free for research and educational use (author permission granted for scientific use).
// Arabic translation: prepared by Bosla team — experimental, not yet normed on Arabic population.

export const OLBI_SOURCE = {
  name: "Oldenburg Burnout Inventory (OLBI)",
  authors: "Demerouti, Bakker, Vardakou & Kantas (2003)",
  license: "Open for research use",
  arabicStatus: "ترجمة تجريبية — لم تُقنّن على العينة العربية بعد",
  url: "https://psycnet.apa.org/record/2003-06070-002",
} as const;

// 4-point scale: 1=strongly disagree ... 4=strongly agree
export const OLBI_SCALE = [
  { v: 1, l: "لا أوافق إطلاقًا" },
  { v: 2, l: "لا أوافق" },
  { v: 3, l: "أوافق" },
  { v: 4, l: "أوافق تمامًا" },
] as const;

export type OlbiValue = 1 | 2 | 3 | 4;

// EX = Exhaustion (الإنهاك), DIS = Disengagement (الانفصال عن العمل)
// R = reverse-scored (positively worded items in the exhaustion/disengagement direction of health)
export type OlbiItem = { id: string; text: string; subscale: "EX" | "DIS"; reverse?: boolean };

export const OLBI_ITEMS: OlbiItem[] = [
  // Exhaustion (8)
  { id: "EX1", subscale: "EX", text: "هناك أيام أشعر فيها بالتعب حتى قبل أن أبدأ العمل." },
  { id: "EX2", subscale: "EX", text: "بعد يوم عمل، أحتاج وقتًا أطول من المعتاد لأستعيد نشاطي." },
  { id: "EX3", subscale: "EX", text: "أتحمّل جيدًا الضغط الذي يفرضه عملي.", reverse: true },
  { id: "EX4", subscale: "EX", text: "خلال عملي، أشعر أحيانًا بأنني مُنهَك عاطفيًا." },
  { id: "EX5", subscale: "EX", text: "بعد العمل، أشعر بأنني بحالة جيدة كافية للانخراط في أنشطة أخرى.", reverse: true },
  { id: "EX6", subscale: "EX", text: "بعد يوم عمل، أشعر عادةً بأنني مُتعَب ومُستَنزَف." },
  { id: "EX7", subscale: "EX", text: "أستطيع عادةً إدارة كمية عملي جيدًا.", reverse: true },
  { id: "EX8", subscale: "EX", text: "حين أعمل، أشعر عادةً بأنني حيوي وممتلئ بالطاقة.", reverse: true },
  // Disengagement (8)
  { id: "DIS1", subscale: "DIS", text: "أجد دائمًا معانٍ جديدة ومثيرة للاهتمام في عملي.", reverse: true },
  { id: "DIS2", subscale: "DIS", text: "صرت أتحدث عن عملي بطريقة سلبية أكثر فأكثر." },
  { id: "DIS3", subscale: "DIS", text: "أحيانًا أشعر بالضجر والغثيان من مهام عملي." },
  { id: "DIS4", subscale: "DIS", text: "منذ أن بدأت في هذه الوظيفة، تلاشى اهتمامي بعملي." },
  { id: "DIS5", subscale: "DIS", text: "أشعر بارتباط قوي بنوع العمل الذي أقوم به.", reverse: true },
  { id: "DIS6", subscale: "DIS", text: "هذا هو النوع الوحيد من العمل الذي أستطيع تخيل نفسي أقوم به.", reverse: true },
  { id: "DIS7", subscale: "DIS", text: "أشعر بمزيد من الاندفاع والحماس تجاه عملي.", reverse: true },
  { id: "DIS8", subscale: "DIS", text: "أحيانًا أشعر بالاشمئزاز من مهام عملي." },
];
