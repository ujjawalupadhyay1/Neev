import { CategoryCopyConfig, PoolCategory } from '@/types';

export const CATEGORY_COPY_MAP: Record<PoolCategory, CategoryCopyConfig> = {
  wedding: {
    key: 'wedding',
    title: 'Wedding & Nuptials',
    subtitle: 'Blessings, Shagun & New Beginnings',
    tagline: 'Bless the newly-weds as they embark on their lifelong journey together.',
    primaryCtaLabel: 'Send Aashirvaad & Shagun (₹0 Fee)',
    supporterMetricLabel: 'Blessings',
    receiptTitle: 'Aashirvaad & Shagun Receipt',
    defaultStoryPrompt:
      'We are beginning our journey together! Instead of physical boxed gifts, your love, warm blessings, and shagun will help us build our new home and future.',
    amountPresets: [2100, 5100, 11000, 21000, 51000],
    sampleTitles: [
      'Aashirvaad for Rahul & Priya’s New Beginning',
      'The Wedding Shagun Pool for Aditi & Vikram',
      'Blessings for Kabir & Tanya’s Sacred Union',
    ],
    bannerGradient: 'from-[#FAF2EB] via-[#FCEAE3] to-[#FAF8F5]',
    badgeLabel: 'Aashirvaad & Shagun',
    emoji: '💍',
  },
  education: {
    key: 'education',
    title: 'Education & Career',
    subtitle: 'Degrees, Laptops, Certifications & Aspirations',
    tagline: 'Fuel ambitious dreams and empower academic milestones.',
    primaryCtaLabel: 'Support This Goal (₹0 Fee)',
    supporterMetricLabel: 'Supporters',
    receiptTitle: 'Goal Support Receipt',
    defaultStoryPrompt:
      'I am preparing for higher education and professional growth. Your backing will directly fund tuition, technical tools, and living expenses.',
    amountPresets: [1000, 2500, 5000, 10000, 25000],
    sampleTitles: [
      'Aarav’s Master’s in Computer Science Fund',
      'Help Sneha Procure Her Architecture Workstation',
      'Rohan’s UPSC Preparation & Library Grant',
    ],
    bannerGradient: 'from-[#EAF2ED] via-[#DCEBE2] to-[#FAF8F5]',
    badgeLabel: 'Academic Grant',
    emoji: '🎓',
  },
  milestone: {
    key: 'milestone',
    title: 'Life Milestones & Wishes',
    subtitle: 'New Homes, Dream Trips, Hobbies & Anniversaries',
    tagline: 'Celebrate life’s major turning points with collective support.',
    primaryCtaLabel: 'Chip In for This Wish (₹0 Fee)',
    supporterMetricLabel: 'Contributors',
    receiptTitle: 'Neev Gift & Wish Receipt',
    defaultStoryPrompt:
      'Stepping into an exciting milestone! Your gift helps make this long-cherished dream a tangible reality.',
    amountPresets: [1500, 3000, 5000, 15000, 30000],
    sampleTitles: [
      'Down Payment for Our First Family Home',
      'The 25th Silver Anniversary Dream Vacation for Mom & Dad',
      'Creative Studio Setup for Maya’s Pottery Venture',
    ],
    bannerGradient: 'from-[#FAF4E5] via-[#F6E9C9] to-[#FAF8F5]',
    badgeLabel: 'Milestone Wish',
    emoji: '✨',
  },
  universal: {
    key: 'universal',
    title: 'Universal Neev',
    subtitle: 'Any Personal Dream or Collective Initiative',
    tagline: 'Laying the foundation of dreams through the blessings of your own.',
    primaryCtaLabel: 'Contribute to This Neev (₹0 Fee)',
    supporterMetricLabel: 'Supporters',
    receiptTitle: 'Neev Contribution Receipt',
    defaultStoryPrompt:
      'Every big milestone needs a strong foundation. Support this journey with your blessings and encouragement.',
    amountPresets: [1000, 2000, 5000, 10000, 20000],
    sampleTitles: [
      'Building the Foundation for Our Dream Project',
      'Collective Blessing Pool for Our Family Venture',
      'Support Our Next Chapter in Life',
    ],
    bannerGradient: 'from-[#F5F2EB] via-[#ECE5D6] to-[#FAF8F5]',
    badgeLabel: 'Universal Neev',
    emoji: '🌱',
  },
};

/**
 * Returns category-adaptive UI copy without leaking wedding-specific copy into education/universal pools.
 */
export function getCategoryCopy(category: PoolCategory = 'universal'): CategoryCopyConfig {
  return CATEGORY_COPY_MAP[category] || CATEGORY_COPY_MAP.universal;
}

/**
 * Standard relationship options captured during checkout / pledge
 */
export const CONTRIBUTOR_RELATIONSHIPS = [
  { value: 'Relative', label: 'Relative (Family)' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Colleague', label: 'Colleague / Coworker' },
  { value: 'Well-Wisher', label: 'Well-Wisher' },
] as const;

