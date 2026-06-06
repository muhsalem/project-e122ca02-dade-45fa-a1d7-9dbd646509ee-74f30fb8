import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, FileText, Plus, Trash2, ExternalLink, ShieldCheck } from "lucide-react";
import { AutoIllustration } from "@/components/site/Illustration";

export const Route = createFileRoute("/parent-dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة وليّ الأمر — متابعة تقارير الأبناء | بوصلة" },
      { name: "description", content: "تابع تقارير اكتشاف الذات والمسار المهني لأبنائك بسهولة عبر أكواد التقارير، مع الحفاظ على الخصوصية." },
      { property: "og:title", content: "لوحة وليّ الأمر — بوصلة" },
      { property: "og:description", content: "متابعة آمنة وخاصة لتقارير أبنائك المهنية والنفسية." },
    ],
  }),
  component: ParentDashboard,
});

type Child = { id: string; name: string; code: string; note?: string };

const STORAGE_KEY = "bosla:parent-dashboard:v1";

function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChildren(JSON.parse(raw));
    } catch {}
  }, []);

  function persist(next: Child[]) {
    setChildren(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    persist([
      ...children,
      { id: crypto.randomUUID(), name: name.trim(), code: code.trim().toUpperCase(), note: note.trim() || undefined },
    ]);
    setName(""); setCode(""); setNote("");
  }

  function remove(id: string) {
    if (!confirm("هل تريد إزالة هذا الكود من المتابعة؟ (لن يحذف التقرير من النظام)")) return;
    persist(children.filter((c) => c.id !== id));
  }

  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <AutoIllustration topic="/parent-dashboard" className="mx-auto mb-2 h-24 w-24 text-primary" />
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Users className="h-3.5 w-3.5 text-gold" />
            لوحة وليّ الأمر
          </div>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">متابعة رحلة أبنائك المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-8 text-muted-foreground">
            احفظ أكواد تقارير أبنائك للوصول السريع. الأكواد تُحفظ على جهازك فقط ولا تُرفع لأي خادم.
            عند فتح أي تقرير ستحتاج إلى كوده وحده — لذا تواصل مع ابنك/ابنتك قبل الإطلاع
            احتراماً لخصوصيّتهم.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>تنبيه الخصوصية:</strong> هذه الصفحة أداة تنظيمية فقط لحفظ الأكواد محلياً.
              لا تمنحك صلاحية تجاوز موافقة ابنك/ابنتك على مشاركة نتائجهم. التقارير النفسية
              للقاصرين تتطلب موافقة وليّ الأمر مسبقاً وفق نظام حماية البيانات الشخصية (PDPL).
            </span>
          </p>
        </div>

        {/* Add form */}
        <form onSubmit={add} className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-4 md:items-end">
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium">اسم الابن/الابنة</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={64}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="مثال: أحمد" />
          </div>
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium">كود التقرير</label>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={32}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" placeholder="BSL-XXXX-XXXX" />
          </div>
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium">ملاحظة (اختياري)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={120}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="مثال: تقرير الصف الثاني" />
          </div>
          <button type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> إضافة
          </button>
        </form>

        {/* List */}
        <div className="mt-8">
          {children.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
              <FileText className="mx-auto h-10 w-10 text-gold/60" />
              <p className="mt-3 text-sm text-muted-foreground">لم تُضِف أي تقرير بعد — أضف أول كود من النموذج أعلاه.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <Link to="/self-discovery" className="rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary">اكتشاف الذات</Link>
                <Link to="/career-type-assessment" className="rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary">المسمى المهني</Link>
                <Link to="/wellbeing-check" className="rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary">الفحص النفسي</Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {children.map((c) => (
                <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-primary">{c.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{c.code}</p>
                      {c.note && <p className="mt-1 text-xs leading-6 text-muted-foreground">{c.note}</p>}
                    </div>
                    <button onClick={() => remove(c.id)} aria-label="إزالة"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Link to="/report/$code" params={{ code: c.code }}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    فتح التقرير <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
