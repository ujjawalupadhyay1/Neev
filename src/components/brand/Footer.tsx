import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, HeartHandshake, Lock, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neev-ivory-border bg-neev-ivory-subtle text-neev-charcoal pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neev-ivory-border">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-neev-slate max-w-md leading-relaxed">
              &ldquo;Building the foundation of dreams through the blessings of your own.&rdquo;
            </p>
            <p className="text-xs text-neev-forest-800 font-semibold italic">
              &ldquo;Apno Ke Aashirvaad Se, Sapno Ki Neev&rdquo;
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-neev-slate">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neev-ivory-border">
                <ShieldCheck className="w-3.5 h-3.5 text-neev-forest" />
                Non-Custodial Flow
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neev-ivory-border">
                <Lock className="w-3.5 h-3.5 text-neev-amber" />
                Private Contributor Ledger
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neev-ivory-border">
                <Sparkles className="w-3.5 h-3.5 text-neev-terracotta" />
                ₹0 Platform Fee
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neev-slate">
              Milestone Categories
            </h4>
            <ul className="space-y-2 text-sm text-neev-slate">
              <li>
                <Link href="/create?category=universal" className="hover:text-neev-forest-800 transition-colors">
                  Universal Wishlists & Dreams
                </Link>
              </li>
              <li>
                <Link href="/create?category=education" className="hover:text-neev-forest-800 transition-colors">
                  Education & Academic Goals
                </Link>
              </li>
              <li>
                <Link href="/create?category=milestone" className="hover:text-neev-forest-800 transition-colors">
                  Home Foundations & Milestones
                </Link>
              </li>
              <li>
                <Link href="/create?category=wedding" className="hover:text-neev-forest-800 transition-colors">
                  Weddings & Celebrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neev-slate">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-sm text-neev-slate">
              <li>
                <Link href="/legal" className="hover:text-neev-forest-800 transition-colors">
                  Terms of Service & E-Contracts
                </Link>
              </li>
              <li>
                <Link href="/legal#gifting-policy" className="hover:text-neev-forest-800 transition-colors">
                  Contribution & Gift Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#privacy-dpdp" className="hover:text-neev-forest-800 transition-colors">
                  DPDP Act 2023 Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#tax-compliance" className="hover:text-neev-forest-800 transition-colors">
                  Income Tax Sec 56(2)(x) & ₹50k PAN
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Corporate Declaration */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neev-slate">
          <div>
            <p>
              © {new Date().getFullYear()} <strong className="text-neev-charcoal">Upadhyay Technologies Private Limited</strong> (India). All rights reserved.
            </p>
            <p className="text-[11px] text-neev-slate/80 mt-1">
              Operated under IT Act 2000 (Sec 79 Safe Harbour, Sec 10A E-Contracts), Indian Contract Act 1872 (Sec 25), and RBI Payment Aggregator Guidelines.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for Indian Wishes & Milestones with</span>
            <HeartHandshake className="w-3.5 h-3.5 text-neev-terracotta inline" />
            <span>in Bharat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
