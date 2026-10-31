"use client";
import Link from "next/link";
import { useEffect } from "react";
import { SmartImage } from "./SmartImage";
import { Button } from "./ui";
import { money } from "@/lib/format";
import { fill, t, type Locale } from "@/lib/i18n";
import { computeTotals, useProduct, useStore, type CartLine, type ProductOverride } from "@/lib/store";
import { byId } from "@/lib/catalog";

export function CartLineRow({ line, locale, compact = false }: { line: CartLine; locale: Locale; compact?: boolean }) {
  const p = useProduct(line.productId);
  const setQty = useStore((s) => s.setQty);
  const removeLine = useStore((s) => s.removeLine);
  const d = t(locale);
  if (!p) return null;
  const colour = p.colours.find((c) => c.name.en === line.colour);
  return (
    <div className="flex items-start gap-4 border-b border-line py-4">
      <Link href={`/${locale}/products/${p.slug}`} className={`shrink-0 overflow-hidden rounded-sm bg-highlight-subtle ${compact ? "h-[72px] w-[72px]" : "h-24 w-24"}`}>
        <SmartImage src={p.images[0]} alt={p.name[locale]} seed={p.slug} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/${locale}/products/${p.slug}`} className="text-sm font-medium text-ink">{p.name[locale]}</Link>
        <div className="text-sm text-ink-2">{colour?.name[locale] ?? line.colour}{line.size ? ` · ${line.size}` : ""}</div>
        <div className="mt-1 flex items-center gap-3">
          <div className="inline-flex items-center gap-3 rounded-full border border-line-strong px-3 py-0.5 text-sm">
            <button aria-label="Decrease" onClick={() => setQty(line.key, line.qty - 1)}>−</button>
            <span className="num min-w-3 text-center">{line.qty}</span>
            <button aria-label="Increase" onClick={() => setQty(line.key, Math.min(line.qty + 1, Math.max(1, p.stock)))}>+</button>
          </div>
          <button onClick={() => removeLine(line.key)} className="text-xs text-ink-2 underline-offset-2 hover:underline">{d.cart.remove}</button>
        </div>
      </div>
      <div className="num text-sm text-ink">{money(p.price * line.qty, locale)}</div>
    </div>
  );
}

export function useCartTotals() {
  const cart = useStore((s) => s.cart);
  const overrides = useStore((s) => s.overrides);
  const discountCode = useStore((s) => s.discountCode);
  const freeOver = useStore((s) => s.settings.freeShippingOver);
  const lines = cart.map((l) => { const p = withOverride(l.productId, overrides); return { price: p?.price ?? 0, qty: l.qty }; });
  const pct = discountCode.toUpperCase() === "NUZHA10" ? 0.1 : 0;
  return { totals: computeTotals(lines, "standard", null, pct, freeOver), pct, count: cart.reduce((n, l) => n + l.qty, 0), freeOver };
}
function withOverride(id: string, overrides: Record<string, ProductOverride>) { const p = byId(id); if (!p) return undefined; return { ...p, price: overrides[id]?.price ?? p.price }; }

export function CartDrawer({ locale }: { locale: Locale }) {
  const open = useStore((s) => s.cartOpen);
  const close = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const d = t(locale);
  const { totals, count, freeOver } = useCartTotals();
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && close(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [close]);
  if (!hydrated || !open) return null;
  const remaining = Math.max(0, freeOver - (totals.subtotal - totals.discount));
  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade absolute inset-0 bg-inverse/40" onClick={close} />
      <aside className="animate-slide-end absolute top-0 bottom-0 end-0 flex w-full max-w-[480px] flex-col bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl text-ink">{d.cart.title} · <span className="num">{count}</span></h2>
          <button onClick={close} className="p-2 text-ink-2" aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-ink-2">{d.cart.empty}</div>
          ) : (
            <>
              <div className="mt-4 rounded-sm bg-success-subtle px-4 py-3 text-xs font-medium text-success">
                {remaining <= 0 ? d.cart.freeShippingUnlocked : fill(d.cart.freeShippingRemaining, { n: money(remaining, locale) })}
                <div className="mt-2 h-1 w-full rounded-full bg-success/20"><div className="h-1 rounded-full bg-success" style={{ width: `${Math.min(100, ((totals.subtotal - totals.discount) / freeOver) * 100)}%` }} /></div>
              </div>
              {cart.map((l) => <CartLineRow key={l.key} line={l} locale={locale} compact />)}
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 bg-page px-6 py-6">
          <Row l={d.cart.subtotal} v={money(totals.subtotal, locale)} />
          {totals.discount > 0 && <Row l={d.checkout.discount} v={`− ${money(totals.discount, locale)}`} />}
          <Row l={d.cart.shipping} v={totals.shippingFee === 0 ? d.cart.free : money(totals.shippingFee, locale)} />
          <Row l={d.cart.vat} v={money(totals.vat, locale)} />
          <div className="flex items-baseline justify-between pt-1"><span className="text-sm font-medium text-ink">{d.cart.total}</span><span className="num font-display text-2xl text-ink">{money(totals.total, locale)}</span></div>
          <Button href={`/${locale}/checkout`} className="w-full" onClick={close} {...(cart.length === 0 ? { "aria-disabled": true } : {})}>{d.cart.checkout} · {money(totals.total, locale)}</Button>
          <Button variant="ghost" className="w-full" onClick={close}>{d.cart.continue}</Button>
        </div>
      </aside>
    </div>
  );
}

export function Row({ l, v, strong = false }: { l: string; v: string; strong?: boolean }) {
  return <div className="flex justify-between text-sm"><span className={strong ? "font-medium text-ink" : "text-ink-2"}>{l}</span><span className="num text-ink">{v}</span></div>;
}
