import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const d = t(locale);
  const shop: [string, string][] = [[d.nav.new, "all"], [d.nav.textiles, "textiles"], [d.nav.ceramics, "ceramics"], [d.nav.wood, "wood"], [d.nav.lighting, "lighting"], [d.nav.beauty, "beauty"], [d.nav.sale, "sale"]];
  return (
    <footer className="bg-inverse text-ink-inv">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 py-12 md:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <div className="font-display text-3xl">{d.brand}</div>
            <div className="text-sm opacity-80">{d.tagline}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">{d.footer.shop}</div>
            {shop.map(([l, s]) => <Link key={s} href={`/${locale}/collections/${s}`} className="text-sm opacity-90 hover:opacity-100">{l}</Link>)}
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">{d.footer.help}</div>
            {d.footer.links.help.map(([s, l]) => <Link key={s} href={`/${locale}/info/${s}`} className="text-sm opacity-90 hover:opacity-100">{l}</Link>)}
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">{d.footer.store}</div>
            {d.footer.links.store.map(([s, l]) => <Link key={s} href={`/${locale}/info/${s}`} className="text-sm opacity-90 hover:opacity-100">{l}</Link>)}
            <Link href={`/${locale}/admin`} className="text-sm opacity-90 hover:opacity-100">{d.nav.admin} →</Link>
          </div>
        </div>
        <div className="h-px w-full bg-ink-inv/20" />
        <div className="flex flex-col justify-between gap-3 text-xs opacity-80 md:flex-row">
          <div>{d.footer.rights}</div>
          <div className="flex gap-6"><span>{d.footer.locale}</span><span>{d.footer.deployment}</span></div>
        </div>
      </div>
    </footer>
  );
}
