// ============================================================
// CHALKBOARD MENU — tabbed menu display
// Fetches items via menuService. Three outcomes are handled
// separately: still loading, load failed, and loaded-but-empty
// (owner hasn't captured the menu yet — honest empty state, no
// sample food). Edit menu items in Supabase Table Editor ->
// menu_items, or build an admin form later in src/app/dashboard.
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getMenuItems, groupByCategory } from '@/services/menuService';
import ConnectionError from '@/components/UI/ConnectionError';
import LogoLoader from '@/components/UI/LogoLoader';
import { WHATSAPP_ORDER_URL } from '@/lib/contact';
import type { MenuItem } from '@/types';

export default function ChalkboardMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  // Bumped by the retry button to re-run the fetch below
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMenuItems();
        if (cancelled) return;
        setItems(data);
        setActiveTab(data[0]?.category ?? '');
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

  return (
    <section id="menu" className="bg-chalk text-paper px-4 md:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-script text-2xl text-chalk-yellow text-center mb-1">what&apos;s cooking</p>
        <h2 className="font-display text-3xl md:text-4xl text-center mb-8">Our Menu</h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-sm text-sm font-semibold border transition-colors ${
                activeTab === cat
                  ? 'border-chalk-yellow text-chalk-yellow bg-chalk-yellow/10'
                  : 'border-white/20 text-paper/60 hover:border-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-4">
          {(grouped[activeTab] || []).map(item => (
            <div key={item.id} className="flex justify-between items-start gap-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-lg">{item.name}</h3>
                {item.description && <p className="text-sm text-paper/60 mt-0.5">{item.description}</p>}
              </div>
              <span className="font-script text-xl text-chalk-yellow whitespace-nowrap">
                R{item.price.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
