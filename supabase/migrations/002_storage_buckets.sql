-- ==============================================================================
-- NEEV PLATFORM — SUPABASE STORAGE BUCKETS & POLICIES (SPRINT 2 / 3)
-- Compliant with: IT Act 2000, DPDP Act 2023
-- ==============================================================================

-- 1. Create 'pool-media' bucket for pool cover photos, story images, and updates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pool-media',
  'pool-media',
  true,
  8388608, -- 8MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'pool-media'
-- Anyone can view pool photos (public CDN)
CREATE POLICY "Public pool media is viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pool-media');

-- Authenticated creators or service role can upload photos
CREATE POLICY "Authenticated users can upload pool media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pool-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- Creators can update or delete their own media
CREATE POLICY "Creators can update their own pool media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pool-media' AND (auth.uid() = owner OR auth.role() = 'service_role'));

CREATE POLICY "Creators can delete their own pool media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pool-media' AND (auth.uid() = owner OR auth.role() = 'service_role'));

