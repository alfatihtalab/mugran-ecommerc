import type { Metadata } from "next";
import { Amiri, DM_Sans, Figtree, Fraunces, Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { ThemeApplier } from "@/components/ThemeApplier";
import { dir, isLocale, locales } from "@/lib/i18n";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-fraunces", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-figtree", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
const readex = Readex_Pro({ subsets: ["arabic", "latin"], weight: ["400", "500", "600"], variable: "--font-readex", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm", display: "swap" });

export const metadata: Metadata = { title: "Nuzha · نزهة", description: "Shopping, as a stroll." };

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dir(locale)} className={`${fraunces.variable} ${figtree.variable} ${amiri.variable} ${readex.variable} ${dm.variable} h-full`} data-theme="arcade-light" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-page text-ink">
        <ThemeApplier />
        {children}
      </body>
    </html>
  );
}
