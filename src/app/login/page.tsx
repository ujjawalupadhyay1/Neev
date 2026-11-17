'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { signInAction, signUpAction } from '@/app/actions/auth';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (mode === 'signin') {
      const res = await signInAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      const res = await signUpAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccessMessage(res?.message || 'Account created successfully! You can now sign in.');
        setMode('signin');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-warm-mesh flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neev-charcoal">
            {mode === 'signin' ? 'Welcome Back to Neev' : 'Create Your Neev Account'}
          </h2>
          <p className="mt-1 text-sm text-neev-slate">
            {mode === 'signin'
              ? 'Access your private ledger, manage wish pools & CA tax bundles'
              : 'Start your wish pool and receive direct UPI gifts with ₹0 platform fee'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-neev-2xl border border-neev-ivory-border shadow-warm-xl space-y-6">
          {/* Mode Switch Tabs */}
          <div className="flex rounded-neev-xl bg-neev-forest-50 p-1 border border-neev-forest-100">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={cn(
                'flex-1 py-2 text-xs sm:text-sm font-semibold rounded-neev-lg transition-all',
                mode === 'signin'
                  ? 'bg-white text-neev-forest shadow-warm-sm border border-neev-forest-100'
                  : 'text-neev-slate hover:text-neev-forest'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={cn(
                'flex-1 py-2 text-xs sm:text-sm font-semibold rounded-neev-lg transition-all',
                mode === 'signup'
                  ? 'bg-white text-neev-forest shadow-warm-sm border border-neev-forest-100'
                  : 'text-neev-slate hover:text-neev-forest'
              )}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-neev-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-neev-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neev-charcoal mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-neev-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-11 pr-4 py-3 rounded-neev-xl border border-neev-ivory-border focus:outline-none focus:ring-2 focus:ring-neev-forest focus:border-transparent text-sm bg-neev-ivory/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neev-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neev-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-neev-xl border border-neev-ivory-border focus:outline-none focus:ring-2 focus:ring-neev-forest focus:border-transparent text-sm bg-neev-ivory/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neev-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-neev-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-neev-xl border border-neev-ivory-border focus:outline-none focus:ring-2 focus:ring-neev-forest focus:border-transparent text-sm bg-neev-ivory/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-neev-xl bg-neev-terracotta text-white font-bold text-sm tracking-wide shadow-warm-md hover:bg-neev-terracotta-dark active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Neev Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Legal notice */}
          <div className="pt-4 border-t border-neev-ivory-border text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-neev-forest font-semibold">
              <ShieldCheck className="w-4 h-4 text-neev-forest" />
              <span>Compliant with DPDP Act 2023 & IT Act 2000</span>
            </div>
            <p className="text-[11px] text-neev-slate">
              By proceeding, you agree to Upadhyay Technologies Pvt. Ltd.{' '}
              <Link href="/legal" className="underline hover:text-neev-forest">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal" className="underline hover:text-neev-forest">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

