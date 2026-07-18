// Fit Score Engine — computes academic-major and career-role fit based on
// the five open-license scales (BFI-2, O*NET IP, VISA, OLBI, UWES-9).
// Pure module — safe to import from client or server.

import specData from "@/data/specializations.json";
import { SALARIES, type SalaryRow } from "@/lib/market-data";

export type Riasec = "R" | "I" | "A" | "S" | "E" | "C";
export type BigFive = "O" | "C" | "E" | "A" | "N";

export type UserFitProfile = {
  riasecTop: Riasec | null;
  bfiTop: BigFive | null;
  visaStatus: string | null;
  olbiRisk: "high" | "moderate" | "low" | null;
  uwesBand: "high" | "moderate" | "low" | null;
  scalesUsed: string[]; // e.g. ["bfi2","onet_ip","visa"]
};

type Vec = Partial<Record<Riasec, number>> & { bfi?: Partial<Record<BigFive, number>> };

// Field-level RIASEC/BFI expectations (values 0..1)
const FIELD_PROFILE: Record<string, Vec> = {
  sciences:      { I: 1.0, R: 0.5, C: 0.5, A: 0.2, bfi: { O: 1, C: 0.7 } },
  engineering:   { R: 1.0, I: 0.9, C: 0.5, bfi: { C: 1, O: 0.6 } },
  medicine:      { S: 1.0, I: 0.9, R: 0.5, C: 0.5, bfi: { C: 1, A: 0.9 } },
  computing:     { I: 1.0, R: 0.7, C: 0.6, A: 0.3, bfi: { O: 1, C: 0.7 } },
  social:        { S: 1.0, I: 0.7, A: 0.5, E: 0.4, bfi: { A: 1, O: 0.7 } },
  law:           { E: 0.9, S: 0.7, C: 0.9, I: 0.6, bfi: { C: 1, E: 0.5 } },
  business:      { E: 1.0, C: 0.8, S: 0.5, bfi: { E: 1, C: 0.8 } },
  education:     { S: 1.0, A: 0.5, C: 0.5, bfi: { A: 1, C: 0.7 } },
  arts:          { A: 1.0, S: 0.5, I: 0.4, bfi: { O: 1, A: 0.6 } },
  agriculture:   { R: 1.0, I: 0.7, S: 0.3, bfi: { C: 0.8, O: 0.5 } },
  arts_fine:     { A: 1.0, E: 0.5, S: 0.4, bfi: { O: 1, E: 0.5 } },
  islamic:       { S: 0.8, I: 0.7, A: 0.5, C: 0.6, bfi: { A: 0.9, C: 0.8 } },
  services:      { S: 0.9, E: 0.8, R: 0.5, bfi: { E: 0.9, A: 0.7 } },
};

// General-spec overrides — refine within field where meaningful
const GENERAL_OVERRIDE: Record<string, Vec> = {
  "الرياضيات":            { I: 1.0, C: 0.7, R: 0.3, bfi: { O: 0.9, C: 1 } },
  "علوم الحاسب":          { I: 1.0, R: 0.7, C: 0.6, bfi: { O: 1, C: 0.7 } },
  "هندسة البرمجيات":     { I: 0.9, R: 0.8, C: 0.7, bfi: { C: 1, O: 0.8 } },
  "طب بشري":              { S: 1.0, I: 1.0, R: 0.6, bfi: { C: 1, A: 0.9 } },
  "تمريض":                { S: 1.0, R: 0.6, C: 0.6, bfi: { A: 1, C: 0.8 } },
  "علم النفس":            { S: 1.0, I: 0.8, A: 0.5, bfi: { A: 1, O: 0.8 } },
  "إدارة الأعمال":       { E: 1.0, S: 0.6, C: 0.7, bfi: { E: 1, C: 0.8 } },
  "المحاسبة والمالية":   { C: 1.0, E: 0.6, I: 0.5, bfi: { C: 1 } },
  "الفنون الجميلة":       { A: 1.0, bfi: { O: 1 } },
  "التصميم":              { A: 1.0, I: 0.5, E: 0.4, bfi: { O: 1, C: 0.5 } },
  "الإعلام والاتصال":    { A: 0.8, E: 0.9, S: 0.6, bfi: { E: 1, O: 0.7 } },
  "القانون":              { E: 0.9, C: 0.9, S: 0.6, bfi: { C: 1, E: 0.6 } },
};

