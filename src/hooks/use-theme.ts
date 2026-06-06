import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "bosla:theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const resolved = t === "system" ? getSystemTheme() : t;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      setThemeState(stored);
      applyTheme(stored);
    } catch {
      applyTheme("system");
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
    applyTheme(t);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  return { theme, setTheme, toggle };
}
