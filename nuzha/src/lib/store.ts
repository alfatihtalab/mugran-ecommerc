"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { byId, products } from "./catalog";
import { COD_FEE, FREE_SHIPPING_OVER, SHIPPING, VAT } from "./format";

export type ThemeId = "arcade-light" | "arcade-dark" | "harbour" | "stroll";
export type ShippingMethod = keyof typeof SHIPPING;
export type PaymentMethod = "mada" | "card" | "applepay" | "cod";
export type OrderStatus = "paid" | "cod" | "fulfilled" | "shipped" | "refunded" | "partially_refunded";

export interface CartLine { key: string; productId: string; colour: string; size?: string; qty: number; }
export interface OrderItem { productId: string; name: string; colour: string; size?: string; qty: number; price: number; image: string; }
export interface TimelineEvent { at: string; title: string; detail: string; }
export interface Order {
  id: number; createdAt: string; locale: "en" | "ar"; status: OrderStatus;
  customer: { name: string; email: string; phone: string };
  address: { line1: string; city: string; postal: string };
  shipping: ShippingMethod; payment: PaymentMethod; cardLast4?: string;
  items: OrderItem[]; subtotal: number; discount: number; shippingFee: number; codFee: number; vat: number; total: number;
  refunded: number; timeline: TimelineEvent[]; note?: string;
}
export interface Settings {
  payments: Record<PaymentMethod | "tabby", boolean>;
  locales: { ar: boolean };
  freeShippingOver: number;
  storeName: string;
}
export interface ProductOverride { price?: number; stock?: number; nameEn?: string; nameAr?: string; status?: "active" | "draft"; }

export interface Totals { subtotal: number; discount: number; shippingFee: number; codFee: number; vat: number; total: number; }

export function computeTotals(lines: { price: number; qty: number }[], shipping: ShippingMethod, payment: PaymentMethod | null, discountPct: number, freeOver = FREE_SHIPPING_OVER): Totals {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = Math.round(subtotal * discountPct * 100) / 100;
  const after = subtotal - discount;
  const shippingFee = shipping === "express" ? SHIPPING.express : shipping === "pickup" || after >= freeOver ? 0 : SHIPPING.standard;
  const codFee = payment === "cod" ? COD_FEE : 0;
  const vat = Math.round((after + shippingFee + codFee) * VAT * 100) / 100;
  const total = Math.round((after + shippingFee + codFee + vat) * 100) / 100;
  return { subtotal, discount, shippingFee, codFee, vat, total };
}

const now = Date.now();
const d = (hoursAgo: number) => new Date(now - hoursAgo * 3600_000).toISOString();
const seedItem = (id: string, colour: string, qty: number, size?: string): OrderItem => {
  const p = byId(id)!;
  return { productId: id, name: p.name.en, colour, size, qty, price: p.price, image: p.images[0] };
};
const seedOrder = (id: number, hours: number, name: string, email: string, items: OrderItem[], status: OrderStatus, payment: PaymentMethod, refunded = 0): Order => {
  const t = computeTotals(items, "standard", payment, 0);
  const tl: TimelineEvent[] = [{ at: d(hours), title: "Order placed", detail: "web (EN)" }];
  if (payment !== "cod") tl.push({ at: d(hours), title: "Payment captured", detail: payment === "mada" ? "Mada" : payment === "card" ? "Visa" : "Apple Pay" });
  if (status === "fulfilled" || status === "shipped") tl.push({ at: d(hours - 6), title: "Packed", detail: "Riyadh warehouse" });
  if (status === "shipped") tl.push({ at: d(hours - 10), title: "Shipped", detail: "Aramex · 4421 9930 11" });
  if (refunded > 0) tl.push({ at: d(hours - 20), title: "Refunded", detail: `${refunded.toFixed(2)} back to original method` });
  return { id, createdAt: d(hours), locale: "en", status, customer: { name, email, phone: "+966 55 000 0000" }, address: { line1: "King Fahd Rd 18", city: "Riyadh", postal: "12211" }, shipping: "standard", payment, cardLast4: payment === "cod" ? undefined : "4421", items, ...t, refunded, timeline: tl };
};

