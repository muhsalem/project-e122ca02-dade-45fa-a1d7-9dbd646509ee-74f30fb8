
-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE DEFAULT ('BSL-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  country_code TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount_minor BIGINT NOT NULL CHECK (amount_minor >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed','refunded','cancelled')),
  gateway TEXT,
  gateway_ref TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_name TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_orders_user ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status, created_at DESC);
CREATE INDEX idx_orders_gateway_ref ON public.orders(gateway, gateway_ref);

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PAYMENTS (per-attempt log) ============
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL CHECK (gateway IN ('moyasar','paymob','tap','stripe','manual')),
  gateway_ref TEXT,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated','pending','captured','failed','cancelled','refunded')),
  amount_minor BIGINT NOT NULL,
  currency TEXT NOT NULL,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- Deny by default (no policies for authenticated). Only service_role writes/reads.

CREATE INDEX idx_payments_order ON public.payments(order_id, created_at DESC);
CREATE INDEX idx_payments_ref ON public.payments(gateway, gateway_ref);

CREATE TRIGGER payments_set_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
