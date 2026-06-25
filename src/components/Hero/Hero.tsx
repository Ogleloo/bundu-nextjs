import Link from 'next/link';

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--fire-red) 0%, var(--flame-orange) 60%, #C84B00 100%)',
      padding: '5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture rings */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          border: '80px solid rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          border: '60px solid rgba(255,255,255,0.04)',
        }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          📍 KwaDlangezwa · Open from 7AM
        </div>

        {/* Main headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 9vw, 6rem)',
          fontWeight: 900,
          color: 'white',
          lineHeight: 1.0,
          marginBottom: '1.2rem',
          letterSpacing: '-2px',
        }}>
          Real Food.<br />
          <span style={{ color: 'var(--sun-yellow)' }}>Real Vibes.</span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: '1.4rem',
          color: 'rgba(255,255,255,0.85)',
          maxWidth: 520,
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          fontFamily: 'var(--font-script)',
        }}>
          A restaurant. A lounge. A place where breakfast turns into business
          and Friday lunch turns into Saturday morning.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/orders" style={{
            backgroundColor: 'white',
            color: 'var(--fire-red)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            letterSpacing: '0.3px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'inline-block',
          }}>
            🍳 Order Now
          </Link>
          <Link href="/menu" style={{
            backgroundColor: 'transparent',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.6)',
            transition: 'background 0.2s, border-color 0.2s',
            display: 'inline-block',
          }}>
            See the Menu
          </Link>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '3rem',
          flexWrap: 'wrap',
        }}>
          {[
            { icon: '⏱', label: 'Open from 7AM' },
            { icon: '🍳', label: 'From R45' },
            { icon: '📍', label: '5 min from UNIZULU' },
            { icon: '📱', label: 'Order on WhatsApp' },
          ].map(stat => (
            <div key={stat.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}>
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
