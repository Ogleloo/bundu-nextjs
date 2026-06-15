// ============================================================
// CATERING & EVENTS — combined promo section
// Edit this file to: update catering/event details and pricing
// ============================================================
export default function CateringEventsSection() {
  return (
    <section className="px-4 md:px-8 py-16 bg-paper-dark">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div id="catering" className="bg-white border border-kraft rounded-md p-6">
          <p className="font-script text-2xl text-burgundy mb-1">for your next big day</p>
          <h2 className="font-display text-2xl mb-3">Catering</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-4">
            From small office lunches to full event catering — let us handle the food
            so you can focus on everything else. Message us with your headcount, date,
            and what you have in mind.
          </p>
          <a
            href="https://wa.me/27737155505?text=Hi%20Bundu%2C%20I%27d%20like%20to%20enquire%20about%20catering."
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
          >
            Enquire on WhatsApp
          </a>
        </div>

        <div id="events" className="bg-white border border-kraft rounded-md p-6">
          <p className="font-script text-2xl text-burgundy mb-1">good food, good vibes</p>
          <h2 className="font-display text-2xl mb-3">Events</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-4">
            Looking for a venue for a student event, birthday, or get-together? Bundu
            Foods has the space and the menu to make it happen. Get in touch to check
            availability.
          </p>
          <a
            href="https://wa.me/27737155505?text=Hi%20Bundu%2C%20I%27d%20like%20to%20enquire%20about%20booking%20an%20event."
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
