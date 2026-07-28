import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Network, Search } from "lucide-react";
import { INTERDISCIPLINARY_GROUPS, MATURITY_LABELS, type Maturity, type Demand, type Relevance } from "@/data/bawsala/interdisciplinary_fields_complete";

export const Route = createFileRoute("/interdisciplinary")({
  head: () => ({
    meta: [
      { title: "التخصصات البينية — بوصلة" },
      { name: "description", content: "خريطة كاملة للحقول البينية: Bio-X، Neuro-X، AI-X، Data-X… بمعايير النضج والطلب والملاءمة العربية." },
      { property: "og:title", content: "التخصصات البينية — بوصلة" },
      { property: "og:description", content: "13 مجموعة و166 حقلًا بينيًا." },
    ],
  }),
  component: Page,
});

const DEMAND_LABELS: Record<Demand, { ar: string; color: string }> = {
  high: { ar: "طلب مرتفع", color: "#166534" },
  medium: { ar: "طلب متوسط", color: "#B45309" },
  low: { ar: "طلب محدود", color: "#6B7280" },
};
const REL_LABELS: Record<Relevance, { ar: string; color: string }> = {
  high: { ar: "ملاءمة عربية عالية", color: "#1D6FAB" },
  medium: { ar: "ملاءمة متوسطة", color: "#B45309" },
  low: { ar: "ملاءمة منخفضة", color: "#9CA3AF" },
};

function Page() {
  const [q, setQ] = useState("");
  const [maturityFilter, setMaturityFilter] = useState<Maturity | "all">("all");
  const [demandFilter, setDemandFilter] = useState<Demand | "all">("all");

  const groups = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return INTERDISCIPLINARY_GROUPS.map((g) => ({
      ...g,
      fields: g.fields.filter((f) =>
        (maturityFilter === "all" || f.maturity === maturityFilter) &&
        (demandFilter === "all" || f.demand === demandFilter) &&
        (!qq || f.ar.includes(q) || f.en.toLowerCase().includes(qq) || g.nameAr.includes(q))
      ),
    })).filter((g) => g.fields.length > 0);
  }, [q, maturityFilter, demandFilter]);

  const totalFields = INTERDISCIPLINARY_GROUPS.reduce((n, g) => n + g.fields.length, 0);

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Network className="h-3.5 w-3.5 text-gold" /> التخصصات البينية
          </span>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">حقول ما بين التخصصات</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            {INTERDISCIPLINARY_GROUPS.length} مجموعة · {totalFields} حقل بينيّ — مصنّفة بالنضج المؤسسي، طلب السوق، وملاءمة السياق العربي.
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في الحقول البينية…" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground self-center">النضج:</span>
            {(["all", "institutionalized", "established", "emerging", "frontier"] as const).map((m) => (
              <button key={m} onClick={() => setMaturityFilter(m)}
                className={`rounded-full border px-3 py-1 text-xs ${maturityFilter === m ? "border-gold bg-gold/15 text-primary" : "border-border text-muted-foreground hover:border-gold/50"}`}>
                {m === "all" ? "الكل" : MATURITY_LABELS[m].ar}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground self-center">الطلب:</span>
            {(["all", "high", "medium", "low"] as const).map((d) => (
              <button key={d} onClick={() => setDemandFilter(d)}
                className={`rounded-full border px-3 py-1 text-xs ${demandFilter === d ? "border-gold bg-gold/15 text-primary" : "border-border text-muted-foreground hover:border-gold/50"}`}>
                {d === "all" ? "الكل" : DEMAND_LABELS[d].ar}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-xl text-primary">{g.icon} {g.nameAr} <span className="text-xs font-normal text-muted-foreground">· {g.nameEn}</span></h2>
                <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">{g.pattern}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {g.fields.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border bg-background p-3 text-sm">
                    <div className="font-medium text-primary">{f.ar}</div>
                    <div className="text-[11px] text-muted-foreground">{f.en}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: `${MATURITY_LABELS[f.maturity].color}22`, color: MATURITY_LABELS[f.maturity].color }}>{MATURITY_LABELS[f.maturity].ar}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: `${DEMAND_LABELS[f.demand].color}22`, color: DEMAND_LABELS[f.demand].color }}>{DEMAND_LABELS[f.demand].ar}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: `${REL_LABELS[f.arabicRelevance].color}22`, color: REL_LABELS[f.arabicRelevance].color }}>{REL_LABELS[f.arabicRelevance].ar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">لا توجد نتائج للمرشحات الحالية.</div>}
        </div>
      </div>
    </section>
  );
}
