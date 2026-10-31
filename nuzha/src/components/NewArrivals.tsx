"use client";
import { ProductCard } from "./ProductCard";
import type { Locale } from "@/lib/i18n";
import { effectiveProducts, useStore } from "@/lib/store";

export function NewArrivals({ locale }: { locale: Locale }) {
  const overrides = useStore((s) => s.overrides);
  const custom = useStore((s) => s.customProducts);
  const deleted = useStore((s) => s.deleted);
  const list = effectiveProducts(overrides, custom, deleted).filter((p) => p.status === "active").sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {list.map((p, i) => <ProductCard key={p.id} id={p.id} locale={locale} index={i} />)}
    </div>
  );
}
