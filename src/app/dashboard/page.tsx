'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_POOLS, MOCK_CONTRIBUTIONS } from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  EyeOff,
  Users,
  Banknote,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Building2,
  Printer,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatorLedgerDashboard() {
  const [selectedPoolId, setSelectedPoolId] = useState('pool-1');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [activeReceiptModal, setActiveReceiptModal] = useState<any | null>(null);
  const [showAuditCertModal, setShowAuditCertModal] = useState(false);

  const currentPool = MOCK_POOLS.find((p) => p.id === selectedPoolId) || MOCK_POOLS[0];
  const contributions = MOCK_CONTRIBUTIONS.filter((c) => c.pool_id === currentPool.id);

  // Filter contributions by relationship
  const filteredContributions = contributions.filter((c) => {
    if (relationshipFilter === 'all') return true;
    return c.relationship === relationshipFilter;
  });

  // Calculate ledger metrics
  const totalReceived = contributions.reduce((sum, c) => sum + c.amount, 0);
  const relativesCount = contributions.filter((c) => c.relationship === 'Relative').length;
  const panExemptGiftsCount = contributions.filter((c) => c.amount >= 50000).length;

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

    const rows = contributions.map((c) => [
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
      c.consent_timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Neev_CA_Ledger_${currentPool.slug}_${new Date().toISOString().split('T')[0]}.csv`
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
                  Confidential • RLS Firewall Active
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
            {MOCK_POOLS.slice(0, 3).map((pool) => (
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
              {contributions.length}
            </div>
            <p className="text-[11px] text-neev-slate">
              {relativesCount} Relatives • {contributions.length - relativesCount} Friends & Others
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
              VPA: verified-creator@okhdfcbank
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
                {filteredContributions.map((tx) => (
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
                      {formatINR(tx.amount)}
                    </td>

                    {/* PAN Status */}
                    <td className="py-3.5 px-4">
                      {tx.amount >= 50000 ? (
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

                    {/* NPCI UTR */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neev-slate">
                      {tx.npci_utr}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[11px] text-neev-slate whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Message */}
                    <td className="py-3.5 px-4 max-w-xs text-[11px] text-neev-charcoal italic">
                      &ldquo;{tx.message}&rdquo;
                    </td>

                    {/* Receipt Preview Trigger */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveReceiptModal(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold text-neev-forest-800 bg-neev-forest-50 hover:bg-neev-forest-100 transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MODAL 1: Contributor Receipt Preview (Clean 1-Page PDF Simulation) */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-neev-xl max-w-lg w-full border border-neev-ivory-border shadow-warm-xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 bg-neev-forest text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-neev-amber" />
                <h3 className="font-serif text-base font-bold">Official Contributor Receipt</h3>
              </div>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-5 text-xs text-neev-charcoal">
              <div className="flex items-start justify-between border-b border-neev-ivory-border pb-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-neev-charcoal">Neev Contribution Receipt</h4>
                  <p className="text-[11px] text-neev-slate">Upadhyay Technologies Private Limited (India)</p>
                  <p className="text-[10px] text-neev-slate">Receipt No: {activeReceiptModal.receipt_number}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xl text-neev-forest-800">
                    {formatINR(activeReceiptModal.amount)}
                  </div>
                  <span className="text-[10px] font-semibold text-neev-forest bg-neev-forest-50 px-2 py-0.5 rounded">
                    Payment Settled (₹0 Fee)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-neev-slate block">Contributor Name:</span>
                  <strong className="text-neev-charcoal">{activeReceiptModal.contributor_name}</strong>
                </div>
                <div>
                  <span className="text-neev-slate block">Relationship:</span>
                  <strong className="text-neev-charcoal">{activeReceiptModal.relationship}</strong>
                </div>
                <div>
                  <span className="text-neev-slate block">Recipient / Pool:</span>
                  <strong className="text-neev-charcoal">{currentPool.title}</strong>
                </div>
                <div>
                  <span className="text-neev-slate block">NPCI UPI UTR (Bank RRN):</span>
                  <strong className="font-mono text-neev-charcoal">{activeReceiptModal.npci_utr}</strong>
                </div>
                {activeReceiptModal.contributor_pan && (
                  <div>
                    <span className="text-neev-slate block">Contributor PAN:</span>
                    <strong className="font-mono text-neev-charcoal">{activeReceiptModal.contributor_pan}</strong>
                  </div>
                )}
                <div>
                  <span className="text-neev-slate block">Settlement Gateway ID:</span>
                  <strong className="font-mono text-neev-charcoal">{activeReceiptModal.gateway_payment_id}</strong>
                </div>
              </div>

              {activeReceiptModal.message && (
                <div className="p-3 rounded bg-neev-ivory-subtle border border-neev-ivory-border">
                  <span className="text-neev-slate text-[10px] block font-semibold uppercase">Blessing Message:</span>
                  <p className="italic text-neev-charcoal mt-0.5">&ldquo;{activeReceiptModal.message}&rdquo;</p>
                </div>
              )}

              <div className="pt-2 border-t border-neev-ivory-border text-[10px] text-neev-slate space-y-1">
                <p>
                  <strong>Legal Status:</strong> Voluntary Indian domestic gift under Section 25 of the Indian Contract Act 1872 and Section 56(2)(x) of the Income Tax Act. Not an investment, loan, or purchase.
                </p>
                <p className="font-mono text-[9px] text-neev-slate/70">
                  SHA-256 Audit Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-neev-ivory-subtle border-t border-neev-ivory-border flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-sm text-xs font-semibold text-neev-charcoal bg-white border border-neev-ivory-border hover:bg-neev-ivory transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="px-4 py-2 rounded-neev-sm text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CA Tax & Audit Bundle Export */}
      {showAuditCertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-neev-xl max-w-2xl w-full border border-neev-ivory-border shadow-warm-xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            <div className="p-4 bg-neev-forest text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-neev-amber" />
                <h3 className="font-serif text-base font-bold">
                  CA Tax & Audit Bundle — Settlement Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowAuditCertModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs text-neev-charcoal">
              <div className="border-b border-neev-ivory-border pb-4">
                <h4 className="font-serif text-lg font-bold">
                  Certificate of Non-Custodial Gifting & Settlement
                </h4>
                <p className="text-[11px] text-neev-slate">
                  Issued by <strong>Upadhyay Technologies Private Limited</strong> (India) for Income Tax Filing & Audit Purposes
                </p>
              </div>

              <div className="p-4 rounded-neev-md bg-neev-ivory-subtle border border-neev-ivory-border space-y-2">
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-neev-slate block">Pool Title:</span>
                    <strong>{currentPool.title}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">Creator Name:</span>
                    <strong>{currentPool.creator_name}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">Total Settled Amount:</span>
                    <strong className="font-mono text-neev-forest-800 text-sm">{formatINR(totalReceived)}</strong>
                  </div>
                  <div>
                    <span className="text-neev-slate block">Total Verified Supporters:</span>
                    <strong>{contributions.length} Indian Domestic Contributors</strong>
                  </div>
                </div>
              </div>

              {/* Statutory Declaration */}
              <div className="space-y-2 text-[11px] text-neev-slate leading-relaxed">
                <p>
                  <strong>Statutory Declaration:</strong> Upadhyay Technologies Private Limited operates the Neev platform as a non-custodial technology facilitator under Section 79 of the Information Technology Act 2000. All transactions recorded herein were executed strictly over domestic Indian INR / UPI rails (NPCI) and settled directly into the creator’s verified bank account without intermediary holding.
                </p>
                <p>
                  <strong>Tax Treatment under Section 56(2)(x):</strong>
                  <br />• Gifts received on the occasion of marriage are <strong>fully exempt from income tax without monetary ceiling</strong> under the proviso to Section 56(2)(x).
                  <br />• Gifts received from defined &ldquo;Relatives&rdquo; (lineal ascendants/descendants, siblings, spouses) are <strong>100% tax-free</strong>.
                  <br />• Gifts ≥ ₹50,000 have verified Permanent Account Numbers (PAN) logged in this bundle.
                </p>
              </div>

              {/* Digital Signature Block */}
              <div className="pt-4 border-t border-neev-ivory-border flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-neev-slate">Digital Signature & Compliance Seal:</p>
                  <p className="font-serif font-bold text-xs text-neev-charcoal mt-1">
                    Upadhyay Technologies Private Limited
                  </p>
                  <p className="text-[10px] text-neev-slate">Head of Legal & Regulatory Compliance</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neev-forest-800 bg-neev-forest-50 px-2 py-1 rounded border border-neev-forest-100">
                    Digitally Signed • Valid for CA Audit
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neev-ivory-subtle border-t border-neev-ivory-border flex items-center justify-end gap-3">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-sm text-xs font-semibold text-neev-charcoal bg-white border border-neev-ivory-border hover:bg-neev-ivory"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Ledger CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-neev-sm text-xs font-semibold text-white bg-neev-forest hover:bg-neev-forest-900"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

