import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  CalendarDays, Sparkles, CheckCircle2, XCircle, BookOpen, Loader2, Cloud, CloudOff,
} from "lucide-react";
import { studyDailyCheckin } from "@/lib/study-checkin.functions";
import {
  listFlashcards, upsertFlashcard, deleteFlashcard,
  getPomodoroToday, incrementPomodoro,
  getTodayPlan, saveTodayPlan,
} from "@/lib/study-sync.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/study-os")({
  head: () => ({
    meta: [
      { title: "Study OS — نظام المذاكرة الذكي | بوصلة" },
      { name: "description", content: "نظام مذاكرة متكامل مع مزامنة سحابية: Pomodoro، بطاقات Flashcards بالتكرار المتباعد (SM-2)، جدول يومي متكيّف، وفحص يومي بالذكاء الاصطناعي." },
    ],
  }),
  component: StudyOS,
});

/* ============================== Auth hook ============================== */

function useAuthUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return { userId, ready, signedIn: !!userId };
}

function SyncBadge({ signedIn }: { signedIn: boolean }) {
  return signedIn ? (
    <Badge variant="secondary" className="gap-1"><Cloud className="h-3 w-3" /> مزامنة مفعّلة</Badge>
  ) : (
    <Badge variant="outline" className="gap-1"><CloudOff className="h-3 w-3" /> محلي فقط — سجّل الدخول للمزامنة</Badge>
  );
}

function StudyOS() {
  const auth = useAuthUser();
  return (
    <main dir="rtl" className="container-page py-10">
      <header className="mb-8 text-center">
        <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/15">Study OS v1</Badge>
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">نظام المذاكرة الذكي</h1>
        <p className="mt-3 text-muted-foreground">Pomodoro • بطاقات بالتكرار المتباعد • جدول يومي متكيّف • فحص يومي بالذكاء الاصطناعي</p>
        <div className="mt-3 flex justify-center"><SyncBadge signedIn={auth.signedIn} /></div>
      </header>

      <Tabs defaultValue="checkin" className="mx-auto max-w-5xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checkin"><Sparkles className="ms-1 h-4 w-4" />فحص اليوم</TabsTrigger>
          <TabsTrigger value="pomodoro"><Timer className="ms-1 h-4 w-4" />Pomodoro</TabsTrigger>
          <TabsTrigger value="flashcards"><Brain className="ms-1 h-4 w-4" />البطاقات</TabsTrigger>
          <TabsTrigger value="schedule"><CalendarDays className="ms-1 h-4 w-4" />الجدول</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-6"><DailyCheckin signedIn={auth.signedIn} authReady={auth.ready} /></TabsContent>
        <TabsContent value="pomodoro" className="mt-6"><Pomodoro signedIn={auth.signedIn} authReady={auth.ready} /></TabsContent>
        <TabsContent value="flashcards" className="mt-6"><Flashcards signedIn={auth.signedIn} authReady={auth.ready} /></TabsContent>
        <TabsContent value="schedule" className="mt-6"><ScheduleView signedIn={auth.signedIn} authReady={auth.ready} /></TabsContent>
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

function pomoLocalKey() { return `bosla:pomo:count:${new Date().toDateString()}`; }

function Pomodoro({ signedIn, authReady }: { signedIn: boolean; authReady: boolean }) {
  const getToday = useServerFn(getPomodoroToday);
  const incr = useServerFn(incrementPomodoro);
  const [phase, setPhase] = useState<PomoPhase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(PHASES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hydrate from localStorage (offline) then overwrite from server (source of truth)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCompleted(Number(localStorage.getItem(pomoLocalKey()) || 0));
  }, []);
  useEffect(() => {
    if (!authReady || !signedIn) return;
    getToday().then((r) => {
      setCompleted(r.completed);
      localStorage.setItem(pomoLocalKey(), String(r.completed));
    }).catch(() => {});
  }, [authReady, signedIn, getToday]);

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

  async function onPhaseEnd() {
    setRunning(false);
    try { audioRef.current?.play(); } catch { /* noop */ }
    if (phase === "focus") {
      const next = completed + 1;
      setCompleted(next);
      localStorage.setItem(pomoLocalKey(), String(next));
      if (signedIn) {
        try {
          const r = await incr();
          setCompleted(r.completed);
          localStorage.setItem(pomoLocalKey(), String(r.completed));
        } catch { /* keep local */ }
      }
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

type FCard = {
  id: string;
  front: string;
  back: string;
  deck: string;
  ease: number;
  interval: number; // days
  reps: number;
  dueAt: number; // ms epoch
  createdAt: number;
};

type ServerCard = {
  id: string; front: string; back: string; deck: string;
  ease: number | string; interval_days: number; reps: number;
  due_at: string; created_at: string;
};

const CARDS_KEY = "bosla:flashcards:v1";

function loadLocalCards(): FCard[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CARDS_KEY) || "[]"); } catch { return []; }
}
function saveLocalCards(c: FCard[]) { localStorage.setItem(CARDS_KEY, JSON.stringify(c)); }

function fromServer(r: ServerCard): FCard {
  return {
    id: r.id, front: r.front, back: r.back, deck: r.deck,
    ease: Number(r.ease), interval: r.interval_days, reps: r.reps,
    dueAt: new Date(r.due_at).getTime(),
    createdAt: new Date(r.created_at).getTime(),
  };
}

function reviewCard(card: FCard, quality: number): FCard {
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

function Flashcards({ signedIn, authReady }: { signedIn: boolean; authReady: boolean }) {
  const listFn = useServerFn(listFlashcards);
  const upsertFn = useServerFn(upsertFlashcard);
  const deleteFn = useServerFn(deleteFlashcard);

  const [cards, setCards] = useState<FCard[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deck, setDeck] = useState("عام");
  const [reviewing, setReviewing] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setCards(loadLocalCards()); }, []);

  const refreshFromServer = useCallback(async () => {
    if (!signedIn) return;
    setSyncing(true);
    try {
      const rows = (await listFn()) as ServerCard[];
      const mapped = rows.map(fromServer);
      setCards(mapped);
      saveLocalCards(mapped);
    } catch (e) {
      console.warn("flashcards sync failed", e);
    } finally { setSyncing(false); }
  }, [signedIn, listFn]);

  useEffect(() => { if (authReady && signedIn) void refreshFromServer(); }, [authReady, signedIn, refreshFromServer]);

  const dueCards = useMemo(
    () => cards.filter((c) => c.dueAt <= Date.now()).sort((a, b) => a.dueAt - b.dueAt),
    [cards],
  );

  async function addCard() {
    if (!front.trim() || !back.trim()) { toast.error("املأ الوجهين"); return; }
    const c: FCard = {
      id: crypto.randomUUID(), front: front.trim(), back: back.trim(),
      deck: deck.trim() || "عام", ease: 2.5, interval: 0, reps: 0,
      dueAt: Date.now(), createdAt: Date.now(),
    };
    const next = [...cards, c];
    setCards(next); saveLocalCards(next);
    setFront(""); setBack("");
    toast.success("أُضيفت البطاقة");
    if (signedIn) {
      try {
        const saved = (await upsertFn({ data: {
          id: c.id, front: c.front, back: c.back, deck: c.deck,
          ease: c.ease, interval_days: c.interval, reps: c.reps,
          due_at: new Date(c.dueAt).toISOString(),
        } })) as ServerCard;
        const merged = next.map((x) => x.id === c.id ? fromServer(saved) : x);
        setCards(merged); saveLocalCards(merged);
      } catch (e) {
        console.warn("card upsert failed", e);
        toast.error("تعذّرت المزامنة — حُفظت محلياً");
      }
    }
  }

  async function removeCard(id: string) {
    const next = cards.filter((c) => c.id !== id);
    setCards(next); saveLocalCards(next);
    if (signedIn) {
      try { await deleteFn({ data: { id } }); } catch { toast.error("تعذّر الحذف من السحابة"); }
    }
  }

  async function grade(quality: number) {
    const current = dueCards[idx];
    if (!current) return;
    const updated = reviewCard(current, quality);
    const next = cards.map((c) => c.id === current.id ? updated : c);
    setCards(next); saveLocalCards(next);
    setShowBack(false);
    if (signedIn) {
      try {
        await upsertFn({ data: {
          id: updated.id, front: updated.front, back: updated.back, deck: updated.deck,
          ease: updated.ease, interval_days: updated.interval, reps: updated.reps,
          due_at: new Date(updated.dueAt).toISOString(),
        } });
      } catch { /* keep local */ }
    }
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
            <div className="flex items-center gap-2">
              {syncing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <Badge variant="secondary">مستحق اليوم: {dueCards.length}</Badge>
            </div>
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

function loadLocalPlan(): Plan | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(PLAN_KEY);
    if (!saved) return null;
    const p = JSON.parse(saved);
    if (p.date === new Date().toDateString()) return p.plan as Plan;
  } catch { /* noop */ }
  return null;
}
function saveLocalPlan(plan: Plan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify({ date: new Date().toDateString(), plan }));
}

