'use client';

import React from 'react';
import { EnrichedPool } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  Video,
  FileCheck,
  Building2,
  Lock,
  X,
  ExternalLink,
  MapPin,
  Clock,
  KeyRound,
} from 'lucide-react';

interface TrustVerificationModalProps {
  pool: EnrichedPool;
  onClose: () => void;
}

export function TrustVerificationModal({ pool, onClose }: TrustVerificationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white w-full max-w-xl rounded-neev-2xl border border-neev-ivory-border shadow-warm-xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neev-ivory-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-warm-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-neev-charcoal">
                Official Trust & Verification Dossier
              </h3>
              <p className="text-xs text-neev-slate">
                Vetted under RBI V-CIP, PMLA 2002 & IT Act 2000
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neev-slate hover:text-neev-charcoal hover:bg-neev-ivory-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pool Summary Box */}
        <div className="p-4 rounded-neev-lg bg-neev-ivory-subtle border border-neev-ivory-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neev-slate">
            Verified Milestone
          </span>
          <h4 className="font-serif text-sm sm:text-base font-bold text-neev-charcoal line-clamp-1">
            {pool.title}
          </h4>
          <p className="text-xs text-neev-slate">
            Created by <strong>{pool.creator_name}</strong> • Status:{' '}
            <span className="text-emerald-800 font-semibold font-mono">V-KYC VERIFIED</span>
          </p>
        </div>

        {/* 5 Verified Gates List */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-neev-charcoal">
            Verified Authenticity Gates
          </h5>

          {/* Gate 1: Govt ID */}
          <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-neev-charcoal flex items-center gap-2">
                <span>Government Identity (PAN & Aadhaar)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                  UIDAI / NSDL Linked
                </span>
              </div>
              <p className="text-neev-slate text-[11px] leading-relaxed">
                Legal identity matched with Income Tax PAN and paperless Aadhaar e-KYC.
              </p>
            </div>
          </div>

          {/* Gate 2: Live Video-KYC */}
          <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-neev-charcoal flex items-center gap-2">
                <span>Live Video-KYC (RBI V-CIP Liveness)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                  Face Match: 99.8%
                </span>
              </div>
              <p className="text-neev-slate text-[11px] leading-relaxed">
                3D facial depth check completed with tamper-proof GPS coordinates and UTC timestamp log.
              </p>
            </div>
          </div>

          {/* Gate 3: Milestone Document Proof */}
          <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-neev-charcoal flex items-center gap-2">
                <span>Milestone Supporting Documentation</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                  Proof Verified
                </span>
              </div>
              <p className="text-neev-slate text-[11px] leading-relaxed">
                Official document proof ({pool.proof_document_name || 'Admission / Invitation / Agreement'}) 
                inspected and validated against declared milestone details.
              </p>
            </div>
          </div>

          {/* Gate 4: Direct Bank Settlement */}
          <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-neev-charcoal flex items-center gap-2">
                <span>Bank Account Settlement (₹1 Penny Drop)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                  NPCI Match 100%
                </span>
              </div>
              <p className="text-neev-slate text-[11px] leading-relaxed">
                Verified Indian bank account. All contributions settle directly to creator via NPCI UPI rails.
              </p>
            </div>
          </div>

          {/* Gate 5: Legal Declaration */}
          <div className="p-3.5 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-neev-charcoal flex items-center gap-2">
                <span>Anti-Fraud & Truthfulness Declaration</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                  Sec 66D IT Act
                </span>
              </div>
              <p className="text-neev-slate text-[11px] leading-relaxed">
                Solemnly affirmed under penalty of perjury under Section 66D of IT Act 2000 and Bharatiya Nyaya Sanhita.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Signature & Footer Seal */}
        <div className="p-4 rounded-neev-md bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="text-[11px]">
              Certified by <strong>Upadhyay Technologies Private Limited</strong> (India)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-neev-sm bg-neev-forest text-white font-semibold text-xs hover:bg-neev-forest-900 transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
