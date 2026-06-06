import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Brain, HeartPulse, Target, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/my-assessments")({
  component: MyAssessmentsPage,
  head: () => ({ meta: [{ title: "تقييماتي | بوصلة" }] }),
});

type Report = { id: string; code: string; name: string | null; stage: string | null; created_at: string };
type Clarity = { id: string; code: string; total_score: number; phase: string; created_at: string };
type Wellbeing = { id: string; code: string; risk_level: string; created_at: string };
type Plan = { id: string; code: string; career_goal: string; created_at: string };

function MyAssessmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [clarity, setClarity] = useState<Clarity[]>([]);
  const [wellbeing, setWellbeing] = useState<Wellbeing[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!user) return;
    Promise.all([
      supabase.from("assessment_reports").select("id, code, name, stage, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("clarity_scores").select("id, code, total_score, phase, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("wellbeing_screenings").select("id, code, risk_level, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("development_plans").select("id, code, career_goal, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([r, c, w, p]) => {
      setReports((r.data as Report[]) ?? []);
      setClarity((c.data as Clarity[]) ?? []);
      setWellbeing((w.data as Wellbeing[]) ?? []);
      setPlans((p.data as Plan[]) ?? []);
      setLoading(false);
    });
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted/70" />
          </div>
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                <div className="mt-4 space-y-2">
                  <div className="h-14 animate-pulse rounded-lg bg-muted/70" />
                  <div className="h-14 animate-pulse rounded-lg bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const isEmpty = !reports.length && !clarity.length && !wellbeing.length && !plans.length;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">تقييماتي</h1>
            <p className="mt-1 text-sm text-muted-foreground">جميع التقييمات التي أنجزتها في حسابك</p>
          </div>
          <Button asChild variant="outline"><Link to="/profile"><ArrowLeft className="ml-1 h-4 w-4" /> ملفي</Link></Button>
        </div>

        {isEmpty ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <h3 className="font-semibold">لم تُجرِ أي تقييم بعد</h3>
                <p className="mt-1 text-sm text-muted-foreground">ابدأ بالتقييم الشامل لتحصل على تقرير متكامل</p>
              </div>
              <Button asChild><Link to="/comprehensive-assessment">ابدأ التقييم الشامل</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-gold" /> تقارير التقييم الشامل</CardTitle>
                  <CardDescription>{reports.length} تقرير</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {reports.map((r) => (
                    <Link key={r.id} to="/report/$code" params={{ code: r.code }} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted">
                      <div>
                        <p className="font-medium">{r.name ?? "بدون اسم"}</p>
                        <p className="text-xs text-muted-foreground">{r.stage} · {formatDate(r.created_at)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.code}</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {clarity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-gold" /> تقييمات الوضوح المهني</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {clarity.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">المرحلة: {c.phase}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(c.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">{c.total_score}/25</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {wellbeing.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-gold" /> فحوصات الصحة النفسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {wellbeing.map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">مستوى الخطر: {w.risk_level}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(w.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {plans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-gold" /> خطط التطوير</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plans.map((p) => (
                    <Link key={p.id} to="/idp/$code" params={{ code: p.code }} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted">
                      <div>
                        <p className="font-medium">{p.career_goal}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(p.created_at)}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
