import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      gatewayPaymentId,
      razorpaySignature,
      contributorName,
      contributorEmail,
      contributorPhone,
      relationship,
      amount,
      contributorPan,
      message,
      isMessagePublic,
      poolId,
      poolTitle,
    } = body;

    if (!orderId || !amount || !contributorName) {
      return NextResponse.json({ error: 'Missing mandatory payment details' }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if Razorpay signature is provided
    if (razorpaySignature && gatewayPaymentId && razorpayKeySecret && !razorpayKeySecret.includes('your-')) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${orderId}|${gatewayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid Razorpay payment signature' }, { status: 400 });
      }
    }

    // Generate 12-digit NPCI UPI Bank Reference (UTR)
    const npciUtr =
      body.npciUtr ||
      `4${Math.floor(10000000000 + Math.random() * 90000000000).toString().slice(0, 11)}`;

    const resolvedPaymentId = gatewayPaymentId || `pay_rzp_${Date.now()}`;
    const receiptNumber = `NEEV-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const settledTimestamp = new Date().toISOString();

    // Compute SHA-256 audit hash (Section 63 of Bharatiya Sakshya Adhiniyam 2023)
    const rawAuditPayload = `${receiptNumber}|${amount}|${contributorName}|${npciUtr}|${settledTimestamp}|Upadhyay Technologies Private Limited`;
    const receiptSha256 = crypto.createHash('sha256').update(rawAuditPayload).digest('hex');

    // Persist to Supabase if live database is connected
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLiveSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isLiveSupabase && poolId) {
      try {
        const adminSupabase = createAdminClient();
        const clientIp =
          req.headers.get('x-forwarded-for')?.split(',')[0] ||
          req.headers.get('x-real-ip') ||
          '127.0.0.1';

        await adminSupabase.from('contributions').insert({
          pool_id: poolId,
          contributor_name: contributorName,
          contributor_email: contributorEmail || null,
          contributor_phone: contributorPhone || null,
          relationship: relationship || 'Relative',
          amount: Number(amount),
          contributor_pan: contributorPan || null,
          message: message || null,
          is_message_public: isMessagePublic !== false,
          status: 'success',
          gateway_provider: 'razorpay_route',
          gateway_order_id: orderId,
          gateway_payment_id: resolvedPaymentId,
          npci_utr: npciUtr,
          receipt_number: receiptNumber,
          receipt_sha256: receiptSha256,
          consent_agreed: true,
          consent_policy_version: 'v1.0-2024',
          consent_ip: clientIp,
          consent_timestamp: settledTimestamp,
        });
      } catch (dbErr) {
        console.warn('Could not record contribution to Supabase, continuing with receipt:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      receiptNumber,
      receiptSha256,
      npciUtr,
      gatewayPaymentId: resolvedPaymentId,
      gatewayOrderId: orderId,
      amount: Number(amount),
      contributorName,
      relationship,
      contributorPan: contributorPan || null,
      message: message || null,
      settledTimestamp,
      poolTitle: poolTitle || 'Neev Milestone Pool',
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
