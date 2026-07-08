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
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSubmitting(true);
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

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    border: '2px solid var(--border)', borderRadius: '8px',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    color: 'var(--charcoal)', backgroundColor: 'white',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem 1rem',
        backgroundColor: 'var(--cream)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>
                <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
                <span style={{ color: 'var(--tree-green)' }}>Foods</span>
              </div>
            </Link>
            <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.2rem', color: 'var(--ash)', marginTop: 4 }}>
              welcome back
            </div>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '2rem',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            border: '1px solid var(--border)',
          }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--charcoal)' }}>
              Customer Login
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--ash)', marginBottom: '1.5rem' }}>
              Log in to order or track your food.
            </p>

            {error && (
              <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fca5a5', color: 'var(--fire-red)', fontSize: '0.85rem', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ash)', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--fire-red)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ash)', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <PasswordInput value={password} onChange={setPassword} placeholder="Your password" />
              </div>
              <button type="submit" disabled={submitting} style={{
                backgroundColor: 'var(--fire-red)', color: 'white', border: 'none',
                borderRadius: '8px', padding: '1rem', fontSize: '1rem', fontWeight: 700,
                fontFamily: 'var(--font-body)', cursor: 'pointer', marginTop: '0.5rem',
                opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.1s',
              }}>
                {submitting ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
              <button onClick={() => setShowForgot(true)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', color: 'var(--ash)', textDecoration: 'underline',
                fontFamily: 'var(--font-body)',
              }}>
                Forgot your password?
              </button>
              <p style={{ fontSize: '0.82rem', color: 'var(--ash)' }}>
                New here?{' '}
                <Link href="/auth/signup" style={{ color: 'var(--fire-red)', fontWeight: 700, textDecoration: 'none' }}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Reset Password</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ash)', marginBottom: '1rem' }}>We&apos;ll send a reset link to your email.</p>
            {forgotError && <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fca5a5', color: 'var(--fire-red)', fontSize: '0.82rem', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.75rem' }}>{forgotError}</div>}
            {forgotMsg && <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: 'var(--tree-green)', fontSize: '0.82rem', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.75rem' }}>{forgotMsg}</div>}
            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: 'var(--fire-red)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Send Link
                </button>
                <button type="button" onClick={() => setShowForgot(false)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid var(--border)', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--ash)', fontFamily: 'var(--font-body)' }}>
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
