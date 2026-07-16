import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============ Journey Orchestrator ============
// Stages (ordered):
//   discover → assess → clarify → plan → act
// Stage is DERIVED from what the user has completed with the 5 open-license
// scales (BFI-2, O*NET IP, OLBI, UWES-9, VISA) plus POIA/clarity/plan/booking.

export type Stage = "discover" | "assess" | "clarify" | "plan" | "act";

export const STAGES: { key: Stage; label: string; blurb: string }[] = [
  { key: "discover", label: "الاكتشاف", blurb: "ابدأ بفهم نفسك: السمات، الميول، القيم." },
  { key: "assess",   label: "التقييم",  blurb: "قِس ميولك ومهاراتك بمقاييس مفتوحة." },
  { key: "clarify",  label: "الوضوح",   blurb: "حوّل النتائج إلى صورة مهنية واضحة." },
  { key: "plan",     label: "التخطيط",  blurb: "ابنِ خطة تطوير ومسارًا واقعيًا." },
  { key: "act",      label: "التنفيذ",  blurb: "احجز جلسة، نفّذ، وراجِع دوريًا." },
];

export type ScaleCode = "bfi2" | "onet_ip" | "olbi" | "uwes9" | "visa";

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };

export type ScaleInsight = {
  code: ScaleCode;
  label: string;
  summary: string;
  meta?: { [k: string]: JSONValue };
};

export type NextAction = {
  id: string;
  stage: Stage;
  title: string;
  description: string;
  href: string;
  cta: string;
  priority: number;
  reason?: string; // "based on your BFI-2 result: ..." — surfaces the linkage
  sourceScale?: ScaleCode;
};

export type PassportSnapshot = {
  stage: Stage;
  stageIndex: number;
  progress: number;
  completed: {
    bfi2: boolean;
    onet_ip: boolean;
    olbi: boolean;
    uwes9: boolean;
    visa: boolean;
    poia: boolean;
    clarity: boolean;
    plan: boolean;
    booking: boolean;
  };
  insights: ScaleInsight[];
  nextActions: NextAction[];
  primaryAction: NextAction | null;
  dismissed: string[];
  updatedAt: string;
};

// ============ Scale detection ============
// assessment_reports.code may vary — accept a set of aliases per scale.
const SCALE_ALIASES: Record<ScaleCode, string[]> = {
  bfi2:    ["bfi2", "bfi-2", "big-five", "big_five", "bigfive", "self-discovery"],
  onet_ip: ["onet_ip", "onet-ip", "onetip", "riasec", "career-type", "interest-profiler"],
  olbi:    ["olbi", "oldenburg", "burnout"],
  uwes9:   ["uwes9", "uwes-9", "uwes", "engagement", "work-engagement"],
  visa:    ["visa", "vocational-identity", "identity-status"],
};

const SCALE_LABELS: Record<ScaleCode, string> = {
  bfi2: "BFI-2 · الشخصية",
  onet_ip: "O*NET IP · الميول",
  olbi: "OLBI · الاحتراق",
  uwes9: "UWES-9 · الاندماج",
  visa: "VISA · الهوية المهنية",
};

type ReportRow = { code: string | null; answers: unknown; report: string | null; created_at: string };

function detectScale(code: string | null): ScaleCode | null {
  if (!code) return null;
  const c = code.toLowerCase().trim();
  for (const [scale, aliases] of Object.entries(SCALE_ALIASES) as [ScaleCode, string[]][]) {
    if (aliases.some((a) => c === a || c.includes(a))) return scale;
  }
  return null;
}

// ============ Insight derivation ============

