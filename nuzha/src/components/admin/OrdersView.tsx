"use client";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge, payLabel } from "./common";
import { Button, Checkbox, Chip } from "@/components/ui";
import { dateFmt, num } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function OrdersView({ locale }: { locale: Locale }) {
  const orders = useStore((s) => s.orders);
  const fulfil = useStore((s) => s.fulfil);
  const ship = useStore((s) => s.ship);
  const hydrated = useStore((s) => s.hydrated);
  const [tab, setTab] = useState<"all" | "unfulfilled" | "paid" | "refunds" | "cod">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<number[]>([]);
  if (!hydrated) return null;
  const base = `/${locale}/admin`;
  const list = orders.filter((o) => tab === "all" || (tab === "unfulfilled" && (o.status === "paid" || o.status === "cod")) || (tab === "paid" && o.status === "paid") || (tab === "refunds" && o.refunded > 0) || (tab === "cod" && o.payment === "cod"))
    .filter((o) => !q || `${o.id} ${o.customer.name} ${o.customer.email}`.toLowerCase().includes(q.toLowerCase()));
  const counts = { all: orders.length, unfulfilled: orders.filter((o) => o.status === "paid" || o.status === "cod").length, paid: orders.filter((o) => o.status === "paid").length, refunds: orders.filter((o) => o.refunded > 0).length, cod: orders.filter((o) => o.payment === "cod").length };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{([["all", "All"], ["unfulfilled", "Unfulfilled"], ["paid", "Paid"], ["refunds", "Refunds"], ["cod", "Cash on delivery"]] as const).map(([k, l]) => <Chip key={k} active={tab === k} onClick={() => setTab(k)}>{l} · {counts[k]}</Chip>)}</div>
        <div className="flex gap-2"><Button variant="secondary" size="sm">Export</Button><Button size="sm" href={`/${locale}`}>Create order in store</Button></div>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order, customer, email…" className="w-full max-w-sm rounded-sm border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-focus" />
      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-sm bg-accent-subtle px-4 py-2 text-sm"><span className="font-medium text-accent">{sel.length} selected</span>
          <Button variant="secondary" size="sm" onClick={() => { sel.forEach((id) => fulfil(id)); setSel([]); }}>Mark as fulfilled</Button>
          <Button variant="ghost" size="sm" onClick={() => { sel.forEach((id) => ship(id)); setSel([]); }}>Mark as shipped</Button>
          <Button variant="ghost" size="sm" onClick={() => setSel([])}>Clear</Button></div>
      )}
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full text-sm"><thead><tr className="bg-muted text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2"><th className="w-10 px-4 py-2" /><th className="px-4 py-2 text-start">Order</th><th className="px-4 py-2 text-start">Customer</th><th className="px-4 py-2 text-start">Date</th><th className="px-4 py-2 text-start">Payment</th><th className="px-4 py-2 text-start">Status</th><th className="px-4 py-2 text-end">Total</th></tr></thead>
          <tbody>{list.map((o) => (
            <tr key={o.id} className={`border-t border-line ${sel.includes(o.id) ? "bg-accent-subtle" : ""}`}>
              <td className="px-4 py-3"><Checkbox on={sel.includes(o.id)} onChange={(v) => setSel((s) => (v ? [...s, o.id] : s.filter((x) => x !== o.id)))} label="" /></td>
              <td className="num px-4 py-3"><Link href={`${base}/orders/${o.id}`} className="font-medium text-ink hover:text-accent">#{o.id}</Link></td>
              <td className="px-4 py-3"><div className="text-ink">{o.customer.name}</div><div className="text-xs text-ink-2">{o.customer.email}</div></td>
              <td className="px-4 py-3 text-ink-2">{dateFmt(o.createdAt)}</td>
              <td className="px-4 py-3 text-ink-2">{payLabel(o.payment, o.cardLast4)}</td>
              <td className="px-4 py-3"><StatusBadge s={o.status} /></td>
              <td className="num px-4 py-3 text-end">{num(o.total)}{o.refunded > 0 && <div className="text-xs text-error">− {num(o.refunded)}</div>}</td>
            </tr>))}</tbody></table>
        {list.length === 0 && <div className="p-8 text-center text-sm text-ink-2">No orders match.</div>}
      </div>
      <div className="text-sm text-ink-2">Showing {list.length} of {orders.length}</div>
    </div>
  );
}
