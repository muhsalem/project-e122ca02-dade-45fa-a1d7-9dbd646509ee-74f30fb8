// VISA — Vocational Identity Status Assessment (30 items)
// Source: Porfeli, E. J., Lee, B., Vondracek, F. W., & Weigold, I. K. (2011).
// "A multi-dimensional measure of vocational identity status." Journal of Adolescence, 34(5), 853–871.
// License: Free for research and educational use (author permission for scholarly use).
// Arabic translation: prepared by Bosla team — experimental.

export const VISA_SOURCE = {
  name: "Vocational Identity Status Assessment (VISA, 30 items)",
  authors: "Porfeli, Lee, Vondracek & Weigold (2011)",
  license: "Open for research / educational use",
  arabicStatus: "ترجمة تجريبية — لم تُقنّن على العينة العربية بعد",
  url: "https://doi.org/10.1016/j.adolescence.2011.02.001",
} as const;

// 6 dimensions × 5 items = 30
// CE = Career Exploration in Breadth, CI = Career Exploration in Depth
// CC = Career Commitment, IC = Identification with Commitment
// CSC = Career Self-Doubt, CFC = Career Flexibility/Reconsideration
export type VisaDim = "CE" | "CI" | "CC" | "IC" | "CSC" | "CFC";

export const VISA_LABELS: Record<VisaDim, { ar: string; desc: string }> = {
  CE:  { ar: "الاستكشاف في الاتّساع", desc: "التعرّف على تخصصات ومهن متعددة." },
  CI:  { ar: "الاستكشاف في العمق", desc: "التعمّق في تخصص أو مهنة معيّنة تشدّك." },
  CC:  { ar: "الالتزام المهني", desc: "الشعور بالثبات على اختيار مهني معيّن." },
  IC:  { ar: "التماهي مع الاختيار", desc: "شعورك بأنّ اختيارك يعبّر عمّن أنت." },
  CSC: { ar: "الشكّ في المسار", desc: "قلق أو تردّد حيال المهنة التي اخترتها." },
  CFC: { ar: "المرونة/إعادة النظر", desc: "استعدادك لتغيير مسارك إذا لزم الأمر." },
};

export type VisaItem = { id: string; text: string; dim: VisaDim };

export const VISA_ITEMS: VisaItem[] = [
  // Career Exploration — Breadth
  { id: "CE1", dim: "CE", text: "أتحدّث مع أشخاص من مهن مختلفة لأتعرّف على خياراتي." },
  { id: "CE2", dim: "CE", text: "أقرأ عن مجالات مهنية متعدّدة." },
  { id: "CE3", dim: "CE", text: "أستطلع فرص عمل خارج مجال دراستي الحالي." },
  { id: "CE4", dim: "CE", text: "أُجرّب أنشطة جديدة لاكتشاف ما يناسبني مهنيًّا." },
  { id: "CE5", dim: "CE", text: "أبحث عن معلومات حول مهن لم أفكّر بها من قبل." },
  // Career Exploration — Depth
  { id: "CI1", dim: "CI", text: "أدرس بتعمّق مهنة معيّنة أفكّر في دخولها." },
  { id: "CI2", dim: "CI", text: "أسأل ممتهنين في مجال يشدّني عن تفاصيل عملهم." },
  { id: "CI3", dim: "CI", text: "أقارن بدقّة بين مسارات محدّدة داخل مجالي المفضّل." },
  { id: "CI4", dim: "CI", text: "أبحث عن متطلّبات دقيقة لمهنة أستهدفها." },
  { id: "CI5", dim: "CI", text: "أرى بوضوح ما ستتضمّنه المهنة التي أفكّر فيها يوميًّا." },
  // Career Commitment
  { id: "CC1", dim: "CC", text: "لديّ فكرة واضحة عن المهنة التي أريدها." },
  { id: "CC2", dim: "CC", text: "قرّرت مساري المهني." },
  { id: "CC3", dim: "CC", text: "أعرف بالضبط ما أريد أن أفعله في حياتي المهنية." },
  { id: "CC4", dim: "CC", text: "التزمت بمجال مهني محدّد." },
  { id: "CC5", dim: "CC", text: "قراري المهني مستقرّ." },
  // Identification with Commitment
  { id: "IC1", dim: "IC", text: "المهنة التي اخترتها تعبّر عمّا أنا عليه فعلاً." },
  { id: "IC2", dim: "IC", text: "أشعر بأنّ مساري المهني جزء من هويّتي." },
  { id: "IC3", dim: "IC", text: "أفتخر بالمهنة التي أتّجه نحوها." },
  { id: "IC4", dim: "IC", text: "اختياري المهني يتماشى مع قيمي." },
  { id: "IC5", dim: "IC", text: "أستطيع تخيّل نفسي بسعادة في هذا المسار." },
  // Career Self-Doubt
  { id: "CSC1", dim: "CSC", text: "أشعر بالقلق حين أفكّر في مستقبلي المهني." },
  { id: "CSC2", dim: "CSC", text: "أخشى أنّني اخترت المسار الخطأ." },
  { id: "CSC3", dim: "CSC", text: "لست متأكّدًا أنّ لديّ ما يلزم لهذه المهنة." },
  { id: "CSC4", dim: "CSC", text: "أتساءل كثيرًا هل خياري المهني صحيح." },
  { id: "CSC5", dim: "CSC", text: "أتردّد كلّما فكّرت في اتخاذ خطوة مهنية." },
  // Career Flexibility / Reconsideration
  { id: "CFC1", dim: "CFC", text: "مستعدّ لتغيير مساري إذا وجدت شيئًا أفضل." },
  { id: "CFC2", dim: "CFC", text: "قد أُعيد النظر في اختياري المهني في المستقبل." },
  { id: "CFC3", dim: "CFC", text: "من المرجّح أن أُجرّب مسارات جديدة خلال حياتي." },
  { id: "CFC4", dim: "CFC", text: "لا أتمسّك بمهنة واحدة إلى الأبد." },
  { id: "CFC5", dim: "CFC", text: "أفكّر أحيانًا في تحويل مسيرتي." },
];
