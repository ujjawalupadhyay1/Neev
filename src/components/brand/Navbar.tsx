'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { PlusCircle, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { signOutAction } from '@/app/actions/auth';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      await signOutAction();
    } catch (e: any) {
      if (e?.message?.includes('NEXT_REDIRECT') || e?.digest?.includes('NEXT_REDIRECT')) {
        return;
      }
      router.push('/');
      router.refresh();
    }
  };

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
        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neev-forest-900 hover:text-neev-forest px-3 py-2 rounded-neev-md hover:bg-neev-forest-50 border border-transparent hover:border-neev-forest-100 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-neev-forest" />
                  <span className="max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'My Account'}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-xs font-semibold text-neev-slate hover:text-red-700 px-2.5 py-2 rounded-neev-md hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-neev-forest-900 hover:text-neev-forest px-3 py-2 rounded-neev-md hover:bg-neev-forest-50 border border-transparent hover:border-neev-forest-100 transition-colors"
              >
                Sign In
              </Link>
            )
          )}

          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-neev-md text-xs sm:text-sm font-semibold text-white bg-neev-terracotta hover:bg-neev-terracotta-hover active:bg-neev-terracotta-active shadow-warm-sm hover:shadow-warm-md transition-all duration-150"
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
            <div className="grid grid-cols-2 gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-neev-md font-semibold text-xs text-red-600 bg-red-50 border border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-neev-md font-semibold text-xs text-neev-forest bg-neev-forest-50 border border-neev-forest-100"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-neev-md font-semibold text-xs text-white bg-neev-terracotta"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Neev</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
