'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PoolCategory, PoolVisibility } from '@/types';
import { WizardProgress } from './WizardProgress';
import { StepCategory } from './StepCategory';
import { StepDetails } from './StepDetails';
import { StepPrivacy } from './StepPrivacy';
import { StepReview } from './StepReview';
import { createPoolSchema } from '@/lib/validations/pool';
import { generatePoolSlug } from '@/lib/utils';
import { createWishPoolAction } from '@/app/actions/pool';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

const WIZARD_STEPS = [
  { id: 1, title: 'Category', subtitle: 'Choose your occasion' },
  { id: 2, title: 'Story & Target', subtitle: 'Set title and goal' },
  { id: 3, title: 'Privacy & PIN', subtitle: 'Invite or public' },
  { id: 4, title: 'Review & Launch', subtitle: 'Verify and publish' },
];

export function CreateNeevWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial category from query param if provided
  const queryCat = searchParams.get('category') as PoolCategory;
  const initialCategory: PoolCategory =
    queryCat && ['wedding', 'education', 'milestone', 'universal'].includes(queryCat)
      ? queryCat
      : 'wedding';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: initialCategory,
    title: '',
    targetAmount: 100000,
    eventDate: '',
    story: '',
    coverImageUrl: '',
    visibility: 'invite_only' as PoolVisibility,
    isPinRequired: false,
    accessPin: '',
    agreedToTerms: false,

    // Verification & V-KYC State for Public Pools
    panNumber: '',
    aadhaarLast4: '',
    legalFullName: '',
    vKycStatus: 'unverified',
    vKycVideoUrl: '',
    vKycCoordinates: '',
    proofDocumentType: 'wedding_invitation',
    proofDocumentName: '',
    proofDocumentUrl: '',
    proofNotes: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: '',
    bankBeneficiaryName: '',
    upiVpa: '',
    bankVerified: false,
    fraudDeclarationAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    } else if (currentStep === 2) {
      if (!formData.title || formData.title.trim().length < 5) {
        newErrors.title = 'Title must be at least 5 characters';
      }
      if (!formData.targetAmount || formData.targetAmount < 1000) {
        newErrors.targetAmount = 'Target amount must be at least ₹ 1,000';
      }
      if (!formData.story || formData.story.trim().length < 20) {
        newErrors.story = 'Please provide a story of at least 20 characters';
      }
    } else if (currentStep === 3) {
      if (formData.visibility === 'invite_only' && formData.isPinRequired) {
        if (!formData.accessPin || !/^\d{4}$/.test(formData.accessPin)) {
          newErrors.accessPin = 'Please enter a valid 4-digit numeric PIN';
        }
      } else if (formData.visibility === 'public') {
        if (!formData.legalFullName || formData.legalFullName.trim().length < 3) {
          newErrors.legalFullName = 'Please enter your full legal name as per Government ID';
        }
        if (!formData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
          newErrors.panNumber = 'A valid 10-character PAN number (e.g. ABCDE1234F) is required for public pools';
        }
        if (formData.vKycStatus !== 'completed') {
          newErrors.vKycStatus = 'Please complete the 5-second Video-KYC liveness check to verify creator identity';
        }
        if (!formData.proofDocumentName) {
          newErrors.proofDocumentName = 'Please upload official supporting documentation for this milestone';
        }
        if (!formData.bankVerified || !formData.bankAccountNumber || !formData.bankIfsc) {
          newErrors.bankVerified = 'Please enter bank details and run the ₹1 Penny Drop verification';
        }
        if (!formData.fraudDeclarationAgreed) {
          newErrors.fraudDeclarationAgreed = 'You must affirm the Anti-Fraud declaration under IT Act Section 66D';
        }
      }
    } else if (currentStep === 4) {
      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = 'You must confirm the legal terms and non-custodial model to proceed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await createWishPoolAction(formData as any);
      if (!res.success) {
        throw new Error(res.error || 'Failed to create wish pool');
      }
      setCreatedSlug(res.slug || generatePoolSlug(formData.title));
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Failed to create wish pool. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdSlug) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-neev-forest-50 border-2 border-neev-forest flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-neev-forest" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-neev-charcoal">
            Your Neev Has Been Created!
          </h2>
          <p className="text-sm text-neev-slate">
            The foundation is laid. Share your private link with loved ones to receive their blessings and shagun directly into your bank account.
          </p>
        </div>

        <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm text-left space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neev-slate">
            Shareable Wish Pool Link
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`https://neev.app/pool/${createdSlug}`}
              className="flex-1 px-3 py-2 rounded-neev-sm bg-neev-ivory-subtle border border-neev-ivory-border text-xs font-mono select-all"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://neev.app/pool/${createdSlug}`);
                alert('Copied link to clipboard!');
              }}
              className="px-3 py-2 rounded-neev-sm bg-neev-forest text-white text-xs font-semibold hover:bg-neev-forest-900 transition-colors"
            >
              Copy
            </button>
          </div>
          {formData.visibility === 'invite_only' && formData.isPinRequired && (
            <p className="text-[11px] text-neev-amber font-medium">
              Protected by 4-digit PIN: <span className="font-mono">{formData.accessPin}</span>
            </p>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/pool/${createdSlug}`}
            className="w-full sm:w-auto px-6 py-3 rounded-neev-md font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover transition-colors"
          >
            View Live Neev Page
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-neev-md font-semibold text-neev-charcoal bg-neev-ivory-subtle hover:bg-neev-ivory-border border border-neev-ivory-border transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Wizard Step Indicator */}
      <WizardProgress
        currentStep={currentStep}
        totalSteps={4}
        steps={WIZARD_STEPS}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
      />

      {/* Step Components */}
      <div className="mt-8">
        {currentStep === 1 && (
          <StepCategory
            selectedCategory={formData.category}
            onSelectCategory={(cat) => handleFieldChange('category', cat)}
          />
        )}

        {currentStep === 2 && (
          <StepDetails
            category={formData.category}
            title={formData.title}
            targetAmount={formData.targetAmount}
            eventDate={formData.eventDate}
            story={formData.story}
            coverImageUrl={formData.coverImageUrl}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <StepPrivacy
            category={formData.category}
            title={formData.title}
            visibility={formData.visibility}
            isPinRequired={formData.isPinRequired}
            accessPin={formData.accessPin}
            panNumber={formData.panNumber}
            aadhaarLast4={formData.aadhaarLast4}
            legalFullName={formData.legalFullName}
            vKycStatus={formData.vKycStatus}
            vKycCoordinates={formData.vKycCoordinates}
            proofDocumentType={formData.proofDocumentType}
            proofDocumentName={formData.proofDocumentName}
            bankAccountNumber={formData.bankAccountNumber}
            bankIfsc={formData.bankIfsc}
            bankName={formData.bankName}
            bankBeneficiaryName={formData.bankBeneficiaryName}
            upiVpa={formData.upiVpa}
            bankVerified={formData.bankVerified}
            fraudDeclarationAgreed={formData.fraudDeclarationAgreed}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <StepReview
            category={formData.category}
            title={formData.title}
            targetAmount={formData.targetAmount}
            eventDate={formData.eventDate}
            story={formData.story}
            coverImageUrl={formData.coverImageUrl}
            visibility={formData.visibility}
            isPinRequired={formData.isPinRequired}
            legalFullName={formData.legalFullName}
            panNumber={formData.panNumber}
            proofDocumentName={formData.proofDocumentName}
            vKycStatus={formData.vKycStatus}
            bankVerified={formData.bankVerified}
            agreedToTerms={formData.agreedToTerms}
            onAgreeChange={(agreed) => handleFieldChange('agreedToTerms', agreed)}
            error={errors.agreedToTerms || errors.submit}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-10 pt-6 border-t border-neev-ivory-border flex items-center justify-between max-w-2xl mx-auto">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-neev-md text-sm font-semibold text-neev-charcoal bg-white border border-neev-ivory-border hover:bg-neev-ivory-subtle transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neev-slate hover:text-neev-charcoal transition-colors"
          >
            Cancel
          </Link>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-neev-md text-sm font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-sm hover:shadow-warm-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your Neev...</span>
            </>
          ) : currentStep === 4 ? (
            <>
              <Sparkles className="w-4 h-4 text-neev-amber" />
              <span>Publish & Create Neev</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

