// أدوات سيكومترية مشتركة لاختبارات بُوصلة الجديدة
// تستخدم Likert 5 نقاط الموحّد عبر المنصة كاملة.

export const LIKERT_5 = [
  { v: 1, label: "لا أوافق إطلاقًا" },
  { v: 2, label: "لا أوافق" },
  { v: 3, label: "محايد" },
  { v: 4, label: "أوافق" },
  { v: 5, label: "أوافق تمامًا" },
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

/** متوسط مجموعة بنود مع دعم البنود العكسية. */
export function scoreSubscale(
  answers: Record<string, number | undefined>,
  items: { id: string; reverse?: boolean }[],
): number {
  const vals = items
    .map((it) => {
      const a = answers[it.id];
      if (typeof a !== "number") return null;
      return it.reverse ? 6 - a : a;
    })
    .filter((v): v is number => v !== null);
  if (vals.length === 0) return 0;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

/** يحوّل متوسط 1–5 إلى نسبة مئوية. */
export function toPercent(avg: number): number {
  return Math.round(((avg - 1) / 4) * 100);
}

/** تصنيف وصفي للنتيجة (منخفض/متوسط/مرتفع). */
export function bandFromAvg(avg: number): "منخفض" | "متوسط" | "مرتفع" {
  if (avg < 2.5) return "منخفض";
  if (avg < 3.75) return "متوسط";
  return "مرتفع";
}

export function rankSubscales<T extends string>(
  scores: Record<T, number>,
): { key: T; avg: number; pct: number }[] {
  return (Object.keys(scores) as T[])
    .map((k) => ({ key: k, avg: scores[k], pct: toPercent(scores[k]) }))
    .sort((a, b) => b.avg - a.avg);
}
