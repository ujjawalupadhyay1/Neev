'use server';

import { createPoolSchema, CreatePoolInput } from '@/lib/validations/pool';
import { generatePoolSlug } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function createWishPoolAction(input: CreatePoolInput) {
  try {
    const parseResult = createPoolSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        issues: parseResult.error.format(),
      };
    }

    const data = parseResult.data;
    let slug = generatePoolSlug(data.title);

    // If Supabase is connected to a real instance
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isLive) {
      const supabase = createClient();
      const adminSupabase = createAdminClient();

      const { data: authData } = await supabase.auth.getUser();

      let creatorId = authData?.user?.id;

      // If user is not logged in, use or initialize a verified creator profile
      if (!creatorId) {
        const { data: usersData } = await adminSupabase.auth.admin.listUsers();
        let defaultUserId: string | undefined = usersData?.users?.[0]?.id;
        if (!defaultUserId) {
          const { data: newUser } = await adminSupabase.auth.admin.createUser({
            email: 'creator@neev.upadhyay.tech',
            email_confirm: true,
            user_metadata: { full_name: 'Neev Creator' },
          });
          defaultUserId = newUser?.user?.id;
        }
        if (defaultUserId) {
          creatorId = defaultUserId;
        }
      }

      if (creatorId) {
        await adminSupabase.from('profiles').upsert(
          {
            id: creatorId,
            full_name: 'Neev Creator',
            email: 'creator@neev.upadhyay.tech',
            kyc_status: 'verified',
            bank_account_verified: true,
          },
          { onConflict: 'id' }
        );
      }

      // Check for slug collision
      const { data: existingPool } = await adminSupabase
        .from('wish_pools')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPool) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const clientToUse = authData?.user ? supabase : adminSupabase;

      const { data: newPool, error: insertError } = await clientToUse
        .from('wish_pools')
        .insert({
          creator_id: creatorId,
          slug,
          title: data.title,
          category: data.category,
          target_amount: data.targetAmount,
          event_date: data.eventDate || null,
          story: data.story,
          cover_image_url: data.coverImageUrl || null,
          visibility: data.visibility,
          is_pin_required: data.isPinRequired,
          access_pin_hash: data.isPinRequired ? data.accessPin : null,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting pool into database:', insertError);
        return { success: false, error: insertError.message };
      }

      return { success: true, slug: newPool.slug, pool: newPool };
    }

    // Local / Prototype Fallback
    return {
      success: true,
      slug,
      pool: {
        id: `pool_${Date.now()}`,
        slug,
        title: data.title,
        category: data.category,
        target_amount: data.targetAmount,
        event_date: data.eventDate || null,
        story: data.story,
        visibility: data.visibility,
        is_pin_required: data.isPinRequired,
        access_pin_hash: data.accessPin,
        status: 'active',
      },
    };
  } catch (err: any) {
    console.error('Exception creating pool:', err);
    return { success: false, error: err?.message || 'Failed to create pool' };
  }
}
