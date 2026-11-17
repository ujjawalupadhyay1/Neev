import React, { Suspense } from 'react';
import { CreateNeevWizard } from '@/components/wizard/CreateNeevWizard';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create a Neev — Start Your Milestone Wish Pool',
  description:
    'Create an Indian social wishlist and gift pool for weddings, laptops, homes, or personal dreams. Direct UPI settlement, zero fees, and complete privacy.',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-warm-mesh py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-neev-forest" />
          </div>
        }
      >
        <CreateNeevWizard />
      </Suspense>
    </div>
  );
}

