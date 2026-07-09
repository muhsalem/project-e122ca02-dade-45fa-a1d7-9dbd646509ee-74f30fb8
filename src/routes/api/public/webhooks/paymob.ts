import { createFileRoute } from "@tanstack/react-router";
import { paymobParseEvent, paymobVerifyHmac } from "@/lib/gateways/paymob.server";

export const Route = createFileRoute("/api/public/webhooks/paymob")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const hmac = url.searchParams.get("hmac") ?? request.headers.get("hmac") ?? "";
        const raw = await request.text();
        let payload: Record<string, unknown>;
        try { payload = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
        if (!paymobVerifyHmac(payload, hmac)) {
          return new Response("Invalid HMAC", { status: 401 });
        }
        const evt = paymobParseEvent(payload);
        if (!evt.order_ref) return new Response("Missing order_ref", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("payments").insert({
          order_id: evt.order_ref,
          gateway: "paymob",
          gateway_ref: evt.gateway_ref ?? null,
          status: evt.status,
          amount_minor: 0,
          currency: "EGP",
          raw: payload as never,
        });
        if (evt.status === "captured") {
          await supabaseAdmin
            .from("orders")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("id", evt.order_ref);
        } else if (evt.status === "failed") {
          await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", evt.order_ref);
        }
        return new Response("ok");
      },
    },
  },
});
