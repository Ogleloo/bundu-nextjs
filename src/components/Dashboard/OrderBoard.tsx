// ============================================================
// ORDER BOARD — staff dashboard order management
// Button flow:
//   New order    → "Order Received" (sends WA: we got your order)
//   In Progress  → "Ready for Collection" (sends WA: order is ready)
// Each WA button can only be pressed ONCE — disappears after sending
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  buildNotifyWhatsAppUrl,
  buildReplyWhatsAppUrl,
  subscribeToOrders,
} from '@/services/orderService';
import type { Order, OrderStatus, OrderType, StaffMember } from '@/types';

interface OrderBoardProps {
  staff: StaffMember;
}

type FilterType = 'all' | OrderStatus | OrderType;

const TYPE_LABELS: Record<OrderType, string> = {
  'dine-in': '🍽 Dine In',
  takeaway: '📦 Takeaway',
  catering: '🍴 Catering',
  event: '🎉 Event',
};

const STATUS_BORDER: Record<OrderStatus, string> = {
  new: 'border-l-red-500',
  progress: 'border-l-amber-500',
  done: 'border-l-green-500 opacity-65',
};

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-red-500/15 text-red-400' },
  progress: { label: 'In Progress', className: 'bg-amber-500/15 text-amber-400' },
  done: { label: 'Completed ✓', className: 'bg-green-500/15 text-green-400' },
};

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'new', label: '🔴 New' },
  { value: 'progress', label: '🟡 In Progress' },
  { value: 'done', label: '🟢 Done' },
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'catering', label: 'Catering' },
];

