/**
 * ============================================================================
 *  بوصلة · Bawsala — محرك الدمج التشخيصي
 *  Unified Diagnostic → Disciplines Matching Engine
 * ----------------------------------------------------------------------------
 *  Version : 1.0
 *  يربط مخرجات المنظومة التشخيصية الرباعية بقاعدة التخصصات الأكاديمية:
 *    · اختبار الميول RIASEC ............ 35%
 *    · التقييم الشخصي (السمات الخمس) ... 25%
 *    · تحليل الدرجات AGAF v1.0 ......... 20%  (المجموعات الست S/H/L/E/T/C)
 *    · الطموحات المصرّح بها ............. 20%
 *  + بوابة GSCCI الصلبة: التخصص المحظور جوهرياً يُستبعد مهما ارتفعت درجاته،
 *    والمحل خلاف معتبر يُسقَّف دون نطاق «الإشارة القوية» ويُعلَّم بوجوب
 *    اعتماد هيئة شرعية رسمية قبل التوصية النهائية.
 *  ملف مستقل بلا استيرادات — معرّفات الحقول تطابق academic_disciplines.ts.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Input types (مخرجات الاختبارات الأربعة)
// ---------------------------------------------------------------------------

/** درجات هولاند 0–100 */
export interface RiasecProfile { R: number; I: number; A: number; S: number; E: number; C: number; }

/** مخرج AGAF: درجة كل مجموعة معرفية 0–100 + المجموعات محل تعارض (أداء مرتفع × نفور مُصرَّح) */
export interface AgafOutput {
  scores: { S: number; H: number; L: number; E: number; T: number; C: number };
  /** مجموعات رُصد فيها تعارض؛ تُخفَّض مساهمتها 50% وفق منطق AGAF */
  conflicts: Array<"S" | "H" | "L" | "E" | "T" | "C">;
}

/** السمات الخمس الكبرى 0–100 (St = الاتزان الانفعالي = عكس العصابية) */
export interface PersonalityProfile { O: number; Cn: number; Ex: number; A: number; St: number; }

/** الطموحات: فئات و/أو حقول مختارة + كلمات حرة */
export interface Ambitions { categories: string[]; fieldIds: string[]; keywords: string[]; }

export interface DiagnosticInput {
  riasec: RiasecProfile;
  personality: PersonalityProfile;
  agaf: AgafOutput;
  ambitions: Ambitions;
}

// ---------------------------------------------------------------------------
// GSCCI banding
// ---------------------------------------------------------------------------

export type GscciBand = "compliant" | "conditional" | "contested" | "prohibited";

export const GSCCI_LABELS: Record<GscciBand, { ar: string; color: string }> = {
  compliant:   { ar: "متوافق",                 color: "#166534" },
  conditional: { ar: "متوافق بضوابط",           color: "#B45309" },
  contested:   { ar: "محل خلاف — يتطلب هيئة",   color: "#9D174D" },
  prohibited:  { ar: "محظور جوهرياً",           color: "#7F1D1D" },
};

// ---------------------------------------------------------------------------
// Field profiles — ملف تعريف مطابقة لكل مجال في academic_disciplines.ts
//   r: أوزان RIASEC [R,I,A,S,E,C]   a: أوزان AGAF [S,H,L,E,T,C]
//   p: أوزان السمات {O,Cn,Ex,A,St}  g: تصنيف GSCCI (+ ملاحظة)
// ---------------------------------------------------------------------------

export interface FieldProfile {
  fieldId: string;
  category: string;
  r: [number, number, number, number, number, number];
  a: [number, number, number, number, number, number];
  p: { O: number; Cn: number; Ex: number; A: number; St: number };
  g: GscciBand;
  gNote?: string;
}

