import React from 'react';
import { PoolCategory, PoolVisibility } from '@/types';
import { getCategoryCopy } from '@/lib/category-copy';
import { formatINR, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepReviewProps {
  category: PoolCategory;
  title: string;
  targetAmount: number;
  eventDate: string;
  story: string;
  coverImageUrl: string;
  visibility: PoolVisibility;
  isPinRequired: boolean;
  mobileNumber?: string;
  isMobileVerified?: boolean;
  proofPhotos?: string[];
  agreedToTerms: boolean;
  onAgreeChange: (agreed: boolean) => void;
  error?: string;
}

export function StepReview({
  category,
  title,
  targetAmount,
  eventDate,
  story,
  coverImageUrl,
  visibility,
  isPinRequired,
  mobileNumber,
  isMobileVerified,
  proofPhotos,
  agreedToTerms,
  onAgreeChange,
  error,
}: StepReviewProps) {
  const categoryConfig = getCategoryCopy(category);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
          Review & Publish Your Neev
        </h2>
        <p className="text-sm text-neev-slate">
          Verify your details. Here is how your loved ones and supporters will experience your milestone.
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-neev-xl border border-neev-ivory-border shadow-warm-md overflow-hidden">
        {coverImageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-neev-ivory-subtle border-b border-neev-ivory-border">
            <img src={coverImageUrl} alt={title || 'Milestone photo'} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Banner header */}
        <div
          className={cn(
            'p-6 bg-gradient-to-r border-b border-neev-ivory-border flex items-center justify-between',
            categoryConfig.bannerGradient
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryConfig.emoji}</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 text-neev-charcoal border border-neev-ivory-border">
              {categoryConfig.badgeLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-neev-forest-800 bg-white/70 px-2.5 py-1 rounded-full">
            {visibility === 'invite_only' ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Invite-Only {isPinRequired ? '• 4-Digit PIN' : ''}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Public Listing</span>
              </>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-neev-charcoal leading-snug">
              {title || 'Your Milestone Title'}
            </h3>
            {eventDate && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-neev-slate">
                <Calendar className="w-4 h-4" />
                <span>Milestone Date: {formatDate(eventDate)}</span>
              </div>
            )}
          </div>

          {/* Progress bar preview */}
          <div className="p-4 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neev-slate">Target Foundation Goal</span>
              <span className="font-mono font-bold text-neev-forest-800 text-sm">
                {formatINR(targetAmount || 0)}
              </span>
            </div>

            {/* Empty initial progress bar */}
            <div className="w-full h-3 rounded-full bg-neev-ivory border border-neev-ivory-border overflow-hidden">
              <div className="h-full bg-neev-amber w-[4%] rounded-full" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neev-slate pt-1">
              <span>0 {categoryConfig.supporterMetricLabel}</span>
              <span>₹0 Raised • Just Launched</span>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neev-slate">
              Story & Blessings
            </h4>
            <p className="text-sm text-neev-charcoal/90 leading-relaxed whitespace-pre-wrap">
              {story || categoryConfig.defaultStoryPrompt}
            </p>
          </div>

          {/* Preview of Contributor CTA Button */}
          <div className="pt-2 border-t border-neev-ivory-border">
            <div className="w-full py-3.5 rounded-neev-md font-semibold text-center text-white bg-neev-terracotta shadow-warm-sm flex items-center justify-center gap-2 cursor-default">
              <HeartHandshake className="w-5 h-5" />
              <span>{categoryConfig.primaryCtaLabel}</span>
            </div>
            <p className="text-[11px] text-center text-neev-slate mt-2">
              (Live preview: supporters will see this instant UPI checkout button)
            </p>
          </div>
        </div>
      </div>

      {/* Fast Mobile & Verification Review Box for Public Pools */}
      {visibility === 'public' && (
        <div className="p-5 rounded-neev-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 shadow-warm-sm space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </span>
              <h4 className="font-serif text-sm sm:text-base font-bold text-emerald-950">
                Public Pool Verification
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
              {isMobileVerified ? '✓ Mobile OTP Verified' : 'Public Listing'}
            </span>
          </div>

          <div className="space-y-1 text-xs text-emerald-900">
            <p>
              <strong>Verified Mobile Number:</strong> +91 {mobileNumber || '9876543210'}
            </p>
            {proofPhotos && proofPhotos.length > 0 ? (
              <p className="text-[11px] text-emerald-800">
                📷 <strong>{proofPhotos.length} photo(s) attached:</strong> Our trust team will review these in the background to grant your green &ldquo;Verified Neev&rdquo; badge!
              </p>
            ) : (
              <p className="text-[11px] text-emerald-800">
                Ready to publish immediately. You can optionally submit milestone photos later from your creator dashboard.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3 Core Guarantees Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-neev-forest-50 text-neev-forest flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-neev-charcoal">₹0 Platform Fee</p>
          <p className="text-[11px] text-neev-slate">100% goes directly to you</p>
        </div>

        <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-neev-forest-50 text-neev-forest flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-neev-charcoal">Direct Bank Settle</p>
          <p className="text-[11px] text-neev-slate">Direct UPI / NPCI rails</p>
        </div>

        <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-neev-forest-50 text-neev-forest flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-neev-charcoal">Private Ledger</p>
          <p className="text-[11px] text-neev-slate">Donor amounts kept secret</p>
        </div>
      </div>

      {/* Mandatory Clickwrap Confirmation */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreeChange(e.target.checked)}
            className="mt-1 rounded text-neev-forest focus:ring-neev-forest-100 h-4 w-4"
          />
          <div className="text-xs text-neev-charcoal space-y-1">
            <p className="font-semibold">
              I agree to the Neev Platform Terms of Service, Gift & Contribution Policy, and DPDP Privacy Policy.
            </p>
            <p className="text-neev-slate leading-relaxed">
              I confirm that all contributions received into this pool are voluntary domestic Indian gifts under Section 25 of the Indian Contract Act 1872 and Section 56(2)(x) of the Income Tax Act, and not investments, loans, or commercial purchases.
            </p>
          </div>
        </label>
        {error && <p className="text-xs font-medium text-neev-terracotta">{error}</p>}
      </div>
    </div>
  );
}

