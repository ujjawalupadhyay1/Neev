-- ==============================================================================
-- NEEV PLATFORM — V-KYC & PUBLIC TRUST VERIFICATION SYSTEM (MIGRATION 004)
-- Compliant with: RBI V-CIP, PMLA 2002, IT Act 2000 (Sec 66D), DPDP Act 2023
-- Parent Entity: Upadhyay Technologies Private Limited (India)
-- ==============================================================================

-- 1. Add verification and trust columns to wish_pools
ALTER TABLE public.wish_pools
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_badge TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS proof_document_url TEXT,
  ADD COLUMN IF NOT EXISTS proof_document_type TEXT,
  ADD COLUMN IF NOT EXISTS proof_document_name TEXT,
  ADD COLUMN IF NOT EXISTS proof_notes TEXT,
  ADD COLUMN IF NOT EXISTS v_kyc_status TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS v_kyc_video_url TEXT,
  ADD COLUMN IF NOT EXISTS v_kyc_coordinates TEXT,
  ADD COLUMN IF NOT EXISTS v_kyc_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pan_number TEXT,
  ADD COLUMN IF NOT EXISTS aadhaar_last4 TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_number_masked TEXT,
  ADD COLUMN IF NOT EXISTS bank_ifsc TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_beneficiary_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS fraud_declaration_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS fraud_declaration_timestamp TIMESTAMPTZ;

-- 2. Add V-KYC columns to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS aadhaar_last4 TEXT,
  ADD COLUMN IF NOT EXISTS v_kyc_verified_at TIMESTAMPTZ;

-- 3. Comment explaining the verification framework
COMMENT ON COLUMN public.wish_pools.verification_badge IS 'Verified badge tier: none, v_kyc_verified, institutional_verified';
COMMENT ON COLUMN public.wish_pools.v_kyc_status IS 'Video KYC liveness status: unverified, recording, completed';
COMMENT ON COLUMN public.wish_pools.fraud_declaration_agreed IS 'Solemn truthfulness affirmation under IT Act 2000 Section 66D';

