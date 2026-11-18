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
  Banknote,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section — Tightened above-the-fold layout */}
      <section className="relative overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-12 bg-warm-mesh border-b border-neev-ivory-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
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
              A universal wishlist and milestone contribution platform. Pool contributions for every dream, milestone, project, or celebration with zero fees and complete privacy.
            </p>
          </div>

          {/* Primary CTA Buttons */}
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
                  100% of every contribution settles directly into your bank account. Zero cuts, zero commissions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
              <div className="p-2 rounded-neev-sm bg-neev-forest-50 text-neev-forest shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-neev-charcoal">Direct Bank Settlement</h2>
                <p className="text-xs text-neev-slate mt-0.5">
                  Powered by Indian UPI rails. Neev never holds user funds — direct to your verified bank.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-neev-md bg-white border border-neev-ivory-border shadow-warm-sm flex items-start gap-3">
              <div className="p-2 rounded-neev-sm bg-neev-forest-50 text-neev-forest shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-neev-charcoal">100% Private Ledger</h2>
                <p className="text-xs text-neev-slate mt-0.5">
                  Individual contribution amounts are strictly confidential and visible only in your private creator ledger.
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
            Every Wish & Milestone
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neev-charcoal">
            Built for Every Dream You Want to Achieve
          </h2>
          <p className="text-xs sm:text-sm text-neev-slate leading-relaxed">
            From personal aspirations and creative projects to education, home foundations, and life milestones — invite contributions for every wish with direct UPI and ₹0 platform fee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              key: 'universal',
              title: 'Universal Dreams',
              badge: '🌱 Any Wish',
              tagline: 'Personal Aspirations & Goals',
              description:
                'Whatever foundation you are building, create a personal wish pool and receive unconditional contributions and blessings from those who believe in you.',
              highlights: ['Shareable Link & QR', 'Optional 4-Digit PIN', 'Direct Bank Settlement'],
              icon: <Compass className="w-6 h-6 text-neev-charcoal" />,
              ctaLabel: 'Start a Wish Pool',
              badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
            },
            {
              key: 'education',
              title: 'Education & Career',
              badge: '🎓 Education',
              tagline: 'Academic Grants & Tools',
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
                'Celebrate life’s major chapters. Rally collective support for your first home down payment, parenthood, family relocations, or special milestones.',
              highlights: ['First Home Down Payment', 'Collective Family Love', 'CA Audit Ledger'],
              icon: <Sparkles className="w-6 h-6 text-neev-amber" />,
              ctaLabel: 'Start Milestone Pool',
              badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
            },
            {
              key: 'wedding',
              title: 'Celebrations & Nuptials',
              badge: '💍 Celebrations',
              tagline: 'Aashirvaad & Blessings',
              description:
                'Invite loved ones to contribute directly into your bank via UPI, replacing awkward cash envelopes and redundant boxed gifts.',
              highlights: ['Direct UPI Contributions', 'Confidential Gift Amounts', '1-Page PDF Receipt'],
              icon: <HeartHandshake className="w-6 h-6 text-neev-terracotta" />,
              ctaLabel: 'Start Celebration Pool',
              badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
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
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeBg}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-neev-charcoal group-hover:text-neev-forest-800 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-neev-forest-700">{cat.tagline}</p>
                  <p className="text-xs text-neev-slate leading-relaxed pt-1">{cat.description}</p>
                </div>

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
              Create Your Wish Pool
            </h3>
            <p className="text-xs text-neev-slate leading-relaxed">
              Choose your goal or category, set your target amount in ₹, and share your vision. Takes under 2 minutes.
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
              Keep it private with an optional 4-digit PIN for close circles, or list publicly to reach supporters everywhere.
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
              Supporters pay seamlessly via GPay, PhonePe, or Paytm. Funds route straight to your bank account with ₹0 platform fee.
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
              Individual contribution amounts stay 100% confidential. Contributors receive 1-page PDF receipts with NPCI UTR numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-10 rounded-neev-xl bg-neev-forest text-white text-center space-y-6 shadow-warm-xl relative overflow-hidden">
          <Logo variant="stacked" size="md" isDark={true} showCompanySubtitle={false} className="mx-auto relative z-10" />
          <div className="space-y-2 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to build the foundation for your dream?
            </h2>
            <p className="text-neev-forest-100 text-sm max-w-xl mx-auto">
              Create your wish pool in under 2 minutes. Receive direct UPI contributions with zero platform fee.
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
