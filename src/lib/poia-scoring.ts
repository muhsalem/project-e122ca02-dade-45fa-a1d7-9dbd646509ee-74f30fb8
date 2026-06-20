// محرّك حساب مؤشرات POIA الستة.
import { scoreSubscale, toPercent } from "./psychometrics";
import { POIA_ALL_ITEMS, POIA_SECTIONS, type PoiaSubscale } from "@/data/poia-bank";

export type PoiaScores = {
  pi: number;        // Professional Impact 0-100
  oh: number;        // Occupational Health 0-100
  bri: number;       // Burnout Risk 0-100 (أعلى = أخطر)
  csi: number;       // Career Sustainability 0-100
  cfs: number;       // Career Fit 0-100
  qwl: number;       // Quality of Work Life 0-100
  band: PoiaBand;
  subscales: Record<PoiaSubscale, number>; // 1-5 averages
};

export type PoiaBand = "ممتاز" | "جيد" | "متوسط" | "منخفض" | "حرج";

function bandFromScore(s: number): PoiaBand {
  if (s >= 80) return "ممتاز";
  if (s >= 65) return "جيد";
  if (s >= 50) return "متوسط";
  if (s >= 35) return "منخفض";
  return "حرج";
}

function avgPercent(subscaleAvgs: number[]): number {
  const valid = subscaleAvgs.filter((v) => v > 0);
  if (valid.length === 0) return 0;
  const a = valid.reduce((s, v) => s + v, 0) / valid.length;
  return toPercent(a);
}

function weightedAvgPercent(parts: { avg: number; weight: number }[]): number {
  const valid = parts.filter((p) => p.avg > 0);
  if (valid.length === 0) return 0;
  const totalW = valid.reduce((s, p) => s + p.weight, 0);
  const w = valid.reduce((s, p) => s + p.avg * p.weight, 0) / totalW;
  return toPercent(w);
}

export function calculatePoia(
  answers: Record<string, number | undefined>,
): PoiaScores {
  // 1. حساب متوسط كل subscale (Likert 1-5)
  const allSubs = new Set<PoiaSubscale>();
  POIA_ALL_ITEMS.forEach((it) => allSubs.add(it.subscale));

  const subscales = {} as Record<PoiaSubscale, number>;
  for (const sub of allSubs) {
    const items = POIA_ALL_ITEMS.filter((it) => it.subscale === sub);
    subscales[sub] = scoreSubscale(answers, items);
  }

  // 2. الأثر المهني — متوسط مرجّح (القيادة والأثر المؤسسي ×1.2)
  const pi = weightedAvgPercent([
    { avg: subscales.PI_productivity, weight: 1 },
    { avg: subscales.PI_quality, weight: 1 },
    { avg: subscales.PI_innovation, weight: 1 },
    { avg: subscales.PI_leadership, weight: 1.2 },
    { avg: subscales.PI_teamwork, weight: 1 },
    { avg: subscales.PI_service, weight: 1 },
    { avg: subscales.PI_impact, weight: 1.2 },
  ]);

  // 3. الصحة المهنية — جسدي 35٪ + نفسي 40٪ + اجتماعي 25٪
  const oh = weightedAvgPercent([
    { avg: subscales.OH_physical, weight: 0.35 },
    { avg: subscales.OH_mental, weight: 0.4 },
    { avg: subscales.OH_social, weight: 0.25 },
  ]);

  // 4. الاحتراق — البنود مُعكوسة في البنك (قيمة عالية = صحة جيدة)
  //    إذن BRI (مخاطر) = 100 − المتوسط
  const briProtective = avgPercent([
    subscales.BRI_exhaustion,
    subscales.BRI_cynicism,
    subscales.BRI_ineffic,
    subscales.BRI_intent,
  ]);
  const bri = 100 - briProtective;

  // 5. الاستدامة
  let csi = avgPercent([
    subscales.CSI_horizon,
    subscales.CSI_lifestyle,
    subscales.CSI_flex,
  ]);
  // عقوبة إذا الاحتراق ضمن منطقة الخطر
  if (briProtective < 40) csi = Math.max(0, csi - 15);

  // 6. التوافق المهني
  const cfs = avgPercent([
    subscales.CFS_personality,
    subscales.CFS_skills,
    subscales.CFS_values,
    subscales.CFS_interests,
    subscales.CFS_mission,
  ]);

  // 7. جودة الحياة المهنية — مجمَّع
  const protective = 100 - bri;
  const qwl = Math.round((pi + oh + protective + csi + cfs) / 5);

  return {
    pi: Math.round(pi),
    oh: Math.round(oh),
    bri: Math.round(bri),
    csi: Math.round(csi),
    cfs: Math.round(cfs),
    qwl,
    band: bandFromScore(qwl),
    subscales,
  };
}

/** عناوين عربية للمؤشرات للعرض. */
export const POIA_LABELS = {
  pi: "الأثر المهني",
  oh: "الصحة المهنية",
  bri: "مخاطر الاحتراق",
  csi: "الاستدامة المهنية",
  cfs: "توافق المهنة",
  qwl: "جودة الحياة المهنية",
} as const;

export const POIA_SECTION_KEYS = POIA_SECTIONS.map((s) => s.key);
