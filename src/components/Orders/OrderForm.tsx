// ============================================================
// ORDER FORM — customer order submission
// Used in src/app/orders/page.tsx (requires login)
// ============================================================
'use client';

import { useState } from 'react';
import { submitOrder } from '@/services/orderService';
import type { OrderType, ReplyPreference, Profile } from '@/types';

interface OrderFormProps {
  profile: Profile;
}

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway / Collection' },
  { value: 'catering', label: 'Catering Enquiry' },
  { value: 'event', label: 'Event Booking' },
];

const REPLY_PREFS: { value: ReplyPreference; label: string; icon: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'call', label: 'Phone Call', icon: '📞' },
  { value: 'either', label: 'Either', icon: '✅' },
];

export default function OrderForm({ profile }: OrderFormProps) {
  const [orderDetails, setOrderDetails] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [notes, setNotes] = useState('');
  const [replyPref, setReplyPref] = useState<ReplyPreference>('whatsapp');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await submitOrder(profile, { orderDetails, orderType, notes, replyPref });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Could not place order. Please try again.');
      return;
    }

    setSuccessRef(result.orderId!);
  }

  function resetForm() {
    setOrderDetails('');
    setNotes('');
    setSuccessRef(null);
  }

  if (successRef) {
    return (
      <div className="bg-white border border-kraft rounded-md p-8 text-center max-w-xl mx-auto">
        <div className="text-5xl mb-3">🍳</div>
        <h2 className="font-display text-2xl mb-2">Order Received!</h2>
        <p className="text-ink-soft mb-4 text-sm">
          We&apos;ll confirm your order shortly via your preferred contact method.
        </p>
        <div className="inline-block bg-chalk text-chalk-yellow font-script text-2xl px-6 py-2 rounded mb-4 tracking-widest">
          {successRef}
        </div>
        <p className="text-xs text-ink-soft mb-6">
          Save this reference number in case you need to follow up.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-xl mx-auto shadow-sm">
      <h2 className="font-display text-2xl mb-1">Your Order Details</h2>
      <p className="text-sm text-ink-soft mb-6">We&apos;ll confirm your order within 5 minutes.</p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Name</label>
            <div className="px-3 py-2.5 border border-paper-dark rounded bg-paper text-ink-soft">{profile.name}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">WhatsApp</label>
            <div className="px-3 py-2.5 border border-paper-dark rounded bg-paper text-ink-soft">
              0{profile.wa.slice(2)}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
            What would you like? *
          </label>
          <textarea
            value={orderDetails}
            onChange={e => setOrderDetails(e.target.value)}
            placeholder="e.g. 2x Bundu Famous Breakfast, 1x Meltdown Milkshake..."
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper focus:border-burgundy focus:bg-white outline-none min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={e => setOrderType(e.target.value as OrderType)}
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper focus:border-burgundy focus:bg-white outline-none"
          >
            {ORDER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
            How should we reply to you? *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {REPLY_PREFS.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setReplyPref(p.value)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded border-[1.5px] text-xs font-semibold uppercase tracking-wide transition-colors ${
                  replyPref === p.value ? 'border-burgundy bg-red-50 text-burgundy' : 'border-paper-dark bg-paper text-ink-soft'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
            Special Requests (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. No onions, extra sauce..."
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper focus:border-burgundy focus:bg-white outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Sending...' : '✓ Send My Order'}
        </button>
      </form>
    </div>
  );
}
