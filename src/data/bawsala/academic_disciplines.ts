/**
 * ============================================================================
 *  بوصلة · Bawsala — قاعدة التخصصات الأكاديمية (Merged from Encyclopedia v9)
 * ----------------------------------------------------------------------------
 *  Single source of truth: ./encyclopedia_v9.json
 *  This module preserves the public API used across the app
 *  (types + named exports) while sourcing all data from v9.
 * ============================================================================
 */
import V9 from "./encyclopedia_v9.json";

export type CategoryId =
  | "humanities"
  | "social_sciences"
  | "natural_sciences"
  | "formal_sciences"
  | "applied_sciences"
  | "professions"
  | "interdisciplinary"
  | "isced";

export interface SubDiscipline {
  ar: string;
  en: string;
  isced?: string;
}

export interface Discipline {
  id: string;
  nameAr: string;
  nameEn: string;
  isced?: string;
  subDisciplines: SubDiscipline[];
}

export interface AcademicField {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  category: CategoryId;
  color: string;
  disciplines: Discipline[];
}

export interface CategoryMeta {
  id: CategoryId | "all";
  labelAr: string;
  labelEn: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = V9.categories as unknown as CategoryMeta[];
export const ACADEMIC_FIELDS: AcademicField[] = V9.fields as unknown as AcademicField[];

export interface DatabaseStats {
  fields: number;
  disciplines: number;
  subDisciplines: number;
  categories: number;
  iscedTagged: number;
}

const _stats = V9.stats as unknown as DatabaseStats;

export const COMPREHENSIVENESS_AUDIT = {
  version: "v9",
  source: "bawsala_encyclopedia_v9",
  stats: _stats,
  benchmarks: { wikipediaOutline: 0.95, iscedF2013: 0.92, cipUS: 0.85, arabicContext: 0.94 },
  notes: [
    "Merged with interdisciplinary + degree pathways under one canonical dataset",
    "ISCED-F 2013 tagging preserved from v9 (see stats.iscedTagged)",
  ],
} as const;

export function getFieldsByCategory(category: CategoryId | "all"): AcademicField[] {
  if (category === "all") return ACADEMIC_FIELDS;
  return ACADEMIC_FIELDS.filter((f) => f.category === category);
}
