import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LineChart, Activity, Plus } from "lucide-react";
import { listMyPoia } from "@/lib/poia.functions";
import { POIA_LABELS } from "@/lib/poia-scoring";

export const Route = createFileRoute("/poia-dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة مؤشرات الأثر المهني والصحي | بوصلة" },
      { name: "description", content: "تابع تطوّر مؤشراتك المهنية والصحية عبر الزمن — PI · OH · BRI · CSI · CFS · QWL." },
    ],
  }),
  component: PoiaDashboard,
});

type Row = {
  code: string;
  pi_score: number | null;
  oh_score: number | null;
  bri_score: number | null;
  csi_score: number | null;
  cfs_score: number | null;
  qwl_score: number | null;
  band: string | null;
  created_at: string;
};

function PoiaDashboard() {
  const fetchList = useServerFn(listMyPoia);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchList()
      .then((d) => setRows(d as Row[]))
      .catch((e) => setErr(e?.message ?? "تعذّر التحميل"));
  }, [fetchList]);

  const latest = rows && rows.length ? rows[rows.length - 1] : null;

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-gold">
              <LineChart className="h-3.5 w-3.5" /> لوحة POIA
            </div>
            <h1 className="mt-2 font-serif text-3xl text-primary">مؤشراتك المهنية والصحية</h1>
          </div>
          <Link to="/poia" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
            <Plus className="h-4 w-4" /> إجراء قياس جديد
          </Link>
        </header>

        {err && <p className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{err}</p>}
        {!rows && !err && <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>}
        {rows && rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            لم تُجرِ بعد أي قياس POIA. ابدأ الآن من <Link to="/poia" className="text-primary underline">هنا</Link>.
          </div>
        )}

        {latest && (
          <>
            {/* بطاقات أحدث نتيجة */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {([
                ["pi", latest.pi_score],
                ["oh", latest.oh_score],
                ["bri", latest.bri_score],
                ["csi", latest.csi_score],
                ["cfs", latest.cfs_score],
                ["qwl", latest.qwl_score],
              ] as const).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{POIA_LABELS[k]}</span>
                    {k === "bri" && <span className="text-rose-600">أقل = أفضل</span>}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-serif text-3xl text-primary">{v ?? "—"}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <Sparkline values={(rows ?? []).map((r) => Number(r[`${k}_score` as keyof Row] ?? 0))} />
                </div>
              ))}
            </div>

            {Number(latest.bri_score) >= 65 && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
                <strong>تنبيه:</strong> مؤشر الاحتراق مرتفع. ننصح بإجراء{" "}
                <Link to="/wellbeing-check" className="underline">الفحص النفسي المختصر</Link>{" "}
                وحجز{" "}
                <Link to="/booking" className="underline">جلسة استشارة</Link>.
              </div>
            )}

            <h2 className="mt-8 font-serif text-xl text-primary">سجل القياسات</h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3 text-start">التاريخ</th>
                    <th className="p-3">PI</th><th className="p-3">OH</th><th className="p-3">BRI</th>
                    <th className="p-3">CSI</th><th className="p-3">CFS</th><th className="p-3">QWL</th>
                    <th className="p-3">التصنيف</th><th className="p-3">التقرير</th>
                  </tr>
                </thead>
                <tbody>
                  {(rows ?? []).slice().reverse().map((r) => (
                    <tr key={r.code} className="border-t border-border">
                      <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString("ar-EG")}</td>
                      <td className="p-3 text-center">{r.pi_score}</td>
                      <td className="p-3 text-center">{r.oh_score}</td>
                      <td className="p-3 text-center">{r.bri_score}</td>
                      <td className="p-3 text-center">{r.csi_score}</td>
                      <td className="p-3 text-center">{r.cfs_score}</td>
                      <td className="p-3 text-center font-semibold text-primary">{r.qwl_score}</td>
                      <td className="p-3 text-center text-xs">{r.band}</td>
                      <td className="p-3 text-center">
                        <Link to="/report/$code" params={{ code: r.code }} className="text-primary underline text-xs">
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/poia-compare" className="inline-flex items-center gap-1.5 text-primary underline">
            <Activity className="h-4 w-4" /> قارن مؤشراتك بمتوسطات المهن
          </Link>
        </div>
      </div>
    </section>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <div className="h-8" />;
  const w = 120, h = 32, max = Math.max(...values, 100), min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-8 w-full">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={pts} className="text-gold" />
    </svg>
  );
}
