-- Coach applications / directory
CREATE TYPE public.coach_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  photo_url text,
  bio text NOT NULL,
  specializations text[] NOT NULL DEFAULT '{}',
  certifications text,
  experience_years int NOT NULL DEFAULT 0 CHECK (experience_years >= 0 AND experience_years <= 80),
  hourly_price numeric(10,2) CHECK (hourly_price IS NULL OR hourly_price >= 0),
  currency text DEFAULT 'SAR',
  languages text[] NOT NULL DEFAULT '{}',
  linkedin_url text,
  website_url text,
  status public.coach_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX coaches_status_idx ON public.coaches(status);
CREATE INDEX coaches_created_at_idx ON public.coaches(created_at DESC);

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Anyone can apply to become a coach
CREATE POLICY "Anyone can apply as coach"
ON public.coaches FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Approved coaches are publicly visible in the directory (limited columns enforced via app projection)
CREATE POLICY "Approved coaches are publicly readable"
ON public.coaches FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER coaches_set_updated_at
BEFORE UPDATE ON public.coaches
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();