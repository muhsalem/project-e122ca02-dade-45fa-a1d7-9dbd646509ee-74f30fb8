import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ============ Journey Orchestrator ============
// Stages (ordered):
//   discover → assess → clarify → plan → act
// Stage is DERIVED from what the user has completed, so it self-updates.

export type Stage = "discover" | "assess" | "clarify" | "plan" | "act";

export const STAGES: { key: Stage; label: string; blurb: string }[] = [
  { key: "discover", label: "الاكتشاف", blurb: "ابدأ بفهم نفسك: السمات، الميول، القيم." },
  { key: "assess",   label: "التقييم",  blurb: "قِس ميولك ومهاراتك بمقاييس مفتوحة." },
  { key: "clarify",  label: "الوضوح",   blurb: "حوّل النتائج إلى صورة مهنية واضحة." },
  { key: "plan",     label: "التخطيط",  blurb: "ابنِ خطة تطوير ومسارًا واقعيًا." },
  { key: "act",      label: "التنفيذ",  blurb: "احجز جلسة، نفّذ، وراجِع دوريًا." },
];

export type NextAction = {
  id: string;
  stage: Stage;
  title: string;
  description: string;
  href: string;
  cta: string;
  priority: number; // lower = more important
};

export type PassportSnapshot = {
  stage: Stage;
  stageIndex: number;
  progress: number; // 0..1
  completed: {
    selfDiscovery: boolean;
    careerType: boolean;
    workValues: boolean;
    emotionalIntelligence: boolean;
    poia: boolean;
    clarity: boolean;
    learningDna: boolean;
    wellbeing: boolean;
    plan: boolean;
    booking: boolean;
  };
  nextActions: NextAction[]; // ordered
  primaryAction: NextAction | null;
  dismissed: string[];
  updatedAt: string;
};

// Non-empty count helper
async function hasRows(supabase: any, table: string, userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return false;
  return (count ?? 0) > 0;
}

function deriveStage(c: PassportSnapshot["completed"]): Stage {
  const discoverDone = c.selfDiscovery || c.careerType || c.workValues || c.emotionalIntelligence;
  const assessDone = c.poia || c.learningDna;
  if (c.booking && c.plan) return "act";
  if (c.plan) return "act";
  if (c.clarity) return "plan";
  if (assessDone) return "clarify";
  if (discoverDone) return "assess";
  return "discover";
}

function buildActions(c: PassportSnapshot["completed"]): NextAction[] {
  const a: NextAction[] = [];
  if (!c.selfDiscovery) a.push({
    id: "self-discovery", stage: "discover", priority: 10,
    title: "اكتشف سماتك (Big Five)",
    description: "60 بندًا من IPIP-NEO لفهم شخصيتك — 10 دقائق.",
    href: "/self-discovery", cta: "ابدأ الاكتشاف",
  });
  if (!c.careerType) a.push({
    id: "career-type", stage: "assess", priority: c.selfDiscovery ? 15 : 25,
    title: "حدّد نوعك المهني (RIASEC)",
    description: "O*NET Interest Profiler — يكشف ميولك المهنية.",
    href: "/career-type-assessment", cta: "ابدأ التقييم",
  });
  if (!c.workValues) a.push({
    id: "work-values", stage: "assess", priority: 30,
    title: "رتّب قيم العمل لديك",
    description: "ما الذي يهمّك فعلًا في وظيفتك القادمة؟",
    href: "/work-values", cta: "قِس قيمك",
  });
  if (!c.emotionalIntelligence) a.push({
    id: "eq", stage: "assess", priority: 35,
    title: "قِس ذكاءك العاطفي",
    description: "IPIP-EI — 16 بندًا في 4 أبعاد.",
    href: "/emotional-intelligence", cta: "ابدأ",
  });
  if (!c.poia && (c.selfDiscovery || c.careerType)) a.push({
    id: "poia", stage: "clarify", priority: 20,
    title: "التقييم المهني الشامل (POIA)",
    description: "يدمج ميولك ومهاراتك في تقرير مهني واحد.",
    href: "/poia", cta: "ابدأ POIA",
  });
  if (!c.clarity && c.poia) a.push({
    id: "clarity", stage: "clarify", priority: 10,
    title: "افحص وضوحك المهني",
    description: "درجة الوضوح تُحدّد ما إذا كنت جاهزًا للتخطيط.",
    href: "/clarity-check", cta: "افحص الآن",
  });
  if (!c.plan && (c.clarity || c.poia)) a.push({
    id: "plan", stage: "plan", priority: 10,
    title: "ابنِ خطتك المهنية",
    description: "حوّل نتائجك إلى خطوات عملية بجدول زمني.",
    href: "/career-twin", cta: "ابدأ التخطيط",
  });
  if (!c.wellbeing) a.push({
    id: "wellbeing", stage: "clarify", priority: 40,
    title: "فحص سريع للصحة النفسية",
    description: "PHQ-2 / GAD-2 — دقيقتان.",
    href: "/wellbeing-check", cta: "افحص",
  });
  if (c.plan && !c.booking) a.push({
    id: "booking", stage: "act", priority: 10,
    title: "احجز جلسة إرشاد أو كوتشينج",
    description: "راجع خطتك مع مرشد معتمد.",
    href: "/booking", cta: "احجز جلسة",
  });
  return a.sort((x, y) => x.priority - y.priority);
}

