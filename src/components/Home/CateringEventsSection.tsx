// ============================================================
// EVENTS TEASER — home page section linking to /events
// ============================================================
import Link from 'next/link';

export default function CateringEventsSection() {
  return (
    <section className="px-4 md:px-8 py-16" style={{ backgroundColor: 'var(--chalk-bg)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-script text-2xl mb-1" style={{ color: 'var(--chalk-yellow)' }}>
          more than just food
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-4" style={{ color: 'var(--paper)' }}>
          Upcoming Events at Bundu
        </h2>
        <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto"
          style={{ color: 'rgba(244,237,220,0.65)' }}>
          Bashes, live artists, student nights and more. Bundu Foods is more than a
          restaurant — it&apos;s where the energy is. Stay tuned for what&apos;s coming.
        </p>
        <Link
          href="/events"
          className="inline-block px-8 py-3 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          See Upcoming Events
        </Link>
      </div>
    </section>
  );
}
