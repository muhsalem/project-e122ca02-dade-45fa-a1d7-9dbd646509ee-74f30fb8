import { createFileRoute } from "@tanstack/react-router";
import { moyasarParseEvent, moyasarVerifyWebhook } from "@/lib/gateways/moyasar.server";

export const Route = createFileRoute("/api/public/webhooks/moyasar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (!moyasarVerifyWebhook(request, raw)) {
          return new Response("Invalid signature", { status: 401 });
        }
        let payload: unknown;
        try { payload = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
        const evt = moyasarParseEvent(payload);
        if (!evt.order_ref) return new Response("Missing order_ref", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("payments").insert({
          order_id: evt.order_ref,
          gateway: "moyasar",
          gateway_ref: evt.gateway_ref ?? null,
          status: evt.status,
          amount_minor: 0,
          currency: "SAR",
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
