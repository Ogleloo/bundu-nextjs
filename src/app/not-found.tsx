// ============================================================
// 404 — src/app/not-found.tsx
// Catches unmatched URLs across the whole app. Server component.
// Light background, so the dark splash-logo wordmark.
// ============================================================
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem 1rem',
      backgroundColor: 'var(--cream)',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/splash-logo.png"
        alt="Bundu Foods"
        width={220}
        style={{ width: 220, maxWidth: '60vw', height: 'auto', marginBottom: '2rem' }}
      />

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '3.5rem',
        fontWeight: 900,
        lineHeight: 1,
        color: 'var(--fire-red)',
      }}>
        404
      </p>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'var(--charcoal)',
        margin: '0.75rem 0 1.75rem',
      }}>
        This page went off the menu.
      </h1>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/menu" style={{
          backgroundColor: 'var(--fire-red)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.9rem',
          textDecoration: 'none',
        }}>
          See the menu
        </Link>
        <Link href="/" style={{
          border: '2px solid var(--charcoal)',
          color: 'var(--charcoal)',
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.9rem',
          textDecoration: 'none',
        }}>
          Back home
        </Link>
      </div>
    </div>
  );
}
