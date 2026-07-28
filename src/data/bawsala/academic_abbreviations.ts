/**
 * ============================================================================
 *  بوصلة · Bawsala — الدرجات الأكاديمية والاختصارات (Merged from Encyclopedia v9)
 *  Canonical source: ./encyclopedia_v9.json (abbrGroups + levelLabels)
 * ============================================================================
 */
import V9 from "./encyclopedia_v9.json";

export type DegreeLevel =
  | "diploma"
  | "bachelor"
  | "master"
  | "doctorate"
  | "professional_cert"
  | "fellowship"
  | "license";

export interface DegreeAbbreviation {
  abbr: string;
  en: string;
  ar: string;
  level: DegreeLevel;
}

export interface AbbreviationGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  /** المسارات الترقّوية النموذجية داخل المجموعة */
  pathways: string[];
  items: DegreeAbbreviation[];
}

export const ABBREVIATION_GROUPS: AbbreviationGroup[] =
  V9.abbrGroups as unknown as AbbreviationGroup[];

export const LEVEL_LABELS: Record<DegreeLevel, { ar: string; en: string; color: string }> =
  V9.levelLabels as unknown as Record<DegreeLevel, { ar: string; en: string; color: string }>;

/** ربط مجموعات الدرجات بالمجالات الأكاديمية المستضيفة (نسخة v9) */
export const DEGREE_FIELD_MAP: Record<string, string[]> = {
  business: ["business"],
  finance_accounting: ["business"],
  medicine: ["medicine_health"],
  dentistry_pharmacy: ["medicine_health"],
  nursing_allied: ["medicine_health"],
  engineering: ["engineering"],
  computing_it: ["computer_science"],
  law: ["law"],
  education: ["education"],
  arts_humanities: ["history", "languages_literature", "philosophy"],
  sciences: ["physics", "chemistry", "biology", "earth_sciences", "space_sciences", "mathematics"],
  social_sciences: ["psychology", "sociology_anthro", "political_science", "social_public_services"],
  architecture_design: ["architecture_planning"],
  islamic_sharia: ["religious_studies"],
  theology_religion: ["religious_studies"],
  music_performing: ["performing_arts", "visual_arts"],
  veterinary_agriculture: ["agriculture_food"],
  aviation_maritime: ["transport_services"],
};
