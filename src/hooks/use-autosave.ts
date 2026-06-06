import { useEffect, useRef, useState } from "react";

/**
 * useAutosave — يحفظ تقدم المستخدم في localStorage تلقائياً
 * ويستعيده عند إعادة فتح الصفحة. يحمي من فقدان الإجابات.
 *
 * @example
 *   const [vals, setVals, clearSaved] = useAutosave<Record<string, number>>(
 *     "bosla:wellbeing:v1",
 *     {},
 *   );
 */
export function useAutosave<T>(
  key: string,
  initial: T,
  options: { debounceMs?: number; disabled?: boolean } = {},
): [T, React.Dispatch<React.SetStateAction<T>>, () => void, boolean] {
  const { debounceMs = 400, disabled = false } = options;
  const [restored, setRestored] = useState(false);
  const [value, setValue] = useState<T>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // استعادة عند التحميل (client-only لتفادي hydration mismatch)
  useEffect(() => {
    if (disabled || typeof window === "undefined") {
      setRestored(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setValue(parsed as T);
      }
    } catch {
      // ignore corrupt cache
    }
    setRestored(true);
  }, [key, disabled]);

  // حفظ بـ debounce
  useEffect(() => {
    if (!restored || disabled || typeof window === "undefined") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // quota or private mode — silent
      }
    }, debounceMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, key, debounceMs, restored, disabled]);

  const clear = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  };

  return [value, setValue, clear, restored];
}
