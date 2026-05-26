import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Loader2, Sparkles, KeyRound, User as UserIcon, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { chatCareerTwin } from "@/lib/career-twin.functions";

export const Route = createFileRoute("/career-twin")({
  head: () => ({
    meta: [
      { title: "توأم المسار — مرشدك المهني الذكي | بوصلة" },
      { name: "description", content: "استشِر مرشداً مهنياً ذكياً يعرف تقريرك الشخصي ويرافقك في قرارات مسارك المهني اليومية." },
    ],
  }),
  component: CareerTwinPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "وصلني عرض شغل، أقبله ولا لأ؟",
  "إزاي أبدأ تحويل مساري المهني؟",
  "أهم 3 مهارات أركز عليها الشهر ده؟",
  "ساعدني أحضّر لمقابلة عمل بعد أسبوع.",
];

function CareerTwinPage() {
  const callChat = useServerFn(chatCareerTwin);
  const [reportCode, setReportCode] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("bsl_report_code") ?? "";
  });
  const [codeInput, setCodeInput] = useState(reportCode);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "أهلاً بك 👋 أنا **توأم المسار** — مرشدك المهني الذكي.\n\nاربطني بتقريرك (أدخل كود التقرير في الأعلى) لأعرف ملفك الشخصي وأقدّم لك نصائح دقيقة. أو ابدأ السؤال مباشرة وسأساعدك بأفضل ما يمكن.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const saveCode = () => {
    const c = codeInput.trim().toUpperCase();
    setReportCode(c);
    if (typeof window !== "undefined") {
      if (c) localStorage.setItem("bsl_report_code", c);
      else localStorage.removeItem("bsl_report_code");
    }
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await callChat({
        data: {
          report_code: reportCode || undefined,
          messages: next.slice(-20),
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ غير متوقع");
      setMessages((m) => m.slice(0, -1));
      setInput(content);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content: reportCode
          ? `تم ربط تقريرك (${reportCode}) ✅\nاسألني أي شيء عن مسارك المهني.`
          : "بدأنا من جديد. كيف يمكنني مساعدتك؟",
      },
    ]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <section className="container-page py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-primary text-primary-foreground shadow-lg">
              <Bot className="h-7 w-7" />
            </div>
            <h1 className="mt-3 font-serif text-3xl text-primary">توأم المسار</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              مرشدك المهني الذكي — يعرف تقريرك ويرافقك في قراراتك اليومية.
            </p>
          </div>

          {/* Report code bar */}
          <div className="mb-4 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 shrink-0 text-gold" />
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="كود تقريرك BSL-XXXX-XXXX (اختياري)"
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-center font-mono text-xs tracking-widest"
                maxLength={20}
              />
              <button
                onClick={saveCode}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                {reportCode === codeInput.trim().toUpperCase() && reportCode ? "مربوط ✓" : "ربط"}
              </button>
              {!reportCode && (
                <Link to="/self-discovery" className="text-xs text-primary underline whitespace-nowrap">
                  ابدأ التقييم
                </Link>
              )}
            </div>
            {reportCode && (
              <p className="mt-2 text-[11px] text-emerald-700">
                ✅ مرتبط بتقرير {reportCode} — الردود ستكون مخصصة لملفك.
              </p>
            )}
          </div>

          {/* Chat window */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div
              ref={scrollRef}
              className="max-h-[55vh] min-h-[400px] overflow-y-auto p-4 space-y-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-br from-gold to-primary text-primary-foreground"
                    }`}
                  >
                    {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-7 ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground prose prose-sm prose-headings:font-serif prose-headings:text-primary max-w-none"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    يفكر...
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !loading && (
              <div className="border-t border-border p-3">
                <p className="mb-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-gold" />
                  جرّب أحد هذه الأسئلة:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition hover:border-gold hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <button
                type="button"
                onClick={reset}
                title="محادثة جديدة"
                className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="اسأل توأم المسار..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                إرسال
              </button>
            </form>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            توأم المسار أداة استرشادية — لا تُغني عن جلسة كوتشينج بشرية للقرارات المصيرية.
            {" "}
            <Link to="/booking" className="text-primary underline">احجز جلسة</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
