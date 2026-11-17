export type PoolCategory = 'wedding' | 'education' | 'milestone' | 'universal';

export type PoolVisibility = 'invite_only' | 'public';

export type PoolStatus = 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';

export type ContributorRelationship = 'Relative' | 'Friend' | 'Colleague' | 'Well-Wisher';

export type ContributionStatus = 'initiated' | 'pending' | 'success' | 'failed' | 'refunded';

export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  phone_number?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  kyc_status: KYCStatus;
  pan_number?: string | null;
  upi_vpa?: string | null;
  bank_account_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishPool {
  id: string;
  creator_id: string;
  slug: string;
  title: string;
  category: PoolCategory;
  target_amount: number;
  event_date?: string | null;
  story: string;
  cover_image_url?: string | null;
  visibility: PoolVisibility;
  access_pin_hash?: string | null;
  is_pin_required: boolean;
  status: PoolStatus;
  created_at: string;
  updated_at: string;
}

export interface EnrichedPool extends WishPool {
  creator_name: string;
  creator_avatar?: string;
  creator_kyc_status?: string;
  stats: PublicPoolStats;
}

export interface Contribution {
  id: string;
  pool_id: string;
  contributor_name: string;
  contributor_email?: string | null;
  contributor_phone?: string | null;
  relationship: ContributorRelationship;
  amount: number;
  contributor_pan?: string | null;
  message?: string | null;
  is_message_public: boolean;
  status: ContributionStatus;
  gateway_provider?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  npci_utr?: string;
  receipt_number?: string;
  receipt_sha256?: string;
  consent_agreed: boolean;
  consent_policy_version: string;
  consent_ip?: string;
  consent_timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface PublicPoolStats {
  pool_id: string;
  supporter_count: number;
  total_raised: number;
  target_amount: number;
  progress_percentage: number;
}

export interface PublicPoolMessage {
  message_id: string;
  pool_id: string;
  contributor_name: string;
  relationship: ContributorRelationship;
  message: string;
  created_at: string;
}

export interface CategoryCopyConfig {
  key: PoolCategory;
  title: string;
  subtitle: string;
  tagline: string;
  primaryCtaLabel: string;
  supporterMetricLabel: string;
  receiptTitle: string;
  defaultStoryPrompt: string;
  amountPresets: number[];
  sampleTitles: string[];
  bannerGradient: string;
  badgeLabel: string;
  emoji: string;
}

