import { Link } from "@tanstack/react-router";

const TABS = [
  { to: "/major-match", label: "مطابقة التخصص", hint: "ابدأ" },
  { to: "/academic-major", label: "اختيار التخصص (AI)", hint: "اختبر" },
  { to: "/academic-disciplines", label: "قاعدة ISCED-F (v9)", hint: "استكشف" },
  { to: "/specializations", label: "خريطة التخصصات", hint: "استكشف" },
  { to: "/interdisciplinary", label: "التخصصات البينية", hint: "استكشف" },
  { to: "/degrees", label: "اختصارات الدرجات", hint: "مرجع" },
] as const;

export function AcademicTabs() {
  return (
    <nav
      dir="rtl"
      aria-label="أقسام التخصصات الأكاديمية"
      className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card p-2"
    >
      {TABS.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary"
          activeProps={{ className: "border-gold bg-gold/15 font-semibold text-primary" }}
        >
          <span className="ml-1 text-[10px] text-gold">{t.hint}</span>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