export const FIELD_PROFILES: FieldProfile[] = [
  // ── الإنسانيات ──
  { fieldId: "performing_arts", category: "humanities", r: [.05,.05,.6,.2,.1,0], a: [0,.1,.15,0,.05,.7], p: {O:.45,Cn:.1,Ex:.3,A:.1,St:.05}, g: "contested", gNote: "الموسيقى والتمثيل والرقص محل خلاف فقهي معتبر — التصنيف مبدئي ويتطلب اعتماد هيئة شرعية رسمية" },
  { fieldId: "visual_arts", category: "humanities", r: [.15,.05,.6,.05,.1,.05], a: [0,.1,.1,.05,.15,.6], p: {O:.45,Cn:.2,Ex:.1,A:.1,St:.15}, g: "conditional", gNote: "تصوير ذوات الأرواح ونحتها محل تفصيل؛ الخط والزخرفة والتصميم الوظيفي متوافقة" },
  { fieldId: "history", category: "humanities", r: [.05,.45,.15,.25,.05,.05], a: [.05,.6,.2,0,.05,.1], p: {O:.35,Cn:.3,Ex:.05,A:.15,St:.15}, g: "compliant" },
  { fieldId: "languages_literature", category: "humanities", r: [0,.2,.4,.3,.05,.05], a: [0,.2,.65,0,.05,.1], p: {O:.4,Cn:.25,Ex:.1,A:.15,St:.1}, g: "compliant" },
  { fieldId: "philosophy", category: "humanities", r: [0,.55,.25,.15,.05,0], a: [.1,.55,.25,0,.05,.05], p: {O:.5,Cn:.2,Ex:.05,A:.1,St:.15}, g: "conditional", gNote: "مدارس فلسفية بعينها تحتاج تحصيناً عقدياً؛ الدراسة النقدية المؤصلة متوافقة" },
  { fieldId: "religious_studies", category: "humanities", r: [0,.35,.05,.45,.1,.05], a: [0,.6,.3,0,.05,.05], p: {O:.25,Cn:.3,Ex:.15,A:.2,St:.1}, g: "compliant" },
  // ── العلوم الاجتماعية ──
  { fieldId: "psychology", category: "social_sciences", r: [0,.4,.05,.45,.05,.05], a: [.25,.55,.1,.05,0,.05], p: {O:.3,Cn:.2,Ex:.1,A:.25,St:.15}, g: "compliant" },
  { fieldId: "sociology_anthro", category: "social_sciences", r: [0,.4,.1,.4,.05,.05], a: [.05,.65,.15,.1,0,.05], p: {O:.35,Cn:.2,Ex:.1,A:.25,St:.1}, g: "compliant" },
  { fieldId: "economics", category: "social_sciences", r: [0,.4,0,.1,.3,.2], a: [.15,.15,.05,.6,.05,0], p: {O:.25,Cn:.35,Ex:.1,A:.05,St:.25}, g: "conditional", gNote: "المسار التقليدي يتضمن مقررات ربوية؛ مسار الاقتصاد الإسلامي متوافق كلياً" },
  { fieldId: "political_science", category: "social_sciences", r: [0,.35,.05,.3,.25,.05], a: [0,.6,.2,.15,0,.05], p: {O:.3,Cn:.2,Ex:.25,A:.1,St:.15}, g: "compliant" },
  { fieldId: "geography", category: "social_sciences", r: [.2,.4,.05,.15,.05,.15], a: [.35,.4,.05,.05,.1,.05], p: {O:.3,Cn:.3,Ex:.1,A:.1,St:.2}, g: "compliant" },
  { fieldId: "area_studies", category: "social_sciences", r: [0,.4,.1,.3,.15,.05], a: [0,.6,.3,.05,0,.05], p: {O:.4,Cn:.2,Ex:.15,A:.15,St:.1}, g: "compliant" },
  // ── العلوم الطبيعية ──
  { fieldId: "physics", category: "natural_sciences", r: [.2,.6,.05,0,.05,.1], a: [.75,0,0,.05,.2,0], p: {O:.35,Cn:.3,Ex:0,A:.05,St:.3}, g: "compliant" },
  { fieldId: "chemistry", category: "natural_sciences", r: [.25,.55,0,.05,.05,.1], a: [.8,0,0,0,.2,0], p: {O:.25,Cn:.4,Ex:0,A:.05,St:.3}, g: "compliant" },
  { fieldId: "biology", category: "natural_sciences", r: [.2,.6,0,.1,0,.1], a: [.85,.05,0,0,.1,0], p: {O:.3,Cn:.35,Ex:0,A:.1,St:.25}, g: "compliant" },
  { fieldId: "earth_sciences", category: "natural_sciences", r: [.35,.5,0,0,.05,.1], a: [.8,.05,0,0,.15,0], p: {O:.3,Cn:.3,Ex:.05,A:.05,St:.3}, g: "compliant" },
  { fieldId: "space_sciences", category: "natural_sciences", r: [.15,.65,.05,0,.05,.1], a: [.8,.05,0,0,.15,0], p: {O:.4,Cn:.3,Ex:0,A:.05,St:.25}, g: "compliant" },
  // ── العلوم الصورية ──
  { fieldId: "mathematics", category: "formal_sciences", r: [.05,.65,.05,0,.05,.2], a: [.75,0,0,.15,.1,0], p: {O:.3,Cn:.35,Ex:0,A:0,St:.35}, g: "compliant" },
  { fieldId: "statistics_actuarial", category: "formal_sciences", r: [0,.55,0,0,.15,.3], a: [.55,0,0,.35,.1,0], p: {O:.2,Cn:.45,Ex:0,A:.05,St:.3}, g: "conditional", gNote: "اكتواريات التأمين التجاري محل خلاف؛ المسار التكافلي والمعاشات متوافق — يُحال المتنازع فيه للهيئة" },
  { fieldId: "computer_science", category: "formal_sciences", r: [.2,.5,.1,0,.05,.15], a: [.35,0,0,.05,.6,0], p: {O:.35,Cn:.3,Ex:0,A:.05,St:.3}, g: "compliant" },
  { fieldId: "logic_systems", category: "formal_sciences", r: [0,.65,.05,.05,.05,.2], a: [.4,.35,.1,.05,.1,0], p: {O:.4,Cn:.3,Ex:0,A:.05,St:.25}, g: "compliant" },
  // ── العلوم التطبيقية ──
  { fieldId: "engineering", category: "applied_sciences", r: [.45,.35,.05,0,.05,.1], a: [.45,0,0,.05,.5,0], p: {O:.25,Cn:.4,Ex:.05,A:.05,St:.25}, g: "compliant" },
  { fieldId: "agriculture_food", category: "applied_sciences", r: [.5,.3,0,.05,.05,.1], a: [.6,.05,0,.05,.3,0], p: {O:.2,Cn:.4,Ex:.05,A:.15,St:.2}, g: "compliant" },
  { fieldId: "architecture_planning", category: "applied_sciences", r: [.25,.2,.4,0,.05,.1], a: [.3,.05,0,.05,.3,.3], p: {O:.4,Cn:.35,Ex:.05,A:.05,St:.15}, g: "compliant" },
  { fieldId: "environment_energy", category: "applied_sciences", r: [.35,.4,0,.1,.05,.1], a: [.6,.1,0,.05,.25,0], p: {O:.3,Cn:.3,Ex:.05,A:.15,St:.2}, g: "compliant" },
  // ── المهن والخدمات ──
  { fieldId: "medicine_health", category: "professions", r: [.15,.45,0,.3,0,.1], a: [.8,.1,0,0,.05,.05], p: {O:.2,Cn:.35,Ex:.1,A:.2,St:.15}, g: "compliant" },
  { fieldId: "sports_kinesiology", category: "professions", r: [.5,.15,.05,.25,.05,0], a: [.35,.15,0,0,.1,.4], p: {O:.15,Cn:.3,Ex:.3,A:.15,St:.1}, g: "conditional", gNote: "أصل النشاط الرياضي مشروع؛ تُراعى الضوابط في بعض السياقات الاحترافية" },
  { fieldId: "business", category: "professions", r: [0,.15,.05,.15,.45,.2], a: [.05,.05,.05,.75,.1,0], p: {O:.2,Cn:.3,Ex:.3,A:.1,St:.1}, g: "conditional", gNote: "المصرفية والتمويل التقليديان محل تحفظ؛ البدائل الإسلامية والمسارات الإدارية العامة متوافقة" },
  { fieldId: "law", category: "professions", r: [0,.35,.05,.2,.3,.1], a: [0,.5,.35,.1,0,.05], p: {O:.25,Cn:.35,Ex:.2,A:.05,St:.15}, g: "compliant" },
  { fieldId: "forensic_sciences", category: "professions", r: [.25,.55,0,.05,.05,.1], a: [.7,.15,0,0,.15,0], p: {O:.25,Cn:.4,Ex:0,A:.05,St:.3}, g: "compliant" },
  { fieldId: "education", category: "professions", r: [0,.15,.1,.55,.15,.05], a: [.1,.5,.25,0,.05,.1], p: {O:.25,Cn:.25,Ex:.2,A:.25,St:.05}, g: "compliant" },
  { fieldId: "media_communication", category: "professions", r: [0,.15,.35,.25,.2,.05], a: [0,.25,.45,.1,.05,.15], p: {O:.35,Cn:.15,Ex:.3,A:.1,St:.1}, g: "conditional", gNote: "يخضع المحتوى للضوابط؛ الإعلام الهادف والصحافة والاتصال المؤسسي متوافقة" },
  { fieldId: "social_public_services", category: "professions", r: [0,.1,0,.6,.2,.1], a: [0,.6,.15,.2,0,.05], p: {O:.2,Cn:.25,Ex:.2,A:.3,St:.05}, g: "compliant" },
  // ── البينية وإضافات ISCED ──
  { fieldId: "interdisciplinary_bio", category: "interdisciplinary", r: [.1,.6,.05,.1,0,.15], a: [.65,.05,0,0,.3,0], p: {O:.4,Cn:.3,Ex:0,A:.05,St:.25}, g: "compliant" },
  { fieldId: "interdisciplinary_socio_tech", category: "interdisciplinary", r: [.05,.45,.15,.2,.05,.1], a: [.2,.4,.1,.05,.25,0], p: {O:.45,Cn:.2,Ex:.1,A:.1,St:.15}, g: "compliant" },
  { fieldId: "hospitality_tourism", category: "isced", r: [.3,.05,.1,.35,.15,.05], a: [.05,.2,.15,.2,.2,.2], p: {O:.2,Cn:.25,Ex:.35,A:.15,St:.05}, g: "conditional", gNote: "الضيافة والسياحة تخضع لضوابط المحتوى والخدمة؛ الأصل فيها الإباحة والسياحة الحلال متوافقة كلياً" },
  { fieldId: "personal_care_services", category: "isced", r: [.45,0,.2,.2,.1,.05], a: [0,.1,.05,.15,.15,.55], p: {O:.25,Cn:.3,Ex:.25,A:.15,St:.05}, g: "conditional", gNote: "خدمات التجميل مباحة بضوابط الستر والاختلاط ومكوّنات المنتجات" },
  { fieldId: "security_safety", category: "isced", r: [.55,.15,0,.15,.1,.05], a: [.2,.2,.05,.1,.4,.05], p: {O:.1,Cn:.45,Ex:.15,A:.15,St:.15}, g: "compliant" },
  { fieldId: "transport_services", category: "isced", r: [.55,.15,0,.1,.15,.05], a: [.15,.1,.1,.2,.4,.05], p: {O:.1,Cn:.45,Ex:.15,A:.1,St:.2}, g: "compliant" },
];

