import { ProductEditView } from "@/components/admin/ProductEditView";
import { isLocale, type Locale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale: raw, id } = await params; const locale: Locale = isLocale(raw) ? raw : "en"; return <ProductEditView locale={locale} id={id} />; }
