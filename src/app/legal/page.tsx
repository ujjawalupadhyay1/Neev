'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LegalHubPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'gifting' | 'privacy' | 'tax'>('terms');

  return (
    <div className="min-h-screen bg-warm-mesh pb-24">
      {/* Header */}
      <section className="pt-12 pb-10 bg-white border-b border-neev-ivory-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neev-forest-50 border border-neev-forest-100 text-xs font-semibold text-neev-forest-800">
            <Scale className="w-3.5 h-3.5 text-neev-forest" />
            <span>Parent Entity: Upadhyay Technologies Private Limited (India)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neev-charcoal tracking-tight">
            Neev Legal Hub & Compliance Policy
          </h1>

          <p className="text-sm sm:text-base text-neev-slate max-w-3xl leading-relaxed">
            Neev is operated under Indian statutory law governing technology intermediaries, electronic contracts, voluntary domestic gifts, and digital personal data protection.
          </p>

          {/* Quick Regulatory Citation Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-neev-slate">
            <span className="px-2.5 py-1 rounded bg-neev-ivory border border-neev-ivory-border">
              IT Act 2000 (Sec 79 & 10A)
            </span>
            <span className="px-2.5 py-1 rounded bg-neev-ivory border border-neev-ivory-border">
              Indian Contract Act 1872 (Sec 25)
            </span>
            <span className="px-2.5 py-1 rounded bg-neev-ivory border border-neev-ivory-border">
              DPDP Act 2023
            </span>
            <span className="px-2.5 py-1 rounded bg-neev-ivory border border-neev-ivory-border">
              Income Tax Act (Sec 56(2)(x))
            </span>
            <span className="px-2.5 py-1 rounded bg-neev-ivory border border-neev-ivory-border">
              Bharatiya Sakshya Adhiniyam 2023
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sidebar Navigation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="md:col-span-1 space-y-2 sticky top-28 self-start">
            <button
              onClick={() => setActiveTab('terms')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-neev-md text-xs font-semibold transition-all text-left',
                activeTab === 'terms'
                  ? 'bg-neev-forest text-white shadow-warm-sm'
                  : 'bg-white border border-neev-ivory-border text-neev-charcoal hover:bg-neev-ivory'
              )}
            >
              <span>Terms of Service</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('gifting')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-neev-md text-xs font-semibold transition-all text-left',
                activeTab === 'gifting'
                  ? 'bg-neev-forest text-white shadow-warm-sm'
                  : 'bg-white border border-neev-ivory-border text-neev-charcoal hover:bg-neev-ivory'
              )}
            >
              <span>Gift & Contribution Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-neev-md text-xs font-semibold transition-all text-left',
                activeTab === 'privacy'
                  ? 'bg-neev-forest text-white shadow-warm-sm'
                  : 'bg-white border border-neev-ivory-border text-neev-charcoal hover:bg-neev-ivory'
              )}
            >
              <span>DPDP Act Privacy Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('tax')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-neev-md text-xs font-semibold transition-all text-left',
                activeTab === 'tax'
                  ? 'bg-neev-forest text-white shadow-warm-sm'
                  : 'bg-white border border-neev-ivory-border text-neev-charcoal hover:bg-neev-ivory'
              )}
            >
              <span>Income Tax Sec 56(2)(x)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </aside>

          {/* Legal Policy Content */}
          <main className="md:col-span-3 bg-white p-6 sm:p-10 rounded-neev-xl border border-neev-ivory-border shadow-warm-sm space-y-8 text-xs sm:text-sm text-neev-charcoal leading-relaxed">
            {/* TAB 1: Terms of Service */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <div className="border-b border-neev-ivory-border pb-4">
                  <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
                    Terms of Service & Electronic Contracts
                  </h2>
                  <p className="text-xs text-neev-slate mt-1">
                    Effective Date: November 2026 | Version: v1.0-2024
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    1. Intermediary Status & Safe Harbour (IT Act 2000 Section 79)
                  </h3>
                  <p>
                    The Neev platform (&ldquo;Platform&rdquo;) is owned and operated by <strong>Upadhyay Technologies Private Limited</strong>, an incorporated Indian company. Neev functions exclusively as an electronic marketplace intermediary under Section 2(1)(w) and Section 79 of the Information Technology Act 2000. Neev does not initiate transactions, hold custody of funds, select recipients, or modify transferred content.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    2. Enforceability of Electronic Contracts (Section 10A)
                  </h3>
                  <p>
                    All declarations, clickwrap confirmations, and consent agreements executed on the Platform constitute valid and enforceable electronic contracts under Section 10A of the Information Technology Act 2000 and are admissible as primary electronic records under Section 63 of the Bharatiya Sakshya Adhiniyam 2023.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    3. Non-Custodial Direct Settlement Architecture
                  </h3>
                  <p>
                    Neev NEVER holds, pools, or intermediates user funds in any internal bank account. Contributions are processed strictly via RBI-licensed payment aggregators (e.g., Razorpay Route, Cashfree Easy Split) directly settling into the KYC-verified bank account of the wish pool creator.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    4. Dispute Resolution & Arbitration
                  </h3>
                  <p>
                    Any disputes arising out of platform usage shall be referred to sole arbitration in New Delhi under the Arbitration and Conciliation Act 1996, conducted in English.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Gift Policy */}
            {activeTab === 'gifting' && (
              <div className="space-y-6">
                <div className="border-b border-neev-ivory-border pb-4">
                  <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
                    Indian Domestic Gift & Contribution Policy
                  </h2>
                  <p className="text-xs text-neev-slate mt-1">
                    Governed by Section 25 of the Indian Contract Act 1872
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    1. Voluntary Nature & Irrevocability
                  </h3>
                  <p>
                    Every contribution made through Neev represents an unconditional, voluntary domestic gift executed out of natural love, affection, or community goodwill under Section 25 of the Indian Contract Act 1872. Once settled over the Unified Payments Interface (UPI) rail, gifts are final, non-refundable, and irrevocable.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    2. No Investment, Return, or Commercial Exchange
                  </h3>
                  <p>
                    Neev is strictly NOT a crowdfunding platform for equity, debt, interest, loans, collective investment schemes (CIS), or commercial pre-orders. Contributors receive zero financial returns, products, or consideration.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    3. FEMA & FCRA Domestic Currency Restriction
                  </h3>
                  <p>
                    In strict compliance with the Foreign Exchange Management Act 1999 (FEMA) and Foreign Contribution (Regulation) Act 2010 (FCRA), contributions on Neev are restricted strictly to <strong>domestic Indian Rupee (INR) bank accounts and Indian UPI rails</strong>. Foreign cards and overseas remittances are strictly disabled.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: DPDP Privacy Policy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="border-b border-neev-ivory-border pb-4">
                  <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
                    DPDP Act 2023 Privacy Policy & Creator Firewall
                  </h2>
                  <p className="text-xs text-neev-slate mt-1">
                    Digital Personal Data Protection Act 2023 Compliance
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    1. Strict Privacy Rule & Database Firewall
                  </h3>
                  <p>
                    <strong>Individual contributor rupee amounts are strictly hidden from the public</strong> and all other guests. The public view exposes exclusively the aggregate total raised, target amount, supporter count, and public messages. Rupee amounts and donor contact details are accessible solely by the creator in their private authenticated ledger.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    2. Data Fiduciary & Data Principal Rights
                  </h3>
                  <p>
                    Upadhyay Technologies Private Limited acts as Data Fiduciary. Users retain the right to access, correct, update, and request erasure of personal data, subject to statutory retention obligations under PMLA 2002 and Income Tax rules.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Income Tax Sec 56(2)(x) */}
            {activeTab === 'tax' && (
              <div className="space-y-6">
                <div className="border-b border-neev-ivory-border pb-4">
                  <h2 className="font-serif text-2xl font-bold text-neev-charcoal">
                    Income Tax Compliance & Section 56(2)(x) Guide
                  </h2>
                  <p className="text-xs text-neev-slate mt-1">
                    Indian Income Tax Act 1961 Guidelines for Wish Creators
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    1. The ₹50,000 Annual Threshold & Mandatory PAN Capture
                  </h3>
                  <p>
                    Under Section 56(2)(x) of the Income Tax Act 1961, gifts received from non-relatives aggregating more than ₹50,000 in a financial year are taxable as &ldquo;Income from Other Sources&rdquo;. Neev dynamically mandates the capture of the contributor’s Permanent Account Number (PAN) for any single contribution of ₹50,000 or greater.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    2. Complete Tax Exemption for Wedding Shagun
                  </h3>
                  <p>
                    Under the specific proviso to Section 56(2)(x), <strong>gifts and shagun received by an individual on the occasion of marriage are 100% tax-free without any upper rupee limit</strong>, regardless of whether the donor is a relative or non-relative.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-neev-charcoal">
                    3. Defined Relative Exemption
                  </h3>
                  <p>
                    Gifts received from defined &ldquo;Relatives&rdquo; (parents, grandparents, siblings, aunts, uncles, lineal ascendants and descendants) are <strong>completely exempt from tax</strong> for any life milestone. Neev’s CA Tax & Audit Bundle categorizes gifts by relationship to simplify your Chartered Accountant’s return filing.
                  </p>
                </div>
              </div>
            )}

            {/* Corporate Registration Box */}
            <div className="p-4 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border space-y-1 text-xs text-neev-slate">
              <p>
                <strong className="text-neev-charcoal">Corporate Entity:</strong> Upadhyay Technologies Private Limited (India)
              </p>
              <p>
                <strong>Grievance & Legal Officer:</strong> legal@neev.app | Response time: 24 to 48 business hours.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

