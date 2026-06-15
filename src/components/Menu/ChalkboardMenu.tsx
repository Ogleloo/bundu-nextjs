// ============================================================
// CHALKBOARD MENU — tabbed menu display
// Fetches items via menuService. Falls back to placeholder
// items if the menu_items table is empty (owner hasn't added menu yet).
// Edit menu items in Supabase Table Editor -> menu_items,
// or build an admin form later in src/app/dashboard.
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getMenuItems, groupByCategory } from '@/services/menuService';
import type { MenuItem } from '@/types';

const PLACEHOLDER_ITEMS: MenuItem[] = [
  { id: 'p1', category: 'Breakfast', name: 'Bundu Famous Breakfast', description: 'Eggs, bacon, sausage, toast & hash browns', price: 75, available: true, sort_order: 1 },
  { id: 'p2', category: 'Breakfast', name: 'Avo Toast', description: 'Smashed avo on sourdough, feta & chilli flakes', price: 55, available: true, sort_order: 2 },
  { id: 'p3', category: 'Mocktails & Cocktails', name: 'Bundu Sunrise', description: 'Orange, passionfruit & grenadine', price: 45, available: true, sort_order: 1 },
  { id: 'p4', category: 'Mocktails & Cocktails', name: 'Mojito', description: 'Classic mint & lime', price: 60, available: true, sort_order: 2 },
  { id: 'p5', category: 'Milkshakes', name: 'Meltdown Milkshake', description: 'Chocolate, caramel & cookie crumble', price: 50, available: true, sort_order: 1 },
  { id: 'p6', category: 'Milkshakes', name: 'Strawberry Dream', description: 'Fresh strawberry & vanilla', price: 45, available: true, sort_order: 2 },
];

export default function ChalkboardMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholders, setUsingPlaceholders] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    (async () => {
      const data = await getMenuItems();
      if (data.length === 0) {
        setItems(PLACEHOLDER_ITEMS);
        setUsingPlaceholders(true);
        setActiveTab(PLACEHOLDER_ITEMS[0].category);
      } else {
        setItems(data);
        setActiveTab(data[0].category);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="bg-chalk text-paper px-4 md:px-8 py-16 text-center">
        <p className="font-script text-xl text-chalk-yellow">loading the menu...</p>
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

        {usingPlaceholders && (
          <p className="text-center text-xs text-paper/50 mb-6 italic">
            Showing sample menu — owner can add the real menu via the dashboard.
          </p>
        )}

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
