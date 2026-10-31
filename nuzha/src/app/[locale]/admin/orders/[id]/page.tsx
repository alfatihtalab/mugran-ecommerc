import { locales } from "@/lib/i18n";
import { OrderDetailView } from "@/components/admin/OrderDetailView";
import { isLocale, type Locale } from "@/lib/i18n";
export function generateStaticParams() { return locales.flatMap((locale) => Array.from({ length: 120 }, (_, i) => ({ locale, id: String(1035 + i) }))); }

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale: raw, id } = await params; const locale: Locale = isLocale(raw) ? raw : "en"; return <OrderDetailView locale={locale} id={Number(id)} />; }
