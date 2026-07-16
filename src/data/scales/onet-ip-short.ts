// O*NET Interest Profiler — Short Form (60 items)
// Source: U.S. Department of Labor, Employment and Training Administration.
// Rounds, J., Su, R., Lewis, P., & Rivkin, D. (2010). O*NET Interest Profiler Short Form.
// License: PUBLIC DOMAIN (U.S. Government work). Free to reproduce, translate, and modify.
// Arabic translation: prepared by Bosla team — culturally adapted, experimental (not yet normed).

export const ONET_IP_SOURCE = {
  name: "O*NET Interest Profiler — Short Form (60 items)",
  authors: "U.S. Department of Labor / Rounds et al. (2010)",
  license: "Public Domain (U.S. Government)",
  arabicStatus: "ترجمة عربية تجريبية — لم تُقنّن بعد",
  url: "https://www.onetcenter.org/IP.html",
} as const;

// 5-point Likert (from "Strongly Dislike" to "Strongly Like")
export const ONET_SCALE = [
  { v: 1, l: "لا أحبّ إطلاقًا" },
  { v: 2, l: "لا أحبّ" },
  { v: 3, l: "محايد" },
  { v: 4, l: "أحبّ" },
  { v: 5, l: "أحبّ كثيرًا" },
] as const;

// R=Realistic, I=Investigative, A=Artistic, S=Social, E=Enterprising, C=Conventional
export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC_LABELS: Record<RiasecCode, { ar: string; desc: string }> = {
  R: { ar: "الواقعي (Realistic)", desc: "العمل بالأدوات والآلات، الأنشطة العملية واليدوية والخارجية." },
  I: { ar: "الاستقصائي (Investigative)", desc: "البحث العلمي، تحليل المشكلات، فهم الظواهر." },
  A: { ar: "الفني (Artistic)", desc: "التعبير الإبداعي، الفنون، الكتابة، التصميم." },
  S: { ar: "الاجتماعي (Social)", desc: "مساعدة الآخرين وتعليمهم وتقديم الخدمة الإنسانية." },
  E: { ar: "المُغامر/القيادي (Enterprising)", desc: "الإقناع، القيادة، الأعمال والمبيعات وإدارة المشاريع." },
  C: { ar: "التقليدي/المنظّم (Conventional)", desc: "العمل المنظّم بالبيانات والأرقام والإجراءات الدقيقة." },
};

export type OnetItem = { id: string; text: string; code: RiasecCode };

