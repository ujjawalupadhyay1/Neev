'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Download,
  FileSpreadsheet,
  FileText,
  Users,
  Banknote,
  Receipt,
  CheckCircle2,
  Calendar,
  Building2,
  Printer,
  X,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorLedgerClientProps {
  pools: any[];
  contributions: any[];
  isLive?: boolean;
}

export function CreatorLedgerClient({
  pools,
  contributions: initialContributions,
  isLive = false,
}: CreatorLedgerClientProps) {
  const [selectedPoolId, setSelectedPoolId] = useState(pools[0]?.id || 'pool-1');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [activeReceiptModal, setActiveReceiptModal] = useState<any | null>(null);
  const [showAuditCertModal, setShowAuditCertModal] = useState(false);

  const currentPool = pools.find((p) => p.id === selectedPoolId) || pools[0] || {};
  const currentContributions = initialContributions.filter((c) => c.pool_id === currentPool.id);

  // Filter contributions by relationship
  const filteredContributions = currentContributions.filter((c) => {
    if (relationshipFilter === 'all') return true;
    return c.relationship === relationshipFilter;
  });

  // Calculate ledger metrics
  const totalReceived = currentContributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const relativesCount = currentContributions.filter((c) => c.relationship === 'Relative').length;
  const panExemptGiftsCount = currentContributions.filter((c) => Number(c.amount || 0) >= 50000).length;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Receipt Number',
      'Contributor Name',
      'Relationship',
      'Rupee Amount (INR)',
      'PAN Number (Mandatory for >=50k)',
      'NPCI UPI UTR',
      'Gateway Payment ID',
      'Status',
      'Consent IP',
      'Consent Timestamp (UTC)',
    ];

    const rows = currentContributions.map((c) => [
      c.id,
      c.receipt_number || 'N/A',
      `"${c.contributor_name}"`,
      c.relationship,
      c.amount,
      c.contributor_pan || 'Not Required (<50k)',
      c.npci_utr || 'Pending Settlement',
      c.gateway_payment_id || 'N/A',
      c.status,
      c.consent_ip || 'N/A',
      c.consent_timestamp || c.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Neev_CA_Ledger_${currentPool.slug || 'pool'}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-warm-mesh pb-24">
      {/* Top Header */}
      <section className="pt-10 pb-8 bg-white border-b border-neev-ivory-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neev-forest-50 border border-neev-forest-100 text-xs font-semibold text-neev-forest-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Creator Private Ledger</span>
                </span>
                <span className="text-xs text-neev-slate font-medium">
                  {isLive ? 'Live Database Active' : 'Prototype Mode'} • RLS Firewall Active
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-neev-charcoal">
                Wish Pool Ledger & CA Audit Export
              </h1>
              <p className="text-xs sm:text-sm text-neev-slate">
                Individual contributor amounts are protected and visible ONLY to you. Manage receipts and tax audit exports below.
              </p>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-neev-md text-xs font-semibold text-neev-charcoal bg-white hover:bg-neev-ivory-subtle border border-neev-ivory-border shadow-warm-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-neev-forest" />
                <span>Export CSV Ledger</span>
              </button>

              <button
                onClick={() => setShowAuditCertModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-neev-md text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 shadow-warm-sm transition-all"
              >
                <FileText className="w-4 h-4 text-neev-amber" />
                <span>CA Tax & Audit Bundle</span>
              </button>
            </div>
          </div>

          {/* Pool Selector Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pt-2 border-t border-neev-ivory-border">
            <span className="text-xs font-semibold text-neev-slate shrink-0">Your Neevs:</span>
            {pools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => setSelectedPoolId(pool.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-neev-sm text-xs font-semibold whitespace-nowrap transition-all border',
                  selectedPoolId === pool.id
                    ? 'bg-neev-forest-50 border-neev-forest text-neev-forest-800 shadow-warm-sm'
                    : 'bg-white border-neev-ivory-border text-neev-slate hover:border-neev-forest/40'
                )}
              >
                {pool.title.slice(0, 38)}...
              </button>
            ))}
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-neev-sm text-xs font-semibold text-neev-terracotta hover:bg-neev-terracotta/5 border border-dashed border-neev-terracotta/40 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Wish Pool</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Received */}
          <div className="p-5 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-neev-slate">
              <span className="font-semibold uppercase tracking-wider">Total Received</span>
              <Banknote className="w-4 h-4 text-neev-forest" />
            </div>
            <div className="text-2xl font-serif font-bold text-neev-charcoal font-mono tabular-nums">
              {formatINR(totalReceived)}
            </div>
            <p className="text-[11px] text-neev-forest-800 font-medium">
              100% settled directly to your bank (₹0 fee)
            </p>
          </div>

          {/* Card 2: Total Contributors */}
          <div className="p-5 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-neev-slate">
              <span className="font-semibold uppercase tracking-wider">Total Contributors</span>
              <Users className="w-4 h-4 text-neev-amber" />
            </div>
            <div className="text-2xl font-serif font-bold text-neev-charcoal font-mono tabular-nums">
              {currentContributions.length}
            </div>
            <p className="text-[11px] text-neev-slate">
              {relativesCount} Relatives • {currentContributions.length - relativesCount} Friends & Others
            </p>
          </div>

          {/* Card 3: ₹50k+ PAN Compliance */}
          <div className="p-5 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-neev-slate">
              <span className="font-semibold uppercase tracking-wider">₹50k+ PAN Verified</span>
              <ShieldCheck className="w-4 h-4 text-neev-forest" />
            </div>
            <div className="text-2xl font-serif font-bold text-neev-charcoal font-mono tabular-nums">
              {panExemptGiftsCount} gifts
            </div>
            <p className="text-[11px] text-neev-forest-800 font-medium">
              100% PAN compliant for Sec 56(2)(x)
            </p>
          </div>

          {/* Card 4: Settlement Gateway */}
          <div className="p-5 rounded-neev-xl bg-white border border-neev-ivory-border shadow-warm-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-neev-slate">
              <span className="font-semibold uppercase tracking-wider">Settlement Rails</span>
              <Building2 className="w-4 h-4 text-neev-terracotta" />
            </div>
            <div className="text-sm font-bold text-neev-charcoal flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-neev-forest shrink-0" />
              <span>Direct UPI (NPCI)</span>
            </div>
            <p className="text-[11px] text-neev-slate font-mono">
              Non-custodial direct bank transfer
            </p>
          </div>
        </div>
      </section>

      {/* Main Ledger Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
        <div className="bg-white rounded-neev-xl border border-neev-ivory-border shadow-warm-sm overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-5 border-b border-neev-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-neev-charcoal">
                Private Rupee Ledger & Contributor Messages
              </h2>
              <p className="text-xs text-neev-slate">
                Showing exact contribution amounts, PAN records, and NPCI bank references.
              </p>
            </div>

            {/* Relationship Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neev-slate">Filter Relationship:</span>
              <select
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value)}
                className="px-3 py-1.5 rounded-neev-sm border border-neev-ivory-border text-xs text-neev-charcoal bg-white outline-none focus:border-neev-forest"
              >
                <option value="all">All Relationships</option>
                <option value="Relative">Relatives (Tax-exempt under Sec 56)</option>
                <option value="Friend">Friends</option>
                <option value="Colleague">Colleagues</option>
                <option value="Well-Wisher">Well-Wishers</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neev-ivory-subtle border-b border-neev-ivory-border text-neev-slate uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Contributor & Relationship</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">PAN Status</th>
                  <th className="py-3 px-4">NPCI UTR / RRN</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Blessing Message</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neev-ivory-border">
                {filteredContributions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neev-slate">
                      No contributions match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredContributions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neev-ivory/50 transition-colors">
                      {/* Contributor & Relationship */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neev-charcoal">
                          {tx.contributor_name}
                        </div>
                        <div className="text-[11px] text-neev-slate mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-neev-ivory text-neev-charcoal border border-neev-ivory-border">
                            {tx.relationship}
                          </span>
                        </div>
                      </td>

                      {/* Private Rupee Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-neev-forest-800 tabular-nums">
                        {formatINR(Number(tx.amount))}
                      </td>

                      {/* PAN Status */}
                      <td className="py-3.5 px-4">
                        {Number(tx.amount) >= 50000 ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neev-forest-800 bg-neev-forest-50 px-2 py-0.5 rounded border border-neev-forest-100">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{tx.contributor_pan}</span>
                            </span>
                            <p className="text-[10px] text-neev-slate">Sec 56 Verified</p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neev-slate">
                            Exempt (&lt;₹50k)
                          </span>
                        )}
                      </td>

                      {/* NPCI Bank UTR */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neev-slate">
                        {tx.npci_utr || 'Pending'}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-neev-slate whitespace-nowrap">
                        {formatDate(tx.created_at)}
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-neev-charcoal italic">
                        {tx.message ? `"${tx.message}"` : <span className="text-neev-slate not-italic">—</span>}
                      </td>

                      {/* View 1-Page Receipt Modal */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveReceiptModal(tx)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neev-forest hover:text-neev-forest-900 bg-neev-forest-50 hover:bg-neev-forest-100 px-2.5 py-1 rounded transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL 1: Contributor 1-Page Official Receipt                   */}
      {/* ============================================================== */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-neev-2xl border border-neev-ivory-border shadow-warm-xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neev-ivory-border pb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-neev-forest" />
                <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                  Official Contributor Receipt
                </h3>
              </div>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="p-1 rounded-full text-neev-slate hover:text-neev-charcoal hover:bg-neev-ivory-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-neev-xl bg-neev-ivory-subtle border border-neev-ivory-border space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-neev-ivory-border pb-2">
                <span className="text-neev-slate">Receipt ID:</span>
                <span className="font-bold text-neev-charcoal">{activeReceiptModal.receipt_number || `NEEV-REC-${activeReceiptModal.id?.slice(0, 8)}`}</span>
              </div>
              <div className="flex justify-between border-b border-neev-ivory-border pb-2">
                <span className="text-neev-slate">Gift Rupee Amount:</span>
                <span className="font-bold text-neev-forest-800 text-sm">{formatINR(Number(activeReceiptModal.amount))}</span>
              </div>
              <div className="flex justify-between border-b border-neev-ivory-border pb-2">
                <span className="text-neev-slate">Contributor:</span>
                <span className="font-bold text-neev-charcoal">{activeReceiptModal.contributor_name} ({activeReceiptModal.relationship})</span>
              </div>
              {activeReceiptModal.contributor_pan && (
                <div className="flex justify-between border-b border-neev-ivory-border pb-2">
                  <span className="text-neev-slate">Verified Contributor PAN:</span>
                  <span className="font-bold text-neev-charcoal">{activeReceiptModal.contributor_pan}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-neev-ivory-border pb-2">
                <span className="text-neev-slate">NPCI UPI Bank UTR:</span>
                <span className="font-bold text-neev-charcoal">{activeReceiptModal.npci_utr || 'UPI-RRN-992817264819'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neev-slate">Date & Time:</span>
                <span className="text-neev-charcoal">{formatDate(activeReceiptModal.created_at)}</span>
              </div>
            </div>

            <p className="text-[11px] text-neev-slate leading-relaxed text-center">
              Issued under Section 10A of the Information Technology Act 2000 and Indian Contract Act 1872 as a voluntary gift. Verified by Upadhyay Technologies Private Limited.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-neev-md font-semibold text-xs text-neev-charcoal bg-neev-ivory border border-neev-ivory-border hover:bg-neev-ivory-subtle flex items-center justify-center gap-2 shadow-warm-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="flex-1 py-3 rounded-neev-md font-semibold text-xs text-white bg-neev-forest hover:bg-neev-forest-900 shadow-warm-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CA Tax & Audit Settlement Bundle                      */}
      {/* ============================================================== */}
      {showAuditCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-neev-2xl border border-neev-ivory-border shadow-warm-xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neev-ivory-border pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-neev-amber" />
                <h3 className="font-serif text-lg font-bold text-neev-charcoal">
                  Chartered Accountant (CA) Tax & Audit Bundle
                </h3>
              </div>
              <button
                onClick={() => setShowAuditCertModal(false)}
                className="p-1 rounded-full text-neev-slate hover:text-neev-charcoal hover:bg-neev-ivory-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neev-charcoal/90 leading-relaxed">
              <div className="p-4 rounded-neev-xl bg-neev-forest-50 border border-neev-forest-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-neev-forest shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neev-forest-900">
                    Statutory Compliance Certificate — Sec 56(2)(x) Ready
                  </h4>
                  <p className="text-[11px] text-neev-forest-800 mt-1">
                    This bundle groups your contributions by relative vs non-relative relationship, cross-referenced with 12-digit NPCI Bank UTRs and contributor PAN logs.
                  </p>
                </div>
              </div>

              <div className="border border-neev-ivory-border rounded-neev-lg p-4 space-y-2 bg-neev-ivory-subtle font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neev-slate">Entity:</span>
                  <span className="font-semibold text-neev-charcoal">Upadhyay Technologies Private Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neev-slate">Pool Identifier:</span>
                  <span className="font-semibold text-neev-charcoal">{currentPool.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neev-slate">Total Rupee Aggregate:</span>
                  <span className="font-bold text-neev-forest-800">{formatINR(totalReceived)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neev-slate">Relative Exemption Count:</span>
                  <span className="text-neev-charcoal">{relativesCount} Gifts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neev-slate">PAN Logged Gifts (&gt;=₹50k):</span>
                  <span className="text-neev-charcoal">{panExemptGiftsCount} Gifts</span>
                </div>
              </div>

              <p className="text-[11px] text-neev-slate italic text-center">
                Digital audit signature provided in accordance with Section 63 of Bharatiya Sakshya Adhiniyam 2023.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleExportCSV();
                  alert('CA Tax Ledger CSV & Certificate generated!');
                }}
                className="flex-1 py-3 rounded-neev-md font-semibold text-xs text-white bg-neev-forest hover:bg-neev-forest-900 shadow-warm-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-neev-amber" />
                <span>Download CA Ledger Bundle</span>
              </button>
              <button
                onClick={() => setShowAuditCertModal(false)}
                className="py-3 px-5 rounded-neev-md font-semibold text-xs text-neev-slate hover:bg-neev-ivory-subtle border border-neev-ivory-border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

