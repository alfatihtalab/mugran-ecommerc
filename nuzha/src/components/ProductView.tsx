"use client";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { SmartImage } from "./SmartImage";
import { Badge, Button } from "./ui";
import { categoryBySlug, related } from "@/lib/catalog";
import { money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { useProduct, useStore } from "@/lib/store";

export function ProductView({ locale, id }: { locale: Locale; id: string }) {
  const d = t(locale);
  const p = useProduct(id);
  const addToCart = useStore((s) => s.addToCart);
  const [img, setImg] = useState(0);
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<number | null>(0);
  const [added, setAdded] = useState(false);
  if (!p) return null;
  const sold = p.stock <= 0;
  const cat = categoryBySlug(p.category)!;
  const add = () => { addToCart(p.id, p.colours[colour].name.en, p.sizes?.[size], qty); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  const acc = [[d.product.details, p.care[locale]], [d.product.shipping, d.product.shippingBody], [d.product.workshop, d.product.workshopBody]];
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-16 md:py-10">
      <div className="mb-6 text-xs text-ink-2"><Link href={`/${locale}`}>{d.collection.home}</Link> / <Link href={`/${locale}/collections/${cat.slug}`}>{cat.name[locale]}</Link> / {p.name[locale]}</div>
      <div className="grid gap-10 md:grid-cols-[minmax(0,640px)_1fr] md:gap-16">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-md bg-highlight-subtle"><SmartImage key={img} src={p.images[img]} alt={p.name[locale]} seed={p.slug + img} className="animate-fade" /></div>
          <div className="grid grid-cols-4 gap-3">
            {p.images.map((src, i) => <button key={src} onClick={() => setImg(i)} className={`aspect-square overflow-hidden rounded-md bg-highlight-subtle ${i === img ? "ring-2 ring-line-strong" : ""}`}><SmartImage src={src} alt="" seed={p.slug + i} /></button>)}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {sold ? <Badge tone="neutral">{d.product.soldOut}</Badge> : p.badge === "limited" ? <Badge tone="highlight">{d.product.limited} · {p.stock} {d.product.left}</Badge> : p.badge === "new" ? <Badge>{d.product.new}</Badge> : null}
            <h1 className="font-display text-4xl font-light text-ink md:text-5xl">{p.name[locale]}</h1>
            <p className="max-w-lg text-ink-2">{p.description[locale]}</p>
            <div className="flex items-baseline gap-3">
              <span className="num font-display text-2xl text-ink">{money(p.price, locale)}</span>
              {p.compareAt && <span className="num text-ink-2 line-through">{money(p.compareAt, locale)}</span>}
              <span className="text-sm text-ink-2">{d.product.inclVat}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.product.colour} · {p.colours[colour].name[locale]}</div>
            <div className="flex gap-2">{p.colours.map((c, i) => <button key={c.hex} aria-label={c.name[locale]} onClick={() => setColour(i)} className={`h-7 w-7 rounded-full border ${i === colour ? "border-2 border-line-strong" : "border-line"}`} style={{ background: c.hex }} />)}</div>
          </div>
          {p.sizes && (
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3"><span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">{d.product.size}</span><span className="text-xs font-medium text-accent">{d.product.sizeGuide}</span></div>
              <div className="flex flex-wrap gap-2">{p.sizes.map((s, i) => <button key={s} onClick={() => setSize(i)} className={`num rounded-sm px-4 py-2 text-xs font-medium ${i === size ? "bg-inverse text-ink-inv" : "border border-line-strong bg-surface text-ink"}`}>{s}</button>)}</div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-4 rounded-full border-[1.5px] border-line-strong px-4 py-3 text-sm">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button><span className="num min-w-4 text-center font-medium">{qty}</span><button aria-label="Increase" onClick={() => setQty((q) => Math.min(p.stock, q + 1))}>+</button>
            </div>
            <Button className="flex-1" disabled={sold} onClick={add}>{added ? `✓ ${d.product.added}` : sold ? d.product.soldOut : `${d.product.addToCart} · ${money(p.price * qty, locale)}`}</Button>
          </div>
          <Button variant="secondary" href={`/${locale}/checkout`} className="w-full">{d.product.buyNow}</Button>
          <div className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4 text-sm text-ink">{d.product.promises.map((x) => <div key={x}>✓&nbsp; {x}</div>)}</div>
          <div>
            {acc.map(([h, b], i) => (
              <div key={h} className="border-b border-line py-4">
                <button className="flex w-full items-center justify-between text-sm font-medium text-ink" onClick={() => setOpen(open === i ? null : i)}><span>{h}</span><span className="text-ink-2">{open === i ? "−" : "+"}</span></button>
                {open === i && <p className="animate-slide-down mt-3 max-w-lg text-sm text-ink-2">{b}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="mt-16 flex flex-col gap-6">
        <h2 className="font-display text-3xl text-ink">{d.product.alsoLike}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">{related(p).map((r, i) => <ProductCard key={r.id} id={r.id} locale={locale} index={i} />)}</div>
      </section>
    </div>
  );
}
