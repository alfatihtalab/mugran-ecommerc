"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Row, useCartTotals } from "./CartDrawer";
import { SmartImage } from "./SmartImage";
import { Stepper } from "./Stepper";
import { Button, Checkbox, Input, Radio } from "./ui";
import { byId } from "@/lib/catalog";
import { money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { computeTotals, useStore, type PaymentMethod, type ShippingMethod } from "@/lib/store";

export function CheckoutView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const overrides = useStore((s) => s.overrides);
  const settings = useStore((s) => s.settings);
  const discountCode = useStore((s) => s.discountCode);
  const setDiscount = useStore((s) => s.setDiscount);
  const placeOrder = useStore((s) => s.placeOrder);
  const { pct } = useCartTotals();

  const [step, setStep] = useState(1);
  const [f, setF] = useState({ email: "", phone: "", name: "", line1: "", city: "Dubai", postal: "Jumeirah" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const enabledPay = (["card", "applepay", "tabby", "cod"] as PaymentMethod[]).filter((m) => settings.payments[m]);
  const [payment, setPayment] = useState<PaymentMethod>(enabledPay[0] ?? "tabby");
  const [card, setCard] = useState({ number: "4421 0000 0000 8830", expiry: "09 / 28", cvc: "123" });
  const [terms, setTerms] = useState(true);
  const [code, setCode] = useState(discountCode);
  const [codeMsg, setCodeMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (!hydrated) return <div className="min-h-[60vh]" />;
  const lines = cart.map((l) => { const p = byId(l.productId)!; return { line: l, p, price: overrides[p.id]?.price ?? p.price }; });
  if (lines.length === 0) return (
    <div className="mx-auto flex max-w-[1100px] flex-col items-start gap-4 px-5 py-20 md:px-16"><p className="text-ink-2">{d.cart.empty}</p><Button href={`/${locale}/collections/all`}>{d.cart.continue}</Button></div>
  );
  const totals = computeTotals(lines.map((x) => ({ price: x.price, qty: x.line.qty })), shipping, step === 3 ? payment : null, pct, settings.freeShippingOver);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const validate1 = () => { const e: Record<string, string> = {}; if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = d.checkout.invalidEmail; if (!f.phone.trim()) e.phone = d.checkout.required; setErrors(e); return Object.keys(e).length === 0; };
  const validate2 = () => { const e: Record<string, string> = {}; for (const k of ["name", "line1", "city", "postal"] as const) if (!f[k].trim()) e[k] = d.checkout.required; setErrors(e); return Object.keys(e).length === 0; };
  const applyCode = () => { const ok = code.trim().toUpperCase() === "NUZHA10"; setDiscount(ok ? code.trim() : ""); setCodeMsg(ok ? d.checkout.discountApplied : d.checkout.discountInvalid); };
  const pay = () => {
    if (!terms) return;
    setBusy(true);
    setTimeout(() => {
      const order = placeOrder({
        locale, customer: { name: f.name, email: f.email, phone: f.phone }, address: { line1: f.line1, city: f.city, postal: f.postal }, shipping, payment,
        cardLast4: payment === "card" ? card.number.replace(/\s/g, "").slice(-4) : undefined,
        items: lines.map(({ line, p, price }) => ({ productId: p.id, name: p.name.en, colour: line.colour, size: line.size, qty: line.qty, price, image: p.images[0] })),
        ...totals,
      });
      router.push(`/${locale}/orders/${order.id}`);
    }, 900);
  };
  const methodFee = (m: ShippingMethod) => (m === "express" ? money(25, locale) : d.cart.free);
  const methodKeys: ShippingMethod[] = ["standard", "express", "pickup"];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-16 md:py-12">
      <div className="max-w-[640px]"><Stepper steps={d.checkout.steps} current={step} /></div>
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_480px] md:gap-16">
        <div className="flex flex-col gap-6">
          {step > 1 && (
            <div className="flex items-center justify-between rounded-md border border-line bg-surface p-5">
              <div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.checkout.contact}</div><div className="mt-1 text-sm text-ink">{f.email} · <span className="num">{f.phone}</span></div></div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>{d.checkout.change}</Button>
            </div>
          )}
          {step > 2 && (
            <div className="flex items-center justify-between rounded-md border border-line bg-surface p-5">
              <div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.checkout.shipTo}</div><div className="mt-1 text-sm text-ink">{f.line1}, {f.city} <span className="num">{f.postal}</span> · {d.checkout.methods[methodKeys.indexOf(shipping)][0]} ({methodFee(shipping)})</div></div>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>{d.checkout.change}</Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
              <h2 className="font-display text-2xl text-ink">{d.checkout.contact}</h2>
              <Input label={d.checkout.email} type="email" value={f.email} onChange={set("email")} placeholder="name@example.com" helper={d.checkout.emailHelp} error={errors.email} autoFocus />
              <Input label={d.checkout.phone} type="tel" value={f.phone} onChange={set("phone")} placeholder="+971 5x xxx xxxx" helper={d.checkout.phoneHelp} error={errors.phone} />
              <div className="flex justify-end pt-2"><Button onClick={() => validate1() && setStep(2)}>{d.checkout.continueShipping}</Button></div>
            </div>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
                <h2 className="font-display text-2xl text-ink">{d.checkout.shippingAddress}</h2>
                <Input label={d.checkout.fullName} value={f.name} onChange={set("name")} error={errors.name} autoFocus />
                <Input label={d.checkout.address} value={f.line1} onChange={set("line1")} error={errors.line1} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label={d.checkout.city} value={f.city} onChange={set("city")} error={errors.city} />
                  <Input label={d.checkout.postal} value={f.postal} onChange={set("postal")} error={errors.postal} />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-6">
                <h2 className="font-display text-2xl text-ink">{d.checkout.shippingMethod}</h2>
                {methodKeys.map((m, i) => (
                  <button key={m} onClick={() => setShipping(m)} className={`flex items-center gap-3 rounded-sm border p-4 text-start ${shipping === m ? "border-[1.5px] border-accent bg-accent-subtle" : "border-line bg-surface"}`}>
                    <Radio on={shipping === m} />
                    <div className="flex-1"><div className="text-sm font-medium text-ink">{d.checkout.methods[i][0]}</div><div className="text-sm text-ink-2">{d.checkout.methods[i][1]}</div></div>
                    <div className="num text-sm text-ink">{methodFee(m)}</div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between"><Button variant="ghost" onClick={() => setStep(1)}>← {d.checkout.back}</Button><Button onClick={() => validate2() && setStep(3)}>{d.checkout.continuePayment}</Button></div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-6">
                <h2 className="font-display text-2xl text-ink">{d.checkout.paymentMethod}</h2>
                {enabledPay.map((m) => (
                  <div key={m}>
                    <button onClick={() => setPayment(m)} className={`flex w-full items-center gap-3 rounded-sm border p-4 text-start ${payment === m ? "border-[1.5px] border-accent bg-accent-subtle" : "border-line bg-surface"}`}>
                      <Radio on={payment === m} />
                      <div className="flex-1"><div className="text-sm font-medium text-ink">{d.checkout.pay[m][0]}</div><div className="text-sm text-ink-2">{d.checkout.pay[m][1]}</div></div>
                    </button>
                    {payment === m && m === "card" && (
                      <div className="mt-3 flex flex-col gap-4 px-2">
                        <Input label={d.checkout.cardNumber} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} inputMode="numeric" className="num" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label={d.checkout.expiry} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className="num" />
                          <Input label={d.checkout.cvc} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} type="password" className="num" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Checkbox on={terms} onChange={setTerms} label={d.checkout.terms} />
              <div className="flex items-center justify-between"><Button variant="ghost" onClick={() => setStep(2)}>← {d.checkout.back}</Button><Button onClick={pay} disabled={busy || !terms}>{busy ? d.checkout.processing : `${d.checkout.payNow} ${money(totals.total, locale)}`}</Button></div>
            </>
          )}
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-md border border-line bg-surface p-6">
          <h2 className="font-display text-2xl text-ink">{d.checkout.summary}</h2>
          <div>
            {lines.map(({ line, p, price }) => (
              <div key={line.key} className="flex items-center gap-4 border-b border-line py-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-highlight-subtle"><SmartImage src={p.images[0]} alt="" seed={p.slug} /></div>
                <div className="flex-1"><div className="text-sm font-medium text-ink">{p.name[locale]}</div><div className="text-sm text-ink-2">{p.colours.find((c) => c.name.en === line.colour)?.name[locale]}{line.size ? ` · ${line.size}` : ""} · <span className="num">× {line.qty}</span></div></div>
                <div className="num text-sm text-ink">{money(price * line.qty, locale)}</div>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Input label={d.checkout.discount} value={code} onChange={(e) => setCode(e.target.value)} className="flex-1" helper={codeMsg || " "} placeholder="NUZHA10" />
            <Button variant="secondary" onClick={applyCode} className="mb-7">{d.checkout.apply}</Button>
          </div>
          <Row l={d.cart.subtotal} v={money(totals.subtotal, locale)} />
          {totals.discount > 0 && <Row l={d.checkout.discount} v={`− ${money(totals.discount, locale)}`} />}
          <Row l={d.cart.shipping} v={totals.shippingFee === 0 ? d.cart.free : money(totals.shippingFee, locale)} />
          {totals.codFee > 0 && <Row l={d.checkout.codFee} v={money(totals.codFee, locale)} />}
          <Row l={d.cart.vat} v={money(totals.vat, locale)} />
          <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-sm font-medium">{d.cart.total}</span><span className="num font-display text-2xl">{money(totals.total, locale)}</span></div>
        </aside>
      </div>
    </div>
  );
}
