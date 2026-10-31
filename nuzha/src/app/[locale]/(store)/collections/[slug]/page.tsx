import { isLocale, locales, type Locale } from "@/lib/i18n";
import { categories, categoryBySlug } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";

export function generateStaticParams() { return locales.flatMap((locale) => ["all", "sale", ...categories.map((c) => c.slug)].map((slug) => ({ locale, slug }))); }

export default async function CollectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  if (slug !== "all" && slug !== "sale" && !categoryBySlug(slug)) notFound();
  return <CollectionView locale={locale} slug={slug} />;
}
