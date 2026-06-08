import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InSchema = z.object({
  code: z.string().trim().min(2).max(64),
  ttlDays: z.number().int().min(1).max(365).optional(),
});

/** Create a short-lived HMAC-signed share token for a report code. */
export const createReportShareToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InSchema.parse(d))
  .handler(async ({ data }) => {
    const { signShareToken } = await import("./share-token.server");
    const token = await signShareToken(data.code, data.ttlDays ?? 30);
    return { token };
  });

const VerifySchema = z.object({ token: z.string().min(10).max(1024) });

/** Verify a share token; returns the report code or throws. */
export const resolveShareToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VerifySchema.parse(d))
  .handler(async ({ data }) => {
    const { verifyShareToken } = await import("./share-token.server");
    const code = await verifyShareToken(data.token);
    if (!code) throw new Error("الرابط غير صالح أو انتهت صلاحيته.");
    return { code };
  });