// Role profiles (by role name substring)
const ROLE_MAP: { match: RegExp; vec: Vec }[] = [
  { match: /مطور|برمج|software|developer/i,     vec: { I: 1, R: 0.7, C: 0.6, bfi: { O: 1, C: 0.7 } } },
  { match: /بيانات|data|تحليل/,                 vec: { I: 1, C: 0.8, bfi: { O: 0.9, C: 1 } } },
  { match: /devops|سحاب|cloud/i,                vec: { I: 0.9, R: 0.8, C: 0.7, bfi: { C: 1, O: 0.7 } } },
  { match: /ذكاء اصطناعي|ml|ai/i,               vec: { I: 1, R: 0.6, C: 0.6, bfi: { O: 1, C: 0.7 } } },
  { match: /أمن سيبراني|cyber|soc/i,            vec: { I: 0.9, C: 0.9, R: 0.6, bfi: { C: 1 } } },
  { match: /تسويق|marketing/,                   vec: { E: 1, A: 0.6, S: 0.5, bfi: { E: 1, O: 0.7 } } },
  { match: /ux|ui|تصميم/i,                      vec: { A: 1, I: 0.5, bfi: { O: 1, C: 0.5 } } },
  { match: /محاسب|مالي|audit|finance/i,        vec: { C: 1, E: 0.5, bfi: { C: 1 } } },
  { match: /ميكانيك|هندسة/,                     vec: { R: 1, I: 0.8, C: 0.5, bfi: { C: 1, O: 0.6 } } },
  { match: /ممرض|تمريض|nurse/i,                 vec: { S: 1, R: 0.5, C: 0.6, bfi: { A: 1, C: 0.8 } } },
  { match: /معلم|مدرس|teacher/i,                vec: { S: 1, A: 0.5, bfi: { A: 1, C: 0.7 } } },
  { match: /موارد بشرية|hr/i,                   vec: { S: 0.9, E: 0.7, C: 0.6, bfi: { A: 1, E: 0.7 } } },
  { match: /مشاريع|project|pmp/i,               vec: { E: 0.9, C: 0.9, S: 0.5, bfi: { C: 1, E: 0.8 } } },
  { match: /محام|قانون|law/i,                   vec: { E: 0.9, C: 0.8, S: 0.5, bfi: { C: 1, E: 0.6 } } },
  { match: /تمويل إسلامي|صيرفة/,               vec: { C: 0.9, E: 0.7, S: 0.5, bfi: { C: 1 } } },
  { match: /محتوى|كاتب|content|copywriter/i,   vec: { A: 1, S: 0.5, E: 0.5, bfi: { O: 1, E: 0.5 } } },
  { match: /نفس|مرشد نفسي|counsel/i,           vec: { S: 1, A: 0.7, I: 0.6, bfi: { A: 1, O: 0.7 } } },
  { match: /كوتش|مرشد مهني|coach/i,             vec: { S: 1, E: 0.7, A: 0.6, bfi: { E: 0.9, A: 1 } } },
  { match: /طاقة متجددة|استدامة|esg/i,         vec: { I: 0.8, R: 0.8, C: 0.6, bfi: { O: 0.9, C: 0.8 } } },
  { match: /صيدل/,                              vec: { I: 0.9, S: 0.7, C: 0.7, bfi: { C: 1, A: 0.7 } } },
  { match: /product manager|مدير منتج/i,        vec: { E: 0.9, I: 0.7, C: 0.7, bfi: { C: 1, O: 0.8 } } },
];

const DEFAULT_ROLE_VEC: Vec = { E: 0.5, S: 0.5, C: 0.5, bfi: { C: 0.6 } };

// Cosine-like similarity between user profile and target vec (0..1).
function score(profile: UserFitProfile, vec: Vec): number {
  const parts: number[] = [];

  // RIASEC contribution
  if (profile.riasecTop) {
    const w = vec[profile.riasecTop] ?? 0;
    parts.push(w); // already 0..1
  }
  // Big-Five contribution
  if (profile.bfiTop) {
    const w = vec.bfi?.[profile.bfiTop] ?? 0;
    parts.push(w);
  }
  if (parts.length === 0) return 0;

  const base = parts.reduce((s, x) => s + x, 0) / parts.length;

  // VISA modifier — achieved boosts confidence, diffused/foreclosed dampens
  let mod = 1;
  if (profile.visaStatus === "achieved") mod *= 1.05;
  else if (profile.visaStatus === "diffused" || profile.visaStatus === "foreclosed") mod *= 0.92;

  // OLBI: high burnout softens the recommendation (don't rush decisions)
  if (profile.olbiRisk === "high") mod *= 0.95;

  return Math.max(0, Math.min(1, base * mod));
}

export type AcademicFit = {
  fieldId: string;
  fieldLabel: string;
  generalSpec: string;
  fit: number; // 0..100
  reason: string;
};

export type CareerFit = {
  role: string;
  isco: string;
  demand: SalaryRow["demand"];
  fit: number;
  reason: string;
};

function reasonFor(profile: UserFitProfile): string {
  const bits: string[] = [];
  if (profile.riasecTop) bits.push(`ميل ${profile.riasecTop} (O*NET)`);
  if (profile.bfiTop) bits.push(`سمة ${profile.bfiTop} (BFI-2)`);
  if (profile.visaStatus === "achieved") bits.push("هوية مهنية محقّقة (VISA)");
  return bits.join(" • ");
}

type Field = {
  id: string; label: string;
  generalSpecs: { name: string; subs: string[] }[];
};

export function computeAcademicFits(profile: UserFitProfile, topN = 6): AcademicFit[] {
  const fields = (specData as { classicFields: Field[] }).classicFields;
  const out: AcademicFit[] = [];
  const reason = reasonFor(profile);
  for (const f of fields) {
    const base = FIELD_PROFILE[f.id] ?? {};
    for (const g of f.generalSpecs) {
      const vec = GENERAL_OVERRIDE[g.name] ?? base;
      const s = score(profile, vec);
      out.push({
        fieldId: f.id, fieldLabel: f.label, generalSpec: g.name,
        fit: Math.round(s * 100), reason,
      });
    }
  }
  return out.sort((a, b) => b.fit - a.fit).slice(0, topN);
}

export function computeCareerFits(profile: UserFitProfile, topN = 6): CareerFit[] {
  const reason = reasonFor(profile);
  const rows = SALARIES.map((r) => {
    const entry = ROLE_MAP.find((m) => m.match.test(r.role) || r.keywords.some((k) => m.match.test(k)));
    const vec = entry?.vec ?? DEFAULT_ROLE_VEC;
    return {
      role: r.role, isco: r.isco, demand: r.demand,
      fit: Math.round(score(profile, vec) * 100),
      reason,
    };
  });
  return rows.sort((a, b) => b.fit - a.fit).slice(0, topN);
}

export function hasEnoughSignal(profile: UserFitProfile): boolean {
  return Boolean(profile.riasecTop || profile.bfiTop);
}
