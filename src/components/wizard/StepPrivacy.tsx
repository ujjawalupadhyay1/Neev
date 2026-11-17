import React from 'react';
import { PoolVisibility } from '@/types';
import { Lock, Globe, KeyRound, ShieldAlert, ShieldCheck, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepPrivacyProps {
  visibility: PoolVisibility;
  isPinRequired: boolean;
  accessPin: string;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepPrivacy({
  visibility,
  isPinRequired,
  accessPin,
  onChange,
  errors,
}: StepPrivacyProps) {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
          Privacy & Visibility Controls
        </h2>
        <p className="text-sm text-neev-slate">
          You decide who sees your milestone. Individual contribution amounts are always 100% private.
        </p>
      </div>

      {/* Strict Privacy Assurance Banner */}
      <div className="p-4 rounded-neev-md bg-neev-forest-50 border border-neev-forest-100 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-neev-forest-800 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <strong className="text-neev-forest-900 font-semibold block">
            Non-Negotiable Privacy Rule:
          </strong>
          <p className="text-neev-forest-800 leading-relaxed">
            Publicly or to guests, your pool displays <strong>only</strong> the aggregate total raised, target amount, supporter count, and well-wish messages. <strong>Individual rupee amounts are strictly hidden from everyone</strong> and visible only to you in your private creator ledger.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Option 1: Invite Only */}
        <div
          onClick={() => onChange('visibility', 'invite_only')}
          className={cn(
            'p-6 rounded-neev-lg border-2 cursor-pointer transition-all duration-200 bg-white text-left',
            visibility === 'invite_only'
              ? 'border-neev-forest ring-4 ring-neev-forest-50 shadow-warm-md'
              : 'border-neev-ivory-border hover:border-neev-forest/40'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border">
                <Lock className="w-6 h-6 text-neev-forest-800" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                  Invite-Only (Recommended for Weddings & Family)
                </h3>
                <p className="text-xs text-neev-slate font-medium">
                  Unlisted from search & explore. Accessible only via secret link or WhatsApp QR.
                </p>
              </div>
            </div>
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                visibility === 'invite_only'
                  ? 'border-neev-forest bg-neev-forest'
                  : 'border-neev-ivory-border'
              )}
            >
              {visibility === 'invite_only' && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          {/* Optional PIN sub-setting */}
          {visibility === 'invite_only' && (
            <div className="mt-5 pt-4 border-t border-neev-ivory-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neev-charcoal flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinRequired}
                    onChange={(e) => onChange('isPinRequired', e.target.checked)}
                    className="rounded text-neev-forest focus:ring-neev-forest-100"
                  />
                  <span>Protect with an optional 4-digit guest PIN</span>
                </label>
                <KeyRound className="w-4 h-4 text-neev-slate" />
              </div>

              {isPinRequired && (
                <div className="pl-6 space-y-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={accessPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      onChange('accessPin', val);
                    }}
                    placeholder="Enter 4-digit PIN (e.g. 1994)"
                    className="w-44 px-3 py-2 rounded-neev-sm border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-sm font-mono tracking-widest text-center"
                  />
                  {errors.accessPin && (
                    <p className="text-xs font-medium text-neev-terracotta">
                      {errors.accessPin}
                    </p>
                  )}
                  <p className="text-[11px] text-neev-slate">
                    Guests will be asked to enter this 4-digit PIN before viewing the story and contributing.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Option 2: Public */}
        <div
          onClick={() => onChange('visibility', 'public')}
          className={cn(
            'p-6 rounded-neev-lg border-2 cursor-pointer transition-all duration-200 bg-white text-left',
            visibility === 'public'
              ? 'border-neev-forest ring-4 ring-neev-forest-50 shadow-warm-md'
              : 'border-neev-ivory-border hover:border-neev-forest/40'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border">
                <Globe className="w-6 h-6 text-neev-amber" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                  Public (Listed on Explore Dreams)
                </h3>
                <p className="text-xs text-neev-slate font-medium">
                  Discoverable by supporters across India. Requires creator KYC verification.
                </p>
              </div>
            </div>
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                visibility === 'public'
                  ? 'border-neev-forest bg-neev-forest'
                  : 'border-neev-ivory-border'
              )}
            >
              {visibility === 'public' && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          {visibility === 'public' && (
            <div className="mt-4 pt-3 border-t border-neev-ivory-border flex items-start gap-2 text-xs text-neev-slate">
              <ShieldAlert className="w-4 h-4 text-neev-amber shrink-0 mt-0.5" />
              <p>
                To maintain trust and prevent misuse, public listings undergo rapid automated Aadhaar/PAN KYC before appearing on the public Explore feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

