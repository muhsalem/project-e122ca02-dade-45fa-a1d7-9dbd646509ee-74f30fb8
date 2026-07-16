import { createFileRoute, Link } from "@tanstack/react-router";
import { CAREER_SIMS } from "@/data/career-sims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/career-sims/")({
  head: () => ({
    meta: [
      { title: "Career Micro-Sims — جرّب المهنة قبل أن تختارها | بوصلة" },
      { name: "description", content: "خمس محاكاة تفاعلية 15 دقيقة لمهن مختلفة مع وصف يوم في الحياة وتقييم أداء بالذكاء الاصطناعي." },
    ],
  }),
  component: SimsIndex,
});

function SimsIndex() {
  return (
    <main dir="rtl" className="container-page py-10">
      <header className="mb-10 text-center">
        <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/15">Career Micro-Sims</Badge>
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">جرّب المهنة قبل أن تختارها</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          خمس محاكاة تفاعلية — 15 دقيقة لكل واحدة — تعيش فيها يوماً كاملاً في المهنة، تتخذ قرارات حقيقية،
          ثم يحلّل الذكاء الاصطناعي أداءك ومدى ملاءمتك لهذا المسار.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CAREER_SIMS.map((s) => (
          <Card key={s.slug} className="group flex flex-col transition hover:border-primary/40 hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 text-4xl">{s.emoji}</div>
              <CardTitle className="font-serif">{s.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{s.tagline}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />15 دقيقة</span>
                <span>·</span>
                <span>{s.scenarios.length} قرارات</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" />تقييم AI</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/career-sims/$slug" params={{ slug: s.slug }}>
                  ابدأ المحاكاة <ArrowLeft className="ms-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
