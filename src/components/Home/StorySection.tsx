export default function StorySection() {
  return (
    <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--warm-gray)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-script)', fontSize: '1.4rem', color: 'var(--fire-red)', marginBottom: '0.5rem' }}>
            our story
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
            More than a restaurant
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--ash)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Bundu Foods started near UNIZULU with one goal — feed students and locals food that actually tastes like home. Today we&apos;re a restaurant, a lounge, and a gathering place all in one.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--ash)', lineHeight: 1.8 }}>
            Whether you&apos;re grabbing a quick breakfast before class or linking up with the crew after hours — Bundu is where you belong.
          </p>
        </div>
        <div style={{
          aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--fire-red) 0%, var(--flame-orange) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(212,43,43,0.2)',
        }}>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📸</div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Add your restaurant photo here</p>
          </div>
        </div>
      </div>
    </section>
  );
}
