// ============================================================
// DIRECT CONTACT BUTTONS — WhatsApp / Call options on order page
// Edit phone numbers here if they change
// ============================================================
export default function DirectContactButtons() {
  return (
    <div className="max-w-xl mx-auto mb-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-soft mb-3">
        Contact us directly
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <a
          href="https://wa.me/27737155505?text=Hi%20Bundu%2C%20I%27d%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 py-5 px-2 rounded border-2 border-[#25D366] bg-[#e8f8ef] text-[#1a6b3a] text-xs font-semibold uppercase tracking-wide hover:bg-[#25D366] hover:text-white transition-colors"
        >
          <span className="text-2xl">💬</span>
          WhatsApp 1
        </a>
        <a
          href="https://wa.me/27730779712?text=Hi%20Bundu%2C%20I%27d%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 py-5 px-2 rounded border-2 border-[#25D366] bg-[#e8f8ef] text-[#1a6b3a] text-xs font-semibold uppercase tracking-wide hover:bg-[#25D366] hover:text-white transition-colors"
        >
          <span className="text-2xl">💬</span>
          WhatsApp 2
        </a>
        <a
          href="tel:+27640746461"
          className="flex flex-col items-center gap-2 py-5 px-2 rounded border-2 text-xs font-semibold uppercase tracking-wide transition-colors"
          style={{ borderColor: 'var(--moss)', backgroundColor: '#eef3f0', color: 'var(--moss)' }}
        >
          <span className="text-2xl">📞</span>
          Call Us
        </a>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft mb-6">
        <div className="flex-1 h-px bg-kraft" />
        or place a website order below
        <div className="flex-1 h-px bg-kraft" />
      </div>
    </div>
  );
}
