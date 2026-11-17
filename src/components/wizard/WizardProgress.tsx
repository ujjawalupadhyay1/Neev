import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: number; title: string; subtitle: string }[];
  onStepClick?: (step: number) => void;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto px-4">
        {/* Continuous background progress line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[3px] bg-neev-ivory-border -z-0" />
        
        {/* Active progress fill */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-[3px] bg-neev-forest transition-all duration-300 ease-out -z-0"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <button
              key={step.id}
              type="button"
              disabled={isUpcoming}
              onClick={() => onStepClick && onStepClick(step.id)}
              className={cn(
                'relative z-10 flex flex-col items-center group focus:outline-none',
                isUpcoming && 'cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2',
                  isCompleted &&
                    'bg-neev-forest border-neev-forest text-white shadow-warm-sm',
                  isCurrent &&
                    'bg-white border-neev-forest text-neev-forest ring-4 ring-neev-forest-100 shadow-warm-md scale-105',
                  isUpcoming &&
                    'bg-white border-neev-ivory-border text-neev-slate/60'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white stroke-[2.5]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              <span
                className={cn(
                  'absolute -bottom-6 text-xs font-semibold whitespace-nowrap transition-colors',
                  isCurrent && 'text-neev-forest-800',
                  isCompleted && 'text-neev-charcoal',
                  isUpcoming && 'text-neev-slate/60'
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

