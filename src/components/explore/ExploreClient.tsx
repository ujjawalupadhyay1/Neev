'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { EnrichedPool, PoolCategory, PoolVisibility } from '@/types';
import { getCategoryCopy } from '@/lib/category-copy';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Search,
  Globe,
  Lock,
  EyeOff,
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  PlusCircle,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustVerificationModal } from '@/components/brand/TrustVerificationModal';

interface ExploreClientProps {
  initialPools: EnrichedPool[];
}

export function ExploreClient({ initialPools }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | PoolVisibility>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PoolCategory>('all');
  const [selectedTrustPool, setSelectedTrustPool] = useState<EnrichedPool | null>(null);

  const filteredPools = useMemo(() => {
    return initialPools.filter((pool) => {
      // Visibility filter
      if (selectedVisibility !== 'all' && pool.visibility !== selectedVisibility) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && pool.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = pool.title.toLowerCase().includes(query);
        const matchesCreator = pool.creator_name.toLowerCase().includes(query);
        const matchesStory = pool.story.toLowerCase().includes(query);
        return matchesTitle || matchesCreator || matchesStory;
      }
      return true;
    });
  }, [initialPools, searchQuery, selectedVisibility, selectedCategory]);

  return (
    <div className="min-h-screen bg-warm-mesh pb-24">
      {/* Header Banner */}
      <section className="pt-12 pb-10 border-b border-neev-ivory-border bg-neev-ivory/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neev-forest text-white border border-neev-forest-900/40 text-xs font-semibold shadow-warm-sm">
              <Sparkles className="w-3.5 h-3.5 text-neev-amber" />
              <span>Collective Gifting for Life’s Foundations</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neev-charcoal tracking-tight">
              Explore Dreams & Blessings
            </h1>

            <p className="text-sm sm:text-base text-neev-slate leading-relaxed">
              Discover verified public aspirations or enter private invite-only wish pools with your access link or PIN. Every rupee settles directly to the verified creator.
            </p>
          </div>

          {/* Privacy Firewall Callout Banner */}
          <div className="p-4 rounded-neev-lg bg-neev-forest-50 border border-neev-forest-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-neev-forest-800">
              <EyeOff className="w-4 h-4 shrink-0 text-neev-forest-800" />
              <span>
                <strong>Privacy Guaranteed:</strong> Contributor rupee amounts are 100% confidential and visible only to the pool creator in their private ledger.
              </span>
            </div>
            <Link
              href="/legal"
              className="text-neev-forest-800 font-semibold underline hover:text-neev-forest-900 shrink-0"
            >
              DPDP Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="sticky top-16 z-30 bg-neev-ivory/95 backdrop-blur-md border-b border-neev-ivory-border py-4 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neev-slate" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search milestone, dreamer, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-neev-md border border-neev-ivory-border bg-white text-xs sm:text-sm text-neev-charcoal placeholder:text-neev-slate/70 focus:outline-none focus:ring-2 focus:ring-neev-forest focus:border-transparent shadow-warm-sm"
              />
            </div>

            {/* Visibility Mode Switch (Public vs Invite-Only Filter Badges) */}
            <div className="flex items-center p-1 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedVisibility('all')}
                className={cn(
                  'flex-1 md:flex-initial px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold transition-all',
                  selectedVisibility === 'all'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-forest'
                )}
              >
                All Dreams ({initialPools.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedVisibility('public')}
                className={cn(
                  'flex-1 md:flex-initial px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
                  selectedVisibility === 'public'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-forest'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public ({initialPools.filter((p) => p.visibility === 'public').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVisibility('invite_only')}
                className={cn(
                  'flex-1 md:flex-initial px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
                  selectedVisibility === 'invite_only'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-forest'
                )}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Invite-Only ({initialPools.filter((p) => p.visibility === 'invite_only').length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'all', label: 'All Categories', emoji: '✨' },
              { key: 'universal', label: 'Universal Dreams', emoji: '🌱' },
              { key: 'education', label: 'Education & Career', emoji: '🎓' },
              { key: 'milestone', label: 'Milestones & Home', emoji: '🏡' },
              { key: 'wedding', label: 'Weddings & Celebrations', emoji: '💍' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5',
                    isSelected
                      ? 'bg-neev-amber-light text-neev-amber border-neev-amber shadow-warm-sm'
                      : 'bg-white text-neev-charcoal border-neev-ivory-border hover:border-neev-forest-100 hover:text-neev-forest'
                  )}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {initialPools.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-neev-2xl border border-neev-ivory-border shadow-warm-sm max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-neev-forest-50 border border-neev-forest-100 flex items-center justify-center text-neev-forest">
              <Sparkles className="w-8 h-8 text-neev-amber" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-neev-forest-800">
                Fresh Beginnings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
                Be the First to Lay a Neev
              </h2>
              <p className="text-xs sm:text-sm text-neev-slate max-w-md mx-auto leading-relaxed">
                No public wish pools have been created yet. Be the first to start a milestone pool for your education, personal dream, or life milestone and receive direct UPI contributions with ₹0 platform fee.
              </p>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neev-slate pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-neev-forest shrink-0" />
                <span>₹0 Platform Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-neev-forest shrink-0" />
                <span>Direct Bank Settlement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-neev-forest shrink-0" />
                <span>Confidential Contributor Amounts</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-neev-md text-sm font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-md hover:shadow-warm-lg transition-all"
              >
                <span>Start a Wish Pool (₹0 Fee)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : filteredPools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-neev-xl border border-neev-ivory-border p-8 space-y-4">
            <span className="text-4xl">🔍</span>
            <h3 className="font-serif text-xl font-bold text-neev-charcoal">
              No wish pools found
            </h3>
            <p className="text-xs sm:text-sm text-neev-slate max-w-md mx-auto">
              We couldn&apos;t find any wish pools matching your filter or search query. Try switching filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedVisibility('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-neev-md text-xs font-semibold text-neev-forest bg-neev-forest-50 hover:bg-neev-forest-100 border border-neev-forest-100"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => {
              const catCopy = getCategoryCopy(pool.category);
              const raised = pool.stats?.total_raised ?? 0;
              const supporters = pool.stats?.supporter_count ?? 0;
              const progressPct = pool.stats?.progress_percentage ?? (pool.target_amount > 0 ? Math.round((raised / pool.target_amount) * 100) : 0);

              return (
                <div
                  key={pool.id}
                  className="bg-white rounded-neev-xl border border-neev-ivory-border hover:border-neev-forest-100 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Cover photo or gradient header */}
                    <div className="relative h-44 w-full overflow-hidden bg-neev-forest-50">
                      {pool.cover_image_url ? (
                        <img
                          src={pool.cover_image_url}
                          alt={pool.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className={cn(
                            'w-full h-full p-4 flex items-center justify-center text-4xl',
                            catCopy.bannerGradient
                          )}
                        >
                          {catCopy.emoji}
                        </div>
                      )}

                      {/* Visibility & Category Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-neev-charcoal shadow-warm-sm backdrop-blur-sm border border-neev-ivory-border">
                          {catCopy.badgeLabel}
                        </span>
                        {pool.visibility === 'public' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 backdrop-blur-sm">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 backdrop-blur-sm">
                            <Lock className="w-2.5 h-2.5" />
                            <span>PIN Gated</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-4">
                      {/* Creator Info */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pool.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                          alt={pool.creator_name}
                          className="w-8 h-8 rounded-full object-cover border border-neev-ivory-border shrink-0"
                        />
                        <div className="leading-tight flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-semibold text-neev-charcoal truncate flex items-center gap-1">
                              <span>{pool.creator_name}</span>
                              <CheckCircle className="w-3 h-3 text-neev-forest shrink-0" />
                            </p>
                            {(pool.visibility === 'public' || pool.verification_badge === 'v_kyc_verified') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedTrustPool(pool);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-warm-sm shrink-0"
                                title="Click to view full V-KYC and authenticity report"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                <span>V-KYC Verified</span>
                              </button>
                            )}
                          </div>
                          {pool.event_date && (
                            <p className="text-[11px] text-neev-slate flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(pool.event_date)}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <div>
                        <h3 className="font-serif text-lg font-bold text-neev-charcoal group-hover:text-neev-forest transition-colors line-clamp-1">
                          {pool.title}
                        </h3>
                        <p className="text-xs text-neev-slate line-clamp-2 mt-1 leading-relaxed">
                          {pool.story}
                        </p>
                      </div>

                      {/* Progress & Rupee Stats */}
                      <div className="p-3.5 rounded-neev-lg bg-neev-ivory-subtle border border-neev-ivory-border space-y-2">
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-mono font-bold text-neev-charcoal text-sm tabular-nums">
                            {formatINR(raised)}
                          </span>
                          <span className="text-[11px] text-neev-slate">
                            of {formatINR(pool.target_amount)} goal
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-white border border-neev-ivory-border overflow-hidden">
                          <div
                            className="h-full bg-neev-amber transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, progressPct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neev-slate pt-0.5">
                          <span className="font-semibold text-neev-forest-800 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{supporters} {catCopy.supporterMetricLabel}</span>
                          </span>
                          <span className="font-mono font-bold text-neev-charcoal">
                            {progressPct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/pool/${pool.slug}`}
                      className="w-full py-2.5 rounded-neev-md text-xs font-semibold text-neev-forest bg-neev-forest-50 hover:bg-neev-forest hover:text-white border border-neev-forest-100 transition-all flex items-center justify-center gap-1.5 shadow-warm-sm"
                    >
                      <span>
                        {pool.visibility === 'public'
                          ? catCopy.primaryCtaLabel
                          : 'Unlock Private Neev'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Trust & Verification Dossier Modal */}
      {selectedTrustPool && (
        <TrustVerificationModal
          pool={selectedTrustPool}
          onClose={() => setSelectedTrustPool(null)}
        />
      )}
    </div>
  );
}

