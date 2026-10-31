import { isLocale, locales, type Locale } from "@/lib/i18n";
import { products } from "@/lib/catalog";
import { ProductEditView } from "@/components/admin/ProductEditView";
export function generateStaticParams() { return locales.flatMap((locale) => products.map((p) => ({ locale, id: p.id }))); }

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale: raw, id } = await params; const locale: Locale = isLocale(raw) ? raw : "en"; return <ProductEditView locale={locale} id={id} />; }
