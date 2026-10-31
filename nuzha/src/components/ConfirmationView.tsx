"use client";
import { Row } from "./CartDrawer";
import { SmartImage } from "./SmartImage";
import { Badge, Button } from "./ui";
import { byId } from "@/lib/catalog";
import { money } from "@/lib/format";
import { fill, t, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function ConfirmationView({ locale, id }: { locale: Locale; id: number }) {
  const d = t(locale);
  const hydrated = useStore((s) => s.hydrated);
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  if (!hydrated) return <div className="min-h-[60vh]" />;
  if (!order) return <div className="mx-auto max-w-[640px] px-5 py-20 text-center text-ink-2">{d.confirmation.notFound}</div>;
  const first = order.customer.name.split(" ")[0];
  const payLabel = order.payment === "cod" ? d.status.cod : `${d.confirmation.paid} · ${order.payment === "applepay" ? "Apple Pay" : order.payment === "mada" ? "Mada" : "Card"}${order.cardLast4 ? ` •••• ${order.cardLast4}` : ""}`;
  const arrive = new Date(order.createdAt); arrive.setDate(arrive.getDate() + (order.shipping === "express" ? 1 : 3));
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-8 px-5 py-16 md:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-2xl text-on-accent">✓</div>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-5xl font-light text-ink">{fill(d.confirmation.thanks, { name: first })}</h1>
        <p className="max-w-md text-ink-2">{fill(d.confirmation.body, { id: order.id, email: order.customer.email })}</p>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-md border border-line bg-surface p-6">
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-ink">{d.confirmation.order} <span className="num">#{order.id}</span></h2><Badge tone="secondary">{payLabel}</Badge></div>
        <div>
          {order.items.map((it) => { const p = byId(it.productId); return (
            <div key={it.productId + it.colour + it.size} className="flex items-center gap-4 border-b border-line py-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-highlight-subtle"><SmartImage src={it.image} alt="" seed={p?.slug} /></div>
              <div className="flex-1"><div className="text-sm font-medium text-ink">{p?.name[locale] ?? it.name}</div><div className="text-sm text-ink-2">{p?.colours.find((c) => c.name.en === it.colour)?.name[locale] ?? it.colour}{it.size ? ` · ${it.size}` : ""} · <span className="num">× {it.qty}</span></div></div>
              <div className="num text-sm">{money(it.price * it.qty, locale)}</div>
            </div>); })}
        </div>
        <Row l={d.cart.subtotal} v={money(order.subtotal, locale)} />
        {order.discount > 0 && <Row l={d.checkout.discount} v={`− ${money(order.discount, locale)}`} />}
        <Row l={d.cart.shipping} v={order.shippingFee === 0 ? d.cart.free : money(order.shippingFee, locale)} />
        {order.codFee > 0 && <Row l={d.checkout.codFee} v={money(order.codFee, locale)} />}
        <Row l={d.cart.vat} v={money(order.vat, locale)} />
        <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-sm font-medium">{d.confirmation.totalPaid}</span><span className="num font-display text-2xl">{money(order.total, locale)}</span></div>
      </div>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <div className="rounded-md border border-line bg-surface p-6"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.confirmation.deliveringTo}</div><div className="mt-2 text-sm text-ink">{order.customer.name}<br />{order.address.line1}<br />{order.address.city} <span className="num">{order.address.postal}</span></div></div>
        <div className="rounded-md border border-line bg-surface p-6"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.confirmation.arrival}</div><div className="mt-2 text-sm text-ink">{new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", { weekday: "short", day: "numeric", month: "short" }).format(arrive)}<br /><span className="text-ink-2">{d.checkout.methods[["standard", "express", "pickup"].indexOf(order.shipping)][0]}</span></div></div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <h2 className="font-display text-2xl text-ink">{d.confirmation.next}</h2>
        {d.confirmation.steps.map(([h, b], i) => (
          <div key={h} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === 0 ? "bg-success text-on-accent" : i === 1 ? "bg-accent" : "bg-muted"}`}>{i === 0 ? "✓" : ""}</span>
            <div><div className={`text-sm font-medium ${i > 1 ? "text-ink-2" : "text-ink"}`}>{h}</div><div className="text-sm text-ink-2">{b}</div></div>
          </div>
        ))}
      </div>
      <div className="flex gap-3"><Button href={`/${locale}/account`}>{d.confirmation.track}</Button><Button variant="ghost" href={`/${locale}/collections/all`}>{d.confirmation.continue}</Button></div>
    </div>
  );
}
