import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/encyclopedia-v9")({
  head: () => ({
    meta: [
      { title: "موسوعة بوصلة v9 — التخصصات + محرك التوافق" },
      { name: "description", content: "الإصدار المرجعي v9 من موسوعة التخصصات الأكاديمية والبينية والدرجات، مع محرك دمج التشخيص (RIASEC + BFI-2 + AGAF + الطموحات) وبوابة GSCCI." },
      { property: "og:title", content: "موسوعة بوصلة v9" },
      { property: "og:description", content: "مرجع ISCED-F 2013 كامل + محرك توافق التخصصات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section dir="rtl" className="container-page py-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">موسوعة بوصلة · الإصدار المرجعي v9</h1>
            <p className="text-sm text-muted-foreground">النسخة الأصلية القائمة بذاتها من الموسوعة ومحرك التوافق — كما استلمناها من المرجع.</p>
          </div>
          <a
            href="/bawsala/encyclopedia-v9.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-primary hover:bg-gold/20"
          >
            فتح في نافذة جديدة ↗
          </a>
        </header>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <iframe
            src="/bawsala/encyclopedia-v9.html"
            title="Bawsala Encyclopedia v9"
            className="h-[85vh] w-full"
            loading="lazy"
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          هذه المعاينة تعرض ملف v9 الأصلي بلا تعديل. النسخة المدمجة داخل المنصة موزّعة على صفحات
          «التخصصات الأكاديمية»، «التخصصات البينية»، «الدرجات»، و«Bawsala Match».
        </p>
      </div>
    </section>
  );
}
