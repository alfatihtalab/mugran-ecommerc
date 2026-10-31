import { DashboardView } from "@/components/admin/DashboardView";
import { isLocale, type Locale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; const locale: Locale = isLocale(raw) ? raw : "en"; return <DashboardView locale={locale} />; }