export const getPassport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PassportSnapshot> => {
    const { supabase, userId } = context;

    const [
      selfDisc, careerType, workValues, eq,
      poia, clarity, learningDna, wellbeing,
      plan, booking, journeyRes,
    ] = await Promise.all([
      hasRows(supabase, "assessment_reports", userId),
      hasRows(supabase, "assessment_reports", userId), // both derived below via meta if needed
      hasRows(supabase, "assessment_reports", userId),
      hasRows(supabase, "assessment_reports", userId),
      hasRows(supabase, "poia_submissions", userId),
      hasRows(supabase, "clarity_scores", userId),
      hasRows(supabase, "learning_dna_submissions", userId),
      hasRows(supabase, "wellbeing_screenings", userId),
      hasRows(supabase, "career_plans", userId),
      hasRows(supabase, "bookings", userId),
      supabase.from("passport_journeys").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    // Distinguish sub-assessment kinds from assessment_reports rows by kind column when present
    const { data: reportKinds } = await supabase
      .from("assessment_reports")
      .select("kind")
      .eq("user_id", userId);
    const kinds = new Set<string>((reportKinds ?? []).map((r: any) => r.kind).filter(Boolean));

    const completed = {
      selfDiscovery: kinds.has("self-discovery") || kinds.has("big-five") || selfDisc && kinds.size === 0 && false,
      careerType: kinds.has("career-type") || kinds.has("riasec"),
      workValues: kinds.has("work-values"),
      emotionalIntelligence: kinds.has("emotional-intelligence") || kinds.has("eq"),
      poia,
      clarity,
      learningDna,
      wellbeing,
      plan,
      booking,
    };
    // If assessment_reports exist but with no kind info, mark selfDiscovery true as a fallback signal
    if (!Object.values(completed).some(Boolean) && (selfDisc || careerType)) {
      completed.selfDiscovery = true;
    }

    const dismissed: string[] = (journeyRes.data?.dismissed_actions as string[]) ?? [];
    const nextActions = buildActions(completed).filter((a) => !dismissed.includes(a.id));
    const stage = deriveStage(completed);
    const stageIndex = STAGES.findIndex((s) => s.key === stage);
    const doneCount = Object.values(completed).filter(Boolean).length;
    const total = Object.keys(completed).length;
    const progress = Math.round((doneCount / total) * 100) / 100;

    // Upsert derived stage back
    await supabase
      .from("passport_journeys")
      .upsert(
        { user_id: userId, stage, meta: { completed } },
        { onConflict: "user_id" },
      );

    return {
      stage,
      stageIndex,
      progress,
      completed,
      nextActions,
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
