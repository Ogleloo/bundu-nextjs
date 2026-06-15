// ============================================================
// SHARED TYPES — used across services, components, and pages
// Edit this file when adding new fields to users, orders, or staff
// ============================================================

export type OrderType = 'dine-in' | 'takeaway' | 'catering' | 'event';
export type ReplyPreference = 'whatsapp' | 'call' | 'either';
export type OrderStatus = 'new' | 'progress' | 'done';
export type StaffRole = 'owner' | 'staff';

/**
 * Customer profile — stored in Supabase `profiles` table,
 * linked 1:1 with Supabase Auth `users` table via `id`.
 */
export interface Profile {
  id: string;          // matches Supabase auth.users.id
  name: string;
  email: string;
  wa: string;           // WhatsApp number, normalised to 27XXXXXXXXX
  created_at: string;
}

/**
 * Order — stored in Supabase `orders` table.
 */
export interface Order {
  id: string;            // e.g. "BND-4821"
  user_id: string;        // FK -> profiles.id
  name: string;
  wa: string;
  email: string;
  order_details: string;
  order_type: OrderType;
  notes: string | null;
  reply_pref: ReplyPreference;
  status: OrderStatus;
  processed_by: string | null;  // staff name
  created_at: string;
}

/**
 * Staff member — stored in Supabase `staff` table.
 */
export interface StaffMember {
  id: string;
  name: string;
  pin: string;
  role: StaffRole;
  active: boolean;
  created_at: string;
}

/**
 * Menu item — stored in Supabase `menu_items` table.
 */
export interface MenuItem {
  id: string;
  category: string;   // e.g. "Breakfast", "Mocktails & Cocktails", "Milkshakes"
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  sort_order: number;
}
