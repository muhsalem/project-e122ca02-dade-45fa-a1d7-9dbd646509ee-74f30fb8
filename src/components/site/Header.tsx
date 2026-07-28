import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
] as const;

const assessmentsGroup = {
  label: "اختر مسارك",
  sections: [
    {
      title: "🚀 ابدأ من هنا",
      items: [
        { to: "/paths", label: "ما الذي تريد العمل عليه اليوم؟" },
        { to: "/my-plan", label: "لوحة خطتي" },
      ],
    },
    {
      title: "🧠 كيف تتعلم؟",
      items: [
        { to: "/learning-style", label: "نمط التعلّم (VARK + Kolb)" },
        { to: "/learning-dna", label: "Learning DNA — البصمة التعليمية" },
        { to: "/meta-learning", label: "التعلّم-الميتا (Grit + Mindset)" },
        { to: "/learning-coach", label: "المدرّب الذكي للتعلّم" },
      ],
    },
    {
      title: "🎓 التخصصات الدراسية والجامعية",
      items: [
        { to: "/academic-major", label: "اختيار التخصص الجامعي" },
        { to: "/specializations", label: "استكشاف التخصصات" },
        { to: "/academic-disciplines", label: "قاعدة ISCED الأكاديمية (v4)" },
        { to: "/interdisciplinary", label: "التخصصات البينية" },
        { to: "/degrees", label: "اختصارات الدرجات (MBA/PhD/…)" },
        { to: "/major-match", label: "Bawsala Match — مطابقة التخصص" },
        { to: "/track/discovery", label: "خريطة الاختبارات الأكاديمية" },
      ],
    },
    {
      title: "💼 المسار المهني — أريد الاكتشاف",
      items: [
        { to: "/self-discovery", label: "اكتشاف المهنة (RIASEC + Big Five)" },
        { to: "/career-type-assessment", label: "استكشاف المسار (ISCO-08)" },
        { to: "/work-values", label: "القيم المهنية (WVI)" },
      ],
    },
    {
      title: "💼 المسار المهني — أريد التغيير",
      items: [
        { to: "/career-change", label: "التحول الوظيفي" },
        { to: "/clarity-check", label: "القلق وعدم وضوح المسار" },
        { to: "/burnout-check", label: "الاحتراق الوظيفي (OLBI)" },
      ],
    },
    {
      title: "💼 المسار المهني — أريد التطوير",
      items: [
        { to: "/career-growth", label: "بناء الخطة المهنية (IDP)" },
        { to: "/career-ladder", label: "سلّم الترقي والأهداف" },
        { to: "/career-readiness", label: "تطوير الأداء والجاهزية" },
        { to: "/emotional-intelligence", label: "الذكاء العاطفي (WLEIS)" },
      ],
    },
  ],
} as const;

const institutionsGroup = {
  label: "للمؤسسات",
  sections: [
    {
      title: "",
      items: [
        { to: "/institutions", label: "بوصلة للشركات والمؤسسات" },
        { to: "/schools", label: "بوصلة للمدارس والجامعات" },
        { to: "/parent-dashboard", label: "بوصلة لوليّ الأمر" },
      ],
    },
  ],
} as const;

const navAfter = [
  { to: "/labor-market", label: "نبض السوق" },
  { to: "/counselor", label: "للمرشدين والمدربين" },
  { to: "/pricing", label: "باقات الاشتراك" },
  { to: "/resources", label: "الموارد" },
] as const;

type NavSection = { title: string; items: readonly { to: string; label: string }[] };
type NavGroup = { label: string; sections: readonly NavSection[] };

function DropdownNav({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const multi = group.sections.length > 1;
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
        <div className={`absolute right-1/2 top-full z-50 translate-x-1/2 pt-2 ${multi ? "min-w-[640px]" : "min-w-[260px]"}`}>
          <div className={`overflow-hidden rounded-xl border border-border bg-card p-3 shadow-xl ${multi ? "grid grid-cols-3 gap-2" : ""}`}>
            {group.sections.map((section) => (
              <div key={section.title || "_"} className="flex flex-col">
                {section.title && (
                  <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                    activeProps={{ className: "text-primary font-semibold bg-muted" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
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

          {[assessmentsGroup, institutionsGroup].map((group) => (
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
            {[assessmentsGroup, institutionsGroup].map((group) => (
              <div key={group.label}>
                <div className="mt-3 pr-1 text-xs font-semibold text-primary">{group.label}</div>
                {group.sections.map((section) => (
                  <div key={section.title || "_"}>
                    {section.title && (
                      <div className="mt-2 pr-3 text-[11px] font-semibold text-gold">{section.title}</div>
                    )}
                    {section.items.map((item) => (
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
