/**
 * نظام الرسوم التوضيحية لبوصلة
 * رسوم SVG خفيفة تتبنّى ألوان النظام (light/dark) تلقائياً عبر `currentColor` و tokens.
 * استخدمها بدلاً من الصور النقطية في صفحات المحتوى لخفض الحجم وضمان الاتساق.
 *
 * @example
 *   <Illustration name="compass" className="h-40 w-40 text-primary" />
 */

import type { SVGProps } from "react";

type Common = SVGProps<SVGSVGElement> & { title?: string };

function Wrap({ children, title, ...rest }: Common & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

const ink = "currentColor";
const gold = "var(--gold)";
const bgSoft = "var(--secondary)";

/** بوصلة/خريطة المسار */
export function CompassIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "بوصلة المسار"} {...props}>
      <circle cx="100" cy="100" r="78" fill={bgSoft} />
      <circle cx="100" cy="100" r="60" stroke={ink} strokeWidth="2" opacity="0.4" />
      <circle cx="100" cy="100" r="42" stroke={ink} strokeWidth="1.5" opacity="0.25" />
      <path d="M100 50 L112 100 L100 150 L88 100 Z" fill={gold} opacity="0.9" />
      <path d="M50 100 L100 88 L150 100 L100 112 Z" fill={ink} opacity="0.75" />
      <circle cx="100" cy="100" r="6" fill={ink} />
      <text x="100" y="42" textAnchor="middle" fontSize="10" fill={ink} opacity="0.6">N</text>
    </Wrap>
  );
}

/** خريطة طريق / رحلة */
export function JourneyIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "رحلة التطوّر"} {...props}>
      <rect x="10" y="20" width="180" height="160" rx="14" fill={bgSoft} />
      <path
        d="M30 150 Q70 110 90 130 T150 70"
        stroke={ink}
        strokeWidth="3"
        strokeDasharray="6 6"
        opacity="0.6"
      />
      <circle cx="30" cy="150" r="8" fill={ink} />
      <circle cx="90" cy="130" r="6" fill={ink} opacity="0.7" />
      <circle cx="150" cy="70" r="10" fill={gold} />
      <path d="M147 66 l3 4 6 -8" stroke="white" strokeWidth="2" fill="none" />
    </Wrap>
  );
}

/** قياس / أداة سيكومترية */
export function MetricIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "تقييم سيكومتري"} {...props}>
      <rect x="20" y="40" width="160" height="120" rx="10" fill={bgSoft} />
      <rect x="36" y="120" width="22" height="24" rx="3" fill={ink} opacity="0.5" />
      <rect x="66" y="100" width="22" height="44" rx="3" fill={ink} opacity="0.7" />
      <rect x="96" y="80" width="22" height="64" rx="3" fill={ink} />
      <rect x="126" y="60" width="22" height="84" rx="3" fill={gold} />
      <path d="M30 156 L170 156" stroke={ink} strokeWidth="2" opacity="0.4" />
    </Wrap>
  );
}

/** نمو / تطوير */
export function GrowthIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "النمو المهني"} {...props}>
      <circle cx="100" cy="120" r="70" fill={bgSoft} />
      <path d="M100 170 L100 90" stroke={ink} strokeWidth="3" />
      <path d="M100 90 Q70 80 60 50" stroke={ink} strokeWidth="3" fill="none" />
      <path d="M100 90 Q130 80 140 50" stroke={ink} strokeWidth="3" fill="none" />
      <circle cx="60" cy="50" r="14" fill={gold} />
      <circle cx="140" cy="50" r="14" fill={gold} opacity="0.7" />
      <circle cx="100" cy="30" r="10" fill={ink} />
    </Wrap>
  );
}

/** دعم نفسي / مساحة آمنة */
export function SupportIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "مساحة آمنة"} {...props}>
      <circle cx="100" cy="100" r="80" fill={bgSoft} />
      <path
        d="M100 150 C 60 120, 50 80, 80 70 C 95 65, 100 80, 100 80 C 100 80, 105 65, 120 70 C 150 80, 140 120, 100 150 Z"
        fill={gold}
        opacity="0.9"
      />
      <path
        d="M100 150 C 60 120, 50 80, 80 70 C 95 65, 100 80, 100 80 C 100 80, 105 65, 120 70 C 150 80, 140 120, 100 150 Z"
        stroke={ink}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </Wrap>
  );
}

/** عقل / فحص نفسي */
export function BrainIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "الصحة النفسية"} {...props}>
      <circle cx="100" cy="100" r="78" fill={bgSoft} />
      <path
        d="M70 70 C 55 70, 50 90, 60 100 C 50 110, 55 130, 75 132 C 80 145, 105 145, 110 130 C 130 132, 140 115, 130 100 C 140 90, 130 70, 115 72 C 110 60, 80 60, 70 70 Z"
        fill={gold}
        opacity="0.85"
      />
      <path
        d="M95 75 Q95 100 80 105 M95 100 Q105 110 110 130 M85 90 Q70 95 75 110"
        stroke={ink}
        strokeWidth="2"
        fill="none"
        opacity="0.55"
      />
    </Wrap>
  );
}