// مثال توضيحي لآلية البوابة الصلبة: مهن محظورة جوهرياً (ليست تخصصات أكاديمية
// في القاعدة الحالية لكنها موثقة لاكتمال الآلية واختبارها)
export const HARD_GATED_EXAMPLES: FieldProfile[] = [
  { fieldId: "_example_gambling_ops", category: "professions", r: [0,0,0,0,.6,.4], a: [0,0,0,.8,.2,0], p: {O:.2,Cn:.3,Ex:.3,A:.1,St:.1}, g: "prohibited", gNote: "إدارة المقامرة محظورة جوهرياً — تُستبعد مهما ارتفعت درجات التوافق (البوابة الصلبة)" },
];

// ---------------------------------------------------------------------------
// Scoring engine
// ---------------------------------------------------------------------------

export const WEIGHTS = { riasec: 0.35, personality: 0.25, agaf: 0.20, ambitions: 0.20 } as const;

/** نطاقات قوة الإشارة وفق AGAF v1.0 */
export function signalBand(score: number): { ar: string; en: string } {
  if (score >= 80) return { ar: "إشارة قوية", en: "strong" };
  if (score >= 60) return { ar: "إشارة معتدلة", en: "moderate" };
  if (score >= 40) return { ar: "إشارة ضعيفة", en: "weak" };
  return { ar: "غير كافية", en: "insufficient" };
}

