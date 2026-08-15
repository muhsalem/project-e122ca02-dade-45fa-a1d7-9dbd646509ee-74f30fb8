/**
 * Bawsala Academic OS — محرك الرسم المعرفي والتقاطعات البينية
 * يشتق تقاطعات A×B تلقائيًا من الملفات المعرفية للمجالات بدل قائمة ثابتة.
 */
import { ACADEMIC_FIELDS } from "@/data/bawsala/academic_disciplines";
import { FIELD_PROFILES, type FieldProfile } from "@/data/bawsala/field_profiles";

export interface Intersection {
  aId: string;
  bId: string;
  aAr: string;
  bAr: string;
  /** درجة نضج التقاطع 0..100 */
  maturity: number;
  /** الطلب المتوقع للتقاطع */
  demand: number;
  sharedTags: string[];
  rationale: string;
}

const NAME_AR: Record<string, string> = Object.fromEntries(
  ACADEMIC_FIELDS.map((f) => [f.id, f.nameAr]),
);

function complementarity(a: FieldProfile, b: FieldProfile): number {
  const axes: (keyof FieldProfile)[] = ["math", "people", "hands", "creative"];
  let diff = 0;
  for (const k of axes) diff += Math.abs((a[k] as number) - (b[k] as number));
  return Math.min(100, diff / axes.length); // اختلاف أكبر = تكامل أعلى
}

/** يبني كل التقاطعات ذات القيمة، مرتّبة تنازليًا */
export function buildIntersections(minMaturity = 45): Intersection[] {
  const ids = Object.keys(FIELD_PROFILES);
  const out: Intersection[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = FIELD_PROFILES[ids[i]];
      const b = FIELD_PROFILES[ids[j]];
      const shared = a.tags.filter((t) => b.tags.includes(t));
      const comp = complementarity(a, b);
      const demand = Math.round((a.demand2035 + b.demand2035) / 2);
      const resilience = Math.round((a.aiResilience + b.aiResilience) / 2);
      const maturity = Math.round(
        0.35 * demand + 0.25 * resilience + 0.25 * comp + 0.15 * (shared.length ? 80 : 35),
      );
      if (maturity < minMaturity) continue;
      out.push({
        aId: ids[i], bId: ids[j],
        aAr: NAME_AR[ids[i]] ?? ids[i], bAr: NAME_AR[ids[j]] ?? ids[j],
        maturity, demand, sharedTags: shared,
        rationale: shared.length
          ? `تقاطع مبني على قواسم مشتركة (${shared.join("، ")}) مع تكامل في نمط العمل.`
          : `تقاطع تكاملي: كل مجال يغطي ما ينقص الآخر (فجوة أنماط ${Math.round(comp)}٪).`,
      });
    }
  }
  return out.sort((x, y) => y.maturity - x.maturity);
}

/** أفضل التقاطعات لمجال محدد */
export function intersectionsFor(fieldId: string, limit = 6): Intersection[] {
  return buildIntersections(0)
    .filter((x) => x.aId === fieldId || x.bId === fieldId)
    .slice(0, limit);
}

export interface MatchReason { label: string; detail: string; positive: boolean }

/** تفسير قرار المطابقة بلغة مفهومة */
export function explainMatch(
  fieldId: string,
  breakdown: { riasec: number; personality: number; agaf: number; ambitions: number },
): MatchReason[] {
  const p = FIELD_PROFILES[fieldId];
  const reasons: MatchReason[] = [];
  const pairs: [string, number][] = [
    ["ميولك (RIASEC)", breakdown.riasec],
    ["سماتك الشخصية", breakdown.personality],
    ["مجموعاتك المعرفية (AGAF)", breakdown.agaf],
    ["طموحاتك المعلنة", breakdown.ambitions],
  ];
  for (const [label, v] of pairs) {
    if (v >= 65) reasons.push({ label, detail: `توافق مرتفع (${v}٪) يدعم هذا المجال.`, positive: true });
    else if (v <= 40) reasons.push({ label, detail: `توافق منخفض (${v}٪) — نقطة تحتاج مراجعة.`, positive: false });
  }
  if (!p) return reasons;
  if (p.math >= 80) reasons.push({ label: "متطلب رياضي", detail: "المجال كثيف رياضيًا؛ تأكد من استعدادك للرياضيات المتقدمة.", positive: false });
  if (p.people >= 85) reasons.push({ label: "تعامل إنساني", detail: "يتطلب تفاعلًا إنسانيًا يوميًا مكثفًا.", positive: true });
  if (p.aiResilience >= 80) reasons.push({ label: "مناعة أمام الأتمتة", detail: `مقاومة عالية للأتمتة (${p.aiResilience}٪).`, positive: true });
  if (p.saturation >= 70) reasons.push({ label: "تشبّع السوق", detail: `المنافسة عالية (${p.saturation}٪)؛ التميّز شرط للدخول.`, positive: false });
  if (p.demand2035 >= 80) reasons.push({ label: "طلب مستقبلي", detail: `طلب مرتفع متوقع حتى 2035 (${p.demand2035}٪).`, positive: true });
  return reasons;
}
