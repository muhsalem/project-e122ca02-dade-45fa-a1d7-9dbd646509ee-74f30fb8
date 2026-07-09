// Regional pricing catalog for بوصلة platform.
// Prices tuned per market by an expert pricing lens (PPP + local benchmarks
// for career-coaching services). Update this file only via product review.

export type CountryCode = "SA" | "AE" | "KW" | "QA" | "BH" | "OM" | "EG";
export type Currency = "SAR" | "AED" | "KWD" | "QAR" | "BHD" | "OMR" | "EGP";

export type ProductCode =
  | "session_single"
  | "package_full"
  | "report_ai"
  | "transition_plan"
  | "certificate";

export const COUNTRIES: {
  code: CountryCode;
  currency: Currency;
  name_ar: string;
  flag: string;
  decimals: 2 | 3;
}[] = [
  { code: "SA", currency: "SAR", name_ar: "السعودية", flag: "🇸🇦", decimals: 2 },
  { code: "AE", currency: "AED", name_ar: "الإمارات", flag: "🇦🇪", decimals: 2 },
  { code: "KW", currency: "KWD", name_ar: "الكويت", flag: "🇰🇼", decimals: 3 },
  { code: "QA", currency: "QAR", name_ar: "قطر", flag: "🇶🇦", decimals: 2 },
  { code: "BH", currency: "BHD", name_ar: "البحرين", flag: "🇧🇭", decimals: 3 },
  { code: "OM", currency: "OMR", name_ar: "عُمان", flag: "🇴🇲", decimals: 3 },
  { code: "EG", currency: "EGP", name_ar: "مصر", flag: "🇪🇬", decimals: 2 },
];

export const CURRENCY_DECIMALS: Record<Currency, 2 | 3> = {
  SAR: 2, AED: 2, QAR: 2, EGP: 2, KWD: 3, BHD: 3, OMR: 3,
};

export const PRODUCTS: {
  code: ProductCode;
  name_ar: string;
  desc_ar: string;
}[] = [
  { code: "session_single", name_ar: "جلسة كوتشينج فردية (60 دقيقة)", desc_ar: "مع مدرب معتمد ICF — تشمل تقرير جلسة وخطة عمل مكتوبة." },
  { code: "package_full", name_ar: "باقة المسار الكامل — 5 جلسات + IDP", desc_ar: "خطة تطوير فردية 90 يوم + متابعة واتساب بين الجلسات." },
  { code: "report_ai", name_ar: "تقرير AI تفصيلي (PDF)", desc_ar: "تحليل معمّق مبني على نتائج تقييماتك." },
  { code: "transition_plan", name_ar: "خطة انتقال مهني مكتوبة", desc_ar: "خطة عملية لتغيير المسار الوظيفي على 90 يوم." },
  { code: "certificate", name_ar: "شهادة الجاهزية المهنية الموثّقة", desc_ar: "شهادة رقمية موثّقة قابلة للتحقق." },
];

// Prices in MAJOR units (e.g. 350 SAR, 2400 EGP, 32 KWD).
// Expert calibration:
//  - Gulf tier (SA/QA/AE/BH/OM/KW) priced near parity in USD.
//  - KWD/BHD/OMR are stronger currencies, so numbers look small but map to ~$95–$105 USD.
//  - EG uses PPP-adjusted pricing (~40–55% of Gulf USD) so it's accessible without eroding value.
export const CATALOG: Record<
  ProductCode,
  Record<CountryCode, { currency: Currency; amount: number }>
> = {
  session_single: {
    SA: { currency: "SAR", amount: 350 },
    AE: { currency: "AED", amount: 385 },
    KW: { currency: "KWD", amount: 32 },
    QA: { currency: "QAR", amount: 380 },
    BH: { currency: "BHD", amount: 38 },
    OM: { currency: "OMR", amount: 40 },
    EG: { currency: "EGP", amount: 2400 },
  },
  package_full: {
    SA: { currency: "SAR", amount: 1500 },
    AE: { currency: "AED", amount: 1650 },
    KW: { currency: "KWD", amount: 135 },
    QA: { currency: "QAR", amount: 1600 },
    BH: { currency: "BHD", amount: 160 },
    OM: { currency: "OMR", amount: 170 },
    EG: { currency: "EGP", amount: 9900 },
  },
  report_ai: {
    SA: { currency: "SAR", amount: 49 },
    AE: { currency: "AED", amount: 55 },
    KW: { currency: "KWD", amount: 4.5 },
    QA: { currency: "QAR", amount: 50 },
    BH: { currency: "BHD", amount: 5 },
    OM: { currency: "OMR", amount: 5 },
    EG: { currency: "EGP", amount: 349 },
  },
  transition_plan: {
    SA: { currency: "SAR", amount: 199 },
    AE: { currency: "AED", amount: 220 },
    KW: { currency: "KWD", amount: 18 },
    QA: { currency: "QAR", amount: 200 },
    BH: { currency: "BHD", amount: 20 },
    OM: { currency: "OMR", amount: 21 },
    EG: { currency: "EGP", amount: 1400 },
  },
  certificate: {
    SA: { currency: "SAR", amount: 99 },
    AE: { currency: "AED", amount: 110 },
    KW: { currency: "KWD", amount: 9 },
    QA: { currency: "QAR", amount: 100 },
    BH: { currency: "BHD", amount: 10 },
    OM: { currency: "OMR", amount: 11 },
    EG: { currency: "EGP", amount: 700 },
  },
};

export type Gateway = "moyasar" | "paymob" | "tap";

// Preferred gateway per country. Alt gateways used as fallback / user choice.
export const GATEWAY_ROUTING: Record<CountryCode, { primary: Gateway; alt: Gateway[] }> = {
  SA: { primary: "moyasar", alt: ["tap"] },
  AE: { primary: "tap", alt: ["moyasar"] },
  KW: { primary: "tap", alt: [] },
  QA: { primary: "tap", alt: ["moyasar"] },
  BH: { primary: "tap", alt: [] },
  OM: { primary: "tap", alt: [] },
  EG: { primary: "paymob", alt: [] },
};

export function toMinor(amountMajor: number, currency: Currency): number {
  const d = CURRENCY_DECIMALS[currency];
  return Math.round(amountMajor * Math.pow(10, d));
}

export function toMajor(amountMinor: number, currency: Currency): number {
  const d = CURRENCY_DECIMALS[currency];
  return amountMinor / Math.pow(10, d);
}

export function formatPrice(amountMajor: number, currency: Currency, locale = "ar"): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: CURRENCY_DECIMALS[currency],
    }).format(amountMajor);
  } catch {
    return `${amountMajor} ${currency}`;
  }
}

export function getPrice(product: ProductCode, country: CountryCode) {
  return CATALOG[product][country];
}

export function getProduct(code: ProductCode) {
  return PRODUCTS.find((p) => p.code === code);
}
