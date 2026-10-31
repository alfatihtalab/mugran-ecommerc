import { isLocale, locales, type Locale } from "@/lib/i18n";
import { bySlug, products } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";

export function generateStaticParams() { return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug }))); }

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const p = bySlug(slug);
  if (!p) notFound();
  return <ProductView locale={locale} id={p.id} />;
}
