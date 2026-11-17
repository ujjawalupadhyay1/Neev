'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_POOLS, EnrichedPool } from '@/lib/mock-data';
import { PoolCategory, PoolVisibility } from '@/types';
import { getCategoryCopy } from '@/lib/category-copy';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Search,
  Globe,
  Lock,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | PoolVisibility>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PoolCategory>('all');

  // Filtered pools calculation
  const filteredPools = useMemo(() => {
    return MOCK_POOLS.filter((pool) => {
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
  }, [searchQuery, selectedVisibility, selectedCategory]);

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
              href="/legal#privacy-dpdp"
              className="text-neev-forest-800 font-semibold underline hover:text-neev-forest-900 shrink-0"
            >
              DPDP Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="sticky top-20 z-30 bg-neev-ivory/95 backdrop-blur-md border-b border-neev-ivory-border py-4 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neev-slate" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dreams, weddings, creators..."
                className="w-full pl-9 pr-4 py-2 rounded-neev-md border border-neev-ivory-border bg-white focus:border-neev-forest focus:ring-2 focus:ring-neev-forest-100 text-xs sm:text-sm text-neev-charcoal outline-none transition-all placeholder:text-neev-slate/70"
              />
            </div>

            {/* Visibility Mode Filter Badges (Primary Request) */}
            <div className="flex items-center gap-1.5 p-1 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedVisibility('all')}
                className={cn(
                  'px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold whitespace-nowrap transition-all',
                  selectedVisibility === 'all'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-charcoal'
                )}
              >
                All Visibility
              </button>

              <button
                type="button"
                onClick={() => setSelectedVisibility('public')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold whitespace-nowrap transition-all',
                  selectedVisibility === 'public'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-charcoal'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Dreams</span>
                <span className="text-[10px] opacity-75 font-normal">(KYC Verified)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVisibility('invite_only')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold whitespace-nowrap transition-all',
                  selectedVisibility === 'invite_only'
                    ? 'bg-neev-forest text-white shadow-warm-sm'
                    : 'text-neev-slate hover:text-neev-charcoal'
                )}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Invite-Only Pools</span>
                <span className="text-[10px] opacity-75 font-normal">(PIN / Secret Link)</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            <span className="text-xs font-semibold text-neev-slate flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>

            {[
              { key: 'all', label: 'All Categories' },
              { key: 'wedding', label: '💍 Weddings (Shagun)' },
              { key: 'education', label: '🎓 Education & Tech' },
              { key: 'milestone', label: '✨ Milestones & Homes' },
              { key: 'universal', label: '🌱 Universal Dreams' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as any)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                  selectedCategory === cat.key
                    ? 'bg-neev-forest-50 border-neev-forest text-neev-forest-800 font-semibold shadow-warm-sm'
                    : 'bg-white border-neev-ivory-border text-neev-slate hover:border-neev-forest/40'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredPools.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-neev-xl border border-neev-ivory-border max-w-lg mx-auto p-8 shadow-warm-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-neev-ivory flex items-center justify-center text-neev-slate">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neev-charcoal">
              No matching wish pools found
            </h3>
            <p className="text-xs text-neev-slate">
              Try adjusting your search keywords, category, or visibility filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedVisibility('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-neev-md text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => {
              const copyConfig = getCategoryCopy(pool.category);

              return (
                <div
                  key={pool.id}
                  className="bg-white rounded-neev-xl border border-neev-ivory-border shadow-warm-sm hover:shadow-warm-md hover:border-neev-forest/40 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Cover / Header */}
                  <div>
                    <div className="relative h-44 w-full bg-neev-ivory-subtle overflow-hidden">
                      <img
                        src={pool.cover_image_url || '/brand/neev-brand-spec.jpg'}
                        alt={pool.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Visibility Badge (Top Left) */}
                      <div className="absolute top-3 left-3">
                        {pool.visibility === 'public' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-neev-forest-800 border border-neev-forest-100 shadow-warm-sm backdrop-blur-sm">
                            <Globe className="w-3 h-3 text-neev-forest" />
                            <span>Public Feed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-neev-charcoal border border-neev-ivory-border shadow-warm-sm backdrop-blur-sm">
                            <Lock className="w-3 h-3 text-neev-amber" />
                            <span>Invite-Only {pool.is_pin_required ? '• 4-Digit PIN' : ''}</span>
                          </span>
                        )}
                      </div>

                      {/* Category Badge (Top Right) */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-neev-charcoal border border-neev-ivory-border shadow-warm-sm backdrop-blur-sm">
                          <span>{copyConfig.emoji}</span>
                          <span>{copyConfig.badgeLabel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-neev-slate pb-1">
                          <span>By {pool.creator_name}</span>
                          {pool.event_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(pool.event_date)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-bold text-neev-charcoal group-hover:text-neev-forest-800 transition-colors line-clamp-2 leading-snug">
                          {pool.title}
                        </h3>

                        <p className="text-xs text-neev-slate mt-2 line-clamp-2 leading-relaxed">
                          {pool.story}
                        </p>
                      </div>

                      {/* Progress & Stats (Strict Privacy Maintained) */}
                      <div className="p-3.5 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono font-bold text-base text-neev-charcoal tabular-nums">
                              {formatINR(pool.stats.total_raised)}
                            </span>
                            <span className="text-[11px] text-neev-slate">
                              of {formatINR(pool.target_amount, { compact: true })}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-neev-forest-800 font-mono tabular-nums">
                            {pool.stats.progress_percentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-white border border-neev-ivory-border overflow-hidden">
                          <div
                            className="h-full bg-neev-amber transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, pool.stats.progress_percentage)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neev-slate pt-0.5">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <strong>{pool.stats.supporter_count}</strong> {copyConfig.supporterMetricLabel}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-neev-slate text-[10px]">
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Amounts private</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer with Category-Adaptive CTA */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/pool/${pool.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-neev-md text-xs font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover transition-colors shadow-warm-sm"
                    >
                      <span>{copyConfig.primaryCtaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