function DailyCheckin({ signedIn, authReady }: { signedIn: boolean; authReady: boolean }) {
  const checkin = useServerFn(studyDailyCheckin);
  const getPlan = useServerFn(getTodayPlan);
  const savePlan = useServerFn(saveTodayPlan);
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

  useEffect(() => { setPlan(loadLocalPlan()); }, []);
  useEffect(() => {
    if (!authReady || !signedIn) return;
    getPlan().then((r) => {
      if (r?.plan) {
        setPlan(r.plan as Plan);
        saveLocalPlan(r.plan as Plan);
      }
    }).catch(() => {});
  }, [authReady, signedIn, getPlan]);

  async function submit() {
    setLoading(true);
    try {
      const inputs = { mood, energy, focus, sleepHours, yesterdayDone, todayGoals, blockers, availableMinutes };
      const res = await checkin({ data: inputs });
      setPlan(res.plan);
      saveLocalPlan(res.plan);
      if (signedIn) {
        try { await savePlan({ data: { plan: res.plan, inputs } }); }
        catch { toast.error("تعذّرت المزامنة — حُفظت الخطة محلياً"); }
      }
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

function ScheduleView({ signedIn, authReady }: { signedIn: boolean; authReady: boolean }) {
  const getPlan = useServerFn(getTodayPlan);
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => { setPlan(loadLocalPlan()); }, []);
  useEffect(() => {
    if (!authReady || !signedIn) return;
    getPlan().then((r) => {
      if (r?.plan) {
        setPlan(r.plan as Plan);
        saveLocalPlan(r.plan as Plan);
      }
    }).catch(() => {});
  }, [authReady, signedIn, getPlan]);

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
