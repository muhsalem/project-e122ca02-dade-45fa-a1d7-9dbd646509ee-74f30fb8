import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TrendingUp, ChevronLeft, Sparkles, ArrowLeft } from "lucide-react";
import { listCareerLadders } from "@/lib/career-ladder.functions";

export const Route = createFileRoute("/career-ladder")({
  head: () => ({
    meta: [
      { title: "سلالم المسارات المهنية — رحلتك من Junior إلى Lead | بوصلة" },
      { name: "description", content: "خرائط مرئية للترقي المهني في أهم 5 مسارات: تطوير البرمجيات، البيانات، إدارة المنتج، التسويق، والكوتشينج — مع المهارات المطلوبة لكل مستوى." },
      { property: "og:title", content: "سلالم المسارات المهنية" },
      { property: "og:description", content: "من Junior إلى Lead: ماذا يجب أن تتعلم في كل مرحلة." },
    ],
  }),
  component: CareerLadderPage,
});

type Ladder = {
  role_family: string;
  isco: string | null;
  level_order: number;
  level_title: string;
  years_experience: string;
  key_responsibilities: string;
  next_step_skills: string;
};

function CareerLadderPage() {
  const fetchLadders = useServerFn(listCareerLadders);
  const { data, isLoading } = useQuery({
    queryKey: ["career-ladders"],
    queryFn: () => fetchLadders(),
  });

  const grouped = ((data?.ladders ?? []) as Ladder[]).reduce<Record<string, Ladder[]>>((acc, l) => {
    (acc[l.role_family] ||= []).push(l);
    return acc;
  }, {});

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <TrendingUp className="h-3.5 w-3.5 text-gold" />
            Career Ladders — من المبتدئ إلى القائد
          </span>
          <h1 className="mt-4 text-4xl text-primary md:text-5xl">سلالم المسارات المهنية</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            خرائط واضحة لأهم 5 مسارات مهنية في المنطقة العربية — ماذا تفعل في كل مرحلة، وما الذي يجب أن تتعلمه للوصول للمستوى التالي.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        {isLoading && <p className="text-center text-muted-foreground">جاري تحميل السلالم…</p>}

        <div className="space-y-14">
          {Object.entries(grouped).map(([family, levels]) => (
            <article key={family} className="rounded-2xl border border-border bg-card p-6 md:p-10">
              <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-primary md:text-3xl">{family}</h2>
                  {levels[0]?.isco && (
                    <p className="mt-1 text-xs text-muted-foreground">ISCO-08: {levels[0].isco}</p>
                  )}
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {levels.length} مستويات
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {levels.map((lvl, idx) => (
                  <div key={lvl.level_order} className="relative rounded-xl border border-border bg-background p-5">
                    <div className="absolute -top-3 right-4 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-primary">
                      المستوى {lvl.level_order}
                    </div>
                    <h3 className="mt-2 font-serif text-lg text-primary">{lvl.level_title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">📅 {lvl.years_experience}</p>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gold">المسؤوليات</p>
                      <p className="mt-1 text-sm leading-6 text-foreground/85">{lvl.key_responsibilities}</p>
                    </div>

                    {idx < levels.length - 1 && (
                      <div className="mt-4 rounded-lg bg-secondary/60 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-gold" /> للترقّي للمستوى التالي
                        </p>
                        <p className="mt-1 text-xs leading-6 text-muted-foreground">{lvl.next_step_skills}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h3 className="font-serif text-2xl text-primary">هل تريد معرفة فجوة مهاراتك تحديداً؟</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            استخدم أداة تحليل فجوة المهارات لمعرفة ما يجب اكتسابه للانتقال إلى المستوى التالي.
          </p>
          <Link
            to="/skills-gap"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            تحليل فجوة المهارات <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> العودة للموارد
          </Link>
        </div>
      </section>
    </>
  );
}
