// ============================================================
// MENU SERVICE — fetch menu items for the public menu page
// Used by src/components/Menu and src/app/menu
// ============================================================
import { createClient } from '@/lib/supabase/client';
import type { MenuItem } from '@/types';

const supabase = createClient();

/**
 * Get all available menu items in menu order.
 *
 * sort_order is banded per category (Traditional Meals 1–11, Wings
 * 10–14, Grilled Chicken 20–23, Burgers 30s, Wors 40s, Platters 50s,
 * Fries 60s, Extras 70s, Drinks 80s), so ordering by sort_order alone
 * yields both the right category sequence and the right order within
 * each category. Ordering by category first would sort the tabs
 * alphabetically (Burgers, Drinks, Extras…) instead.
 * groupByCategory keys categories by first appearance, so the tab
 * order follows this sort.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('[MenuService] getMenuItems failed:', error);
    // Surface the failure. Returning [] here hid the difference between
    // "the menu is empty" and "we couldn't reach the menu", which left
    // the UI showing a sample menu when Supabase was down.
    throw new Error(error.message);
  }
  return (data ?? []) as MenuItem[];
}

/** Group flat menu items by category for tabbed display */
export function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}
