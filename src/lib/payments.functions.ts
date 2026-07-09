import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  CATALOG,
  GATEWAY_ROUTING,
  PRODUCTS,
  toMinor,
  type CountryCode,
  type Gateway,
  type ProductCode,
} from "@/lib/pricing";

export type CheckoutInput = {
  product: ProductCode;
  country: CountryCode;
  gateway?: Gateway; // optional user override
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  metadata?: Record<string, unknown>;
};

export type CheckoutResult = {
  order_id: string;
  order_number: string;
  gateway: Gateway;
  redirect_url: string;
};

export const initiateCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CheckoutInput) => {
    if (!CATALOG[input.product]) throw new Error("Unknown product");
    if (!CATALOG[input.product][input.country]) throw new Error("Unsupported country");
    return input;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    const price = CATALOG[data.product][data.country];
    const product = PRODUCTS.find((p) => p.code === data.product)!;
    const routing = GATEWAY_ROUTING[data.country];
    const gateway: Gateway = data.gateway ?? routing.primary;

    // Load service-role admin client inside handler only.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Create the order row
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: context.userId,
        product_code: data.product,
        product_name: product.name_ar,
        country_code: data.country,
        currency: price.currency,
        amount_minor: toMinor(price.amount, price.currency),
        status: "pending",
        gateway,
        customer_email: data.customer_email ?? null,
        customer_phone: data.customer_phone ?? null,
        customer_name: data.customer_name ?? null,
        metadata: data.metadata ?? {},
      })
      .select("id, order_number")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Order creation failed");

    // Resolve URLs from the incoming request
    const host = getRequestHeader("host") ?? "bosala.app";
    const proto = getRequestHeader("x-forwarded-proto") ?? "https";
    const origin = `${proto}://${host}`;
    const successUrl = `${origin}/checkout/success?order=${order.order_number}`;
    const callbackUrl = `${origin}/api/public/webhooks/${gateway}`;

    const checkoutInput = {
      orderId: order.id,
      orderNumber: order.order_number,
      amountMajor: price.amount,
      currency: price.currency,
      description: `${product.name_ar} — ${order.order_number}`,
      successUrl,
      backUrl: successUrl,
      callbackUrl,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      customer_name: data.customer_name,
    };

    let gateway_ref = "";
    let redirect_url = "";
    let raw: unknown = {};

    try {
      if (gateway === "moyasar") {
        const { moyasarCreateInvoice } = await import("@/lib/gateways/moyasar.server");
        const r = await moyasarCreateInvoice(checkoutInput);
        gateway_ref = r.gateway_ref; redirect_url = r.redirect_url; raw = r.raw;
      } else if (gateway === "paymob") {
        const { paymobCreateIntention } = await import("@/lib/gateways/paymob.server");
        const r = await paymobCreateIntention(checkoutInput);
        gateway_ref = r.gateway_ref; redirect_url = r.redirect_url; raw = r.raw;
      } else if (gateway === "tap") {
        const { tapCreateCharge } = await import("@/lib/gateways/tap.server");
        const r = await tapCreateCharge(checkoutInput);
        gateway_ref = r.gateway_ref; redirect_url = r.redirect_url; raw = r.raw;
      } else {
        throw new Error(`Unsupported gateway: ${gateway}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabaseAdmin.from("payments").insert({
        order_id: order.id,
        gateway,
        status: "failed",
        amount_minor: toMinor(price.amount, price.currency),
        currency: price.currency,
        error_message: msg,
      });
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
      throw new Error(`تعذّر بدء الدفع: ${msg}`);
    }

    await supabaseAdmin
      .from("orders")
      .update({ gateway_ref, status: "processing" })
      .eq("id", order.id);

    await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      gateway,
      gateway_ref,
      status: "initiated",
      amount_minor: toMinor(price.amount, price.currency),
      currency: price.currency,
      raw: raw as never,
    });

    return {
      order_id: order.id,
      order_number: order.order_number,
      gateway,
      redirect_url,
    };
  });

export type OrderDTO = {
  id: string;
  order_number: string;
  product_name: string;
  currency: string;
  amount_minor: number;
  status: string;
  gateway: string | null;
  created_at: string;
  paid_at: string | null;
};

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OrderDTO[]> => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, product_name, currency, amount_minor, status, gateway, created_at, paid_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as OrderDTO[];
  });
