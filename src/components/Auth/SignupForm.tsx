// ============================================================
// SIGNUP FORM — name, email, WhatsApp, password
// Used in src/app/auth/signup/page.tsx
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export default function SignupForm() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wa, setWa] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode>('');
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await signUp({ name, email, password, wa });
    setSubmitting(false);

    if (!result.success) {
      if (result.duplicateEmail) {
        setError(
          <>
            An account with this email already exists.{' '}
            <Link href="/auth/login" className="font-bold text-burgundy underline">
              Login instead →
            </Link>
          </>
        );
      } else {
        setError(result.error || 'Signup failed.');
      }
      return;
    }

    // Supabase may require email confirmation depending on project settings
    await refresh();
    setNeedsConfirmation(true);
    setTimeout(() => router.push('/orders'), 1500);
  }

  if (needsConfirmation) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">🍳</div>
        <h2 className="font-display text-xl mb-2">Welcome, {name.split(' ')[0]}!</h2>
        <p className="text-sm text-ink-soft">
          Account created. Taking you to the order page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Siyanda Nkosi"
          className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
        />
      </div>

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
          WhatsApp Number
        </label>
        <input
          type="tel"
          value={wa}
          onChange={e => setWa(e.target.value)}
          placeholder="e.g. 073 123 4567"
          className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
        />
        <p className="text-xs text-ink-soft mt-1">We&apos;ll send your order updates here.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Choose a password (min 6 characters)"
          className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-white focus:border-burgundy outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60"
        style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
      >
        {submitting ? 'Creating account...' : 'Create My Account'}
      </button>
    </form>
  );
}
