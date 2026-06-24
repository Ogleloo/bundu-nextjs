// ============================================================
// STAFF LOGIN PAGE — /staff-login
// Completely independent from customer auth.
// Staff enter PIN only — no Supabase session required.
// URL shared internally: yourdomain.com/staff-login
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveStaff, staffLogin } from '@/services/staffService';
import { createClient } from '@/lib/supabase/client';
import type { StaffMember } from '@/types';

export default function StaffLoginPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sign out any customer session immediately
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut();
    getActiveStaff().then(data => {
      setStaffList(data);
      setLoading(false);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedName) { setError('Please select your name first.'); return; }
    setSubmitting(true);
    setError('');
    const result = await staffLogin(selectedName, pin);
    setSubmitting(false);
    if (!result.success) { setError('Incorrect PIN. Try again.'); setPin(''); return; }
    // Store staff session in sessionStorage
    sessionStorage.setItem('bundu-staff', JSON.stringify(result.staff));
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1rem',
      background: 'linear-gradient(135deg, var(--charcoal) 0%, #2C1810 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>
            <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
            <span style={{ color: 'var(--sun-yellow)' }}>Foods</span>
          </div>
          <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            staff portal
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '2rem',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Staff Login
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
            Select your name then enter your PIN.
          </p>

          {/* Staff name grid */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
              Loading staff list...
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {staffList.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSelectedName(s.name); setError(''); }}
                  style={{
                    padding: '0.9rem 0.75rem',
                    borderRadius: '10px',
                    border: `2px solid ${selectedName === s.name ? 'var(--fire-red)' : 'rgba(255,255,255,0.1)'}`,
                    backgroundColor: selectedName === s.name ? 'rgba(212,43,43,0.15)' : 'rgba(255,255,255,0.04)',
                    color: selectedName === s.name ? 'var(--fire-red)' : 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  {s.role === 'owner' ? '👑 ' : '👤 '}{s.name}
                </button>
              ))}
            </div>
          )}

          {/* PIN input */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              maxLength={6}
              placeholder="Enter PIN"
              style={{
                width: '100%', padding: '0.9rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                letterSpacing: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--fire-red)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>{error}</p>
            )}

            <button type="submit" disabled={submitting || !selectedName} style={{
              backgroundColor: 'var(--fire-red)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '1rem', fontSize: '1rem', fontWeight: 700,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
              opacity: submitting || !selectedName ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}>
              {submitting ? 'Verifying...' : 'Enter Dashboard →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="/" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
              ← Back to customer site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
