// ============================================================
// CHALKBOARD MENU — orderable menu display
// Fetches items via menuService. Four outcomes are handled
// separately: still loading, load failed, loaded-but-empty (owner
// hasn't captured the menu yet — honest empty state, no sample
// food), and loaded. Each row adds to the cart (CartContext); a
// sticky bar at the bottom appears once the cart has anything in it.
// Edit menu items in Supabase Table Editor -> menu_items.
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMenuItems, groupByCategory } from '@/services/menuService';
import ConnectionError from '@/components/UI/ConnectionError';
import LogoLoader from '@/components/UI/LogoLoader';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_ORDER_URL } from '@/lib/contact';
import type { MenuItem } from '@/types';

export default function ChalkboardMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  // Bumped by the retry button to re-run the fetch below
  const [attempt, setAttempt] = useState(0);

  const { items: cartLines, itemCount, totalFormatted, addItem } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMenuItems();
        if (cancelled) return;
        // Unavailable items must not render at all — belt-and-braces
        // with the service query, which already filters available = true.
        const available = data.filter(i => i.available);
        setItems(available);
        setActiveTab(available[0]?.category ?? '');
      } catch (err) {
        console.warn('[ChalkboardMenu] menu load failed:', err);
        if (!cancelled) {
          setItems([]);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();

    return () => { cancelled = true; };
  }, [attempt]);

  function retry() {
    setLoading(true);
    setFailed(false);
    setAttempt(a => a + 1);
  }

  if (loading) {
    return (
      <section id="menu" className="bg-chalk text-paper px-4 md:px-8 py-16 text-center">
        <LogoLoader label="Loading the menu" />
      </section>
    );
  }

  // Couldn't reach the menu — don't guess at what's on it
  if (failed) {
    return (
      <section id="menu" className="bg-chalk text-paper px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-script text-2xl text-chalk-yellow text-center mb-1">what&apos;s cooking</p>
          <h2 className="font-display text-3xl md:text-4xl text-center">Our Menu</h2>
          <ConnectionError
            tone="dark"
            message="We couldn't load the menu right now. Message us on WhatsApp and we'll send it through and take your order."
            onRetry={retry}
          />
        </div>
      </section>
    );
  }

  // Reached the database fine, it just has no items yet — say so
  // honestly rather than showing a sample menu the kitchen doesn't serve
  if (items.length === 0) {
    return (
      <section id="menu" className="bg-chalk text-paper px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-script text-2xl text-chalk-yellow mb-1">what&apos;s cooking</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">Our Menu</h2>
          <div className="text-4xl mb-3">✍️</div>
          <p className="text-sm text-paper/70 max-w-sm mx-auto mb-5">
            The menu is being updated. Message us on WhatsApp and we&apos;ll send it through and take your order.
          </p>
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
        </div>
      </section>
    );
  }

  const grouped = groupByCategory(items);
  const categories = Object.keys(grouped);
  const active = activeTab && grouped[activeTab] ? activeTab : categories[0];

  return (
    <>
      <section id="menu" className="bg-chalk text-paper px-4 md:px-8 py-16">
        <div
          className="max-w-3xl mx-auto"
          // Keep the last row clear of the sticky cart bar
          style={{ paddingBottom: itemCount > 0 ? 'calc(6rem + env(safe-area-inset-bottom))' : undefined }}
        >
          <p className="font-script text-2xl text-chalk-yellow text-center mb-1">what&apos;s cooking</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-8">Our Menu</h2>

          {/* Category pills — scroll sideways on mobile, never wrap */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-8">
            {categories.map(cat => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className="shrink-0 inline-flex items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold border transition-colors"
                  style={{
                    minHeight: 44,
                    backgroundColor: isActive ? 'var(--fire-red)' : 'transparent',
                    color: isActive ? 'var(--cream)' : 'rgba(255,253,247,0.75)',
                    borderColor: isActive ? 'var(--fire-red)' : 'var(--kraft)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Items */}
          <div className="space-y-4">
            {(grouped[active] || []).map(item => {
              const qty = cartLines.find(l => l.id === item.id)?.qty ?? 0;
              return (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b border-white/10 pb-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg">{item.name}</h3>
                    {item.description && <p className="text-sm text-paper/60 mt-0.5">{item.description}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-script text-xl text-chalk-yellow whitespace-nowrap">
                      R{item.price.toFixed(0)}
                    </span>

                    <button
                      type="button"
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                      aria-label={qty > 0 ? `${item.name}: ${qty} in cart, add one more` : `Add ${item.name} to cart`}
                      className="inline-flex items-center justify-center gap-1 rounded-full text-sm font-bold transition-colors"
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        padding: '0 0.9rem',
                        backgroundColor: qty > 0 ? 'var(--fire-red)' : 'var(--warm-gray)',
                        color: qty > 0 ? 'var(--cream)' : 'var(--charcoal)',
                      }}
                    >
                      {qty > 0 ? (
                        <>
                          <span>{qty}</span>
                          <span aria-hidden="true">✓</span>
                        </>
                      ) : (
                        '+ Add'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky cart bar — only once something is in the cart */}
      {itemCount > 0 && (
        <Link
          href="/orders"
          aria-label={`View cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}, ${totalFormatted}`}
          className="safe-bottom fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 px-4 pt-3"
          style={{ backgroundColor: 'var(--fire-red)', color: 'var(--cream)' }}
        >
          <div className="leading-tight">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
            <div className="text-lg font-bold">{totalFormatted}</div>
          </div>
          <span
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: 'var(--cream)', color: 'var(--fire-red)' }}
          >
            View cart →
          </span>
        </Link>
      )}
    </>
  );
}