export const seedOrders: Order[] = [
  seedOrder(1042, 3, "Sara Al-Amin", "sara@nuzha.app", [seedItem("p1", "Sand", 1, "130 × 180"), seedItem("p5", "Off-white", 2)], "paid", "mada"),
  seedOrder(1041, 9, "Omar Haddad", "omar@example.com", [seedItem("p9", "Natural", 1, "40 × 30"), seedItem("p15", "Natural", 1)], "shipped", "card"),
  seedOrder(1040, 20, "Lina Farah", "lina@example.com", [seedItem("p5", "Ink", 1)], "paid", "applepay"),
  seedOrder(1039, 30, "Yousef Nasser", "yousef@example.com", [seedItem("p3", "Natural", 1, "160 × 230")], "fulfilled", "mada"),
  seedOrder(1038, 44, "Noor Khalid", "noor@example.com", [seedItem("p1", "Olive", 1, "150 × 220")], "paid", "card"),
  seedOrder(1037, 52, "Ahmed Saleh", "ahmed@example.com", [seedItem("p10", "Natural", 1, "35 cm")], "cod", "cod"),
  seedOrder(1036, 70, "Maya Rashid", "maya@example.com", [seedItem("p2", "Sand", 1, "45 × 45")], "refunded", "mada", 95),
  seedOrder(1035, 80, "Hassan Ali", "hassan@example.com", [seedItem("p14", "Off-white", 1)], "fulfilled", "applepay"),
];

interface State {
  hydrated: boolean; markHydrated: () => void;
  cart: CartLine[]; cartOpen: boolean; discountCode: string;
  orders: Order[]; theme: ThemeId; settings: Settings; overrides: Record<string, ProductOverride>;
  addToCart: (productId: string, colour: string, size: string | undefined, qty: number) => void;
  setQty: (key: string, qty: number) => void; removeLine: (key: string) => void; clearCart: () => void;
  openCart: () => void; closeCart: () => void; setDiscount: (code: string) => void;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status" | "refunded" | "timeline">) => Order;
  fulfil: (id: number) => void; ship: (id: number) => void;
  refund: (id: number, amount: number, reason: string, restock: boolean) => void;
  addNote: (id: number, note: string) => void;
  setTheme: (t: ThemeId) => void; setSettings: (s: Partial<Settings>) => void; setPayment: (m: keyof Settings["payments"], on: boolean) => void;
  setOverride: (id: string, o: ProductOverride) => void;
  resetAll: () => void;
}

