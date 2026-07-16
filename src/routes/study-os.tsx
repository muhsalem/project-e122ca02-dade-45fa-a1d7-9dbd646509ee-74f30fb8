import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Play, Pause, RotateCcw, SkipForward, Plus, Trash2, Brain, Timer,
  CalendarDays, Sparkles, CheckCircle2, XCircle, BookOpen, Loader2,
} from "lucide-react";
import { studyDailyCheckin } from "@/lib/study-checkin.functions";

export const Route = createFileRoute("/study-os")({
  head: () => ({
    meta: [
      { title: "Study OS — نظام المذاكرة الذكي | بوصلة" },
      { name: "description", content: "نظام مذاكرة متكامل: Pomodoro، بطاقات Flashcards بالتكرار المتباعد (SM-2)، جدول يومي متكيّف، وفحص يومي بالذكاء الاصطناعي." },
    ],
  }),
  component: StudyOS,
});

function StudyOS() {
  return (
    <main dir="rtl" className="container-page py-10">
      <header className="mb-8 text-center">
        <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/15">Study OS v1</Badge>
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">نظام المذاكرة الذكي</h1>
        <p className="mt-3 text-muted-foreground">Pomodoro • بطاقات بالتكرار المتباعد • جدول يومي متكيّف • فحص يومي بالذكاء الاصطناعي</p>
      </header>

      <Tabs defaultValue="checkin" className="mx-auto max-w-5xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checkin"><Sparkles className="ms-1 h-4 w-4" />فحص اليوم</TabsTrigger>
          <TabsTrigger value="pomodoro"><Timer className="ms-1 h-4 w-4" />Pomodoro</TabsTrigger>
          <TabsTrigger value="flashcards"><Brain className="ms-1 h-4 w-4" />البطاقات</TabsTrigger>
          <TabsTrigger value="schedule"><CalendarDays className="ms-1 h-4 w-4" />الجدول</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-6"><DailyCheckin /></TabsContent>
        <TabsContent value="pomodoro" className="mt-6"><Pomodoro /></TabsContent>
        <TabsContent value="flashcards" className="mt-6"><Flashcards /></TabsContent>
        <TabsContent value="schedule" className="mt-6"><ScheduleView /></TabsContent>
      </Tabs>
    </main>
  );
}

/* ============================== Pomodoro ============================== */

type PomoPhase = "focus" | "short" | "long";
const PHASES: Record<PomoPhase, { label: string; minutes: number; color: string }> = {
  focus: { label: "تركيز", minutes: 25, color: "bg-primary" },
  short: { label: "راحة قصيرة", minutes: 5, color: "bg-emerald-500" },
  long: { label: "راحة طويلة", minutes: 15, color: "bg-amber-500" },
};

function Pomodoro() {
  const [phase, setPhase] = useState<PomoPhase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(PHASES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const key = `bosla:pomo:count:${new Date().toDateString()}`;
    return Number(localStorage.getItem(key) || 0);
  });
  const [currentTask, setCurrentTask] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { onPhaseEnd(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  function onPhaseEnd() {
    setRunning(false);
    try { audioRef.current?.play(); } catch {}
    if (phase === "focus") {
      const next = completed + 1;
      setCompleted(next);
      const key = `bosla:pomo:count:${new Date().toDateString()}`;
      localStorage.setItem(key, String(next));
      const nextPhase: PomoPhase = next % 4 === 0 ? "long" : "short";
      switchPhase(nextPhase);
      toast.success("أحسنت! أكملت جلسة تركيز.");
    } else {
      switchPhase("focus");
      toast("ابدأ جلسة التركيز التالية.");
    }
  }

  function switchPhase(p: PomoPhase) {
    setPhase(p);
    setSecondsLeft(PHASES[p].minutes * 60);
  }

  const total = PHASES[phase].minutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pomodoro Timer</span>
          <Badge variant="secondary">اليوم: {completed} جلسة</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          {(Object.keys(PHASES) as PomoPhase[]).map((p) => (
            <Button key={p} variant={phase === p ? "default" : "outline"} size="sm" onClick={() => switchPhase(p)}>
              {PHASES[p].label} · {PHASES[p].minutes}د
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
          <div className="font-mono text-7xl font-bold text-primary tabular-nums">{mm}:{ss}</div>
          <div className="mt-2 text-sm text-muted-foreground">{PHASES[phase].label}</div>
          <Progress value={progress} className="mt-6" />
        </div>

        <div>
          <Label>المهمة الحالية</Label>
          <Input value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="مثال: مراجعة الوحدة الثانية — رياضيات" />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setRunning((r) => !r)} className="flex-1">
            {running ? <><Pause className="ms-2 h-4 w-4" />إيقاف</> : <><Play className="ms-2 h-4 w-4" />بدء</>}
          </Button>
          <Button variant="outline" onClick={() => setSecondsLeft(PHASES[phase].minutes * 60)}>
            <RotateCcw className="ms-2 h-4 w-4" />صفّر
          </Button>
          <Button variant="outline" onClick={onPhaseEnd}>
            <SkipForward className="ms-2 h-4 w-4" />تخطّي
          </Button>
        </div>

        <audio ref={audioRef} src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" />
      </CardContent>
    </Card>
  );
}

/* ============================== Flashcards (SM-2) ============================== */

type Card = {
  id: string;
  front: string;
  back: string;
  deck: string;
  ease: number;   // SM-2 EF
  interval: number; // days
  reps: number;
  dueAt: number; // ms epoch
  createdAt: number;
};

const CARDS_KEY = "bosla:flashcards:v1";

function loadCards(): Card[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CARDS_KEY) || "[]"); } catch { return []; }
}
function saveCards(c: Card[]) { localStorage.setItem(CARDS_KEY, JSON.stringify(c)); }

