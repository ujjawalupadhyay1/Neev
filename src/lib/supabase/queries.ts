import { createClient as createServerClient } from '@/lib/supabase/server';
import { MOCK_POOLS, MOCK_CONTRIBUTIONS, EnrichedPool } from '@/lib/mock-data';

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
        console.warn('Pool not found in Supabase:', poolError?.message);
        // Fallback to mock data if exists
        const mock = MOCK_POOLS.find((p) => p.slug === slug);
        return mock || null;
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

  // Prototype / offline fallback
  const mock = MOCK_POOLS.find((p) => p.slug === slug) || MOCK_POOLS.find((p) => p.slug === 'aarav-ananya-wedding') || MOCK_POOLS[0];
  return mock || null;
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

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error('Error fetching public messages:', err);
    }
  }

  // Fallback to mock public contributions
  return MOCK_CONTRIBUTIONS.filter(
    (c) => c.pool_id === poolId && c.is_message_public && c.message
  );
}

/**
 * Fetch all pools for the Explore Dreams feed.
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
        // Fetch stats for all pools
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
            creator_name: creator?.full_name || 'Dreamer',
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

  // Fallback to mock data with filtering
  let results = [...MOCK_POOLS];
  if (options?.category && options.category !== 'all') {
    results = results.filter((p) => p.category === options.category);
  }
  if (options?.visibility && options.visibility !== 'all') {
    results = results.filter((p) => p.visibility === options.visibility);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    results = results.filter(
      (p) => p.title.toLowerCase().includes(s) || p.creator_name.toLowerCase().includes(s)
    );
  }

  return results;
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
        // Fetch creator's pools
        const { data: pools } = await supabase
          .from('wish_pools')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (pools && pools.length > 0) {
          const poolIds = pools.map((p) => p.id);
          // Fetch confidential contributions (RLS strictly permits this because auth.uid() = wish_pools.creator_id!)
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
      }
    } catch (err) {
      console.error('Error in getCreatorDashboardData:', err);
    }
  }

  return {
    user: null,
    pools: MOCK_POOLS,
    contributions: MOCK_CONTRIBUTIONS,
    isLive: false,
  };
}

