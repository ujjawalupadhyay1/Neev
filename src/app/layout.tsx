import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/brand/Navbar';
import { Footer } from '@/components/brand/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Neev — Apno Ke Aashirvaad Se, Sapno Ki Neev',
  description:
    'Universal Indian wishlist and milestone contribution platform. Direct UPI contributions for personal aspirations, education, creative projects, and life dreams with ₹0 fee and strict creator-only privacy.',
  keywords: [
    'Neev',
    'online wish pool India',
    'milestone contribution platform',
    'UPI group gifting',
    'wishlist registry India',
    'education fund India',
    'direct settlement registry',
  ],
  authors: [{ name: 'Upadhyay Technologies Private Limited' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Neev — Apno Ke Aashirvaad Se, Sapno Ki Neev',
    description:
      'Building the foundation of dreams through the blessings of your own. Direct UPI contributions for any wish or goal with zero platform fee and complete privacy.',
    siteName: 'Neev',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-neev-ivory text-neev-charcoal font-sans antialiased flex flex-col selection:bg-neev-terracotta-light selection:text-neev-terracotta">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