// SM-2 grading: q 0..5 (we use 1=صعب,3=مقبول,5=سهل)
function reviewCard(card: Card, quality: number): Card {
  let { ease, interval, reps } = card;
  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const dueAt = Date.now() + interval * 86400000;
  return { ...card, ease, interval, reps, dueAt };
}

function Flashcards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deck, setDeck] = useState("عام");
  const [reviewing, setReviewing] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setCards(loadCards()); }, []);

  const dueCards = useMemo(
    () => cards.filter((c) => c.dueAt <= Date.now()).sort((a, b) => a.dueAt - b.dueAt),
    [cards],
  );

  function addCard() {
    if (!front.trim() || !back.trim()) { toast.error("املأ الوجهين"); return; }
    const c: Card = {
      id: crypto.randomUUID(), front: front.trim(), back: back.trim(),
      deck: deck.trim() || "عام", ease: 2.5, interval: 0, reps: 0,
      dueAt: Date.now(), createdAt: Date.now(),
    };
    const next = [...cards, c];
    setCards(next); saveCards(next);
    setFront(""); setBack("");
    toast.success("أُضيفت البطاقة");
  }

  function removeCard(id: string) {
    const next = cards.filter((c) => c.id !== id);
    setCards(next); saveCards(next);
  }

  function grade(quality: number) {
    const current = dueCards[idx];
    if (!current) return;
    const updated = reviewCard(current, quality);
    const next = cards.map((c) => c.id === current.id ? updated : c);
    setCards(next); saveCards(next);
    setShowBack(false);
    if (idx + 1 >= dueCards.length) {
      setReviewing(false); setIdx(0);
      toast.success("أنهيت جلسة المراجعة!");
    } else {
      setIdx(idx + 1);
    }
  }

  if (reviewing && dueCards[idx]) {
    const c = dueCards[idx];
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>مراجعة · {idx + 1} / {dueCards.length}</span>
            <Badge>{c.deck}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="min-h-[220px] cursor-pointer rounded-2xl border bg-secondary/40 p-8 text-center text-xl leading-loose"
            onClick={() => setShowBack((s) => !s)}
          >
            <div className="text-sm text-muted-foreground mb-3">{showBack ? "الإجابة" : "السؤال — انقر للقلب"}</div>
            <div className="whitespace-pre-wrap">{showBack ? c.back : c.front}</div>
          </div>

          {showBack ? (
            <div className="grid grid-cols-3 gap-2">
              <Button variant="destructive" onClick={() => grade(1)}><XCircle className="ms-1 h-4 w-4" />صعب</Button>
              <Button variant="secondary" onClick={() => grade(3)}>مقبول</Button>
              <Button onClick={() => grade(5)}><CheckCircle2 className="ms-1 h-4 w-4" />سهل</Button>
            </div>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => setShowBack(true)}>إظهار الإجابة</Button>
          )}

          <Button variant="ghost" className="w-full" onClick={() => { setReviewing(false); setIdx(0); setShowBack(false); }}>
            إنهاء الجلسة
          </Button>
        </CardContent>
      </Card>
    );
  }

  const decks = Array.from(new Set(cards.map((c) => c.deck)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>البطاقات — تكرار متباعد (SM-2)</span>
            <Badge variant="secondary">مستحق اليوم: {dueCards.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" disabled={dueCards.length === 0} onClick={() => { setReviewing(true); setIdx(0); }}>
            <BookOpen className="ms-2 h-4 w-4" />ابدأ مراجعة اليوم ({dueCards.length})
          </Button>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>الوجه الأمامي (سؤال)</Label>
              <Textarea rows={3} value={front} onChange={(e) => setFront(e.target.value)} />
            </div>
            <div>
              <Label>الوجه الخلفي (جواب)</Label>
              <Textarea rows={3} value={back} onChange={(e) => setBack(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <Label>الديك (الموضوع)</Label>
              <Input value={deck} onChange={(e) => setDeck(e.target.value)} list="decks" />
              <datalist id="decks">{decks.map((d) => <option key={d} value={d} />)}</datalist>
            </div>
            <div className="flex items-end">
              <Button onClick={addCard} className="w-full md:w-auto"><Plus className="ms-1 h-4 w-4" />إضافة</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {cards.length > 0 && (
        <Card>
          <CardHeader><CardTitle>كل البطاقات ({cards.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-[400px] space-y-2 overflow-auto">
              {cards.map((c) => (
                <div key={c.id} className="flex items-start justify-between rounded-lg border p-3 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{c.front}</div>
                    <div className="text-muted-foreground">{c.back}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {c.deck} · فاصل {c.interval}ي · EF {c.ease.toFixed(2)} · مستحق {new Date(c.dueAt).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeCard(c.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ============================== Daily Check-in ============================== */

type Plan = {
  motivation: string;
  recommendations: string[];
  schedule: { start: string; end: string; kind: "study" | "break-short" | "break-long"; task: string }[];
  closing: string;
};

const PLAN_KEY = "bosla:studyplan:v1";

function DailyCheckin() {
  const checkin = useServerFn(studyDailyCheckin);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [sleepHours, setSleep] = useState(7);
  const [yesterdayDone, setYesterday] = useState("");
  const [todayGoals, setGoals] = useState("");
  const [blockers, setBlockers] = useState("");
  const [availableMinutes, setAvailable] = useState(180);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(PLAN_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.date === new Date().toDateString()) setPlan(p.plan);
      }
    } catch {}
  }, []);

  async function submit() {
    setLoading(true);
    try {
      const res = await checkin({ data: { mood, energy, focus, sleepHours, yesterdayDone, todayGoals, blockers, availableMinutes } });
      setPlan(res.plan);
      localStorage.setItem(PLAN_KEY, JSON.stringify({ date: new Date().toDateString(), plan: res.plan }));
      toast.success("تم توليد خطتك اليومية.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "خطأ غير متوقع");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>كيف أنت اليوم؟</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <SliderRow label="المزاج" value={mood} onChange={setMood} />
          <SliderRow label="الطاقة" value={energy} onChange={setEnergy} />
          <SliderRow label="التركيز" value={focus} onChange={setFocus} />
          <div>
            <Label>ساعات النوم: {sleepHours}</Label>
            <Slider value={[sleepHours]} min={0} max={12} step={1} onValueChange={(v) => setSleep(v[0])} />
          </div>
          <div>
            <Label>الوقت المتاح للدراسة اليوم (دقيقة): {availableMinutes}</Label>
            <Slider value={[availableMinutes]} min={30} max={480} step={15} onValueChange={(v) => setAvailable(v[0])} />
          </div>
          <div>
            <Label>ما أنجزته أمس</Label>
            <Textarea rows={2} value={yesterdayDone} onChange={(e) => setYesterday(e.target.value)} />
          </div>
          <div>
            <Label>أهدافك اليوم</Label>
            <Textarea rows={3} value={todayGoals} onChange={(e) => setGoals(e.target.value)} placeholder="مثال: مراجعة رياضيات ف3، حل 20 سؤال فيزياء" />
          </div>
          <div>
            <Label>عوائق أو قلق</Label>
            <Textarea rows={2} value={blockers} onChange={(e) => setBlockers(e.target.value)} />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Sparkles className="ms-2 h-4 w-4" />}
            ولّد خطتي اليوم
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>خطة اليوم</CardTitle></CardHeader>
        <CardContent>
          {!plan ? (
            <p className="text-sm text-muted-foreground">أكمل الفحص لتحصل على رسالة تحفيز، توصيات، وجدول مذاكرة متكيّف.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-primary/5 p-4 leading-7">{plan.motivation}</div>
              <div>
                <div className="mb-2 font-semibold">توصيات:</div>
                <ul className="list-inside list-disc space-y-1">{plan.recommendations?.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
              <div>
                <div className="mb-2 font-semibold">الجدول:</div>
                <div className="space-y-1">
                  {plan.schedule?.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between rounded border p-2 ${s.kind === "study" ? "bg-primary/5" : "bg-muted/50"}`}>
                      <span className="font-mono text-xs tabular-nums">{s.start} – {s.end}</span>
                      <span className="flex-1 px-3">{s.task}</span>
                      <Badge variant={s.kind === "study" ? "default" : "secondary"}>
                        {s.kind === "study" ? "تركيز" : s.kind === "break-long" ? "راحة طويلة" : "راحة"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-900 dark:text-emerald-100">{plan.closing}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}: {value}/5</Label>
      <Slider value={[value]} min={1} max={5} step={1} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

/* ============================== Schedule (from saved plan) ============================== */

function ScheduleView() {
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(PLAN_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.date === new Date().toDateString()) setPlan(p.plan);
      }
    } catch {}
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>جدول اليوم المتكيّف</CardTitle></CardHeader>
      <CardContent>
        {!plan ? (
          <p className="text-sm text-muted-foreground">لا يوجد جدول محفوظ اليوم. اذهب إلى تبويب «فحص اليوم» وولّد خطتك.</p>
        ) : (
          <div className="space-y-2">
            {plan.schedule.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${s.kind === "study" ? "border-primary/30 bg-primary/5" : "bg-muted/40"}`}>
                <div className="font-mono text-sm tabular-nums w-24">{s.start} – {s.end}</div>
                <div className="flex-1">{s.task}</div>
                <Badge variant={s.kind === "study" ? "default" : "secondary"}>
                  {s.kind === "study" ? "تركيز" : s.kind === "break-long" ? "راحة طويلة" : "راحة"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
