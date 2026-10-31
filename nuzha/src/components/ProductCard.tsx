"use client";
import Link from "next/link";
import { SmartImage } from "./SmartImage";
import { Badge } from "./ui";
import { money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { isCustom, useProduct } from "@/lib/store";
import { Reveal } from "./Reveal";

export function ProductCard({ id, locale, index = 0 }: { id: string; locale: Locale; index?: number }) {
  const p = useProduct(id);
  const d = t(locale);
  if (!p) return null;
  const sold = p.stock <= 0;
  return (
    <Reveal delay={Math.min(index, 7) * 70}><Link href={isCustom(p.id) ? `/${locale}/products/custom/?id=${p.id}` : `/${locale}/products/${p.slug}`} className="group lift flex flex-col gap-3">
      <div className={`relative aspect-square overflow-hidden rounded-md bg-highlight-subtle ${sold ? "opacity-70" : ""}`}>
        <SmartImage src={p.images[0]} alt={p.name[locale]} seed={p.slug} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute start-3 top-3">
          {sold ? <Badge tone="neutral">{d.product.soldOut}</Badge> : p.badge === "limited" ? <Badge tone="highlight">{d.product.limited}</Badge> : p.badge === "new" ? <Badge>{d.product.new}</Badge> : null}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className={`text-sm font-medium ${sold ? "text-ink-2" : "text-ink"}`}>{p.name[locale]}</div>
        <div className="num flex items-baseline gap-2 text-sm text-ink-2">
          <span>{money(p.price, locale)}</span>
          {p.compareAt && <span className="line-through opacity-60">{money(p.compareAt, locale)}</span>}
        </div>
      </div>
    </Link></Reveal>
  );
}
