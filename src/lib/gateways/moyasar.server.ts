// Moyasar (Saudi Arabia) — hosted invoice checkout.
// https://docs.moyasar.com/api/invoices
import { toMinor, type Currency } from "@/lib/pricing";

const MOYASAR_API = "https://api.moyasar.com/v1";

export type MoyasarCheckoutInput = {
  orderId: string;
  orderNumber: string;
  amountMajor: number;
  currency: Currency; // SAR, AED, KWD (Moyasar supports SAR + a few Gulf currencies)
  description: string;
  successUrl: string;
  backUrl: string;
  callbackUrl: string; // webhook
  customer_email?: string | null;
};

export type MoyasarCheckoutResult = {
  gateway_ref: string;
  redirect_url: string;
  raw: unknown;
};

export async function moyasarCreateInvoice(
  input: MoyasarCheckoutInput,
): Promise<MoyasarCheckoutResult> {
  const key = process.env.MOYASAR_SECRET_KEY;
  if (!key) throw new Error("MOYASAR_SECRET_KEY not configured");

  const body = {
    amount: toMinor(input.amountMajor, input.currency),
    currency: input.currency,
    description: input.description,
    callback_url: input.successUrl,
    back_url: input.backUrl,
    success_url: input.successUrl,
    metadata: {
      order_id: input.orderId,
      order_number: input.orderNumber,
      customer_email: input.customer_email ?? "",
    },
  };

  const res = await fetch(`${MOYASAR_API}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${key}:`)}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Moyasar create invoice failed [${res.status}]: ${JSON.stringify(raw)}`,
    );
  }
  const gateway_ref = (raw as { id?: string }).id ?? "";
  const redirect_url = (raw as { url?: string }).url ?? "";
  if (!gateway_ref || !redirect_url) {
    throw new Error("Moyasar returned no invoice url");
  }
  return { gateway_ref, redirect_url, raw };
}

// Moyasar webhook: shared secret via header 'x-moyasar-token' or via
// HTTP Basic Auth in webhook config. We accept either.
export function moyasarVerifyWebhook(request: Request, rawBody: string): boolean {
  const expected = process.env.MOYASAR_WEBHOOK_SECRET;
  if (!expected) return false;
  const tokenHeader = request.headers.get("x-moyasar-token");
  if (tokenHeader && tokenHeader === expected) return true;
  const auth = request.headers.get("authorization");
  if (auth && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const [u] = decoded.split(":");
      if (u === expected) return true;
    } catch { /* ignore */ }
  }
  // touch rawBody so linter doesn't complain
  void rawBody;
  return false;
}

// Payload event shape mapping
export function moyasarParseEvent(payload: unknown): {
  order_ref?: string;
  gateway_ref?: string;
  status: "captured" | "failed" | "pending";
} {
  const p = payload as {
    type?: string;
    data?: {
      id?: string;
      status?: string;
      metadata?: { order_id?: string; order_number?: string };
    };
  };
  const status =
    p.data?.status === "paid"
      ? "captured"
      : p.data?.status === "failed"
      ? "failed"
      : "pending";
  return {
    order_ref: p.data?.metadata?.order_id,
    gateway_ref: p.data?.id,
    status,
  };
}