export default function OrderBoard({ staff }: OrderBoardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  // Track which WA messages have been sent this session
  // receivedSent = "Order Received" WA sent
  // readySent    = "Ready for Collection" WA sent
  const [receivedSent, setReceivedSent] = useState<Set<string>>(new Set());
  const [readySent, setReadySent] = useState<Set<string>>(new Set());

  const loadOrders = useCallback(async () => {
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
    const unsubscribe = subscribeToOrders(loadOrders);
    return unsubscribe;
  }, [loadOrders]);

  // Step 1: Staff presses "Order Received"
  // → Marks order as In Progress
  // → Sends WA: "Hi [name], Bundu Foods received your order BND-XXXX and we're preparing it now!"
  async function handleReceived(order: Order) {
    await updateOrderStatus(order.id, 'progress', staff.name);
    if (order.wa) {
      const msg = encodeURIComponent(
        `Hi ${order.name}! 👋 Bundu Foods has received your order *${order.id}* and we're preparing it now. We'll message you again when it's ready. — Bundu Foods`
      );
      window.open(`https://wa.me/${order.wa}?text=${msg}`, '_blank');
      setReceivedSent(prev => new Set(prev).add(order.id));
    }
    loadOrders();
  }

  // Step 2: Staff presses "Ready for Collection"
  // → Marks order as Done
  // → Sends WA: "Hi [name], your order BND-XXXX is ready for collection!"
  async function handleReady(order: Order) {
    await updateOrderStatus(order.id, 'done', staff.name);
    if (order.wa) {
      window.open(buildNotifyWhatsAppUrl(order), '_blank');
      setReadySent(prev => new Set(prev).add(order.id));
    }
    loadOrders();
  }

  async function handleDelete(order: Order) {
    if (!confirm('Remove this order from the dashboard?')) return;
    await deleteOrder(order.id);
    loadOrders();
  }

  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    progress: orders.filter(o => o.status === 'progress').length,
    done: orders.filter(o => o.status === 'done').length,
    today: orders.filter(o =>
      new Date(o.created_at).toDateString() === new Date().toDateString()
    ).length,
  };

  const filtered = orders.filter(o => {
    if (filter === 'all') return true;
    if (['new', 'progress', 'done'].includes(filter)) return o.status === filter;
    return o.order_type === filter;
  });

  return (
    <div>
      {/* Stats */}
      <div className="bg-[#161616] border-b border-[#222] px-4 md:px-8 py-4 flex gap-8 flex-wrap">
        <Stat label="New Orders" value={stats.new} color="text-red-400" />
        <Stat label="In Progress" value={stats.progress} color="text-amber-400" />
        <Stat label="Completed" value={stats.done} color="text-green-400" />
        <Stat label="Total Today" value={stats.today} color="text-paper" />
      </div>

      {/* Filters */}
      <div className="bg-[#111] border-b border-[#222] px-4 md:px-8 py-4 flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide border transition-colors ${
              filter === f.value
                ? 'border-burgundy text-paper'
                : 'border-[#333] text-[#888] hover:border-[#555]'
            }`}
            style={filter === f.value ? { backgroundColor: 'var(--burgundy)' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="px-4 md:px-8 py-6">
        {loading ? (
          <p className="text-[#555] text-sm">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#444]">
            <div className="text-5xl mb-3">🍳</div>
            <h3 className="font-display text-xl text-[#555] mb-1">No orders here</h3>
            <p className="text-sm">Website orders appear here in real time.</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filtered.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                receivedSent={receivedSent.has(order.id)}
                readySent={readySent.has(order.id)}
                onReceived={() => handleReceived(order)}
                onReady={() => handleReady(order)}
                onDelete={() => handleDelete(order)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`font-display text-2xl leading-none ${color}`}>{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#666]">{label}</span>
    </div>
  );
}

function OrderCard({
  order,
  receivedSent,
  readySent,
  onReceived,
  onReady,
  onDelete,
}: {
  order: Order;
  receivedSent: boolean;
  readySent: boolean;
  onReceived: () => void;
  onReady: () => void;
  onDelete: () => void;
}) {
  const time = new Date(order.created_at).toLocaleTimeString('en-ZA', {
    hour: '2-digit', minute: '2-digit',
  });
  const date = new Date(order.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short',
  });
  const badge = STATUS_BADGE[order.status];

  return (
    <div className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-md overflow-hidden border-l-[3px] ${STATUS_BORDER[order.status]}`}>

      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#2a2a2a]">
        <span className="font-script text-lg text-chalk-yellow">{order.id}</span>
        <span className="text-xs text-[#555]">{date} · {time}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="text-paper font-semibold mb-0.5">{order.name}</div>
        <div className="text-[#888] text-sm mb-3">
          📱 {order.wa ? '0' + order.wa.slice(2) : 'No number'}
          {order.email ? ` · ${order.email}` : ''}
        </div>

        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded mb-3 border"
          style={{
            background: 'rgba(200,168,117,0.1)',
            color: 'var(--kraft)',
            borderColor: 'rgba(200,168,117,0.2)',
          }}
        >
          {TYPE_LABELS[order.order_type]}
        </span>

        <div className="text-sm text-[#bbb] bg-[#111] border border-[#222] rounded p-3 mb-2 leading-relaxed">
          {order.order_details}
        </div>

        {order.notes && (
          <div className="text-sm text-[#666] italic mb-2">📝 {order.notes}</div>
        )}
        {order.processed_by && (
          <div className="text-xs text-green-400 mb-3">✓ Handled by {order.processed_by}</div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-2">

          {/* STEP 1: Order Received — only on new orders, disappears after sent */}
          {order.status === 'new' && (
            receivedSent ? (
              <div className="text-center text-xs py-2 rounded border border-[#222] text-[#555]">
                ✓ Customer notified — order received
              </div>
            ) : (
              <button
                onClick={onReceived}
                className="w-full text-xs font-semibold py-2.5 rounded border border-[#4a3a00] text-amber-400 hover:bg-[#2a2000] transition-colors"
              >
                📨 Order Received — Notify Customer
              </button>
            )
          )}

          {/* STEP 2: Ready for Collection — only on in-progress orders, disappears after sent */}
          {order.status === 'progress' && (
            readySent ? (
              <div className="text-center text-xs py-2 rounded border border-[#222] text-[#555]">
                ✓ Customer notified — ready for collection
              </div>
            ) : (
              <button
                onClick={onReady}
                className="w-full text-xs font-semibold py-2.5 rounded border border-[#0a3a1a] text-green-400 hover:bg-[#0a2a10] transition-colors"
              >
                ✅ Ready for Collection — Notify Customer
              </button>
            )
          )}

          {/* Completed state — no actions needed */}
          {order.status === 'done' && (
            <div className="text-center text-xs py-2 rounded border border-[#222] text-green-500/60">
              ✓ Order complete — customer has been notified
            </div>
          )}

          {/* Delete — always visible */}
          <button
            onClick={onDelete}
            className="w-full text-xs font-semibold py-2 rounded border border-[#3a0a0a] text-red-400 hover:bg-[#2a0505] transition-colors"
          >
            Remove Order
          </button>
        </div>
      </div>
    </div>
  );
}
