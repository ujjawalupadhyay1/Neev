import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Currency (e.g. ₹ 1,50,000)
 */
export function formatINR(amount: number, options: { compact?: boolean; hideSymbol?: boolean } = {}): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return options.hideSymbol ? '0' : '₹ 0';
  }

  const prefix = options.hideSymbol ? '' : '₹ ';

  if (options.compact) {
    if (amount >= 10000000) {
      return `${prefix}${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `${prefix}${(amount / 100000).toFixed(2)} Lakh`;
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${prefix}${formatted}`;
}

/**
 * Generate a clean, URL-safe slug with a short random suffix
 */
export function generatePoolSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48);

  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanTitle}-${randomSuffix}`;
}

/**
 * Format date in standard Indian format (e.g., 24 Dec 2024)
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Date TBD';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

