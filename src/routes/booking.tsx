import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Calendar, Clock, User, ShieldCheck, Users } from "lucide-react";
import { CalEmbed } from "@/components/site/CalEmbed";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "حجز جلسة إرشاد أو كوتشينج — بوصلة" },
      { name: "description", content: "احجز جلسة إرشاد مهني أو كوتشينج فردية مع مرشد معتمد." },
    ],
  }),
  component: BookingPage,
});

const COACHES = [
  { id: "1", name: "د. سارة المنصور", spec: "إرشاد طلبة الجامعات", years: 12 },
  { id: "2", name: "أ. خالد الرشيد", spec: "التحول المهني للخريجين", years: 8 },
  { id: "3", name: "د. ليلى الأحمد", spec: "إرشاد طلبة المدارس", years: 15 },
];

const TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

function BookingPage() {
  const [coach, setCoach] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [genderPref, setGenderPref] = useState<"same" | "any">("same");
  const [payment, setPayment] = useState<string>("mada");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-primary">تم استلام طلبك</h1>
          <p className="mt-3 text-muted-foreground">
            سنتواصل معك خلال 24 ساعة لتأكيد موعدك مع{" "}
            <span className="font-semibold text-primary">
              {COACHES.find((c) => c.id === coach)?.name}
            </span>{" "}
            بتاريخ {date} الساعة {time}.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16 text-center">
          <h1 className="text-4xl text-primary md:text-5xl">حجز جلسة إرشاد أو كوتشينج</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            خطوات بسيطة للحجز مع أحد مرشدينا المعتمدين دولياً.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-10">
          {/* COACH */}
          <div>
            <h2 className="flex items-center gap-2 font-serif text-xl text-primary">
              <User className="h-5 w-5 text-gold" /> ١. اختر مرشدك
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {COACHES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCoach(c.id)}
                  className={`rounded-xl border p-5 text-right transition-all ${
                    coach === c.id
                      ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <h3 className="font-serif text-base text-primary">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.spec}</p>
                  <p className="mt-2 text-xs text-gold">{c.years} سنة خبرة</p>
                </button>
              ))}
            </div>
          </div>

          {/* DATE & TIME */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 font-serif text-xl text-primary">
                <Calendar className="h-5 w-5 text-gold" /> ٢. التاريخ
              </h2>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-5 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <h2 className="flex items-center gap-2 font-serif text-xl text-primary">
                <Clock className="h-5 w-5 text-gold" /> ٣. الوقت
              </h2>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {TIMES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-lg border py-2.5 text-sm transition-all ${
                      time === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <h2 className="font-serif text-xl text-primary">٤. بياناتك</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الجوال" className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none md:col-span-2" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ما الذي تود مناقشته؟ (اختياري)" rows={4} className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none md:col-span-2" />
            </div>
          </div>

          {/* GENDER PREFERENCE — مراعاة الضوابط الشرعية */}
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <h2 className="flex items-center gap-2 font-serif text-base text-primary">
              <Users className="h-5 w-5 text-gold" /> تفضيل جنس المُرشِد (الضوابط الشرعية)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              نلتزم بعدم الخلوة. الجلسات الافتراضية من نفس الجنس، وإن اخترت غير ذلك تُسجَّل الجلسة وتكون احترافيّة مع التزام الحشمة.
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                { id: "same", label: "من نفس جنسي (افتراضي)" },
                { id: "any", label: "لا تفضيل — مع تسجيل الجلسة" },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGenderPref(g.id as "same" | "any")}
                  className={`rounded-lg border px-3 py-2.5 text-right text-sm transition ${
                    genderPref === g.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* PAYMENT — متوافقة شرعياً */}
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <h2 className="flex items-center gap-2 font-serif text-base text-primary">
              <ShieldCheck className="h-5 w-5 text-gold" /> طريقة الدفع (متوافقة مع الضوابط الشرعية)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              لا نتعامل بالفوائد الربوية. اختر إحدى البوابات المتوافقة:
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                { id: "mada", label: "مدى / Apple Pay" },
                { id: "stcpay", label: "STC Pay" },
                { id: "bank", label: "تحويل بنكي (بنك إسلامي)" },
                { id: "tabby", label: "تابي — دفعة واحدة (بدون تقسيط)" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={`rounded-lg border px-3 py-2.5 text-right text-sm transition ${
                    payment === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              ملاحظة: نوصي بعدم استخدام بطاقات ائتمانية ذات فوائد ربوية. تفاصيل أكثر في{" "}
              <a href="/terms#ethics" className="text-primary underline">ميثاق الالتزام</a>.
            </p>
          </div>

          <button
            type="submit"
            disabled={!coach || !date || !time}
            className="w-full rounded-md bg-primary py-4 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            تأكيد الحجز
          </button>
        </form>
      </section>
    </>
  );
}
