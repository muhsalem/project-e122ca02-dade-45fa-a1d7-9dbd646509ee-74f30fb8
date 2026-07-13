import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { resolveShareToken, inspectReportShareToken } from "@/lib/share.functions";

export const Route = createFileRoute("/r/$token")({
  component: ShareTokenPage,
  head: () => ({
    meta: [
      { title: "فتح التقرير — بوصلة" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ShareTokenPage() {
  const { token } = Route.useParams();
  const inspect = useServerFn(inspectReportShareToken);
  const resolve = useServerFn(resolveShareToken);

  const meta = useQuery({
    queryKey: ["share-token-meta", token],
    queryFn: () => inspect({ data: { token } }),
    retry: false,
  });

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  // Auto-resolve when no password is needed.
  if (meta.data?.valid && !meta.data.requiresPassword && !code && !err && !busy) {
    setBusy(true);
    resolve({ data: { token } })
      .then((r) => setCode(r.code))
      .catch((e: Error) => setErr(e.message))
      .finally(() => setBusy(false));
  }

  if (meta.isLoading || (busy && !meta.data?.requiresPassword)) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (meta.error || (meta.data && !meta.data.valid)) {
    const reason = (meta.data && !meta.data.valid && meta.data.reason) || "invalid";
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-3xl text-primary">
          {reason === "expired" ? "انتهت صلاحية الرابط" : "الرابط غير صالح"}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {reason === "expired"
            ? "الروابط صالحة لمدة 7 أيام كحدّ أقصى. اطلب رابطاً جديداً من صاحب التقرير."
            : "هذا الرابط منتهي أو تمّ تعديله. اطلب رابطاً جديداً من صاحب التقرير."}
        </p>
      </div>
    );
  }

  if (code) {
    return <Navigate to="/report/$code" params={{ code }} replace />;
  }

  // Password-protected: show a form.
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!password.trim()) {
      setErr("أدخل كلمة المرور.");
      return;
    }
    setBusy(true);
    try {
      const r = await resolve({ data: { token, password } });
      setCode(r.code);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر فتح التقرير.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-primary">رابط محميّ بكلمة مرور</h1>
            <p className="text-xs text-muted-foreground">أدخل كلمة المرور التي زوّدك بها صاحب التقرير.</p>
          </div>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          autoComplete="current-password"
          className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          فتح التقرير
        </button>
      </form>
    </div>
  );
}
