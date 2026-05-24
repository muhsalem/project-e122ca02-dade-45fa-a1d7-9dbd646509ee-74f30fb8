import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { createJournalEntry, listJournalEntries, deleteJournalEntry } from "@/lib/journal.functions";
import { toast } from "sonner";
import { BookHeart, Trash2, Smile, Meh, Frown } from "lucide-react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "اليوميات التأملية — بوصلة" },
      { name: "description", content: "دوّن مشاعرك وتأملاتك يومياً لتتبّع تطورك النفسي والمهني." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth", search: { redirect: "/journal" } });
  },
  component: JournalPage,
});

const MOODS = [
  { v: 1, label: "صعب جداً", icon: Frown, color: "text-destructive" },
  { v: 2, label: "صعب", icon: Frown, color: "text-amber-600" },
  { v: 3, label: "محايد", icon: Meh, color: "text-muted-foreground" },
  { v: 4, label: "جيد", icon: Smile, color: "text-emerald-600" },
  { v: 5, label: "ممتاز", icon: Smile, color: "text-primary" },
];

type Entry = { id: string; mood: number; title: string | null; content: string; tags: string[]; created_at: string };

function JournalPage() {
  const { user } = useAuth();
  const create = useServerFn(createJournalEntry);
  const list = useServerFn(listJournalEntries);
  const del = useServerFn(deleteJournalEntry);

  const [mood, setMood] = useState<number>(3);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { entries } = await list();
      setEntries(entries as Entry[]);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) refresh(); }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("اكتب تأملك أولاً");
    setBusy(true);
    try {
      await create({
        data: {
          mood,
          title: title.trim() || undefined,
          content: content.trim(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
        },
      });
      toast.success("تم حفظ التأمل");
      setTitle(""); setContent(""); setTags(""); setMood(3);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("حذف هذا التأمل؟")) return;
    try { await del({ data: { id } }); refresh(); } catch (e) { toast.error("تعذر الحذف"); }
  };

  return (
    <section className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 flex items-center gap-3">
        <BookHeart className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-serif text-3xl text-primary">اليوميات التأملية</h1>
          <p className="text-sm text-muted-foreground">دوّن مشاعرك وتأملاتك — أداة أساسية في رحلة الكوتشينج لتتبّع التطور.</p>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mb-10 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-primary">كيف تشعر اليوم؟</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const Ico = m.icon;
              return (
                <button key={m.v} type="button" onClick={() => setMood(m.v)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${mood === m.v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  <Ico className={`h-4 w-4 ${m.color}`} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان قصير (اختياري)"
          className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm" maxLength={200} />

        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب ما يدور في خاطرك… ما الذي تعلّمته اليوم؟ ما الذي أرهقك؟ ما الذي تشعر بالامتنان له؟"
          rows={6} maxLength={5000}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm leading-7" />

        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="وسوم مفصولة بفاصلة (مثال: قلق، عمل، عائلة)"
          className="w-full rounded-md border border-border bg-background px-4 py-2 text-xs" />

        <button type="submit" disabled={busy}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "جارٍ الحفظ…" : "حفظ التأمل"}
        </button>
      </form>

      <h2 className="mb-4 font-serif text-xl text-primary">تأملاتك السابقة</h2>
      {loading ? <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
        : entries.length === 0 ? <p className="text-sm text-muted-foreground">لا توجد تأملات بعد — ابدأ بكتابة أول تأمل أعلاه.</p>
        : (
          <ul className="space-y-3">
            {entries.map((e) => {
              const m = MOODS.find((x) => x.v === e.mood) ?? MOODS[2];
              const Ico = m.icon;
              return (
                <li key={e.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Ico className={`h-5 w-5 ${m.color}`} />
                      <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString("ar-EG")}</span>
                      {e.title && <span className="font-medium text-primary">— {e.title}</span>}
                    </div>
                    <button onClick={() => onDelete(e.id)} className="text-muted-foreground hover:text-destructive" title="حذف">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-foreground/90">{e.content}</p>
                  {e.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">#{t}</span>)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

      <p className="mt-10 text-center text-xs text-muted-foreground">
        <Link to="/my-assessments" className="text-primary hover:underline">عودة لتقييماتي</Link>
      </p>
    </section>
  );
}
