// Tap Payments (GCC-wide) — Charges API with hosted redirect.
// https://developers.tap.company/reference/create-a-charge
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Currency } from "@/lib/pricing";

const TAP_API = "https://api.tap.company/v2";

export type TapCheckoutInput = {
  orderId: string;
  orderNumber: string;
  amountMajor: number;
  currency: Currency;
  description: string;
  successUrl: string;
  callbackUrl: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_name?: string | null;
};

export type TapCheckoutResult = {
  gateway_ref: string;
  redirect_url: string;
  raw: unknown;
};

export async function tapCreateCharge(
  input: TapCheckoutInput,
): Promise<TapCheckoutResult> {
  const key = process.env.TAP_SECRET_KEY;
  if (!key) throw new Error("TAP_SECRET_KEY not configured");

  const [firstName, ...rest] = (input.customer_name ?? "Customer").split(" ");
  const lastName = rest.join(" ") || "-";

  const body = {
    amount: input.amountMajor, // Tap uses major units
    currency: input.currency,
    description: input.description,
    reference: {
      order: input.orderNumber,
      transaction: input.orderId,
    },
    customer: {
      first_name: firstName,
      last_name: lastName,
      email: input.customer_email ?? undefined,
      phone: input.customer_phone
        ? { country_code: "965", number: input.customer_phone.replace(/^\+?\d{1,3}/, "") }
        : undefined,
    },
    source: { id: "src_all" },
    post: { url: input.callbackUrl }, // webhook
    redirect: { url: input.successUrl },
    metadata: {
      order_id: input.orderId,
      order_number: input.orderNumber,
    },
  };

  const res = await fetch(`${TAP_API}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Tap create charge failed [${res.status}]: ${JSON.stringify(raw)}`);
  }
  const r = raw as { id?: string; transaction?: { url?: string } };
  if (!r.id || !r.transaction?.url) {
    throw new Error("Tap returned no charge URL");
  }
  return { gateway_ref: r.id, redirect_url: r.transaction.url, raw };
}

// Tap sends 'hashstring' header — HMAC-SHA256 over concatenated fields.
export function tapVerifyHmac(
  payload: Record<string, unknown>,
  hashHeader: string | null,
): boolean {
  const secret = process.env.TAP_WEBHOOK_SECRET;
  if (!secret || !hashHeader) return false;
  const p = payload as {
    id?: string;
    amount?: number;
    currency?: string;
    gateway?: { reference?: { transaction?: string } };
    transaction?: { created?: string };
    status?: string;
  };
  const concat = `x_id${p.id ?? ""}x_amount${p.amount ?? ""}x_currency${p.currency ?? ""}x_gateway_reference${p.gateway?.reference?.transaction ?? ""}x_created${p.transaction?.created ?? ""}x_status${p.status ?? ""}`;
  const digest = createHmac("sha256", secret).update(concat).digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(digest, "hex"),
      Buffer.from(hashHeader.toLowerCase(), "hex"),
    );
  } catch {
    return false;
  }
}

export function tapParseEvent(payload: unknown): {
  order_ref?: string;
  gateway_ref?: string;
  status: "captured" | "failed" | "pending";
} {
  const p = payload as {
    id?: string;
    status?: string;
    metadata?: { order_id?: string };
  };
  const s = (p.status ?? "").toUpperCase();
  const status: "captured" | "failed" | "pending" =
    s === "CAPTURED" ? "captured" : s === "FAILED" || s === "DECLINED" ? "failed" : "pending";
  return { order_ref: p.metadata?.order_id, gateway_ref: p.id, status };
}
