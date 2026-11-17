import React from 'react';
import { PoolCategory } from '@/types';
import { CATEGORY_COPY_MAP } from '@/lib/category-copy';
import { CheckCircle2, Sparkles, HeartHandshake, GraduationCap, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCategoryProps {
  selectedCategory: PoolCategory;
  onSelectCategory: (cat: PoolCategory) => void;
}

export function StepCategory({
  selectedCategory,
  onSelectCategory,
}: StepCategoryProps) {
  const categories: { key: PoolCategory; icon: React.ReactNode }[] = [
    {
      key: 'wedding',
      icon: <HeartHandshake className="w-6 h-6 text-neev-terracotta" />,
    },
    {
      key: 'education',
      icon: <GraduationCap className="w-6 h-6 text-neev-forest" />,
    },
    {
      key: 'milestone',
      icon: <Sparkles className="w-6 h-6 text-neev-amber" />,
    },
    {
      key: 'universal',
      icon: <Compass className="w-6 h-6 text-neev-charcoal" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
          What milestone are you laying the foundation for?
        </h2>
        <p className="text-sm text-neev-slate">
          Neev automatically adapts your page language and supporter receipts to match the dignity of your occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-4">
        {categories.map(({ key, icon }) => {
          const config = CATEGORY_COPY_MAP[key];
          const isSelected = selectedCategory === key;

          return (
            <div
              key={key}
              onClick={() => onSelectCategory(key)}
              className={cn(
                'relative p-6 rounded-neev-lg border-2 cursor-pointer transition-all duration-200 text-left bg-white',
                isSelected
                  ? 'border-neev-forest ring-4 ring-neev-forest-50 shadow-warm-md scale-[1.01]'
                  : 'border-neev-ivory-border hover:border-neev-forest/40 hover:shadow-warm-sm'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                      {config.title}
                    </h3>
                    <p className="text-xs text-neev-slate font-medium">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-neev-forest fill-neev-forest-50" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-neev-ivory-border" />
                )}
              </div>

              <p className="mt-4 text-xs text-neev-slate leading-relaxed">
                {config.tagline}
              </p>

              {/* Adaptive UI Preview Badges */}
              <div className="mt-4 pt-3 border-t border-neev-ivory-subtle flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neev-ivory text-neev-charcoal border border-neev-ivory-border">
                  CTA: <strong className="font-semibold text-neev-forest-800">{config.primaryCtaLabel.replace(' (₹0 Fee)', '')}</strong>
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neev-ivory text-neev-charcoal border border-neev-ivory-border">
                  Supporters: <strong className="font-semibold">{config.supporterMetricLabel}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

