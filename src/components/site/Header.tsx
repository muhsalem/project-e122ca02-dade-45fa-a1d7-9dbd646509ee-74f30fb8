import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/self-discovery", label: "اكتشاف ذاتك" },
  { to: "/learning-style", label: "اكتشف نمط تعلمك" },
  { to: "/academic-major", label: "اكتشف تخصصك الدراسي" },
  { to: "/career-type-assessment", label: "اكتشف مسارك المهنى" },
  { to: "/sector-guide", label: "دليل القطاعات والصناعات" },
  { to: "/labor-market", label: "ذكاء سوق العمل" },
  { to: "/comprehensive-assessment", label: "التقييم الشامل" },
  { to: "/counselor", label: "الإرشاد المهني والكوتش" },
  { to: "/resources", label: "الموارد" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <Compass className="h-6 w-6 text-gold" />
          <span>بوصلة</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/booking"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >
          ابدأ رحلتك
        </Link>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
