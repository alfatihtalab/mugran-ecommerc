"use client";
import Link from "next/link";
import { KV, Panel, StatusBadge } from "./common";
import { Button } from "@/components/ui";
import { dateFmt, num } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { effectiveProducts, useStore } from "@/lib/store";

export function DashboardView({ locale }: { locale: Locale }) {
  const orders = useStore((s) => s.orders);
  const overrides = useStore((s) => s.overrides);
  const custom = useStore((s) => s.customProducts);
  const deleted = useStore((s) => s.deleted);
  const hydrated = useStore((s) => s.hydrated);
  if (!hydrated) return null;
  const base = `/${locale}/admin`;
  const revenue = orders.reduce((s, o) => s + o.total - o.refunded, 0);
  const refunds = orders.filter((o) => o.refunded > 0);
  const toFulfil = orders.filter((o) => o.status === "paid" || o.status === "cod");
  const live = effectiveProducts(overrides, custom, deleted);
  const low = live.filter((p) => p.stock > 0 && p.stock <= 3);
  const out = live.filter((p) => p.stock === 0);
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d; });
  const perDay = days.map((d) => orders.filter((o) => { const t = new Date(o.createdAt); return t >= d && t < new Date(d.getTime() + 86400000); }).reduce((s, o) => s + o.total, 0));
  const seeded = [62, 48, 70, 55, 80, 66, 90, 74, 58, 84, 96, 72, 88, 40].map((x) => x * 110);
  const bars = perDay.map((v, i) => v + seeded[i]);
  const max = Math.max(...bars);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink-2">{dateFmt(new Date().toISOString())} · Dubai store · last 14 days</div>
        <div className="flex gap-2"><Button variant="secondary" size="sm">Export</Button><Button size="sm" href={`/${locale}`}>View storefront</Button></div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[["Net revenue", num(revenue), `${orders.length} orders`], ["Orders", String(orders.length), `${toFulfil.length} to fulfil`], ["Average order", num(orders.length ? revenue / orders.length : 0), "net of refunds"], ["Refunds", `${refunds.length} · ${num(refunds.reduce((s, o) => s + o.refunded, 0))}`, "back to source"]].map(([l, v, s]) => (
          <div key={l} className="rounded-md border border-line bg-surface p-5"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{l}</div><div className="num mt-2 font-display text-3xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{v}</div><div className="mt-1 text-xs text-ink-2">{s}</div></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        <Panel title="Sales by day" action={<span className="text-xs text-ink-2">AED · gross</span>}>
          <div className="flex h-44 items-end gap-2">{bars.map((v, i) => <div key={i} title={num(v)} className={`flex-1 rounded-sm ${i === 13 ? "bg-accent" : "bg-secondary"}`} style={{ height: `${Math.max(6, (v / max) * 100)}%` }} />)}</div>
          <div className="flex justify-between text-xs text-ink-2">{[0, 4, 9, 13].map((i) => <span key={i}>{dateFmt(days[i].toISOString())}</span>)}</div>
        </Panel>
        <Panel title="Needs attention">
          {[[`${toFulfil.length} orders to fulfil`, toFulfil[0] ? `Oldest #${toFulfil[toFulfil.length - 1].id}` : "All caught up", "bg-accent", `${base}/orders`], [`${refunds.length} refunds processed`, refunds[0] ? `Latest #${refunds[0].id}` : "None", "bg-error", `${base}/orders`], [`${low.length} products low in stock`, low.map((p) => `${p.name.en} (${p.stock})`).join(", ") || "None", "bg-highlight", `${base}/products`], [`${out.length} products sold out`, out.map((p) => p.name.en).join(", ") || "None", "bg-line-strong", `${base}/products`]].map(([t, d, c, h]) => (
            <Link key={t} href={h} className="flex items-center gap-3 py-1 text-sm"><span className={`h-2 w-2 shrink-0 rounded-full ${c}`} /><div className="flex-1"><div className="font-medium text-ink">{t}</div><div className="text-ink-2">{d}</div></div><span className="text-ink-2">→</span></Link>
          ))}
        </Panel>
      </div>
      <Panel title="Recent orders" action={<Button variant="ghost" size="sm" href={`${base}/orders`}>View all orders</Button>}>
        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-sm"><thead><tr className="bg-muted text-start text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{["Order", "Customer", "Date", "Status", "Total"].map((h) => <th key={h} className="px-4 py-2 text-start font-semibold last:text-end">{h}</th>)}</tr></thead>
            <tbody>{orders.slice(0, 5).map((o) => <tr key={o.id} className="border-t border-line"><td className="num px-4 py-3"><Link href={`${base}/orders/${o.id}`} className="font-medium text-ink">#{o.id}</Link></td><td className="px-4 py-3">{o.customer.name}</td><td className="px-4 py-3 text-ink-2">{dateFmt(o.createdAt)}</td><td className="px-4 py-3"><StatusBadge s={o.status} /></td><td className="num px-4 py-3 text-end">{num(o.total)}</td></tr>)}</tbody></table>
        </div>
        <KV k="Deployment" v="Isolated · me-central-1 · v1.4.2 · healthy" />
      </Panel>
    </div>
  );
}
