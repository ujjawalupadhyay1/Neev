import { createClient as createServerClient } from '@/lib/supabase/server';
import { EnrichedPool } from '@/types';

export interface PoolWithStats extends EnrichedPool {}

/**
 * Fetch a single pool by slug with public aggregate stats and creator info.
 * Enforces strict privacy: individual contributor rupee amounts are NEVER loaded here.
 */
export async function getPoolBySlug(slug: string): Promise<PoolWithStats | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isLive) {
    try {
      const supabase = createServerClient();

      // Fetch pool details
      const { data: pool, error: poolError } = await supabase
        .from('wish_pools')
        .select(`
          *,
          profiles:creator_id (
            full_name,
            avatar_url,
            kyc_status
          )
        `)
        .eq('slug', slug)
        .single();

      if (poolError || !pool) {
        return null;
      }

      // Fetch stats from public_pool_stats secure view
      const { data: stats } = await supabase
        .from('public_pool_stats')
        .select('supporter_count, total_raised, progress_percentage')
        .eq('pool_id', pool.id)
        .single();

      const creator = Array.isArray(pool.profiles) ? pool.profiles[0] : pool.profiles;

      return {
        id: pool.id,
        creator_id: pool.creator_id,
        creator_name: creator?.full_name || 'Verified Dreamer',
        creator_avatar: creator?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        creator_kyc_status: creator?.kyc_status || 'verified',
        slug: pool.slug,
        title: pool.title,
        category: pool.category,
        target_amount: Number(pool.target_amount),
        event_date: pool.event_date,
        story: pool.story,
        cover_image_url: pool.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        visibility: pool.visibility,
        is_pin_required: pool.is_pin_required,
        access_pin_hash: pool.access_pin_hash,
        status: pool.status,
        verification_status: pool.verification_status || (pool.visibility === 'public' ? 'verified' : 'unverified'),
        verification_badge: pool.verification_badge || (pool.visibility === 'public' ? 'v_kyc_verified' : 'none'),
        proof_document_type: pool.proof_document_type || null,
        proof_document_name: pool.proof_document_name || null,
        v_kyc_status: pool.v_kyc_status || (pool.visibility === 'public' ? 'completed' : 'unverified'),
        v_kyc_coordinates: pool.v_kyc_coordinates || null,
        bank_verified: pool.bank_verified ?? (pool.visibility === 'public'),
        created_at: pool.created_at,
        updated_at: pool.updated_at,
        stats: {
          pool_id: pool.id,
          supporter_count: Number(stats?.supporter_count || 0),
          total_raised: Number(stats?.total_raised || 0),
          target_amount: Number(pool.target_amount),
          progress_percentage: Number(stats?.progress_percentage || 0),
        },
      };
    } catch (err) {
      console.error('Error fetching pool by slug:', err);
    }
  }

  return null;
}

/**
 * Fetch public messages & blessings for a pool.
 * Does NOT contain rupee amounts (strictly compliant with privacy rule).
 */
export async function getPoolPublicMessages(poolId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isLive) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('public_pool_messages')
        .select('*')
        .eq('pool_id', poolId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.error('Error fetching public messages:', err);
    }
  }

  return [];
}

/**
 * Fetch real pools for the Explore Dreams feed.
 */
export async function getExplorePools(options?: {
  category?: string;
  visibility?: string;
  search?: string;
}): Promise<PoolWithStats[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isLive) {
    try {
      const supabase = createServerClient();

      let query = supabase
        .from('wish_pools')
        .select(`
          *,
          profiles:creator_id (
            full_name,
            avatar_url,
            kyc_status
          )
        `)
        .eq('status', 'active');

      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      if (options?.visibility && options.visibility !== 'all') {
        query = query.eq('visibility', options.visibility);
      }

      if (options?.search) {
        query = query.ilike('title', `%${options.search}%`);
      }

      const { data: pools, error } = await query.order('created_at', { ascending: false });

      if (!error && pools && pools.length > 0) {
        const poolIds = pools.map((p) => p.id);
        const { data: statsList } = await supabase
          .from('public_pool_stats')
          .select('*')
          .in('pool_id', poolIds);

        const statsMap = new Map((statsList || []).map((s) => [s.pool_id, s]));

        return pools.map((pool) => {
          const stats = statsMap.get(pool.id);
          const creator = Array.isArray(pool.profiles) ? pool.profiles[0] : pool.profiles;
          return {
            id: pool.id,
            creator_id: pool.creator_id,
            creator_name: creator?.full_name || 'Verified Dreamer',
            creator_avatar: creator?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            creator_kyc_status: creator?.kyc_status || 'verified',
            slug: pool.slug,
            title: pool.title,
            category: pool.category,
            target_amount: Number(pool.target_amount),
            event_date: pool.event_date,
            story: pool.story,
            cover_image_url: pool.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            visibility: pool.visibility,
            is_pin_required: pool.is_pin_required,
            access_pin_hash: pool.access_pin_hash,
            status: pool.status,
            verification_status: pool.verification_status || (pool.visibility === 'public' ? 'verified' : 'unverified'),
            verification_badge: pool.verification_badge || (pool.visibility === 'public' ? 'v_kyc_verified' : 'none'),
            proof_document_type: pool.proof_document_type || null,
            proof_document_name: pool.proof_document_name || null,
            v_kyc_status: pool.v_kyc_status || (pool.visibility === 'public' ? 'completed' : 'unverified'),
            v_kyc_coordinates: pool.v_kyc_coordinates || null,
            bank_verified: pool.bank_verified ?? (pool.visibility === 'public'),
            created_at: pool.created_at,
            updated_at: pool.updated_at,
            stats: {
              pool_id: pool.id,
              supporter_count: Number(stats?.supporter_count || 0),
              total_raised: Number(stats?.total_raised || 0),
              target_amount: Number(pool.target_amount),
              progress_percentage: Number(stats?.progress_percentage || 0),
            },
          };
        });
      }
    } catch (err) {
      console.error('Error fetching explore pools:', err);
    }
  }

  return [];
}

/**
 * Fetch creator's pools and confidential contributions for the Private Ledger.
 * Protected by Supabase Row-Level Security: auth.uid() = wish_pools.creator_id.
 */
export async function getCreatorDashboardData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isLive) {
    try {
      const supabase = createServerClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: pools } = await supabase
          .from('wish_pools')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (pools && pools.length > 0) {
          const poolIds = pools.map((p) => p.id);
          const { data: contributions } = await supabase
            .from('contributions')
            .select('*')
            .in('pool_id', poolIds)
            .order('created_at', { ascending: false });

          return {
            user,
            pools,
            contributions: contributions || [],
            isLive: true,
          };
        }

        return {
          user,
          pools: [],
          contributions: [],
          isLive: true,
        };
      }
    } catch (err) {
      console.error('Error in getCreatorDashboardData:', err);
    }
  }

  return {
    user: null,
    pools: [],
    contributions: [],
    isLive: false,
  };
}
