import { OrdersView } from "@/components/admin/OrdersView";
import { isLocale, type Locale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; const locale: Locale = isLocale(raw) ? raw : "en"; return <OrdersView locale={locale} />; }
