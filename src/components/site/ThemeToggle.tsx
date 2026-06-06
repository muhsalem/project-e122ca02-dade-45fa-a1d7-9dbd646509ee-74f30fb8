import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";

const NEXT_LABEL: Record<Theme, string> = {
  light: "التبديل إلى الوضع الداكن",
  dark: "التبديل إلى وضع النظام",
  system: "التبديل إلى الوضع الفاتح",
};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // قبل التحميل: أيقونة محايدة لتفادي hydration mismatch
  const Icon = !mounted ? Sun : theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? NEXT_LABEL[theme] : "تبديل المظهر"}
      title={mounted ? NEXT_LABEL[theme] : "تبديل المظهر"}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-foreground/80 transition-colors hover:bg-muted ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
