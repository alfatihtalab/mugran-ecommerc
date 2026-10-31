"use client";
import { KV, Panel } from "./common";
import { Badge, Button, Chip, Input, Toggle } from "@/components/ui";
import { useStore } from "@/lib/store";

export function PaymentsPanel() {
  const settings = useStore((s) => s.settings); const setPayment = useStore((s) => s.setPayment);
  const rows: [keyof typeof settings.payments, string, string][] = [["mada", "Mada", "Via local gateway · settles T+1"], ["card", "Visa / Mastercard", "3-D Secure on · fee 2.4% + 1.00"], ["applepay", "Apple Pay", "Domain verified for nuzha-riyadh.com"], ["cod", "Cash on delivery", "Fee 10.00 · max order 2,000.00"], ["tabby", "Tabby (pay in 4)", "Not connected"]];
  return (
    <Panel title="Payments" action={<Button variant="ghost" size="sm">Configure</Button>}>
      <p className="text-sm text-ink-2">Switching a method off removes it from checkout immediately.</p>
      {rows.map(([k, l, s]) => <div key={k} className="flex items-center gap-4 py-1"><div className="flex-1"><div className="text-sm font-medium text-ink">{l}</div><div className="text-sm text-ink-2">{s}</div></div><Toggle on={settings.payments[k]} onChange={(v) => setPayment(k, v)} /></div>)}
    </Panel>
  );
}

export function ShippingPanel() {
  const settings = useStore((s) => s.settings); const setSettings = useStore((s) => s.setSettings);
  return (
    <Panel title="Shipping zones" action={<Button variant="ghost" size="sm">Add zone</Button>}>
      {[["Saudi Arabia", `Standard 2–3 d · 15.00, free over ${settings.freeShippingOver} · Express 25.00`], ["GCC", "Standard 5–7 d · 60.00 · DHL"], ["Pick up · Nuzha Riyadh", "Free · ready in 2 h"]].map(([z, r]) => <div key={z}><div className="text-sm font-medium text-ink">{z}</div><div className="text-sm text-ink-2">{r}</div></div>)}
      <Input label="Free shipping threshold (SAR)" value={String(settings.freeShippingOver)} onChange={(e) => setSettings({ freeShippingOver: Math.max(0, Number(e.target.value) || 0) })} inputMode="numeric" className="num max-w-xs" helper="Applies to Standard delivery in Saudi Arabia" />
    </Panel>
  );
}

export function SettingsView() {
  const settings = useStore((s) => s.settings); const setSettings = useStore((s) => s.setSettings); const resetAll = useStore((s) => s.resetAll);
  const hydrated = useStore((s) => s.hydrated);
  if (!hydrated) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">{["General", "Locales", "Domains", "Deployment", "Payments", "Shipping", "Taxes", "Staff", "Notifications"].map((t, i) => <Chip key={t} active={i === 1}>{t}</Chip>)}</div>
      <div className="grid gap-4 md:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Panel title="Locales" action={<Button variant="ghost" size="sm">Add locale</Button>}>
            <div className="flex items-center gap-4 py-1"><div className="flex-1"><div className="text-sm font-medium text-ink">English (en)</div><div className="text-sm text-ink-2">Default · LTR · 100% translated</div></div><Badge tone="neutral">Default</Badge><Toggle on onChange={() => {}} /></div>
            <div className="flex items-center gap-4 py-1"><div className="flex-1"><div className="text-sm font-medium text-ink">العربية (ar)</div><div className="text-sm text-ink-2">RTL · 100% translated · hides the language switch when off</div></div><Toggle on={settings.locales.ar} onChange={(v) => setSettings({ locales: { ar: v } })} /></div>
            <div className="grid gap-4 md:grid-cols-3"><Input label="Store name" value={settings.storeName} onChange={(e) => setSettings({ storeName: e.target.value })} /><Input label="Currency" value="SAR · ر.س" readOnly helper="Prices stored in SAR" /><Input label="Time zone" value="Asia/Riyadh" readOnly helper="Used for order timestamps" /></div>
          </Panel>
          <Panel title="Domains" action={<Button variant="ghost" size="sm">Connect domain</Button>}>
            <KV k="riyadh.nuzha.app" v={<Badge tone="secondary">Platform · SSL active</Badge>} /><KV k="nuzha-riyadh.com" v={<Badge tone="secondary">Primary · SSL active</Badge>} /><KV k="www.nuzha-riyadh.com" v={<Badge tone="neutral">Redirects to primary</Badge>} />
          </Panel>
          <PaymentsPanel />
        </div>
        <div className="flex flex-col gap-4">
          <Panel title="Deployment" action={<Badge tone="secondary">Healthy</Badge>}>
            <p className="text-sm text-ink-2">This store runs on its own isolated stack. Nothing is shared with other stores: not the database, not the file storage, not the domain.</p>
            <KV k="Region" v="me-central-1 (Riyadh)" /><KV k="Database" v="Dedicated Postgres · 2.1 GB" /><KV k="Storage" v="Private bucket · 14.8 GB" /><KV k="Platform version" v="v1.4.2" /><KV k="Last deploy" v="2 h ago · 41 s" /><KV k="Backups" v="Nightly · 30-day retention" />
            <div className="flex gap-2"><Button variant="secondary" size="sm">Redeploy</Button><Button variant="ghost" size="sm">View logs</Button></div>
          </Panel>
          <ShippingPanel />
          <Panel title="Returns & refunds"><KV k="Return window" v="30 days" /><KV k="Refund to" v="Original payment method" /><KV k="Restock on refund" v="Ask each time" /><KV k="Return label" v="Customer prints · free" /></Panel>
          <Panel title="Demo data"><p className="text-sm text-ink-2">Everything in this demo is stored in your browser. Reset to the seeded orders, stock and theme.</p><Button variant="secondary" size="sm" onClick={() => { if (confirm("Reset cart, orders, stock and theme to the demo defaults?")) resetAll(); }}>Reset demo data</Button></Panel>
        </div>
      </div>
    </div>
  );
}