const defaultSettings: Settings = { payments: { mada: true, card: true, applepay: true, cod: true, tabby: false }, locales: { ar: true }, freeShippingOver: FREE_SHIPPING_OVER, storeName: "Nuzha · Riyadh" };

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false, markHydrated: () => set({ hydrated: true }),
      cart: [], cartOpen: false, discountCode: "",
      orders: seedOrders, theme: "arcade-light", settings: defaultSettings, overrides: {},
      addToCart: (productId, colour, size, qty) => set((s) => {
        const key = `${productId}|${colour}|${size ?? ""}`;
        const existing = s.cart.find((l) => l.key === key);
        const cart = existing ? s.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...s.cart, { key, productId, colour, size, qty }];
        return { cart, cartOpen: true };
      }),
      setQty: (key, qty) => set((s) => ({ cart: qty <= 0 ? s.cart.filter((l) => l.key !== key) : s.cart.map((l) => (l.key === key ? { ...l, qty } : l)) })),
      removeLine: (key) => set((s) => ({ cart: s.cart.filter((l) => l.key !== key) })),
      clearCart: () => set({ cart: [], discountCode: "" }),
      openCart: () => set({ cartOpen: true }), closeCart: () => set({ cartOpen: false }),
      setDiscount: (code) => set({ discountCode: code }),
      placeOrder: (o) => {
        const id = Math.max(1042, ...get().orders.map((x) => x.id)) + 1;
        const at = new Date().toISOString();
        const timeline: TimelineEvent[] = [{ at, title: "Order placed", detail: `web (${o.locale.toUpperCase()})` }];
        if (o.payment !== "cod") timeline.push({ at, title: "Payment captured", detail: o.payment === "mada" ? "Mada" : o.payment === "card" ? `Card •••• ${o.cardLast4}` : "Apple Pay" });
        timeline.push({ at, title: "Confirmation sent", detail: "email + SMS" });
        const order: Order = { ...o, id, createdAt: at, status: o.payment === "cod" ? "cod" : "paid", refunded: 0, timeline };
        const overrides = { ...get().overrides };
        for (const it of o.items) { const cur = overrides[it.productId]?.stock ?? byId(it.productId)?.stock ?? 0; overrides[it.productId] = { ...overrides[it.productId], stock: Math.max(0, cur - it.qty) }; }
        set((s) => ({ orders: [order, ...s.orders], cart: [], discountCode: "", cartOpen: false, overrides }));
        return order;
      },
      fulfil: (id) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: "fulfilled", timeline: [...o.timeline, { at: new Date().toISOString(), title: "Packed", detail: "Riyadh warehouse" }] } : o)) })),
      ship: (id) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: "shipped", timeline: [...o.timeline, { at: new Date().toISOString(), title: "Shipped", detail: "Aramex · label created" }] } : o)) })),
      refund: (id, amount, reason, restock) => set((s) => {
        const overrides = { ...s.overrides };
        const orders = s.orders.map((o) => {
          if (o.id !== id) return o;
          const refunded = Math.min(o.total, o.refunded + amount);
          if (restock) for (const it of o.items) { const cur = overrides[it.productId]?.stock ?? byId(it.productId)?.stock ?? 0; overrides[it.productId] = { ...overrides[it.productId], stock: cur + it.qty }; }
          const status: OrderStatus = refunded >= o.total - 0.005 ? "refunded" : "partially_refunded";
          return { ...o, refunded, status, timeline: [...o.timeline, { at: new Date().toISOString(), title: status === "refunded" ? "Refunded" : "Partial refund", detail: `${amount.toFixed(2)} · ${reason}${restock ? " · restocked" : ""}` }] };
        });
        return { orders, overrides };
      }),
      addNote: (id, note) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, note, timeline: [...o.timeline, { at: new Date().toISOString(), title: "Note added", detail: note }] } : o)) })),
      setTheme: (theme) => set({ theme }),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setPayment: (m, on) => set((s) => ({ settings: { ...s.settings, payments: { ...s.settings.payments, [m]: on } } })),
      setOverride: (id, o) => set((s) => ({ overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...o } } })),
      resetAll: () => set({ cart: [], cartOpen: false, discountCode: "", orders: seedOrders, theme: "arcade-light", settings: defaultSettings, overrides: {} }),
    }),
    {
      name: "nuzha-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, discountCode: s.discountCode, orders: s.orders, theme: s.theme, settings: s.settings, overrides: s.overrides }),
      onRehydrateStorage: () => (state) => { state?.markHydrated(); },
    }
  )
);

/** Effective product data: catalogue + admin overrides. */
export const useProduct = (id: string) => {
  const o = useStore((s) => s.overrides[id]);
  const p = byId(id);
  if (!p) return undefined;
  return { ...p, price: o?.price ?? p.price, stock: o?.stock ?? p.stock, name: { en: o?.nameEn ?? p.name.en, ar: o?.nameAr ?? p.name.ar }, status: o?.status ?? "active" };
};
export const effectiveProducts = (overrides: Record<string, ProductOverride>) =>
  products.map((p) => { const o = overrides[p.id]; return { ...p, price: o?.price ?? p.price, stock: o?.stock ?? p.stock, name: { en: o?.nameEn ?? p.name.en, ar: o?.nameAr ?? p.name.ar }, status: o?.status ?? "active" as const }; });
