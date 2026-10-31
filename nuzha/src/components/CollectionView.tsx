"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button, Chip, Checkbox, Overline } from "./ui";
import { categories, categoryBySlug } from "@/lib/catalog";
import { t, type Locale } from "@/lib/i18n";
import { effectiveProducts, useStore } from "@/lib/store";

const colourNames = ["Sand", "Olive", "Terracotta", "Ink", "Off-white", "Natural", "Brass", "Black", "Amber glass", "Clear", "Cream", "Rose"];

export function CollectionView({ locale, slug }: { locale: Locale; slug: string }) {
  const d = t(locale);
  const overrides = useStore((s) => s.overrides);
  const cat = categoryBySlug(slug);
  const [sort, setSort] = useState<"newest" | "low" | "high">("newest");
  const [colours, setColours] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [price, setPrice] = useState<[number, number] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const all = useMemo(() => effectiveProducts(overrides).filter((p) => p.status === "active"), [overrides]);
  const base = slug === "all" ? all : slug === "sale" ? all.filter((p) => p.compareAt || p.badge === "limited") : all.filter((p) => p.category === slug);
  const list = base
    .filter((p) => colours.length === 0 || p.colours.some((c) => colours.includes(c.name.en)))
    .filter((p) => !inStock || p.stock > 0)
    .filter((p) => !price || (p.price >= price[0] && p.price < price[1]))
    .sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.createdAt < b.createdAt ? 1 : -1));

  const title = slug === "all" ? d.collection.all : slug === "sale" ? d.nav.sale : cat!.name[locale];
  const blurb = cat?.blurb[locale];
  const colourLabel = (en: string) => { for (const p of all) { const c = p.colours.find((x) => x.name.en === en); if (c) return c.name[locale]; } return en; };
  const prices: [string, [number, number]][] = [["< 100", [0, 100]], ["100 – 300", [100, 300]], ["300 – 1,000", [300, 1000]], ["> 1,000", [1000, 1e9]]];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-16 md:py-12">
      <div className="flex flex-col gap-3">
        <div className="text-xs text-ink-2"><Link href={`/${locale}`}>{d.collection.home}</Link> / {title}</div>
        <h1 className="font-display text-5xl font-light text-ink">{title}</h1>
        {blurb && <p className="max-w-xl text-ink-2">{blurb} <span className="num">{base.length}</span> {d.collection.items}.</p>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Chip active={slug === "all"} href={`/${locale}/collections/all`}>{d.collection.all}</Chip>
            {categories.map((c) => <Chip key={c.slug} active={slug === c.slug} href={`/${locale}/collections/${c.slug}`}>{c.name[locale]}</Chip>)}
            <Chip active={slug === "sale"} href={`/${locale}/collections/sale`}>{d.nav.sale}</Chip>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button className="md:hidden" onClick={() => setShowFilters((v) => !v)}>{d.collection.filters}</button>
            <span className="text-ink-2">{d.collection.sort}:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-sm border border-line bg-surface px-2 py-1 text-sm">
              <option value="newest">{d.collection.newest}</option><option value="low">{d.collection.priceLow}</option><option value="high">{d.collection.priceHigh}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "flex" : "hidden"} flex-col gap-6 md:flex`}>
          <div className="flex flex-col gap-2"><Overline>{d.collection.colour}</Overline>
            {colourNames.map((c) => <Checkbox key={c} on={colours.includes(c)} onChange={(v) => setColours((cs) => (v ? [...cs, c] : cs.filter((x) => x !== c)))} label={colourLabel(c)} />)}
          </div>
          <div className="flex flex-col gap-2"><Overline>{d.collection.price}</Overline>
            {prices.map(([l, r]) => <Checkbox key={l} on={!!price && price[0] === r[0]} onChange={(v) => setPrice(v ? r : null)} label={<span className="num">{l}</span>} />)}
          </div>
          <div className="flex flex-col gap-2"><Overline>{d.collection.availability}</Overline>
            <Checkbox on={inStock} onChange={setInStock} label={d.collection.inStock} />
          </div>
          <div><Button variant="ghost" size="sm" onClick={() => { setColours([]); setInStock(false); setPrice(null); }}>{d.collection.clear}</Button></div>
        </aside>
        <div>
          {list.length === 0 ? <div className="py-20 text-center text-ink-2">{d.collection.empty}</div> : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">{list.map((p, i) => <ProductCard key={p.id} id={p.id} locale={locale} index={i % 6} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
