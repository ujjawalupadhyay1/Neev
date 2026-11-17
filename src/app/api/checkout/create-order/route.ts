import { NextRequest, NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validations/checkout';
import { getRazorpayClient } from '@/lib/razorpay/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const timestamp = new Date().toISOString();
    const amountInPaise = Math.round(data.amount * 100);

    const razorpay = getRazorpayClient();
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    let orderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let isLiveGateway = false;

    // If Razorpay credentials are set (Test or Production)
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            pool_id: data.poolId,
            pool_slug: data.poolSlug,
            contributor_name: data.contributorName,
            relationship: data.relationship,
            contributor_pan: data.contributorPan || 'N/A',
            legal_declaration: 'Voluntary domestic gift under Sec 25 Indian Contract Act 1872',
          },
        });

        if (rzpOrder && rzpOrder.id) {
          orderId = rzpOrder.id;
          isLiveGateway = true;
        }
      } catch (e: any) {
        console.warn('Razorpay order creation error, falling back to simulated session:', e?.message || e);
      }
    }

    // Direct UPI Deep Link parameters (NPCI standard format)
    const payeeVpa = process.env.NEXT_PUBLIC_MERCHANT_VPA || 'neev.upadhyaytech@hdfcbank';
    const payeeName = 'Neev Platform - Upadhyay Tech';
    const transactionNote = `Blessing for ${data.poolSlug.slice(0, 20)}`;

    const upiUri = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${data.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${orderId}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount: data.amount,
      amountInPaise,
      currency: 'INR',
      razorpayKeyId: razorpayKeyId || null,
      isLiveGateway,
      upiUri,
      payeeVpa,
      payeeName,
      consentLog: {
        agreed: true,
        version: 'v1.0-2024',
        ip: clientIp,
        timestamp,
      },
    });
  } catch (err: any) {
    console.error('Error in create-order route:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to initialize payment session' },
      { status: 500 }
    );
  }
}
