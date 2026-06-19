// ============================================================
// LOGIN PAGE — /auth/login
// Split: Customer login (left) | Staff access (right)
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
      <div className="min-h-screen flex flex-col md:flex-row">

        {/* LEFT — Customer Login */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-16"
          style={{ backgroundColor: 'var(--chalk-bg)' }}>
          <div className="max-w-sm w-full mx-auto">
            <Link href="/" className="block mb-8">
              <span className="font-display text-2xl" style={{ color: 'var(--paper)' }}>
                Bundu <span style={{ color: 'var(--chalk-yellow)', fontStyle: 'italic' }}>Foods</span>
              </span>
            </Link>

            <h1 className="font-display text-3xl mb-1" style={{ color: 'var(--paper)' }}>
              Welcome back
            </h1>
            <p className="text-sm mb-8" style={{ color: 'rgba(244,237,220,0.6)' }}>
              Log in to place an order or track your orders.
            </p>

            {error && (
              <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-3 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(244,237,220,0.5)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded text-sm outline-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--paper)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(244,237,220,0.5)' }}>
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

            <div className="mt-4 flex flex-col gap-2 text-center">
              <button
                onClick={() => setShowForgot(true)}
                className="text-xs underline"
                style={{ color: 'rgba(244,237,220,0.4)' }}
              >
                Forgot your password?
              </button>
              <p className="text-xs" style={{ color: 'rgba(244,237,220,0.4)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="underline font-semibold"
                  style={{ color: 'var(--chalk-yellow)' }}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="hidden md:flex items-center justify-center w-px"
          style={{ backgroundColor: 'rgba(200,168,117,0.2)' }}>
          <span className="font-script text-2xl px-4 py-2 rounded-full"
            style={{
              color: 'var(--chalk-yellow)',
              backgroundColor: 'var(--chalk-bg)',
              border: '1px solid rgba(200,168,117,0.3)',
            }}>
            or
          </span>
        </div>

        {/* RIGHT — Staff Access */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-16"
          style={{ backgroundColor: 'var(--burgundy)' }}>
          <div className="max-w-sm w-full mx-auto text-center">
            <div className="text-6xl mb-6">👥</div>
            <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--paper)' }}>
              Staff Access
            </h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(244,237,220,0.7)' }}>
              Are you a Bundu Foods team member? Access the staff dashboard to manage orders.
            </p>
            <Link
              href="/dashboard"
              className="inline-block w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
              style={{
                backgroundColor: 'var(--chalk-yellow)',
                color: 'var(--ink)',
              }}
            >
              Go to Staff Dashboard
            </Link>
            <p className="text-xs mt-4" style={{ color: 'rgba(244,237,220,0.4)' }}>
              You&apos;ll need your staff PIN to enter
            </p>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-kraft rounded-md max-w-sm w-full p-6 shadow-2xl">
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
                className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white outline-none focus:border-burgundy"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2.5 rounded text-sm border"
                  style={{ borderColor: 'var(--kraft)', color: 'var(--ink-soft)' }}
                >
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
