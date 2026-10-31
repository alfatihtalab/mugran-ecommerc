"use client";
import Link from "next/link";
import { useState } from "react";
import { Panel } from "./common";
import { SmartImage } from "@/components/SmartImage";
import { Badge, Button, Chip, Input } from "@/components/ui";
import { categoryBySlug } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { isCustom, useProduct, useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function ProductEditView({ locale, id }: { locale: Locale; id: string }) {
  const p = useProduct(id);
  const hydrated = useStore((s) => s.hydrated);
  const setOverride = useStore((s) => s.setOverride);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const router = useRouter();
  const [f, setF] = useState<{ nameEn: string; nameAr: string; price: string; stock: string; status: "active" | "draft" } | null>(null);
  const [saved, setSaved] = useState(false);
  if (!hydrated) return null;
  if (!p) return <div className="text-ink-2">Product not found. <Link href={`/${locale}/admin/products`} className="text-accent">Back</Link></div>;
  const form = f ?? { nameEn: p.name.en, nameAr: p.name.ar, price: String(p.price), stock: String(p.stock), status: p.status };
  const dirty = f !== null && (form.nameEn !== p.name.en || form.nameAr !== p.name.ar || Number(form.price) !== p.price || Number(form.stock) !== p.stock || form.status !== p.status);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...form, [k]: e.target.value });
  const save = () => { setOverride(p.id, { nameEn: form.nameEn, nameAr: form.nameAr, price: Number(form.price), stock: Math.max(0, Math.floor(Number(form.stock))), status: form.status }); setF(null); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><Link href={`/${locale}/admin/products`} className="text-sm text-ink-2">Products /</Link><h2 className="font-display text-3xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{p.name.en}</h2><Badge tone={p.status === "active" ? "secondary" : "neutral"}>{p.status === "active" ? "Active" : "Draft"}</Badge>{dirty && <span className="text-xs font-medium text-accent">Unsaved changes</span>}{saved && <span className="text-xs font-medium text-success">Saved</span>}</div>
        <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { if (confirm(`Remove “${p.name.en}” from the storefront?`)) { deleteProduct(p.id); router.push(`/${locale}/admin/products`); } }}>Delete</Button><Button variant="ghost" size="sm" onClick={() => setF(null)} disabled={!dirty}>Discard</Button><Button variant="secondary" size="sm" href={isCustom(p.id) ? `/${locale}/products/custom/?id=${p.id}` : `/${locale}/products/${p.slug}`}>Preview</Button><Button size="sm" onClick={save} disabled={!dirty}>Save</Button></div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Panel title="Basics"><Input label="Title" value={form.nameEn} onChange={upd("nameEn")} /><Input label="Description" value={p.description.en} readOnly helper="Shown on the product page · edit in the catalogue" /></Panel>
          <Panel title="Media" action={<Button variant="ghost" size="sm">Upload</Button>}><div className="flex gap-3">{p.images.map((src, i) => <div key={i} className="h-24 w-24 overflow-hidden rounded-sm bg-highlight-subtle"><SmartImage src={src} alt="" seed={p.slug + i} /></div>)}<div className="flex h-24 w-24 items-center justify-center rounded-sm border border-line-strong text-ink-2">+</div></div></Panel>
          <Panel title="Pricing"><div className="grid gap-4 md:grid-cols-3"><Input label="Price (AED)" value={form.price} onChange={upd("price")} inputMode="decimal" helper="incl. 5% VAT" className="num" /><Input label="Compare-at price" value={p.compareAt ? String(p.compareAt) : "—"} readOnly helper="Shows a strike-through" className="num" /><Input label="Cost per item" value={(p.price * 0.53).toFixed(2)} readOnly helper={`Margin ${Math.round((1 - 0.53) * 100)}%`} className="num" /></div></Panel>
          <Panel title="Inventory"><div className="grid gap-4 md:grid-cols-3"><Input label="SKU" value={p.sku} readOnly /><Input label="Dubai warehouse" value={form.stock} onChange={upd("stock")} inputMode="numeric" helper="Ships in 1 day" className="num" /><Input label="Abu Dhabi store" value="—" readOnly helper="Pick-up only" /></div></Panel>
          <Panel title="Variants">
            <div className="flex items-center gap-3 text-sm"><span className="w-16 text-ink-2">Colour</span>{p.colours.map((c) => <Chip key={c.hex} active>{c.name.en}</Chip>)}<Chip>+ Add</Chip></div>
            {p.sizes && <div className="flex items-center gap-3 text-sm"><span className="w-16 text-ink-2">Size</span>{p.sizes.map((s) => <Chip key={s} active><span className="num">{s}</span></Chip>)}<Chip>+ Add</Chip></div>}
          </Panel>
          <Panel title="Shipping"><div className="grid gap-4 md:grid-cols-3"><Input label="Weight (kg)" value={String(p.weightKg)} readOnly helper="Used for carrier rates" className="num" /><Input label="Vendor" value={p.vendor} readOnly /><Input label="HS code" value="6301.90" readOnly helper="For GCC customs" className="num" /></div></Panel>
        </div>
        <div className="flex flex-col gap-4">
          <Panel title="Status"><label className="flex flex-col gap-2"><span className="text-xs font-medium text-ink-2">Visibility</span><select value={form.status} onChange={upd("status")} className="rounded-sm border border-line bg-surface px-4 py-3 text-base"><option value="active">Active</option><option value="draft">Draft</option></select><span className="text-sm text-ink-2">{form.status === "active" ? "Live on the storefront" : "Hidden from the storefront"}</span></label></Panel>
          <Panel title="Organisation"><Input label="Category" value={categoryBySlug(p.category)?.name.en ?? ""} readOnly /><Input label="Vendor" value={p.vendor} readOnly /><Input label="Tags" value={`${p.category}, ${p.badge ?? "core"}`} readOnly /></Panel>
          <Panel title="Localisation" action={<Badge tone="secondary">EN ✓ · AR ✓</Badge>}><div dir="rtl" style={{ fontFamily: "var(--font-readex)" }}><Input label="العنوان بالعربية" value={form.nameAr} onChange={upd("nameAr")} helper="يظهر عند اختيار العربية" /><div className="mt-4"><Input label="الوصف بالعربية" value={p.description.ar} readOnly /></div></div></Panel>
        </div>
      </div>
    </div>
  );
}
