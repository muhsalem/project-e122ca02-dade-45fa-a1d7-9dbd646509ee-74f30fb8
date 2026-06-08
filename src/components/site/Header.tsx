import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/paths", label: "خريطة الاختبارات" },
  { to: "/about", label: "من نحن" },
] as const;

const discoveryGroup = {
  label: "أريد الاكتشاف",
  items: [
    { to: "/self-discovery", label: "اكتشف ذاتك" },
    { to: "/work-values", label: "القيم المهنية (WVI)" },
    { to: "/career-anchors", label: "مرساة المسيرة (Schein)" },
    { to: "/learning-style", label: "نمط التعلّم (VARK + Kolb)" },
    { to: "/academic-major", label: "اكتشف تخصصك الدراسي" },
    { to: "/specializations", label: "خريطة التخصصات الجامعية" },
    { to: "/career-type-assessment", label: "اكتشف مسارك المهني" },
    { to: "/sector-guide", label: "دليل القطاعات والصناعات" },
  ],
} as const;

const changeGroup = {
  label: "أريد التغيير",
  items: [
    // ترتيب سيكومتري: فرز أولي ← تشخيص الأعراض ← فحص الصحة ← استكشاف البديل
    { to: "/career-change", label: "١. تشخيص الرغبة في تغيير المسار" },
    { to: "/burnout-check", label: "٢. مؤشر الاحتراق المهني" },
    { to: "/wellbeing-check", label: "٣. فحص الصحة النفسية المهنية" },
    { to: "/career-self-efficacy", label: "٤. الكفاءة الذاتية لاتخاذ القرار" },
    { to: "/career-type-assessment", label: "٥. اكتشاف المسار البديل المناسب" },
  ],
} as const;

const growthGroup = {
  label: "أريد التطوير",
  items: [
    // ترتيب سيكومتري: تقييم وخطة ← خريطة المسار ← شهادة الجاهزية كمخرج
    { to: "/career-growth", label: "١. خطة تطوير مساري الوظيفي" },
    { to: "/emotional-intelligence", label: "٢. الذكاء العاطفي (WLEIS)" },
    { to: "/career-ladder", label: "٣. سلّم المسار الوظيفي" },
    { to: "/career-readiness", label: "٤. شهادة الجاهزية المهنية" },
  ],
} as const;


const institutionsGroup = {
  label: "للمؤسسات",
  items: [
    { to: "/institutions", label: "بوابة المؤسسات والجامعات" },
    { to: "/schools", label: "بوصلة للمدارس" },
    { to: "/parent-dashboard", label: "لوحة وليّ الأمر" },
  ],
} as const;

const navAfter = [
  { to: "/counselor", label: "للمرشدين والمدربين" },
  { to: "/pricing", label: "باقات الاشتراك" },
  { to: "/resources", label: "الموارد" },
] as const;

type NavGroup = { label: string; items: readonly { to: string; label: string }[] };

function DropdownNav({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-1/2 top-full z-50 min-w-[240px] translate-x-1/2 pt-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl">
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block whitespace-nowrap rounded-lg px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                activeProps={{ className: "text-primary font-semibold bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();


  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-serif text-xl font-bold text-primary">
          <img src={logo} alt="بوصلة" width={36} height={36} className="h-9 w-9 object-contain" />
          <span>بوصلة</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={item.to === "/" ? { exact: true } : undefined}
            >
              {item.label}
            </Link>
          ))}

          {[discoveryGroup, changeGroup, growthGroup, institutionsGroup].map((group) => (
            <DropdownNav key={group.label} group={group} />
          ))}

          {navAfter.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              ملفي
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex min-h-11 items-center rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              دخول
            </Link>
          )}
          <Link
            to="/start"
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            ابدأ رحلتك
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-foreground hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground/80"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={item.to === "/" ? { exact: true } : undefined}
              >
                {item.label}
              </Link>
            ))}
            {[discoveryGroup, changeGroup, growthGroup, institutionsGroup].map((group) => (
              <div key={group.label}>
                <div className="mt-3 pr-1 text-xs font-semibold text-primary">{group.label}</div>
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block pr-6 py-2 text-sm text-foreground/70"
                    activeProps={{ className: "text-primary font-semibold" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            {navAfter.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground/80"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? "/profile" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 border-t border-border pt-3 py-3 text-foreground/80"
            >
              {isAuthenticated ? "ملفي الشخصي" : "تسجيل الدخول"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
