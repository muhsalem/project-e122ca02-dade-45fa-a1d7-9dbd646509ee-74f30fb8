import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  listScales,
  upsertScale,
  deleteScale,
  upsertVersion,
  deleteVersion,
  upsertItem,
  deleteItem,
  upsertSource,
  deleteSource,
} from "@/lib/psych-scales.functions";
import { ShieldAlert, Plus, Trash2, Save, X, BookOpen, GitBranch, FileText, Link2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin.scales")({
  head: () => ({ meta: [{ title: "إدارة المقاييس النفسية — بوصلة" }] }),
  component: ScalesAdmin,
});

const LICENSE_LABEL: Record<string, string> = {
  commercial_ok: "مسموح تجاريًا",
  research_only: "بحثي فقط",
  permission_required: "يتطلّب إذنًا",
  proprietary: "ملكية خاصة",
  deprecated: "متوقّف",
};
const LICENSE_COLOR: Record<string, string> = {
  commercial_ok: "bg-emerald-100 text-emerald-800",
  research_only: "bg-amber-100 text-amber-800",
  permission_required: "bg-orange-100 text-orange-800",
  proprietary: "bg-rose-100 text-rose-800",
  deprecated: "bg-slate-200 text-slate-700",
};

type Scale = any;
type Version = any;
type Item = any;
type Source = any;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function ScalesAdmin() {
  const fetchAll = useServerFn(listScales);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-psych-scales"],
    queryFn: () => fetchAll(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"info" | "versions" | "items" | "sources">("info");

  const scales: Scale[] = data?.scales ?? [];
  const selected = useMemo(() => scales.find((s) => s.id === selectedId) ?? null, [scales, selectedId]);
  const scaleVersions = useMemo(
    () => (data?.versions ?? []).filter((v: Version) => v.scale_id === selectedId),
    [data, selectedId],
  );
  const scaleItems = useMemo(
    () => (data?.items ?? []).filter((i: Item) => i.scale_id === selectedId),
    [data, selectedId],
  );
  const scaleSources = useMemo(
    () => (data?.sources ?? []).filter((s: Source) => s.scale_id === selectedId),
    [data, selectedId],
  );

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-psych-scales"] });

  if (isLoading) {
    return <div className="container-page py-24 text-center text-muted-foreground">جاري التحميل…</div>;
  }
  if (error) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
          <div className="mt-3 font-serif text-lg text-primary">صلاحيات غير كافية</div>
          <p className="mt-2 text-sm text-muted-foreground">مخصصة للمشرفين فقط.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-primary md:text-4xl">إدارة المقاييس النفسية والمهنية</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نسخ المقاييس، ترجمات البنود، والمصادر — قابلة للتحديث دون تعديل الكود.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ScalesList
            scales={scales}
            selectedId={selectedId}
            onSelect={(id) => { setSelectedId(id); setTab("info"); }}
            onChange={invalidate}
          />
          <div className="rounded-2xl border border-border bg-card p-6">
            {!selected ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                اختر مقياسًا من القائمة أو أضف مقياسًا جديدًا.
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-xl text-primary">{selected.name_ar}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{selected.code}</div>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${LICENSE_COLOR[selected.license_status]}`}>
                    {LICENSE_LABEL[selected.license_status]}
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2 border-b border-border">
                  {([
                    ["info", "المعلومات", BookOpen],
                    ["versions", `النسخ (${scaleVersions.length})`, GitBranch],
                    ["items", `البنود (${scaleItems.length})`, FileText],
                    ["sources", `المصادر (${scaleSources.length})`, Link2],
                  ] as const).map(([k, label, Icon]) => (
                    <button
                      key={k}
                      onClick={() => setTab(k)}
                      className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm ${
                        tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {tab === "info" && <ScaleInfo key={selected.id} scale={selected} onSaved={invalidate} />}
                {tab === "versions" && (
                  <VersionsTab scaleId={selected.id} versions={scaleVersions} onChange={invalidate} />
                )}
                {tab === "items" && (
                  <ItemsTab scaleId={selected.id} items={scaleItems} versions={scaleVersions} onChange={invalidate} />
                )}
                {tab === "sources" && (
                  <SourcesTab scaleId={selected.id} sources={scaleSources} onChange={invalidate} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScalesList({
  scales, selectedId, onSelect, onChange,
}: { scales: Scale[]; selectedId: string | null; onSelect: (id: string) => void; onChange: () => void }) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-serif text-lg text-primary">المقاييس</div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> جديد
        </button>
      </div>
      {adding && (
        <div className="mb-3">
          <ScaleInfo scale={null} onSaved={() => { setAdding(false); onChange(); }} compact />
        </div>
      )}
      <ul className="space-y-1">
        {scales.length === 0 && !adding && (
          <li className="py-6 text-center text-xs text-muted-foreground">لا توجد مقاييس بعد.</li>
        )}
        {scales.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={`w-full rounded-lg px-3 py-2 text-right text-sm transition ${
                selectedId === s.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <div className="font-medium">{s.name_ar}</div>
              <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{s.code}</span>
                <span className={`rounded px-1.5 py-0.5 ${LICENSE_COLOR[s.license_status]}`}>
                  {LICENSE_LABEL[s.license_status]}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScaleInfo({ scale, onSaved, compact }: { scale: Scale | null; onSaved: () => void; compact?: boolean }) {
  const save = useServerFn(upsertScale);
  const del = useServerFn(deleteScale);
  const [form, setForm] = useState({
    id: scale?.id,
    code: scale?.code ?? "",
    name_ar: scale?.name_ar ?? "",
    name_en: scale?.name_en ?? "",
    license: scale?.license ?? "Public Domain",
    license_status: scale?.license_status ?? "commercial_ok",
    source_org: scale?.source_org ?? "",
    source_url: scale?.source_url ?? "",
    notes: scale?.notes ?? "",
    is_active: scale?.is_active ?? true,
  });
  const saveMut = useMutation({
    mutationFn: () => save({ data: form as any }),
    onSuccess: () => onSaved(),
  });
  const delMut = useMutation({
    mutationFn: () => del({ data: { id: scale!.id } }),
    onSuccess: () => onSaved(),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="الكود (فريد)">
          <input className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </Field>
        <Field label="الاسم بالعربية">
          <input className={inputCls} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
        </Field>
        <Field label="الاسم بالإنجليزية">
          <input className={inputCls} value={form.name_en ?? ""} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        </Field>
        <Field label="نوع الترخيص">
          <input className={inputCls} value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="Public Domain / CC BY / MIT..." />
        </Field>
        <Field label="حالة الترخيص">
          <select
            className={inputCls}
            value={form.license_status}
            onChange={(e) => setForm({ ...form, license_status: e.target.value })}
          >
            {Object.entries(LICENSE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="الجهة صاحبة الحقوق">
          <input className={inputCls} value={form.source_org ?? ""} onChange={(e) => setForm({ ...form, source_org: e.target.value })} />
        </Field>
        <Field label="رابط المصدر">
          <input className={inputCls} type="url" value={form.source_url ?? ""} onChange={(e) => setForm({ ...form, source_url: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <span className="text-sm">مفعّل</span>
        </label>
      </div>
      {!compact && (
        <Field label="ملاحظات قانونية / تشغيلية">
          <textarea className={inputCls} rows={4} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
      )}
      {saveMut.error && <div className="text-sm text-destructive">{(saveMut.error as Error).message}</div>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => saveMut.mutate()}
          disabled={saveMut.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> حفظ
        </button>
        {scale && !compact && (
          <button
            onClick={() => { if (confirm("حذف المقياس وكل نسخه وبنوده ومصادره؟")) delMut.mutate(); }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> حذف
          </button>
        )}
      </div>
    </div>
  );
}

function VersionsTab({ scaleId, versions, onChange }: { scaleId: string; versions: Version[]; onChange: () => void }) {
  const save = useServerFn(upsertVersion);
  const del = useServerFn(deleteVersion);
  const empty = { scale_id: scaleId, version: "", changelog: "", released_at: "", is_current: false };
  const [draft, setDraft] = useState<any>(empty);
  const saveMut = useMutation({
    mutationFn: (d: any) => save({ data: d }),
    onSuccess: () => { setDraft({ ...empty, scale_id: scaleId }); onChange(); },
  });
  const delMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: onChange });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-dashed border-border p-4 md:grid-cols-4">
        <Field label="رقم النسخة"><input className={inputCls} value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} placeholder="v1.0" /></Field>
        <Field label="تاريخ الإصدار"><input type="date" className={inputCls} value={draft.released_at ?? ""} onChange={(e) => setDraft({ ...draft, released_at: e.target.value })} /></Field>
        <Field label="سجل التغييرات"><input className={inputCls} value={draft.changelog ?? ""} onChange={(e) => setDraft({ ...draft, changelog: e.target.value })} /></Field>
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" checked={draft.is_current} onChange={(e) => setDraft({ ...draft, is_current: e.target.checked })} />
          <span className="text-sm">النسخة الحالية</span>
        </label>
        <div className="md:col-span-4">
          <button onClick={() => saveMut.mutate(draft)} disabled={!draft.version || saveMut.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
            <Plus className="h-4 w-4" /> إضافة نسخة
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-right text-sm">
          <thead className="bg-secondary text-xs text-primary">
            <tr>
              <th className="p-2">النسخة</th>
              <th className="p-2">تاريخ الإصدار</th>
              <th className="p-2">سجل التغييرات</th>
              <th className="p-2">حالية</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {versions.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-xs text-muted-foreground">لا توجد نسخ.</td></tr>}
            {versions.map((v) => (
              <tr key={v.id}>
                <td className="p-2 font-medium">{v.version}</td>
                <td className="p-2 text-xs text-muted-foreground">{v.released_at ?? "—"}</td>
                <td className="p-2 text-xs text-muted-foreground">{v.changelog ?? "—"}</td>
                <td className="p-2">{v.is_current ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">حالية</span> : ""}</td>
                <td className="p-2">
                  <button onClick={() => { if (confirm("حذف النسخة؟")) delMut.mutate(v.id); }} className="text-destructive hover:opacity-80">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemsTab({ scaleId, items, versions, onChange }: { scaleId: string; items: Item[]; versions: Version[]; onChange: () => void }) {
  const save = useServerFn(upsertItem);
  const del = useServerFn(deleteItem);
  const empty = { scale_id: scaleId, version_id: "", item_code: "", text_ar: "", text_en: "", dimension: "", reverse_scored: false, sort_order: 0 };
  const [draft, setDraft] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const saveMut = useMutation({
    mutationFn: (d: any) => save({ data: { ...d, version_id: d.version_id || null } }),
    onSuccess: () => { setDraft({ ...empty, scale_id: scaleId }); setEditing(null); onChange(); },
  });
  const delMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: onChange });

  return (
    <div className="space-y-4">
      <details className="rounded-lg border border-dashed border-border p-4">
        <summary className="cursor-pointer text-sm font-medium text-primary">+ إضافة بند جديد</summary>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="كود البند"><input className={inputCls} value={draft.item_code} onChange={(e) => setDraft({ ...draft, item_code: e.target.value })} /></Field>
          <Field label="البُعد"><input className={inputCls} value={draft.dimension} onChange={(e) => setDraft({ ...draft, dimension: e.target.value })} /></Field>
          <Field label="النسخة">
            <select className={inputCls} value={draft.version_id} onChange={(e) => setDraft({ ...draft, version_id: e.target.value })}>
              <option value="">— بلا نسخة —</option>
              {versions.map((v) => <option key={v.id} value={v.id}>{v.version}</option>)}
            </select>
          </Field>
          <Field label="النص بالعربية"><textarea className={inputCls} rows={2} value={draft.text_ar} onChange={(e) => setDraft({ ...draft, text_ar: e.target.value })} /></Field>
          <Field label="النص بالإنجليزية"><textarea className={inputCls} rows={2} value={draft.text_en} onChange={(e) => setDraft({ ...draft, text_en: e.target.value })} /></Field>
          <div className="flex flex-col gap-2">
            <Field label="الترتيب"><input type="number" className={inputCls} value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.reverse_scored} onChange={(e) => setDraft({ ...draft, reverse_scored: e.target.checked })} /><span className="text-sm">عكسي</span></label>
          </div>
          <div className="md:col-span-3">
            <button onClick={() => saveMut.mutate(draft)} disabled={!draft.item_code || !draft.text_ar || saveMut.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
              <Plus className="h-4 w-4" /> إضافة
            </button>
          </div>
        </div>
      </details>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-right text-sm">
          <thead className="bg-secondary text-xs text-primary">
            <tr>
              <th className="p-2">الكود</th>
              <th className="p-2">النص العربي</th>
              <th className="p-2">النص الإنجليزي</th>
              <th className="p-2">البُعد</th>
              <th className="p-2">عكسي</th>
              <th className="p-2">النسخة</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-xs text-muted-foreground">لا توجد بنود.</td></tr>}
            {items.map((it) => {
              const isEd = editing === it.id;
              const f = isEd ? editForm : it;
              return (
                <tr key={it.id} className="align-top">
                  <td className="p-2 text-xs">{isEd ? <input className={inputCls} value={f.item_code} onChange={(e) => setEditForm({ ...f, item_code: e.target.value })} /> : it.item_code}</td>
                  <td className="p-2 text-xs">{isEd ? <textarea className={inputCls} rows={2} value={f.text_ar} onChange={(e) => setEditForm({ ...f, text_ar: e.target.value })} /> : it.text_ar}</td>
                  <td className="p-2 text-xs text-muted-foreground">{isEd ? <textarea className={inputCls} rows={2} value={f.text_en ?? ""} onChange={(e) => setEditForm({ ...f, text_en: e.target.value })} /> : (it.text_en ?? "—")}</td>
                  <td className="p-2 text-xs">{isEd ? <input className={inputCls} value={f.dimension ?? ""} onChange={(e) => setEditForm({ ...f, dimension: e.target.value })} /> : (it.dimension ?? "—")}</td>
                  <td className="p-2 text-xs">{isEd ? <input type="checkbox" checked={f.reverse_scored} onChange={(e) => setEditForm({ ...f, reverse_scored: e.target.checked })} /> : (it.reverse_scored ? "✓" : "")}</td>
                  <td className="p-2 text-xs">
                    {isEd ? (
                      <select className={inputCls} value={f.version_id ?? ""} onChange={(e) => setEditForm({ ...f, version_id: e.target.value })}>
                        <option value="">—</option>
                        {versions.map((v) => <option key={v.id} value={v.id}>{v.version}</option>)}
                      </select>
                    ) : (versions.find((v) => v.id === it.version_id)?.version ?? "—")}
                  </td>
                  <td className="p-2">
                    {isEd ? (
                      <div className="flex gap-1">
                        <button onClick={() => saveMut.mutate(f)} className="text-primary"><Save className="h-4 w-4" /></button>
                        <button onClick={() => setEditing(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(it.id); setEditForm(it); }} className="text-xs text-primary hover:underline">تعديل</button>
                        <button onClick={() => { if (confirm("حذف البند؟")) delMut.mutate(it.id); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SourcesTab({ scaleId, sources, onChange }: { scaleId: string; sources: Source[]; onChange: () => void }) {
  const save = useServerFn(upsertSource);
  const del = useServerFn(deleteSource);
  const empty = { scale_id: scaleId, citation: "", url: "", license_ref: "", retrieved_at: "" };
  const [draft, setDraft] = useState<any>(empty);
  const saveMut = useMutation({
    mutationFn: () => save({ data: draft }),
    onSuccess: () => { setDraft({ ...empty, scale_id: scaleId }); onChange(); },
  });
  const delMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: onChange });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-dashed border-border p-4 md:grid-cols-2">
        <Field label="الاستشهاد (APA)"><textarea className={inputCls} rows={2} value={draft.citation} onChange={(e) => setDraft({ ...draft, citation: e.target.value })} /></Field>
        <Field label="الرابط"><input className={inputCls} type="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} /></Field>
        <Field label="مرجع الترخيص"><input className={inputCls} value={draft.license_ref} onChange={(e) => setDraft({ ...draft, license_ref: e.target.value })} placeholder="CC BY 4.0 / Public Domain" /></Field>
        <Field label="تاريخ الاسترجاع"><input type="date" className={inputCls} value={draft.retrieved_at} onChange={(e) => setDraft({ ...draft, retrieved_at: e.target.value })} /></Field>
        <div className="md:col-span-2">
          <button onClick={() => saveMut.mutate()} disabled={!draft.citation || saveMut.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
            <Plus className="h-4 w-4" /> إضافة مصدر
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {sources.length === 0 && <li className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">لا توجد مصادر.</li>}
        {sources.map((s) => (
          <li key={s.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 text-sm">
                <div>{s.citation}</div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {s.license_ref && <span>الترخيص: {s.license_ref}</span>}
                  {s.retrieved_at && <span>الاسترجاع: {s.retrieved_at}</span>}
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">فتح الرابط</a>}
                </div>
              </div>
              <button onClick={() => { if (confirm("حذف المصدر؟")) delMut.mutate(s.id); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
