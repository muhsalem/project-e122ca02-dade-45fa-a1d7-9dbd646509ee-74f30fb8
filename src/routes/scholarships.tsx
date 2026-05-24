import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ExternalLink, MapPin, Calendar, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/scholarships")({
  head: () => ({
    meta: [
      { title: "خريطة المنح الدراسية والتدريب الحكومي 2026 — بوصلة" },
      { name: "description", content: "دليل شامل لأهم المنح الدراسية وبرامج التدريب الحكومية في السعودية والإمارات والكويت ومصر والأردن — مع روابط التقديم والمواعيد." },
      { property: "og:title", content: "خريطة المنح الدراسية والتدريب 2026" },
      { property: "og:url", content: "/scholarships" },
    ],
    links: [{ rel: "canonical", href: "/scholarships" }],
  }),
  component: ScholarshipsPage,
});

type Program = { name: string; country: string; type: "منحة" | "تدريب" | "تمويل"; provider: string; deadline: string; eligibility: string; url: string };

const PROGRAMS: Program[] = [
  { name: "برنامج خادم الحرمين للابتعاث", country: "السعودية", type: "منحة", provider: "وزارة التعليم", deadline: "يناير 2026", eligibility: "خريجو الثانوية بنسبة 90%+", url: "https://moe.gov.sa" },
  { name: "صندوق تنمية الموارد البشرية (هدف)", country: "السعودية", type: "تدريب", provider: "هدف", deadline: "مفتوح طوال السنة", eligibility: "باحثون عن عمل سعوديون", url: "https://hrdf.org.sa" },
  { name: "إرشاد المهني", country: "السعودية", type: "تدريب", provider: "هدف", deadline: "مفتوح", eligibility: "طلاب وخريجون", url: "https://irshad.hrdf.org.sa" },
  { name: "منح جامعة محمد بن زايد للذكاء الاصطناعي", country: "الإمارات", type: "منحة", provider: "MBZUAI", deadline: "مارس 2026", eligibility: "بكالوريوس + GRE", url: "https://mbzuai.ac.ae" },
  { name: "برنامج نافس", country: "الإمارات", type: "تمويل", provider: "حكومة الإمارات", deadline: "مفتوح", eligibility: "مواطنون يلتحقون بالقطاع الخاص", url: "https://nafis.gov.ae" },
  { name: "منح ديوان الخدمة المدنية الكويتي", country: "الكويت", type: "منحة", provider: "ديوان الخدمة", deadline: "فبراير 2026", eligibility: "كويتيون – ماجستير ودكتوراه", url: "https://csc.gov.kw" },
  { name: "منحة وزارة التعليم العالي", country: "مصر", type: "منحة", provider: "وزارة التعليم العالي", deadline: "أغسطس 2026", eligibility: "أوائل الثانوية", url: "https://mohesr.gov.eg" },
  { name: "صندوق رواد النيل", country: "مصر", type: "تمويل", provider: "رواد النيل", deadline: "مفتوح", eligibility: "رواد أعمال 21–35 سنة", url: "https://nilepreneurs.com" },
  { name: "منح وزارة التعليم العالي الأردنية", country: "الأردن", type: "منحة", provider: "وزارة التعليم", deadline: "يوليو 2026", eligibility: "أردنيون متفوقون", url: "https://mohe.gov.jo" },
  { name: "For9a — منح وفرص عربية", country: "متعدد", type: "منحة", provider: "For9a", deadline: "متجدد", eligibility: "طلاب عرب", url: "https://for9a.com" },
  { name: "Chevening البريطانية", country: "بريطانيا", type: "منحة", provider: "FCDO", deadline: "نوفمبر 2026", eligibility: "خبرة عملية سنتان + إنجليزية", url: "https://chevening.org" },
  { name: "DAAD الألمانية", country: "ألمانيا", type: "منحة", provider: "DAAD", deadline: "متغيّر", eligibility: "بكالوريوس + ألمانية/إنجليزية", url: "https://daad.de" },
  { name: "Fulbright الأمريكية", country: "أمريكا", type: "منحة", provider: "Fulbright", deadline: "مايو 2026", eligibility: "بكالوريوس + TOEFL", url: "https://fulbright.org" },
];

function ScholarshipsPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const countries = ["all", ...Array.from(new Set(PROGRAMS.map((p) => p.country)))];
  const types = ["all", "منحة", "تدريب", "تمويل"];

  const filtered = PROGRAMS.filter((p) => {
    if (country !== "all" && p.country !== country) return false;
    if (type !== "all" && p.type !== type) return false;
    if (q && !p.name.includes(q) && !p.provider.includes(q)) return false;
    return true;
  });

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" /> محدّث 2026
          </span>
          <h1 className="mt-4 text-4xl text-primary md:text-5xl">خريطة المنح والتدريب الحكومي</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            دليل تجميعي لأهم برامج المنح والتدريب والتمويل في الدول العربية والمنح الدولية المفتوحة للعرب — بدون وسطاء.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم البرنامج أو الجهة" className="w-full rounded-xl border border-border bg-background py-2.5 pr-10 pl-3 text-sm" />
          </div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
            {countries.map((c) => <option key={c} value={c}>{c === "all" ? "كل الدول" : c}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
            {types.map((t) => <option key={t} value={t}>{t === "all" ? "كل الأنواع" : t}</option>)}
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg text-primary group-hover:text-gold">{p.name}</h3>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs text-gold-foreground">{p.type}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.provider}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-gold" />{p.country}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3.5 w-3.5 text-gold" />{p.deadline}</div>
              </div>
              <p className="mt-3 text-sm leading-6">{p.eligibility}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary group-hover:text-gold">زيارة الموقع <ExternalLink className="h-3.5 w-3.5" /></div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد نتائج مطابقة لبحثك.</p>}

        <div className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">هل لديك منحة لإضافتها؟ راسلنا على <span className="text-primary">scholarships@busala.app</span></p>
          <Link to="/skills-gap" className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">حلّل فجوة مهاراتك قبل التقديم</Link>
        </div>
      </section>
    </>
  );
}
