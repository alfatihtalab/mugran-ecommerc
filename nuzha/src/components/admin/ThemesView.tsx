"use client";
import { Panel } from "./common";
import { Badge, Button, Chip } from "@/components/ui";
import { useStore, type ThemeId } from "@/lib/store";

const presets: { id: ThemeId; name: string; sub: string; pal: string[] }[] = [
  { id: "arcade-light", name: "Arcade · light", sub: "Default · Nuzha brand", pal: ["#F4F0E8", "#141A26", "#B4603A", "#7B8A6B", "#C4A15A"] },
  { id: "arcade-dark", name: "Arcade · dark", sub: "Same tokens, dark mode", pal: ["#0B0F18", "#FBF9F5", "#DBA084", "#AFBBA6", "#E0CB94"] },
  { id: "harbour", name: "Harbour", sub: "Coastal · coral on seafoam", pal: ["#E6EEEA", "#0F2B3B", "#DF6E52", "#2F7B78", "#E6D6B4"] },
  { id: "stroll", name: "Stroll", sub: "Airy · apricot on cloud", pal: ["#FBF8F3", "#3B2A24", "#D9834A", "#C5D3B5", "#A9C0D6"] },
];

function Preview({ pal, h = 200 }: { pal: string[]; h?: number }) {
  const [bg, ink, accent, secondary, highlight] = pal;
  return (
    <div className="flex w-full flex-col gap-2 rounded-sm p-3" style={{ background: bg, height: h }}>
      <div className="flex justify-between"><span className="h-1.5 w-9 rounded" style={{ background: ink }} /><span className="h-1.5 w-5 rounded-full" style={{ background: ink }} /></div>
      <div className="flex flex-1 gap-2"><div className="flex flex-1 flex-col gap-1"><span className="h-2 w-3/4 rounded" style={{ background: ink }} /><span className="h-2 w-1/2 rounded" style={{ background: ink }} /><span className="h-1 w-2/5 rounded" style={{ background: ink, opacity: 0.6 }} /><span className="mt-1 h-2 w-7 rounded-full" style={{ background: accent }} /></div><div className="w-2/5 rounded" style={{ background: secondary, opacity: 0.5 }} /></div>
      <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-5 flex-1 rounded" style={{ background: highlight, opacity: 0.5 }} />)}</div>
    </div>
  );
}

export function ThemesView() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const hydrated = useStore((s) => s.hydrated);
  if (!hydrated) return null;
  const cur = presets.find((p) => p.id === theme)!;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-sm text-ink-2">Each store runs one published theme. Presets are starting points; the storefront switches immediately when you pick one here.</p><div className="flex gap-2"><Button variant="secondary" size="sm" href="/en">Preview store</Button><Button size="sm">Publish changes</Button></div></div>
      <div className="grid gap-4 md:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Panel title={<span className="flex items-center gap-3">{cur.name} <Badge tone="secondary">Published</Badge></span>} action={<span className="text-xs text-ink-2">v3 · live on riyadh.nuzha.app</span>}><Preview pal={cur.pal} h={220} /></Panel>
          <Panel title="Presets">
            <div className="grid gap-3 md:grid-cols-4">{presets.map((p) => (
              <button key={p.id} onClick={() => setTheme(p.id)} className={`flex flex-col gap-2 rounded-sm border p-3 text-start ${p.id === theme ? "border-[1.5px] border-accent bg-accent-subtle" : "border-line bg-page"}`}>
                <Preview pal={p.pal} h={96} /><div className="text-sm font-medium text-ink">{p.name}</div><div className="text-xs text-ink-2">{p.sub}</div>
                <div className="flex gap-1">{p.pal.map((c) => <span key={c} className="h-3 w-3 rounded-full border border-line" style={{ background: c }} />)}</div>
                <div className={`text-xs font-medium ${p.id === theme ? "text-accent" : "text-ink-2"}`}>{p.id === theme ? "Active" : "Use preset"}</div>
              </button>))}</div>
          </Panel>
        </div>
        <Panel title={`Customise · ${cur.name}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">Colour tokens</div>
          {[["Accent", "color/accent/default", cur.pal[2]], ["Page background", "color/bg/page", cur.pal[0]], ["Text", "color/text/primary", cur.pal[1]], ["Secondary", "color/secondary/default", cur.pal[3]], ["Highlight", "color/highlight/default", cur.pal[4]]].map(([n, tok, hx]) => (
            <div key={tok} className="flex items-center gap-3 text-sm"><span className="h-7 w-7 rounded-sm border border-line" style={{ background: hx }} /><div className="flex-1"><div className="font-medium text-ink">{n}</div><div className="text-xs text-ink-2">{tok}</div></div><span className="num text-xs text-ink-2">{hx}</span></div>
          ))}
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">Type</div>
          {[["Display (EN)", "Fraunces"], ["UI (EN)", "Figtree"], ["Display (AR)", "Amiri"], ["UI (AR)", "Readex Pro"]].map(([l, v]) => <div key={l} className="flex items-center justify-between text-sm"><span className="text-ink-2">{l}</span><span className="text-ink">{v} ▾</span></div>)}
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2">Layout</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-28 text-ink-2">Product grid</span><Chip>3</Chip><Chip active>4</Chip><Chip>5</Chip></div>
          <div className="flex items-center gap-2 text-sm"><span className="w-28 text-ink-2">Corners</span><Chip>Sharp</Chip><Chip active>Soft</Chip><Chip>Round</Chip></div>
          <div className="flex items-center gap-2 text-sm"><span className="w-28 text-ink-2">Preview</span><Chip href="/en" active>LTR</Chip><Chip href="/ar">RTL</Chip></div>
        </Panel>
      </div>
    </div>
  );
}
