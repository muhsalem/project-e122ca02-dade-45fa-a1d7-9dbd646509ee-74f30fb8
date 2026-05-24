import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Users, Loader2, ExternalLink, Search, GraduationCap } from "lucide-react";
import { getCohortReports } from "@/lib/counselor.functions";

export const Route = createFileRoute("/counselor")({
  head: () => ({
    meta: [
      { title: "لوحة المرشد والمدرسة — بوصلة" },
      { name: "description", content: "تابع تقارير مجموعة الطلاب التي ترشدها عبر كود المجموعة." },
    ],
  }),
  component: CounselorPage,
});

type Row = { code: string; name: string | null; age: string | null; stage: string | null; created_at: string };

function CounselorPage() {
  const fetchFn = useServerFn(getCohortReports);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ data: { group_code: c } });
      setRows(res.rows as Row[]);
    } catch (e: any) {
      setError(e?.message ?? "خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" />
            لوحة المرشد / المدرسة
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">متابعة مجموعة الطلاب</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            أدخل كود المجموعة الذي شاركته مع طلابك لعرض كل تقاريرهم في مكان واحد. اطلب من كل طالب إدخال هذا الكود في خطوة "قبل أن نبدأ" من التقييم الشامل.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <Users className="h-4 w-4 text-gold" />
              كود المجموعة
            </label>
            <div className="mt-3 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && search()}
                maxLength={32}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
                placeholder="مثال: SCHOOL-2026-A"
              />
              <button
                onClick={search}
                disabled={loading || !code.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                بحث
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              الكود يقبل أحرفًا إنجليزية كبيرة وأرقامًا و(-_) فقط. شاركه بنفسك مع طلابك — لا يُولّد تلقائيًا.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          {rows && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl text-primary">النتائج ({rows.length})</h2>
                {rows.length > 0 && <span className="text-xs text-muted-foreground">آخر تحديث الآن</span>}
              </div>

              {rows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                  لا توجد تقارير مرتبطة بهذا الكود حتى الآن. تأكد من مشاركة الكود الصحيح مع طلابك.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-right">الاسم</th>
                        <th className="px-4 py-3 text-right">العمر</th>
                        <th className="px-4 py-3 text-right">المرحلة</th>
                        <th className="px-4 py-3 text-right">كود التقرير</th>
                        <th className="px-4 py-3 text-right">التاريخ</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.code} className="border-t border-border">
                          <td className="px-4 py-3 font-medium text-foreground">{r.name ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.age ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.stage ?? "—"}</td>
                          <td className="px-4 py-3 font-mono text-xs text-primary">{r.code}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("ar-EG")}
                          </td>
                          <td className="px-4 py-3 text-left">
                            <Link
                              to="/report/$code"
                              params={{ code: r.code }}
                              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
                            >
                              فتح
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
