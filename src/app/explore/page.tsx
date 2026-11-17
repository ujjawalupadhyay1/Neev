import { Metadata } from 'next';
import { getExplorePools } from '@/lib/supabase/queries';
import { ExploreClient } from '@/components/explore/ExploreClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Dreams & Life Milestones — Neev',
  description:
    'Discover verified life milestones and collective gifting pools across India. Contribute via direct UPI with ₹0 platform fee.',
};

export default async function ExplorePage() {
  const pools = await getExplorePools();

  return <ExploreClient initialPools={pools} />;
}
