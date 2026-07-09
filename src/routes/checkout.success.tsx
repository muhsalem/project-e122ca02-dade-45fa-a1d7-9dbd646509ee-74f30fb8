import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const search = z.object({ order: z.string().optional() });

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "تم الدفع — بوصلة" }, { name: "robots", content: "noindex" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order } = useSearch({ from: Route.id });
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-4 font-serif text-2xl text-primary">تم استلام طلبك بنجاح</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          رقم الطلب: <span className="font-mono font-semibold text-foreground">{order ?? "—"}</span>
        </p>
        <p className="mt-4 text-sm text-foreground/80">
          سنؤكّد الدفع خلال دقائق ونرسل لك رسالة بتفاصيل الجلسة أو الخدمة.
          يمكنك متابعة طلباتك من ملفك الشخصي.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/profile" className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">
            ملفي وطلباتي
          </Link>
          <Link to="/" className="rounded-md border border-border px-5 py-2.5 text-sm hover:bg-muted">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