/** عائلة / وليّ أمر */
export function FamilyIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "متابعة الأسرة"} {...props}>
      <rect x="10" y="20" width="180" height="160" rx="14" fill={bgSoft} />
      <circle cx="65" cy="80" r="16" fill={ink} opacity="0.8" />
      <path d="M40 140 Q40 105 65 105 Q90 105 90 140 Z" fill={ink} opacity="0.8" />
      <circle cx="135" cy="80" r="16" fill={gold} />
      <path d="M110 140 Q110 105 135 105 Q160 105 160 140 Z" fill={gold} />
      <circle cx="100" cy="115" r="10" fill={ink} />
      <path d="M85 155 Q85 130 100 130 Q115 130 115 155 Z" fill={ink} />
    </Wrap>
  );
}

/** فريق / عملاء (CRM) */
export function TeamIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "إدارة العملاء"} {...props}>
      <rect x="10" y="30" width="180" height="140" rx="12" fill={bgSoft} />
      <circle cx="55" cy="80" r="14" fill={ink} opacity="0.75" />
      <circle cx="100" cy="70" r="16" fill={gold} />
      <circle cx="145" cy="80" r="14" fill={ink} opacity="0.75" />
      <path d="M30 140 Q30 105 55 105 Q80 105 80 140 Z" fill={ink} opacity="0.55" />
      <path d="M72 145 Q72 100 100 100 Q128 100 128 145 Z" fill={gold} opacity="0.9" />
      <path d="M120 140 Q120 105 145 105 Q170 105 170 140 Z" fill={ink} opacity="0.55" />
    </Wrap>
  );
}

/** ميول/شخصية (RIASEC) */
export function ProfileIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "تشخيص الميول"} {...props}>
      <circle cx="100" cy="100" r="78" fill={bgSoft} />
      <polygon
        points="100,40 152,72 152,128 100,160 48,128 48,72"
        stroke={ink}
        strokeWidth="1.5"
        opacity="0.35"
      />
      <polygon
        points="100,60 138,82 134,124 100,140 64,122 60,84"
        fill={gold}
        opacity="0.85"
        stroke={ink}
        strokeWidth="1.5"
      />
      <circle cx="100" cy="100" r="4" fill={ink} />
    </Wrap>
  );
}

/** احتراق وظيفي */
export function FlameIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "مؤشّر الاحتراق"} {...props}>
      <circle cx="100" cy="100" r="78" fill={bgSoft} />
      <path
        d="M100 50 C 120 80, 140 90, 130 120 C 125 140, 110 150, 100 150 C 90 150, 75 140, 70 120 C 60 95, 85 90, 90 70 C 95 80, 100 65, 100 50 Z"
        fill={gold}
        opacity="0.95"
      />
      <path
        d="M100 90 C 110 105, 115 115, 110 128 C 107 138, 100 142, 100 142 C 100 142, 93 138, 90 128 C 86 115, 95 105, 100 90 Z"
        fill={ink}
        opacity="0.7"
      />
    </Wrap>
  );
}

/** طبقات/دمج (Comprehensive) */
export function LayersIllustration(props: Common) {
  return (
    <Wrap title={props.title ?? "التقرير الشامل"} {...props}>
      <rect x="20" y="30" width="160" height="140" rx="14" fill={bgSoft} />
      <rect x="40" y="55" width="120" height="22" rx="4" fill={ink} opacity="0.35" />
      <rect x="40" y="85" width="120" height="22" rx="4" fill={ink} opacity="0.55" />
      <rect x="40" y="115" width="120" height="22" rx="4" fill={gold} />
      <path d="M52 126 l8 7 18 -16" stroke="white" strokeWidth="3" fill="none" />
    </Wrap>
  );
}

export const ILLUSTRATIONS = {
  compass: CompassIllustration,
  journey: JourneyIllustration,
  metric: MetricIllustration,
  growth: GrowthIllustration,
  support: SupportIllustration,
  brain: BrainIllustration,
  family: FamilyIllustration,
  team: TeamIllustration,
  profile: ProfileIllustration,
  flame: FlameIllustration,
  layers: LayersIllustration,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

export function Illustration({
  name,
  ...rest
}: Common & { name: IllustrationName }) {
  const C = ILLUSTRATIONS[name];
  return <C {...rest} />;
}

/**
 * يختار الرسم المناسب تلقائياً حسب اسم المسار أو وسم محتوى.
 * مثال: pickIllustration("/burnout-check") → "flame"
 */
const ROUTE_MAP: Array<[RegExp, IllustrationName]> = [
  [/burnout/i, "flame"],
  [/wellbeing|mental|nafs/i, "brain"],
  [/clarity/i, "compass"],
  [/career-type|self-discovery|riasec|profile/i, "profile"],
  [/comprehensive|report/i, "layers"],
  [/parent/i, "family"],
  [/counselor-crm|crm|clients/i, "team"],
  [/counselor|coach|booking/i, "support"],
  [/growth|ladder|readiness|development/i, "growth"],
  [/learning|major|specializ/i, "metric"],
  [/journey|change|start/i, "journey"],
];

export function pickIllustration(routeOrTopic: string): IllustrationName {
  for (const entry of ROUTE_MAP) {
    const re = entry[0];
    const name = entry[1];
    if (re.test(routeOrTopic)) return name;
  }
  return "compass";
}

/** يختار الرسم تلقائياً بناءً على المسار أو موضوع محتوى مُمرّر. */
export function AutoIllustration({
  topic,
  ...rest
}: Common & { topic: string }) {
  return <Illustration name={pickIllustration(topic) as IllustrationName} {...rest} />;
}
