import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type (images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|heic)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a JPG, PNG, WEBP, or HEIC photo.' },
        { status: 400 }
      );
    }

    // Validate size (max 8MB)
    const maxSizeBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'Photo is too large. Maximum allowed size is 8MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract safe extension
    const originalExt = path.extname(file.name).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'].includes(originalExt)
      ? originalExt
      : '.jpg';

    const filename = `neev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${safeExt}`;

    // 1. Try uploading to Supabase Storage if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasLiveSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (hasLiveSupabase) {
      try {
        const supabase = createAdminClient();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pool-media')
          .upload(filename, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('pool-media')
            .getPublicUrl(uploadData.path);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename,
            size: file.size,
            mimeType: file.type,
            storage: 'supabase',
          });
        } else {
          console.warn('Supabase storage upload failed, falling back to local storage:', uploadError?.message);
        }
      } catch (storageErr) {
        console.warn('Supabase storage exception, falling back to local storage:', storageErr);
      }
    }

    // 2. Local File System Fallback
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to upload photo. Please try again.' },
      { status: 500 }
    );
  }
}
