import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Layers, ArrowLeft, Brain, BookOpen, GraduationCap, Briefcase, Building2 } from "lucide-react";
import { submitComprehensive } from "@/lib/comprehensive.functions";

export const Route = createFileRoute("/comprehensive-assessment")({
  head: () => ({
    meta: [
      { title: "التقييم الشامل الموحّد — بوصلة" },
      {
        name: "description",
        content:
          "ادمج نتائج اكتشاف الذات + نمط التعلم + التخصص الدراسي + المسمى المهني في تقرير موحّد، مع ترشيح القطاع والصناعة المناسبة.",
      },
    ],
  }),
  component: ComprehensivePage,
});

type Field = {
  key: "selfDiscoveryCode" | "learningStyleCode" | "academicMajorCode" | "careerTitleCode";
  label: string;
  prefix: string;
  href: string;
  hint: string;
};

const FIELDS: Field[] = [
  { key: "selfDiscoveryCode", label: "اكتشاف ذاتك", prefix: "BSL-", href: "/self-discovery", hint: "كود تقرير اكتشاف الذات (يبدأ بـ BSL-)" },
  { key: "learningStyleCode", label: "اكتشف نمط تعلمك", prefix: "LSA-", href: "/learning-style", hint: "كود تقرير نمط التعلم (يبدأ بـ LSA-)" },
  { key: "academicMajorCode", label: "اكتشف تخصصك الدراسي", prefix: "MAJ-", href: "/academic-major", hint: "كود تقرير التخصص (يبدأ بـ MAJ-)" },
  { key: "careerTitleCode", label: "اكتشف مسماك المهني", prefix: "CPT-", href: "/career-type-assessment", hint: "كود تقرير المسمى المهني (يبدأ بـ CPT-)" },
];

function ComprehensivePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitComprehensive);

  const [name, setName] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filledCount = FIELDS.filter((f) => (codes[f.key] || "").trim().length > 0).length;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await submit({
        data: {
          name: name.trim() || undefined,
          selfDiscoveryCode: codes.selfDiscoveryCode?.trim() || "",
          learningStyleCode: codes.learningStyleCode?.trim() || "",
          academicMajorCode: codes.academicMajorCode?.trim() || "",
          careerTitleCode: codes.careerTitleCode?.trim() || "",
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Layers className="h-3.5 w-3.5 text-gold" />
            تقرير موحّد يدمج جميع تقييماتك
          </span>
          <h1 className="mt-5 font-serif text-3xl text-primary md:text-4xl">
            التقييم الشامل الموحّد
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            أدخل أكواد تقاريرك السابقة، وسنُولّد لك تقريرًا واحدًا شاملًا يجمع: اكتشاف الذات +
            نمط التعلم + التخصص الدراسي + المسمى المهني، ويُتوّجه بترشيح القطاع والصناعة الأنسب.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">اسمك (اختياري)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="اسمك الكامل"
            />
          </div>

          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="rounded-xl border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-primary">{f.label}</label>
                  <Link to={f.href} className="text-xs text-gold hover:underline">
                    لم تُجره بعد؟ ابدأ ←
                  </Link>
                </div>
                <input
                  value={codes[f.key] || ""}
                  onChange={(e) => setCodes({ ...codes, [f.key]: e.target.value.toUpperCase() })}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-mono"
                  placeholder={`${f.prefix}XXXX-XXXX`}
                />
                <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              تم إدخال {filledCount} من {FIELDS.length} أكواد (الحد الأدنى: 2)
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || filledCount < 2}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري دمج التقارير...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  أنشئ تقريري الشامل
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
