// ============================================================
// MENU SERVICE — fetch menu items for the public menu page
// Used by src/components/Menu and src/app/menu
// ============================================================
import { createClient } from '@/lib/supabase/client';
import type { MenuItem } from '@/types';

const supabase = createClient();

/** Get all available menu items, grouped-ready (sorted by category + sort_order) */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('[MenuService] getMenuItems failed:', error);
    return [];
  }
  return data as MenuItem[];
}

/** Group flat menu items by category for tabbed display */
export function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}
