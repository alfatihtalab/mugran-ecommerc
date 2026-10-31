import { AccountView } from "@/components/AccountView";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return <AccountView locale={locale} />;
}
