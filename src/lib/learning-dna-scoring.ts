// محرّك حساب Learning DNA — الأبعاد + 7 مؤشرات مركّبة
import { scoreSubscale, toPercent } from "./psychometrics";
import {
  DNA_ALL_ITEMS,
  type DnaDimension,
  type DnaAxis,
  DNA_SECTIONS,
} from "@/data/learning-dna-bank";

export type DnaBand = "ممتاز" | "جيد" | "متوسط" | "يحتاج تطوير";

export interface TaskResults {
  // Memory
  memory_immediate?: number; // 0..1 نسبة كلمات صحيحة مباشرة
  memory_delayed?: number;   // 0..1 نسبة كلمات صحيحة بعد فاصل
  // Stroop
  stroop_accuracy?: number;  // 0..1
  stroop_avg_ms?: number;    // متوسط زمن الاستجابة بالملي ثانية
  stroop_incong_cost_ms?: number; // فرق الزمن (incong - cong)
  // Problem
  problem_score?: number;    // 0..1
  problem_time_ms?: number;
}

export interface DnaScores {
  dimensions: Record<DnaDimension, number>; // متوسطات 1-5
  axisScores: Record<DnaAxis, number>;      // 0-100
  metrics: {
    LES: number; RET: number; FOC: number; PSS: number;
    LAS: number; SLS: number; DLS: number;
  };
  band: DnaBand;
  topDimensions: { dim: DnaDimension; pct: number }[];
  bottomDimensions: { dim: DnaDimension; pct: number }[];
}

function bandOf(s: number): DnaBand {
  if (s >= 80) return "ممتاز";
  if (s >= 65) return "جيد";
  if (s >= 50) return "متوسط";
  return "يحتاج تطوير";
}

function avgPct(vals: number[]): number {
  const v = vals.filter((x) => x > 0);
  if (!v.length) return 0;
  return toPercent(v.reduce((a, b) => a + b, 0) / v.length);
}

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export function calculateLearningDna(
  answers: Record<string, number | undefined>,
  tasks: TaskResults = {},
): DnaScores {
  // 1) متوسط كل بُعد
  const dims = new Set<DnaDimension>();
  DNA_ALL_ITEMS.forEach((it) => dims.add(it.dimension));
  const dimensions = {} as Record<DnaDimension, number>;
  for (const d of dims) {
    const items = DNA_ALL_ITEMS.filter((it) => it.dimension === d);
    dimensions[d] = scoreSubscale(answers, items);
  }

  // 2) متوسط كل محور (0-100)
  const axisScores = {} as Record<DnaAxis, number>;
  for (const sec of DNA_SECTIONS) {
    const vals = sec.items.map((it) => dimensions[it.dimension]).filter((v) => v > 0);
    axisScores[sec.key] = vals.length
      ? toPercent(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  }

  // 3) مؤشرات الأداء (0..1) من المهام
  const memPerf = (
    (tasks.memory_immediate ?? 0) * 0.4 +
    (tasks.memory_delayed ?? tasks.memory_immediate ?? 0) * 0.6
  );
  const focusPerf = (() => {
    const acc = tasks.stroop_accuracy ?? 0;
    // كلفة Stroop: 0ms ممتاز، 600ms ضعيف
    const cost = tasks.stroop_incong_cost_ms ?? 600;
    const costNorm = clamp01(1 - cost / 600);
    return acc * 0.6 + costNorm * 0.4;
  })();
  const probPerf = tasks.problem_score ?? 0;

  // 4) المؤشرات المركّبة
  const selfMem = avgPct([
    dimensions.mem_short, dimensions.mem_long, dimensions.mem_recall,
    dimensions.mem_association, dimensions.mem_retention,
  ]);
  const selfAtt = axisScores.attention;
  const selfProc = axisScores.processing;

  const RET = Math.round(selfMem * 0.5 + memPerf * 100 * 0.5);
  const FOC = Math.round(selfAtt * 0.5 + focusPerf * 100 * 0.5);
  const PSS = Math.round(selfProc * 0.5 + probPerf * 100 * 0.5);

  const LAS = Math.round(
    (avgPct([dimensions.pr_creative, dimensions.pr_inductive]) * 0.6) +
      (memPerf * 100 * 0.2) +
      (focusPerf * 100 * 0.2),
  );

  const SLS = Math.round(
    (avgPct([dimensions.mo_intrinsic, dimensions.mo_curiosity, dimensions.mo_grit]) * 0.6) +
      (axisScores.environment ? toPercent(dimensions.en_solo) * 0.2 : 0) +
      (axisScores.motivation * 0.2),
  );

  const DLS = Math.round(
    (avgPct([dimensions.pr_critical, dimensions.pr_systemic]) * 0.5) +
      (toPercent(dimensions.at_deep) * 0.25) +
      (focusPerf * 100 * 0.25),
  );

  const LES = Math.round(
    (axisScores.input * 0.15) +
      (axisScores.processing * 0.2) +
      (selfMem * 0.15) +
      (axisScores.attention * 0.15) +
      (axisScores.motivation * 0.15) +
      (axisScores.environment * 0.1) +
      ((memPerf + focusPerf + probPerf) / 3 * 100 * 0.1),
  );

  // 5) أعلى/أدنى الأبعاد
  const ranked = Object.entries(dimensions)
    .map(([dim, avg]) => ({ dim: dim as DnaDimension, pct: toPercent(avg) }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct);

  return {
    dimensions,
    axisScores,
    metrics: { LES, RET, FOC, PSS, LAS, SLS, DLS },
    band: bandOf(LES),
    topDimensions: ranked.slice(0, 5),
    bottomDimensions: ranked.slice(-3).reverse(),
  };
}

export const METRIC_LABELS = {
  LES: "كفاءة التعلّم",
  RET: "الاحتفاظ بالمعلومات",
  FOC: "التركيز",
  PSS: "حلّ المشكلات",
  LAS: "سرعة التعلّم",
  SLS: "التعلّم الذاتي",
  DLS: "التعلّم العميق",
} as const;
