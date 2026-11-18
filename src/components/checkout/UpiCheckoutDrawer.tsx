'use client';

import React, { useState, useEffect } from 'react';
import { CategoryCopyConfig, EnrichedPool } from '@/types';
import { formatINR } from '@/lib/utils';
import {
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  Smartphone,
  Receipt,
  Printer,
  Sparkles,
  AlertCircle,
  Copy,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpiCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: EnrichedPool;
  categoryConfig: CategoryCopyConfig;
}

export function UpiCheckoutDrawer({
  isOpen,
  onClose,
  pool,
  categoryConfig,
}: UpiCheckoutDrawerProps) {
  // Step state: 1: Details & Amount -> 2: UPI Intent & Payment -> 3: Success Receipt
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [amount, setAmount] = useState<number>(categoryConfig.amountPresets[1] || 5100);
  const [contributorName, setContributorName] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [relationship, setRelationship] = useState<'Relative' | 'Friend' | 'Colleague' | 'Well-Wisher'>('Relative');
  const [contributorPan, setContributorPan] = useState('');
  const [message, setMessage] = useState('');
  const [isMessagePublic, setIsMessagePublic] = useState(true);
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Validation & Processing State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderSession, setOrderSession] = useState<any>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');

  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      setCheckoutStep(1);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validate Step 1
  const validateStep1 = () => {
    const errs: Record<string, string> = {};

    if (!contributorName.trim() || contributorName.trim().length < 2) {
      errs.contributorName = 'Please enter your name (minimum 2 characters)';
    }

    if (!amount || amount < 10) {
      errs.amount = 'Minimum contribution is ₹ 10';
    }

    // Dynamic ₹50k+ PAN Requirement
    if (amount >= 50000) {
      const cleanPan = contributorPan.trim().toUpperCase();
      if (!cleanPan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
        errs.contributorPan =
          'Valid 10-character PAN is mandatory for gifts of ₹50,000+ (Section 56(2)(x) Income Tax Act)';
      }
    }

    if (!consentAgreed) {
      errs.consentAgreed = 'You must confirm that this is a voluntary domestic gift';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Proceed to UPI Intent
  const handleProceedToPayment = async () => {
    if (!validateStep1()) return;

    setIsInitializing(true);
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: pool.id,
          poolSlug: pool.slug,
          contributorName: contributorName.trim(),
          contributorPhone: contributorPhone.trim() || undefined,
          contributorEmail: contributorEmail.trim() || undefined,
          relationship,
          amount: Number(amount),
          contributorPan: amount >= 50000 ? contributorPan.trim().toUpperCase() : undefined,
          message: message.trim() || undefined,
          isMessagePublic,
          consentAgreed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment session');
      }

      setOrderSession(data);
      setCheckoutStep(2);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Error initializing payment' });
    } finally {
      setIsInitializing(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay Checkout Gateway
  const handleRazorpayPayment = async () => {
    if (!orderSession) return;

    setIsVerifying(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay Checkout SDK could not be loaded. Please check network or use direct UPI below.');
      setIsVerifying(false);
      return;
    }

    const keyId = orderSession.razorpayKeyId || 'rzp_test_placeholder';

    const options = {
      key: keyId,
      amount: orderSession.amountInPaise,
      currency: 'INR',
      name: 'Neev',
      description: `Blessing for ${pool.title.slice(0, 30)}`,
      image: '/brand/neev-app-icon.jpg',
      order_id: orderSession.orderId?.startsWith('order_test_') ? undefined : orderSession.orderId,
      prefill: {
        name: contributorName,
        email: contributorEmail || undefined,
        contact: contributorPhone || undefined,
      },
      notes: {
        pool_id: pool.id,
        relationship,
      },
      theme: {
        color: '#1B4332',
      },
      handler: async function (response: any) {
        await handleVerifyPayment({
          gatewayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderId: response.razorpay_order_id || orderSession.orderId,
        });
      },
      modal: {
        ondismiss: function () {
          setIsVerifying(false);
        },
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.warn('Razorpay open exception, falling back to simulated verification:', err);
      await handleVerifyPayment();
    }
  };

  // Handle Complete / Verify Payment
  const handleVerifyPayment = async (verificationDetails?: {
    gatewayPaymentId?: string;
    razorpaySignature?: string;
    orderId?: string;
  }) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: verificationDetails?.orderId || orderSession?.orderId || `order_${Date.now()}`,
          gatewayPaymentId: verificationDetails?.gatewayPaymentId || `pay_upi_${Date.now()}`,
          razorpaySignature: verificationDetails?.razorpaySignature,
          contributorName: contributorName.trim(),
          contributorEmail: contributorEmail.trim() || null,
          contributorPhone: contributorPhone.trim() || null,
          relationship,
          amount: Number(amount),
          contributorPan: amount >= 50000 ? contributorPan.trim().toUpperCase() : null,
          message: message.trim() || null,
          isMessagePublic,
          poolId: pool.id,
          poolTitle: pool.title,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setReceiptData(data);
      setCheckoutStep(3);
    } catch (err: any) {
      setErrors({ payment: err?.message || 'Payment settlement verification failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-neev-2xl max-w-xl w-full border border-neev-ivory-border shadow-warm-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-neev-forest text-white flex items-center justify-between border-b border-neev-forest-900/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryConfig.emoji}</span>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">
                {checkoutStep === 3
                  ? 'Official Gift Receipt'
                  : `${categoryConfig.primaryCtaLabel.replace(' (₹0 Fee)', '')}`}
              </h3>
              <p className="text-[10px] text-neev-forest-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-neev-amber" />
                <span>100% Free • Non-Custodial Direct UPI</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-neev-charcoal">
          {/* ============================================================== */}
          {/* STEP 1: Details & Rupee Amount                                 */}
          {/* ============================================================== */}
          {checkoutStep === 1 && (
            <div className="space-y-5">
              {/* Recipient summary banner */}
              <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex items-start gap-3">
                <div className="p-2 rounded bg-white border border-neev-ivory-border shrink-0">
                  <Sparkles className="w-4 h-4 text-neev-terracotta" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neev-slate">
                    Contributing To:
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-neev-charcoal line-clamp-1">
                    {pool.title}
                  </h4>
                  <p className="text-[10px] text-neev-slate mt-0.5">
                    Settles directly into the creator’s verified bank account via UPI.
                  </p>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neev-charcoal text-xs">
                    Choose Blessing Amount (₹) <span className="text-neev-terracotta">*</span>
                  </label>
                  <span className="font-mono font-bold text-sm text-neev-forest-800">
                    {formatINR(amount || 0)}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-5 gap-1.5">
                  {categoryConfig.amountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={cn(
                        'py-2 rounded-neev-sm text-xs font-mono font-bold transition-all border text-center',
                        amount === preset
                          ? 'bg-neev-forest text-white border-neev-forest shadow-warm-sm'
                          : 'bg-neev-ivory text-neev-charcoal border-neev-ivory-border hover:border-neev-forest/40'
                      )}
                    >
                      {formatINR(preset, { compact: true })}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative pt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-1 flex items-center pointer-events-none text-neev-slate font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter custom amount in ₹"
                    className="w-full pl-8 pr-3 py-2.5 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-xs font-mono font-bold tabular-nums outline-none"
                    min={10}
                    step={100}
                  />
                </div>
                {errors.amount && (
                  <p className="text-[11px] font-semibold text-neev-terracotta">{errors.amount}</p>
                )}
              </div>

              {/* Contributor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neev-charcoal text-xs">
                    Your Full Name <span className="text-neev-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest text-xs outline-none"
                  />
                  {errors.contributorName && (
                    <p className="text-[10px] text-neev-terracotta">{errors.contributorName}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neev-charcoal text-xs">
                    Relationship to Recipient <span className="text-neev-terracotta">*</span>
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest text-xs bg-white outline-none"
                  >
                    <option value="Relative">Relative (Family Member)</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague / Coworker</option>
                    <option value="Well-Wisher">Well-Wisher</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neev-charcoal text-xs">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={contributorPhone}
                    onChange={(e) => setContributorPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neev-charcoal text-xs">
                    Email for PDF Receipt
                  </label>
                  <input
                    type="email"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest text-xs outline-none"
                  />
                </div>
              </div>

              {/* DYNAMIC ₹50,000+ PAN REQUIREMENT (Income Tax Act Section 56(2)(x)) */}
              {amount >= 50000 && (
                <div className="p-3.5 rounded-neev-md bg-[#FEF6E9] border border-[#F4D9A1] space-y-2 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-neev-amber shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-neev-charcoal text-xs">
                        Income Tax Compliance: PAN Required for ₹50,000+ Gifts
                      </h5>
                      <p className="text-[11px] text-neev-slate leading-relaxed">
                        Under Section 56(2)(x) of the Income Tax Act, contributions of ₹50,000 or greater require the donor’s Permanent Account Number (PAN) for statutory audit compliance.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <input
                      type="text"
                      maxLength={10}
                      value={contributorPan}
                      onChange={(e) => setContributorPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full sm:w-60 px-3 py-2 rounded-neev-sm border border-neev-ivory-border bg-white text-xs font-mono font-bold tracking-widest uppercase outline-none focus:border-neev-forest"
                    />
                    {errors.contributorPan && (
                      <p className="text-[10px] font-semibold text-neev-terracotta mt-1">
                        {errors.contributorPan}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1">
                <label className="font-semibold text-neev-charcoal text-xs">
                  Your Encouraging Message or Well-Wish (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave an encouraging message or warm wishes for this milestone..."
                  rows={2}
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest text-xs outline-none resize-none"
                />
              </div>

              {/* Mandatory Clickwrap Consent */}
              <div className="p-3 rounded-neev-sm bg-neev-ivory-subtle border border-neev-ivory-border space-y-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-neev-forest focus:ring-neev-forest-100"
                  />
                  <span className="text-[11px] text-neev-slate leading-tight">
                    I confirm this is an unconditional, voluntary domestic Indian gift under Section 25 of the Indian Contract Act 1872 (not an investment, loan, or commercial purchase).
                  </span>
                </label>
                {errors.consentAgreed && (
                  <p className="text-[10px] font-semibold text-neev-terracotta pl-5">
                    {errors.consentAgreed}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: Instant UPI Payment & Selection                        */}
          {/* ============================================================== */}
          {checkoutStep === 2 && (
            <div className="space-y-5 text-center">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neev-forest-800 tracking-wider">
                  Payment & Verification
                </span>
                <h4 className="font-serif text-2xl font-bold text-neev-charcoal">
                  {formatINR(amount)}
                </h4>
                <p className="text-xs text-neev-slate">
                  Zero gateway fee. 100% routes directly to the recipient bank account.
                </p>
              </div>

              {/* PRIMARY: Razorpay Checkout (UPI, Cards, NetBanking) */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleRazorpayPayment}
                  className="w-full py-4 rounded-neev-xl font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 active:scale-[0.99] flex flex-col items-center justify-center gap-1 shadow-warm-md hover:shadow-warm-lg transition-all border border-neev-forest-800"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-neev-amber" />
                      <span className="text-sm">Connecting to Razorpay...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                        <span>Pay {formatINR(amount)} with Razorpay</span>
                        <ArrowRight className="w-4 h-4 text-neev-amber" />
                      </div>
                      <span className="text-[10px] text-neev-forest-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-neev-amber" />
                        <span>UPI • Google Pay • PhonePe • Paytm • Cards • NetBanking</span>
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-neev-ivory-border flex-1" />
                <span className="text-[10px] uppercase font-bold text-neev-slate">Or Direct App Deep Link</span>
                <div className="h-px bg-neev-ivory-border flex-1" />
              </div>

              {/* UPI App Selection Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                  { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                  { id: 'bhim', name: 'BHIM / Any UPI', icon: '🇮🇳' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id as any)}
                    className={cn(
                      'p-3 rounded-neev-md border text-center transition-all flex flex-col items-center gap-1',
                      selectedUpiApp === app.id
                        ? 'border-neev-forest bg-neev-forest-50 ring-2 ring-neev-forest shadow-warm-sm'
                        : 'border-neev-ivory-border bg-white hover:border-neev-forest/40'
                    )}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs font-semibold text-neev-charcoal">{app.name}</span>
                  </button>
                ))}
              </div>

              {/* UPI Intent Deep Link (Mobile One-Tap) */}
              <div className="p-4 rounded-neev-lg bg-neev-ivory-subtle border border-neev-ivory-border space-y-3">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-neev-slate font-bold uppercase block">
                      Pay via UPI Deep Link
                    </span>
                    <p className="text-xs font-mono text-neev-forest-900 font-bold">
                      {orderSession?.payeeVpa || 'neev.recipient@hdfcbank'}
                    </p>
                  </div>
                  <Smartphone className="w-5 h-5 text-neev-forest" />
                </div>

                {orderSession?.upiUri && (
                  <a
                    href={orderSession.upiUri}
                    className="w-full py-3 rounded-neev-md font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 flex items-center justify-center gap-2 shadow-warm-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in {selectedUpiApp.toUpperCase()} App</span>
                  </a>
                )}
              </div>

              {/* Simulated Settlement Button for Testing / Instant Verification */}
              <div className="pt-2 border-t border-neev-ivory-border space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-neev-ivory-border flex-1" />
                  <span className="text-[10px] uppercase font-bold text-neev-slate">Developer Sandbox Testing</span>
                  <div className="h-px bg-neev-ivory-border flex-1" />
                </div>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleVerifyPayment()}
                  className="w-full py-2.5 rounded-neev-md font-semibold text-xs text-neev-terracotta bg-neev-terracotta/10 hover:bg-neev-terracotta/15 border border-neev-terracotta/30 flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-neev-terracotta" />
                  <span>Simulate Instant UPI Success (Sandbox Receipt)</span>
                </button>
                <p className="text-[10px] text-neev-slate">
                  Simulates successful domestic bank authorization & generates 12-digit NPCI Bank RRN.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: Clean 1-Page Official Receipt Output                   */}
          {/* ============================================================== */}
          {checkoutStep === 3 && receiptData && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-neev-forest-50 border border-neev-forest flex items-center justify-center text-neev-forest">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl font-bold text-neev-charcoal">
                  Contribution Successfully Sent!
                </h4>
                <p className="text-xs text-neev-slate">
                  Settled directly into the creator&apos;s bank account. Here is your official receipt.
                </p>
              </div>

              {/* The 1-Page Official Clean Contributor Receipt */}
              <div className="p-5 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-md space-y-4">
                <div className="flex items-start justify-between border-b border-neev-ivory-border pb-3">
                  <div>
                    <h5 className="font-serif text-base font-bold text-neev-charcoal">
                      Neev Official Gift Receipt
                    </h5>
                    <p className="text-[10px] text-neev-slate font-medium">
                      Upadhyay Technologies Private Limited (India)
                    </p>
                    <p className="text-[10px] font-mono text-neev-slate">
                      Receipt No: {receiptData.receiptNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-xl text-neev-forest-800">
                      {formatINR(receiptData.amount)}
                    </div>
                    <span className="text-[10px] font-semibold text-neev-forest bg-neev-forest-50 px-2 py-0.5 rounded">
                      UPI Settle: 100% Free
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div>
                    <span className="text-neev-slate block">Contributor Name:</span>
                    <strong>{receiptData.contributorName}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">Relationship:</span>
                    <strong>{receiptData.relationship}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">Recipient Pool:</span>
                    <strong className="line-clamp-1">{receiptData.poolTitle}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">12-Digit NPCI UPI UTR:</span>
                    <strong className="font-mono text-neev-charcoal">{receiptData.npciUtr}</strong>
                  </div>
                  {receiptData.contributorPan && (
                    <div>
                      <span className="text-neev-slate block">Contributor PAN:</span>
                      <strong className="font-mono text-neev-charcoal">{receiptData.contributorPan}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-neev-slate block">Payment Gateway ID:</span>
                    <strong className="font-mono text-neev-charcoal">{receiptData.gatewayPaymentId}</strong>
                  </div>
                </div>

                {receiptData.message && (
                  <div className="p-2.5 rounded bg-neev-ivory-subtle border border-neev-ivory-border text-[11px] italic">
                    &ldquo;{receiptData.message}&rdquo;
                  </div>
                )}

                <div className="pt-2 border-t border-neev-ivory-border text-[10px] text-neev-slate space-y-1 leading-tight">
                  <p>
                    <strong>Statutory Note:</strong> Voluntary domestic Indian gift under Section 25 of the Indian Contract Act 1872 and Section 56(2)(x) of the Income Tax Act.
                  </p>
                  <p className="font-mono text-[9px] text-neev-slate/70 truncate">
                    SHA-256 Hash: {receiptData.receiptSha256}
                  </p>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-neev-md text-xs font-semibold text-neev-charcoal bg-white border border-neev-ivory-border hover:bg-neev-ivory shadow-warm-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-neev-md text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 shadow-warm-sm transition-all"
                >
                  Close & Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Controls (for Steps 1 & 2) */}
        {checkoutStep === 1 && (
          <div className="p-4 bg-neev-ivory-subtle border-t border-neev-ivory-border flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neev-slate hover:text-neev-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isInitializing}
              onClick={handleProceedToPayment}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-neev-md text-xs font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-sm disabled:opacity-50 transition-all"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing UPI Rails...</span>
                </>
              ) : (
                <>
                  <span>Proceed to UPI Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

        {checkoutStep === 2 && (
          <div className="p-4 bg-neev-ivory-subtle border-t border-neev-ivory-border flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setCheckoutStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neev-slate hover:text-neev-charcoal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[11px] text-neev-forest-800 font-semibold">
              Ready to Pay: {formatINR(amount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

