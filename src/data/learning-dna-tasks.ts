// محفّزات اختبارات الأداء الفعلية لـ Learning DNA
// كلها خفيفة، تعمل داخل المتصفح بدون أجهزة خارجية.

// === 1) Memory Recall — 12 كلمة عربية شائعة ===
export const MEMORY_WORDS = [
  "قلم", "شجرة", "نهر", "كتاب", "جبل", "سحابة",
  "مفتاح", "قمر", "بحر", "نافذة", "وردة", "ساعة",
];
export const MEMORY_DISPLAY_MS = 12_000; // عرض 12 ثانية
export const MEMORY_TOTAL = MEMORY_WORDS.length;

// === 2) Focus / Stroop — كلمات ألوان عربية ===
// المهمة: انقر اللون الذي كُتبت به الكلمة (وليس معنى الكلمة).
// incongruent (المعنى ≠ اللون) تقيس مقاومة التشتت.
export type StroopColor = "أحمر" | "أخضر" | "أزرق" | "أصفر";
export const STROOP_COLORS: StroopColor[] = ["أحمر", "أخضر", "أزرق", "أصفر"];
export const STROOP_HEX: Record<StroopColor, string> = {
  "أحمر": "#dc2626",
  "أخضر": "#16a34a",
  "أزرق": "#2563eb",
  "أصفر": "#ca8a04",
};

export interface StroopTrial {
  word: StroopColor;     // الكلمة المعروضة
  color: StroopColor;    // لون الخط (الإجابة الصحيحة)
  congruent: boolean;
}

// 16 محاولة ثابتة (الترتيب يُخلَط في الواجهة) — متوازنة بين congruent / incongruent
export const STROOP_TRIALS: StroopTrial[] = [
  { word: "أحمر", color: "أحمر", congruent: true },
  { word: "أخضر", color: "أخضر", congruent: true },
  { word: "أزرق", color: "أزرق", congruent: true },
  { word: "أصفر", color: "أصفر", congruent: true },
  { word: "أحمر", color: "أخضر", congruent: false },
  { word: "أحمر", color: "أزرق", congruent: false },
  { word: "أخضر", color: "أحمر", congruent: false },
  { word: "أخضر", color: "أصفر", congruent: false },
  { word: "أزرق", color: "أحمر", congruent: false },
  { word: "أزرق", color: "أصفر", congruent: false },
  { word: "أصفر", color: "أخضر", congruent: false },
  { word: "أصفر", color: "أزرق", congruent: false },
  { word: "أحمر", color: "أصفر", congruent: false },
  { word: "أخضر", color: "أزرق", congruent: false },
  { word: "أزرق", color: "أخضر", congruent: false },
  { word: "أصفر", color: "أحمر", congruent: false },
];

// === 3) Problem Solving — 5 أسئلة منطقية مؤقتة ===
export interface ProblemQ {
  id: string;
  text: string;
  choices: string[];
  answerIndex: number;
  hint?: string;
}

export const PROBLEM_QUESTIONS: ProblemQ[] = [
  {
    id: "p1",
    text: "إذا كان كل (أ) هو (ب)، وكل (ب) هو (ج)، فأيُّ العبارات صحيحة بالضرورة؟",
    choices: ["كل (ج) هو (أ)", "كل (أ) هو (ج)", "بعض (أ) ليست (ج)", "لا علاقة بين (أ) و(ج)"],
    answerIndex: 1,
  },
  {
    id: "p2",
    text: "أكمل المتتالية: 2، 6، 12، 20، 30، ؟",
    choices: ["38", "40", "42", "44"],
    answerIndex: 2,
    hint: "الفروق: 4، 6، 8، 10، …",
  },
  {
    id: "p3",
    text: "خمسة عمّال يبنون جداراً في 10 أيام. كم يوماً يحتاج 10 عمّال لبناء نفس الجدار؟",
    choices: ["20", "10", "5", "2"],
    answerIndex: 2,
  },
  {
    id: "p4",
    text: "أيّ كلمة لا تنتمي للمجموعة؟",
    choices: ["مثلّث", "مربّع", "دائرة", "خماسي"],
    answerIndex: 2,
    hint: "ابحث عن خاصّية الأضلاع.",
  },
  {
    id: "p5",
    text: "إذا كان اليوم الأربعاء، فما اليوم الذي يلي بعد غدٍ بثلاثة أيام؟",
    choices: ["الأحد", "الإثنين", "السبت", "الثلاثاء"],
    answerIndex: 1,
  },
];

export const PROBLEM_TIME_MS = 120_000; // دقيقتان لكل المجموعة
