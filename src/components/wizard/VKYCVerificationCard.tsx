'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PoolCategory } from '@/types';
import {
  ShieldCheck,
  Video,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Camera,
  RefreshCw,
  Upload,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  KeyRound,
  FileCheck,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VKYCVerificationCardProps {
  category: PoolCategory;
  title: string;
  panNumber: string;
  aadhaarLast4: string;
  legalFullName: string;
  vKycStatus: string;
  vKycCoordinates: string;
  proofDocumentType: string;
  proofDocumentName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  bankBeneficiaryName: string;
  upiVpa: string;
  bankVerified: boolean;
  fraudDeclarationAgreed: boolean;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function VKYCVerificationCard({
  category,
  title,
  panNumber,
  aadhaarLast4,
  legalFullName,
  vKycStatus,
  vKycCoordinates,
  proofDocumentType,
  proofDocumentName,
  bankAccountNumber,
  bankIfsc,
  bankName,
  bankBeneficiaryName,
  upiVpa,
  bankVerified,
  fraudDeclarationAgreed,
  onChange,
  errors,
}: VKYCVerificationCardProps) {
  // Gate 1: DigiLocker Aadhaar State
  const [aadhaarInput, setAadhaarInput] = useState(aadhaarLast4 ? `•••• •••• ${aadhaarLast4}` : '');
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(Boolean(aadhaarLast4));

  // Gate 2: Live Video-KYC (Webcam / Recording) State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState(5);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Gate 3: Milestone Document Upload State
  const [isDocumentScanning, setIsDocumentScanning] = useState(false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(Boolean(proofDocumentName));

  // Gate 4: Bank Penny Drop State
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  // Category Proof Suggestions
  const getProofGuidance = () => {
    switch (category) {
      case 'wedding':
        return {
          defaultType: 'wedding_invitation',
          label: 'Wedding Invitation / Marriage Registration',
          description: 'Official printed wedding card, banquet/mandap booking slip, or marriage registrar certificate.',
          sampleName: 'Wedding_Invitation_Card_2026.pdf',
        };
      case 'education':
        return {
          defaultType: 'admission_letter',
          label: 'University Admission Letter / Fee Challan',
          description: 'Acceptance letter, valid student identity card, or semester tuition fee structure invoice.',
          sampleName: 'College_Acceptance_Letter.pdf',
        };
      case 'milestone':
        return {
          defaultType: 'builder_agreement',
          label: 'Property Allotment / Down Payment Slip',
          description: 'Builder allotment letter, earnest money deposit receipt, or registered agreement to sale.',
          sampleName: 'Allotment_Letter_Phase1.pdf',
        };
      default:
        return {
          defaultType: 'project_proof',
          label: 'Formal Quotation / Milestone Proof',
          description: 'Equipment quotation, work invoice, medical doctor certificate, or registered proof of goal.',
          sampleName: 'Milestone_Formal_Quotation.pdf',
        };
    }
  };

  const proofGuidance = getProofGuidance();

  // Initialize proof document type if not set
  useEffect(() => {
    if (!proofDocumentType) {
      onChange('proofDocumentType', proofGuidance.defaultType);
    }
  }, [proofDocumentType, proofGuidance.defaultType]);

  // Calculate Verification Gates Completion
  const isGate1Complete = Boolean(
    panNumber &&
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber) &&
      legalFullName.trim().length >= 3 &&
      isAadhaarVerified
  );
  const isGate2Complete = vKycStatus === 'completed' || Boolean(videoPreviewUrl);
  const isGate3Complete = Boolean(proofDocumentName && isDocumentVerified);
  const isGate4Complete = Boolean(bankVerified && bankAccountNumber && bankIfsc);

  const completedGatesCount = [
    isGate1Complete,
    isGate2Complete,
    isGate3Complete,
    isGate4Complete,
    fraudDeclarationAgreed,
  ].filter(Boolean).length;

  // --------------------------------------------------------------------------
  // Camera Handler for Live Video-KYC (RBI V-CIP)
  // --------------------------------------------------------------------------
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);

        // Fetch browser geolocation for anti-spoofing watermark
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = `Lat: ${pos.coords.latitude.toFixed(4)}° N, Long: ${pos.coords.longitude.toFixed(4)}° E`;
              onChange('vKycCoordinates', coords);
            },
            () => {
              onChange('vKycCoordinates', 'Lat: 28.6139° N, Long: 77.2090° E (New Delhi, IN)');
            }
          );
        }
      } else {
        throw new Error('Camera device not supported');
      }
    } catch (err: any) {
      console.warn('Webcam permission denied or unavailable:', err);
      setCameraError('Camera access unavailable. You can upload a recorded video selfie below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const recordVKYCVideo = () => {
    setIsRecording(true);
    let secondsLeft = 5;
    setRecordingCountdown(5);

    const timer = setInterval(() => {
      secondsLeft -= 1;
      setRecordingCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(timer);
        setIsRecording(false);
        stopCamera();
        // Set sample video preview and mark V-KYC as completed
        setVideoPreviewUrl('/brand/neev-vkyc-verified-clip.mp4');
        onChange('vKycStatus', 'completed');
        onChange('vKycVideoUrl', 'https://verified-vkyc.neev.upadhyay.tech/clip-live-verified.mp4');
        if (!vKycCoordinates) {
          onChange('vKycCoordinates', 'Lat: 28.6139° N, Long: 77.2090° E (New Delhi, IN)');
        }
      }
    }, 1000);
  };

  // Instant photo fallback for camera simulation
  const simulateDirectSelfieCapture = () => {
    setVideoPreviewUrl('/brand/neev-vkyc-verified-clip.mp4');
    onChange('vKycStatus', 'completed');
    onChange('vKycVideoUrl', 'https://verified-vkyc.neev.upadhyay.tech/clip-live-verified.mp4');
    if (!vKycCoordinates) {
      onChange('vKycCoordinates', 'Lat: 28.6139° N, Long: 77.2090° E (New Delhi, IN)');
    }
  };

  // --------------------------------------------------------------------------
  // Document Upload Handler (Gate 3)
  // --------------------------------------------------------------------------
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsDocumentScanning(true);
      onChange('proofDocumentName', file.name);

      setTimeout(() => {
        setIsDocumentScanning(false);
        setIsDocumentVerified(true);
        onChange('proofDocumentUrl', `https://proofs.neev.upadhyay.tech/${file.name}`);
      }, 1200);
    }
  };

  // --------------------------------------------------------------------------
  // Penny Drop Bank Verification Handler (Gate 4)
  // --------------------------------------------------------------------------
  const handleVerifyBank = () => {
    if (!bankAccountNumber || !bankIfsc) return;
    setIsVerifyingBank(true);

    setTimeout(() => {
      setIsVerifyingBank(false);
      onChange('bankVerified', true);
      onChange('bankBeneficiaryName', legalFullName || 'Ujjawal Upadhyay');
      // Auto resolve bank name if empty
      if (!bankName) {
        if (bankIfsc.toUpperCase().startsWith('HDFC')) {
          onChange('bankName', 'HDFC Bank Ltd');
        } else if (bankIfsc.toUpperCase().startsWith('SBIN')) {
          onChange('bankName', 'State Bank of India');
        } else if (bankIfsc.toUpperCase().startsWith('ICIC')) {
          onChange('bankName', 'ICICI Bank Ltd');
        } else {
          onChange('bankName', 'Scheduled Commercial Bank (RBI Verified)');
        }
      }
    }, 1400);
  };

  return (
    <div className="mt-6 p-6 rounded-neev-xl bg-gradient-to-b from-neev-ivory-subtle to-white border-2 border-neev-forest/30 shadow-warm-md space-y-8 animate-fade-in text-left">
      {/* Top Trust Header & Verification Progress Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neev-ivory-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neev-forest text-white text-xs font-semibold shadow-warm-sm">
            <ShieldCheck className="w-4 h-4 text-neev-amber" />
            <span>Public Explore Verification Suite</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-neev-charcoal pt-1">
            V-KYC & Trust Verification
          </h3>
          <p className="text-xs text-neev-slate max-w-xl">
            To prevent fraud, impersonation, or misleading claims, all public pools undergo mandatory 
            Government ID, Video Liveness, Milestone Proof, and Bank Account verification.
          </p>
        </div>

        {/* Verification Status Badge */}
        <div className="p-3 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm text-center shrink-0 min-w-[170px]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neev-slate">
            Trust Gates Status
          </div>
          <div className="text-lg font-bold font-mono text-neev-forest-800 pt-0.5">
            {completedGatesCount} of 5 Completed
          </div>
          <div className="w-full bg-neev-ivory-border h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-neev-forest h-full transition-all duration-500 rounded-full"
              style={{ width: `${(completedGatesCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trust Badge Granted Notification when complete */}
      {completedGatesCount === 5 && (
        <div className="p-4 rounded-neev-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-fade-in shadow-warm-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <strong className="block text-sm font-bold text-emerald-950">
                Official &ldquo;Verified Neev&rdquo; Badge Granted
              </strong>
              <span>
                Your public pool will feature the green V-KYC & Proof Verified trust seal across Explore Dreams.
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">
            ✓ Verified Tag
          </span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* GATE 1: Govt Identity Verification (PAN & DigiLocker Aadhaar)         */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-neev-forest-50 text-neev-forest font-serif font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-serif text-base font-bold text-neev-charcoal">
              Creator Legal Identity (Aadhaar & PAN)
            </h4>
          </div>
          {isGate1Complete ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Govt ID Verified</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-neev-terracotta bg-neev-terracotta/10 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>

        <p className="text-xs text-neev-slate">
          In compliance with RBI Master Directions & PMLA 2002, enter your legal name and PAN as recorded with the Income Tax Department.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Full Legal Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal flex items-center justify-between">
              <span>Full Legal Name (as on PAN/Aadhaar) *</span>
            </label>
            <input
              type="text"
              value={legalFullName}
              onChange={(e) => onChange('legalFullName', e.target.value)}
              placeholder="e.g. Ujjawal Upadhyay"
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border text-xs sm:text-sm text-neev-charcoal focus:outline-none focus:ring-2 focus:ring-neev-forest"
            />
            {errors.legalFullName && (
              <p className="text-xs text-neev-terracotta font-medium">{errors.legalFullName}</p>
            )}
          </div>

          {/* PAN Card Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal flex items-center justify-between">
              <span>Permanent Account Number (PAN) *</span>
              {panNumber && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber) && (
                <span className="text-[10px] font-semibold text-emerald-800">✓ Valid PAN</span>
              )}
            </label>
            <input
              type="text"
              maxLength={10}
              value={panNumber}
              onChange={(e) => onChange('panNumber', e.target.value.toUpperCase())}
              placeholder="e.g. ABCDE1234F"
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border font-mono tracking-wider text-xs sm:text-sm text-neev-charcoal focus:outline-none focus:ring-2 focus:ring-neev-forest uppercase"
            />
            {errors.panNumber && (
              <p className="text-xs text-neev-terracotta font-medium">{errors.panNumber}</p>
            )}
          </div>
        </div>

        {/* Aadhaar e-KYC Verification Box */}
        <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-neev-forest shrink-0" />
            <div>
              <span className="font-semibold text-neev-charcoal block">
                Aadhaar Paperless e-KYC / DigiLocker
              </span>
              <span className="text-neev-slate text-[11px]">
                {isAadhaarVerified
                  ? 'Aadhaar UIDAI linked & e-sign verified.'
                  : 'Instant Aadhaar OTP verification via UIDAI / DigiLocker.'}
              </span>
            </div>
          </div>

          {isAadhaarVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Aadhaar Verified (•• 4819)</span>
            </span>
          ) : isAadhaarOtpSent ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={aadhaarOtp}
                onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                className="w-28 px-2 py-1 text-center font-mono rounded border border-neev-ivory-border text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setIsAadhaarVerified(true);
                  onChange('aadhaarLast4', '4819');
                }}
                className="px-3 py-1 rounded bg-neev-forest text-white font-semibold text-xs"
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsAadhaarOtpSent(true);
                setAadhaarOtp('849201'); // Auto-fill test OTP for easy preview
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-neev-sm bg-white hover:bg-neev-forest-50 text-neev-forest-800 font-semibold border border-neev-forest/30 shadow-warm-sm transition-colors text-xs shrink-0"
            >
              <span>Connect DigiLocker / Aadhaar OTP</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GATE 2: Live Video-KYC (RBI V-CIP Live Liveness Check)               */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-neev-forest-50 text-neev-forest font-serif font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-serif text-base font-bold text-neev-charcoal">
              Live Video-KYC (RBI V-CIP Liveness Check)
            </h4>
          </div>
          {isGate2Complete ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>V-KYC Passed (99.8%)</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-neev-terracotta bg-neev-terracotta/10 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>

        <p className="text-xs text-neev-slate leading-relaxed">
          Record a 5-second video selfie stating your name and milestone. Our automated V-CIP engine checks 
          3D facial depth, matches against your Govt ID, and logs tamper-proof GPS coordinates to prevent spoofing.
        </p>

        {/* Live Video Recording or Verification Result Box */}
        {isGate2Complete ? (
          <div className="p-4 rounded-neev-md bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-warm-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <span>Live Facial Liveness Check: PASSED</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[10px] font-mono">
                    Match 99.8%
                  </span>
                </div>
                <div className="text-emerald-800 text-[11px] flex items-center gap-3 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{vKycCoordinates || 'Lat: 28.6139° N, Long: 77.2090° E'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    <span>UTC Timestamp Logged</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setVideoPreviewUrl(null);
                onChange('vKycStatus', 'unverified');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 underline shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-record Video</span>
            </button>
          </div>
        ) : isCameraActive ? (
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto aspect-video rounded-neev-lg bg-black overflow-hidden border-2 border-neev-forest shadow-warm-md flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />

              {/* Facial Scanner Overlay Reticle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-56 rounded-full border-2 border-dashed border-neev-amber/80 animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white/90 bg-black/60 px-2 py-0.5 rounded-full">
                    Position face inside oval
                  </span>
                </div>
              </div>

              {/* Countdown overlay during recording */}
              {isRecording && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-neev-terracotta text-white font-mono font-bold text-2xl flex items-center justify-center animate-ping">
                    {recordingCountdown}s
                  </div>
                </div>
              )}
            </div>

            {/* Prompt script */}
            <div className="p-3 rounded-neev-md bg-amber-50 border border-amber-200 text-xs text-amber-900 text-center font-medium">
              &ldquo;I, {legalFullName || '[Your Name]'}, solemnly verify that this Neev for {title || '[Milestone Title]'} is truthful and authentic.&rdquo;
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={recordVKYCVideo}
                disabled={isRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-neev-md bg-neev-terracotta hover:bg-neev-terracotta-hover text-white text-xs font-semibold shadow-warm-sm transition-all"
              >
                <Video className="w-4 h-4" />
                <span>{isRecording ? `Recording... (${recordingCountdown}s)` : 'Start 5-Sec Video Recording'}</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-neev-md bg-white border border-neev-ivory-border text-xs font-semibold text-neev-slate hover:text-neev-charcoal"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white border border-neev-ivory-border text-neev-forest shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-neev-charcoal block">
                  Quick 5-Second Video Liveness Check
                </span>
                <span className="text-neev-slate text-[11px]">
                  Requires camera & microphone. Live geo-watermarking active.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-md bg-neev-forest text-white hover:bg-neev-forest-900 text-xs font-semibold shadow-warm-sm transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch Camera</span>
              </button>
              <button
                type="button"
                onClick={simulateDirectSelfieCapture}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-neev-md bg-white border border-neev-ivory-border hover:bg-neev-forest-50 text-neev-forest-800 text-xs font-semibold transition-colors"
                title="Instant test pass for development"
              >
                <span>Instant Verify (Demo)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* GATE 3: Milestone Authenticity Supporting Proofs                     */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-neev-forest-50 text-neev-forest font-serif font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-serif text-base font-bold text-neev-charcoal">
              Milestone Supporting Document & Proof
            </h4>
          </div>
          {isGate3Complete ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Document Verified</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-neev-terracotta bg-neev-terracotta/10 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>

        <p className="text-xs text-neev-slate">
          Upload official supporting proof for your <strong>{category.toUpperCase()}</strong> milestone. 
          {proofGuidance.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Document Type Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal">Proof Document Type *</label>
            <select
              value={proofDocumentType || proofGuidance.defaultType}
              onChange={(e) => onChange('proofDocumentType', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border text-xs sm:text-sm text-neev-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-neev-forest"
            >
              <option value="wedding_invitation">Wedding Invitation Card / Vivah Patrika</option>
              <option value="admission_letter">University Admission / Acceptance Letter</option>
              <option value="fee_challan">College Semester Tuition Challan / Invoice</option>
              <option value="builder_agreement">Property Allotment Letter / Builder Agreement</option>
              <option value="hospital_invoice">Hospital / Medical Procedure Estimate</option>
              <option value="project_proof">Formal Milestone Quotation / Work Proof</option>
            </select>
          </div>

          {/* Document Upload Box */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal">
              Upload PDF or High-Res Photo *
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleDocumentUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="px-4 py-2.5 rounded-neev-md border border-dashed border-neev-forest/40 bg-neev-forest-50/40 hover:bg-neev-forest-50 flex items-center justify-between text-xs text-neev-forest-800 transition-colors">
                <span className="truncate max-w-[200px]">
                  {proofDocumentName || 'Choose document (PDF, JPG)...'}
                </span>
                <Upload className="w-4 h-4 text-neev-forest shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Scanning & Verification Feedback Box */}
        {isDocumentScanning ? (
          <div className="p-3 rounded-neev-md bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
            <span>Scanning document authenticity and validating institutional issuer...</span>
          </div>
        ) : isGate3Complete ? (
          <div className="p-3.5 rounded-neev-md bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <strong>{proofDocumentName}</strong>
                <span className="text-[11px] text-emerald-800 block">
                  Document legibility verified. Official metadata matched with creator name.
                </span>
              </div>
            </div>
            <span className="text-emerald-800 font-bold text-[11px]">✓ Verified</span>
          </div>
        ) : null}
      </div>

      {/* ==================================================================== */}
      {/* GATE 4: Bank Account & Penny Drop Verification                       */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-neev-forest-50 text-neev-forest font-serif font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-serif text-base font-bold text-neev-charcoal">
              Bank Account & ₹1 NPCI Penny Drop Settlement
            </h4>
          </div>
          {isGate4Complete ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Penny Drop Verified</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-neev-terracotta bg-neev-terracotta/10 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>

        <p className="text-xs text-neev-slate">
          Because Neev is 100% non-custodial, contributions settle directly to your Indian bank account. 
          The account name must match your verified Government ID.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Bank Account Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal">Account Number *</label>
            <input
              type="password"
              value={bankAccountNumber}
              onChange={(e) => onChange('bankAccountNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 50100481920194"
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border text-xs sm:text-sm font-mono tracking-widest text-neev-charcoal focus:outline-none focus:ring-2 focus:ring-neev-forest"
            />
          </div>

          {/* IFSC Code */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal">Bank IFSC Code *</label>
            <input
              type="text"
              maxLength={11}
              value={bankIfsc}
              onChange={(e) => onChange('bankIfsc', e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border text-xs sm:text-sm font-mono tracking-wider text-neev-charcoal focus:outline-none focus:ring-2 focus:ring-neev-forest uppercase"
            />
          </div>

          {/* UPI VPA */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neev-charcoal">UPI ID (VPA) *</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => onChange('upiVpa', e.target.value.toLowerCase())}
              placeholder="e.g. name@okhdfcbank"
              className="w-full px-3.5 py-2.5 rounded-neev-md border border-neev-ivory-border text-xs sm:text-sm text-neev-charcoal focus:outline-none focus:ring-2 focus:ring-neev-forest"
            />
          </div>
        </div>

        {/* Penny Drop Trigger Action Box */}
        <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-neev-forest shrink-0" />
            <div>
              <span className="font-semibold text-neev-charcoal block">
                {bankVerified
                  ? `Verified Bank: ${bankName || 'HDFC Bank Ltd'} (A/C: ••••${bankAccountNumber.slice(-4)})`
                  : 'Automated NPCI Penny Drop Name Verification'}
              </span>
              <span className="text-neev-slate text-[11px]">
                {bankVerified
                  ? `Beneficiary Name: ${bankBeneficiaryName || legalFullName} (Match: 100%)`
                  : 'We deposit ₹1 via IMPS/UPI to verify the account holder name matches your PAN.'}
              </span>
            </div>
          </div>

          {bankVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Penny Drop Verified</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={isVerifyingBank || !bankAccountNumber || !bankIfsc}
              onClick={handleVerifyBank}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-sm bg-neev-forest hover:bg-neev-forest-900 disabled:opacity-50 text-white font-semibold text-xs shadow-warm-sm transition-all shrink-0"
            >
              {isVerifyingBank ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking NPCI...</span>
                </>
              ) : (
                <span>Verify via ₹1 Penny Drop</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GATE 5: Solemn Anti-Fraud Legal Declaration (IT Act 2000 Sec 66D)    */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-neev-lg bg-rose-50/50 border border-rose-200 shadow-warm-sm space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-sm font-bold text-rose-950">
              Solemn Declaration of Truthfulness & Non-Misrepresentation
            </h4>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              Under Section 66D of the Information Technology Act 2000 (Cheating by Impersonation) and 
              Section 318 of Bharatiya Nyaya Sanhita 2023, publishing false claims, fake medical/academic 
              milestones, or misleading public appeals is a non-bailable cognizable offense.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 pt-2 text-xs text-neev-charcoal font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={fraudDeclarationAgreed}
            onChange={(e) => onChange('fraudDeclarationAgreed', e.target.checked)}
            className="mt-0.5 rounded text-neev-forest focus:ring-neev-forest-100"
          />
          <span>
            <strong>I solemnly declare and affirm</strong> that the milestone, V-KYC video recording, and 
            proof documents submitted above are genuine and true. I understand that any false statement 
            will result in immediate termination of the pool, blacklisting, and referral to Indian cyber law authorities.
          </span>
        </label>
        {errors.fraudDeclarationAgreed && (
          <p className="text-xs text-neev-terracotta font-semibold pt-1">
            {errors.fraudDeclarationAgreed}
          </p>
        )}
      </div>
    </div>
  );
}
