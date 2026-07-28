/**
 * ============================================================================
 *  بوصلة · Bawsala — التخصصات البينية (Merged from Encyclopedia v9)
 *  Canonical source: ./encyclopedia_v9.json (interGroups + maturityLabels)
 * ============================================================================
 */
import V9 from "./encyclopedia_v9.json";

export type Maturity = "institutionalized" | "established" | "emerging" | "frontier";
export type Demand = "high" | "medium" | "low";
export type Relevance = "high" | "medium" | "low";

export interface InterField {
  ar: string;
  en: string;
  maturity: Maturity;
  demand: Demand;
  arabicRelevance: Relevance;
}

export interface InterGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  /** نمط التكوين البيني للمجموعة */
  pattern: string;
  fields: InterField[];
}

export const MATURITY_LABELS: Record<Maturity, { ar: string; color: string }> =
  V9.maturityLabels as unknown as Record<Maturity, { ar: string; color: string }>;

export const INTERDISCIPLINARY_GROUPS: InterGroup[] =
  V9.interGroups as unknown as InterGroup[];
