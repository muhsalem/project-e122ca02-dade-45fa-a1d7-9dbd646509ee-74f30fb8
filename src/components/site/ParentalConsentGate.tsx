import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { recordConsent, getLatestConsent } from "@/lib/consent.functions";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  assessmentKey: string;
  assessmentTitle: string;
  children: React.ReactNode;
};

const LS_KEY = (k: string, uid: string) => `bousla.consent.${uid}.${k}`;

const CONSENT_TEXT =
  "أُقرّ بأنني وليّ أمر الطالب/ة، وأمنح موافقتي على خضوعه/ا لهذا الاختبار النفسي/التربوي عبر منصة بوصلة، وأنّني اطّلعت على سياسة الخصوصية وأوافق على معالجة البيانات لأغراض الإرشاد المهني والتعليمي فقط، مع علمي أن نتائج الاختبارات ذات طابع إرشادي وليست تشخيصاً سريرياً.";

export function ParentalConsentGate({ assessmentKey, assessmentTitle, children }: Props) {
  const [status, setStatus] = useState<"loading" | "ask-age" | "ask-guardian" | "ok">("loading");
  const [uid, setUid] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [gName, setGName] = useState("");
  const [gRel, setGRel] = useState("");
  const [gContact, setGContact] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const record = useServerFn(recordConsent);
  const latest = useServerFn(getLatestConsent);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!mounted) return;
      if (!user) {
        // Not signed in — let the child render; assessment page will handle auth.
        setStatus("ok");
        return;
      }
      setUid(user.id);
      // local cache
      try {
        const cached = localStorage.getItem(LS_KEY(assessmentKey, user.id));
        if (cached) {
          const p = JSON.parse(cached);
          if (p?.ok) {
            setStatus("ok");
            return;
          }
        }
      } catch { /* noop */ }
      try {
        const row = await latest({ data: { assessmentKey } });
        if (!mounted) return;
        if (row && (!row.is_minor || row.guardian_confirmed)) {
          localStorage.setItem(LS_KEY(assessmentKey, user.id), JSON.stringify({ ok: true }));
          setStatus("ok");
          return;
        }
      } catch { /* fall through */ }
      setStatus("ask-age");
    })();
    return () => { mounted = false; };
  }, [assessmentKey, latest]);

  const submitAge = () => {
    setErr(null);
    const n = parseInt(age, 10);
    if (!Number.isFinite(n) || n < 3 || n > 120) {
      setErr("يرجى إدخال عمر صحيح.");
      return;
    }
    if (n >= 18) {
      // adult — record consent for self and proceed
      (async () => {
        setBusy(true);
        try {
          await record({
            data: {
              assessmentKey,
              studentAge: n,
              guardianConfirmed: false,
              consentText: `موافقة ذاتية (بالغ) على اختبار: ${assessmentTitle}`,
            },
          });
          if (uid) localStorage.setItem(LS_KEY(assessmentKey, uid), JSON.stringify({ ok: true }));
          setStatus("ok");
        } catch (e) {
          setErr(e instanceof Error ? e.message : "تعذّر حفظ الموافقة.");
        } finally {
          setBusy(false);
        }
      })();
      return;
    }
    setStatus("ask-guardian");
  };

  const submitGuardian = async () => {
    setErr(null);
    const n = parseInt(age, 10);
    if (!gName.trim() || !gContact.trim() || !agree) {
      setErr("يرجى تعبئة اسم وليّ الأمر ووسيلة التواصل، وتأكيد الموافقة.");
      return;
    }
    setBusy(true);
    try {
      await record({
        data: {
          assessmentKey,
          studentAge: n,
          guardianName: gName.trim(),
          guardianRelation: gRel.trim() || "وليّ أمر",
          guardianContact: gContact.trim(),
          guardianConfirmed: true,
          consentText: `${CONSENT_TEXT}\nاختبار: ${assessmentTitle}`,
        },
      });
      if (uid) localStorage.setItem(LS_KEY(assessmentKey, uid), JSON.stringify({ ok: true }));
      setStatus("ok");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر تسجيل الموافقة.");
    } finally {
      setBusy(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container-page py-16 text-center text-muted-foreground">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        <p className="mt-3 text-sm">جارٍ التحقق من الموافقة…</p>
      </div>
    );
  }

  if (status === "ok") return <>{children}</>;

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-primary">بوابة الموافقة قبل الاختبار</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              حمايةً للقاصرين، نتحقق من عمر الطالب/ة قبل بدء «{assessmentTitle}»، ونطلب موافقة وليّ الأمر إن كان دون 18 عاماً.
            </p>
          </div>
        </div>

        {status === "ask-age" && (
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">عمر الطالب/ة (بالسنوات)</span>
              <input
                type="number"
                min={3}
                max={120}
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="مثال: 16"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              onClick={submitAge}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              متابعة
            </button>
          </div>
        )}

        {status === "ask-guardian" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-6 text-amber-800 dark:text-amber-200">
              الطالب/ة دون 18 عاماً. يجب على وليّ الأمر تعبئة بياناته وتأكيد الموافقة قبل بدء الاختبار. سيتم حفظ الموافقة في سجل رسمي (تاريخ ووقت وعنوان الاتصال) لأغراض الامتثال.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={gName}
                onChange={(e) => setGName(e.target.value)}
                placeholder="اسم وليّ الأمر الكامل"
                maxLength={120}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                value={gRel}
                onChange={(e) => setGRel(e.target.value)}
                placeholder="صلة القرابة (أب/أم/وصي)"
                maxLength={60}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <input
              value={gContact}
              onChange={(e) => setGContact(e.target.value)}
              placeholder="رقم جوال أو بريد وليّ الأمر"
              maxLength={160}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <label className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3 text-xs leading-6">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>{CONSENT_TEXT}</span>
            </label>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setStatus("ask-age")}
                className="rounded-lg border border-border px-4 py-2.5 text-sm"
              >
                رجوع
              </button>
              <button
                onClick={submitGuardian}
                disabled={busy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                تسجيل الموافقة والمتابعة
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          يُسجَّل تاريخ الموافقة وعنوان الاتصال (IP) في سجل <code>consent_log</code> وفقاً للأنظمة المعمول بها (PDPL/GDPR).
        </p>
      </div>
    </section>
  );
}
