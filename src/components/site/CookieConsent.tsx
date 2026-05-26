import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "bosla_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* no-op */
    }
  }, []);

  function decide(choice: "accept" | "reject") {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() }),
      );
    } catch {
      /* no-op */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="تنبيه ملفات تعريف الارتباط"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur md:p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <Cookie className="hidden h-6 w-6 shrink-0 text-gold md:block" />
        <div className="flex-1 text-sm leading-7 text-foreground/90">
          <p>
            نستخدم ملفات تعريف الارتباط (Cookies) الضرورية لتشغيل المنصة فقط، ولا
            نُفعّل أي تتبّع تسويقي دون موافقتك. للمزيد راجع{" "}
            <Link to="/cookies" className="text-primary underline">
              سياسة الكوكيز
            </Link>{" "}
            و{" "}
            <Link to="/privacy" className="text-primary underline">
              سياسة الخصوصية
            </Link>{" "}
            المتوافقة مع نظام حماية البيانات الشخصية السعودي (PDPL) واللائحة
            الأوروبية (GDPR).
          </p>
        </div>
        <div className="flex shrink-0 flex-row-reverse gap-2 md:flex-col">
          <button
            onClick={() => decide("accept")}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            موافق
          </button>
          <button
            onClick={() => decide("reject")}
            className="rounded-md border border-input px-4 py-2 text-xs font-medium hover:bg-accent"
          >
            الضرورية فقط
          </button>
        </div>
      </div>
    </div>
  );
}