const RIASEC_KEYS = ["R", "I", "A", "S", "E", "C"] as const;
const AGAF_KEYS = ["S", "H", "L", "E", "T", "C"] as const;

function riasecScore(user: RiasecProfile, w: FieldProfile["r"]): number {
  // مجموع مرجّح لدرجات المستخدم على أوزان الحقل (0–100)
  return RIASEC_KEYS.reduce((s, k, i) => s + user[k] * w[i], 0);
}

function agafScore(agaf: AgafOutput, w: FieldProfile["a"]): number {
  return AGAF_KEYS.reduce((s, k, i) => {
    const conflictPenalty = agaf.conflicts.includes(k) ? 0.5 : 1; // منطق AGAF: التعارض يخفّض المساهمة
    return s + agaf.scores[k] * conflictPenalty * w[i];
  }, 0);
}

function personalityScore(p: PersonalityProfile, w: FieldProfile["p"]): number {
  return p.O * w.O + p.Cn * w.Cn + p.Ex * w.Ex + p.A * w.A + p.St * w.St;
}

function ambitionScore(fieldId: string, category: string, amb: Ambitions, names: string[]): number {
  if (amb.fieldIds.includes(fieldId)) return 100;
  if (amb.categories.includes(category)) return 65;
  const hay = names.join(" ").toLowerCase();
  const kwHit = amb.keywords.some((k) => k && hay.includes(k.toLowerCase()));
  return kwHit ? 80 : 25; // قاعدة محايدة منخفضة عند غياب أي تصريح
}

