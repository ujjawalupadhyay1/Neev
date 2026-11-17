-- ==============================================================================
-- NEEV PLATFORM — MASTER SUPABASE SETUP (ONE-CLICK EXECUTION)
-- Parent Legal Entity: Upadhyay Technologies Private Limited (India)
-- Includes:
--   1. Schemas & Enums (Wedding, Education, Milestone, Universal)
--   2. Core Tables (profiles, wish_pools, contributions)
--   3. Non-Negotiable RLS Privacy Firewall (Confidential Rupee Amounts)
--   4. Public Aggregate Views (public_pool_stats, public_pool_messages)
--   5. Auto-Profile Sync Trigger (auth.users -> public.profiles)
--   6. Supabase Storage Bucket ('pool-media' with Public CDN access)
-- ==============================================================================

-- Enable UUID & Crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & DOMAINS
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE pool_category AS ENUM ('wedding', 'education', 'milestone', 'universal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pool_visibility AS ENUM ('invite_only', 'public');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pool_status AS ENUM ('draft', 'active', 'completed', 'paused', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contributor_relationship AS ENUM ('Relative', 'Friend', 'Colleague', 'Well-Wisher');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contribution_status AS ENUM ('initiated', 'pending', 'success', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status_enum AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- A. Profiles (Extended user details linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  avatar_url TEXT,
  kyc_status kyc_status_enum NOT NULL DEFAULT 'unverified',
  pan_number TEXT,
  upi_vpa TEXT,
  bank_account_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. Wish Pools (Milestones, Weddings, Education, General Pools)
CREATE TABLE IF NOT EXISTS public.wish_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category pool_category NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  event_date DATE,
  story TEXT NOT NULL,
  cover_image_url TEXT,
  visibility pool_visibility NOT NULL DEFAULT 'invite_only',
  access_pin_hash TEXT,
  is_pin_required BOOLEAN NOT NULL DEFAULT FALSE,
  status pool_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. Contributions (Strictly confidential donor rupee ledger)
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES public.wish_pools(id) ON DELETE CASCADE,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT,
  contributor_phone TEXT,
  relationship contributor_relationship NOT NULL DEFAULT 'Well-Wisher',
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  contributor_pan TEXT CHECK (amount < 50000 OR contributor_pan IS NOT NULL),
  message TEXT,
  is_message_public BOOLEAN NOT NULL DEFAULT TRUE,
  status contribution_status NOT NULL DEFAULT 'initiated',
  
  -- Gateway & Settlement Tracking (Strict idempotency)
  gateway_provider TEXT DEFAULT 'razorpay_route',
  gateway_order_id TEXT,
  gateway_payment_id TEXT UNIQUE,
  npci_utr TEXT UNIQUE,
  receipt_number TEXT UNIQUE,
  receipt_sha256 TEXT,
  
  -- Legal Clickwrap & Consent Audit Logging
  consent_agreed BOOLEAN NOT NULL DEFAULT TRUE,
  consent_policy_version TEXT NOT NULL DEFAULT 'v1.0-2024',
  consent_ip TEXT,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_wish_pools_creator_id ON public.wish_pools(creator_id);
CREATE INDEX IF NOT EXISTS idx_wish_pools_slug ON public.wish_pools(slug);
CREATE INDEX IF NOT EXISTS idx_wish_pools_visibility ON public.wish_pools(visibility);
CREATE INDEX IF NOT EXISTS idx_wish_pools_category ON public.wish_pools(category);
CREATE INDEX IF NOT EXISTS idx_wish_pools_status ON public.wish_pools(status);

CREATE INDEX IF NOT EXISTS idx_contributions_pool_id ON public.contributions(pool_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_payment_id ON public.contributions(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_contributions_npci_utr ON public.contributions(npci_utr);

-- ==============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) PRIVACY FIREWALL
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public profile display info" ON public.profiles;
CREATE POLICY "Public profile display info"
  ON public.profiles FOR SELECT
  USING (true);

-- 4.2 Wish Pools Policies
DROP POLICY IF EXISTS "Public or active pools are readable by all" ON public.wish_pools;
CREATE POLICY "Public or active pools are readable by all"
  ON public.wish_pools FOR SELECT
  USING (visibility = 'public' OR status = 'active');

DROP POLICY IF EXISTS "Creators can insert their own pools" ON public.wish_pools;
CREATE POLICY "Creators can insert their own pools"
  ON public.wish_pools FOR INSERT
  WITH CHECK (auth.uid() = creator_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Creators can update their own pools" ON public.wish_pools;
CREATE POLICY "Creators can update their own pools"
  ON public.wish_pools FOR UPDATE
  USING (auth.uid() = creator_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Creators can delete their own pools" ON public.wish_pools;
CREATE POLICY "Creators can delete their own pools"
  ON public.wish_pools FOR DELETE
  USING (auth.uid() = creator_id OR auth.role() = 'service_role');

-- 4.3 Contributions Policies (NON-NEGOTIABLE PRIVACY FIREWALL)
-- STRICT RULE: The public CANNOT SELECT from the contributions table directly.
-- SELECT is permitted ONLY when auth.uid() = wish_pools.creator_id or service_role.
DROP POLICY IF EXISTS "Creator only private ledger view" ON public.contributions;
CREATE POLICY "Creator only private ledger view"
  ON public.contributions FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.wish_pools
      WHERE public.wish_pools.id = public.contributions.pool_id
      AND public.wish_pools.creator_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role or checkout can insert contributions" ON public.contributions;
CREATE POLICY "Service role or checkout can insert contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- 5. SECURE AGGREGATION & PUBLIC VIEWS
-- ==============================================================================

-- A. public_pool_stats (Computes aggregate totals without exposing individual gifts)
CREATE OR REPLACE VIEW public.public_pool_stats
WITH (security_invoker = false) AS
SELECT 
  p.id AS pool_id,
  COUNT(c.id) FILTER (WHERE c.status = 'success')::BIGINT AS supporter_count,
  COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'success'), 0)::NUMERIC(12, 2) AS total_raised,
  p.target_amount,
  CASE 
    WHEN p.target_amount > 0 THEN 
      ROUND((COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'success'), 0) / p.target_amount * 100)::numeric, 1)
    ELSE 0
  END AS progress_percentage
