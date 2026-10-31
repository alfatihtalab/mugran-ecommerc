import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function StoreLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return (
    <>
      <NavBar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <CartDrawer locale={locale} />
    </>
  );
}
