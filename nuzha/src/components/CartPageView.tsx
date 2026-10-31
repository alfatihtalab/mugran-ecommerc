"use client";
import { CartLineRow, Row, useCartTotals } from "./CartDrawer";
import { Button } from "./ui";
import { money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function CartPageView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const { totals, count } = useCartTotals();
  if (!hydrated) return <div className="min-h-[50vh]" />;
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-16">
      <h1 className="font-display text-4xl text-ink">{d.cart.title} · <span className="num">{count}</span></h1>
      {cart.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4"><p className="text-ink-2">{d.cart.empty}</p><Button href={`/${locale}/collections/all`}>{d.cart.continue}</Button></div>
      ) : (
        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_360px]">
          <div>{cart.map((l) => <CartLineRow key={l.key} line={l} locale={locale} />)}</div>
          <div className="flex h-fit flex-col gap-3 rounded-md border border-line bg-surface p-6">
            <Row l={d.cart.subtotal} v={money(totals.subtotal, locale)} />
            <Row l={d.cart.shipping} v={totals.shippingFee === 0 ? d.cart.free : money(totals.shippingFee, locale)} />
            <Row l={d.cart.vat} v={money(totals.vat, locale)} />
            <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-sm font-medium">{d.cart.total}</span><span className="num font-display text-2xl">{money(totals.total, locale)}</span></div>
            <Button href={`/${locale}/checkout`} className="w-full">{d.cart.checkout}</Button>
            <Button href={`/${locale}/collections/all`} variant="ghost" className="w-full">{d.cart.continue}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
