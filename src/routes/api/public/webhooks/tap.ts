import { createFileRoute } from "@tanstack/react-router";
import { tapParseEvent, tapVerifyHmac } from "@/lib/gateways/tap.server";

export const Route = createFileRoute("/api/public/webhooks/tap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const hashHeader = request.headers.get("hashstring");
        const raw = await request.text();
        let payload: Record<string, unknown>;
        try { payload = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
        if (!tapVerifyHmac(payload, hashHeader)) {
          return new Response("Invalid signature", { status: 401 });
        }
        const evt = tapParseEvent(payload);
        if (!evt.order_ref) return new Response("Missing order_ref", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("payments").insert({
          order_id: evt.order_ref,
          gateway: "tap",
          gateway_ref: evt.gateway_ref ?? null,
          status: evt.status,
          amount_minor: 0,
          currency: (payload as { currency?: string }).currency ?? "SAR",
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
