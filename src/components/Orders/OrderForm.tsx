// ============================================================
// CART REVIEW — /orders
// Reviews the cart (CartContext), collects who is collecting, and
// places the order. The cart is serialised into orders.order_details
// as human-readable text — that's what kitchen staff read off the
// dashboard, so it's formatted for a person, not a parser. Schema
// unchanged. Still login-only for now; guest checkout is Step 4.
// ============================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { submitOrder } from '@/services/orderService';
import { normaliseWhatsApp } from '@/services/authService';
import type { OrderType, Profile } from '@/types';

interface OrderFormProps {
  profile: Profile;
}

// Dine In / Takeaway only — catering and event are no longer offered here
const ORDER_TYPES: { value: OrderType; label: string; desc: string }[] = [
  { value: 'dine-in', label: '🍽 Dine In', desc: 'Eat at Bundu Foods' },
  { value: 'takeaway', label: '📦 Takeaway', desc: 'Collect your order' },
];

const DANGER = '#dc2626';

/** Step 3 rule: 10 digits starting 0, or +27 followed by 9 digits. */
function isPlausibleSAMobile(raw: string): boolean {
  const s = raw.replace(/[\s-]/g, '');
  return /^0\d{9}$/.test(s) || /^\+27\d{9}$/.test(s);
}

function formatRand(n: number): string {
  return `R${(Math.round(n * 100) / 100).toFixed(2)}`;
}

