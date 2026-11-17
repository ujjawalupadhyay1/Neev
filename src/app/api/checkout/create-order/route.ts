import { NextRequest, NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validations/checkout';

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

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_neev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let isLiveGateway = false;

    // If Razorpay live/test keys are provided in environment
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('your-')) {
      try {
        const authHeader = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              pool_id: data.poolId,
              contributor_name: data.contributorName,
              relationship: data.relationship,
              contributor_pan: data.contributorPan || 'N/A',
              legal_declaration: 'Voluntary domestic gift under Sec 25 Indian Contract Act',
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpOrder = await rzpResponse.json();
          orderId = rzpOrder.id;
          isLiveGateway = true;
        }
      } catch (e) {
        console.warn('Razorpay API request failed, using sandbox order session:', e);
      }
    }

    // Direct UPI Deep Link parameters (NPCI standard format)
    // Merchant/Creator UPI VPA
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
      currency: 'INR',
      razorpayKeyId: isLiveGateway ? razorpayKeyId : null,
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

