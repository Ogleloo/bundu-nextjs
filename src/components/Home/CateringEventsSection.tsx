import Link from 'next/link';

export default function CateringEventsSection() {
  return (
    <section style={{ backgroundColor: 'var(--charcoal)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.5rem', color: 'var(--sun-yellow)', marginBottom: '0.5rem' }}>
          more than just food
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem' }}>
          Upcoming Events<br />
          <span style={{ color: 'var(--fire-red)' }}>at Bundu</span>
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Bashes, live artists, student nights and more. Bundu Foods is where the energy is — stay tuned for what&apos;s coming next.
        </p>
        <Link href="/events" style={{
          backgroundColor: 'var(--fire-red)', color: 'white',
          padding: '1rem 2.5rem', borderRadius: '8px', textDecoration: 'none',
          fontWeight: 700, fontSize: '1rem', display: 'inline-block',
          boxShadow: '0 4px 20px rgba(212,43,43,0.4)',
        }}>
          See Upcoming Events →
        </Link>
      </div>
    </section>
  );
}
