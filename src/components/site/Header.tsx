import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Compass, ChevronDown } from "lucide-react";

const discoveryGroup = {
  label: "اكتشف نفسك ومسارك",
  items: [
    { to: "/self-discovery", label: "اكتشف ذاتك" },
    { to: "/learning-style", label: "اكتشف نمط تعلمك" },
    { to: "/academic-major", label: "اكتشف تخصصك الدراسي" },
    { to: "/career-type-assessment", label: "اكتشف مسارك المهنى" },
    { to: "/sector-guide", label: "دليل القطاعات والصناعات" },
  ],
} as const;

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/labor-market", label: "نبض السوق" },
  { to: "/comprehensive-assessment", label: "التقييم الشامل" },
  { to: "/counselor", label: "الإرشاد المهني والكوتش" },
  { to: "/resources", label: "الموارد" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-serif text-xl font-bold text-primary">
          <Compass className="h-6 w-6 text-gold" />
          <span>بوصلة</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex">
          <Link
            to="/"
            className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary font-semibold" }}
            activeOptions={{ exact: true }}
          >
            الرئيسية
          </Link>
          <Link
            to="/about"
            className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            من نحن
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setDiscoveryOpen(true)}
            onMouseLeave={() => setDiscoveryOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDiscoveryOpen((v) => !v)}
              className="flex items-center gap-1 whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {discoveryGroup.label}
              <ChevronDown className="h-4 w-4" />
            </button>
            {discoveryOpen && (
              <div className="absolute right-0 top-full z-50 w-64 pt-2">
                <div className="rounded-md border border-border bg-background p-2 shadow-lg">
                  {discoveryGroup.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDiscoveryOpen(false)}
                      className="block rounded px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                      activeProps={{ className: "text-primary font-semibold bg-muted" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nav.slice(2).map((item) => (
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
            {nav.slice(0, 2).map((item) => (
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
            <div className="py-2">
              <div className="pb-1 text-xs font-semibold text-muted-foreground">{discoveryGroup.label}</div>
              {discoveryGroup.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2 pr-3 text-foreground/80"
                  activeProps={{ className: "text-primary font-semibold" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {nav.slice(2).map((item) => (
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
