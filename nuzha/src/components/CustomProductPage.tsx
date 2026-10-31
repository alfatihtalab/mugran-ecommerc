"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductView } from "./ProductView";
import type { Locale } from "@/lib/i18n";

function Inner({ locale }: { locale: Locale }) {
  const id = useSearchParams().get("id") ?? "";
  return <ProductView locale={locale} id={id} />;
}
/** Admin-added products are not known at build time, so this static page resolves the product from ?id= in the browser. */
export function CustomProductPage({ locale }: { locale: Locale }) {
  return <Suspense fallback={<div className="min-h-[50vh]" />}><Inner locale={locale} /></Suspense>;
}
