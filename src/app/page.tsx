import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Compass,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Banknote,
  Gift,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section — Tightened above-the-fold layout */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:pt-6 sm:pb-12 bg-warm-mesh border-b border-neev-ivory-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          {/* High-Contrast Trust Pill: White text on Deep Forest Green */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neev-forest text-white shadow-warm-sm text-[11px] sm:text-xs font-semibold animate-fade-in border border-neev-forest-900/40">
            <span className="w-2 h-2 rounded-full bg-neev-amber animate-pulse shrink-0" />
            <span>100% Free • Direct Indian UPI Rails • Non-Custodial</span>
          </div>

          {/* Official Neev Emblem Hero Presentation */}
          <div className="py-0.5 flex justify-center">
            <Logo variant="stacked" size="md" showTagline={false} showCompanySubtitle={false} />
          </div>

          {/* Master Tagline & Title */}
          <div className="space-y-1 max-w-3xl mx-auto">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-4.5xl font-bold text-neev-charcoal tracking-tight leading-tight">
              Building the foundation of dreams through the blessings of your own.
            </h1>
            <p className="font-serif text-sm sm:text-lg text-neev-forest-800 italic font-medium">
              &ldquo;Apno Ke Aashirvaad Se, Sapno Ki Neev&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-neev-slate max-w-xl mx-auto pt-1 leading-relaxed">
              A universal Indian social wishlist and group-gifting platform. Pool contributions for weddings, higher education, and personal dreams with zero fees and complete privacy.
            </p>
          </div>

          {/* Primary CTA Buttons (Both above the fold on desktop and mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-neev-md text-sm font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-md hover:shadow-warm-lg transition-all"
            >
              <span>Start a Wish Pool (₹0 Fee)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-neev-md text-sm font-semibold text-neev-forest-800 bg-white/90 hover:bg-neev-forest-50 border-2 border-neev-forest shadow-warm-sm transition-all"
            >
              <span>Explore Public Dreams</span>
              <ArrowRight className="w-4 h-4 text-neev-forest" />
            </Link>
          </div>

          {/* Core Trust Pillars */}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
              <div className="p-2 rounded-neev-sm bg-neev-forest-50 text-neev-forest shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-neev-charcoal">₹0 Platform Fee</h2>
                <p className="text-xs text-neev-slate mt-0.5">
                  100% of guest shagun & gifts settle directly into your bank account.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
              <div className="p-2 rounded-neev-sm bg-neev-forest-50 text-neev-forest shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-neev-charcoal">Non-Custodial Flow</h2>
                <p className="text-xs text-neev-slate mt-0.5">
                  Powered by RBI/NPCI rails. Neev never holds or pools user funds.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
              <div className="p-2 rounded-neev-sm bg-neev-forest-50 text-neev-forest shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-neev-charcoal">Private Contributor Amounts</h2>
                <p className="text-xs text-neev-slate mt-0.5">
                  Individual rupee gifts are strictly confidential and creator-only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Milestones Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-neev-forest-800">
            Lifelong Milestones
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neev-charcoal">
            Designed for Life’s Greatest Beginnings
          </h2>
          <p className="text-xs sm:text-sm text-neev-slate leading-relaxed">
            From sacred wedding shagun to college tuition and first home down payments — celebrate every turning point with direct UPI blessings and ₹0 platform fee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              key: 'wedding',
              title: 'Weddings & Nuptials',
              badge: '💍 Weddings',
              tagline: 'Aashirvaad & Shagun',
              description:
                'Invite loved ones to send traditional shagun directly into your bank via UPI, replacing awkward cash envelopes and redundant boxed gifts.',
              highlights: ['Direct UPI Shagun', 'Confidential Rupee Gifts', '1-Page PDF Receipt'],
              icon: <HeartHandshake className="w-6 h-6 text-neev-terracotta" />,
              ctaLabel: 'Start Wedding Shagun',
              badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
            },
            {
              key: 'education',
              title: 'Education & Career',
              badge: '🎓 Education',
              tagline: 'Academic Grants & Laptops',
              description:
                'Empower your learning goals. Pool support from family, mentors, and well-wishers for tuition, study laptops, thesis workstations, or entrance fees.',
              highlights: ['Laptops & Tuition Funds', 'Direct Student Grants', '100% Free for Students'],
              icon: <GraduationCap className="w-6 h-6 text-neev-forest" />,
              ctaLabel: 'Start Education Fund',
              badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            },
            {
              key: 'milestone',
              title: 'Milestones & Home',
              badge: '🏡 Life Milestones',
              tagline: 'Home Foundations & Wishes',
              description:
                'Celebrate life’s major chapters. Rally collective blessings for your first home down payment, parenthood, family relocations, or 30th birthday.',
              highlights: ['First Home Down Payment', 'Collective Family Love', 'CA Audit Ledger'],
              icon: <Sparkles className="w-6 h-6 text-neev-amber" />,
              ctaLabel: 'Start Milestone Pool',
              badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
            },
            {
              key: 'universal',
              title: 'Universal Dreams',
              badge: '🌱 Any Milestone',
              tagline: 'Personal Aspirations',
              description:
                'Whatever foundation you are building, create a personal Neev and receive unconditional support and blessings from those who believe in you.',
              highlights: ['Shareable Link & QR', 'Optional 4-Digit PIN', 'Direct Bank Settlement'],
              icon: <Compass className="w-6 h-6 text-neev-charcoal" />,
              ctaLabel: 'Start a Personal Neev',
              badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
            },
          ].map((cat) => (
            <div
              key={cat.key}
              className="p-6 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-sm hover:shadow-warm-md hover:border-neev-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border w-fit">
                    {cat.icon}
                  </div>
                  <span className={cn('text-[11px] font-semibold px-2.5 py-0.5 rounded-full border', cat.badgeBg)}>
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-neev-charcoal group-hover:text-neev-forest transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-neev-forest-800 mt-0.5">
                    {cat.tagline}
                  </p>
                </div>

                <p className="text-xs text-neev-slate leading-relaxed">
                  {cat.description}
                </p>

                {/* Highlights tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {cat.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neev-ivory text-neev-charcoal border border-neev-ivory-border"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-neev-forest" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/create?category=${cat.key}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-neev-md text-xs font-semibold text-neev-forest-800 bg-neev-forest-50 hover:bg-neev-forest hover:text-white border border-neev-forest-100 transition-all shadow-warm-sm"
                >
                  <span>{cat.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-neev-forest-800">
            Dignified & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neev-charcoal">
            How Neev Works in 4 Simple Steps
          </h2>
          <p className="text-sm text-neev-slate">
            From creation to direct settlement in your verified Indian bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-3">
            <span className="w-8 h-8 rounded-full bg-neev-forest text-white font-serif font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif text-base font-bold text-neev-charcoal">
              Create Your Milestone
            </h3>
            <p className="text-xs text-neev-slate leading-relaxed">
              Choose your category, set your target amount in ₹, and write your story. Takes under 2 minutes.
            </p>
          </div>

          <div className="p-6 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-3">
            <span className="w-8 h-8 rounded-full bg-neev-forest text-white font-serif font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif text-base font-bold text-neev-charcoal">
              Set Privacy & Share
            </h3>
            <p className="text-xs text-neev-slate leading-relaxed">
              Keep it invite-only with an optional 4-digit PIN for family weddings, or list publicly with KYC.
            </p>
          </div>

          <div className="p-6 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-3">
            <span className="w-8 h-8 rounded-full bg-neev-forest text-white font-serif font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif text-base font-bold text-neev-charcoal">
              Direct UPI Settlement
            </h3>
            <p className="text-xs text-neev-slate leading-relaxed">
              Guests pay seamlessly via GPay, PhonePe, or Paytm. Funds route straight to your bank account with ₹0 platform fee.
            </p>
          </div>

          <div className="p-6 rounded-neev-lg bg-white border border-neev-ivory-border shadow-warm-sm space-y-3">
            <span className="w-8 h-8 rounded-full bg-neev-forest text-white font-serif font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="font-serif text-base font-bold text-neev-charcoal">
              Private Ledger & Receipts
            </h3>
            <p className="text-xs text-neev-slate leading-relaxed">
              Individual gift amounts stay 100% confidential. Donors receive 1-page PDF receipts with NPCI UTR numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Below-The-Fold Contextual Brand Sponsors Demonstration */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 rounded-neev-xl bg-neev-ivory-subtle border border-neev-ivory-border text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#E2ECE6] text-neev-forest-900 border border-[#BED4C7] shadow-warm-sm">
            <Gift className="w-3.5 h-3.5 text-neev-terracotta" />
            <span>How We Keep Neev 100% Free For You</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
            Contextual Milestone Brand Grants & Offers
          </h2>
          <p className="text-xs text-neev-slate max-w-xl mx-auto leading-relaxed">
            Neev earns ₹0 from your shagun or gifts. Instead, curated brand partners (MakeMyTrip for travel, Apple/Croma for laptops, Pepperfry for new homes) offer optional discounts below the fold.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-neev-slate/70 font-semibold tracking-wider uppercase">
            <span>MakeMyTrip Travel Grants</span>
            <span>•</span>
            <span>Croma & Apple Campus Offers</span>
            <span>•</span>
            <span>Tanishq Wedding Vouchers</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-10 rounded-neev-xl bg-neev-forest text-white text-center space-y-6 shadow-warm-xl relative overflow-hidden">
          <Logo variant="stacked" size="md" isDark={true} showCompanySubtitle={true} className="mx-auto relative z-10" />
          <div className="space-y-2 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to build the foundation for your dream?
            </h2>
            <p className="text-neev-forest-100 text-sm max-w-xl mx-auto">
              Create your milestone pool in under 2 minutes. Receive direct UPI blessings with zero deduction.
            </p>
          </div>
          <div className="relative z-10">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-neev-md text-sm font-semibold text-neev-forest-900 bg-white hover:bg-neev-ivory shadow-warm-md transition-all"
            >
              <span>Start Your Neev Now (₹0 Fee)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

