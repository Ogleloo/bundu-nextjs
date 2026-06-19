// ============================================================
// ORDER FORM — Dine In and Takeaway only
// Catering → /catering | Events → /events
// ============================================================
'use client';

import { useState } from 'react';
import { submitOrder } from '@/services/orderService';
import type { OrderType, Profile } from '@/types';

interface OrderFormProps {
  profile: Profile;
}

// Only dine-in and takeaway — catering/events have their own pages
const ORDER_TYPES: { value: OrderType; label: string; desc: string }[] = [
  { value: 'dine-in', label: '🍽 Dine In', desc: 'Eat at Bundu Foods' },
  { value: 'takeaway', label: '📦 Takeaway', desc: 'Collect your order' },
];

export default function OrderForm({ profile }: OrderFormProps) {
  const [orderDetails, setOrderDetails] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await submitOrder(profile, { orderDetails, orderType, notes });
    setSubmitting(false);
    if (!result.success) { setError(result.error || 'Could not place order. Please try again.'); return; }
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
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--ink)' }}>Order Received!</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
          We&apos;ll send you a WhatsApp message when your order is ready.
        </p>
        <div className="inline-block font-script text-2xl px-6 py-2 rounded mb-4 tracking-widest"
          style={{ backgroundColor: 'var(--chalk-bg)', color: 'var(--chalk-yellow)' }}>
          {successRef}
        </div>
        <p className="text-xs mb-6" style={{ color: 'var(--ink-soft)' }}>
          Save this reference number in case you need to follow up.
        </p>
        <button onClick={resetForm} className="px-6 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}>
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-xl mx-auto shadow-sm">
      <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>Your Order</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
        We&apos;ll confirm your order within 5 minutes.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pre-filled customer info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>Name</label>
            <div className="px-3 py-2.5 border rounded text-sm"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink-soft)' }}>
              {profile.name}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>WhatsApp</label>
            <div className="px-3 py-2.5 border rounded text-sm"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink-soft)' }}>
              0{profile.wa.slice(2)}
            </div>
          </div>
        </div>

        {/* Order type — Dine In / Takeaway only */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: 'var(--ink-soft)' }}>Order Type</label>
          <div className="grid grid-cols-2 gap-3">
            {ORDER_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setOrderType(t.value)}
                className="flex flex-col items-center gap-1 py-4 px-3 rounded border-2 text-sm font-semibold transition-colors"
                style={{
                  borderColor: orderType === t.value ? 'var(--burgundy)' : 'var(--paper-dark)',
                  backgroundColor: orderType === t.value ? 'rgba(138,44,32,0.06)' : 'var(--paper)',
                  color: orderType === t.value ? 'var(--burgundy)' : 'var(--ink-soft)',
                }}
              >
                <span className="text-xl">{t.label.split(' ')[0]}</span>
                <span className="text-xs font-semibold">{t.label.split(' ').slice(1).join(' ')}</span>
                <span className="text-[10px] font-normal opacity-70">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ink-soft)' }}>What would you like? *</label>
          <textarea
            value={orderDetails}
            onChange={e => setOrderDetails(e.target.value)}
            placeholder="e.g. 2x Bundu Famous Breakfast, 1x Meltdown Milkshake..."
            className="w-full px-3 py-2.5 border rounded text-sm outline-none min-h-[100px]"
            style={{
              borderColor: 'var(--paper-dark)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
            }}
          />
        </div>

        {/* Special requests */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ink-soft)' }}>Special Requests (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. No onions, extra sauce..."
            className="w-full px-3 py-2.5 border rounded text-sm outline-none"
            style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Sending...' : '✓ Send My Order'}
        </button>

        {/* Links to catering/events */}
        <div className="pt-2 border-t text-center text-xs" style={{ borderColor: 'var(--paper-dark)', color: 'var(--ink-soft)' }}>
          Need catering or want to book an event?{' '}
          <a href="/catering" className="underline font-semibold" style={{ color: 'var(--burgundy)' }}>Catering enquiry</a>
          {' · '}
          <a href="/events" className="underline font-semibold" style={{ color: 'var(--burgundy)' }}>Book an event</a>
        </div>
      </form>
    </div>
  );
}
