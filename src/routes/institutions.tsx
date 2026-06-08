import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Building2, Users, BarChart3 } from "lucide-react";
import { getInstitutionDashboard } from "@/lib/institution.functions";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "بوصلة للجامعات والمؤسسات — B2B | بُوصلة" },
      { name: "description", content: "بُوصلة للجامعات والمؤسسات: لوحة مخصصة للجامعات والمدارس والمؤسسات لمتابعة تقدّم طلابها وموظفيها في تقييمات اكتشاف الذات والتطوير المهني." },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const fetchDash = useServerFn(getInstitutionDashboard);
  const [groupCode, setGroupCode] = useState("");
  const [data, setData] = useState<{ total: number; uniqueStudents: number; byStage: Record<string, number>; recent: Array<{ code: string; name: string | null; stage: string | null; age: string | null; created_at: string }> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetchDash({ data: { groupCode: groupCode.trim() } });
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <Building2 className="mx-auto h-10 w-10 text-blue-600" />
        <h1 className="mt-3 font-serif text-3xl font-bold">بوصلة للجامعات والمؤسسات</h1>
        <p className="mt-2 text-muted-foreground">
          لوحة تحكم للمرشدين الأكاديميين ومسؤولي التطوير المهني — تتبّع مباشر لتقدم منسوبيكم.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg mb-3">الدخول إلى لوحة مؤسستك</h2>
        <p className="text-sm text-muted-foreground mb-4">
          أدخل كود المجموعة (Group Code) الخاص بمؤسستك. سيتم عرض تقدم جميع المسجّلين تحت هذا الكود.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="مثال: UNI-RIYADH-2026"
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 font-mono"
          />
          <button onClick={load} disabled={!groupCode.trim() || loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
            عرض اللوحة
          </button>
        </div>
        {err && <div className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}
      </div>

      {data && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={<Users className="h-5 w-5" />} label="إجمالي التقييمات" value={data.total} />
            <Stat icon={<Users className="h-5 w-5" />} label="عدد المستفيدين" value={data.uniqueStudents} />
            <Stat icon={<BarChart3 className="h-5 w-5" />} label="أنواع التقييمات" value={Object.keys(data.byStage).length} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">توزيع التقييمات حسب النوع</h3>
            <div className="space-y-2">
              {Object.entries(data.byStage).map(([s, n]) => {
                const pct = data.total ? Math.round((n / data.total) * 100) : 0;
                return (
                  <div key={s}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stageLabel(s)}</span>
                      <span className="text-muted-foreground">{n} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">أحدث التقييمات (آخر 50)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-right py-2">الكود</th>
                    <th className="text-right py-2">الاسم</th>
                    <th className="text-right py-2">النوع</th>
                    <th className="text-right py-2">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((r) => (
                    <tr key={r.code} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs"><a href={`/report/${r.code}`} className="text-primary hover:underline">{r.code}</a></td>
                      <td className="py-2">{r.name ?? "—"}</td>
                      <td className="py-2">{stageLabel(r.stage ?? "general")}</td>
                      <td className="py-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
        <h3 className="font-semibold mb-2">لمؤسستك بعدُ كود مجموعة؟</h3>
        <p className="text-sm text-muted-foreground mb-3">
          تواصل معنا للحصول على كود مجموعة مخصّص لجامعتك أو مدرستك أو شركتك، مع تقارير شهرية شاملة وجلسات تدريب للمرشدين.
        </p>
        <a href="mailto:partners@boussla.app" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">طلب شراكة</a>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

function stageLabel(s: string) {
  const m: Record<string, string> = {
    "self-discovery": "اكتشاف الذات",
    "learning-style": "أنماط التعلّم",
    "career-type": "المسار المهني",
    "academic-major": "التخصص الجامعي",
    "wellbeing": "الصحة النفسية",
    "values-mapper": "خريطة القيم",
    "strengths": "نقاط القوة",
    "cognitive": "البروفايل المعرفي",
    "burnout": "الاحتراق المهني",
    "comprehensive": "التقييم الشامل",
    "certificate": "شهادة جاهزية",
    "general": "عام",
  };
  return m[s] ?? s;
}