FROM public.wish_pools p
LEFT JOIN public.contributions c ON c.pool_id = p.id
GROUP BY p.id, p.target_amount;

GRANT SELECT ON public.public_pool_stats TO anon, authenticated;

-- B. public_pool_messages (Well-wishes without rupee amounts)
CREATE OR REPLACE VIEW public.public_pool_messages
WITH (security_invoker = false) AS
SELECT
  c.id AS message_id,
  c.pool_id,
  c.contributor_name,
  c.relationship,
  c.message,
  c.created_at
FROM public.contributions c
WHERE c.status = 'success'
  AND c.is_message_public = TRUE
  AND c.message IS NOT NULL
  AND TRIM(c.message) <> '';

GRANT SELECT ON public.public_pool_messages TO anon, authenticated;

-- ==============================================================================
-- 6. AUTH PROFILE AUTO-PROVISION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    kyc_status,
    bank_account_verified
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      NULL
    ),
    'unverified',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET & POLICIES ('pool-media')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pool-media',
  'pool-media',
  true,
  8388608, -- 8MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public pool media is viewable by everyone" ON storage.objects;
CREATE POLICY "Public pool media is viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pool-media');

DROP POLICY IF EXISTS "Authenticated users can upload pool media" ON storage.objects;
CREATE POLICY "Authenticated users can upload pool media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pool-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Creators can update their own pool media" ON storage.objects;
CREATE POLICY "Creators can update their own pool media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pool-media' AND (auth.uid() = owner OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Creators can delete their own pool media" ON storage.objects;
CREATE POLICY "Creators can delete their own pool media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pool-media' AND (auth.uid() = owner OR auth.role() = 'service_role'));

