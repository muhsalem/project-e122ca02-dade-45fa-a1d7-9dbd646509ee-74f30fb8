import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  computeAcademicFits, computeCareerFits, hasEnoughSignal,
  type UserFitProfile, type AcademicFit, type CareerFit, type Riasec, type BigFive,
} from "@/lib/fit-score";

const SCALE_ALIASES: Record<string, string[]> = {
  bfi2:    ["bfi2", "bfi-2", "big-five", "big_five", "bigfive", "self-discovery"],
  onet_ip: ["onet_ip", "onet-ip", "onetip", "riasec", "career-type", "interest-profiler"],
  olbi:    ["olbi", "oldenburg", "burnout"],
  uwes9:   ["uwes9", "uwes-9", "uwes", "engagement"],
  visa:    ["visa", "vocational-identity", "identity-status"],
};

function detect(code: string | null): keyof typeof SCALE_ALIASES | null {
  if (!code) return null;
  const c = code.toLowerCase().trim();
  for (const [k, al] of Object.entries(SCALE_ALIASES)) {
    if (al.some((a) => c === a || c.includes(a))) return k as keyof typeof SCALE_ALIASES;
  }
  return null;
}

function toNum(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

function topKey<T extends string>(obj: Record<string, unknown> | undefined, keys: readonly T[]): T | null {
  if (!obj) return null;
  let best: T | null = null; let bestVal = -Infinity;
  for (const k of keys) {
    const n = toNum(obj[k]);
    if (n === null) continue;
    if (n > bestVal) { bestVal = n; best = k; }
  }
  return best;
}

export type FitReport = {
  profile: UserFitProfile;
  academic: AcademicFit[];
  career: CareerFit[];
  hasSignal: boolean;
  disclaimer: string | null;
};

export const getUserFitScores = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FitReport> => {
    const { supabase, userId } = context;
    const { data: reports } = await supabase
      .from("assessment_reports")
      .select("code, answers, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const latest = new Map<string, Record<string, unknown>>();
    for (const r of reports ?? []) {
      const s = detect(r.code as string | null);
      if (!s || latest.has(s)) continue;
      latest.set(s, ((r.answers as Record<string, unknown>) ?? {}));
    }

    const bfi = latest.get("bfi2");
    const bfiScores = (bfi?.scores ?? bfi?.domains ?? bfi) as Record<string, unknown> | undefined;
    const bfiTop = topKey(bfiScores, ["O","C","E","A","N"] as const);
    const bfiTopFallback = bfiTop ?? topKey(bfiScores, ["openness","conscientiousness","extraversion","agreeableness","neuroticism"] as const);
    const bfiFinal: BigFive | null = bfiTop ?? (
      bfiTopFallback === "openness" ? "O" :
      bfiTopFallback === "conscientiousness" ? "C" :
      bfiTopFallback === "extraversion" ? "E" :
      bfiTopFallback === "agreeableness" ? "A" :
      bfiTopFallback === "neuroticism" ? "N" : null
    );

    const onet = latest.get("onet_ip");
    const rScores = (onet?.riasec ?? onet?.scores ?? onet) as Record<string, unknown> | undefined;
    const riasecTop = topKey<Riasec>(rScores, ["R","I","A","S","E","C"] as const);

    const olbi = latest.get("olbi");
    const ex = toNum(olbi?.exhaustion) ?? toNum((olbi?.scores as any)?.exhaustion);
    const di = toNum(olbi?.disengagement) ?? toNum((olbi?.scores as any)?.disengagement);
    const olbiRisk = (ex !== null && di !== null)
      ? (((ex + di) / 2) >= 3.25 ? "high" : ((ex + di) / 2) >= 2.5 ? "moderate" : "low")
      : null;

    const uwes = latest.get("uwes9");
    const uwesTotal = toNum(uwes?.total) ?? toNum((uwes?.scores as any)?.total) ?? toNum(uwes?.mean);
    const uwesBand = uwesTotal !== null
      ? (uwesTotal >= 4.67 ? "high" : uwesTotal >= 3.07 ? "moderate" : "low")
      : null;

    const visa = latest.get("visa");
    const visaStatus = ((visa?.status ?? (visa?.scores as any)?.status) as string | undefined)?.toLowerCase() ?? null;

    const scalesUsed = Array.from(latest.keys());

    const profile: UserFitProfile = {
      riasecTop, bfiTop: bfiFinal, visaStatus, olbiRisk, uwesBand, scalesUsed,
    };

    const signal = hasEnoughSignal(profile);
    const academic = signal ? computeAcademicFits(profile) : [];
    const career = signal ? computeCareerFits(profile) : [];

    let disclaimer: string | null = null;
    if (scalesUsed.length === 0) {
      disclaimer = "أكمل مقياس BFI-2 و O*NET Interest Profiler لعرض نسب التوافق.";
    } else if (scalesUsed.length < 3) {
      disclaimer = "النسب مبنية على المقاييس المكتملة حاليًا — أكمل بقية المقاييس الخمسة لتحسين الدقة.";
    }

    return { profile, academic, career, hasSignal: signal, disclaimer };
  });
