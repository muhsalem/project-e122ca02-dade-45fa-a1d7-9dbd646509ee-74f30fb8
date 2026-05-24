import { useEffect } from "react";

/**
 * يفعّل حماية أساسية على الصفحات الحساسة:
 * - منع القائمة بالزر الأيمن
 * - منع النسخ والقص واللصق والسحب
 * - منع اختصارات حفظ الصفحة وأدوات المطوّر (F12, Ctrl+S, Ctrl+U, Ctrl+Shift+I/J/C)
 * ملاحظة: هذه حماية ردع وليست حماية مطلقة.
 */
export function ContentProtection() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // F12
      if (e.key === "F12") return e.preventDefault();
      // Ctrl/Cmd + S / U / P / A / C / X
      if ((e.ctrlKey || e.metaKey) && ["s", "u", "p", "a", "c", "x"].includes(k)) {
        return e.preventDefault();
      }
      // Ctrl/Cmd + Shift + I / J / C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) {
        return e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("keydown", onKey);

    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("keydown", onKey);
      document.body.style.userSelect = prevUserSelect;
    };
  }, []);

  return null;
}
