export default function FindUsSection() {
  return (
    <section id="visit" style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--cream)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.4rem', color: 'var(--fire-red)', marginBottom: '0.5rem' }}>
            come say hi
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--charcoal)' }}>
            Find Us
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '📍', label: 'Address', value: 'Khandisa Reserve, 1 Old Main Road, KwaDlangezwa, Empangeni, 3886', href: 'https://maps.google.com/?q=Khandisa+Reserve,+1+Old+Main+Road,+KwaDlangezwa,+Empangeni,+3886' },
              { icon: '⏱', label: 'Hours', value: 'Open daily from 7AM', href: null },
              { icon: '📞', label: 'Contact', value: '064 074 6461', href: 'tel:+27640746461' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.3rem' }}>
                  {item.icon} {item.label}
                </div>
                {item.href ? (
                  <a href={item.href} style={{ fontSize: '0.875rem', color: 'var(--fire-red)', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--ash)' }}>{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', minHeight: 280 }}>
            <iframe
              title="Bundu Foods location"
              src="https://maps.google.com/maps?q=Khandisa+Reserve,+1+Old+Main+Road,+KwaDlangezwa,+Empangeni,+3886&output=embed"
              width="100%" height="100%"
              style={{ border: 0, minHeight: 280, display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
