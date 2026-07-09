import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const started = Date.now();
        let dbOk = false;
        let dbLatencyMs: number | null = null;
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } },
          );
          const t0 = Date.now();
          const { error } = await client
            .from("poia_occupations")
            .select("id", { count: "exact", head: true });
          dbLatencyMs = Date.now() - t0;
          dbOk = !error;
        } catch {
          dbOk = false;
        }
        const body = {
          status: dbOk ? "ok" : "degraded",
          uptime_ms: Date.now() - started,
          db: { ok: dbOk, latency_ms: dbLatencyMs },
          timestamp: new Date().toISOString(),
        };
        return new Response(JSON.stringify(body), {
          status: dbOk ? 200 : 503,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
