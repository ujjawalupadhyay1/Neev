import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  showCompanySubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem' | 'stacked';
  isDark?: boolean;
}

export function NeevEmblem({
  className = 'w-10 h-9',
  isDark = false,
}: {
  className?: string;
  isDark?: boolean;
}) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      <img
        src="/brand/neev-emblem-transparent.png"
        alt="Neev Foundation & Blessings Emblem"
        className={cn(
          'w-full h-full object-contain select-none pointer-events-none drop-shadow-sm',
          isDark && 'brightness-110 contrast-105'
        )}
        loading="eager"
      />
    </div>
  );
}

// Side aesthetic double-line bars
function AestheticBars({
  size = 'md',
  isDark = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
}) {
  const barSizes = {
    sm: 'w-3.5 h-[2.5px]',
    md: 'w-5 h-[3px]',
    lg: 'w-7 h-[4px]',
    xl: 'w-10 h-[5px]',
  };

  const gapSizes = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
    xl: 'gap-2.5',
  };

  return (
    <div className={cn('flex flex-col justify-center select-none', gapSizes[size])}>
      <span className={cn('rounded-full bg-neev-amber block', barSizes[size])} />
      <span className={cn('rounded-full bg-neev-amber block', barSizes[size])} />
    </div>
  );
}

export function Logo({
  className,
  showTagline = false,
  showCompanySubtitle = false,
  size = 'md',
  variant = 'full',
  isDark = false,
}: LogoProps) {
  const emblemSizes = {
    sm: 'w-8 h-7',
    md: 'w-11 h-10',
    lg: 'w-16 h-14',
    xl: 'w-28 h-24',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  if (variant === 'emblem') {
    return (
      <Link href="/" className={cn('inline-block group', className)}>
        <NeevEmblem
          className={cn(emblemSizes[size], 'transition-transform duration-200 group-hover:scale-105')}
          isDark={isDark}
        />
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link
        href="/"
        className={cn('inline-flex flex-col items-center text-center group select-none', className)}
      >
        <NeevEmblem
          className={cn(emblemSizes[size], 'transition-transform duration-200 group-hover:scale-105')}
          isDark={isDark}
        />

        {/* Wordmark with Aesthetic Side Bars: = Neev = */}
        <div className="flex items-center gap-3 mt-3">
          <AestheticBars size={size} isDark={isDark} />

          <span
            className={cn(
              'font-extrabold tracking-tight font-sans select-none',
              textSizes[size],
              isDark ? 'text-white' : 'text-neev-forest-800'
            )}
          >
            Neev
          </span>

          <AestheticBars size={size} isDark={isDark} />
        </div>

        {showCompanySubtitle && (
          <p
            className={cn(
              'text-[11px] mt-2 font-medium tracking-wide',
              isDark ? 'text-neev-forest-100/70' : 'text-neev-slate'
            )}
          >
            by Upadhyay Technologies Private Limited
          </p>
        )}

        {showTagline && (
          <div className="mt-2 space-y-0.5">
            <p className={cn('text-xs font-medium', isDark ? 'text-neev-forest-100' : 'text-neev-slate')}>
              Building the foundation of dreams
            </p>
            <p className={cn('text-xs font-medium', isDark ? 'text-neev-forest-100' : 'text-neev-slate')}>
              through the blessings of your own
            </p>
          </div>
        )}
      </Link>
    );
  }

  // Full Horizontal (default for navbar & header)
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-3 group select-none', className)}
    >
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <NeevEmblem className={emblemSizes[size]} isDark={isDark} />
      </div>

      <div className="flex flex-col">
        {/* Wordmark with Aesthetic Side Bars: = Neev = */}
        <div className="flex items-center gap-2">
          <AestheticBars size={size} isDark={isDark} />

          <span
            className={cn(
              'font-extrabold tracking-tight font-sans transition-colors',
              textSizes[size],
              isDark ? 'text-white' : 'text-neev-forest-800 group-hover:text-neev-forest-900'
            )}
          >
            Neev
          </span>

          <AestheticBars size={size} isDark={isDark} />

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3DC] text-neev-forest-900 border border-[#F2D48E] shadow-warm-sm ml-1">
            ₹0 Fee
          </span>
        </div>

        {showCompanySubtitle ? (
          <span className="text-[10px] text-neev-slate font-medium hidden sm:block leading-tight mt-0.5">
            by Upadhyay Technologies Private Limited
          </span>
        ) : showTagline ? (
          <span className="text-[11px] text-neev-slate font-medium hidden sm:block leading-tight mt-0.5">
            Apno Ke Aashirvaad Se, Sapno Ki Neev
          </span>
        ) : null}
      </div>
    </Link>
  );
}
