import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, PlusCircle } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-warm-mesh flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-neev-2xl border border-neev-ivory-border p-8 shadow-warm-md text-center space-y-6">
        <div className="flex justify-center">
          <Logo variant="full" size="sm" showCompanySubtitle={false} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neev-forest-800">
            404 — Not Found
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
            Wish Pool Not Found
          </h1>
          <p className="text-xs sm:text-sm text-neev-slate leading-relaxed">
            This wish pool may have ended, moved, or requires a direct invitation link from the creator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-neev-md text-xs font-semibold text-neev-forest-800 bg-neev-forest-50 hover:bg-neev-forest hover:text-white border border-neev-forest-100 transition-all shadow-warm-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Dreams</span>
          </Link>

          <Link
            href="/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-neev-md text-xs font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover transition-all shadow-warm-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start a Wish Pool</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
