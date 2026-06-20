// ============================================================
// RESET PASSWORD PAGE — /auth/reset-password
// Supabase sends user here with a token in the URL hash.
// We exchange that token then let the user set a new password.
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PasswordInput from '@/components/UI/PasswordInput';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false); // token exchanged and session set

  useEffect(() => {
    // Supabase puts the token in the URL hash as #access_token=...&type=recovery
    // We need to let the Supabase client detect and exchange it automatically.
    const supabase = createClient();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Token exchanged — user is now in a temporary session, ready to update password
        setReady(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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
    setTimeout(() => router.push('/auth/login'), 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--chalk-bg)' }}>
      <div className="bg-paper border border-kraft rounded-md max-w-md w-full p-8 shadow-2xl">

        <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>
          Set New Password
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
          Choose a new password for your Bundu Foods account.
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 rounded">
            ✓ Password updated! Taking you to login...
          </div>
        ) : !ready ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">⏳</div>
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              Verifying your reset link...
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>
              If this takes too long, your link may have expired.{' '}
              <a href="/auth/login" className="underline" style={{ color: 'var(--burgundy)' }}>
                Go back to login
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: 'var(--ink-soft)' }}>
                New Password
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: 'var(--ink-soft)' }}>
                Confirm Password
              </label>
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                placeholder="Repeat new password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-60 transition-opacity"
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
