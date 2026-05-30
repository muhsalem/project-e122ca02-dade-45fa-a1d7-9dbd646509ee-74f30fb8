import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { GitBranch, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { listCareerLadders } from "@/lib/career-ladder.functions";

type Ladder = {
  role_family: string;
  isco: string | null;
  level_order: number;
  level_title: string;
  years_experience: string;
  key_responsibilities: string;
  next_step_skills: string;
};

// مفاتيح لمطابقة عائلات الأدوار مع نص التقرير
const FAMILY_KEYWORDS: Record<string, string[]> = {
  "مطور برمجيات": ["برمج", "مطور", "تطوير", "software", "developer", "ويب", "front", "back", "كود"],
  "عالم بيانات": ["بيانات", "تحليل", "data", "analyst", "ذكاء اصطناعي", "ai", "تعلم آلي", "machine"],
  "تسويق رقمي": ["تسويق", "marketing", "إعلان", "سوشيال", "محتوى", "علامة"],
  "Product Manager رقمي": ["product manager", "مدير منتج", "منتج رقمي"],
  "كوتش مهني": ["كوتش", "مرشد", "coach", "إرشاد", "تدريب"],
};

function matchFamilies(text: string, all: Ladder[], limit = 2): string[] {
  const lower = text.toLowerCase();
  const families = Array.from(new Set(all.map((l) => l.role_family)));
  const scored = families.map((fam) => {
    const kws = FAMILY_KEYWORDS[fam] ?? [fam.toLowerCase()];
    const score = kws.reduce((acc, kw) => acc + (lower.split(kw.toLowerCase()).length - 1), 0);
    return { fam, score };
  });
  const top = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.fam);
  return top.length > 0 ? top : families.slice(0, 2);
}

export function CareerLadderInsights({ reportText }: { reportText: string }) {
  const fetchLadders = useServerFn(listCareerLadders);
  const { data, isLoading } = useQuery({
    queryKey: ["career-ladders-insights"],
    queryFn: () => fetchLadders(),
  });

  if (isLoading) return null;
  const all = (data?.ladders ?? []) as Ladder[];
  if (all.length === 0) return null;

  const families = matchFamilies(reportText, all, 2);
  const grouped = families.map((fam) => ({
    family: fam,
    levels: all.filter((l) => l.role_family === fam).sort((a, b) => a.level_order - b.level_order),
  }));

  return (
    <section className="my-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-gold/5 p-6 print:break-inside-avoid">
      <div className="flex items-center gap-3">
        <GitBranch className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl text-primary">السلّم الوظيفي لتخصصاتك</h2>
      </div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        مسارات الترقي المتوقعة لكل تخصص ظهر في تقريرك — من البداية حتى أعلى مستوى، مع تقدير عدد السنوات لكل مرحلة.
      </p>

      <div className="mt-6 space-y-8">
        {grouped.map(({ family, levels }) => (
          <div key={family} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-lg text-primary">{family}</h3>
              {levels[0]?.isco && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ISCO {levels[0].isco}
                </span>
              )}
            </div>

            <ol className="relative space-y-3 border-r-2 border-gold/30 pr-5">
              {levels.map((lvl, idx) => (
                <li key={lvl.level_order} className="relative">
                  <span className="absolute -right-[27px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary">
                    {lvl.level_order}
                  </span>
                  <div className="rounded-lg bg-background p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-primary">{lvl.level_title}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold">
                        <Clock className="h-3 w-3" /> {lvl.years_experience}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{lvl.key_responsibilities}</p>
                    {idx < levels.length - 1 && lvl.next_step_skills && (
                      <p className="mt-2 flex items-start gap-1 border-t border-border pt-2 text-[11px] leading-5 text-muted-foreground">
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                        <span><strong className="text-primary">للترقي:</strong> {lvl.next_step_skills}</span>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-primary/20 pt-4 text-xs">
        <span className="text-muted-foreground">لاستكشاف كل السلالم وتحليل فجوة المهارات:</span>
        <Link
          to="/career-ladder"
          className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary"
        >
          افتح سلالم المسارات
          <ChevronLeft className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
