import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SmartImage } from "@/components/SmartImage";
import { Badge, Button } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { categories, editorialImage, heroImage, newest } from "@/lib/catalog";
import { isLocale, t, type Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const d = t(locale);
  return (
    <div className="mx-auto max-w-[1440px]">
      {/* Hero */}
      <section className="grid gap-10 px-5 py-10 md:grid-cols-2 md:items-center md:px-16 md:py-16">
        <div className="flex flex-col items-start gap-6">
          <Badge>{d.home.badge}</Badge>
          <h1 className="font-display text-5xl font-light leading-[1.02] text-ink md:text-7xl">{d.home.title}</h1>
          <p className="max-w-md text-lg text-ink-2">{d.home.sub}</p>
          <div className="flex gap-3">
            <Button href={`/${locale}/collections/all`}>{d.home.shop}</Button>
            <Button href={`/${locale}/collections/all`} variant="secondary">{d.home.browse}</Button>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary-subtle"><SmartImage src={heroImage} alt="Autumn edit" seed="hero" /></div>
      </section>

      {/* Categories */}
      <section className="flex flex-col gap-6 px-5 py-12 md:px-16">
        <Reveal className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl text-ink">{d.home.byCategory}</h2>
          <Link href={`/${locale}/collections/all`} className="text-sm font-medium text-accent">{d.home.allCategories} →</Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}><Link href={`/${locale}/collections/${c.slug}`} className="group lift flex flex-col gap-3">
              <div className="aspect-[3/2] overflow-hidden rounded-md bg-highlight-subtle"><SmartImage src={c.image} alt={c.name[locale]} seed={c.slug} className="transition-transform duration-500 group-hover:scale-[1.03]" /></div>
              <div className="text-sm font-medium text-ink">{c.name[locale]}</div>
            </Link></Reveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="flex flex-col gap-6 px-5 py-12 md:px-16">
        <Reveal className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl text-ink">{d.home.newArrivals}</h2>
          <Link href={`/${locale}/collections/all`} className="text-sm font-medium text-accent">{d.home.viewAll} →</Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {newest(4).map((p, i) => <ProductCard key={p.id} id={p.id} locale={locale} index={i} />)}
        </div>
      </section>

      {/* Editorial band */}
      <section className="bg-inverse text-ink-inv">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-16 md:py-20">
          <Reveal className="flex flex-col items-start gap-6">
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">{d.home.editorialTitle}</h2>
            <p className="max-w-md text-base opacity-90">{d.home.editorialBody}</p>
            <Button href={`/${locale}/info/about`}>{d.home.ourStory}</Button>
          </Reveal>
          <Reveal delay={120} className="aspect-[3/2] overflow-hidden rounded-lg bg-raised"><SmartImage src={editorialImage} alt="Workshop" seed="editorial" /></Reveal>
        </div>
      </section>

      {/* Promises */}
      <section className="grid gap-4 px-5 py-12 md:grid-cols-3 md:gap-6 md:px-16">
        {d.home.promises.map(([h, b], i) => (
          <Reveal key={h} delay={i * 90} className="lift rounded-md border border-line bg-surface p-6">
            <div className="font-display text-2xl text-ink">{h}</div>
            <p className="mt-2 text-sm text-ink-2">{b}</p>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
