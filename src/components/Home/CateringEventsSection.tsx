// ============================================================
// CATERING & EVENTS — home page promo section
// Buttons link to dedicated pages /catering and /events
// ============================================================
import Link from 'next/link';

export default function CateringEventsSection() {
  return (
    <section className="px-4 md:px-8 py-16" style={{ backgroundColor: 'var(--paper-dark)' }}>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

        <div id="catering" className="bg-white border border-kraft rounded-md p-6">
          <p className="font-script text-2xl mb-1" style={{ color: 'var(--burgundy)' }}>
            for your next big day
          </p>
          <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--ink)' }}>Catering</h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ink-soft)' }}>
            From small office lunches to full event catering — let us handle
            the food so you can focus on everything else.
          </p>
          <Link
            href="/catering"
            className="inline-block px-5 py-2.5 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
          >
            Enquire About Catering
          </Link>
        </div>

        <div id="events" className="bg-white border border-kraft rounded-md p-6">
          <p className="font-script text-2xl mb-1" style={{ color: 'var(--burgundy)' }}>
            good food, good vibes
          </p>
          <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--ink)' }}>Events</h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ink-soft)' }}>
            Looking for a venue for a student event, birthday, or get-together?
            Bundu Foods has the space and the menu to make it happen.
          </p>
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
          >
            Book an Event
          </Link>
        </div>

      </div>
    </section>
  );
}
