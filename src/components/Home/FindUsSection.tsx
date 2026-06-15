// ============================================================
// FIND US — address, hours, map
// Address verified: Khandisa Reserve, 1 Old Main Road, KwaDlangezwa
// Edit this file to: update hours or address if the location changes
// ============================================================
export default function FindUsSection() {
  return (
    <section id="visit" className="px-4 md:px-8 py-16 max-w-4xl mx-auto">
      <p className="font-script text-2xl text-burgundy text-center mb-1">come say hi</p>
      <h2 className="font-display text-3xl text-center mb-8">Find Us</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-kraft rounded-md p-6 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg mb-1">📍 Address</h3>
            <a
              href="https://maps.google.com/?q=Khandisa+Reserve,+1+Old+Main+Road,+KwaDlangezwa,+Empangeni,+3886"
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-ink-soft hover:text-burgundy underline"
            >
              Khandisa Reserve, 1 Old Main Road, KwaDlangezwa, Empangeni, 3886
            </a>
          </div>
          <div>
            <h3 className="font-display text-lg mb-1">⏱ Hours</h3>
            <p className="text-sm text-ink-soft">Open daily from 7AM</p>
          </div>
          <div>
            <h3 className="font-display text-lg mb-1">📞 Contact</h3>
            <p className="text-sm text-ink-soft">
              <a href="tel:+27640746461" className="hover:text-burgundy underline">064 074 6461</a>
              {' · '}
              <a href="https://wa.me/27737155505" target="_blank" rel="noopener noreferrer" className="hover:text-burgundy underline">WhatsApp</a>
            </p>
          </div>
        </div>

        <div className="rounded-md overflow-hidden border border-kraft min-h-[280px]">
          <iframe
            title="Bundu Foods location"
            src="https://maps.google.com/maps?q=Khandisa+Reserve,+1+Old+Main+Road,+KwaDlangezwa,+Empangeni,+3886&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 280 }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