export default function OrderForm({ profile }: OrderFormProps) {
  const { items, itemCount, totalFormatted, setQty, clear } = useCart();

  const [name, setName] = useState(profile.name);
  // profile.wa is stored as 27XXXXXXXXX — show it back in local 0XXXXXXXXX form
  const [wa, setWa] = useState(profile.wa ? '0' + profile.wa.slice(2) : '');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [notes, setNotes] = useState('');

  const [nameError, setNameError] = useState('');
  const [waError, setWaError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return; // a double tap must not place two orders

    setError('');
    setNameError('');
    setWaError('');

    let bad = false;
    if (!name.trim()) {
      setNameError('Please enter a name for the order.');
      bad = true;
    }
    if (!isPlausibleSAMobile(wa)) {
      setWaError('Enter a valid SA mobile — e.g. 073 123 4567 or +27 73 123 4567.');
      bad = true;
    }
    if (bad) return;

    setSubmitting(true);

    // Human-readable, one line per item, total last:
    //   1 x Usu ne Thumbu (for 1) — R65.00
    //   2 x 4 Wings + Fries — R150.00
    //   Total — R215.00
    const lines = items.map(i => {
      const note = i.note ? ` (${i.note})` : '';
      return `${i.qty} x ${i.name}${note} — ${formatRand(i.price * i.qty)}`;
    });
    lines.push(`Total — ${totalFormatted}`);

    const result = await submitOrder(profile, {
      orderDetails: lines.join('\n'),
      orderType,
      notes,
      name: name.trim(),
      wa: normaliseWhatsApp(wa),
    });

    if (!result.success) {
      setError(result.error || 'Could not place your order. Please try again.');
      setSubmitting(false);
      return;
    }

    clear(); // empty the cart + its sessionStorage
    setSuccessRef(result.orderId!);
  }

  // --- order placed -------------------------------------------------
  if (successRef) {
    return (
      <div className="bg-white border border-kraft rounded-md p-8 text-center max-w-xl mx-auto shadow-sm">
        <div className="text-5xl mb-3">🍳</div>
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--charcoal)' }}>Order placed</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ash)' }}>
          We&apos;ll send you a WhatsApp when it&apos;s ready to collect.
        </p>
        <div
          className="inline-block font-script text-2xl px-6 py-2 rounded mb-4 tracking-widest"
          style={{ backgroundColor: 'var(--charcoal)', color: 'var(--sun-yellow)' }}
        >
          {successRef}
        </div>
        <p className="text-xs mb-6" style={{ color: 'var(--ash)' }}>
          Keep this reference in case you need to follow up.
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 rounded text-sm font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'var(--fire-red)', color: 'var(--cream)' }}
        >
          Back to the menu
        </Link>
      </div>
    );
  }

  // --- empty cart ------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="bg-white border border-kraft rounded-md p-10 text-center max-w-xl mx-auto shadow-sm">
        <div className="text-5xl mb-3">🛒</div>
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--charcoal)' }}>Your cart is empty</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ash)' }}>
          Add something from the menu and it&apos;ll show up here.
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 rounded text-sm font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'var(--fire-red)', color: 'var(--cream)' }}
        >
          See the menu
        </Link>
      </div>
    );
  }

  // --- cart review --------------------------------------------------
  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-xl mx-auto shadow-sm">
      <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--charcoal)' }}>Your order</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--ash)' }}>
        Check it over, then place your order.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>
      )}

      {/* Cart lines */}
      <div>
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setQty(item.id, item.qty - 1)}
                aria-label={item.qty === 1 ? `Remove ${item.name}` : `One fewer ${item.name}`}
                className="inline-flex items-center justify-center rounded border text-lg leading-none"
                style={{ minWidth: 44, minHeight: 44, borderColor: 'var(--border)', color: 'var(--charcoal)' }}
              >
                −
              </button>
              <span
                className="inline-flex items-center justify-center text-sm font-semibold tabular-nums"
                style={{ minWidth: 28, color: 'var(--charcoal)' }}
              >
                {item.qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(item.id, item.qty + 1)}
                aria-label={`One more ${item.name}`}
                className="inline-flex items-center justify-center rounded border text-lg leading-none"
                style={{ minWidth: 44, minHeight: 44, borderColor: 'var(--border)', color: 'var(--charcoal)' }}
              >
                +
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--charcoal)' }}>{item.name}</div>
              {item.note && <div className="text-xs truncate" style={{ color: 'var(--ash)' }}>{item.note}</div>}
            </div>

            <div className="text-sm font-semibold shrink-0 tabular-nums" style={{ color: 'var(--charcoal)' }}>
              {formatRand(item.price * item.qty)}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* One note for the whole order (orders.notes) */}
        <div>
          <label
            htmlFor="order-notes"
            className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ash)' }}
          >
            Anything else?
          </label>
          <textarea
            id="order-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="No chilli, extra gravy, that sort of thing"
            className="w-full px-3 py-2.5 border rounded outline-none min-h-[72px]"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--warm-gray)', color: 'var(--charcoal)' }}
          />
        </div>

        {/* Who is collecting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="collect-name"
              className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ash)' }}
            >
              Name
            </label>
            <input
              id="collect-name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (nameError) setNameError(''); }}
              className="w-full px-3 py-2.5 border rounded outline-none"
              style={{
                borderColor: nameError ? DANGER : 'var(--border)',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--charcoal)',
              }}
            />
            {nameError && <p className="text-xs mt-1" style={{ color: DANGER }}>{nameError}</p>}
          </div>
          <div>
            <label
              htmlFor="collect-wa"
              className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ash)' }}
            >
              WhatsApp
            </label>
            <input
              id="collect-wa"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={wa}
              onChange={e => { setWa(e.target.value); if (waError) setWaError(''); }}
              className="w-full px-3 py-2.5 border rounded outline-none"
              style={{
                borderColor: waError ? DANGER : 'var(--border)',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--charcoal)',
              }}
            />
            {waError && <p className="text-xs mt-1" style={{ color: DANGER }}>{waError}</p>}
          </div>
        </div>

        {/* Order type */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: 'var(--ash)' }}
          >
            Order type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ORDER_TYPES.map(t => {
              const active = orderType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setOrderType(t.value)}
                  className="flex flex-col items-center gap-1 py-4 px-3 rounded border-2 text-sm font-semibold transition-colors"
                  style={{
                    borderColor: active ? 'var(--fire-red)' : 'var(--border)',
                    backgroundColor: active ? 'rgba(212,43,43,0.06)' : 'var(--warm-white)',
                    color: active ? 'var(--fire-red)' : 'var(--ash)',
                  }}
                >
                  <span className="text-xl">{t.label.split(' ')[0]}</span>
                  <span className="text-xs font-semibold">{t.label.split(' ').slice(1).join(' ')}</span>
                  <span className="text-[10px] font-normal opacity-70">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--ash)' }}>
            Total · {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <span className="font-display text-2xl font-bold" style={{ color: 'var(--charcoal)' }}>
            {totalFormatted}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded text-sm font-bold uppercase tracking-wide transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--fire-red)', color: 'var(--cream)' }}
        >
          {submitting && (
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'inline-block',
                border: '2px solid rgba(255,253,247,0.4)',
                borderTopColor: 'var(--cream)',
                animation: 'logo-loader-spin 0.7s linear infinite',
              }}
            />
          )}
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
        <p className="text-center text-xs" style={{ color: 'var(--ash)' }}>
          Pay at the counter when you collect
        </p>
      </form>
    </div>
  );
}
