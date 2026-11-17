import { Metadata } from 'next';
import { getCreatorDashboardData } from '@/lib/supabase/queries';
import { CreatorLedgerClient } from '@/components/dashboard/CreatorLedgerClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Creator Private Ledger & CA Tax Audit — Neev',
  description:
    'Confidential creator dashboard protected by Supabase RLS privacy firewall. View individual rupee contributions, PAN compliance logs, and export CA tax audit bundles.',
};

export default async function DashboardPage() {
  const data = await getCreatorDashboardData();

  return (
    <CreatorLedgerClient
      pools={data.pools}
      contributions={data.contributions}
      isLive={data.isLive}
    />
  );
}
