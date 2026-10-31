"use client";
import Link from "next/link";
import { useMemo } from "react";
import { Badge, Button } from "./ui";
import { dateFmt, money } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function statusTone(s: string): "accent" | "secondary" | "highlight" | "neutral" | "error" {
  return s === "paid" ? "secondary" : s === "shipped" || s === "fulfilled" ? "secondary" : s === "cod" ? "highlight" : s.includes("refund") ? "error" : "neutral";
}

export function AccountView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const hydrated = useStore((s) => s.hydrated);
  const all = useStore((s) => s.orders);
  const orders = useMemo(() => all.filter((o) => o.id > 1042), [all]);
  if (!hydrated) return <div className="min-h-[50vh]" />;
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-16">
      <h1 className="font-display text-4xl text-ink">{d.account.title}</h1>
      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-4"><p className="max-w-md text-ink-2">{d.account.empty}</p><Button href={`/${locale}/collections/all`}>{d.cart.continue}</Button></div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-line bg-surface">
          {orders.map((o) => (
            <Link key={o.id} href={`/${locale}/orders/${o.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-5 py-4 last:border-0 hover:bg-raised md:grid-cols-[120px_1fr_140px_120px_80px]">
              <div className="num text-sm font-medium text-ink">#{o.id}</div>
              <div className="text-sm text-ink-2">{dateFmt(o.createdAt, locale)} · <span className="num">{o.items.reduce((n, i) => n + i.qty, 0)}</span> {d.account.items}</div>
              <div><Badge tone={statusTone(o.status)}>{d.status[o.status]}</Badge></div>
              <div className="num text-sm text-ink">{money(o.total, locale)}</div>
              <div className="text-sm text-accent">{d.account.view} →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
