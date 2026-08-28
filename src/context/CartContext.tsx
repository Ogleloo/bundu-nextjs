// ============================================================
// CART CONTEXT — client-side cart state (React context + useReducer)
// No external state library.
//
// - A line is keyed by the menu_items id, so adding the same item
//   twice bumps qty instead of creating a second line.
// - The price is captured when the item is first added. If the owner
//   changes a price mid-session the cart keeps what the customer saw;
//   reconcile at order submission, not here.
// - Persisted to sessionStorage ('bundu-cart') — NOT localStorage, so
//   a cart doesn't survive for days and surprise someone with stale
//   prices. The stored value is read on mount inside an effect (never
//   during render, which would desync server/client HTML) and any
//   malformed value falls back to an empty cart.
// ============================================================
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

export interface CartItem {
  id: string;      // menu_items.id
  name: string;
  price: number;   // price at the time this line was added
  qty: number;
  note?: string;
}

/** What a caller passes to addItem — qty is managed by the reducer. */
export type AddItemInput = Omit<CartItem, 'qty'>;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;       // sum of qty across lines, not the number of lines
  total: number;           // raw sum of price * qty — may carry float drift
  totalFormatted: string;  // total rounded to cents and formatted, e.g. "R160.00"
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setNote: (id: string, note: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'bundu-cart';

// ---- reducer -------------------------------------------------

type CartAction =
  | { type: 'ADD'; item: AddItemInput }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'SET_NOTE'; id: string; note: string }
  | { type: 'CLEAR' }
  // internal only — used to load the sessionStorage snapshot on mount
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const exists = state.some(i => i.id === action.item.id);
      if (exists) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }

    case 'REMOVE':
      return state.filter(i => i.id !== action.id);

    case 'SET_QTY':
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i => (i.id === action.id ? { ...i, qty: action.qty } : i));

    case 'SET_NOTE': {
      // A blank note isn't a note. Store undefined so "no note" and
      // "note typed then cleared" serialise identically into order_details.
      const note = action.note.trim() ? action.note : undefined;
      return state.map(i => (i.id === action.id ? { ...i, note } : i));
    }

    case 'CLEAR':
      return [];

    case 'HYDRATE':
      return action.items;

    default:
      return state;
  }
}

// ---- sessionStorage helpers --------------------------------

function isCartItem(x: unknown): x is CartItem {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.qty === 'number' &&
    (o.note === undefined || typeof o.note === 'string')
  );
}

/** Read + validate the stored cart. Any problem → empty cart. */
function readStoredCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

// ---- context ----------------------------------------------

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load the stored cart once, after mount. Doing this during render
  // (e.g. as useReducer's lazy initializer) would make the first
  // client render differ from the server HTML and trip hydration.
  useEffect(() => {
    const stored = readStoredCart();
    if (stored.length > 0) dispatch({ type: 'HYDRATE', items: stored });
  }, []);

  // Persist on every change — but skip the first effect run so the
  // initial empty state can't clobber a stored cart before HYDRATE lands.
  //
  // Strict Mode (dev only): React mounts effects, runs cleanup, then
  // mounts them again with no re-render between. The first run flips
  // this ref and bails; the second run sees it already false and does
  // write — and HYDRATE hasn't flushed yet, so sessionStorage briefly
  // holds '[]' before the next render persists the real cart. It
  // self-corrects, and production (single invoke) never reaches that
  // second run. Don't try to "fix" it by relocating the guard.
  const firstPersist = useRef(true);
  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false;
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable / full — non-fatal, cart still works in-memory
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    // Float sums drift — "R160.00000000000003" on a checkout screen is
    // worse than the rounding it hides. Round to cents, then format.
    const rounded = Math.round(total * 100) / 100;
    return {
      items,
      itemCount: items.reduce((n, i) => n + i.qty, 0),
      total,
      totalFormatted: `R${rounded.toFixed(2)}`,
      addItem: item => dispatch({ type: 'ADD', item }),
      removeItem: id => dispatch({ type: 'REMOVE', id }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      setNote: (id, note) => dispatch({ type: 'SET_NOTE', id, note }),
      clear: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a <CartProvider>');
  return ctx;
}
