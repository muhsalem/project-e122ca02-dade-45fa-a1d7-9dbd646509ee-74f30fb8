import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import { getPassport, dismissAction, type NextAction } from "@/lib/passport.functions";

type Props = {
  compact?: boolean; // one-line CTA for dashboards
  limit?: number;
};

export function NextBestAction({ compact = false, limit = 3 }: Props) {
  const fetch = useServerFn(getPassport);
  const dismiss = useServerFn(dismissAction);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["passport"],
    queryFn: () => fetch(),
  });

  const dismissMut = useMutation({
    mutationFn: (id: string) => dismiss({ data: { actionId: id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["passport"] }),
  });

  if (isLoading || !data) return null;
  if (!data.nextActions.length) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm text-emerald-900">
        🎉 أنجزت كل الخطوات الحالية. راجِع تقدّمك في <Link to="/passport" className="underline">جواز بوصلة</Link>.
      </div>
    );
  }

  if (compact) {
    const a = data.primaryAction!;
    return (
      <Link
        to={a.href}
        className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary"><Sparkles className="h-4 w-4" /></div>
          <div>
            <div className="text-xs text-muted-foreground">الخطوة التالية المقترحة · {data.stage}</div>
            <div className="text-sm font-semibold text-primary">{a.title}</div>
          </div>
        </div>
        <ArrowLeft className="h-4 w-4 text-primary" />
      </Link>
    );
  }

  const actions = data.nextActions.slice(0, limit);

  return (
    <div className="space-y-3">
      {actions.map((a: NextAction, i: number) => (
        <div
          key={a.id}
          className={`relative rounded-2xl border p-5 transition ${
            i === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-card"
          }`}
        >
          {i === 0 && (
            <span className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              الخطوة التالية المقترحة
            </span>
          )}
          <button
            onClick={() => dismissMut.mutate(a.id)}
            className="absolute left-3 top-3 text-muted-foreground hover:text-destructive"
            aria-label="إخفاء"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="font-serif text-lg text-primary">{a.title}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{a.description}</p>
          <Link
            to={a.href}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            {a.cta} <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
