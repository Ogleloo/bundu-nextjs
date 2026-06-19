// ============================================================
// FOOTER — site footer with links and hidden staff access
// Edit this file to: update social links, contact info, credit
// ============================================================
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-chalk text-paper px-4 md:px-8 py-10 border-t-4 border-double border-kraft">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div>
          <h4 className="font-display text-lg mb-3 text-chalk-yellow">Bundu Foods</h4>
          <p className="text-sm text-paper/70">
            Khandisa Reserve, 1 Old Main Road, KwaDlangezwa, Empangeni, 3886
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-display text-lg mb-1 text-chalk-yellow">Order</h4>
          <Link href="/orders" className="hover:text-chalk-yellow transition-colors">Place an Order</Link>
          <Link href="/catering" className="hover:text-chalk-yellow transition-colors">Catering</Link>
          <Link href="/events" className="hover:text-chalk-yellow transition-colors">Events</Link>
          <a href="https://wa.me/27737155505" target="_blank" rel="noopener noreferrer" className="hover:text-chalk-yellow transition-colors">WhatsApp</a>
          <a href="tel:+27640746461" className="hover:text-chalk-yellow transition-colors">Call</a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-display text-lg mb-1 text-chalk-yellow">Connect</h4>
          <a href="https://www.instagram.com/bundu.foods" target="_blank" rel="noopener noreferrer" className="hover:text-chalk-yellow transition-colors">Instagram</a>
          <a href="https://www.tiktok.com/@bundu.foods" target="_blank" rel="noopener noreferrer" className="hover:text-chalk-yellow transition-colors">TikTok</a>
          <a href="https://wa.me/27737155505" target="_blank" rel="noopener noreferrer" className="hover:text-chalk-yellow transition-colors">WhatsApp</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-paper/60">
        <div>© 2026 Bundu Foods. All rights reserved.</div>
        <div>
          site built by{' '}
          <a href="https://gtscaptures.netlify.app" target="_blank" rel="noopener noreferrer" className="text-kraft hover:text-chalk-yellow">
            GTS Captures Studios
          </a>
          {' · '}
          <Link href="/dashboard" className="text-kraft opacity-40 hover:opacity-100 transition-opacity">
            staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
