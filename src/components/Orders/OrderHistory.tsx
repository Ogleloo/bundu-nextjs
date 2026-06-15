// ============================================================
// ORDER HISTORY — customer's My Orders page
// Used in src/app/orders/history/page.tsx (requires login)
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getMyOrders } from '@/services/orderService';
import type { Order, Profile, OrderStatus, OrderType } from '@/types';

interface OrderHistoryProps {
  profile: Profile;
}

const TYPE_LABELS: Record<OrderType, string> = {
  'dine-in': '🍽 Dine In',
  takeaway: '📦 Takeaway',
  catering: '🍴 Catering',
  event: '🎉 Event',
};

const STATUS_LABELS: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: '⏳ Being Processed', className: 'bg-red-100 text-red-600' },
  progress: { label: '🔥 In Progress', className: 'bg-amber-100 text-amber-600' },
  done: { label: '✅ Completed', className: 'bg-green-100 text-green-600' },
};

const STATUS_BORDER: Record<OrderStatus, string> = {
  new: 'border-l-red-500',
  progress: 'border-l-amber-500',
  done: 'border-l-green-500',
};

export default function OrderHistory({ profile }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getMyOrders(profile.id);
      setOrders(data);
      setLoading(false);
    })();
  }, [profile.id]);

  if (loading) {
    return <p className="text-center text-ink-soft py-12">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-ink-soft">
        <div className="text-5xl mb-3">🍳</div>
        <h3 className="font-display text-xl text-ink mb-1">No orders yet</h3>
        <p className="text-sm">Your orders will appear here once you place them.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-2">
        {orders.length} order{orders.length !== 1 ? 's' : ''}
      </p>
      {orders.map(order => {
        const status = STATUS_LABELS[order.status];
        const time = new Date(order.created_at).toLocaleString('en-ZA', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        });
        return (
          <div key={order.id} className={`bg-white border border-kraft rounded-md overflow-hidden border-l-[3px] ${STATUS_BORDER[order.status]}`}>
            <div className="flex items-center justify-between px-4 py-3 bg-paper-dark border-b border-kraft">
              <span className="font-script text-lg text-burgundy">{order.id}</span>
              <span className="text-xs text-ink-soft">{time}</span>
              <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${status.className}`}>
                {status.label}
              </span>
            </div>
            <div className="p-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded mb-2 bg-burgundy/10 text-burgundy border border-burgundy/15">
                {TYPE_LABELS[order.order_type]}
              </span>
              <div className="text-sm text-ink-soft bg-paper border border-paper-dark rounded p-3 mb-2">
                {order.order_details}
              </div>
              {order.notes && <div className="text-sm text-ink-soft italic">📝 {order.notes}</div>}
              {order.processed_by && (
                <div className="text-sm text-moss mt-1">✓ Handled by {order.processed_by}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
