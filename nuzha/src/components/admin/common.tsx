"use client";
import { Badge } from "@/components/ui";
import type { OrderStatus } from "@/lib/store";

export const statusLabel: Record<OrderStatus, string> = { paid: "Paid", cod: "Cash on delivery", fulfilled: "Fulfilled", shipped: "Shipped", refunded: "Refunded", partially_refunded: "Partially refunded" };
export function StatusBadge({ s }: { s: OrderStatus }) {
  const tone = s === "paid" || s === "fulfilled" || s === "shipped" ? "secondary" : s === "cod" ? "highlight" : "error";
  return <Badge tone={tone}>{statusLabel[s]}</Badge>;
}
export function Panel({ title, action, children, className = "" }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-4 rounded-md border border-line bg-surface p-6 ${className}`}>
      {(title || action) && <div className="flex items-center justify-between gap-3"><h2 className="font-display text-2xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{title}</h2>{action}</div>}
      {children}
    </section>
  );
}
export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 text-sm"><span className="text-ink-2">{k}</span><span className="num text-end text-ink">{v}</span></div>;
}
export const payLabel = (p: string, last4?: string) => (p === "cod" ? "Cash on delivery" : `${p === "mada" ? "Mada" : p === "card" ? "Card" : "Apple Pay"}${last4 ? ` •••• ${last4}` : ""}`);
