import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPoolBySlug, getPoolPublicMessages } from '@/lib/supabase/queries';
import { PoolDetailClient } from '@/components/pool/PoolDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pool = await getPoolBySlug(params.slug);

  if (!pool) {
    return {
      title: 'Wish Pool Not Found — Neev',
    };
  }

  const title = `${pool.title} — Neev`;
  const description = pool.story.substring(0, 150) + '...';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: pool.cover_image_url ? [pool.cover_image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: pool.cover_image_url ? [pool.cover_image_url] : [],
    },
  };
}

export default async function PoolDetailPage({ params }: PageProps) {
  const pool = await getPoolBySlug(params.slug);

  if (!pool) {
    notFound();
  }

  const messages = await getPoolPublicMessages(pool.id);

  return <PoolDetailClient pool={pool} initialMessages={messages} />;
}
