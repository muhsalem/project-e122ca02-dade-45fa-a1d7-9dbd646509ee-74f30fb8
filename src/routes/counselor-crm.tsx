import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { UserPlus, Search, Trash2, Phone, Mail, Calendar, FileText, ShieldCheck, Tag, Pencil, X, Save, Loader2 } from "lucide-react";
import { AutoIllustration } from "@/components/site/Illustration";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/counselor-crm")({
  head: () => ({
    meta: [
      { title: "إدارة العملاء — لوحة المرشد | بوصلة" },
      { name: "description", content: "أداة بسيطة وآمنة لإدارة جلسات العملاء وتدوين الملاحظات، تُحفظ محلياً على جهاز المرشد فقط." },
    ],
  }),
  component: CounselorCRM,
});

type Status = "lead" | "active" | "followup" | "closed";
type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  reportCode?: string;
  status: Status;
  nextSession?: string; // ISO date
  notes?: string;
  tags?: string[];
  createdAt: string;
};

const KEY = "bosla:counselor-crm:v1";
const STATUS: Record<Status, { ar: string; cls: string }> = {
  lead: { ar: "محتمل", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  active: { ar: "نشِط", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  followup: { ar: "متابعة", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  closed: { ar: "مغلق", cls: "bg-muted text-muted-foreground" },
};

function load(): Client[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function save(list: Client[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

function CounselorCRM() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const isCoach = (data ?? []).some((r: { role: string }) => r.role === "coach" || r.role === "admin");
        setAllowed(isCoach);
        if (!isCoach) navigate({ to: "/profile" });
      });
  }, [user, authLoading, navigate]);

  useEffect(() => { setClients(load()); }, []);

  function persist(next: Client[]) { setClients(next); save(next); }

  function upsert(c: Client) {
    const exists = clients.some((x) => x.id === c.id);
    persist(exists ? clients.map((x) => (x.id === c.id ? c : x)) : [c, ...clients]);
    setEditing(null);
    setShowForm(false);
  }

  function remove(id: string) {
    if (!confirm("حذف العميل من سجلك المحلي؟")) return;
    persist(clients.filter((c) => c.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients
      .filter((c) => filter === "all" || c.status === filter)
      .filter((c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.reportCode || "").toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
  }, [clients, query, filter]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    followup: clients.filter((c) => c.status === "followup").length,
    upcoming: clients.filter((c) => c.nextSession && new Date(c.nextSession) >= new Date()).length,
  }), [clients]);

  if (authLoading || allowed === null) {
    return <div className="container-page flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }
  if (!allowed) return null;

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <AutoIllustration topic="/counselor-crm" className="h-20 w-20 shrink-0 text-primary" />
            <div>
              <h1 className="font-serif text-3xl text-primary md:text-4xl">إدارة العملاء — CRM</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                أداة بسيطة لمتابعة عملائك وجلساتك. كل البيانات تُحفظ <strong>محلياً على جهازك فقط</strong>
                ولا تُرفع لأي خادم — التزاماً بسرية معلومات العملاء.
              </p>
            </div>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> إضافة عميل
          </button>
        </header>

        <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50 p-3 text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>تنبيه أخلاقي:</strong> لا تُدوّن بيانات حسّاسة (تشخيصات نفسية/طبية) دون موافقة كتابية صريحة من العميل.
              احذف بيانات أي عميل عند انتهاء العلاقة الإرشادية.
            </span>
          </p>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            { l: "إجمالي العملاء", v: stats.total },
            { l: "نشطون", v: stats.active },
            { l: "بحاجة متابعة", v: stats.followup },
            { l: "جلسات قادمة", v: stats.upcoming },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{k.l}</p>
              <p className="mt-1 font-serif text-2xl font-bold text-primary">{k.v}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم/البريد/الكود/الوسم"
              className="w-full rounded-md border border-border bg-background py-2 pl-3 pr-9 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["all", "lead", "active", "followup", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-md border px-3 py-1.5 text-xs ${
                  filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {s === "all" ? "الكل" : STATUS[s].ar}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                {clients.length === 0 ? "لا يوجد عملاء بعد — أضف أول عميل." : "لا توجد نتائج مطابقة."}
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filtered.map((c) => (
                <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-primary">{c.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS[c.status].cls}`}>{STATUS[c.status].ar}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {c.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>}
                        {c.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                        {c.reportCode && <span className="inline-flex items-center gap-1 font-mono"><FileText className="h-3 w-3" />{c.reportCode}</span>}
                        {c.nextSession && (
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(c.nextSession).toLocaleDateString("ar-EG")}</span>
                        )}
                      </div>
                      {c.tags && c.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.tags.map((t) => (
                            <span key={t} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                              <Tag className="h-3 w-3" />{t}
                            </span>
                          ))}
                        </div>
                      )}
                      {c.notes && <p className="mt-2 line-clamp-2 text-xs leading-6 text-foreground/80">{c.notes}</p>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => { setEditing(c); setShowForm(true); }} aria-label="تعديل"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(c.id)} aria-label="حذف"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showForm && (
          <ClientForm
            initial={editing}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSave={upsert}
          />
        )}
      </div>
    </section>
  );
}

function ClientForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Client | null;
  onCancel: () => void;
  onSave: (c: Client) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [reportCode, setReportCode] = useState(initial?.reportCode ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "lead");
  const [nextSession, setNextSession] = useState(initial?.nextSession?.slice(0, 10) ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      reportCode: reportCode.trim().toUpperCase() || undefined,
      status,
      nextSession: nextSession ? new Date(nextSession).toISOString() : undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="نموذج العميل">
      <form onSubmit={submit} className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-primary">{initial ? "تعديل عميل" : "إضافة عميل جديد"}</h2>
          <button type="button" onClick={onCancel} aria-label="إغلاق" className="rounded p-1 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الاسم *">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="البريد">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={180}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="الجوال">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={32}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="كود التقرير">
            <input value={reportCode} onChange={(e) => setReportCode(e.target.value.toUpperCase())} maxLength={32}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" placeholder="BSL-XXXX-XXXX" />
          </Field>
          <Field label="الحالة">
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              {(Object.keys(STATUS) as Status[]).map((s) => (
                <option key={s} value={s}>{STATUS[s].ar}</option>
              ))}
            </select>
          </Field>
          <Field label="الجلسة القادمة">
            <input type="date" value={nextSession} onChange={(e) => setNextSession(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="الوسوم (مفصولة بفواصل)" className="md:col-span-2">
            <input value={tags} onChange={(e) => setTags(e.target.value)} maxLength={240}
              placeholder="ثانوي، تغيير مسار، عاجل"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="ملاحظات الجلسة" className="md:col-span-2">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={2000}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary">إلغاء</button>
          <button type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Save className="h-4 w-4" /> حفظ
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
