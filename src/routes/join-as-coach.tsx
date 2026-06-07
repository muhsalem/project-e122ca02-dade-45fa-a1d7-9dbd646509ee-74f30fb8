import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, CheckCircle2, UserPlus } from "lucide-react";
import { submitCoachApplication } from "@/lib/coach.functions";

export const Route = createFileRoute("/join-as-coach")({
  head: () => ({
    meta: [
      { title: "انضم كمرشد/مدرب مهني (كوتش) مهني — بوصلة" },
      {
        name: "description",
        content:
          "قدّم طلبك للانضمام إلى دليل المرشدين والمدربين المهنيين (الكوتشز) على منصة بوصلة، واستقبل حجوزات من المسترشدين بعد قبول طلبك.",
      },
    ],
  }),
  component: JoinCoachPage,
});

const SPECIALIZATIONS = [
  "إرشاد مهني",
  "كوتشينج تنفيذي",
  "كوتشينج حياتي",
  "ريادة أعمال",
  "العمل الحر",
  "تطوير المسار الوظيفي",
  "بناء السيرة الذاتية",
  "التحضير للمقابلات",
  "اكتشاف الميول",
  "اختيار التخصص الجامعي",
  "تخطيط الانتقال المهني",
  "الذكاء العاطفي",
];

const LANGUAGES = ["العربية", "English", "Français", "Türkçe", "اردو", "Español"];

const CURRENCIES = [
  { v: "SAR", l: "ر.س — السعودية" },
  { v: "AED", l: "د.إ — الإمارات" },
  { v: "EGP", l: "ج.م — مصر" },
  { v: "KWD", l: "د.ك — الكويت" },
  { v: "QAR", l: "ر.ق — قطر" },
  { v: "OMR", l: "ر.ع — عُمان" },
  { v: "BHD", l: "د.ب — البحرين" },
  { v: "JOD", l: "د.أ — الأردن" },
  { v: "USD", l: "$ — الدولار" },
  { v: "EUR", l: "€ — اليورو" },
];

function JoinCoachPage() {
  const submit = useServerFn(submitCoachApplication);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    photo_url: "",
    bio: "",
    certifications: "",
    experience_years: 0,
    hourly_price: "",
    currency: "SAR" as
      | "SAR" | "AED" | "EGP" | "USD" | "EUR" | "KWD" | "QAR" | "OMR" | "BHD" | "JOD",
    linkedin_url: "",
    website_url: "",
  });
  const [specs, setSpecs] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>(["العربية"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggle = (arr: string[], val: string, setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const canSubmit =
    form.full_name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.bio.trim().length >= 40 &&
    specs.length > 0 &&
    langs.length > 0 &&
    form.experience_years >= 0;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await submit({
        data: {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
          city: form.city.trim(),
          photo_url: form.photo_url.trim(),
          bio: form.bio.trim(),
          specializations: specs,
          certifications: form.certifications.trim(),
          experience_years: Number(form.experience_years) || 0,
          hourly_price: form.hourly_price ? Number(form.hourly_price) : null,
          currency: form.currency,
          languages: langs,
          linkedin_url: form.linkedin_url.trim(),
          website_url: form.website_url.trim(),
        },
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="container-page py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
        <h1 className="mt-4 font-serif text-3xl text-primary">شكراً لانضمامك!</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          تم استلام طلبك بنجاح وهو الآن قيد المراجعة. سنتواصل معك على بريدك الإلكتروني
          خلال 3 أيام عمل لإكمال خطوات التحقق والتفعيل في دليل المرشدين.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <UserPlus className="h-3.5 w-3.5 text-gold" />
            انضم لشبكة المرشدين المعتمدين
          </span>
          <h1 className="mt-5 font-serif text-3xl text-primary md:text-4xl">
            انضم كمرشد أو مدرب مهني (كوتش) مهني
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            شارك خبرتك مع المسترشدين عبر منصة بوصلة. بعد قبول طلبك ستحصل على ملف عام في
            الدليل، واستقبال حجوزات مدفوعة، ولوحة لإدارة جلساتك وتقارير عملائك.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          {/* Personal */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">البيانات الشخصية</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="الاسم الكامل *">
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="inp"
                  placeholder="مثال: محمد أحمد"
                />
              </Field>
              <Field label="البريد الإلكتروني *">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="inp"
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="رقم الجوال (اختياري)">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="inp"
                  placeholder="+9665XXXXXXXX"
                />
              </Field>
              <Field label="رابط الصورة الشخصية (اختياري)">
                <input
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  className="inp"
                  placeholder="https://..."
                />
              </Field>
              <Field label="الدولة">
                <input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="inp"
                  placeholder="السعودية / الإمارات / مصر..."
                />
              </Field>
              <Field label="المدينة">
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="inp"
                  placeholder="الرياض / دبي / القاهرة..."
                />
              </Field>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">السيرة المختصرة</h2>
            <Field label="نبذة عنك (40 حرف على الأقل) *">
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                className="inp resize-none"
                placeholder="اكتب نبذة احترافية تبرز خبرتك ومنهجك في الإرشاد..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {form.bio.length}/2000 حرف
              </p>
            </Field>
          </div>

          {/* Specializations */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">التخصصات *</h2>
            <p className="mb-2 text-xs text-muted-foreground">اختر مجالاً أو أكثر</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => {
                const sel = specs.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(specs, s, setSpecs)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                      sel
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience & price */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">الخبرة والسعر</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="سنوات الخبرة *">
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={form.experience_years}
                  onChange={(e) =>
                    setForm({ ...form, experience_years: Number(e.target.value) || 0 })
                  }
                  className="inp"
                />
              </Field>
              <Field label="السعر للجلسة/الساعة">
                <input
                  type="number"
                  min={0}
                  value={form.hourly_price}
                  onChange={(e) => setForm({ ...form, hourly_price: e.target.value })}
                  className="inp"
                  placeholder="مثال: 300"
                />
              </Field>
              <Field label="العملة">
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value as typeof form.currency })
                  }
                  className="inp"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.v} value={c.v}>{c.l}</option>
                  ))}
                </select>
              </Field>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 العملة الافتراضية تتكيّف لاحقاً مع دولة المسترشد عند العرض.
            </p>
          </div>

          {/* Languages */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">اللغات *</h2>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => {
                const sel = langs.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggle(langs, l, setLangs)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                      sel
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certifications & links */}
          <div>
            <h2 className="mb-3 font-serif text-lg text-primary">شهادات وروابط (اختياري)</h2>
            <Field label="الشهادات والاعتمادات">
              <textarea
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                rows={3}
                className="inp resize-none"
                placeholder="ICF ACC, EMCC EIA, ماجستير علم نفس مهني..."
              />
            </Field>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="LinkedIn">
                <input
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  className="inp"
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="الموقع الشخصي">
                <input
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  className="inp"
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
            <span className="text-xs text-muted-foreground">
              بإرسال الطلب فإنك توافق على معايير الاعتماد والمراجعة من فريق بوصلة.
            </span>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  أرسل طلب الانضمام
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
