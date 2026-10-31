import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { bySlug } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const p = bySlug(slug);
  if (!p) notFound();
  return <ProductView locale={locale} id={p.id} />;
}
