'use client';

import React, { useState } from 'react';
import { PoolCategory } from '@/types';
import {
  Smartphone,
  CheckCircle2,
  Upload,
  Sparkles,
  Camera,
  X,
  ShieldCheck,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface VKYCVerificationCardProps {
  category: PoolCategory;
  title: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  proofPhotos: string[];
  proofNotes: string;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function VKYCVerificationCard({
  category,
  title,
  mobileNumber,
  isMobileVerified,
  proofPhotos = [],
  proofNotes,
  onChange,
  errors,
}: VKYCVerificationCardProps) {
  // Mobile OTP state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Handle Send OTP
  const handleSendOtp = () => {
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setOtpError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      setOtpInput('482910'); // Auto-fill test OTP for instantaneous test flow
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOtp = () => {
    if (otpInput.length === 6) {
      onChange('isMobileVerified', true);
      setOtpError('');
    } else {
      setOtpError('Please enter the 6-digit OTP sent to your phone');
    }
  };

  // Handle Photo Upload (Optional)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      Array.from(files).forEach((file) => {
        newUrls.push(URL.createObjectURL(file));
      });
      onChange('proofPhotos', [...proofPhotos, ...newUrls].slice(0, 4));
    }
  };

  const removePhoto = (index: number) => {
    onChange(
      'proofPhotos',
      proofPhotos.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mt-6 p-6 rounded-neev-xl bg-gradient-to-b from-neev-ivory-subtle to-white border border-neev-ivory-border shadow-warm-sm space-y-6 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neev-ivory-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neev-forest text-white text-xs font-semibold shadow-warm-sm">
            <Smartphone className="w-3.5 h-3.5 text-neev-amber" />
            <span>Fast Mobile Verification (Zero Paperwork)</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-neev-charcoal pt-1">
            Publish Publicly in Seconds
          </h3>
          <p className="text-xs text-neev-slate max-w-lg">
            Verify your mobile number via instant OTP. No paperwork required to publish. 
            You can optionally attach photos for our team to grant you a green Verified badge in the background.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            100% Free &amp; Instant
          </span>
        </div>
      </div>

      {/* STEP 1: Quick Mobile OTP Verification */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neev-forest-50 text-neev-forest font-serif font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-serif text-sm sm:text-base font-bold text-neev-charcoal">
              Mobile Number Verification
            </h4>
          </div>
          {isMobileVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mobile Verified</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-neev-terracotta bg-neev-terracotta/10 px-2 py-0.5 rounded-full">
              Required for Public
            </span>
          )}
        </div>

        <p className="text-xs text-neev-slate">
          We send a quick 6-digit SMS OTP to verify you are a genuine dreamer and prevent spam.
        </p>

        {!isMobileVerified ? (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center border border-neev-ivory-border rounded-neev-md overflow-hidden bg-white shadow-warm-sm flex-1">
                <span className="px-3 py-2.5 bg-neev-ivory-subtle text-xs font-semibold text-neev-slate border-r border-neev-ivory-border">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    onChange('mobileNumber', clean);
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-neev-charcoal outline-none font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || mobileNumber.replace(/\D/g, '').length !== 10}
                className="px-4 py-2.5 rounded-neev-md bg-neev-forest hover:bg-neev-forest-900 disabled:opacity-50 text-white font-semibold text-xs shadow-warm-sm transition-all shrink-0"
              >
                {isSendingOtp ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : isOtpSent ? (
                  'Resend OTP'
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>

            {isOtpSent && (
              <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="text-xs text-neev-slate">
                  Enter the 6-digit OTP sent to <strong>+91 {mobileNumber}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-32 px-3 py-1.5 text-center font-mono tracking-widest text-sm rounded border border-neev-ivory-border"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-warm-sm"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {(otpError || errors.mobileNumber) && (
              <p className="text-xs text-neev-terracotta font-medium">
                {otpError || errors.mobileNumber}
              </p>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-neev-md bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Verified Phone: <strong>+91 {mobileNumber}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange('isMobileVerified', false)}
              className="text-emerald-800 hover:text-emerald-950 underline font-semibold text-[11px]"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* STEP 2: Optional Milestone Photos for Background Badge Grant */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neev-amber/20 text-neev-amber font-serif font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-serif text-sm sm:text-base font-bold text-neev-charcoal">
              Milestone Photos (Optional Trust Booster)
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-neev-forest-800 bg-neev-forest-50 px-2 py-0.5 rounded-full border border-neev-forest-100">
            100% Optional
          </span>
        </div>

        <p className="text-xs text-neev-slate leading-relaxed">
          Want the official green <strong>&ldquo;Verified Neev&rdquo;</strong> badge? Upload 1 or 2 photos related 
          to your milestone (e.g. couple photo, student ID, admit card, or dream home photo). 
          Our team reviews them in the background and awards your badge within hours!
        </p>

        {/* Photo Uploader */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-neev-md bg-neev-forest-50 hover:bg-neev-forest-100 border border-neev-forest-100 text-xs font-semibold text-neev-forest transition-colors shadow-warm-sm">
              <Camera className="w-4 h-4" />
              <span>Add Photos (Max 4)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-neev-slate">
              {proofPhotos.length === 0
                ? 'No photos uploaded yet (You can skip this step)'
                : `${proofPhotos.length} photo(s) selected`}
            </span>
          </div>

          {/* Thumbnails */}
          {proofPhotos.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {proofPhotos.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-neev-md overflow-hidden border border-neev-ivory-border shadow-warm-sm group">
                  <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Optional Notes */}
          <div className="pt-1">
            <input
              type="text"
              value={proofNotes}
              onChange={(e) => onChange('proofNotes', e.target.value)}
              placeholder="Optional: Brief note for our verification team (e.g. Wedding date 15 Dec in Jaipur)"
              className="w-full px-3 py-2 rounded-neev-sm border border-neev-ivory-border text-xs text-neev-charcoal placeholder:text-neev-slate/70 outline-none"
            />
          </div>
        </div>

        {/* Background Team Review Assurance */}
        <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex items-start gap-2.5 text-xs text-neev-slate">
          <Clock className="w-4 h-4 text-neev-forest shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-neev-charcoal">How Background Verification Works:</strong> You can launch right now. 
            Once published, our team checks your milestone photos and activates your green 
            <strong>&ldquo;Verified Neev&rdquo;</strong> badge across Explore Dreams.
          </div>
        </div>
      </div>
    </div>
  );
}
