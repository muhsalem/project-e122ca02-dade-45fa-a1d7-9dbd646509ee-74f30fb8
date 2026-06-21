import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessagesSquare, Send, Loader2 } from "lucide-react";
import { listCoachHistory, sendCoachMessage } from "@/lib/learning-dna.functions";

export const Route = createFileRoute("/learning-coach")({
  head: () => ({
    meta: [
      { title: "AI Learning Coach — مدرّب التعلّم الذكي | بوصلة" },
      { name: "description", content: "تحدَّث مع مدرّب تعلّم ذكي يقرأ بصمتك التعليمية ويعطيك توصيات عملية فورية." },
    ],
  }),
  component: CoachPage,
});

type Msg = { role: "user" | "assistant"; content: string; created_at?: string };

function CoachPage() {
  const fetchHist = useServerFn(listCoachHistory);
  const callSend = useServerFn(sendCoachMessage);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchHist().then((r) => setMsgs(r as any)).catch(() => {}); }, [fetchHist]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setErr(null);
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput(""); setBusy(true);
    try {
      const { reply } = await callSend({ data: { message: text } });
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setErr(e?.message ?? "تعذّر الإرسال");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-page py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary"><MessagesSquare className="h-5 w-5" /></div>
          <div>
            <h1 className="font-serif text-2xl text-primary">AI Learning Coach</h1>
            <p className="text-xs text-muted-foreground">
              مدرّب تعلّم شخصي يقرأ آخر <Link to="/learning-dna-dashboard" className="underline">بصمة تعلّمك</Link> ويعطيك توصيات عملية.
            </p>
          </div>
        </header>

        <div className="flex h-[60vh] flex-col rounded-2xl border border-border bg-card p-3">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {msgs.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                ابدأ المحادثة — اسأل مثلاً: «اقترح جدول مذاكرة أسبوعي يناسبني»، أو «كيف أحفظ المصطلحات بفعالية؟».
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-7 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-primary"
                }`}>{m.content}</div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="inline h-3.5 w-3.5 animate-spin ms-1" /> يفكّر…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {err && <div className="mb-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>}

          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="اكتب سؤالك للمدرّب..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit" disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> إرسال
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
