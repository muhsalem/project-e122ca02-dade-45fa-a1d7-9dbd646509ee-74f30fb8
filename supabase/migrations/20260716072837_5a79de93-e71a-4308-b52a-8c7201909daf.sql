
CREATE TABLE public.psych_scales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  name_en text,
  license text NOT NULL DEFAULT 'unknown',
  license_status text NOT NULL DEFAULT 'commercial_ok'
    CHECK (license_status IN ('commercial_ok','research_only','permission_required','proprietary','deprecated')),
  source_org text,
  source_url text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.psych_scale_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_id uuid NOT NULL REFERENCES public.psych_scales(id) ON DELETE CASCADE,
  version text NOT NULL,
  changelog text,
  released_at date,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scale_id, version)
);

CREATE TABLE public.psych_scale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_id uuid NOT NULL REFERENCES public.psych_scales(id) ON DELETE CASCADE,
  version_id uuid REFERENCES public.psych_scale_versions(id) ON DELETE SET NULL,
  item_code text NOT NULL,
  text_ar text NOT NULL,
  text_en text,
  dimension text,
  reverse_scored boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scale_id, item_code)
);

CREATE TABLE public.psych_scale_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_id uuid NOT NULL REFERENCES public.psych_scales(id) ON DELETE CASCADE,
  citation text NOT NULL,
  url text,
  license_ref text,
  retrieved_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX psych_scale_versions_scale_idx ON public.psych_scale_versions(scale_id);
CREATE INDEX psych_scale_items_scale_idx ON public.psych_scale_items(scale_id);
CREATE INDEX psych_scale_sources_scale_idx ON public.psych_scale_sources(scale_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.psych_scales TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.psych_scale_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.psych_scale_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.psych_scale_sources TO authenticated;
GRANT ALL ON public.psych_scales TO service_role;
GRANT ALL ON public.psych_scale_versions TO service_role;
GRANT ALL ON public.psych_scale_items TO service_role;
GRANT ALL ON public.psych_scale_sources TO service_role;

ALTER TABLE public.psych_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_scale_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_scale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_scale_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage psych_scales" ON public.psych_scales
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage psych_scale_versions" ON public.psych_scale_versions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage psych_scale_items" ON public.psych_scale_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage psych_scale_sources" ON public.psych_scale_sources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER psych_scales_updated_at
  BEFORE UPDATE ON public.psych_scales
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER psych_scale_versions_updated_at
  BEFORE UPDATE ON public.psych_scale_versions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER psych_scale_items_updated_at
  BEFORE UPDATE ON public.psych_scale_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
