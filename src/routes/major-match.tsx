import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  computeRecommendations,
  GSCCI_LABELS,
  type DiagnosticInput,
  type RiasecProfile,
  type PersonalityProfile,
  type AgafOutput,
  type Recommendation,
} from "@/data/bawsala/bawsala_integration";
import { ACADEMIC_FIELDS } from "@/data/bawsala/academic_disciplines";

export const Route = createFileRoute("/major-match")({
  head: () => ({
    meta: [
      { title: "مطابقة التخصص — Bawsala Match" },
      { name: "description", content: "محرك دمج تشخيصي يربط RIASEC والسمات الخمس وAGAF والطموحات بقاعدة التخصصات، مع بوابة GSCCI." },
      { property: "og:title", content: "Bawsala Match — مطابقة التخصص الأكاديمي" },
      { property: "og:description", content: "توصيات مرتبة لأنسب المجالات الأكاديمية وفق بروفايلك التشخيصي." },
    ],
  }),
  component: Page,
});

// Field names dictionary for ambitions keyword matching
const FIELD_NAMES: Record<string, string[]> = Object.fromEntries(
  ACADEMIC_FIELDS.map((f) => [f.id, [f.nameAr, f.nameEn]])
);
const FIELD_LABEL: Record<string, { ar: string; icon: string }> = Object.fromEntries(
  ACADEMIC_FIELDS.map((f) => [f.id, { ar: f.nameAr, icon: f.icon }])
);

const DEFAULT_RIASEC: RiasecProfile = { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 };
const DEFAULT_PERSONALITY: PersonalityProfile = { O: 50, Cn: 50, Ex: 50, A: 50, St: 50 };
const DEFAULT_AGAF: AgafOutput = { scores: { S: 50, H: 50, L: 50, E: 50, T: 50, C: 50 }, conflicts: [] };

function Page() {
  const [riasec, setRiasec] = useState<RiasecProfile>(DEFAULT_RIASEC);
  const [personality, setPersonality] = useState<PersonalityProfile>(DEFAULT_PERSONALITY);
  const [agaf, setAgaf] = useState<AgafOutput>(DEFAULT_AGAF);
  const [ambitionKw, setAmbitionKw] = useState("");
  const [showAll, setShowAll] = useState(false);

  const input: DiagnosticInput = useMemo(() => ({
    riasec, personality, agaf,
    ambitions: { categories: [], fieldIds: [], keywords: ambitionKw.split(/[,،\s]+/).filter(Boolean) },
  }), [riasec, personality, agaf, ambitionKw]);

  const recs = useMemo(() => computeRecommendations(input, FIELD_NAMES), [input]);
  const visible = showAll ? recs : recs.slice(0, 10);

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 font-serif text-lg text-primary">RIASEC · الميول</h2>
            {(Object.keys(riasec) as (keyof RiasecProfile)[]).map((k) => (
              <Slider key={k} label={k} value={riasec[k]} onChange={(v) => setRiasec({ ...riasec, [k]: v })} />
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 font-serif text-lg text-primary">السمات الخمس (BFI-2)</h2>
            {([
              ["O", "الانفتاح"], ["Cn", "الضمير"], ["Ex", "الانبساط"], ["A", "المقبولية"], ["St", "الاتزان"],
            ] as [keyof PersonalityProfile, string][]).map(([k, ar]) => (
              <Slider key={k} label={`${k} · ${ar}`} value={personality[k]} onChange={(v) => setPersonality({ ...personality, [k]: v })} />
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 font-serif text-lg text-primary">AGAF · المجموعات المعرفية</h2>
            {([
              ["S", "علوم"], ["H", "إنسانيات"], ["L", "لغات"], ["E", "اقتصاد/أعمال"], ["T", "تقنية"], ["C", "إبداع"],
            ] as [keyof AgafOutput["scores"], string][]).map(([k, ar]) => (
              <Slider key={k} label={`${k} · ${ar}`} value={agaf.scores[k]} onChange={(v) => setAgaf({ ...agaf, scores: { ...agaf.scores, [k]: v } })} />
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-2 font-serif text-lg text-primary">طموحاتك</h2>
            <p className="mb-2 text-[11px] text-muted-foreground">كلمات مفتاحية مفصولة بفواصل (طب، هندسة برمجيات، إعلام…)</p>
            <input value={ambitionKw} onChange={(e) => setAmbitionKw(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />
          </div>
        </aside>

        <div>
          <header className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> محرك المطابقة التشخيصية
            </span>
            <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">Bawsala Match</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              يمزج RIASEC (35%) + السمات (25%) + AGAF (20%) + الطموحات (20%)، ثم تطبَّق بوابة GSCCI الشرعية.
              اضبط المؤشرات على اليمين لترى التوصيات تحدَّث فورًا.
            </p>
          </header>

          <div className="space-y-3">
            {visible.map((r, i) => <RecCard key={r.fieldId} r={r} rank={i + 1} />)}
          </div>
          {recs.length > 10 && (
            <button onClick={() => setShowAll((v) => !v)} className="mt-4 text-sm text-gold underline">
              {showAll ? "عرض أفضل 10 فقط" : `عرض جميع الـ ${recs.length} توصية`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="mb-2 block">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span><span className="font-mono">{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-gold" />
    </label>
  );
}

function RecCard({ r, rank }: { r: Recommendation; rank: number }) {
  const meta = FIELD_LABEL[r.fieldId] ?? { ar: r.fieldId, icon: "📚" };
  const g = GSCCI_LABELS[r.gscci];
  const Icon = r.excluded ? ShieldAlert : r.capped ? AlertTriangle : ShieldCheck;
  return (
    <div className={`rounded-xl border p-4 ${r.excluded ? "border-destructive/40 bg-destructive/5 opacity-70" : "border-border bg-card"}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-xl">{meta.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-base text-primary">#{rank} · {meta.ar}</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: `${g.color}22`, color: g.color }}>
                <Icon className="h-3 w-3" /> {g.ar}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.excluded ? "bg-destructive/20 text-destructive" : "bg-gold/15 text-primary"}`}>
                {r.score}
              </span>
            </div>
          </div>
          {r.gscciNote && <p className="mt-1 text-[11px] text-muted-foreground">{r.gscciNote}</p>}
          <div className="mt-2 grid grid-cols-4 gap-2 text-[11px] text-muted-foreground">
            <Metric label="RIASEC" v={r.breakdown.riasec} />
            <Metric label="السمات" v={r.breakdown.personality} />
            <Metric label="AGAF" v={r.breakdown.agaf} />
            <Metric label="الطموح" v={r.breakdown.ambitions} />
          </div>
          {r.capped && <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">مسقّف — يتطلب اعتماد هيئة شرعية قبل التوصية النهائية.</p>}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-1.5 text-center">
      <div className="text-[9px] uppercase">{label}</div>
      <div className="font-mono text-xs text-primary">{v}</div>
    </div>
  );
}
