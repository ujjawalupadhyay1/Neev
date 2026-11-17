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
            full_name: data.legalFullName || 'Verified Creator',
            email: 'creator@neev.upadhyay.tech',
            kyc_status: data.visibility === 'public' ? 'verified' : 'unverified',
            pan_number: data.panNumber || null,
            upi_vpa: data.upiVpa || null,
            bank_account_verified: data.visibility === 'public' ? true : false,
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

      const basePayload = {
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
      };

      const fullPayload = {
        ...basePayload,
        verification_status: data.visibility === 'public' ? 'verified' : 'unverified',
        verification_badge: data.visibility === 'public' ? 'v_kyc_verified' : 'none',
        proof_document_type: data.proofDocumentType || null,
        proof_document_name: data.proofDocumentName || null,
        proof_document_url: data.proofDocumentUrl || null,
        proof_notes: data.proofNotes || null,
        v_kyc_status: data.vKycStatus || (data.visibility === 'public' ? 'completed' : 'unverified'),
        v_kyc_video_url: data.vKycVideoUrl || null,
        v_kyc_coordinates: data.vKycCoordinates || null,
        v_kyc_completed_at: data.visibility === 'public' ? new Date().toISOString() : null,
        pan_number: data.panNumber || null,
        aadhaar_last4: data.aadhaarLast4 || null,
        bank_account_number_masked: data.bankAccountNumber
          ? `••••••••${data.bankAccountNumber.slice(-4)}`
          : null,
        bank_ifsc: data.bankIfsc || null,
        bank_name: data.bankName || null,
        bank_beneficiary_name: data.bankBeneficiaryName || data.legalFullName || null,
        bank_verified: data.bankVerified ?? (data.visibility === 'public'),
        fraud_declaration_agreed: data.fraudDeclarationAgreed ?? false,
        fraud_declaration_timestamp: data.fraudDeclarationAgreed ? new Date().toISOString() : null,
      };

      // Try inserting with all V-KYC columns first
      let { data: newPool, error: insertError } = await clientToUse
        .from('wish_pools')
        .insert(fullPayload)
        .select()
        .single();

      // If database table has not yet been migrated with new columns, fall back to base columns
      if (insertError && (insertError.message.includes('column') || insertError.code === 'PGRST204')) {
        console.warn('V-KYC columns not yet migrated in Supabase, falling back to base columns:', insertError.message);
        const retry = await clientToUse
          .from('wish_pools')
          .insert(basePayload)
          .select()
          .single();
        newPool = retry.data;
        insertError = retry.error;
      }

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
