// ============================================================
// FOOTER — site footer
// ============================================================
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-4 md:px-8 py-10 border-t-4 border-double"
      style={{ backgroundColor: 'var(--chalk-bg)', color: 'var(--paper)', borderColor: 'var(--kraft)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">

        <div>
          <h4 className="font-display text-lg mb-3" style={{ color: 'var(--chalk-yellow)' }}>Bundu Foods</h4>
          <p className="text-sm" style={{ color: 'rgba(244,237,220,0.6)' }}>
            Khandisa Reserve, 1 Old Main Road,<br />KwaDlangezwa, Empangeni, 3886
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-display text-lg mb-1" style={{ color: 'var(--chalk-yellow)' }}>Quick Links</h4>
          <Link href="/menu" className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>Menu</Link>
          <Link href="/orders" className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>Place an Order</Link>
          <Link href="/events" className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>Events</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-display text-lg mb-1" style={{ color: 'var(--chalk-yellow)' }}>Connect</h4>
          <a href="https://wa.me/27737155505" target="_blank" rel="noopener noreferrer"
            className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>WhatsApp</a>
          <a href="tel:+27640746461" className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>
            Call Us
          </a>
          <a href="https://www.instagram.com/bundu.foods" target="_blank" rel="noopener noreferrer"
            className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>Instagram</a>
          <a href="https://www.tiktok.com/@bundu.foods" target="_blank" rel="noopener noreferrer"
            className="transition-colors" style={{ color: 'rgba(244,237,220,0.7)' }}>TikTok</a>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(244,237,220,0.35)' }}>
        <div>© 2026 Bundu Foods. All rights reserved.</div>
        <div>
          site built by{' '}
          <a href="https://gtscaptures.netlify.app" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--kraft)' }}>
            GTS Captures Studios
          </a>
        </div>
      </div>
    </footer>
  );
}
