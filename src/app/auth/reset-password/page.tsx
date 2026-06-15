// ============================================================
// RESET PASSWORD PAGE — /auth/reset-password
// User lands here from the email link sent by requestPasswordReset()
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/auth/login'), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk px-4 py-8">
      <div className="bg-paper border border-kraft rounded-md max-w-md w-full p-8 shadow-2xl">
        <h2 className="font-display text-2xl mb-1">Set New Password</h2>
        <p className="text-sm text-ink-soft mb-6">Choose a new password for your account.</p>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-3 py-2 rounded">
            ✓ Password updated! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">{error}</div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
              style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
            >
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
