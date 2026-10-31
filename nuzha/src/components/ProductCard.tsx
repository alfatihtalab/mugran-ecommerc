"use client";
import Link from "next/link";
import { SmartImage } from "./SmartImage";
import { Badge } from "./ui";
import { money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { useProduct } from "@/lib/store";

export function ProductCard({ id, locale }: { id: string; locale: Locale }) {
  const p = useProduct(id);
  const d = t(locale);
  if (!p) return null;
  const sold = p.stock <= 0;
  return (
    <Link href={`/${locale}/products/${p.slug}`} className="group flex flex-col gap-3">
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
    </Link>
  );
}
