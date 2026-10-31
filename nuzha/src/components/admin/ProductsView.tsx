"use client";
import Link from "next/link";
import { useState } from "react";
import { SmartImage } from "@/components/SmartImage";
import { Badge, Button, Chip } from "@/components/ui";
import { categoryBySlug } from "@/lib/catalog";
import { num } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { effectiveProducts, useStore } from "@/lib/store";

export function ProductsView({ locale }: { locale: Locale }) {
  const overrides = useStore((s) => s.overrides);
  const hydrated = useStore((s) => s.hydrated);
  const [tab, setTab] = useState<"all" | "active" | "draft" | "low" | "out">("all");
  const [q, setQ] = useState("");
  if (!hydrated) return null;
  const all = effectiveProducts(overrides);
  const list = all.filter((p) => tab === "all" || (tab === "active" && p.status === "active") || (tab === "draft" && p.status === "draft") || (tab === "low" && p.stock > 0 && p.stock <= 3) || (tab === "out" && p.stock === 0)).filter((p) => !q || `${p.name.en} ${p.sku}`.toLowerCase().includes(q.toLowerCase()));
  const counts = { all: all.length, active: all.filter((p) => p.status === "active").length, draft: all.filter((p) => p.status === "draft").length, low: all.filter((p) => p.stock > 0 && p.stock <= 3).length, out: all.filter((p) => p.stock === 0).length };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{([["all", "All"], ["active", "Active"], ["draft", "Draft"], ["low", "Low stock"], ["out", "Sold out"]] as const).map(([k, l]) => <Chip key={k} active={tab === k} onClick={() => setTab(k)}>{l} · {counts[k]}</Chip>)}</div>
        <div className="flex gap-2"><Button variant="secondary" size="sm">Import</Button><Button size="sm">Add product</Button></div>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, SKUs…" className="w-full max-w-sm rounded-sm border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-focus" />
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full text-sm"><thead><tr className="bg-muted text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2"><th className="px-4 py-2 text-start">Product</th><th className="px-4 py-2 text-start">SKU</th><th className="px-4 py-2 text-start">Inventory</th><th className="px-4 py-2 text-end">Price</th><th className="px-4 py-2 text-start">Status</th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id} className="border-t border-line">
              <td className="px-4 py-3"><Link href={`/${locale}/admin/products/${p.id}`} className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-highlight-subtle"><SmartImage src={p.images[0]} alt="" seed={p.slug} /></div><div><div className="font-medium text-ink">{p.name.en}</div><div className="text-xs text-ink-2">{categoryBySlug(p.category)?.name.en} · {p.colours.length} colours{p.sizes ? ` · ${p.sizes.length} sizes` : ""}</div></div></Link></td>
              <td className="px-4 py-3 text-ink-2">{p.sku}</td>
              <td className={`num px-4 py-3 ${p.stock === 0 ? "text-ink-2" : p.stock <= 3 ? "text-error" : "text-ink"}`}>{p.stock} Dubai{p.stock === 0 ? " · sold out" : p.stock <= 3 ? " · low" : ""}</td>
              <td className="num px-4 py-3 text-end">{num(p.price)}</td>
              <td className="px-4 py-3"><Badge tone={p.status === "active" ? "secondary" : "neutral"}>{p.status === "active" ? "Active" : "Draft"}</Badge></td>
            </tr>))}</tbody></table>
      </div>
      <div className="text-sm text-ink-2">Showing {list.length} of {all.length}</div>
    </div>
  );
}
