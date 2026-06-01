import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, BookOpen, ChevronLeft, Sparkles } from "lucide-react";
import { explainSpecialization } from "@/lib/specialization-explorer.functions";
import specData from "@/data/specializations.json";

type Sub = string;
type GeneralSpec = { name: string; subs: Sub[] };
type Field = {
  id: string;
  label: string;
  icon: string;
  color: { bg: string; text: string; tagBg: string; tagText: string };
  generalSpecs: GeneralSpec[];
};

const FIELDS: Field[] = (specData as { classicFields: Field[] }).classicFields;

export const Route = createFileRoute("/specializations")({
  head: () => ({
    meta: [
      { title: "خريطة التخصصات الجامعية الشاملة — بوصلة" },
      {
        name: "description",
        content:
          "استكشف +450 تخصصًا دقيقًا عبر 12 مجالًا، وتعرّف على المسارات المهنية والمميزات والتحديات لكل تخصص.",
      },
    ],
  }),
  component: SpecializationsPage,
});

function SpecializationsPage() {
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [generalName, setGeneralName] = useState<string | null>(null);
  const [deep, setDeep] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const explainFn = useServerFn(explainSpecialization);

  const field = useMemo(() => FIELDS.find((f) => f.id === fieldId) ?? null, [fieldId]);
  const general = useMemo(
    () => field?.generalSpecs.find((g) => g.name === generalName) ?? null,
    [field, generalName],
  );

  const handlePickDeep = async (sub: string) => {
    if (!field || !general) return;
    setDeep(sub);
    setReport("");
    setError(null);
    setLoading(true);
    try {
      const res = await explainFn({
        data: { fieldLabel: field.label, generalSpec: general.name, deepSpec: sub },
      });
      setReport(res.report);
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  const reset = (level: "field" | "general") => {
    if (level === "field") {
      setFieldId(null);
      setGeneralName(null);
      setDeep(null);
      setReport("");
    } else {
      setGeneralName(null);
      setDeep(null);
      setReport("");
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5 text-gold" />
            خريطة التخصصات الجامعية
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">استكشف التخصصات</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            12 مجالًا • 63 تخصصًا عامًا • +450 تخصصًا دقيقًا. اختر تخصصك واعرف المسارات
            المهنية والمميزات والتحديات.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {/* Breadcrumb */}
        <nav className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => reset("field")}
            className={`hover:text-primary ${!fieldId ? "font-semibold text-primary" : ""}`}
          >
            المجالات
          </button>
          {field && (
            <>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <button
                onClick={() => reset("general")}
                className={`hover:text-primary ${!generalName ? "font-semibold text-primary" : ""}`}
              >
                {field.icon} {field.label}
              </button>
            </>
          )}
          {general && (
            <>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className={`${!deep ? "font-semibold text-primary" : ""}`}>{general.name}</span>
            </>
          )}
          {deep && (
            <>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className="font-semibold text-gold">{deep}</span>
            </>
          )}
        </nav>

        {/* Step 1: pick field */}
        {!field && (
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFieldId(f.id)}
                className="group rounded-2xl border border-border bg-card p-5 text-right transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[var(--shadow-soft)]"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: f.color.bg, color: f.color.text }}
                >
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg text-primary">{f.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {f.generalSpecs.length} تخصصات عامة •{" "}
                  {f.generalSpecs.reduce((n, g) => n + g.subs.length, 0)} تخصص دقيق
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: pick general spec */}
        {field && !general && (
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 font-serif text-xl text-primary">
              اختر التخصص العام داخل {field.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {field.generalSpecs.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setGeneralName(g.name)}
                  className="rounded-xl border border-border bg-card p-4 text-right transition hover:border-gold/60 hover:shadow-[var(--shadow-soft)]"
                >
                  <h3 className="font-medium text-primary">{g.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.subs.length} تخصص دقيق
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {g.subs.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{ backgroundColor: field.color.tagBg, color: field.color.tagText }}
                      >
                        {s}
                      </span>
                    ))}
                    {g.subs.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{g.subs.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: pick deep spec */}
        {field && general && (
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 font-serif text-xl text-primary">
              اختر التخصص الدقيق داخل {general.name}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {general.subs.map((sub) => {
                const active = deep === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => handlePickDeep(sub)}
                    disabled={loading}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                      active
                        ? "border-gold bg-gold/10 text-primary"
                        : "border-border bg-background hover:border-primary/40"
                    } ${loading && !active ? "opacity-50" : ""}`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {loading && (
              <div className="mt-8 flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <p className="mt-4 text-sm text-muted-foreground">
                  يحلل الذكاء الاصطناعي تخصص &quot;{deep}&quot;...
                </p>
              </div>
            )}

            {error && (
              <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {!loading && report && (
              <article className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  تحليل مولّد بالذكاء الاصطناعي للتخصص الدقيق
                </div>
                <div
                  className="prose prose-sm max-w-none text-foreground prose-headings:font-serif prose-headings:text-primary prose-strong:text-primary prose-li:my-0.5"
                  style={{ direction: "rtl" }}
                  dangerouslySetInnerHTML={{ __html: mdToHtml(report) }}
                />
              </article>
            )}
          </div>
        )}
      </section>
    </>
  );
}

// Lightweight markdown → HTML (headings, bold, lists, paragraphs)
function mdToHtml(md: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };
  const inline = (s: string) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      out.push(`<h2 class="mt-6 mb-3 text-xl">${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      closeList();
      out.push(`<h3 class="mt-4 mb-2 text-base">${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("# ")) {
      closeList();
      out.push(`<h1 class="mt-4 mb-3 text-2xl">${inline(line.slice(2))}</h1>`);
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul class="my-2 list-disc pr-5 space-y-1">');
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
    } else {
      closeList();
      out.push(`<p class="my-2 leading-7">${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join("\n");
}
