import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GraduationCap, Search } from "lucide-react";
import { ABBREVIATION_GROUPS, type DegreeLevel } from "@/data/bawsala/academic_abbreviations";

export const Route = createFileRoute("/degrees")({
  head: () => ({
    meta: [
      { title: "الاختصارات والدرجات الأكاديمية — بوصلة" },
      { name: "description", content: "قاموس شامل لاختصارات الدرجات الأكاديمية والمسارات الترقّوية (BBA→MBA→DBA وغيرها)." },
      { property: "og:title", content: "الدرجات الأكاديمية والاختصارات — بوصلة" },
      { property: "og:description", content: "131 اختصارًا · 36 مسارًا · 18 مجموعة تخصصية." },
    ],
  }),
  component: Page,
});

const LEVEL_LABELS: Record<DegreeLevel, { ar: string; color: string }> = {
  diploma: { ar: "دبلوم", color: "#6B7280" },
  bachelor: { ar: "بكالوريوس", color: "#1D6FAB" },
  master: { ar: "ماجستير", color: "#166534" },
  doctorate: { ar: "دكتوراه", color: "#7C2D12" },
  professional_cert: { ar: "شهادة مهنية", color: "#B45309" },
  fellowship: { ar: "زمالة", color: "#6D28D9" },
  license: { ar: "ترخيص", color: "#9D174D" },
};

function Page() {
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState<DegreeLevel | "all">("all");

  const groups = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return ABBREVIATION_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        (levelFilter === "all" || it.level === levelFilter) &&
        (!qq || it.abbr.toLowerCase().includes(qq) || it.ar.includes(q) || it.en.toLowerCase().includes(qq))
      ),
    })).filter((g) => g.items.length > 0);
  }, [q, levelFilter]);

  const totalAbbrs = ABBREVIATION_GROUPS.reduce((n, g) => n + g.items.length, 0);
  const totalPathways = ABBREVIATION_GROUPS.reduce((n, g) => n + g.pathways.length, 0);

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" /> الاختصارات والدرجات
          </span>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">اختصارات الدرجات الأكاديمية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            {ABBREVIATION_GROUPS.length} مجموعة · {totalAbbrs} اختصار · {totalPathways} مسارًا ترقّويًا مقترحًا.
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاختصار أو الاسم (مثل MBA)…" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground self-center">المستوى:</span>
            {(["all", "diploma", "bachelor", "master", "doctorate", "professional_cert", "fellowship", "license"] as const).map((l) => (
              <button key={l} onClick={() => setLevelFilter(l)}
                className={`rounded-full border px-3 py-1 text-xs ${levelFilter === l ? "border-gold bg-gold/15 text-primary" : "border-border text-muted-foreground hover:border-gold/50"}`}>
                {l === "all" ? "الكل" : LEVEL_LABELS[l].ar}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-xl text-primary">{g.icon} {g.nameAr} <span className="text-xs font-normal text-muted-foreground">· {g.nameEn}</span></h2>
              </div>
              {g.pathways.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {g.pathways.map((p) => <span key={p} className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">{p}</span>)}
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it) => (
                  <div key={it.abbr} className="rounded-lg border border-border bg-background p-3 text-sm">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono font-semibold text-primary">{it.abbr}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: `${LEVEL_LABELS[it.level].color}22`, color: LEVEL_LABELS[it.level].color }}>{LEVEL_LABELS[it.level].ar}</span>
                    </div>
                    <div className="mt-1 text-primary">{it.ar}</div>
                    <div className="text-[11px] text-muted-foreground">{it.en}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">لا توجد نتائج.</div>}
        </div>
      </div>
    </section>
  );
}
