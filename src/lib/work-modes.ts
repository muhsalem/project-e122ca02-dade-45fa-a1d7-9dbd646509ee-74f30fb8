// تقدير قابلية العمل في كل تخصص/صناعة كـ: موظف، مستقل (Freelance)، مؤسس شركة
// مبني على واقع السوق العربي + ISCO-08 + طبيعة المهنة (تنظيم/ترخيص، رأس مال، تكرار العملاء)

export type WorkModeLevel = "high" | "medium" | "low";

export type WorkModeInfo = { level: WorkModeLevel; tip: string };

export type WorkModes = {
  employee: WorkModeInfo;
  freelance: WorkModeInfo;
  founder: WorkModeInfo;
};

// خرائط بالـ Field ID (من specializations.json)
const FIELD_MAP: Record<string, WorkModes> = {
  sciences: {
    employee: { level: "high", tip: "مراكز أبحاث، جامعات، صناعات تحويلية وتحاليل." },
    freelance: { level: "low", tip: "استشارات بحثية محدودة وعقود مشاريع قصيرة." },
    founder: { level: "medium", tip: "Deep-Tech / مختبرات تحاليل تحتاج رأس مال وتراخيص." },
  },
  engineering: {
    employee: { level: "high", tip: "شركات مقاولات، طاقة، تصنيع، استشارات هندسية." },
    freelance: { level: "medium", tip: "استشارات تصميم/إشراف ضمن سجل المهندسين." },
    founder: { level: "high", tip: "مكاتب استشارية ومقاولات قابلة للنمو خليجيًا." },
  },
  medicine: {
    employee: { level: "high", tip: "مستشفيات حكومية وخاصة (الأكثر استقرارًا)." },
    freelance: { level: "medium", tip: "زيارات وعيادات تعاون بترخيص الهيئة الصحية." },
    founder: { level: "medium", tip: "عيادات/مراكز خاصة تتطلب تراخيص ورأس مال كبير." },
  },
  computing: {
    employee: { level: "high", tip: "أعلى الطلب — شركات تقنية، بنوك، حكومة." },
    freelance: { level: "high", tip: "أنسب مجال للعمل الحر عن بُعد عالميًا (Upwork/Toptal)." },
    founder: { level: "high", tip: "SaaS / تطبيقات تتوسّع برأس مال منخفض نسبيًا." },
  },
  social: {
    employee: { level: "medium", tip: "وزارات، منظمات تنموية، مراكز أبحاث، موارد بشرية." },
    freelance: { level: "medium", tip: "أبحاث ميدانية، تدريب، استشارات منظمات." },
    founder: { level: "medium", tip: "مراكز استشارات اجتماعية/منظمات غير ربحية." },
  },
  law: {
    employee: { level: "high", tip: "إدارات قانونية في شركات وبنوك وجهات حكومية." },
    freelance: { level: "medium", tip: "ممارسة مستقلة تتطلب قيدًا في نقابة المحامين." },
    founder: { level: "high", tip: "مكاتب محاماة شراكة — نموذج راسخ وعالي العائد." },
  },
  business: {
    employee: { level: "high", tip: "بنوك، شركات، Big 4، صناديق استثمار." },
    freelance: { level: "high", tip: "محاسبة، تسويق، استشارات إدارية عن بُعد." },
    founder: { level: "high", tip: "أنسب مجال لتأسيس شركات (تجارة/خدمات/مالية)." },
  },
  education: {
    employee: { level: "high", tip: "مدارس حكومية وخاصة وجامعات." },
    freelance: { level: "high", tip: "تدريس خاص ومنصات تعليم إلكتروني." },
    founder: { level: "medium", tip: "مدارس/مراكز تدريب تحتاج ترخيص تعليمي." },
  },
  arts: {
    employee: { level: "medium", tip: "إعلام، نشر، ترجمة، علاقات عامة." },
    freelance: { level: "high", tip: "ترجمة، تأليف، نسخ تسويقي — طلب دائم." },
    founder: { level: "medium", tip: "وكالات محتوى/ترجمة قابلة للنمو." },
  },
  agriculture: {
    employee: { level: "medium", tip: "وزارات، شركات أغذية، مراكز بحوث زراعية." },
    freelance: { level: "low", tip: "استشارات زراعية وبيطرية محدودة." },
    founder: { level: "high", tip: "مزارع، Agri-Tech، تصنيع غذائي — مدعوم في رؤية 2030." },
  },
  arts_fine: {
    employee: { level: "medium", tip: "قنوات إعلام، وكالات إعلان، استوديوهات." },
    freelance: { level: "high", tip: "تصميم، تصوير، مونتاج، صناعة محتوى رقمي." },
    founder: { level: "high", tip: "وكالات إبداعية واستوديوهات إنتاج صغيرة." },
  },
  islamic: {
    employee: { level: "high", tip: "أوقاف، هيئات شرعية، تعليم ديني، بنوك إسلامية." },
    freelance: { level: "medium", tip: "تدريس وفتوى ومراجعة شرعية بإجازة معتمدة." },
    founder: { level: "medium", tip: "مراكز تحفيظ/تدريب شرعي ومنصات محتوى ديني." },
  },
  services: {
    employee: { level: "high", tip: "فنادق، طيران، نوادي رياضية، ضيافة." },
    freelance: { level: "medium", tip: "مدرّب رياضي، مرشد سياحي، منظم فعاليات." },
    founder: { level: "high", tip: "وكالات سفر، نوادي، مطاعم — قطاع نمو سياحي." },
  },
};

