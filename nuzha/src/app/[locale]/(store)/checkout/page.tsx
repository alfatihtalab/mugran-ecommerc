import { CheckoutView } from "@/components/CheckoutView";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return <CheckoutView locale={locale} />;
}
