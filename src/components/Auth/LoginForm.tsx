// ============================================================
// LOGIN FORM — email/password login + forgot password link
// Used in src/app/auth/login/page.tsx
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logIn, requestPasswordReset } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import PasswordInput from '@/components/UI/PasswordInput';

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await logIn(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Login failed.');
      return;
    }

    await refresh();
    router.push('/orders');
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    const result = await requestPasswordReset(forgotEmail);
    if (!result.success) {
      setForgotError(result.error || 'Something went wrong.');
      return;
    }
    setForgotMsg('Check your email for a password reset link.');
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
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
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Logging in...' : 'Login to My Account'}
        </button>

        <div className="text-center">
          <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-ink-soft hover:text-burgundy underline">
            Forgot your password?
          </button>
        </div>
      </form>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-kraft rounded-md max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-display text-xl mb-1">Reset Password</h3>
            <p className="text-sm text-ink-soft mb-4">
              Enter your email and we&apos;ll send you a password reset link.
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
                className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
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
                  className="px-4 py-2.5 rounded text-sm border border-kraft text-ink-soft"
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
