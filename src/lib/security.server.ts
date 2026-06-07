// Server-only security helpers (rate limiting + audit log).
// MUST only be imported inside server-fn handlers via `await import(...)`.
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Best-effort client IP extraction (Cloudflare → x-forwarded-for → fallback). */
export function getClientIp(): string {
  try {
    const req = getRequest();
    const h = req?.headers;
    if (!h) return "unknown";
    return (
      h.get("cf-connecting-ip") ||
      h.get("x-real-ip") ||
      (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

/**
 * Enforce a per-client rate limit. Throws a user-safe Error when exceeded.
 * Uses fixed time windows for predictability and cheap atomic increments.
 */
export async function enforceRateLimit(opts: {
  bucket: string;
  clientKey?: string;       // defaults to client IP
  limit: number;            // max hits per window
  windowSeconds: number;    // window size
}): Promise<void> {
  const clientKey = opts.clientKey || getClientIp();
  const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
    p_bucket: opts.bucket,
    p_client_key: clientKey,
    p_limit: opts.limit,
    p_window_seconds: opts.windowSeconds,
  });
  if (error) {
    console.error("Rate-limit RPC error:", error);
    return; // fail-open: do not block real users on infra issues
  }
  if (data === false) {
    throw new Error("تم تجاوز حد الاستخدام مؤقتاً. حاول بعد دقائق قليلة.");
  }
}

/** Write an audit-log entry. Never throws — audit failure must not block business logic. */
export async function audit(entry: {
  action: string;
  actorId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabaseAdmin.from("audit_log").insert({
      action: entry.action,
      actor_id: entry.actorId ?? null,
      actor_ip: getClientIp(),
      target_type: entry.targetType ?? null,
      target_id: entry.targetId ?? null,
      metadata: (entry.metadata ?? {}) as never,
    });
  } catch (e) {
    console.error("Audit write failed:", e);
  }
}
