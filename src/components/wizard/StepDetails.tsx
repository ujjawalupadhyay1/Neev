import React from 'react';
import { PoolCategory } from '@/types';
import { getCategoryCopy } from '@/lib/category-copy';
import { formatINR } from '@/lib/utils';
import { IndianRupee, Calendar, Image as ImageIcon, Sparkles, HelpCircle } from 'lucide-react';
import { ImageUploadDropzone } from '@/components/ui/ImageUploadDropzone';

interface StepDetailsProps {
  category: PoolCategory;
  title: string;
  targetAmount: number;
  eventDate: string;
  story: string;
  coverImageUrl: string;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepDetails({
  category,
  title,
  targetAmount,
  eventDate,
  story,
  coverImageUrl,
  onChange,
  errors,
}: StepDetailsProps) {
  const categoryConfig = getCategoryCopy(category);

  const defaultPresets = [50000, 100000, 250000, 500000, 1000000];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
          Tell your loved ones about your {categoryConfig.badgeLabel}
        </h2>
        <p className="text-sm text-neev-slate">
          Share your aspiration clearly. Supporters love knowing what milestone their blessings are building.
        </p>
      </div>

      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-neev-xl border border-neev-ivory-border shadow-warm-sm">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-neev-charcoal">
              Milestone Title <span className="text-neev-terracotta">*</span>
            </label>
            <span className="text-xs text-neev-slate">
              {title.length}/100
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder={`e.g., ${categoryConfig.sampleTitles[0]}`}
            className="w-full px-4 py-3 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-sm text-neev-charcoal outline-none transition-all"
            maxLength={100}
          />
          {errors.title && (
            <p className="text-xs font-medium text-neev-terracotta">{errors.title}</p>
          )}

          {/* Title Suggestions */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-neev-slate font-medium">Suggestions:</span>
            {categoryConfig.sampleTitles.slice(0, 2).map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange('title', sample)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neev-ivory text-neev-slate hover:text-neev-forest-800 border border-neev-ivory-border transition-colors truncate max-w-[280px]"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neev-charcoal flex items-center justify-between">
            <span>
              Target Amount (₹) <span className="text-neev-terracotta">*</span>
            </span>
            <span className="text-xs font-mono font-medium text-neev-forest-700">
              {formatINR(targetAmount || 0)}
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neev-slate">
              <span className="font-semibold text-base">₹</span>
            </div>
            <input
              type="number"
              value={targetAmount || ''}
              onChange={(e) => onChange('targetAmount', Number(e.target.value))}
              placeholder="e.g., 2,50,000"
              className="w-full pl-9 pr-4 py-3 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-sm font-mono tabular-nums text-neev-charcoal outline-none transition-all"
              min={1000}
              step={1000}
            />
          </div>
          {errors.targetAmount && (
            <p className="text-xs font-medium text-neev-terracotta">{errors.targetAmount}</p>
          )}

          {/* Quick Amount Preset Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-neev-slate font-medium">Quick Presets:</span>
            {defaultPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange('targetAmount', preset)}
                className="text-xs px-2.5 py-1 rounded-full bg-neev-ivory-subtle hover:bg-neev-forest-50 hover:text-neev-forest-800 border border-neev-ivory-border text-neev-charcoal font-medium font-mono tabular-nums transition-colors"
              >
                {formatINR(preset, { compact: true })}
              </button>
            ))}
          </div>
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neev-charcoal flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neev-slate" />
            <span>Target / Event Date (Optional)</span>
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => onChange('eventDate', e.target.value)}
            className="w-full px-4 py-2.5 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-sm text-neev-charcoal outline-none transition-all"
          />
          <p className="text-[11px] text-neev-slate">
            Target milestone date, admission deadline, launch day, or celebration.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-neev-charcoal">
              Your Story & Message to Loved Ones <span className="text-neev-terracotta">*</span>
            </label>
            <button
              type="button"
              onClick={() => onChange('story', categoryConfig.defaultStoryPrompt)}
              className="text-xs text-neev-forest-700 hover:text-neev-forest-900 font-medium inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-neev-amber" />
              Use prompt template
            </button>
          </div>
          <textarea
            value={story}
            onChange={(e) => onChange('story', e.target.value)}
            placeholder={categoryConfig.defaultStoryPrompt}
            rows={4}
            className="w-full px-4 py-3 rounded-neev-md border border-neev-ivory-border focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-sm text-neev-charcoal outline-none transition-all resize-y"
          />
          {errors.story && (
            <p className="text-xs font-medium text-neev-terracotta">{errors.story}</p>
          )}
          <p className="text-[11px] text-neev-slate">
            Minimum 20 characters. Let your friends and relatives know how their support helps lay this foundation.
          </p>
        </div>

        {/* Milestone Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neev-charcoal flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-neev-slate" />
            <span>Upload Milestone Photo or Proof of Dream (Optional)</span>
          </label>
          <ImageUploadDropzone
            value={coverImageUrl}
            onChange={(url) => onChange('coverImageUrl', url)}
            category={category}
          />
        </div>
      </div>
    </div>
  );
}

