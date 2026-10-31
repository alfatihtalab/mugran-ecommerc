"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function NavBar({ locale }: { locale: Locale }) {
  const d = t(locale);
  const pathname = usePathname();
  const other: Locale = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}`;
  const count = useStore((s) => (s.hydrated ? s.cart.reduce((n, l) => n + l.qty, 0) : 0));
  const openCart = useStore((s) => s.openCart);
  const arEnabled = useStore((s) => s.settings.locales.ar);
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    [d.nav.new, `/${locale}/collections/all`],
    [d.nav.textiles, `/${locale}/collections/textiles`],
    [d.nav.ceramics, `/${locale}/collections/ceramics`],
    [d.nav.wood, `/${locale}/collections/wood`],
    [d.nav.lighting, `/${locale}/collections/lighting`],
    [d.nav.beauty, `/${locale}/collections/beauty`],
    [d.nav.sale, `/${locale}/collections/sale`],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-16">
        <div className="flex items-center gap-3">
          <button className="flex flex-col gap-1 p-1 md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            <span className="block h-0.5 w-5 bg-ink" /><span className="block h-0.5 w-5 bg-ink" /><span className="block h-0.5 w-3.5 bg-ink" />
          </button>
          <Link href={`/${locale}`} className="font-display text-2xl text-ink">{d.brand}</Link>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <Link key={h} href={h} className="relative text-sm text-ink after:absolute after:-bottom-1 after:start-0 after:h-px after:w-full after:origin-start after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          {(arEnabled || locale === "ar") && (
            <Link href={switchHref} className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs" aria-label="Switch language">
              <span className={locale === "en" ? "font-medium text-ink" : "text-ink-2"}>EN</span>
              <span className="h-3 w-px bg-line-strong/40" />
              <span className={locale === "ar" ? "font-medium text-ink" : "text-ink-2"} style={{ fontFamily: "var(--font-readex)" }}>عربي</span>
            </Link>
          )}
          <Link href={`/${locale}/account`} className="hidden text-sm text-ink md:block">{d.nav.account}</Link>
          <button key={count} onClick={openCart} className={`whitespace-nowrap rounded-full bg-inverse px-4 py-2 text-xs font-medium text-ink-inv ${count > 0 ? "animate-pop" : ""}`}>
            {d.nav.cart} · <span className="num">{count}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-slide-down flex flex-col border-t border-line bg-surface px-5 py-3 md:hidden">
          {links.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-base text-ink">{l}</Link>)}
          <Link href={`/${locale}/account`} onClick={() => setOpen(false)} className="py-3 text-base text-ink">{d.nav.account}</Link>
        </nav>
      )}
    </header>
  );
}
