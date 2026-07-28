import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, Search } from "lucide-react";
import { ACADEMIC_FIELDS, CATEGORIES, COMPREHENSIVENESS_AUDIT, type CategoryId, type AcademicField, type Discipline } from "@/data/bawsala/academic_disciplines";

export const Route = createFileRoute("/academic-disciplines")({
  head: () => ({
    meta: [
      { title: "قاعدة التخصصات الأكاديمية (v4) — بوصلة" },
      { name: "description", content: "استكشف 39 مجالًا و128 تخصصًا عامًا و585 تخصصًا دقيقًا وفق ISCED-F 2013، مع رموز التصنيف الدولي." },
      { property: "og:title", content: "قاعدة التخصصات الأكاديمية v4 — بوصلة" },
      { property: "og:description", content: "قاعدة بيانات أكاديمية شاملة بترميز ISCED لكل تخصص." },
    ],
  }),
  component: Page,
});

function Page() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [q, setQ] = useState("");
  const [openField, setOpenField] = useState<string | null>(null);

  const fields = useMemo(() => {
    const base = cat === "all" ? ACADEMIC_FIELDS : ACADEMIC_FIELDS.filter(f => f.category === cat);
    if (!q.trim()) return base;
    const qq = q.trim().toLowerCase();
    return base.filter(f =>
      f.nameAr.includes(q) || f.nameEn.toLowerCase().includes(qq) ||
      f.disciplines.some(d => d.nameAr.includes(q) || d.nameEn.toLowerCase().includes(qq) ||
        d.subDisciplines.some(s => s.ar.includes(q) || s.en.toLowerCase().includes(qq) || (s.isced ?? "").toLowerCase().includes(qq)))
    );
  }, [cat, q]);

  const openFieldObj = openField ? ACADEMIC_FIELDS.find(f => f.id === openField) ?? null : null;

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5 text-gold" /> ISCED-F 2013 · موسوعة {COMPREHENSIVENESS_AUDIT.version}

          </span>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">قاعدة التخصصات الأكاديمية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            {ACADEMIC_FIELDS.length} مجالًا · {ACADEMIC_FIELDS.reduce((n,f)=>n+f.disciplines.length,0)} تخصصًا عامًا · {ACADEMIC_FIELDS.reduce((n,f)=>n+f.disciplines.reduce((m,d)=>m+d.subDisciplines.length,0),0)} تخصصًا دقيقًا — بترميز ISCED.
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم العربي/الإنجليزي أو رمز ISCED…" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = cat === c.id;
              return (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-gold bg-gold/15 font-semibold text-primary" : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:text-primary"}`}
                  style={active ? undefined : { borderColor: undefined }}>
                  <span className="inline-block h-2 w-2 rounded-full ml-1 align-middle" style={{ backgroundColor: c.color }} />
                  {c.labelAr}
                </button>
              );
            })}
          </div>
        </div>

        {!openFieldObj ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => <FieldCard key={f.id} f={f} onOpen={() => setOpenField(f.id)} />)}
            {fields.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">لا توجد نتائج.</div>}
          </div>
        ) : (
          <FieldDetail f={openFieldObj} onBack={() => setOpenField(null)} />
        )}
      </div>
    </section>
  );
}

function FieldCard({ f, onOpen }: { f: AcademicField; onOpen: () => void }) {
  const subCount = f.disciplines.reduce((n, d) => n + d.subDisciplines.length, 0);
  return (
    <button onClick={onOpen} className="group rounded-2xl border border-border bg-card p-5 text-right transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: `${f.color}22`, color: f.color }}>{f.icon}</div>
      <h3 className="font-serif text-lg text-primary">{f.nameAr}</h3>
      <p className="text-xs text-muted-foreground">{f.nameEn}</p>
      <p className="mt-2 text-xs text-muted-foreground">{f.disciplines.length} تخصص عام · {subCount} تخصص دقيق</p>
    </button>
  );
}

function FieldDetail({ f, onBack }: { f: AcademicField; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4 rotate-180" /> العودة للمجالات
      </button>
      <div className="mb-6 rounded-2xl border border-border bg-card p-5" style={{ borderColor: `${f.color}44` }}>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: `${f.color}22`, color: f.color }}>{f.icon}</div>
          <div>
            <h2 className="font-serif text-2xl text-primary">{f.nameAr}</h2>
            <p className="text-sm text-muted-foreground">{f.nameEn}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {f.disciplines.map((d) => <DisciplineBlock key={d.id} d={d} color={f.color} />)}
      </div>
    </div>
  );
}

function DisciplineBlock({ d, color }: { d: Discipline; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg text-primary">{d.nameAr} <span className="text-xs font-normal text-muted-foreground">· {d.nameEn}</span></h3>
        {d.isced && <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">{d.isced}</span>}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {d.subDisciplines.map((s, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-primary">{s.ar}</span>
              {s.isced && <span className="text-[10px] text-muted-foreground">{s.isced}</span>}
            </div>
            <div className="text-[11px] text-muted-foreground">{s.en}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
