import { LIKERT_5, LikertValue } from "@/lib/psychometrics";

type Item = { id: string; text: string; reverse?: boolean };

export function LikertGroup({
  title,
  intro,
  items,
  answers,
  onChange,
}: {
  title: string;
  intro?: string;
  items: Item[];
  answers: Record<string, number | undefined>;
  onChange: (id: string, v: LikertValue) => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[var(--shadow-soft)]">
      <header className="mb-4">
        <h2 className="font-serif text-lg text-primary md:text-xl">{title}</h2>
        {intro && <p className="mt-1 text-xs text-muted-foreground">{intro}</p>}
      </header>
      <ul className="space-y-4">
        {items.map((it, i) => (
          <li key={it.id} className="rounded-xl border border-border/70 bg-background/60 p-3.5">
            <div className="mb-2.5 flex items-start gap-2">
              <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">{i + 1}</span>
              <p className="text-sm leading-7 text-primary">{it.text}</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={it.text}>
              {LIKERT_5.map((opt) => {
                const active = answers[it.id] === opt.v;
                return (
                  <button
                    type="button"
                    key={opt.v}
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange(it.id, opt.v as LikertValue)}
                    className={`flex-1 min-w-[88px] rounded-md border px-2 py-1.5 text-[11px] transition-colors ${
                      active
                        ? "border-gold bg-gold/15 font-semibold text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-gold/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
