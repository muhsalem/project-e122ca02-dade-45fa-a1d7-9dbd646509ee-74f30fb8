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

export const ILLUSTRATIONS = {
  compass: CompassIllustration,
  journey: JourneyIllustration,
  metric: MetricIllustration,
  growth: GrowthIllustration,
  support: SupportIllustration,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

export function Illustration({
  name,
  ...rest
}: Common & { name: IllustrationName }) {
  const C = ILLUSTRATIONS[name];
  return <C {...rest} />;
}
