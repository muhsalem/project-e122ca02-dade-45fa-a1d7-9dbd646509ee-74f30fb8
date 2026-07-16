import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSim, type CareerSim, type SimScenario } from "@/data/career-sims";
import { evaluateCareerSim } from "@/lib/career-sim.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, Clock, Sparkles, Loader2, CheckCircle2,
  Briefcase, DollarSign, Target, RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/career-sims/$slug")({
  head: ({ params }) => {
    const sim = getSim(params.slug);
    return {
      meta: sim
        ? [
            { title: `محاكاة ${sim.title} — 15 دقيقة | بوصلة` },
            { name: "description", content: `${sim.tagline}. عش يوماً في حياة ${sim.title} واحصل على تقييم AI لمدى ملاءمتك.` },
          ]
        : [{ title: "محاكاة مهنية | بوصلة" }],
    };
  },
  loader: ({ params }) => {
    const sim = getSim(params.slug);
    if (!sim) throw notFound();
    return { sim };
  },
  notFoundComponent: () => (
    <main dir="rtl" className="container-page py-16 text-center">
      <h1 className="text-2xl font-bold">المحاكاة غير موجودة</h1>
      <Button asChild className="mt-4"><Link to="/career-sims">عودة للقائمة</Link></Button>
    </main>
  ),
  errorComponent: () => (
    <main dir="rtl" className="container-page py-16 text-center">
      <p>حدث خطأ.</p>
      <Button asChild className="mt-4"><Link to="/career-sims">عودة للقائمة</Link></Button>
    </main>
  ),
  component: SimPage,
});

type Answer = { scenarioId: string; choiceId: string; timeMs: number };

type EvalPayload = {
  fitScore: number;
  verdict: string;
  strengths: string[];
  growthAreas: string[];
  perDecision: { scenarioId: string; quality: string; feedback: string }[];
  narrative: string;
  nextSteps: string[];
};

