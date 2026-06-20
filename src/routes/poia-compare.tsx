import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Scale } from "lucide-react";
import { listOccupations, compareOccupations, listMyPoia } from "@/lib/poia.functions";

export const Route = createFileRoute("/poia-compare")({
  head: () => ({
    meta: [
      { title: "مقارنة المهن — POIA | بوصلة" },
      { name: "description", content: "قارن متوسطات الرضا والضغط والاحتراق والتوازن بين المهن، وضعها بجانب مؤشراتك الشخصية." },
    ],
  }),
  component: PoiaCompare,
});

type Occ = {
  id: string;
  name_ar: string;
  sector: string | null;
  avg_satisfaction: number | null;
  avg_pressure: number | null;
  avg_burnout: number | null;
  avg_income_band: string | null;
  avg_wlb: number | null;
  avg_health_impact: number | null;
};

function PoiaCompare() {
  const list = useServerFn(listOccupations);
  const compare = useServerFn(compareOccupations);
  const myList = useServerFn(listMyPoia);
  const [occ, setOcc] = useState<Occ[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [rows, setRows] = useState<Occ[]>([]);
  const [me, setMe] = useState<{ qwl: number; bri: number } | null>(null);

  useEffect(() => {
    list().then((d) => setOcc(d as Occ[])).catch(() => undefined);
    myList()
      .then((d: any[]) => {
        if (d.length) {
          const last = d[d.length - 1];
          setMe({ qwl: Number(last.qwl_score), bri: Number(last.bri_score) });
        }
      })
      .catch(() => undefined);
  }, [list, myList]);

  const toggle = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]));
  };

  const run = async () => {
    if (!picked.length) return;
    const r = await compare({ data: { occupationIds: picked } });
    setRows(r as Occ[]);
  };

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-gold">
            <Scale className="h-3.5 w-3.5" /> مقارنة مهن
          </div>
          <h1 className="mt-2 font-serif text-3xl text-primary">قارن المهن جنباً إلى جنب</h1>
          <p className="mt-1 text-sm text-muted-foreground">اختر حتى 3 مهن لمقارنة متوسّطاتها العالميّة، ثم قارنها بمؤشراتك الشخصية.</p>
        </header>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 text-xs text-muted-foreground">المختار: {picked.length}/3</div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {occ.map((o) => {
              const on = picked.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  className={`rounded-lg border px-3 py-2 text-start text-sm transition ${
                    on ? "border-gold bg-gold/10 font-semibold text-primary" : "border-border bg-background hover:border-gold/40"
                  }`}
                >
                  <div>{o.name_ar}</div>
                  {o.sector && <div className="text-[11px] text-muted-foreground">{o.sector}</div>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={run}
              disabled={!picked.length}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              قارن
            </button>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <th className="p-3 text-start">المهنة</th>
                  <th className="p-3">الرضا</th>
                  <th className="p-3">الضغط</th>
                  <th className="p-3">الاحتراق</th>
                  <th className="p-3">التوازن</th>
                  <th className="p-3">الأثر الصحي</th>
                  <th className="p-3">الدخل</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-3 font-medium text-primary">{r.name_ar}</td>
                    <td className="p-3 text-center">{r.avg_satisfaction}</td>
                    <td className="p-3 text-center">{r.avg_pressure}</td>
                    <td className="p-3 text-center">{r.avg_burnout}</td>
                    <td className="p-3 text-center">{r.avg_wlb}</td>
                    <td className="p-3 text-center">{r.avg_health_impact}</td>
                    <td className="p-3 text-center text-xs">{r.avg_income_band}</td>
                  </tr>
                ))}
                {me && (
                  <tr className="border-t-2 border-gold bg-gold/5">
                    <td className="p-3 font-semibold text-primary">أنت (آخر قياس)</td>
                    <td className="p-3 text-center">—</td>
                    <td className="p-3 text-center">—</td>
                    <td className="p-3 text-center">{me.bri}</td>
                    <td className="p-3 text-center">—</td>
                    <td className="p-3 text-center">—</td>
                    <td className="p-3 text-center text-xs">QWL {me.qwl}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!me && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            لمقارنة مؤشراتك الشخصية، أكمل{" "}
            <Link to="/poia" className="text-primary underline">اختبار POIA</Link> أولاً.
          </p>
        )}
      </div>
    </section>
  );
}