function toNum(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

// BFI-2 → dominant Big-Five domain among O/C/E/A/N if scores present.
function bfi2Insight(row: ReportRow): ScaleInsight {
  const a = (row.answers ?? {}) as Record<string, unknown>;
  const scores = (a.scores ?? a.domains ?? a) as Record<string, unknown>;
  const map: Record<string, string> = {
    O: "الانفتاح على التجربة", openness: "الانفتاح على التجربة",
    C: "الضمير الحي", conscientiousness: "الضمير الحي",
    E: "الانبساط", extraversion: "الانبساط",
    A: "المقبولية", agreeableness: "المقبولية",
    N: "العصابية", neuroticism: "العصابية",
  };
  let bestKey: string | null = null; let bestVal = -Infinity;
  for (const [k, v] of Object.entries(scores)) {
    const n = toNum(v); if (n === null) continue;
    if (n > bestVal) { bestVal = n; bestKey = k; }
  }
  const label = bestKey && map[bestKey] ? map[bestKey] : null;
  return {
    code: "bfi2",
    label: SCALE_LABELS.bfi2,
    summary: label ? `سمتك البارزة: ${label}` : "تمّ إكمال مقياس الشخصية.",
    meta: { top: bestKey, score: bestVal },
  };
}

// O*NET IP → top RIASEC letter
const RIASEC_LABEL: Record<string, string> = {
  R: "واقعي (Realistic)", I: "استقصائي (Investigative)", A: "فنّي (Artistic)",
  S: "اجتماعي (Social)", E: "ريادي (Enterprising)", C: "تقليدي (Conventional)",
};
function onetInsight(row: ReportRow): ScaleInsight {
  const a = (row.answers ?? {}) as Record<string, unknown>;
  const scores = (a.riasec ?? a.scores ?? a) as Record<string, unknown>;
  let bestKey: string | null = null; let bestVal = -Infinity;
  for (const k of ["R", "I", "A", "S", "E", "C"]) {
    const n = toNum(scores[k]); if (n === null) continue;
    if (n > bestVal) { bestVal = n; bestKey = k; }
  }
  return {
    code: "onet_ip",
    label: SCALE_LABELS.onet_ip,
    summary: bestKey ? `ميلك المهني الأعلى: ${RIASEC_LABEL[bestKey]}` : "تمّ إكمال Interest Profiler.",
    meta: { top: bestKey, score: bestVal },
  };
}

// OLBI → burnout risk level from Exhaustion + Disengagement
function olbiInsight(row: ReportRow): ScaleInsight {
  const a = (row.answers ?? {}) as Record<string, unknown>;
  const ex = toNum(a.exhaustion) ?? toNum((a.scores as any)?.exhaustion);
  const di = toNum(a.disengagement) ?? toNum((a.scores as any)?.disengagement);
  let risk: "high" | "moderate" | "low" | "unknown" = "unknown";
  if (ex !== null && di !== null) {
    const avg = (ex + di) / 2;
    risk = avg >= 3.25 ? "high" : avg >= 2.5 ? "moderate" : "low";
  }
  const label = risk === "high" ? "مرتفع" : risk === "moderate" ? "متوسط" : risk === "low" ? "منخفض" : null;
  return {
    code: "olbi",
    label: SCALE_LABELS.olbi,
    summary: label ? `مؤشّر الاحتراق: ${label}` : "تمّ إكمال OLBI.",
    meta: { exhaustion: ex, disengagement: di, risk },
  };
}

// UWES-9 → engagement band
function uwesInsight(row: ReportRow): ScaleInsight {
  const a = (row.answers ?? {}) as Record<string, unknown>;
  const total = toNum(a.total) ?? toNum((a.scores as any)?.total) ?? toNum(a.mean);
  let band: "high" | "moderate" | "low" | "unknown" = "unknown";
  if (total !== null) {
    band = total >= 4.67 ? "high" : total >= 3.07 ? "moderate" : "low";
  }
  const label = band === "high" ? "عالٍ" : band === "moderate" ? "متوسط" : band === "low" ? "منخفض" : null;
  return {
    code: "uwes9",
    label: SCALE_LABELS.uwes9,
    summary: label ? `اندماجك الوظيفي: ${label}` : "تمّ إكمال UWES-9.",
    meta: { total, band },
  };
}

// VISA → identity status (achieved / moratorium / foreclosed / diffused / searching)
function visaInsight(row: ReportRow): ScaleInsight {
  const a = (row.answers ?? {}) as Record<string, unknown>;
  const status = (a.status ?? (a.scores as any)?.status) as string | undefined;
  const map: Record<string, string> = {
    achieved: "الهوية المُحقّقة", moratorium: "التسويف/الاستكشاف النشط",
    foreclosed: "الهوية المُغلقة", diffused: "الهوية المُشتّتة", searching: "الهوية الباحثة",
  };
  const label = status ? (map[status.toLowerCase()] ?? status) : null;
  return {
    code: "visa",
    label: SCALE_LABELS.visa,
    summary: label ? `وضع هويتك المهنية: ${label}` : "تمّ إكمال VISA.",
    meta: { status: status ?? null },
  };
}

const INSIGHT_BUILDERS: Record<ScaleCode, (r: ReportRow) => ScaleInsight> = {
  bfi2: bfi2Insight, onet_ip: onetInsight, olbi: olbiInsight, uwes9: uwesInsight, visa: visaInsight,
};

// ============ Stage & actions ============

function deriveStage(c: PassportSnapshot["completed"]): Stage {
  const discoverDone = c.bfi2 || c.visa;
  const assessDone = c.onet_ip || c.uwes9;
  const clarifyDone = c.olbi && c.poia && c.clarity;
  if (c.booking) return "act";
  if (c.plan) return "act";
  if (clarifyDone) return "plan";
  if (assessDone && discoverDone) return "clarify";
  if (discoverDone) return "assess";
  return "discover";
}

function buildActions(
  c: PassportSnapshot["completed"],
  insights: Map<ScaleCode, ScaleInsight>,
  stage: Stage,
): NextAction[] {
  const a: NextAction[] = [];
  const reasonFrom = (code: ScaleCode) => insights.get(code)?.summary;

  // DISCOVER
  if (!c.bfi2) a.push({
    id: "bfi2", stage: "discover", priority: 10, sourceScale: "bfi2",
    title: "اكتشف سمات شخصيتك (BFI-2)",
    description: "60 بندًا لفهم الأبعاد الخمسة الكبرى — 10 دقائق.",
    href: "/self-discovery", cta: "ابدأ BFI-2",
  });
  if (!c.visa) a.push({
    id: "visa", stage: "discover", priority: c.bfi2 ? 12 : 20, sourceScale: "visa",
    title: "قيّم هويتك المهنية (VISA)",
    description: "أين أنت في رحلة اكتشاف الهوية المهنية؟",
    href: "/career-identity", cta: "ابدأ VISA",
  });

  // ASSESS
  if (!c.onet_ip) a.push({
    id: "onet_ip", stage: "assess", priority: c.bfi2 ? 14 : 25, sourceScale: "onet_ip",
    title: "حدّد ميولك المهنية (O*NET IP)",
    description: "Interest Profiler — يكشف تفضيلاتك حسب RIASEC.",
    href: "/career-type-assessment", cta: "ابدأ IP",
    reason: reasonFrom("bfi2"),
  });
  if (!c.uwes9) a.push({
    id: "uwes9", stage: "assess", priority: 30, sourceScale: "uwes9",
    title: "قِس اندماجك الوظيفي (UWES-9)",
    description: "9 بنود لقياس الحيوية والتفاني والاستغراق.",
    href: "/work-engagement", cta: "ابدأ UWES-9",
  });

  // CLARIFY
  if (!c.olbi && (c.uwes9 || stage === "clarify")) a.push({
    id: "olbi", stage: "clarify", priority: 15, sourceScale: "olbi",
    title: "افحص مؤشّر الاحتراق (OLBI)",
    description: "بُعدَي الإنهاك والانفصال — دقيقتان.",
    href: "/burnout-check", cta: "ابدأ OLBI",
    reason: reasonFrom("uwes9"),
  });
  if (!c.poia && (c.bfi2 || c.onet_ip)) a.push({
    id: "poia", stage: "clarify", priority: 20,
    title: "التقييم المهني الشامل (POIA)",
    description: "يدمج نتائج BFI-2 و O*NET IP في تقرير موحّد.",
    href: "/poia", cta: "ابدأ POIA",
    reason: reasonFrom("onet_ip") ?? reasonFrom("bfi2"),
  });
  if (!c.clarity && c.poia) a.push({
    id: "clarity", stage: "clarify", priority: 25,
    title: "افحص وضوحك المهني",
    description: "هل أنت جاهز للانتقال إلى التخطيط؟",
    href: "/clarity-check", cta: "افحص الآن",
  });

  // PLAN
  if (!c.plan && (c.clarity || (c.bfi2 && c.onet_ip))) {
    const topRiasec = insights.get("onet_ip")?.meta?.top as string | undefined;
    a.push({
      id: "plan", stage: "plan", priority: 10,
      title: "ابنِ خطتك المهنية",
      description: topRiasec
        ? `خطة مبنية على ميلك ${RIASEC_LABEL[topRiasec] ?? topRiasec}.`
        : "حوّل نتائجك إلى خطوات عملية بجدول زمني.",
      href: "/career-twin", cta: "ابدأ التخطيط",
      reason: reasonFrom("onet_ip") ?? reasonFrom("visa"),
    });
  }

  // Suggest micro-sims when RIASEC known but plan/clarity not done → tighter next step
  if (c.onet_ip && !c.plan) {
    a.push({
      id: "career-sims", stage: c.clarity ? "plan" : "clarify", priority: c.clarity ? 12 : 22,
      sourceScale: "onet_ip",
      title: "جرّب Career Micro-Sims (15 دقيقة)",
      description: "محاكاة تفاعلية لتختبر المهن الأقرب لميولك.",
      href: "/career-sims", cta: "استكشف",
      reason: reasonFrom("onet_ip"),
    });
  }

  // High burnout → nudge wellbeing/coaching earlier
  const burnout = insights.get("olbi")?.meta?.risk as string | undefined;
  if (burnout === "high") {
    a.push({
      id: "wellbeing-nudge", stage: "clarify", priority: 5, sourceScale: "olbi",
      title: "أولوية: التعافي من الاحتراق",
      description: "مؤشّر OLBI مرتفع — نوصي بجلسة كوتشينج قصيرة قبل التخطيط.",
      href: "/booking", cta: "احجز جلسة سريعة",
      reason: reasonFrom("olbi"),
    });
  }

  // ACT
  if (c.plan && !c.booking) a.push({
    id: "booking", stage: "act", priority: 10,
    title: "احجز جلسة إرشاد أو كوتشينج",
    description: "راجع خطتك مع مرشد معتمد.",
    href: "/booking", cta: "احجز جلسة",
    reason: reasonFrom("visa"),
  });

  // Study OS is always available as a supporting habit
  a.push({
    id: "study-os", stage, priority: 60,
    title: "فعّل Study OS اليومي",
    description: "Pomodoro + Flashcards + فحص يومي بالذكاء الاصطناعي.",
    href: "/study-os", cta: "افتح Study OS",
  });

  return a.sort((x, y) => x.priority - y.priority);
}

// ============ Server function ============

async function hasRows(supabase: SupabaseClient, table: string, userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return false;
  return (count ?? 0) > 0;
}

export const getPassport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PassportSnapshot> => {
    const { supabase, userId } = context;

    const [reportsRes, poia, clarity, plan, booking, journeyRes] = await Promise.all([
      supabase.from("assessment_reports")
        .select("code, answers, report, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      hasRows(supabase as SupabaseClient, "poia_submissions", userId),
      hasRows(supabase as SupabaseClient, "clarity_scores", userId),
      hasRows(supabase as SupabaseClient, "career_plans", userId),
      hasRows(supabase as SupabaseClient, "bookings", userId),
      supabase.from("passport_journeys").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    // Keep the latest report per detected scale
    const latestByScale = new Map<ScaleCode, ReportRow>();
    for (const r of (reportsRes.data ?? []) as ReportRow[]) {
      const s = detectScale(r.code);
      if (!s || latestByScale.has(s)) continue;
      latestByScale.set(s, r);
    }

    const insights: ScaleInsight[] = [];
    for (const [scale, row] of latestByScale) {
      try { insights.push(INSIGHT_BUILDERS[scale](row)); }
      catch { insights.push({ code: scale, label: SCALE_LABELS[scale], summary: "تمّ الإكمال." }); }
    }
    const insightMap = new Map(insights.map((i) => [i.code, i] as const));

    const completed = {
      bfi2: latestByScale.has("bfi2"),
      onet_ip: latestByScale.has("onet_ip"),
      olbi: latestByScale.has("olbi"),
      uwes9: latestByScale.has("uwes9"),
      visa: latestByScale.has("visa"),
      poia, clarity, plan, booking,
    };

    const dismissed: string[] = (journeyRes.data?.dismissed_actions as string[]) ?? [];
    const stage = deriveStage(completed);
    const nextActions = buildActions(completed, insightMap, stage).filter((a) => !dismissed.includes(a.id));
    const stageIndex = STAGES.findIndex((s) => s.key === stage);
    const doneCount = Object.values(completed).filter(Boolean).length;
    const total = Object.keys(completed).length;
    const progress = Math.round((doneCount / total) * 100) / 100;

    await supabase
      .from("passport_journeys")
      .upsert(
        { user_id: userId, stage, meta: { completed, insights } as never },
        { onConflict: "user_id" },
      );

    return {
      stage, stageIndex, progress, completed,
      insights, nextActions,
      primaryAction: nextActions[0] ?? null,
      dismissed,
      updatedAt: new Date().toISOString(),
    };
  });

export const dismissAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ actionId: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: cur } = await supabase
      .from("passport_journeys")
      .select("dismissed_actions")
      .eq("user_id", userId)
      .maybeSingle();
    const prev: string[] = cur?.dismissed_actions ?? [];
    const next = Array.from(new Set([...prev, data.actionId]));
    const { error } = await supabase
      .from("passport_journeys")
      .upsert({ user_id: userId, dismissed_actions: next }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resetDismissed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("passport_journeys")
      .upsert({ user_id: userId, dismissed_actions: [] }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
