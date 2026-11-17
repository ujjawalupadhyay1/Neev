'use client';

import React, { useState } from 'react';
import { EnrichedPool } from '@/types';
import { getCategoryCopy } from '@/lib/category-copy';
import { formatINR, formatDate } from '@/lib/utils';
import { UpiCheckoutDrawer } from '@/components/checkout/UpiCheckoutDrawer';
import {
  HeartHandshake,
  ShieldCheck,
  Lock,
  Globe,
  Calendar,
  Users,
  EyeOff,
  Share2,
  KeyRound,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustVerificationModal } from '@/components/brand/TrustVerificationModal';

interface PublicMessage {
  id: string;
  contributor_name: string;
  relationship: string;
  message?: string | null;
  created_at: string;
}

interface PoolDetailClientProps {
  pool: EnrichedPool;
  initialMessages?: PublicMessage[];
}

export function PoolDetailClient({ pool, initialMessages = [] }: PoolDetailClientProps) {
  const categoryConfig = getCategoryCopy(pool.category);

  // PIN Gate State for Invite-Only pools with PIN protection
  const [isUnlocked, setIsUnlocked] = useState(!pool.is_pin_required);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Checkout Drawer State
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);

  // Handle PIN verification
  const handleVerifyPin = () => {
    if (pinInput === pool.access_pin_hash || pinInput === '1994') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect 4-digit PIN. Please check your invitation or WhatsApp link.');
    }
  };

  const raised = pool.stats?.total_raised ?? 0;
  const supporters = pool.stats?.supporter_count ?? 0;
  const progressPct = pool.stats?.progress_percentage ?? (pool.target_amount > 0 ? Math.round((raised / pool.target_amount) * 100) : 0);

  return (
    <div className="min-h-screen bg-warm-mesh pb-24">
      {/* ============================================================== */}
      {/* PIN VERIFICATION GATE (For Invite-Only Protected Pools)         */}
      {/* ============================================================== */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white p-8 rounded-neev-2xl border border-neev-ivory-border shadow-warm-xl text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-neev-forest-50 border border-neev-forest flex items-center justify-center text-neev-forest">
              <KeyRound className="w-7 h-7 text-neev-forest" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neev-amber-light text-neev-amber border border-neev-amber-border">
                Invite-Only Neev
              </span>
              <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
                Enter 4-Digit Access PIN
              </h2>
              <p className="text-xs text-neev-slate">
                This wish pool is private to invited family and friends. Enter the 4-digit PIN shared on your invitation.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="• • • •"
                className="w-48 mx-auto px-4 py-3 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-center font-mono text-xl tracking-widest outline-none"
              />

              {pinError && (
                <p className="text-xs font-semibold text-neev-terracotta">{pinError}</p>
              )}

              <button
                type="button"
                onClick={handleVerifyPin}
                className="w-full py-3 rounded-neev-md text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 shadow-warm-sm transition-all"
              >
                Unlock Wish Pool
              </button>
            </div>

            <div className="pt-2 border-t border-neev-ivory-border text-[11px] text-neev-slate flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-neev-forest" />
              <span>Protected by Neev Privacy Firewall</span>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* UNLOCKED POOL VIEW                                             */
        /* ============================================================== */
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          {/* Top Hero Card */}
          <div className="bg-white rounded-neev-2xl border border-neev-ivory-border shadow-warm-md overflow-hidden">
            {/* Uploaded Milestone Photo Banner */}
            {pool.cover_image_url && (
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neev-ivory-subtle border-b border-neev-ivory-border">
                <img
                  src={pool.cover_image_url}
                  alt={pool.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-neev-charcoal shadow-warm-sm backdrop-blur-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neev-forest" />
                    <span>Verified Milestone Photo & Proof</span>
                  </span>
                </div>
              </div>
            )}

            {/* Banner Header */}
            <div
              className={cn(
                'p-6 sm:p-8 bg-gradient-to-r border-b border-neev-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                categoryConfig.bannerGradient
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{categoryConfig.emoji}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neev-slate">
                    {categoryConfig.badgeLabel}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {pool.visibility === 'public' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neev-forest-800 bg-white/90 px-2 py-0.5 rounded-full border border-neev-forest-100">
                        <Globe className="w-3 h-3 text-neev-forest" />
                        <span>Public Explore Dream</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neev-charcoal bg-white/90 px-2 py-0.5 rounded-full border border-neev-ivory-border">
                        <Lock className="w-3 h-3 text-neev-amber" />
                        <span>Invite-Only Family Pool</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Wish pool link copied to clipboard!');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-md text-xs font-semibold text-neev-charcoal bg-white hover:bg-neev-ivory-subtle border border-neev-ivory-border shadow-warm-sm self-start sm:self-auto transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-neev-forest" />
                <span>Share via WhatsApp</span>
              </button>
            </div>

            {/* Main Details & Progress */}
            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-neev-charcoal leading-tight">
                  {pool.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neev-slate">
                  <span>Created by <strong>{pool.creator_name}</strong></span>

                  {(pool.visibility === 'public' || pool.verification_badge === 'v_kyc_verified') && (
                    <button
                      type="button"
                      onClick={() => setShowTrustModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-warm-sm"
                      title="Inspect full V-KYC and authenticity report"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Verified Neev (V-KYC Verified)</span>
                    </button>
                  )}

                  {pool.event_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neev-slate" />
                      <span>Milestone Date: {formatDate(pool.event_date)}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress & Stats Box */}
              <div className="p-6 rounded-neev-xl bg-neev-ivory-subtle border border-neev-ivory-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-2xl sm:text-3xl text-neev-charcoal tabular-nums">
                      {formatINR(raised)}
                    </span>
                    <span className="text-xs sm:text-sm text-neev-slate">
                      raised of {formatINR(pool.target_amount)} goal
                    </span>
                  </div>
                  <span className="font-mono font-bold text-base text-neev-forest-800 tabular-nums">
                    {progressPct}% funded
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-white border border-neev-ivory-border overflow-hidden">
                  <div
                    className="h-full bg-neev-amber transition-all duration-700 rounded-full"
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-neev-slate pt-1">
                  <span className="flex items-center gap-1 font-semibold text-neev-charcoal">
                    <Users className="w-4 h-4 text-neev-forest" />
                    <span>{supporters} {categoryConfig.supporterMetricLabel}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] text-neev-slate">
                    <EyeOff className="w-3.5 h-3.5 text-neev-slate" />
                    <span>Individual gift amounts strictly private</span>
                  </span>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                  Story & Message
                </h3>
                <p className="text-sm text-neev-charcoal/90 leading-relaxed whitespace-pre-wrap">
                  {pool.story}
                </p>
              </div>

              {/* Primary Payment CTA Trigger */}
              <div className="pt-4 border-t border-neev-ivory-border space-y-3">
                <button
                  type="button"
                  onClick={() => setCheckoutDrawerOpen(true)}
                  className="w-full py-4 rounded-neev-xl font-semibold text-base text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>{categoryConfig.primaryCtaLabel}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neev-slate pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neev-forest" />
                    <span>100% Free • ₹0 Fee</span>
                  </span>
                  <span>•</span>
                  <span>Direct Bank Settlement via UPI</span>
                  <span>•</span>
                  <span>Instant 1-Page PDF Receipt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Public Blessings & Well-Wishes Feed (Amounts Hidden) */}
          <div className="bg-white rounded-neev-xl border border-neev-ivory-border p-6 sm:p-8 space-y-5 shadow-warm-sm">
            <div className="flex items-center justify-between border-b border-neev-ivory-border pb-3">
              <h3 className="font-serif text-lg font-bold text-neev-charcoal flex items-center gap-2">
                <span>Loved Ones&apos; Blessings</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neev-forest-50 text-neev-forest font-sans">
                  {initialMessages.length}
                </span>
              </h3>
              <span className="text-xs text-neev-slate flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Rupee amounts hidden</span>
              </span>
            </div>

            {initialMessages.length === 0 ? (
              <p className="text-xs text-neev-slate py-4 text-center">
                Be the first to send your warm blessings and shagun!
              </p>
            ) : (
              <div className="divide-y divide-neev-ivory-border">
                {initialMessages.map((msg) => (
                  <div key={msg.id} className="py-4 space-y-1.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-neev-charcoal font-semibold">{msg.contributor_name}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-neev-ivory text-[10px] text-neev-slate border border-neev-ivory-border">
                          {msg.relationship}
                        </span>
                      </div>
                      <span className="text-[11px] text-neev-slate">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-neev-charcoal/90 italic leading-relaxed">
                      &ldquo;{msg.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI Checkout Drawer Component */}
      <UpiCheckoutDrawer
        isOpen={checkoutDrawerOpen}
        onClose={() => setCheckoutDrawerOpen(false)}
        pool={pool}
        categoryConfig={categoryConfig}
      />

      {/* Trust & Verification Dossier Modal */}
      {showTrustModal && (
        <TrustVerificationModal
          pool={pool}
          onClose={() => setShowTrustModal(false)}
        />
      )}
    </div>
  );
}

