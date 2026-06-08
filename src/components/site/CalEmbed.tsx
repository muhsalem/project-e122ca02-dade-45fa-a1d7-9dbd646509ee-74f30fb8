import { useEffect, useRef } from "react";

/**
 * Lightweight Cal.com embed (no extra deps). Renders an iframe sized to its container.
 * Pass `calLink` like "your-team/coaching-30min".
 */
export function CalEmbed({ calLink, height = 720 }: { calLink: string; height?: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    // Auto-resize via postMessage from Cal (best effort).
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "object" || !e.data || e.origin.indexOf("cal.com") === -1) return;
      const h = (e.data as { __height?: number }).__height;
      if (h && ref.current) ref.current.style.height = `${h}px`;
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const src = `https://cal.com/${encodeURIComponent(calLink)}?embed=true&theme=light&layout=month_view`;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <iframe
        ref={ref}
        src={src}
        title="حجز موعد عبر Cal.com"
        loading="lazy"
        style={{ width: "100%", height, border: 0, display: "block" }}
        allow="camera; microphone; fullscreen"
      />
    </div>
  );
}
