'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { PlusCircle, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore Dreams' },
    { href: '/dashboard', label: 'Creator Ledger' },
    { href: '/legal', label: 'Legal Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neev-ivory/90 border-b border-neev-ivory-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo showTagline={false} size="sm" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-neev-forest-800',
                  isActive ? 'text-neev-forest-800 font-semibold' : 'text-neev-slate'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neev-forest-900 font-semibold px-3 py-1 rounded-full bg-[#E2ECE6] border border-[#BED4C7] shadow-warm-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-neev-forest" />
            <span>Direct UPI • Non-Custodial</span>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-neev-md text-sm font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-sm hover:shadow-warm-md transition-all duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a Neev</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/create"
            className="inline-flex items-center justify-center p-2 rounded-neev-sm text-white bg-neev-terracotta hover:bg-neev-terracotta-hover"
            aria-label="Create a Neev"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neev-charcoal hover:text-neev-forest-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neev-ivory-border bg-neev-ivory px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neev-charcoal hover:text-neev-forest-800 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-neev-ivory-border flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-neev-forest-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct UPI • 100% Free & Non-Custodial</span>
            </div>
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-neev-md font-semibold text-white bg-neev-terracotta"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create a Neev</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

