"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

export interface CartItem {
  id: string; // product id
  nameEn: string;
  nameAr: string;
  unitEn: string;
  unitAr: string;
  brandId: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  isOpen: boolean;
  setOpen: (o: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "modern-supply-cart";
const EMPTY: CartItem[] = [];

// localStorage is the cart, and React subscribes to it. Reading it into state in
// a mount effect made the stored cart and the rendered cart two separate truths
// that had to be kept in step by a second effect writing back, needed a
// `hydrated` flag so the write-back would not immediately clobber the saved cart
// with the empty initial one, and left a second tab's changes invisible.
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // A `storage` event is another tab editing the same cart.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

// getSnapshot must return the identical array while the stored string is
// unchanged: returning a fresh JSON.parse each call would make React see a new
// value every render and loop forever. Cache keyed on the raw string.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function readItems(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* Safari private mode throws on access; an in-memory cart is the fallback. */
    return cachedItems;
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY;
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeItems(next: CartItem[]) {
  const raw = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    /* ignore — the cache below still keeps the cart alive for this session */
  }
  cachedRaw = raw;
  cachedItems = next;
  emit();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // The server, and the hydrating client render, both see an empty cart, so the
  // markup matches; React swaps in the stored cart immediately after hydration.
  const items = useSyncExternalStore(subscribe, readItems, () => EMPTY);
  const [isOpen, setOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    const cur = readItems();
    const existing = cur.find((i) => i.id === item.id);
    writeItems(
      existing
        ? cur.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i))
        : [...cur, { ...item, quantity: qty }],
    );
    setOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    writeItems(readItems().filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    const cur = readItems();
    writeItems(
      qty < 1
        ? cur.filter((i) => i.id !== id)
        : cur.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => writeItems(EMPTY), []);

  const itemCount = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items],
  );

  const value: CartCtx = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    isOpen,
    setOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
