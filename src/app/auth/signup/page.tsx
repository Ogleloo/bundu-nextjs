'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import PasswordInput from '@/components/UI/PasswordInput';

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wa, setWa] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode>('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    const result = await signUp({ name, email, password, wa });
    setSubmitting(false);
    if (!result.success) {
      if (result.duplicateEmail) {
        setError(<>Account exists. <Link href="/auth/login" style={{ color: 'var(--fire-red)', fontWeight: 700 }}>Login instead →</Link></>);
      } else { setError(result.error || 'Signup failed.'); }
      return;
    }
    await refresh();
    setDone(true);
    setTimeout(() => router.push('/orders'), 1200);
  }

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    border: '2px solid var(--border)', borderRadius: '8px',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    color: 'var(--charcoal)', backgroundColor: 'white',
    outline: 'none', transition: 'border-color 0.2s',
  };

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍳</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fire-red)' }}>
          Welcome, {name.split(' ')[0]}!
        </h2>
        <p style={{ color: 'var(--ash)', marginTop: '0.5rem' }}>Taking you to the menu...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundColor: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>
              <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
              <span style={{ color: 'var(--tree-green)' }}>Foods</span>
            </div>
          </Link>
          <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.2rem', color: 'var(--ash)', marginTop: 4 }}>
            join the family
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--charcoal)' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--ash)', marginBottom: '1.5rem' }}>
            Sign up to order food and get event updates.
          </p>

          {error && (
            <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fca5a5', color: 'var(--fire-red)', fontSize: '0.85rem', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Full Name', value: name, onChange: setName, type: 'text', placeholder: 'e.g. Siyanda Nkosi' },
              { label: 'Email Address', value: email, onChange: setEmail, type: 'email', placeholder: 'you@example.com' },
              { label: 'WhatsApp Number', value: wa, onChange: setWa, type: 'tel', placeholder: '073 123 4567', hint: "We'll message you when your order is ready" },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ash)', marginBottom: '0.4rem' }}>
                  {field.label}
                </label>
                <input type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--fire-red)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
                {field.hint && <p style={{ fontSize: '0.72rem', color: 'var(--ash)', marginTop: '0.3rem' }}>{field.hint}</p>}
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ash)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <PasswordInput value={password} onChange={setPassword} placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={submitting} style={{
              backgroundColor: 'var(--fire-red)', color: 'white', border: 'none',
              borderRadius: '8px', padding: '1rem', fontSize: '1rem', fontWeight: 700,
              fontFamily: 'var(--font-body)', cursor: 'pointer', marginTop: '0.25rem',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Creating account...' : 'Create My Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.82rem', color: 'var(--ash)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--fire-red)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
