import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { categoryBySlug } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function CollectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  if (slug !== "all" && slug !== "sale" && !categoryBySlug(slug)) notFound();
  return <CollectionView locale={locale} slug={slug} />;
}
