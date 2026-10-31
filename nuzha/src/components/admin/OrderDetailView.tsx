"use client";
import Link from "next/link";
import { useState } from "react";
import { KV, Panel, StatusBadge, payLabel } from "./common";
import { SmartImage } from "@/components/SmartImage";
import { Badge, Button, Checkbox, Input } from "@/components/ui";
import { byId } from "@/lib/catalog";
import { num, timeFmt } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function OrderDetailView({ locale, id }: { locale: Locale; id: number }) {
  const o = useStore((s) => s.orders.find((x) => x.id === id));
  const hydrated = useStore((s) => s.hydrated);
  const fulfil = useStore((s) => s.fulfil); const ship = useStore((s) => s.ship); const refund = useStore((s) => s.refund); const addNote = useStore((s) => s.addNote);
  const [showRefund, setShowRefund] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Customer changed mind");
  const [restock, setRestock] = useState(true);
  const [note, setNote] = useState("");
  if (!hydrated) return null;
  if (!o) return <div className="text-ink-2">Order not found. <Link href={`/${locale}/admin/orders`} className="text-accent">Back to orders</Link></div>;
  const remaining = Math.round((o.total - o.refunded) * 100) / 100;
  const amt = Math.min(remaining, Math.max(0, Number(amount) || 0));
  const canFulfil = o.status === "paid" || o.status === "cod";
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="num font-display text-3xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>Order #{o.id}</h2><StatusBadge s={o.status} />{canFulfil && <Badge tone="highlight">Unfulfilled</Badge>}
          <span className="text-sm text-ink-2">Placed {timeFmt(o.createdAt)} · Web · {o.locale.toUpperCase()}</span>
        </div>
        <div className="flex gap-2">
          {remaining > 0 && <Button variant="secondary" size="sm" onClick={() => { setShowRefund(true); setAmount(String(remaining)); }}>Refund</Button>}
          {canFulfil && <Button size="sm" onClick={() => fulfil(o.id)}>Fulfil items</Button>}
          {o.status === "fulfilled" && <Button size="sm" onClick={() => ship(o.id)}>Mark as shipped</Button>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <Panel title={`Items · ${o.items.reduce((n, i) => n + i.qty, 0)}`} action={<span className="text-xs text-ink-2">Dubai warehouse</span>}>
            {o.items.map((it) => { const p = byId(it.productId); return (
              <div key={it.productId + it.colour + it.size} className="flex items-center gap-4 text-sm">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-highlight-subtle"><SmartImage src={it.image} alt="" seed={p?.slug} /></div>
                <div className="flex-1"><div className="font-medium text-ink">{it.name}</div><div className="text-ink-2">{it.colour}{it.size ? ` · ${it.size}` : ""} · SKU {p?.sku}</div></div>
                <div className="num text-ink-2">{it.qty} × {num(it.price)}</div><div className="num w-20 text-end font-medium text-ink">{num(it.price * it.qty)}</div>
              </div>); })}
            <div className="border-t border-line pt-3"><KV k="Subtotal" v={num(o.subtotal)} />{o.discount > 0 && <KV k="Discount" v={`− ${num(o.discount)}`} />}<KV k="Shipping" v={o.shippingFee ? num(o.shippingFee) : "Free"} />{o.codFee > 0 && <KV k="COD fee" v={num(o.codFee)} />}<KV k="VAT 5%" v={num(o.vat)} /></div>
            <div className="flex items-baseline justify-between"><span className="text-sm font-medium">Total</span><span className="num font-display text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>{num(o.total)} AED</span></div>
            {o.refunded > 0 && <KV k="Refunded" v={<span className="text-error">− {num(o.refunded)}</span>} />}
          </Panel>
          <Panel title="Payment" action={<Badge tone={o.payment === "cod" ? "highlight" : "secondary"}>{o.payment === "cod" ? "Collect on delivery" : `Captured · ${payLabel(o.payment, o.cardLast4)}`}</Badge>}>
            <KV k="Charged" v={`${num(o.total)} on ${timeFmt(o.createdAt)}`} /><KV k="Gateway reference" v={`${o.payment}_ch_${o.id}8f21c3`} />
            {showRefund && remaining > 0 && (
              <div className="flex flex-col gap-4 rounded-sm border border-accent bg-page p-5">
                <div className="text-sm font-medium text-ink">Refund</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Amount (AED)" value={amount} onChange={(e) => setAmount(e.target.value)} helper={`Max ${num(remaining)} · back to ${payLabel(o.payment, o.cardLast4)}`} inputMode="decimal" className="num" />
                  <label className="flex flex-col gap-2"><span className="text-xs font-medium text-ink-2">Reason</span><select value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-sm border border-line bg-surface px-4 py-3 text-base">{["Customer changed mind", "Damaged in transit", "Wrong item sent", "Late delivery", "Other"].map((r) => <option key={r}>{r}</option>)}</select><span className="text-sm text-ink-2">Shown to the customer</span></label>
                </div>
                <Checkbox on={restock} onChange={setRestock} label="Restock the items to Dubai warehouse" />
                <div className="flex gap-2"><Button size="sm" disabled={amt <= 0} onClick={() => { refund(o.id, amt, reason, restock); setShowRefund(false); }}>Refund {num(amt)}</Button><Button variant="ghost" size="sm" onClick={() => setShowRefund(false)}>Cancel</Button></div>
              </div>
            )}
          </Panel>
        </div>
        <div className="flex flex-col gap-4">
          <Panel title="Customer"><div className="text-sm font-medium text-ink">{o.customer.name}</div><div className="text-sm text-ink-2">{o.customer.email}<br /><span className="num">{o.customer.phone}</span></div></Panel>
          <Panel title="Shipping"><div className="text-sm text-ink">{o.address.line1}<br />{o.address.postal}, {o.address.city}, United Arab Emirates</div><div className="text-sm text-ink-2">{o.shipping === "express" ? "Express · same day" : o.shipping === "pickup" ? "Pick up in store" : "Standard · 1–2 days"} · {o.shippingFee ? num(o.shippingFee) : "Free"}</div>{o.status === "shipped" ? <Badge tone="secondary">Label created · Aramex</Badge> : <Button variant="secondary" size="sm" onClick={() => ship(o.id)}>Create shipping label</Button>}</Panel>
          <Panel title="Timeline">
            {o.timeline.map((e, i) => <div key={i} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" /><div><div className="font-medium text-ink">{e.title}</div><div className="text-ink-2">{timeFmt(e.at)} · {e.detail}</div></div></div>)}
            <div className="flex gap-2 pt-2"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" className="flex-1 rounded-sm border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-focus" /><Button size="sm" variant="secondary" disabled={!note.trim()} onClick={() => { addNote(o.id, note.trim()); setNote(""); }}>Add</Button></div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
