import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, Globe2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import {
  COUNTRIES,
  GATEWAY_ROUTING,
  PRODUCTS,
  formatPrice,
  getPrice,
  type CountryCode,
  type Gateway,
  type ProductCode,
} from "@/lib/pricing";
import { initiateCheckout } from "@/lib/payments.functions";

const searchSchema = z.object({
  product: z.enum([
    "session_single",
    "package_full",
    "report_ai",
    "transition_plan",
    "certificate",
  ]).optional(),
  country: z.enum(["SA","AE","KW","QA","BH","OM","EG"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "الدفع الآمن — بوصلة" },
      { name: "description", content: "أكمل الدفع بأمان عبر بوابات محلية في السعودية والخليج ومصر." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const GATEWAY_LABEL: Record<Gateway, string> = {
  moyasar: "Moyasar — mada · Apple Pay · STC Pay · بطاقات",
  paymob: "Paymob — بطاقات · محافظ · Fawry · valU",
  tap: "Tap — KNET · Benefit · mada · بطاقات دولية",
};

function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id });
  const [product, setProduct] = useState<ProductCode>(search.product ?? "session_single");
  const [country, setCountry] = useState<CountryCode>(search.country ?? "SA");
  const routing = GATEWAY_ROUTING[country];
  const [gateway, setGateway] = useState<Gateway>(routing.primary);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initiate = useServerFn(initiateCheckout);

  const availableGateways = useMemo<Gateway[]>(
    () => [routing.primary, ...routing.alt],
    [routing],
  );

  const price = getPrice(product, country);
  const productMeta = PRODUCTS.find((p) => p.code === product)!;

  const onCountryChange = (c: CountryCode) => {
    setCountry(c);
    setGateway(GATEWAY_ROUTING[c].primary);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isAuthenticated) {
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await initiate({
        data: {
          product,
          country,
          gateway,
          customer_name: name || undefined,
          customer_email: email || undefined,
          customer_phone: phone || undefined,
        },
      });
      window.location.href = res.redirect_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-primary md:text-3xl">إتمام الدفع</h1>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            دفع آمن ومشفّر
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          {/* Product */}
          <div>
            <label className="mb-2 block text-sm font-medium">الخدمة</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value as ProductCode)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
            >
              {PRODUCTS.map((p) => (
                <option key={p.code} value={p.code}>{p.name_ar}</option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted-foreground">{productMeta.desc_ar}</p>
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              <Globe2 className="ml-1 inline h-4 w-4" />
              الدولة والعملة
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onCountryChange(c.code)}
                  className={`rounded-md border-2 p-2.5 text-center text-sm transition-all ${
                    country === c.code
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-gold/50"
                  }`}
                >
                  <div className="text-lg leading-none">{c.flag}</div>
                  <div className="mt-1 font-medium">{c.name_ar}</div>
                  <div className="text-xs text-muted-foreground">{c.currency}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gateway */}
          {availableGateways.length > 1 && (
            <div>
              <label className="mb-2 block text-sm font-medium">طريقة الدفع</label>
              <div className="space-y-2">
                {availableGateways.map((g) => (
                  <label
                    key={g}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border-2 p-3 text-sm transition-all ${
                      gateway === g ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway"
                      value={g}
                      checked={gateway === g}
                      onChange={() => setGateway(g)}
                      className="h-4 w-4"
                    />
                    <span>{GATEWAY_LABEL[g]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium">الاسم الكامل</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">رقم الجوال</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+9665..."
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-secondary/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">المبلغ الإجمالي</span>
              <span className="font-serif text-2xl text-primary">
                {formatPrice(price.amount, price.currency)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">شامل ضريبة القيمة المضافة حيث ينطبق. متوافق شرعياً (بدون فوائد).</p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري التحويل للبوابة...</> : "المتابعة للدفع الآمن"}
          </button>

          {!isAuthenticated && (
            <p className="text-center text-xs text-muted-foreground">
              ستحتاج لتسجيل الدخول قبل إتمام الدفع.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
