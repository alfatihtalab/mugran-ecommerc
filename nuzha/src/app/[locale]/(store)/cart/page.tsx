import { CartPageView } from "@/components/CartPageView";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return <CartPageView locale={locale} />;
}
