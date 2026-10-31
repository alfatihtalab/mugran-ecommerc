import { locales } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() { return locales.flatMap((locale) => ["shipping", "returns", "payments", "contact", "about", "privacy", "terms"].map((slug) => ({ locale, slug }))); }

export default async function InfoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const d = t(locale);
  const entry = (d.info as Record<string, string[]>)[slug];
  if (!entry) notFound();
  return (
    <div className="mx-auto max-w-[720px] px-5 py-16 md:px-16">
      <h1 className="font-display text-5xl font-light text-ink">{entry[0]}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">{entry[1]}</p>
    </div>
  );
}
