import { AdminShell } from "@/components/admin/AdminShell";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return <AdminShell locale={locale}>{children}</AdminShell>;
}
