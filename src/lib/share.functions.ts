import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const CreateSchema = z.object({
  code: z.string().trim().min(2).max(64),
  ttlDays: z.number().int().min(1).max(30).optional(),
  password: z.string().min(4).max(128).optional(),
});

function callerIp(): string | null {
  return (
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    getRequestHeader("x-real-ip") ||
    null
  );
}

async function logAudit(entry: {
  action: string;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("audit_log").insert({
      action: entry.action,
      target_type: entry.target_type ?? null,
      target_id: entry.target_id ?? null,
      actor_ip: callerIp(),
      metadata: entry.metadata ?? {},
    });
  } catch (e) {
    console.error("[audit_log] failed:", e);
  }
}

/** Create an HMAC-signed share token (default 7 days, optional password). */
export const createReportShareToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CreateSchema.parse(d))
  .handler(async ({ data }) => {
    const { signShareToken } = await import("./share-token.server");
    const ttlDays = data.ttlDays ?? 7;
    const token = await signShareToken(data.code, ttlDays, data.password);
    const expiresAt = new Date(Date.now() + ttlDays * 86400 * 1000).toISOString();
    await logAudit({
      action: "share_token.create",
      target_type: "report",
      target_id: data.code,
      metadata: { ttl_days: ttlDays, password_protected: !!data.password, expires_at: expiresAt },
    });
    return { token, expiresAt, ttlDays, passwordProtected: !!data.password };
  });

const InspectSchema = z.object({ token: z.string().min(10).max(2048) });

/** Peek at a token to know if it needs a password before prompting the user. */
export const inspectReportShareToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InspectSchema.parse(d))
  .handler(async ({ data }) => {
    const { inspectShareToken } = await import("./share-token.server");
    const res = await inspectShareToken(data.token);
    if (!res.ok) {
      return { valid: false as const, requiresPassword: false, reason: res.reason };
    }
    return {
      valid: true as const,
      requiresPassword: res.requiresPassword,
      expiresAt: new Date(res.expiresAt * 1000).toISOString(),
    };
  });

const VerifySchema = z.object({
  token: z.string().min(10).max(2048),
  password: z.string().max(128).optional(),
});

/** Verify a share token; returns the report code or an error reason. */
export const resolveShareToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VerifySchema.parse(d))
  .handler(async ({ data }) => {
    const { verifyShareToken } = await import("./share-token.server");
    const res = await verifyShareToken(data.token, data.password);
    if (res.ok) {
      await logAudit({
        action: "share_token.open",
        target_type: "report",
        target_id: res.code,
        metadata: { result: "ok" },
      });
      return { code: res.code };
    }
    // Log failures (bad password / expired / invalid) without leaking code
    await logAudit({
      action: "share_token.open_failed",
      target_type: "report",
      metadata: { reason: res.reason },
    });
    if (res.reason === "password_required") {
      const err = new Error("PASSWORD_REQUIRED");
      (err as Error & { code: string }).code = "PASSWORD_REQUIRED";
      throw err;
    }
    if (res.reason === "bad_password") {
      throw new Error("كلمة المرور غير صحيحة.");
    }
    if (res.reason === "expired") {
      throw new Error("انتهت صلاحية الرابط. اطلب رابطاً جديداً من صاحب التقرير.");
    }
    throw new Error("الرابط غير صالح.");
  });
