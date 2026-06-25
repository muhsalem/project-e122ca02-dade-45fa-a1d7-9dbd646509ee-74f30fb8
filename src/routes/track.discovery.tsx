import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/track/discovery")({
  head: () => ({
    meta: [
      { title: "أريد الاكتشاف — بوصلة" },
      { name: "description", content: "اكتشف ميولك وقيمك ومجالك المهني عبر أدوات علمية موثوقة." },
    ],
  }),
  component: DiscoveryTrack,
});

const tools = [
  { to: "/academic-major", label: "اختيار التخصص الجامعي", desc: "للطلاب قبل/أثناء الجامعة." },
  { to: "/self-discovery", label: "اكتشاف المهنة", desc: "RIASEC + Big Five — ميولك وشخصيتك." },
  { to: "/career-type-assessment", label: "استكشاف المسار", desc: "تصنيف ISCO-08 الدولي." },
  { to: "/work-values", label: "القيم المهنية", desc: "ما الذي يهمك فعلاً في العمل؟" },
  { to: "/career-anchors", label: "مرساة المسيرة", desc: "نموذج Schein — مرتكزك المهني." },
];

const questions = [
  "هل أنا في بداية الطريق ولا أعرف تخصصي؟",
  "هل أعرف تخصصي لكن لا أعرف المهن المناسبة لي؟",
  "هل أريد فهم شخصيتي وقيمي قبل أي قرار؟",
];

function DiscoveryTrack() {
  return <TrackPage icon={<Compass className="h-8 w-8 text-gold" />} title="أريد الاكتشاف" intro="إذا كنت في مرحلة اختيار التخصص أو المهنة، أو تريد فهم ذاتك المهنية قبل أي قرار، فهذا المسار لك. نبدأ من ميولك وقيمك وشخصيتك ثم نربطها بمجالات عمل واقعية." tools={tools} questions={questions} />;
}

export function TrackPage({ icon, title, intro, tools, questions }: { icon: React.ReactNode; title: string; intro: string; tools: { to: string; label: string; desc: string }[]; questions: string[] }) {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16">
          <div className="flex items-center gap-3">{icon}<h1 className="text-4xl text-primary md:text-5xl">{title}</h1></div>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
        </div>
      </section>
      <section className="container-page py-12">
        <h2 className="font-serif text-2xl text-primary">أسئلة لتحديد احتياجك</h2>
        <ul className="mt-4 space-y-2 text-sm text-foreground/80">
          {questions.map((q) => <li key={q} className="rounded-lg border border-border bg-card px-4 py-3">• {q}</li>)}
        </ul>
      </section>
      <section className="container-page pb-16">
        <h2 className="font-serif text-2xl text-primary">الأدوات المقترحة</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
              <h3 className="font-serif text-base text-primary">{t.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/my-plan" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-90">ابدأ خطتي</Link>
          <Link to="/booking" className="rounded-md border border-border px-5 py-3 text-sm hover:bg-muted">احجز جلسة إرشاد</Link>
        </div>
      </section>
    </>
  );
}