// fallback عبر بادئة ISCO-08 (أول رقم = المجموعة الكبرى)
const ISCO_MAP: Record<string, WorkModes> = {
  // 1 — مدراء
  "1": {
    employee: { level: "high", tip: "أدوار قيادية في شركات ومؤسسات قائمة." },
    freelance: { level: "medium", tip: "استشارات إدارية وتدريب تنفيذي." },
    founder: { level: "high", tip: "خبرة إدارية = أساس قوي لتأسيس شركة." },
  },
  // 2 — مهنيون (هندسة، تقنية، صحة، تعليم)
  "2": {
    employee: { level: "high", tip: "الطلب الأعلى — شركات ومؤسسات قطاعية." },
    freelance: { level: "high", tip: "خبرة تقنية متخصصة قابلة للبيع كمشاريع." },
    founder: { level: "medium", tip: "ممكن — يحتاج شريكًا تجاريًا وتسويقًا." },
  },
  // 3 — فنيون ومساعدون
  "3": {
    employee: { level: "high", tip: "مصانع، مستشفيات، شركات خدمات تقنية." },
    freelance: { level: "medium", tip: "صيانة وتركيب وخدمات ميدانية." },
    founder: { level: "medium", tip: "ورش متخصصة أو شركات خدمات صغيرة." },
  },
  // 4 — كتبة ودعم إداري
  "4": {
    employee: { level: "high", tip: "وظائف إدارية مستقرة في كل القطاعات." },
    freelance: { level: "low", tip: "خيارات محدودة (مساعد افتراضي/إدخال بيانات)." },
    founder: { level: "low", tip: "غير شائع — يحتاج تخصصًا إضافيًا." },
  },
  // 5 — خدمات ومبيعات
  "5": {
    employee: { level: "high", tip: "تجزئة، ضيافة، أمن، رعاية شخصية." },
    freelance: { level: "medium", tip: "مبيعات بعمولة، تجميل، تدريب شخصي." },
    founder: { level: "high", tip: "مشاريع تجزئة وضيافة قابلة للتوسع." },
  },
  // 6 — مهارات زراعية
  "6": {
    employee: { level: "medium", tip: "مزارع كبرى وشركات إنتاج." },
    freelance: { level: "low", tip: "محدود — أعمال موسمية." },
    founder: { level: "high", tip: "مشاريع زراعية صغيرة ومتوسطة مدعومة." },
  },
  // 7 — حرفيون
  "7": {
    employee: { level: "medium", tip: "مقاولات، تصنيع، صيانة." },
    freelance: { level: "high", tip: "ورش حرفية ومقاولات فردية — طلب ثابت." },
    founder: { level: "high", tip: "ورشة → شركة مقاولات (نموذج كلاسيكي ناجح)." },
  },
  // 8 — مشغّلو آلات
  "8": {
    employee: { level: "high", tip: "مصانع، نقل، لوجستيات." },
    freelance: { level: "medium", tip: "نقل ولوجستيات بحسابك الخاص." },
    founder: { level: "medium", tip: "شركات نقل/شحن صغيرة." },
  },
  // 9 — مهن أوّلية
  "9": {
    employee: { level: "high", tip: "وظائف عمالية وفيرة لكن قليلة الأجر." },
    freelance: { level: "low", tip: "خيارات محدودة." },
    founder: { level: "low", tip: "غير مناسب لتأسيس شركة مباشرة." },
  },
};

const DEFAULT_MODES: WorkModes = {
  employee: { level: "high", tip: "متاح عبر المؤسسات والشركات في القطاع." },
  freelance: { level: "medium", tip: "ممكن للخبرات المتراكمة والمشاريع المتخصصة." },
  founder: { level: "medium", tip: "ممكن بشريك تجاري ودراسة جدوى واضحة." },
};

export function getWorkModesByField(fieldId: string | null | undefined): WorkModes {
  if (fieldId && FIELD_MAP[fieldId]) return FIELD_MAP[fieldId];
  return DEFAULT_MODES;
}

export function getWorkModesByIsco(isco: string | null | undefined): WorkModes {
  if (!isco) return DEFAULT_MODES;
  const prefix = isco.trim().charAt(0);
  return ISCO_MAP[prefix] ?? DEFAULT_MODES;
}

export const MODE_LABELS = {
  employee: { ar: "موظف", icon: "🏢" },
  freelance: { ar: "عمل حر / مستقل", icon: "🧑‍💻" },
  founder: { ar: "مؤسس شركة", icon: "🚀" },
} as const;

export const LEVEL_LABELS: Record<WorkModeLevel, { ar: string; cls: string }> = {
  high: {
    ar: "ملاءمة عالية",
    cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  medium: {
    ar: "ملاءمة متوسطة",
    cls: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  low: {
    ar: "ملاءمة محدودة",
    cls: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};
