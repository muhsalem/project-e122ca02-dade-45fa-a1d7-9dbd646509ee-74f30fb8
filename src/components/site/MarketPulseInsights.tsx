import { Link } from "@tanstack/react-router";
import { Activity, TrendingUp, ArrowLeft } from "lucide-react";
import { matchRolesFromText } from "@/lib/market-data";

export function MarketPulseInsights({ reportText }: { reportText: string }) {
  const roles = matchRolesFromText(reportText, 3);

  return (
    <section className="my-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-primary/5 p-6 print:break-inside-avoid">
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-xl text-primary">نبض السوق — مقترح حسب مسارك</h2>
      </div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        استناداً إلى توصيات تقريرك، اخترنا لك أقرب 3 أدوار في سوق العمل مع نطاقات الرواتب الشهرية الفعلية (Q1 2026):
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {roles.map((r) => (
          <div key={r.role} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-base leading-6 text-primary">{r.role}</h3>
              <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">
                طلب {r.demand}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">ISCO {r.isco}</p>

            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between border-b border-border/60 pb-1">
                <span className="text-muted-foreground">🇸🇦 السعودية</span>
                <span className="font-mono font-semibold text-gold">{r.mid_sa}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-1">
                <span className="text-muted-foreground">🇦🇪 الإمارات</span>
                <span className="font-mono font-semibold text-gold">{r.mid_ae}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">🇪🇬 مصر</span>
                <span className="font-mono font-semibold text-gold">{r.mid_eg}</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">الشريحة الوسطى (3–7 سنوات خبرة) — شهري</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gold/20 pt-4 text-xs">
        <TrendingUp className="h-3.5 w-3.5 text-gold" />
        <span className="text-muted-foreground">للوظائف الشاغرة الفعلية والمدن الأعلى طلباً:</span>
        <Link
          to="/labor-market"
          className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/10 px-3 py-1 font-medium text-primary"
        >
          افتح نبض السوق
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
