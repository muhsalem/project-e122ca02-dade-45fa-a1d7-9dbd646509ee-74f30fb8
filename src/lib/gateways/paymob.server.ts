// Paymob (Egypt) — Unified Intention / Checkout link.
// https://developers.paymob.com/egypt/checkout-api/payment-intention
import { createHmac, timingSafeEqual } from "node:crypto";
import { toMinor, type Currency } from "@/lib/pricing";

const PAYMOB_API = "https://accept.paymob.com/v1";

export type PaymobCheckoutInput = {
  orderId: string;
  orderNumber: string;
  amountMajor: number;
  currency: Currency; // EGP
  description: string;
  successUrl: string;
  callbackUrl: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_name?: string | null;
};

export type PaymobCheckoutResult = {
  gateway_ref: string;
  redirect_url: string;
  raw: unknown;
};

export async function paymobCreateIntention(
  input: PaymobCheckoutInput,
): Promise<PaymobCheckoutResult> {
  const secret = process.env.PAYMOB_SECRET_KEY;
  const publicKey = process.env.PAYMOB_PUBLIC_KEY;
  const integrationIds = (process.env.PAYMOB_INTEGRATION_IDS ?? "")
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));

  if (!secret || !publicKey || integrationIds.length === 0) {
    throw new Error(
      "Paymob keys missing: need PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, PAYMOB_INTEGRATION_IDS",
    );
  }

  const [firstName, ...rest] = (input.customer_name ?? "Customer").split(" ");
  const lastName = rest.join(" ") || "-";

  const body = {
    amount: toMinor(input.amountMajor, input.currency),
    currency: input.currency,
    payment_methods: integrationIds,
    items: [
      {
        name: input.description.slice(0, 60),
        amount: toMinor(input.amountMajor, input.currency),
        description: input.description,
        quantity: 1,
      },
    ],
    billing_data: {
      apartment: "NA",
      first_name: firstName,
      last_name: lastName,
      street: "NA",
      building: "NA",
      phone_number: input.customer_phone ?? "+201000000000",
      country: "EG",
      email: input.customer_email ?? "noreply@bosala.app",
      floor: "NA",
      state: "NA",
    },
    extras: {
      order_id: input.orderId,
      order_number: input.orderNumber,
    },
    notification_url: input.callbackUrl,
    redirection_url: input.successUrl,
  };

  const res = await fetch(`${PAYMOB_API}/intention/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${secret}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Paymob intention failed [${res.status}]: ${JSON.stringify(raw)}`,
    );
  }
  const clientSecret = (raw as { client_secret?: string }).client_secret;
  const gateway_ref =
    (raw as { id?: string; intention_order_id?: string }).id ??
    String((raw as { intention_order_id?: string }).intention_order_id ?? "");
  if (!clientSecret) throw new Error("Paymob returned no client_secret");
  const redirect_url = `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
    publicKey,
  )}&clientSecret=${encodeURIComponent(clientSecret)}`;
  return { gateway_ref, redirect_url, raw };
}

// Paymob HMAC-SHA512 over concatenated field values (Transaction Processed webhook).
export function paymobVerifyHmac(
  payload: Record<string, unknown>,
  receivedHmac: string,
): boolean {
  const hmacKey = process.env.PAYMOB_HMAC_KEY;
  if (!hmacKey || !receivedHmac) return false;
  // Paymob's documented concatenation order for transaction webhooks:
  const obj = (payload as { obj?: Record<string, unknown> }).obj ?? payload;
  const o = obj as Record<string, unknown>;
  const src = o.source_data as Record<string, unknown> | undefined;
  const order = o.order as Record<string, unknown> | undefined;
  const concat = [
    o.amount_cents,
    o.created_at,
    o.currency,
    o.error_occured,
    o.has_parent_transaction,
    o.id,
    o.integration_id,
    o.is_3d_secure,
    o.is_auth,
    o.is_capture,
    o.is_refunded,
    o.is_standalone_payment,
    o.is_voided,
    order?.id,
    o.owner,
    o.pending,
    src?.pan,
    src?.sub_type,
    src?.type,
    o.success,
  ]
    .map((v) => (v === undefined || v === null ? "" : String(v)))
    .join("");

  const digest = createHmac("sha512", hmacKey).update(concat).digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(digest, "hex"),
      Buffer.from(receivedHmac.toLowerCase(), "hex"),
    );
  } catch {
    return false;
  }
}

export function paymobParseEvent(payload: unknown): {
  order_ref?: string;
  gateway_ref?: string;
  status: "captured" | "failed" | "pending";
} {
  const obj = (payload as { obj?: Record<string, unknown> }).obj ??
    (payload as Record<string, unknown>);
  const o = obj as Record<string, unknown>;
  const success = Boolean(o.success);
  const pending = Boolean(o.pending);
  const status: "captured" | "failed" | "pending" = success
    ? "captured"
    : pending
    ? "pending"
    : "failed";
  const order = o.order as Record<string, unknown> | undefined;
  const extras = (order?.extras ?? {}) as Record<string, unknown>;
  return {
    order_ref: (extras.order_id as string | undefined) ?? undefined,
    gateway_ref: o.id !== undefined ? String(o.id) : undefined,
    status,
  };
}
