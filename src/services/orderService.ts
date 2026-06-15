// ============================================================
// ORDER SERVICE — submit orders, fetch order history, dashboard ops
// Used by src/components/Orders, src/components/Dashboard,
// src/app/orders/*, src/app/dashboard/*
// ============================================================
import { createClient } from '@/lib/supabase/client';
import type { Order, OrderType, ReplyPreference, OrderStatus, Profile } from '@/types';

const supabase = createClient();

/** Generate a unique order reference, e.g. "BND-4821" */
export function generateOrderRef(): string {
  return 'BND-' + Math.floor(1000 + Math.random() * 9000);
}

export interface SubmitOrderInput {
  orderDetails: string;
  orderType: OrderType;
  notes: string;
  replyPref: ReplyPreference;
}

export interface SubmitOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/** Submit a new order for the currently logged-in customer */
export async function submitOrder(profile: Profile, input: SubmitOrderInput): Promise<SubmitOrderResult> {
  if (!input.orderDetails.trim()) {
    return { success: false, error: 'Please describe what you would like to order.' };
  }

  const id = generateOrderRef();

  const { error } = await supabase.from('orders').insert({
    id,
    user_id: profile.id,
    name: profile.name,
    wa: profile.wa,
    email: profile.email,
    order_details: input.orderDetails.trim(),
    order_type: input.orderType,
    notes: input.notes.trim() || null,
    reply_pref: input.replyPref,
    status: 'new' as OrderStatus,
    processed_by: null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, orderId: id };
}

/** Get all orders for a specific customer (My Orders page) */
export async function getMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[OrderService] getMyOrders failed:', error);
    return [];
  }
  return data as Order[];
}

/** Get all orders (staff dashboard) */
export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[OrderService] getAllOrders failed:', error);
    return [];
  }
  return data as Order[];
}

/** Update order status and record which staff member processed it */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  staffName: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('orders')
    .update({ status, processed_by: staffName })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** Build the WhatsApp "ready for collection" notification link */
export function buildNotifyWhatsAppUrl(order: Order): string {
  const msg = encodeURIComponent(
    `Hi ${order.name}! 🍳 Your Bundu Foods order *${order.id}* is ready for collection. Thank you for ordering with us! — Bundu Foods`
  );
  return `https://wa.me/${order.wa}?text=${msg}`;
}

/** Build the WhatsApp "we received your order" reply link */
export function buildReplyWhatsAppUrl(order: Order): string {
  const msg = encodeURIComponent(`Hi ${order.name}, we received your order (${order.id}). `);
  return `https://wa.me/${order.wa}?text=${msg}`;
}

/**
 * Subscribe to realtime order changes (for live dashboard updates).
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToOrders(onChange: () => void): () => void {
  const channel = supabase
    .channel('orders-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