function SimPage() {
  const { sim } = Route.useLoaderData();
  const evaluate = useServerFn(evaluateCareerSim);
  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [evaluation, setEvaluation] = useState<EvalPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const startRef = useRef<number>(0);
  const questionStartRef = useRef<number>(0);
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    if (stage !== "play") return;
    const t = setInterval(() => setNowTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

  function begin() {
    setStage("play");
    setIdx(0);
    setAnswers([]);
    setEvaluation(null);
    startRef.current = Date.now();
    questionStartRef.current = Date.now();
  }

  async function pick(choiceId: string) {
    const sc = sim.scenarios[idx];
    const timeMs = Date.now() - questionStartRef.current;
    const ans: Answer = { scenarioId: sc.id, choiceId, timeMs };
    const next = [...answers, ans];
    setAnswers(next);

    if (idx + 1 < sim.scenarios.length) {
      setIdx(idx + 1);
      questionStartRef.current = Date.now();
    } else {
      setLoading(true);
      try {
        const res = await evaluate({
          data: { slug: sim.slug, answers: next, totalTimeMs: Date.now() - startRef.current },
        });
        setEvaluation(res.evaluation as EvalPayload);
        setStage("done");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "خطأ في التقييم");
        setStage("play");
        setIdx(sim.scenarios.length - 1);
        setAnswers(answers);
      } finally {
        setLoading(false);
      }
    }
  }

  const elapsed = stage === "play" ? Math.floor((Date.now() - startRef.current) / 1000) : 0;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = String(elapsed % 60).padStart(2, "0");
  const timePct = Math.min(100, (elapsed / (15 * 60)) * 100);
  void nowTick;

  return (
    <main dir="rtl" className="container-page py-8">
      <Link to="/career-sims" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowRight className="h-4 w-4" /> كل المحاكاة
      </Link>

      {stage === "intro" && (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <div className="mb-3 text-6xl">{sim.emoji}</div>
            <h1 className="font-serif text-3xl font-bold text-primary">{sim.title}</h1>
            <p className="mt-2 text-muted-foreground">{sim.tagline}</p>
          </div>

          <Card>
            <CardHeader><CardTitle>يوم في حياة {sim.title}</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-8 text-foreground/90 dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: sim.dayInLife
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>"),
                }}
              />
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><Briefcase className="h-4 w-4 text-primary" /> بيئة العمل</div>
                <p className="text-sm text-muted-foreground">{sim.workEnvironment}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><DollarSign className="h-4 w-4 text-primary" /> نطاق الدخل</div>
                <p className="text-sm text-muted-foreground">{sim.salaryHint}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-primary" /> كفاءات محورية</div>
                <div className="flex flex-wrap gap-1">
                  {sim.competencies.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Clock className="h-4 w-4" /> المحاكاة تستغرق 15 دقيقة تقريباً · {sim.scenarios.length} قرارات
              </div>
              <p className="max-w-lg text-sm text-muted-foreground">
                ستواجه مواقف حقيقية في يوم عمل. اختر كما تختار فعلاً — لا يوجد جواب "صحيح" واحد. الذكاء الاصطناعي سيحلل قراراتك ويعطيك تقييم ملاءمة صادق.
              </p>
              <Button size="lg" onClick={begin} className="w-full max-w-xs">
                <Sparkles className="ms-2 h-4 w-4" /> ابدأ المحاكاة الآن
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "play" && (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{idx + 1} / {sim.scenarios.length}</Badge>
            <div className={`flex items-center gap-2 font-mono tabular-nums ${elapsed > 15 * 60 ? "text-destructive" : "text-muted-foreground"}`}>
              <Clock className="h-4 w-4" /> {elapsedMin}:{elapsedSec}
            </div>
          </div>
          <Progress value={((idx) / sim.scenarios.length) * 100} />
          <Progress value={timePct} className="h-1 opacity-60" />

          {loading ? (
            <Card><CardContent className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>يحلّل الذكاء الاصطناعي قراراتك…</span>
            </CardContent></Card>
          ) : (
            <ScenarioCard
              key={sim.scenarios[idx].id}
              scenario={sim.scenarios[idx]}
              onPick={pick}
            />
          )}
        </div>
      )}

      {stage === "done" && evaluation && (
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="text-center">
              <div className="mb-2 text-5xl">{sim.emoji}</div>
              <CardTitle className="font-serif text-2xl">{sim.title} — نتيجتك</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div>
                <div className="text-6xl font-bold text-primary">{Math.round(evaluation.fitScore ?? 0)}</div>
                <div className="text-sm text-muted-foreground">مؤشر الملاءمة / 100</div>
              </div>
              <Badge className="text-sm">{evaluation.verdict}</Badge>
              <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground">{evaluation.narrative}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">نقاط قوّتك</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {evaluation.strengths?.map((s, i) => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{s}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">فرص التطوير</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {evaluation.growthAreas?.map((g, i) => (
                    <li key={i} className="flex gap-2"><Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>{g}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">تحليل قرار بقرار</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {evaluation.perDecision?.map((d, i) => {
                const sc = sim.scenarios.find((s) => s.id === d.scenarioId);
                const ans = answers.find((a) => a.scenarioId === d.scenarioId);
                const chosen = sc?.choices.find((c) => c.id === ans?.choiceId);
                const color =
                  d.quality === "excellent" ? "border-emerald-500/50 bg-emerald-500/5" :
                  d.quality === "good" ? "border-primary/40 bg-primary/5" :
                  d.quality === "fair" ? "border-amber-500/50 bg-amber-500/5" :
                  "border-destructive/40 bg-destructive/5";
                return (
                  <div key={i} className={`rounded-lg border p-3 ${color}`}>
                    <div className="mb-1 text-xs text-muted-foreground">{sc?.time} — {sc?.question}</div>
                    <div className="mb-2 text-sm font-medium">اختيارك: {chosen?.label ?? "—"}</div>
                    <div className="text-sm leading-6">{d.feedback}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader><CardTitle className="text-lg">خطوات مقترحة</CardTitle></CardHeader>
            <CardContent>
              <ol className="list-inside list-decimal space-y-2 text-sm">
                {evaluation.nextSteps?.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={begin} className="flex-1">
              <RotateCcw className="ms-2 h-4 w-4" /> أعِد المحاكاة
            </Button>
            <Button asChild className="flex-1">
              <Link to="/career-sims"><ArrowLeft className="ms-2 h-4 w-4" /> جرّب محاكاة أخرى</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

function ScenarioCard({
  scenario,
  onPick,
}: {
  scenario: ReturnType<typeof getSim> extends infer T ? T extends { scenarios: infer S } ? S extends Array<infer U> ? U : never : never : never;
  onPick: (choiceId: string) => void;
}) {
  const sc = scenario as { id: string; time: string; situation: string; question: string; choices: { id: string; label: string }[] };
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2">
      <CardHeader>
        <Badge variant="secondary" className="mb-2 w-fit font-mono">{sc.time}</Badge>
        <CardTitle className="text-lg leading-8">{sc.situation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm font-semibold">{sc.question}</div>
        <div className="grid gap-2">
          {sc.choices.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="rounded-lg border p-3 text-start text-sm leading-6 transition hover:border-primary hover:bg-primary/5"
            >
              {c.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