// 10 items per RIASEC code × 6 = 60
export const ONET_ITEMS: OnetItem[] = [
  // Realistic
  { id: "R1", code: "R", text: "بناء أثاث خشبي." },
  { id: "R2", code: "R", text: "إصلاح محرّك سيارة." },
  { id: "R3", code: "R", text: "زراعة نباتات في حديقة." },
  { id: "R4", code: "R", text: "قيادة شاحنة أو رافعة." },
  { id: "R5", code: "R", text: "تركيب أجهزة كهربائية." },
  { id: "R6", code: "R", text: "العمل في موقع إنشاء." },
  { id: "R7", code: "R", text: "إصلاح تسريب في أنبوب مياه." },
  { id: "R8", code: "R", text: "تجميع قطع إلكترونية." },
  { id: "R9", code: "R", text: "العمل في مزرعة أو حظيرة." },
  { id: "R10", code: "R", text: "قيادة قارب أو طائرة." },
  // Investigative
  { id: "I1", code: "I", text: "دراسة تكوين النجوم والكواكب." },
  { id: "I2", code: "I", text: "إجراء تجربة علمية في مختبر." },
  { id: "I3", code: "I", text: "تحليل بيانات إحصائية معقدة." },
  { id: "I4", code: "I", text: "البحث في أسباب مرض معيّن." },
  { id: "I5", code: "I", text: "دراسة سلوك الحيوانات في بيئتها." },
  { id: "I6", code: "I", text: "حلّ مسائل رياضية صعبة." },
  { id: "I7", code: "I", text: "كتابة برنامج حاسوبي لحلّ مشكلة." },
  { id: "I8", code: "I", text: "دراسة آثار قديمة وتاريخها." },
  { id: "I9", code: "I", text: "قراءة أبحاث علمية متخصّصة." },
  { id: "I10", code: "I", text: "تطوير نظرية جديدة." },
  // Artistic
  { id: "A1", code: "A", text: "الرسم أو التصوير الفني." },
  { id: "A2", code: "A", text: "كتابة قصص أو روايات." },
  { id: "A3", code: "A", text: "تصميم أزياء أو إعلانات." },
  { id: "A4", code: "A", text: "العزف على آلة موسيقية." },
  { id: "A5", code: "A", text: "التمثيل في مسرحية أو فيلم." },
  { id: "A6", code: "A", text: "تصميم ديكور داخلي." },
  { id: "A7", code: "A", text: "كتابة الشعر أو نصوص إبداعية." },
  { id: "A8", code: "A", text: "تصميم واجهات مواقع أو تطبيقات." },
  { id: "A9", code: "A", text: "تصوير فوتوغرافي فنّي." },
  { id: "A10", code: "A", text: "إخراج فيلم قصير." },
  // Social
  { id: "S1", code: "S", text: "تدريس مادة في مدرسة." },
  { id: "S2", code: "S", text: "تقديم استشارة نفسية لشخص." },
  { id: "S3", code: "S", text: "التطوّع لمساعدة المحتاجين." },
  { id: "S4", code: "S", text: "تدريب فريق رياضي للأطفال." },
  { id: "S5", code: "S", text: "العناية بمريض في المستشفى." },
  { id: "S6", code: "S", text: "تنظيم أنشطة اجتماعية لكبار السنّ." },
  { id: "S7", code: "S", text: "توجيه مجموعة شباب." },
  { id: "S8", code: "S", text: "التوسّط في نزاع بين طرفين." },
  { id: "S9", code: "S", text: "تعليم لغة لأشخاص جدد." },
  { id: "S10", code: "S", text: "العمل في هلال أحمر أو إغاثة." },
  // Enterprising
  { id: "E1", code: "E", text: "إدارة متجر أو مطعم." },
  { id: "E2", code: "E", text: "تسويق منتج جديد." },
  { id: "E3", code: "E", text: "التفاوض على عقد تجاري." },
  { id: "E4", code: "E", text: "قيادة فريق عمل نحو هدف." },
  { id: "E5", code: "E", text: "بيع سيارات أو عقارات." },
  { id: "E6", code: "E", text: "بدء شركة ناشئة خاصّة بك." },
  { id: "E7", code: "E", text: "إلقاء خطاب أمام جمهور." },
  { id: "E8", code: "E", text: "الترشّح لمنصب قيادي." },
  { id: "E9", code: "E", text: "الترويج لفكرة أو حملة." },
  { id: "E10", code: "E", text: "إدارة استثمار مالي." },
  // Conventional
  { id: "C1", code: "C", text: "تنظيم ملفات ومستندات." },
  { id: "C2", code: "C", text: "مسك دفاتر محاسبية." },
  { id: "C3", code: "C", text: "إدخال بيانات في نظام حاسوبي." },
  { id: "C4", code: "C", text: "تدقيق حسابات شركة." },
  { id: "C5", code: "C", text: "متابعة مخزون مستودع." },
  { id: "C6", code: "C", text: "إعداد تقارير دورية بأرقام." },
  { id: "C7", code: "C", text: "العمل ككاتب في مكتب." },
  { id: "C8", code: "C", text: "تنظيم جداول ومواعيد." },
  { id: "C9", code: "C", text: "معالجة معاملات بنكية." },
  { id: "C10", code: "C", text: "أرشفة سجلات طبية." },
];
