import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Compass, ChevronDown } from "lucide-react";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
] as const;

const discoveryGroup = {
  label: "اكتشف",
  items: [
    { to: "/self-discovery", label: "اكتشف ذاتك" },
    { to: "/learning-style", label: "اكتشف نمط تعلمك" },
    { to: "/academic-major", label: "اكتشف تخصصك الدراسي" },
    { to: "/career-type-assessment", label: "اكتشف مسارك المهني" },
    { to: "/sector-guide", label: "دليل القطاعات والصناعات" },
  ],
} as const;

const navAfter = [
  { to: "/labor-market", label: "نبض السوق" },
  { to: "/comprehensive-assessment", label: "التقييم الشامل" },
  { to: "/counselor", label: "الإرشاد المهني والكوتش" },
  { to: "/resources", label: "الموارد" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-serif text-xl font-bold text-primary">
          <Compass className="h-6 w-6 text-gold" />
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

          {/* Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
              aria-expanded={dropdownOpen}
            >
              {discoveryGroup.label}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-1/2 top-full z-50 min-w-[220px] translate-x-1/2 pt-2">
                <div className="overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl">
                  {discoveryGroup.items.map((item) => (
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

        <Link
          to="/booking"
          className="hidden shrink-0 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
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
                activeOptions={item.to === "/" ? { exact: true } : undefined}
              >
                {item.label}
              </Link>
            ))}
            {discoveryGroup.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="pr-6 py-2.5 text-sm text-foreground/70"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                {item.label}
              </Link>
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
          </nav>
        </div>
      )}
    </header>
  );
}
