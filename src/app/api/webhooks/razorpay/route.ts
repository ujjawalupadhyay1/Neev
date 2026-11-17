import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (webhookSecret && !webhookSecret.includes('your-')) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('Invalid Razorpay webhook signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity;
      if (!payment) {
        return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
      }

      const gatewayPaymentId = payment.id;
      const orderId = payment.order_id;
      const amount = payment.amount / 100; // paise to rupees
      const notes = payment.notes || {};
      const poolId = notes.pool_id;
      const contributorName = notes.contributor_name || payment.email || 'Anonymous Supporter';
      const relationship = notes.relationship || 'Well-Wisher';
      const contributorPan = notes.contributor_pan === 'N/A' ? null : notes.contributor_pan;
      const npciUtr = payment.acquirer_data?.rrn || `4${payment.created_at || Date.now()}`.slice(0, 12);
      const receiptNumber = `NEEV-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Generate SHA-256 audit hash
      const rawAudit = `${receiptNumber}|${amount}|${contributorName}|${npciUtr}|${new Date().toISOString()}|Upadhyay Technologies Private Limited`;
      const receiptSha256 = crypto.createHash('sha256').update(rawAudit).digest('hex');

      // Check if Supabase keys are configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const supabase = createAdminClient();

        // Idempotent upsert by gateway_payment_id
        const { error: dbError } = await supabase.from('contributions').upsert(
          {
            pool_id: poolId,
            contributor_name: contributorName,
            contributor_email: payment.email,
            contributor_phone: payment.contact,
            relationship,
            amount,
            contributor_pan: contributorPan,
            message: notes.message || null,
            is_message_public: true,
            status: 'success',
            gateway_provider: 'razorpay_route',
            gateway_order_id: orderId,
            gateway_payment_id: gatewayPaymentId,
            npci_utr: npciUtr,
            receipt_number: receiptNumber,
            receipt_sha256: receiptSha256,
            consent_agreed: true,
            consent_policy_version: 'v1.0-2024',
          },
          { onConflict: 'gateway_payment_id' }
        );

        if (dbError) {
          console.error('Failed to persist contribution via webhook:', dbError);
          return NextResponse.json({ error: 'Database fulfillment failed' }, { status: 500 });
        }
      }

      console.log(`[Webhook Success] Processed contribution: ${gatewayPaymentId} for ₹${amount}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing exception:', err);
    return NextResponse.json({ error: err?.message || 'Webhook processing failed' }, { status: 500 });
  }
}

