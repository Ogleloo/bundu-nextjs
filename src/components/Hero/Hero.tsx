// ============================================================
// HERO — homepage hero section
// Edit this file to: change headline, CTAs, hero image
// ============================================================
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-burgundy text-paper px-4 md:px-8 py-20 text-center border-b-4 border-double border-kraft overflow-hidden">
      <p className="font-script text-2xl text-chalk-yellow mb-2">a table is always open</p>
      <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
        Bundu Foods
      </h1>
      <p className="max-w-xl mx-auto text-paper/80 mb-8">
        A restaurant. A lounge. A catering kitchen. A place where breakfast turns into
        business meetings and Friday lunch turns into Saturday morning.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/orders"
          className="px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-wide transition-colors"
          style={{ backgroundColor: 'var(--chalk-yellow)', color: 'var(--ink)' }}
        >
          Place an Order
        </Link>
        <a
          href="tel:+27640746461"
          className="px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-wide transition-colors"
          style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
        >
          📞 Call Us
        </a>
        <Link
          href="/menu"
          className="px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-wide border-2 border-paper text-paper hover:bg-paper hover:text-burgundy transition-colors"
        >
          See the Menu
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-paper/70">
        <span>⏱ Open from 7AM</span>
        <span>🍳 From R45</span>
        <span>📍 5 min from campus</span>
      </div>
    </section>
  );
}
