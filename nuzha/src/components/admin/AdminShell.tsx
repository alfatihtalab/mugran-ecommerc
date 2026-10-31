"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const items = [["Dashboard", ""], ["Orders", "/orders"], ["Products", "/products"], ["Customers", "/customers"], ["Discounts", "/discounts"], ["Shipping", "/shipping"], ["Payments", "/payments"], ["Themes", "/themes"], ["Settings", "/settings"]] as const;

export function AdminShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;
  const rest = pathname.slice(base.length);
  const [open, setOpen] = useState(false);
  const storeName = useStore((s) => s.settings.storeName);
  const title = items.find(([, p]) => (p === "" ? rest === "" : rest.startsWith(p)))?.[0] ?? "Admin";
  const pending = useStore((s) => s.orders.filter((o) => o.status === "paid" || o.status === "cod").length);
  return (
    <div className="flex min-h-screen bg-page" dir="ltr" style={{ fontFamily: "var(--font-figtree)" }}>
      <aside className={`fixed inset-y-0 start-0 z-40 flex w-60 flex-col justify-between border-e border-line bg-surface px-4 py-6 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-8">
          <div className="px-2"><div className="font-display text-2xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>Nuzha</div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">Admin · {storeName.split("·")[1]?.trim() || "Dubai store"}</div></div>
          <nav className="flex flex-col gap-0.5">
            {items.map(([l, p]) => { const active = p === "" ? rest === "" : rest.startsWith(p); return (
              <Link key={l} href={base + p} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium ${active ? "bg-accent-subtle text-accent" : "text-ink hover:bg-muted"}`}>
                <span className={`h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-line"}`} />{l}
                {l === "Orders" && pending > 0 && <span className="num ms-auto rounded-full bg-muted px-2 text-xs text-ink">{pending}</span>}
              </Link>); })}
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-sm border border-line bg-raised p-3"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">Deployment</div><div className="mt-1 text-xs font-medium text-ink">Isolated · dubai.nuzha.app</div><div className="text-xs text-ink-2">Own database · own domain</div></div>
          <Link href={`/${locale}`} className="px-2 text-xs text-ink-2 hover:text-ink">← Back to storefront</Link>
          <div className="flex items-center gap-3 px-2 py-2"><span className="h-7 w-7 rounded-full bg-secondary" /><div><div className="text-xs font-medium text-ink">Alfatih T.</div><div className="text-xs text-ink-2">Owner</div></div></div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-inverse/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="flex flex-col gap-1 md:hidden" aria-label="Menu" onClick={() => setOpen(true)}><span className="block h-0.5 w-5 bg-ink" /><span className="block h-0.5 w-5 bg-ink" /><span className="block h-0.5 w-3.5 bg-ink" /></button>
            <h1 className="font-display text-2xl text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden w-64 rounded-full border border-line bg-page px-4 py-2 text-sm text-ink-2 md:block">Search orders, products, customers…</div>
            <span className="h-8 w-8 rounded-full bg-muted" /><span className="h-8 w-8 rounded-full bg-secondary" />
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
