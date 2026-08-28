'use client';
// ============================================================
// STAFF LOGIN — /staff-login
// Independent from customer auth. PIN only.
// Staff select their name → enter PIN → go to /dashboard
//
// Staff and PINs live in Supabase only, and are only ever read
// or verified server-side (see src/app/api/staff/*). This page
// never queries the staff table directly — it calls staffService,
// which calls those routes. On successful login the server sets
// an httpOnly signed session cookie; this page just redirects.
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getActiveStaff, staffLogin } from '@/services/staffService';
import type { StaffSummary } from '@/types';

const UNREACHABLE = "Can't reach the staff list. Check your connection and reload.";
const NO_STAFF = 'No active staff accounts found. Ask the owner to add one.';

export default function StaffLoginPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffSummary[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Sign out any customer session — staff login is independent.
        // This is customer-auth hygiene only, unrelated to staff PINs.
        const supabase = createClient();
        await supabase.auth.signOut();

        const data = await getActiveStaff();
        if (data.length === 0) {
          // Could mean the fetch failed or genuinely no active staff —
          // either way there's nothing to show, so give the honest,
          // actionable version of that message.
          setLoadError(NO_STAFF);
        } else {
          setStaffList(data);
        }
      } catch {
        setLoadError(UNREACHABLE);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedName) { setError('Please select your name first.'); return; }
    if (!pin) { setError('Please enter your PIN.'); return; }

    setSubmitting(true);
    setError('');

    const result = await staffLogin(selectedName, pin);
    if (!result.success) {
      setError(result.error || 'Incorrect PIN. Try again.');
      setPin('');
      setSubmitting(false);
      return;
    }

    // Session cookie is already set by the server. Nothing to store client-side.
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, var(--charcoal) 0%, #2C1810 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 900 }}>
            <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
            <span style={{ color: 'var(--sun-yellow)' }}>Foods</span>
          </div>
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: '1.3rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
            staff portal
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#1E1E1E',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.25rem',
          }}>
            Staff Login
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
            Select your name then enter your PIN.
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
              Loading staff list...
            </div>
          ) : loadError ? (
            /* Can't show a name grid — say so instead of guessing at defaults */
            <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📡</div>
              <p style={{ color: '#f87171', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Reload
              </button>
            </div>
          ) : (
            <>
              {/* Staff name buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.6rem',
                marginBottom: '1.25rem',
              }}>
                {staffList.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setSelectedName(s.name); setError(''); setPin(''); }}
                    style={{
                      padding: '0.9rem 0.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${selectedName === s.name ? 'var(--fire-red)' : 'rgba(255,255,255,0.1)'}`,
                      backgroundColor: selectedName === s.name ? 'rgba(212,43,43,0.15)' : 'rgba(255,255,255,0.04)',
                      color: selectedName === s.name ? 'var(--fire-red)' : 'rgba(255,255,255,0.7)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
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

              {/* PIN form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  maxLength={6}
                  placeholder="· · · ·"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    outline: 'none',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--fire-red)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />

                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !selectedName || !pin}
                  style={{
                    backgroundColor: 'var(--fire-red)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    cursor: submitting || !selectedName || !pin ? 'not-allowed' : 'pointer',
                    opacity: submitting || !selectedName || !pin ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {submitting ? 'Verifying...' : 'Enter Dashboard →'}
                </button>
              </form>
            </>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="/" style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.25)',
              textDecoration: 'none',
            }}>
              ← Back to customer site
            </a>
          </div>
        </div>

        {/* Help text */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
          Staff access only
        </p>
      </div>
    </div>
  );
}
