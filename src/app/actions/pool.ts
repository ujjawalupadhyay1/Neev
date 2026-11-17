'use server';

import { createPoolSchema, CreatePoolInput } from '@/lib/validations/pool';
import { generatePoolSlug } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

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
    const slug = generatePoolSlug(data.title);

    // If Supabase is connected to a real instance
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        // In local development or guest mode, we can create or associate a demo profile
        console.warn('No active authenticated session, proceeding with mock creator ID');
      }

      const creatorId = authData?.user?.id || '00000000-0000-0000-0000-000000000001';

      const { data: newPool, error: insertError } = await supabase
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

