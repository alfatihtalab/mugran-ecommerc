"use client";
import { Panel } from "./common";
import { Badge, Button } from "@/components/ui";
import { dateFmt, num } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CustomersView() {
  const orders = useStore((s) => s.orders); const hydrated = useStore((s) => s.hydrated);
  if (!hydrated) return null;
  const map = new Map<string, { name: string; email: string; phone: string; orders: number; spent: number; last: string }>();
  for (const o of orders) { const c = map.get(o.customer.email) ?? { ...o.customer, orders: 0, spent: 0, last: o.createdAt }; c.orders++; c.spent += o.total - o.refunded; if (o.createdAt > c.last) c.last = o.createdAt; map.set(o.customer.email, c); }
  const list = [...map.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
  return (
    <Panel title={`Customers · ${list.length}`} action={<Button variant="secondary" size="sm">Export</Button>}>
      <div className="overflow-x-auto rounded-sm border border-line"><table className="w-full text-sm"><thead><tr className="bg-muted text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2"><th className="px-4 py-2 text-start">Customer</th><th className="px-4 py-2 text-start">Phone</th><th className="px-4 py-2 text-start">Last order</th><th className="px-4 py-2 text-end">Orders</th><th className="px-4 py-2 text-end">Lifetime</th></tr></thead>
        <tbody>{list.map((c) => <tr key={c.email} className="border-t border-line"><td className="px-4 py-3"><div className="font-medium text-ink">{c.name}</div><div className="text-xs text-ink-2">{c.email}</div></td><td className="num px-4 py-3 text-ink-2">{c.phone}</td><td className="px-4 py-3 text-ink-2">{dateFmt(c.last)}</td><td className="num px-4 py-3 text-end">{c.orders}</td><td className="num px-4 py-3 text-end">{num(c.spent)}</td></tr>)}</tbody></table></div>
    </Panel>
  );
}

export function DiscountsView() {
  return (
    <Panel title="Discounts" action={<Button size="sm">Create discount</Button>}>
      {[["NUZHA10", "10% off the whole order · no minimum", "Active", "secondary"], ["WELCOME50", "50 SAR off first order over 300", "Scheduled · 15 Nov", "highlight"], ["RAMADAN20", "20% off textiles", "Expired", "neutral"]].map(([c, d, s, t]) => (
        <div key={c} className="flex items-center gap-4 border-b border-line py-3 last:border-0"><div className="flex-1"><div className="num text-sm font-medium text-ink">{c}</div><div className="text-sm text-ink-2">{d}</div></div><Badge tone={t as "secondary" | "highlight" | "neutral"}>{s}</Badge></div>
      ))}
      <p className="text-sm text-ink-2">Try NUZHA10 at checkout.</p>
    </Panel>
  );
}
