import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      gatewayPaymentId,
      razorpaySignature,
      contributorName,
      relationship,
      amount,
      contributorPan,
      message,
      poolId,
      poolTitle,
    } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Missing mandatory payment details' }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if live Razorpay signature is provided
    if (razorpaySignature && gatewayPaymentId && razorpayKeySecret && !razorpayKeySecret.includes('your-')) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${orderId}|${gatewayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Generate or use 12-digit NPCI UPI Bank Reference (UTR)
    const npciUtr =
      body.npciUtr ||
      `4${Math.floor(10000000000 + Math.random() * 90000000000).toString().slice(0, 11)}`;

    const resolvedPaymentId = gatewayPaymentId || `pay_neev_${Date.now()}`;
    const receiptNumber = `NEEV-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const settledTimestamp = new Date().toISOString();

    // Compute SHA-256 audit hash
    const rawAuditPayload = `${receiptNumber}|${amount}|${contributorName}|${npciUtr}|${settledTimestamp}|Upadhyay Technologies Private Limited`;
    const receiptSha256 = crypto.createHash('sha256').update(rawAuditPayload).digest('hex');

    return NextResponse.json({
      success: true,
      receiptNumber,
      receiptSha256,
      npciUtr,
      gatewayPaymentId: resolvedPaymentId,
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

