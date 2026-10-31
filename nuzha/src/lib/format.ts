import type { Locale } from "./i18n";

export const money = (n: number, locale: Locale = "en") =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) +
  (locale === "ar" ? " د.إ" : " AED");

export const num = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const dateFmt = (iso: string, locale: Locale = "en") =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

export const timeFmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export const VAT = 0.05;
export const FREE_SHIPPING_OVER = 300;
export const SHIPPING = { standard: 15, express: 25, pickup: 0 } as const;
export const COD_FEE = 10;
