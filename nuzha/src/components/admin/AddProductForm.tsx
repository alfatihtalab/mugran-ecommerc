"use client";
import { useState } from "react";
import { Panel } from "./common";
import { Button, Input } from "@/components/ui";
import { categories, type CategorySlug } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";

export function AddProductForm({ onDone }: { onDone: (id: string) => void }) {
  const addProduct = useStore((s) => s.addProduct);
  const [f, setF] = useState({ nameEn: "", nameAr: "", category: "textiles" as CategorySlug, price: "", stock: "10", image: "", descEn: "", descAr: "", colour: "Natural", sizes: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.nameEn.trim()) e.nameEn = "Required";
    if (!(Number(f.price) > 0)) e.price = "Enter a price";
    setErr(e); if (Object.keys(e).length) return;
    const slug = slugify(f.nameEn);
    const image = f.image.trim() || `https://picsum.photos/seed/${slug}/1000/1000`;
    const p = addProduct({
      slug, category: f.category, name: { en: f.nameEn.trim(), ar: f.nameAr.trim() || f.nameEn.trim() },
      description: { en: f.descEn.trim() || "Added from the admin.", ar: f.descAr.trim() || f.descEn.trim() || "أُضيف من لوحة الإدارة." },
      care: { en: "See product details.", ar: "انظر تفاصيل المنتج." },
      price: Math.round(Number(f.price) * 100) / 100, images: [image, image], colours: [{ name: { en: f.colour || "Natural", ar: f.colour || "طبيعي" }, hex: "#C9B48C" }],
      sizes: f.sizes.trim() ? f.sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      stock: Math.max(0, Math.floor(Number(f.stock) || 0)), badge: "new", sku: `NEW-${slug.toUpperCase().slice(0, 8)}`, weightKg: 0.5, vendor: "Nuzha",
    });
    onDone(p.id);
  };
  return (
    <Panel title="Add product" action={<Button variant="ghost" size="sm" onClick={() => onDone("")}>Cancel</Button>}>
      <p className="text-sm text-ink-2">New products appear on the storefront immediately in this browser. Use an image URL from Unsplash or leave it blank for a placeholder photo.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Title (EN)" value={f.nameEn} onChange={set("nameEn")} error={err.nameEn} autoFocus />
        <div dir="rtl" style={{ fontFamily: "var(--font-readex)" }}><Input label="العنوان بالعربية" value={f.nameAr} onChange={set("nameAr")} /></div>
        <label className="flex flex-col gap-2"><span className="text-xs font-medium text-ink-2">Category</span><select value={f.category} onChange={set("category")} className="rounded-sm border border-line bg-surface px-4 py-3 text-base">{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name.en}</option>)}</select></label>
        <Input label="Price (AED)" value={f.price} onChange={set("price")} inputMode="decimal" error={err.price} className="num" placeholder="120.00" />
        <Input label="Stock" value={f.stock} onChange={set("stock")} inputMode="numeric" className="num" />
        <Input label="Image URL" value={f.image} onChange={set("image")} placeholder="https://images.unsplash.com/photo-…" />
        <Input label="Colour name" value={f.colour} onChange={set("colour")} />
        <Input label="Sizes (comma separated)" value={f.sizes} onChange={set("sizes")} placeholder="30 ml, 50 ml" />
        <Input label="Description (EN)" value={f.descEn} onChange={set("descEn")} />
        <div dir="rtl" style={{ fontFamily: "var(--font-readex)" }}><Input label="الوصف بالعربية" value={f.descAr} onChange={set("descAr")} /></div>
      </div>
      <div className="flex gap-2"><Button size="sm" onClick={submit}>Add product</Button><Button variant="ghost" size="sm" onClick={() => onDone("")}>Cancel</Button></div>
    </Panel>
  );
}
