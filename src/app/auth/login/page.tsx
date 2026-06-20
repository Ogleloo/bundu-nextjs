// ============================================================
// LOGIN PAGE — /auth/login
// Customer login only. Staff go directly to /dashboard
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logIn, requestPasswordReset } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import PasswordInput from '@/components/UI/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await logIn(email, password);
    setSubmitting(false);
    if (!result.success) { setError(result.error || 'Login failed.'); return; }
    await refresh();
    router.push('/orders');
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(''); setForgotMsg('');
    const result = await requestPasswordReset(forgotEmail);
    if (!result.success) { setForgotError(result.error || 'Something went wrong.'); return; }
    setForgotMsg('Check your email for a password reset link.');
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{ backgroundColor: 'var(--chalk-bg)' }}>
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="text-center mb-8">
            <Link href="/">
              <span className="font-display text-3xl" style={{ color: 'var(--paper)' }}>
                Bundu <span style={{ color: 'var(--chalk-yellow)', fontStyle: 'italic' }}>Foods</span>
              </span>
            </Link>
            <p className="font-script text-xl mt-1" style={{ color: 'rgba(244,237,220,0.5)' }}>
              welcome back
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg p-8" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }}>
            <h1 className="font-display text-2xl mb-1" style={{ color: 'var(--paper)' }}>
              Customer Login
            </h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(244,237,220,0.5)' }}>
              Log in to place an order or track your orders.
            </p>

            {error && (
              <div className="text-sm px-3 py-2 rounded mb-4"
                style={{ backgroundColor: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(244,237,220,0.4)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded text-sm outline-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--paper)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(244,237,220,0.4)' }}>
                  Password
                </label>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-opacity disabled:opacity-60"
                style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
              >
                {submitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-2 text-center">
              <button onClick={() => setShowForgot(true)}
                className="text-xs underline" style={{ color: 'rgba(244,237,220,0.35)' }}>
                Forgot your password?
              </button>
              <p className="text-xs" style={{ color: 'rgba(244,237,220,0.35)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="underline font-semibold"
                  style={{ color: 'var(--chalk-yellow)' }}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="rounded-md max-w-sm w-full p-6 shadow-2xl"
            style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--kraft)' }}>
            <h3 className="font-display text-xl mb-1" style={{ color: 'var(--ink)' }}>Reset Password</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
            {forgotError && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-3">{forgotError}</div>
            )}
            {forgotMsg && (
              <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-3 py-2 rounded mb-3">{forgotMsg}</div>
            )}
            <form onSubmit={handleForgot} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border rounded text-sm bg-white outline-none"
                style={{ borderColor: 'var(--paper-dark)' }}
              />
              <div className="flex gap-2">
                <button type="submit"
                  className="flex-1 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}>
                  Send Reset Link
                </button>
                <button type="button" onClick={() => setShowForgot(false)}
                  className="px-4 py-2.5 rounded text-sm border"
                  style={{ borderColor: 'var(--kraft)', color: 'var(--ink-soft)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
