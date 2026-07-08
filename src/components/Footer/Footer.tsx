import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--charcoal)', color: 'white', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
              <span style={{ color: 'var(--sun-yellow)' }}>Foods</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Khandisa Reserve, 1 Old Main Road,<br />KwaDlangezwa, Empangeni, 3886
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            {[
              { href: '/menu', label: 'Menu' },
              { href: '/orders', label: 'Place an Order' },
              { href: '/events', label: 'Events' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', marginBottom: '0.5rem', transition: 'color 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Contact
            </h4>
            {[
              { href: 'https://wa.me/27737155505', label: '💬 WhatsApp' },
              { href: 'tel:+27640746461', label: '📞 Call Us' },
              { href: 'https://www.instagram.com/bundu.foods', label: '📸 Instagram' },
              { href: 'https://www.tiktok.com/@bundu.foods', label: '🎵 TikTok' },
            ].map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', marginBottom: '0.5rem' }}>
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Order Now
            </h4>
            <Link href="/orders" style={{
              display: 'inline-block', backgroundColor: 'var(--fire-red)', color: 'white',
              padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem',
            }}>
              🍳 Place an Order
            </Link>
            <a href="https://wa.me/27737155505" target="_blank" rel="noopener noreferrer" style={{
              display: 'block', backgroundColor: '#25D366', color: 'white',
              padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.875rem',
            }}>
              💬 WhatsApp Order
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 Bundu Foods — The Next Chapter. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
            Site by{' '}
            <a href="https://gtscaptures.netlify.app" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              GTS Captures Studios
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