// ---------------------------------------------------------------------------
// Recommendation output
// ---------------------------------------------------------------------------

export interface Recommendation {
  fieldId: string;
  score: number;              // 0–100 بعد البوابة
  rawScore: number;           // قبل أي تسقيف
  band: { ar: string; en: string };
  gscci: GscciBand;
  gscciNote?: string;
  excluded: boolean;          // البوابة الصلبة
  capped: boolean;            // تسقيف «محل الخلاف» دون نطاق الإشارة القوية
  requiresBoard: boolean;     // يتطلب اعتماد هيئة شرعية
  breakdown: { riasec: number; personality: number; agaf: number; ambitions: number };
}

/**
 * حساب التوصيات المرتبة.
 * @param fieldNames قاموس اختياري fieldId → [أسماء عربية/إنجليزية] لمطابقة كلمات الطموح
 * @param includeGateExamples تضمين الأمثلة المحظورة لاختبار البوابة
 */
export function computeRecommendations(
  input: DiagnosticInput,
  fieldNames: Record<string, string[]> = {},
  includeGateExamples = false
): Recommendation[] {
  const profiles = includeGateExamples ? [...FIELD_PROFILES, ...HARD_GATED_EXAMPLES] : FIELD_PROFILES;
  const recs = profiles.map((f): Recommendation => {
    const b = {
      riasec: riasecScore(input.riasec, f.r),
      personality: personalityScore(input.personality, f.p),
      agaf: agafScore(input.agaf, f.a),
      ambitions: ambitionScore(f.fieldId, f.category, input.ambitions, fieldNames[f.fieldId] ?? []),
    };
    const raw =
      b.riasec * WEIGHTS.riasec +
      b.personality * WEIGHTS.personality +
      b.agaf * WEIGHTS.agaf +
      b.ambitions * WEIGHTS.ambitions;

    // ── بوابة GSCCI ──
    const excluded = f.g === "prohibited";                 // البوابة الصلبة: لا يُرمَّم بالمتوسطات
    const capped = f.g === "contested" && raw >= 60;       // يُسقَّف دون نطاق الإشارة القوية/المعتدلة العليا
    const score = excluded ? 0 : capped ? 59 : Math.round(raw * 10) / 10;

    return {
      fieldId: f.fieldId,
      score,
      rawScore: Math.round(raw * 10) / 10,
      band: signalBand(score),
      gscci: f.g,
      gscciNote: f.gNote,
      excluded,
      capped,
      requiresBoard: f.g === "contested",
      breakdown: {
        riasec: Math.round(b.riasec * 10) / 10,
        personality: Math.round(b.personality * 10) / 10,
        agaf: Math.round(b.agaf * 10) / 10,
        ambitions: b.ambitions,
      },
    };
  });
  return recs.sort((x, y) => Number(x.excluded) - Number(y.excluded) || y.score - x.score);
}

export default computeRecommendations;
