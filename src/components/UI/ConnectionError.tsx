// ============================================================
// CONNECTION ERROR — shown when a Supabase fetch fails.
// Always offers WhatsApp so the customer can still order even
// when the site can't reach the database.
// Numbers live in src/lib/contact.ts
// ============================================================
'use client';

import { WHATSAPP_ORDER_URL } from '@/lib/contact';

interface ConnectionErrorProps {
  /** Short, plain-language description of what failed */
  message: string;
  /** 'dark' for chalkboard sections, 'light' for paper backgrounds */
  tone?: 'light' | 'dark';
  /** Optional retry handler — renders a "Try again" button when provided */
  onRetry?: () => void;
}

export default function ConnectionError({ message, tone = 'light', onRetry }: ConnectionErrorProps) {
  const dark = tone === 'dark';

  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3">📡</div>

      <p
        className="text-sm leading-relaxed max-w-sm mx-auto mb-5"
        style={{ color: dark ? 'rgba(255,253,247,0.75)' : 'var(--ash, #5A5A5A)' }}
      >
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={WHATSAPP_ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-105"
          style={{ backgroundColor: '#25D366' }}
        >
          <span className="text-lg">💬</span>
          Order on WhatsApp
        </a>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-3 rounded text-sm font-semibold uppercase tracking-wide border-2 transition-colors"
            style={{
              borderColor: dark ? 'rgba(255,253,247,0.3)' : 'var(--border, #E8E4DC)',
              color: dark ? 'rgba(255,253,247,0.8)' : 'var(--charcoal, #1A1A1A)',
            }}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
